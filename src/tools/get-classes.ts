import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client';

export const getClassesTool = {
  name: "get_classes",
  description: "Fetch classes/categories for a company. This is the raw API response containing services grouped by class.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    locale: z.string().optional().default('en').describe("Locale (default: en)")
  }),
  handler: async (args: { company_id?: string; locale?: string }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const classes = await AgendaClient.getClasses(companyId, args.locale);
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(classes, null, 2)
        }
      ]
    };
  }
};
