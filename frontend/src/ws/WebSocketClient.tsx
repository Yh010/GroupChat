import { useEffect, useRef, useState } from "react";

const WebSocketClient: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("Connected to Group chat server");
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessage) => [...prevMessage, event.data]);
    };
    socketRef.current.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && socketRef.current) {
      socketRef.current.send(input);
      setInput("");
    }
  };
  return (
    <div>
      <h1>WebSocket Client</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketClient;
