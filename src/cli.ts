import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { mcpServer } from "./server.js";

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("Agenda MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
