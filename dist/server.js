"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const index_js_1 = require("./tools/index.js");
exports.mcpServer = new mcp_js_1.McpServer({
    name: "agenda-booking",
    version: "1.0.0",
});
// Register tools
for (const tool of index_js_1.tools) {
    exports.mcpServer.tool(tool.name, tool.description, tool.inputSchema.shape, tool.handler);
}
