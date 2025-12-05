// src/components/ChatbotWidget.jsx

import React, { useEffect, useRef, useState } from "react";


const localResponses = {
  greetings: ["Hello! How can I help you today?"],
  default:
    "I can help with symptom assessment and booking. Type 'book' to schedule or click 'Book Appointment'.",
  booking:
    "Your appointment is confirmed. Check your dashboard — I've added the appointment there.",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your AI health assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);

  // scroll to bottom helper
  const scrollToBottom = () => {
    try {
      if (messagesRef.current) {
        // small timeout so layout finishes before scrolling
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight + 200;
      }
    } catch (err) {
      
    }
  };

  // auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail ?? {};
      // message text can be passed as detail.message
      const text = detail.message || localResponses.booking;

      // Add message (bot) but don't force-open unless detail.open === true
      setMessages((prev) => {
        // Avoid exact duplicate consecutive messages
        const last = prev[prev.length - 1];
        if (last && last.sender === "bot" && last.text === text) return prev;
        return [...prev, { sender: "bot", text }];
      });

      // If caller explicitly asks to open the widget, do so:
      if (detail.open) {
        setOpen(true);
      }
      // otherwise remain in whatever open/closed state the user has
    };

    window.addEventListener("appointment-booked", handler);
    return () => window.removeEventListener("appointment-booked", handler);
  }, []);

  // Basic send flow: append user message then bot reply (simulated)
  const send = () => {
    const text = input.trim();
    if (!text) return;

    // add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");

    // processing + reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      if (lower.includes("book") || lower.includes("appointment")) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "I can help book; please use the booking form on the page." },
        ]);
      } else if (lower.includes("hello") || lower.includes("hi")) {
        setMessages((prev) => [...prev, { sender: "bot", text: localResponses.greetings[0] }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: localResponses.default }]);
      }
    }, 700);
  };

  // small keyboard shortcut: Esc closes widget
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="chatbot-container" id="chatbot-container" aria-live="polite">
      {/* Toggle */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        className="chatbot-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="chat-toggle-icon" aria-hidden>🤖</span>
      </button>

      {/* Window */}
      {open && (
        <div className="chatbot-window" role="region" aria-label="Chat window">
          <div className="chatbot-header">
            <div className="chatbot-info">
              <div className="chatbot-avatar" aria-hidden>🤖</div>
              <div>
                <div className="chatbot-name">AI Health Assistant</div>
                <div className="chatbot-status">Online</div>
              </div>
            </div>

            <div className="chatbot-controls">
              <button
                type="button"
                className="chat-minimize"
                title="Minimize"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot-messages" ref={messagesRef} id="chatbot-messages" tabIndex={0}>
            {messages.map((m, idx) => {
              const isBot = m.sender === "bot";
              const rowClass = `chat-message ${isBot ? "chat-bot" : "chat-user"}`;
              return (
                <div key={idx} className={rowClass} style={{ alignItems: "flex-end" }}>
                  {/* left space or avatar */}
                  {!isBot ? <div style={{ flex: 1 }} className="chat-avatar-space" /> : null}

                  <div className="chat-bubble-wrapper">
                    <div className="chat-bubble" style={isBot ? {} : {}}>
                      <p style={{ margin: 0 }}>{m.text}</p>
                    </div>
                    <div className="chat-time" aria-hidden>
                      {/* Optional: show timestamp */}
                    </div>
                  </div>

                  {/* avatar for bot on left; empty spacer for user */}
                  {isBot ? (
                    <div style={{ width: 6 }} />
                  ) : (
                    <div className="chat-avatar-mini" aria-hidden>👤</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="chatbot-input">
            <textarea
              className="chat-input-field"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
            />
            <button
              type="button"
              className="chat-send"
              onClick={send}
              disabled={!input.trim()}
              aria-disabled={!input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
