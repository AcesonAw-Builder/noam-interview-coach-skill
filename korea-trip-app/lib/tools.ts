import type Groq from "groq-sdk";
import { getDayPlan, getItineraryData } from "./itinerary-loader";
import { buildGoogleMapsDirections, buildKakaoMapsTransit, buildNaverMapsDirections, buildNaverMapsSearch, buildPapagoLinks } from "./papago";
import packingData from "@/data/packing-list.json";

export type ToolResult =
  | { type: "itinerary_day"; data: ReturnType<typeof getDayPlan> }
  | { type: "packing_list"; data: typeof packingData.packing_list }
  | { type: "directions"; from: string; to: string; mode: "driving" | "transit"; naverUrl: string; kakaoUrl?: string; googleUrl: string }
  | { type: "nearby_search"; location: string; category: string; naverUrl: string }
  | { type: "translation"; text: string; deepLink: string; webUrl: string }
  | { type: "emergency_contacts"; data: ReturnType<typeof getItineraryData>["emergency_and_key_contacts"] };

export const tools: Groq.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_itinerary_day",
      description: "Get the itinerary plan for a specific date. Use this when user asks about their schedule, what they're doing on a particular day, or today's plan.",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "Date in YYYY-MM-DD format, e.g. '2026-04-06'",
          },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_packing_list",
      description: "Get the full packing list for the trip. Use when user asks what to pack or wants to check their packing list.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_directions",
      description: "Get a directions link for driving or transit. Use this when the user asks how to get somewhere. In Jeju use driving mode. In Seoul use transit mode.",
      parameters: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Starting location, e.g. 'The Grand Sumorum hotel, Seogwipo' or 'Seongsan Ilchulbong'",
          },
          to: {
            type: "string",
            description: "Destination, e.g. 'O\\'sulloc Tea Museum, Jeju'",
          },
          mode: {
            type: "string",
            enum: ["driving", "transit"],
            description: "Use 'driving' for Jeju (rental car). Use 'transit' for Seoul (metro).",
          },
        },
        required: ["from", "to", "mode"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_nearby",
      description: "Search for nearby places on Naver Maps. Use when user asks to find restaurants, cafes, gas stations, pharmacies, or attractions near a location.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Area to search near, e.g. 'Jungmun, Jeju'",
          },
          category: {
            type: "string",
            enum: ["restaurant", "cafe", "gas_station", "convenience_store", "pharmacy", "attraction"],
            description: "Type of place to search for",
          },
        },
        required: ["location", "category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "translate_to_korean",
      description: "Generate a Papago translation link for English text to Korean. Use when user wants to say something in Korean or needs to communicate with locals.",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The English text to translate to Korean",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_emergency_contacts",
      description: "Get emergency contacts and important phone numbers for the trip.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];

export function executeTool(name: string, args: Record<string, string>): ToolResult {
  switch (name) {
    case "get_itinerary_day": {
      const day = getDayPlan(args.date);
      return { type: "itinerary_day", data: day };
    }

    case "get_packing_list": {
      return { type: "packing_list", data: packingData.packing_list };
    }

    case "get_directions": {
      const mode = (args.mode as "driving" | "transit") ?? "driving";
      const naverUrl = buildNaverMapsDirections(args.from, args.to);
      const googleUrl = buildGoogleMapsDirections(args.from, args.to, mode);
      const kakaoUrl = mode === "transit" ? buildKakaoMapsTransit(args.from, args.to) : undefined;
      return { type: "directions", from: args.from, to: args.to, mode, naverUrl, kakaoUrl, googleUrl };
    }

    case "search_nearby": {
      const query = `${args.category} near ${args.location}`;
      const naverUrl = buildNaverMapsSearch(query);
      return { type: "nearby_search", location: args.location, category: args.category, naverUrl };
    }

    case "translate_to_korean": {
      const { deepLink, webUrl } = buildPapagoLinks(args.text);
      return { type: "translation", text: args.text, deepLink, webUrl };
    }

    case "get_emergency_contacts": {
      const data = getItineraryData().emergency_and_key_contacts;
      return { type: "emergency_contacts", data };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export function toolResultToString(result: ToolResult): string {
  return JSON.stringify(result);
}
