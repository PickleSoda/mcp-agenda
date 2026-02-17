import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const getAvailableSlotsTool = {
  name: "get_available_slots",
  description: "Fetch available time slots for a specific service. Returns a flat list of slots with datetime, agenda_id, agenda_name, and duration_end. Use service_id from get_bookables (NOT get_services). IMPORTANT: Extract the agenda_id from the selected slot for use in confirm_booking.",
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

    // Fetch agendas to map IDs to names
    const agendas = await AgendaClient.getAgendas(companyId);
    const agendaMap = new Map<string, string>();
    for (const agenda of agendas) {
      agendaMap.set(agenda.id.toString(), agenda.name);
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
      
      return daySlots.map(slot => {
        const agendaId = slot.agenda_ids[0]?.toString();
        return {
          datetime: new Date(slot.start * 1000).toISOString(), // Convert unix timestamp to ISO
          agenda_id: agendaId,
          agenda_name: agendaMap.get(agendaId) || 'Unknown',
          duration_end: slot.end,
          timestamp: slot.start
        };
      });
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
