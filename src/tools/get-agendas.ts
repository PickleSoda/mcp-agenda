import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const getAgendasTool = {
  name: "get_agendas",
  description: "Fetch agendas for a company.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    locale: z.string().optional().default('en').describe("Locale (default: en)")
  }),
  handler: async (args: { company_id?: string; locale?: string }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const agendas = await AgendaClient.getAgendas(companyId, args.locale);
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(agendas, null, 2)
        }
      ]
    };
  }
};
