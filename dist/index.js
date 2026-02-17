"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const server_js_1 = require("./server.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Store the active transport for single-client dev mode
let transport = null;
app.get("/sse", async (req, res) => {
    console.log("New SSE connection");
    transport = new sse_js_1.SSEServerTransport("/messages", res);
    await server_js_1.mcpServer.connect(transport);
});
app.post("/messages", async (req, res) => {
    console.log("Received message on /messages");
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
    else {
        res.status(404).send("No active transport");
    }
});
app.listen(PORT, () => {
    console.log(`MCP Server running on port ${PORT}`);
    console.log(`Endpoint: http://localhost:${PORT}/sse`);
});
