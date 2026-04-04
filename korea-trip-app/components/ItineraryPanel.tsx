"use client";

import { useState } from "react";
import itineraryData from "@/data/itinerary.json";

function getTodayPlan() {
  const today = new Date().toISOString().split("T")[0];
  return itineraryData.itinerary.daily_schedule.find((d) => d.date === today) ?? null;
}

export default function ItineraryPanel() {
  const [open, setOpen] = useState(false);
  const today = getTodayPlan();

  if (!today) return null;

  return (
    <div className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">TODAY</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{today.theme}</p>
        </div>
        <span className="text-gray-400 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800">
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Route:</span> {today.drive_route}
          </p>
          {"estimated_budget" in today && today.estimated_budget && (
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Budget:</span> {today.estimated_budget}
            </p>
          )}
          {"note" in today && today.note && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              ⚠️ {today.note}
            </p>
          )}
          {today.stops && (
            <div className="space-y-2">
              {today.stops.map((stop, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{stop.name}</p>
                    {stop.note && <p className="text-xs text-gray-500 dark:text-gray-400">{stop.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
