# Agenda.ch MCP Server Specification

## Overview

Build an MCP (Model Context Protocol) server that wraps the agenda.ch booking API, designed to be consumed by VAPI voice agents. The server exposes tools for checking availability and creating bookings.

## Transport

- **Protocol**: Streamable HTTP (not stdio)
- **Endpoint**: `POST /mcp`
- **Consumer**: VAPI voice agent platform

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Validation**: Zod
- **HTTP Client**: Native fetch or axios

## Directory Structure

```
agenda-mcp/
├── src/
│   ├── index.ts              # Express server + MCP transport setup
│   ├── server.ts             # MCP server instance and tool definitions
│   ├── tools/
│   │   ├── index.ts          # Tool registry / barrel export
│   │   ├── get-services.ts   # Fetch available services
│   │   ├── get-slots.ts      # Fetch available time slots
│   │   └── create-booking.ts # Create a booking
│   ├── services/
│   │   └── agenda-client.ts  # agenda.ch API wrapper
│   └── types/
│       └── agenda.ts         # TypeScript types for agenda.ch responses
├── package.json
├── tsconfig.json
├── Dockerfile
├── .env.example
└── README.md
```

## MCP Tools to Implement

### 1. `get_services`

Fetch available services/bookables for a company.

**Input Parameters:**
- `company_id` (string, required)
- `location_id` (string, optional)

**Returns:**
- List of services with id, name, duration, price

---

### 2. `get_available_slots`

Fetch available time slots for a specific service.

**Input Parameters:**
- `company_id` (string, required)
- `service_id` (string, required)
- `location_id` (string, required)
- `date` (string, required) - format: YYYY-MM-DD
- `range` (string, optional) - e.g., "1week", "1month", "3months"

**Returns:**
- List of available slots with datetime and slot identifiers

---

### 3. `create_booking`

Create a booking for a selected slot.

**Input Parameters:**
- `company_id` (string, required)
- `slot_id` or slot identifier (TBD based on agenda.ch API)
- `service_id` (string, required)
- `customer_name` (string, required)
- `customer_phone` (string, required)
- `customer_email` (string, required)
- `notes` (string, optional)

**Returns:**
- Booking confirmation with reference number

---

## Implementation Notes

### Express + MCP Setup Pattern

```typescript
// Pseudocode structure
const app = express();
const mcpServer = new McpServer({ name: "agenda-booking", version: "1.0.0" });

// Register tools
registerTools(mcpServer);

// MCP endpoint
app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res);
});
```

### agenda.ch API Client

- No authentication required (public API)
- Base URL: TBD
- Include cache-buster `_` parameter with timestamp on GET requests
- Handle response parsing and error normalization

### Error Handling

Tools should return structured error messages that VAPI can relay to the user:
- "No available slots for the selected date"
- "Service not found"
- "Booking failed: [reason]"

## Environment Variables

```env
PORT=3000
AGENDA_BASE_URL=https://app.agenda.ch
NODE_ENV=development
```

## VAPI Integration

Once deployed, configure in VAPI dashboard:

```json
{
  "type": "mcp",
  "server": {
    "url": "https://your-deployed-server.com/mcp",
    "protocol": "streamableHttp"
  }
}
```

## Deployment Options

- Railway
- Render
- Fly.io
- Docker on any VPS

## TODO (To Be Defined Later)

- [ ] Exact agenda.ch API endpoints and payloads
- [ ] Response parsing logic
- [ ] Slot identification scheme (how to reference a specific slot for booking)
- [ ] Any required headers or cookies for agenda.ch
- [ ] Cancellation/rescheduling tools (if needed)