import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const cancelAppointmentTool = {
  name: "cancel_appointment",
  description: "Cancel an existing appointment. Requires credentials from the confirmation response.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    appointment_id: z.number().describe("Appointment ID"),
    credential_id: z.number().describe("Credential ID (from booking confirmation)"),
    credential_key: z.string().describe("Credential Key (from booking confirmation)"),
    message: z.string().describe("Reason for cancellation"),
    locale: z.string().optional().default('en').describe("Locale (default: en)")
  }),
  handler: async (args: { 
    company_id?: string;
    appointment_id: number;
    credential_id: number;
    credential_key: string;
    message: string;
    locale?: string;
  }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const result = await AgendaClient.cancelAppointment(
      args.appointment_id,
      companyId,
      args.credential_id,
      args.credential_key,
      args.message,
      args.locale
    );
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
};
