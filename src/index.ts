import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { mcpServer } from "./server.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Store the active transport for single-client dev mode
let transport: SSEServerTransport | null = null;

app.get("/sse", async (req, res) => {
  console.log("New SSE connection");
  transport = new SSEServerTransport("/messages", res);
  await mcpServer.connect(transport);
});

app.post("/messages", async (req, res) => {
  console.log("Received message on /messages");
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).send("No active transport");
  }
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/sse`);
});
