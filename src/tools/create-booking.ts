import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const createBookingTool = {
  name: "create_booking",
  description: "Create a booking for a selected slot. Requires `start` time and `agenda_id` from the slot.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if in env)"),
    location_id: z.string().describe("Location ID"),
    service_id: z.string().describe("Service ID (bookableId)"),
    start: z.string().describe("Start time (ISO string or YYYY-MM-DD HH:mm:ss) from the slot"),
    agenda_id: z.string().describe("Agenda ID from the slot"),
    customer_firstname: z.string().describe("Customer First Name"),
    customer_lastname: z.string().describe("Customer Last Name"),
    customer_phone: z.string().describe("Customer Phone"),
    customer_email: z.string().email().describe("Customer Email"),
    customer_notes: z.string().optional().describe("Additional notes")
  }),
  handler: async (args: { 
    company_id?: string; 
    location_id: string;
    service_id: string; 
    start: string;
    agenda_id: string;
    customer_firstname: string; 
    customer_lastname: string;
    customer_phone: string; 
    customer_email: string; 
    customer_notes?: string 
  }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    // Construct the detail object. Standard fields seem to be firstname, lastname, mobile.
    // Notes might need a specific key or be part of detail.
    // Based on standard agenda.ch forms, 'message' or 'notes' might be a field.
    // For now, I'll add a 'message' field to detail if notes are present.
    const detail: Record<string, string> = {
      firstname: args.customer_firstname,
      lastname: args.customer_lastname,
      mobile: args.customer_phone,
    };

    if (args.customer_notes) {
      detail['message'] = args.customer_notes;
    }

    const booking = await AgendaClient.confirmBooking(
      companyId,
      Number(args.service_id),
      Number(args.location_id),
      args.start,
      args.customer_email,
      detail,
      1, // participantCount
      'en', // locale
      args.agenda_id
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(booking, null, 2)
        }
      ]
    };
  }
};
