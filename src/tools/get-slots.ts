import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client.js';

export const getAvailableSlotsTool = {
  name: "get_available_slots",
  description: "Fetch available time slots for a specific service.",
  inputSchema: z.object({
    company_id: z.string().describe("Company ID"),
    service_id: z.string().describe("Service ID"),
    location_id: z.string().describe("Location ID"),
    date: z.string().describe("Date in YYYY-MM-DD format"),
    range: z.string().optional().describe("Range e.g., '1week', '1month'")
  }),
  handler: async (args: { company_id: string; service_id: string; location_id: string; date: string; range?: string }) => {
    const slots = await AgendaClient.getAvailableSlots(
      args.company_id,
      args.service_id,
      args.location_id,
      args.date,
      args.range
    );
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(slots, null, 2)
        }
      ]
    };
  }
};
