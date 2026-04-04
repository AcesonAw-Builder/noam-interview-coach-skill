import ItineraryPanel from "@/components/ItineraryPanel";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <ItineraryPanel />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
