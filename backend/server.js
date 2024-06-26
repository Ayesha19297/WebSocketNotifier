const express = require("express");
const https = require("http");
const WebSocket = require("ws");

const app = express();

const server = https.createServer(app);

const wsServer = new WebSocket.Server({ server });

wsServer.on("connection", (ws) => {
  console.log("Client connected");

  const welcomeMsg = JSON.stringify({
    type: "welcome",
    content: "Hello! Greetings from server.",
  });
  ws.send(welcomeMsg);

  ws.on("message", (message) => {
    try {
      const parsedMsg = JSON.parse(message);
      console.log(`Received message: ${parsedMsg.type} - ${parsedMsg.content}`);
    } catch (e) {
      console.error("Error parsing message", e);
    }
  });
});

app.get("/send-notification", (req, res) => {
  const notificationMsg = JSON.stringify({
    type: "notification",
    content: "Welcome to GenZ Technologies...!",
  });

  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(notificationMsg);
    }
  });

  res.send("Notification sent!");
});

server.listen(8080, () => {
  console.log("Server is active on port 8080");
});
