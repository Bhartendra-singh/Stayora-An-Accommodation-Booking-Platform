import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const SUGGESTED_QUESTIONS = [
  "Which room is best for a honeymoon?",
  "Do you have rooms with pool access?",
  "What's your cheapest room?",
  "Which hotel is in Mumbai?",
];

export default function AiConcierge() {
  const { rooms, offers, currency } = useAppContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm your WanderLust AI Concierge. I can help you find the perfect room, answer questions about amenities, pricing, or anything about our hotels. What can I do for you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMsg, setStreamingMsg] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMsg]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const buildContext = () => {
    const roomSummary = rooms.slice(0, 15).map((r) => ({
      id: r._id,
      hotel: r.hotel?.name,
      city: r.hotel?.city,
      address: r.hotel?.address,
      roomType: r.roomType,
      price: r.pricePerNight,
      amenities: r.amenities,
      available: r.isAvailable,
    }));

    const offerSummary = offers.slice(0, 5).map((o) => ({
      title: o.title,
      description: o.description,
      discount: o.priceOff + "% off",
      expiry: o.expiryDate,
    }));

    return `You are a helpful and warm AI concierge for WanderLust, a premium hotel booking platform.

AVAILABLE ROOMS:
${JSON.stringify(roomSummary, null, 2)}

CURRENT OFFERS:
${JSON.stringify(offerSummary, null, 2)}

INSTRUCTIONS:
- Answer questions about rooms, hotels, pricing, amenities, and bookings
- Be concise, warm, and helpful. Use 1-3 sentences max per response unless a detailed answer is needed
- If recommending rooms, mention the hotel name, room type, and price (${currency})
- If asked about something outside this data, politely say you can only help with WanderLust bookings
- Never make up room data — only reference rooms in the list above
- Use occasional emojis to feel friendly but not overwhelming`;
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setStreamingMsg("");

    // Build API messages (skip first assistant greeting for API, add as system context)
    const apiMessages = newMessages
      .filter((_, i) => i > 0) // skip initial greeting
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      // const response = await fetch("https://api.anthropic.com/v1/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     model: "claude-sonnet-4-20250514",
      //     max_tokens: 400,
      //     stream: true,
      //     system: buildContext(),
      //     messages: apiMessages,
      //   }),
      // });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: buildContext(),
        messages: apiMessages,
        max_tokens: 400,
      }),
    });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";

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
                fullReply += parsed.delta?.text || "";
                setStreamingMsg(fullReply);
              }
            } catch {}
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullReply },
      ]);
      setStreamingMsg("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
        aria-label="Open AI Concierge"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="9" cy="10" r="1" fill="currentColor"/>
            <circle cx="12" cy="10" r="1" fill="currentColor"/>
            <circle cx="15" cy="10" r="1" fill="currentColor"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-primary px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              ✨
            </div>
            <div>
              <p className="text-white font-semibold text-sm">WanderLust AI</p>
              <p className="text-white/70 text-xs">Your personal travel concierge</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full"/>
              <span className="text-white/70 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                    ✨
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streamingMsg && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                  ✨
                </div>
                <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white text-gray-700 shadow-sm border border-gray-100">
                  {streamingMsg}
                  <span className="inline-block w-1 h-3.5 bg-primary ml-0.5 animate-pulse rounded-sm"/>
                </div>
              </div>
            )}

            {/* Loading dots */}
            {loading && !streamingMsg && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">
                  ✨
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggested questions (only at start) */}
            {messages.length === 1 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2 ml-8">Try asking:</p>
                <div className="flex flex-wrap gap-2 ml-8">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-primary/50 hover:text-primary transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about rooms..."
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition max-h-24"
              style={{ lineHeight: "1.4" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-primary disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
