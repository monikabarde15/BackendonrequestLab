import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [ticketMessage, setTicketMessage] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [open, setOpen] = useState(false); // chatbot open/close toggle
  const messagesEndRef = useRef(null);
  const lastAdminMsgIdRef = useRef(null);

  const userId = getCookie("user_id");
  const apiToken = getCookie("access");

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  const fetchMessages = async (silent = false) => {
    if (!userId) return;
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(
        `https://backend.onrequestlab.com/api/v1/support/chats/messages/?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );
      const data = res.data || [];
      setMessages(data);

      // detect new admin message
      const adminMessages = data.filter((m) => m.sender !== "user");
      if (adminMessages.length) {
        const latestAdmin = adminMessages.reduce((a, b) =>
          new Date(a.timestamp || a.created_at) >
          new Date(b.timestamp || b.created_at)
            ? a
            : b
        );
        if (latestAdmin.id !== lastAdminMsgIdRef.current) {
          lastAdminMsgIdRef.current = latestAdmin.id;
          setTicketMessage(latestAdmin.message);
          setShowTicket(true);
          new Audio("/ticketSound.mp3").play();
          setTimeout(() => setShowTicket(false), 6000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await axios.post(
        "https://backend.onrequestlab.com/api/v1/support/chats/messages/",
        { user_id: userId, message: input, attachments: [] },
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );
      setInput("");
      fetchMessages(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(true), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "white",
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1001,
          transition: "transform 0.2s ease",
        }}
        title="Chat with Support"
      >
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 360,
            height: 480,
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 16px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Support Chat
            <span
              onClick={() => setOpen(false)}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 18,
                color: "#fff",
              }}
            >
              ✕
            </span>
          </div>

          {/* Chat body */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              background: "#f8fafc",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", marginTop: 20 }}>Loading...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#9ca3af", marginTop: 20 }}>
                👋 Hi there! How can we help you today?
              </div>
            ) : (
              messages.map((msg, i) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id || i}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      margin: "8px 0",
                    }}
                  >
                    <div
                      style={{
                        background: isUser ? "#2563eb" : "#e2e8f0",
                        color: isUser ? "#fff" : "#0f172a",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        maxWidth: "75%",
                        fontSize: "0.95rem",
                        boxShadow: "0 1px 2px #d1d5db",
                      }}
                    >
                      <div>{msg.message}</div>
                      <div
                        style={{
                          fontSize: "10px",
                          opacity: 0.8,
                          marginTop: 4,
                          textAlign: "right",
                        }}
                      >
                        {isUser ? "You" : "Admin"} •{" "}
                        {new Date(
                          msg.timestamp || msg.created_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              padding: 10,
              display: "flex",
              alignItems: "center",
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              disabled={sending}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !sending && sendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                outline: "none",
                fontSize: "0.95rem",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              style={{
                marginLeft: 8,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Ticket popup */}
      {showTicket && !open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 100,
            background: "#2563eb",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 12,
            zIndex: 1000,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={() => {
            setOpen(true);
            setShowTicket(false);
          }}
        >
          <strong>New Message:</strong> {ticketMessage}
        </div>
      )}
    </>
  );
};

export default MessagesList;
