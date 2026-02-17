"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicesTool = void 0;
const zod_1 = require("zod");
const agenda_client_js_1 = require("../services/agenda-client.js");
exports.getServicesTool = {
    name: "get_services",
    description: "Fetch available services/bookables for a company.",
    inputSchema: zod_1.z.object({
        company_id: zod_1.z.string().describe("Company ID"),
        location_id: zod_1.z.string().optional().describe("Location ID")
    }),
    handler: async (args) => {
        const services = await agenda_client_js_1.AgendaClient.getServices(args.company_id, args.location_id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(services, null, 2)
                }
            ]
        };
    }
};
