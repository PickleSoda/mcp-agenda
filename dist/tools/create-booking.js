"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingTool = void 0;
const zod_1 = require("zod");
const agenda_client_js_1 = require("../services/agenda-client.js");
exports.createBookingTool = {
    name: "create_booking",
    description: "Create a booking for a selected slot.",
    inputSchema: zod_1.z.object({
        company_id: zod_1.z.string().describe("Company ID"),
        slot_id: zod_1.z.string().describe("Slot ID or identifier"),
        service_id: zod_1.z.string().describe("Service ID"),
        customer_name: zod_1.z.string().describe("Customer Name"),
        customer_phone: zod_1.z.string().describe("Customer Phone"),
        customer_email: zod_1.z.string().email().describe("Customer Email"),
        notes: zod_1.z.string().optional().describe("Additional notes")
    }),
    handler: async (args) => {
        const customer = {
            name: args.customer_name,
            phone: args.customer_phone,
            email: args.customer_email,
            notes: args.notes
        };
        const booking = await agenda_client_js_1.AgendaClient.createBooking(args.company_id, args.slot_id, args.service_id, customer);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(booking, null, 2)
                }
            ]
        };
    }
};
