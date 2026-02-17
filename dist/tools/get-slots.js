"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlotsTool = void 0;
const zod_1 = require("zod");
const agenda_client_js_1 = require("../services/agenda-client.js");
exports.getAvailableSlotsTool = {
    name: "get_available_slots",
    description: "Fetch available time slots for a specific service.",
    inputSchema: zod_1.z.object({
        company_id: zod_1.z.string().describe("Company ID"),
        service_id: zod_1.z.string().describe("Service ID"),
        location_id: zod_1.z.string().describe("Location ID"),
        date: zod_1.z.string().describe("Date in YYYY-MM-DD format"),
        range: zod_1.z.string().optional().describe("Range e.g., '1week', '1month'")
    }),
    handler: async (args) => {
        const slots = await agenda_client_js_1.AgendaClient.getAvailableSlots(args.company_id, args.service_id, args.location_id, args.date, args.range);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(slots, null, 2)
                }
            ]
        };
    }
};
