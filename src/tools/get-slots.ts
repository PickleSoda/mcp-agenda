import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const getAvailableSlotsTool = {
  name: "get_available_slots",
  description: "Fetch available time slots for a specific service. Requires `service_id` (bookableId) and `location_id` from `get_services`.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if in env)"),
    service_id: z.string().describe("Service ID (bookableId)"),
    location_id: z.string().describe("Location ID"),
    date: z.string().describe("Date in YYYY-MM-DD format"),
    agenda_id: z.string().optional().describe("Agenda ID (default: 'anyone')"),
    range: z.string().optional().describe("Range e.g., '1week', '1month'")
  }),
  handler: async (args: { company_id?: string; service_id: string; location_id: string; date: string; agenda_id?: string; range?: string }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const availabilities = await AgendaClient.getAvailabilities(
      companyId,
      args.date,
      Number(args.service_id),
      Number(args.location_id),
      args.agenda_id || 'anyone',
      args.range || '1week' // Default range if not specified
    );

    // Transform availabilities into a list of slots
    // The response is { "2023-01-01": [ { start: unix_timestamp, end: "datetime_string", agenda_ids: [...] } ] }
    // We want to return a flat list of slots with enough info to book.
    const slots = Object.entries(availabilities).flatMap(([dateStr, daySlots]) => {
      // Filter out days with no slots if any (though usually empty array)
      if (!daySlots) return [];
      
      return daySlots.map(slot => ({
        datetime: new Date(slot.start * 1000).toISOString(), // Convert unix timestamp to ISO
        // We need a slot identifier. 
        // For booking, we usually need 'start' time and 'agenda_id'.
        // Let's create a composite ID or return the necessary fields.
        // The `confirmBooking` needs `start` (datetime string) and `agenda_id`.
        // The slot object has `agenda_ids`. We can pick the first one or return all.
        // For simplicity, let's return the first available agenda_id as the default one to use.
        agenda_id: slot.agenda_ids[0]?.toString(), 
        duration_end: slot.end,
        timestamp: slot.start
      }));
    });

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
