import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("https://websocketnotifier.onrender.com");

    socket.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    socket.onmessage = (msg) => {
      try {
        const parsedMessage = JSON.parse(msg.data);
        console.log("Received message", parsedMessage);

        if (parsedMessage.type === "notification") {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            parsedMessage.content,
          ]);
        }
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket Client Disconnected", event);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error", error);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="main">
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
