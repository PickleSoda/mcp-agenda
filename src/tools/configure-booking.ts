import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const configureBookingTool = {
  name: "configure_booking",
  description: "Get required form fields before confirming a booking. Returns a list of fields with name, label, type, and required status. Field names like 'detail[firstname]' map to keys in the detail object for confirm_booking. ALWAYS call this before confirm_booking to know what information to collect from the user.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    email: z.string().email().describe("Customer Email"),
    service_id: z.string().describe("Service ID (bookableId)"),
    participant_count: z.number().optional().default(1).describe("Number of participants"),
    phone_number: z.string().optional().default('').describe("Customer Phone Number"),
    locale: z.string().optional().default('en').describe("Locale (default: en)")
  }),
  handler: async (args: { 
    company_id?: string;
    email: string;
    service_id: string;
    participant_count?: number;
    phone_number?: string;
    locale?: string;
  }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const config = await AgendaClient.configureBooking(
      companyId,
      args.email,
      Number(args.service_id),
      args.participant_count,
      args.phone_number,
      args.locale
    );
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(config, null, 2)
        }
      ]
    };
  }
};
