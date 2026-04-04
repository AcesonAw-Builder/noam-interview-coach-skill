import { NextRequest } from "next/server";
import { getGroqClient, MODEL } from "@/lib/groq";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { executeTool, toolResultToString, tools } from "@/lib/tools";
import type Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY not configured. Add it to your .env.local file." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const groq = getGroqClient();
  const systemPrompt = buildSystemPrompt();
  const allMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let continueLoop = true;

        while (continueLoop) {
          const response = await groq.chat.completions.create({
            model: MODEL,
            messages: allMessages,
            tools,
            tool_choice: "auto",
            stream: true,
            max_tokens: 1024,
          });

          let assistantContent = "";
          const toolCallsMap: Record<string, { id: string; name: string; arguments: string }> = {};
          let finishReason = "";

          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta;
            finishReason = chunk.choices[0]?.finish_reason ?? finishReason;

            if (delta?.content) {
              assistantContent += delta.content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: delta.content })}\n\n`));
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index;
                if (!toolCallsMap[idx]) {
                  toolCallsMap[idx] = { id: tc.id ?? "", name: tc.function?.name ?? "", arguments: "" };
                }
                if (tc.id) toolCallsMap[idx].id = tc.id;
                if (tc.function?.name) toolCallsMap[idx].name = tc.function.name;
                if (tc.function?.arguments) toolCallsMap[idx].arguments += tc.function.arguments;
              }
            }
          }

          const toolCalls = Object.values(toolCallsMap);

          if (finishReason === "tool_calls" && toolCalls.length > 0) {
            // Add assistant message with tool calls
            allMessages.push({
              role: "assistant",
              content: assistantContent || null,
              tool_calls: toolCalls.map((tc) => ({
                id: tc.id,
                type: "function" as const,
                function: { name: tc.name, arguments: tc.arguments },
              })),
            });

            // Execute each tool and add results
            for (const tc of toolCalls) {
              let toolResult: string;
              try {
                const args = JSON.parse(tc.arguments || "{}");
                const result = executeTool(tc.name, args);

                // Stream tool result to client for UI rendering
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "tool_result", tool: tc.name, result })}\n\n`));

                toolResult = toolResultToString(result);
              } catch (e) {
                toolResult = JSON.stringify({ error: String(e) });
              }

              allMessages.push({
                role: "tool",
                tool_call_id: tc.id,
                content: toolResult,
              });
            }
            // Continue the loop to get the final response
          } else {
            // No more tool calls — done
            continueLoop = false;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
