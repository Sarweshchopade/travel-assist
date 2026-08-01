import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Compass size={36} className="text-marigold mb-4" />
      <h1 className="font-display text-3xl text-paper mb-2">Off the map</h1>
      <p className="text-mist mb-6">This page doesn't exist in our itinerary.</p>
      <Link to="/" className="bg-marigold text-ink font-semibold px-5 py-2.5 rounded-full">
        Back home
      </Link>
    </div>
  );
}
