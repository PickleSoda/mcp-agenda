import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tools } from "./tools/index";

export const mcpServer = new McpServer({
  name: "agenda-booking",
  version: "1.0.0",
});

// Register tools
for (const tool of tools) {
  mcpServer.tool(
    tool.name,
    tool.description,
    tool.inputSchema.shape,
    tool.handler
  );
}
