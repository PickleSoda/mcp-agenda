import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const getAvailabilitiesTool = {
  name: "get_availabilities",
  description: "Fetch availabilities for a specific service. Returns the raw nested structure by date.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    service_id: z.string().describe("Service ID (bookableId)"),
    location_id: z.string().describe("Location ID"),
    date: z.string().describe("Date in YYYY-MM-DD format"),
    agenda_id: z.string().optional().default('anyone').describe("Agenda ID (default: 'anyone')"),
    range: z.string().optional().default('3months').describe("Range e.g., '1week', '1month'")
  }),
  handler: async (args: { 
    company_id?: string;
    service_id: string;
    location_id: string;
    date: string;
    agenda_id?: string;
    range?: string;
  }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const serviceId = Number(args.service_id);
    const locationId = Number(args.location_id);

    if (isNaN(serviceId)) {
      throw new Error(`Invalid service_id: "${args.service_id}" is not a valid number`);
    }
    if (isNaN(locationId)) {
      throw new Error(`Invalid location_id: "${args.location_id}" is not a valid number`);
    }

    const availabilities = await AgendaClient.getAvailabilities(
      companyId,
      args.date,
      serviceId,
      locationId,
      args.agenda_id || 'anyone',
      args.range || '3months'
    );
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(availabilities, null, 2)
        }
      ]
    };
  }
};
