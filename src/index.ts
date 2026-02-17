import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { mcpServer } from "./server";

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.json()); // Removed to avoid stream reading conflict with MCP SDK

// Store the active transport for single-client dev mode
let transport: SSEServerTransport | null = null;

app.get("/sse", async (req, res) => {
  console.log("New SSE connection");
  transport = new SSEServerTransport("/messages", res);
  await mcpServer.connect(transport);
});

app.post("/sse", async (req, res) => {
  console.log("Received POST on /sse - likely client fallback");
  // If the client is posting to /sse, it might be ignoring the endpoint event or missed it.
  // We can try to handle it here if we have a transport.
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).send("No active transport");
  }
});

app.post("/messages", async (req, res) => {
  console.log("Received message on /messages");
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    console.log("No active transport for message");
    res.status(404).send("No active transport");
  }
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/sse`);
});
