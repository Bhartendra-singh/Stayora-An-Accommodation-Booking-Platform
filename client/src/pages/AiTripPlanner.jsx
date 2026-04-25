import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const TRIP_TYPES = [
  { label: "Honeymoon 💑", value: "honeymoon" },
  { label: "Family Trip 👨‍👩‍👧‍👦", value: "family" },
  { label: "Business 💼", value: "business" },
  { label: "Solo Travel 🎒", value: "solo" },
  { label: "Friends Trip 🎉", value: "friends" },
  { label: "Adventure 🏔️", value: "adventure" },
];

const AMENITY_PREFERENCES = [
  "Free Wifi",
  "Free Breakfast",
  "Pool Access",
  "Room Service",
  "Mountain View",
];

export default function AiTripPlanner() {
  const { rooms, currency } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=form, 2=results
  const [loading, setLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [recommendedRooms, setRecommendedRooms] = useState([]);
  const [itinerary, setItinerary] = useState("");

  const [form, setForm] = useState({
    destination: "",
    tripType: "",
    guests: 2,
    nights: 3,
    budget: "",
    amenities: [],
    checkIn: "",
    specialRequests: "",
  });

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tripType) return alert("Please select a trip type");

    setLoading(true);
    setStep(2);
    setStreamedText("");
    setItinerary("");

    // Filter rooms matching destination + budget
    const budgetNum = Number(form.budget);
    const matched = rooms.filter((room) => {
      const cityMatch = form.destination
        ? room?.hotel?.city?.toLowerCase().includes(form.destination.toLowerCase())
        : true;
      const budgetMatch = budgetNum ? room.pricePerNight <= budgetNum : true;
      const amenityMatch =
        form.amenities.length === 0 ||
        form.amenities.some((a) => room.amenities?.includes(a));
      return cityMatch && budgetMatch && amenityMatch;
    });

    // Prepare room context for AI
    const roomContext = matched.slice(0, 10).map((r) => ({
      id: r._id,
      hotelName: r.hotel?.name,
      city: r.hotel?.city,
      roomType: r.roomType,
      price: r.pricePerNight,
      amenities: r.amenities,
    }));

    const prompt = `You are WanderLust AI, a luxury travel concierge. A guest needs help planning a trip.

TRIP DETAILS:
- Destination: ${form.destination || "flexible"}
- Trip type: ${form.tripType}
- Guests: ${form.guests}
- Nights: ${form.nights}
- Budget per night: ${form.budget ? currency + form.budget : "flexible"}
- Preferred amenities: ${form.amenities.join(", ") || "no preference"}
- Check-in date: ${form.checkIn || "flexible"}
- Special requests: ${form.specialRequests || "none"}

AVAILABLE ROOMS IN OUR SYSTEM:
${JSON.stringify(roomContext, null, 2)}

YOUR TASK:
1. Recommend the TOP 3 best rooms from the available list above (use the room IDs). Explain WHY each room suits this specific trip. Be personal and warm.
2. Write a beautiful ${form.nights}-day itinerary for ${form.destination || "the destination"} — include morning/afternoon/evening activities, local food suggestions, hidden gems. Make it feel exciting and tailored to a ${form.tripType} trip.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🏨 Your Perfect Rooms

**ROOM_RECOMMENDATIONS:**
[list the top 3 room IDs as a JSON array like: ["id1","id2","id3"]]

For each room, write 2-3 sentences about why it's perfect for this trip.

## 🗺️ Your ${form.nights}-Day Itinerary

Write the itinerary here day by day.`;

    try {
      // const response = await fetch("https://api.anthropic.com/v1/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     model: "claude-sonnet-4-20250514",
      //     max_tokens: 1500,
      //     stream: true,
      //     messages: [{ role: "user", content: prompt }],
      //   }),
      // });
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      }),
    });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta") {
                const text = parsed.delta?.text || "";
                fullText += text;
                setStreamedText(fullText);
              }
            } catch {}
          }
        }
      }

      // Extract recommended room IDs from response
      const match = fullText.match(/\[["']([a-f0-9]{24})["'](?:,\s*["']([a-f0-9]{24})["'])*\]/);
      if (match) {
        const ids = JSON.parse(match[0]);
        const recRooms = ids
          .map((id) => rooms.find((r) => r._id === id))
          .filter(Boolean);
        setRecommendedRooms(recRooms);
      }

      setItinerary(fullText);
    } catch (err) {
      setStreamedText("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatItinerary = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-2xl font-playfair font-bold text-gray-800 mt-8 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-semibold text-gray-700 mt-4 mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="ml-4 text-gray-600 mb-1">
            {line.slice(2)}
          </li>
        );
      }
      if (line.includes("ROOM_RECOMMENDATIONS:")) return null;
      if (line.match(/^\[["']/)) return null; // skip raw JSON
      if (!line.trim()) return <br key={i} />;
      return (
        <p key={i} className="text-gray-600 leading-relaxed mb-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-28 pb-20 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          ✨ Powered by AI
        </span>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          AI Trip Planner
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-base">
          Tell us about your dream trip. Our AI will recommend the perfect rooms
          from our collection and build a personalised itinerary — just for you.
        </p>
      </div>

      {step === 1 && (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              📍 Where do you want to go?
            </label>
            <input
              type="text"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="e.g. Goa, Mumbai, Delhi..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition"
            />
          </div>

          {/* Trip Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 What kind of trip is this?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, tripType: t.value })}
                  className={`py-2.5 px-2 text-sm rounded-lg border transition cursor-pointer ${
                    form.tripType === t.value
                      ? "bg-primary text-white border-primary"
                      : "border-gray-200 text-gray-600 hover:border-primary/50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guests + Nights */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                👥 Guests
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                🌙 Number of nights
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={form.nights}
                onChange={(e) => setForm({ ...form, nights: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Budget + CheckIn */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                💰 Max budget per night ({currency})
              </label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g. 3000"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                📅 Check-in date
              </label>
              <input
                type="date"
                value={form.checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏊 Must-have amenities (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_PREFERENCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition cursor-pointer ${
                    form.amenities.includes(a)
                      ? "bg-primary text-white border-primary"
                      : "border-gray-200 text-gray-500 hover:border-primary/50"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              💬 Any special requests or notes?
            </label>
            <textarea
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              placeholder="e.g. anniversary trip, vegetarian food, ground floor room..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-medium text-base transition active:scale-95 cursor-pointer"
          >
            ✨ Generate My Trip Plan
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => { setStep(1); setRecommendedRooms([]); setStreamedText(""); }}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition cursor-pointer"
          >
            ← Back to planner
          </button>

          {/* Loading pulse */}
          {loading && (
            <div className="flex items-center gap-3 mb-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-sm text-blue-700">
                AI is crafting your perfect itinerary...
              </p>
            </div>
          )}

          {/* Recommended Rooms */}
          {recommendedRooms.length > 0 && (
            <div className="mb-8">
              <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
                🏨 Recommended Rooms For You
              </h2>
              <div className="grid gap-4">
                {recommendedRooms.map((room) => (
                  <div
                    key={room._id}
                    className="flex gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                  >
                    <img
                      src={room.images?.[0]}
                      alt={room.hotel?.name}
                      className="w-28 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {room.hotel?.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        {room.roomType} · {room.hotel?.city}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {room.amenities?.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-primary font-bold text-sm">
                          {currency}{room.pricePerNight}/night
                        </p>
                        <button
                          onClick={() => {
                            navigate(`/rooms/${room._id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition cursor-pointer"
                        >
                          Book Now →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary Text */}
          {streamedText && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="prose max-w-none">{formatItinerary(streamedText)}</div>
            </div>
          )}

          {!loading && streamedText && (
            <div className="mt-6 text-center">
              <button
                onClick={() => { setStep(1); setRecommendedRooms([]); setStreamedText(""); }}
                className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-xl hover:bg-primary/5 transition cursor-pointer"
              >
                🔄 Plan another trip
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
