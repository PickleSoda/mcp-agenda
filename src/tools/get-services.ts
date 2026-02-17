import { z } from 'zod';
import { AgendaClient } from '../services/agenda-client.js';
import { AgendaClass } from '../types/agenda.js';

export const getServicesTool = {
  name: "get_services",
  description: "Fetch available services/bookables for a company. Returns a list of services with their IDs (bookableId) and available location IDs.",
  inputSchema: z.object({
    company_id: z.string().optional().describe("Company ID (optional if configured in env)"),
    location_id: z.string().optional().describe("Location ID filter (optional)")
  }),
  handler: async (args: { company_id?: string; location_id?: string }) => {
    const companyId = args.company_id || process.env.COMPANY_ID;
    
    if (!companyId) {
      throw new Error("company_id is required either as an argument or COMPANY_ID env var");
    }

    const classes: AgendaClass[] = await AgendaClient.getClasses(companyId);
    
    // Flatten classes and subclasses into a linear list of services
    const services = classes.flatMap((cls) => {
      // If location_id is provided, filter classes that don't include it
      if (args.location_id && cls.location_ids && !cls.location_ids.includes(Number(args.location_id))) {
        return [];
      }

      return cls.subclasses.map((sub) => ({
        id: sub.id.toString(), // This is the bookable_id needed for get_available_slots
        name: sub.name_en || sub.name_fr || sub.name_de || "Unnamed Service",
        category: cls.name_en || cls.name_fr || cls.name_de || "Uncategorized",
        price: sub.price,
        duration: sub.quantity, // Assuming quantity is duration in minutes? Or unit? Usually quantity in agenda.ch context is duration if unit is minutes.
        unit: sub.unit,
        location_ids: cls.location_ids, // Pass this through so the agent knows which location_id to use
        description: sub.description_en || sub.description_fr || sub.description_de
      }));
    });

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
