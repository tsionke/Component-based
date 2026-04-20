import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import "../styles/AIChat.css";

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you with waste collection today?",
      isBot: true,
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = input.trim();
    setInput("");

    // Simulate bot reply (Replace this later with real AI API call)
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        text: "Thank you for your message! I'm here to help with waste pickup requests, scheduling, tracking, or any sustainability questions in Addis Ababa.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-page">
      {/* Header */}
      <div className="chat-header">
        <Link to="/home" className="back-btn">
          <ArrowLeft size={24} />
        </Link>
        <div className="chat-title">AI Chat Support</div>
        <div className="chat-subtitle">Kuralewo Assistant</div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isBot ? "bot-message" : "user-message"}`}
          >
            {msg.isBot && <div className="bot-avatar">♻️</div>}

            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Always visible */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="chat-input"
            autoFocus
          />
          <button className="send-btn" onClick={sendMessage}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
