import 'dotenv/config';
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./server";

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON for Streamable HTTP transport
app.use(express.json());

// Store active SSE transports by session ID (for SSE mode)
const sseTransports: Map<string, SSEServerTransport> = new Map();

// Health check endpoint for Railway/load balancers
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ============================================
// Streamable HTTP Transport (Stateless - Recommended for Production)
// ============================================
app.post("/mcp", async (req, res) => {
  console.log("Streamable HTTP request received");
  
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    });
    
    // Create a fresh MCP server for this request
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling /mcp request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle GET and DELETE for session management (if using sessions)
app.get("/mcp", async (req, res) => {
  res.status(405).json({ error: "Method not allowed. Use POST for MCP requests." });
});

app.delete("/mcp", async (req, res) => {
  res.status(405).json({ error: "Method not allowed. Stateless mode - no sessions to delete." });
});

// ============================================
// SSE Transport (Stateful - For development/single instance)
// ============================================
app.get("/sse", async (req, res) => {
  const sessionId = req.query.sessionId as string || `session-${Date.now()}`;
  console.log(`New SSE connection: ${sessionId}`);
  
  const transport = new SSEServerTransport("/messages", res);
  sseTransports.set(sessionId, transport);
  
  // Clean up on close
  res.on("close", () => {
    console.log(`SSE connection closed: ${sessionId}`);
    sseTransports.delete(sessionId);
  });
  
  // Create a fresh MCP server for this connection
  const server = createMcpServer();
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  console.log(`Received message for session: ${sessionId || 'default'}`);
  
  // Find the transport - try session ID first, then fall back to most recent
  let transport = sessionId ? sseTransports.get(sessionId) : null;
  
  if (!transport && sseTransports.size > 0) {
    // Fall back to the first available transport (single-client mode)
    transport = sseTransports.values().next().value;
  }
  
  if (transport) {
    try {
      await transport.handlePostMessage(req, res);
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).json({ error: "Failed to handle message" });
    }
  } else {
    console.log("No active transport for message");
    res.status(503).json({ error: "SSE connection not established. Please reconnect." });
  }
});

app.post("/sse", async (req, res) => {
  // VS Code MCP client uses Streamable HTTP to /sse endpoint
  console.log("Received POST on /sse - handling as Streamable HTTP");
  
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    });
    
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling /sse POST:", error);
    res.status(500).json({ error: "Failed to handle message" });
  }
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  - Streamable HTTP (Production): POST http://localhost:${PORT}/mcp`);
  console.log(`  - SSE (Development): GET http://localhost:${PORT}/sse`);
  console.log(`  - Health check: GET http://localhost:${PORT}/health`);
});
