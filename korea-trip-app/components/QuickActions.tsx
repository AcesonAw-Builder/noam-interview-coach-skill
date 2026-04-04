"use client";

const actions = [
  { label: "Today's plan", prompt: "What's my plan for today?" },
  { label: "Directions", prompt: "How do I get to my next stop?" },
  { label: "Find food", prompt: "Find a restaurant near where I am" },
  { label: "Translate", prompt: "How do I say 'Table for two please' in Korean?" },
  { label: "Packing list", prompt: "Show me my packing list" },
  { label: "Emergency", prompt: "Show me all emergency contacts" },
];

export default function QuickActions({ onAction }: { onAction: (prompt: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {actions.map(({ label, prompt }) => (
        <button
          key={label}
          onClick={() => onAction(prompt)}
          className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
