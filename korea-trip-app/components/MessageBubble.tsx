"use client";

import type { ToolResult } from "@/lib/tools";

export interface Message {
  role: "user" | "assistant";
  content: string;
  toolResults?: ToolResult[];
}

function DirectionsCard({ result }: { result: Extract<ToolResult, { type: "directions" }> }) {
  return (
    <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950">
      <p className="mb-2 font-medium text-blue-900 dark:text-blue-100">
        {result.mode === "driving" ? "🚗" : "🚇"} {result.from} → {result.to}
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={result.naverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Open in Naver Maps
        </a>
        {result.kakaoUrl && (
          <a
            href={result.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-black"
          >
            Open in Kakao Maps
          </a>
        )}
        <a
          href={result.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-300"
        >
          Google Maps
        </a>
      </div>
    </div>
  );
}

function TranslationCard({ result }: { result: Extract<ToolResult, { type: "translation" }> }) {
  return (
    <div className="mt-2 rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm dark:border-purple-800 dark:bg-purple-950">
      <p className="mb-1 text-xs text-purple-600 dark:text-purple-400">Translate: &ldquo;{result.text}&rdquo;</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={result.deepLink}
          className="rounded-lg bg-[#03C75A] px-3 py-1.5 text-xs font-semibold text-white"
        >
          Open in Papago
        </a>
        <a
          href={result.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-300"
        >
          Papago Web
        </a>
      </div>
    </div>
  );
}

function NearbySearchCard({ result }: { result: Extract<ToolResult, { type: "nearby_search" }> }) {
  const categoryEmoji: Record<string, string> = {
    restaurant: "🍽️",
    cafe: "☕",
    gas_station: "⛽",
    convenience_store: "🏪",
    pharmacy: "💊",
    attraction: "📍",
  };
  return (
    <div className="mt-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950">
      <p className="mb-2 font-medium text-green-900 dark:text-green-100">
        {categoryEmoji[result.category] ?? "📍"} {result.category} near {result.location}
      </p>
      <a
        href={result.naverUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white"
      >
        Search on Naver Maps
      </a>
    </div>
  );
}

function EmergencyCard({ result }: { result: Extract<ToolResult, { type: "emergency_contacts" }> }) {
  const contacts = [
    { label: "Grand Sumorum Hotel", value: result.data.the_grand_sumorum },
    { label: "Jeju Tourism Info", value: result.data.jeju_tourism_info },
    { label: "Police", value: result.data.police },
    { label: "Medical Emergency", value: result.data.medical_emergency },
    { label: "Udo Ferry", value: result.data.seongsan_port_udo_ferry },
  ];
  return (
    <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950">
      <p className="mb-2 font-semibold text-red-900 dark:text-red-100">📞 Emergency Contacts</p>
      <div className="space-y-1">
        {contacts.map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-red-700 dark:text-red-300">{label}</span>
            <a href={`tel:${value}`} className="font-mono font-semibold text-red-900 dark:text-red-100">
              {value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolResultCard({ result }: { result: ToolResult }) {
  switch (result.type) {
    case "directions":
      return <DirectionsCard result={result} />;
    case "translation":
      return <TranslationCard result={result} />;
    case "nearby_search":
      return <NearbySearchCard result={result} />;
    case "emergency_contacts":
      return <EmergencyCard result={result} />;
    default:
      return null;
  }
}

function formatText(text: string) {
  // Convert **bold** to <strong> and *item* bullet points
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const formatted = parts.map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part));
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "order-2" : "order-1"}`}>
        {!isUser && (
          <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Mochi</p>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-blue-600 text-white"
              : "rounded-tl-sm bg-white text-gray-900 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
          }`}
        >
          {message.content ? formatText(message.content) : null}
        </div>
        {message.toolResults && message.toolResults.length > 0 && (
          <div className="mt-1">
            {message.toolResults.map((result, i) => (
              <ToolResultCard key={i} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
