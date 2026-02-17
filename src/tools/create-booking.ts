import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client.js';

export const createBookingTool = {
  name: "create_booking",
  description: "Create a booking for a selected slot.",
  inputSchema: z.object({
    company_id: z.string().describe("Company ID"),
    slot_id: z.string().describe("Slot ID or identifier"),
    service_id: z.string().describe("Service ID"),
    customer_name: z.string().describe("Customer Name"),
    customer_phone: z.string().describe("Customer Phone"),
    customer_email: z.string().email().describe("Customer Email"),
    notes: z.string().optional().describe("Additional notes")
  }),
  handler: async (args: { company_id: string; slot_id: string; service_id: string; customer_name: string; customer_phone: string; customer_email: string; notes?: string }) => {
    const customer = {
      name: args.customer_name,
      phone: args.customer_phone,
      email: args.customer_email,
      notes: args.notes
    };
    const booking = await AgendaClient.createBooking(
      args.company_id,
      args.slot_id,
      args.service_id,
      customer
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
