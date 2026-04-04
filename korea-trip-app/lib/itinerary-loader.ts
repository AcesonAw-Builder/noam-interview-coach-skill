import itineraryData from "@/data/itinerary.json";

export function getItineraryData() {
  return itineraryData.itinerary;
}

export function getDayPlan(date: string) {
  const schedule = itineraryData.itinerary.daily_schedule;
  return schedule.find((day) => day.date === date) ?? null;
}

export function getTodayPlan() {
  const today = new Date().toISOString().split("T")[0];
  return getDayPlan(today);
}

export function getFullItineraryText(): string {
  const data = itineraryData.itinerary;
  const lines: string[] = [
    `Trip: ${data.metadata.title}`,
    `Dates: ${data.metadata.dates}`,
    `Hotel: ${data.metadata.accommodation} — ${data.drive_times_from_hotel.address}`,
    `Transport: ${data.metadata.transportation}`,
    `Weather: ${data.metadata.weather_notes}`,
    "",
    "--- DAILY SCHEDULE ---",
  ];

  for (const day of data.daily_schedule) {
    lines.push(`\n${day.day} — ${day.theme}`);
    lines.push(`Zone: ${day.base_zone}`);
    lines.push(`Route: ${day.drive_route}`);
    if ("estimated_budget" in day) lines.push(`Budget: ${day.estimated_budget}`);
    if ("note" in day && day.note) lines.push(`Note: ${day.note}`);
    if (day.stops) {
      for (const stop of day.stops) {
        lines.push(`  • ${stop.name} (${stop.type})${stop.note ? ` — ${stop.note}` : ""}`);
      }
    }
  }

  lines.push("\n--- DRIVE TIMES FROM HOTEL ---");
  const dt = data.drive_times_from_hotel;
  lines.push(`Jungmun/Sukseongdo: ${dt.jungmun_sukseongdo}`);
  lines.push(`Seogwipo City: ${dt.seogwipo_city}`);
  lines.push(`O'sulloc/Camellia Hill: ${dt.osulloc_camellia_hill}`);
  lines.push(`Udo Island Ferry: ${dt.udo_island_ferry}`);
  lines.push(`Aewol Coast: ${dt.aewol_coast}`);
  lines.push(`Jeju Airport: ${dt.jeju_airport}`);

  lines.push("\n--- EMERGENCY CONTACTS ---");
  const ec = data.emergency_and_key_contacts;
  lines.push(`Hotel (Grand Sumorum): ${ec.the_grand_sumorum}`);
  lines.push(`Jeju Tourism Info: ${ec.jeju_tourism_info}`);
  lines.push(`Police: ${ec.police}`);
  lines.push(`Medical Emergency: ${ec.medical_emergency}`);
  lines.push(`Udo Ferry: ${ec.seongsan_port_udo_ferry}`);

  return lines.join("\n");
}
