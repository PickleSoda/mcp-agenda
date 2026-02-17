# Agenda.ch MCP Server

An MCP server that wraps the agenda.ch booking API for use with VAPI voice agents or other MCP clients.

## Configuration

Copy `.env.example` to `.env` and set the following variables:

```bash
PORT=3000
COMPANY_ID=12345
NODE_ENV=development
```

## Tools

### `get_services`
Fetch available services (classes/subclasses) for the configured company.
- **Inputs**: `company_id` (optional), `location_id` (optional)
- **Returns**: List of services with `id` (bookableId), name, price, and associated `location_ids`.

### `get_available_slots`
Fetch available time slots for a specific service.
- **Inputs**: 
  - `service_id`: The ID of the service (from `get_services`)
  - `location_id`: The location ID (from `get_services`)
  - `date`: Date in YYYY-MM-DD format
  - `agenda_id`: Optional (default 'anyone')
- **Returns**: List of slots with `datetime` (start time) and `agenda_id` needed for booking.

### `create_booking`
Create a booking for a selected slot.
- **Inputs**:
  - `service_id`: The service ID
  - `location_id`: The location ID
  - `start`: The start time (datetime string from slot)
  - `agenda_id`: The agenda ID (from slot)
  - `customer_firstname`, `customer_lastname`, `customer_email`, `customer_phone`
- **Returns**: Booking confirmation details.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
