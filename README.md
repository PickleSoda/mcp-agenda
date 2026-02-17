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

### Convenience Tools

#### `get_services`
Fetch available services (classes/subclasses) for the configured company.
- **Inputs**: `company_id` (optional), `location_id` (optional)
- **Returns**: List of services with `id` (bookableId), name, price, and associated `location_ids`.

#### `get_available_slots`
Fetch available time slots for a specific service.
- **Inputs**: 
  - `service_id`: The ID of the service (from `get_services`)
  - `location_id`: The location ID (from `get_services`)
  - `date`: Date in YYYY-MM-DD format
  - `agenda_id`: Optional (default 'anyone')
- **Returns**: List of slots with `datetime` (start time) and `agenda_id` needed for booking.

#### `create_booking`
Create a booking for a selected slot. Simplified wrapper around `confirm_booking`.
- **Inputs**:
  - `service_id`: The service ID
  - `location_id`: The location ID
  - `start`: The start time (datetime string from slot)
  - `agenda_id`: The agenda ID (from slot)
  - `customer_firstname`, `customer_lastname`, `customer_email`, `customer_phone`
- **Returns**: Booking confirmation details.

### Raw API Tools

The following tools provide direct access to the Agenda.ch API endpoints:

#### `get_company_info`
Fetch full company information including locations, resources, and pax categories.
- **Inputs**: `company_id` (optional), `locale` (default 'en')

#### `get_classes`
Fetch classes/categories (raw API response). Useful for exploring service hierarchy.
- **Inputs**: `company_id` (optional), `locale` (default 'en')

#### `get_agendas`
Fetch agendas associated with the company.
- **Inputs**: `company_id` (optional), `locale` (default 'en')

#### `get_bookables`
Fetch bookable services (raw API response).
- **Inputs**: `company_id` (optional), `locale` (default 'en')

#### `get_availabilities`
Fetch raw availability data (nested structure by date).
- **Inputs**: 
  - `service_id`: The service ID
  - `location_id`: The location ID
  - `date`: Date in YYYY-MM-DD format
  - `agenda_id`: Optional (default 'anyone')
  - `range`: Optional (default '3months')

#### `configure_booking`
Configure a booking before confirmation. Returns required fields and validation status.
- **Inputs**: 
  - `email`: Customer email
  - `service_id`: Service ID
  - `participant_count`: Number of participants (default 1)
  - `phone_number`: Customer phone number

#### `confirm_booking`
Confirm a booking with full control over all parameters.
- **Inputs**:
  - `bookable_id`: Service ID
  - `location_id`: Location ID
  - `start`: Start time (ISO string)
  - `email`: Customer email
  - `detail`: Customer details object (firstname, lastname, mobile, etc.)
  - `participant_count`: Number of participants (default 1)
  - `agenda_id`: Agenda ID
  - ...and other optional parameters (booking_mode, referer, etc.)

#### `cancel_appointment`
Cancel an existing appointment.
- **Inputs**:
  - `appointment_id`: Appointment ID
  - `credential_id`: Credential ID (from booking confirmation)
  - `credential_key`: Credential Key (from booking confirmation)
  - `message`: Reason for cancellation

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
