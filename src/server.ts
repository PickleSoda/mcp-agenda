import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tools } from "./tools/index";

// Factory function to create a new MCP server instance for each connection
export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "agenda-booking",
    version: "1.0.0",
  });

  // Register tools using the new registerTool API
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema.shape,
      },
      tool.handler
    );
  }

  return server;
}

// Keep a default export for backward compatibility
export const mcpServer = createMcpServer();
