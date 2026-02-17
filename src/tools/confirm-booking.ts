import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const confirmBookingTool = {
  name: "confirm_booking",
  description: "Confirm a booking with full control over all parameters.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    bookable_id: z.number().describe("Service ID"),
    location_id: z.number().describe("Location ID"),
    start: z.string().describe("Start time (ISO string)"),
    email: z.string().email().describe("Customer Email"),
    detail: z.record(z.string(), z.string()).describe("Customer details (firstname, lastname, mobile, etc.)"),
    participant_count: z.number().optional().default(1).describe("Number of participants"),
    locale: z.string().optional().default('en').describe("Locale (default: en)"),
    agenda_id: z.string().optional().default('').describe("Agenda ID"),
    booking_mode: z.string().optional().default('self').describe("Booking Mode"),
    referer: z.string().optional().default('https://ssskin.ch/').describe("Referer URL"),
    accept_cancel_conditions: z.string().optional().default('on').describe("Accept Cancel Conditions ('on' or 'off')"),
    accept_gdpr: z.string().optional().default('on').describe("Accept GDPR ('on' or 'off')"),
    returning_customer: z.string().optional().default('true').describe("Returning Customer ('true' or 'false')"),
    at_home_info: z.string().optional().default('').describe("At Home Info")
  }),
  handler: async (args: { 
    company_id?: string;
    bookable_id: number;
    location_id: number;
    start: string;
    email: string;
    detail: Record<string, string>;
    participant_count?: number;
    locale?: string;
    agenda_id?: string;
    booking_mode?: string;
    referer?: string;
    accept_cancel_conditions?: string;
    accept_gdpr?: string;
    returning_customer?: string;
    at_home_info?: string;
  }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const booking = await AgendaClient.confirmBooking(
      companyId,
      args.bookable_id,
      args.location_id,
      args.start,
      args.email,
      args.detail,
      args.participant_count,
      args.locale,
      args.agenda_id,
      args.booking_mode,
      args.referer,
      args.accept_cancel_conditions,
      args.accept_gdpr,
      args.returning_customer,
      args.at_home_info
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
