import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client.js';

export const getServicesTool = {
  name: "get_services",
  description: "Fetch available services/bookables for a company.",
  inputSchema: z.object({
    company_id: z.string().describe("Company ID"),
    location_id: z.string().optional().describe("Location ID")
  }),
  handler: async (args: { company_id: string; location_id?: string }) => {
    const services = await AgendaClient.getServices(args.company_id, args.location_id);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(services, null, 2)
        }
      ]
    };
  }
};
