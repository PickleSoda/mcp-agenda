"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = void 0;
const get_services_js_1 = require("./get-services.js");
const get_slots_js_1 = require("./get-slots.js");
const create_booking_js_1 = require("./create-booking.js");
exports.tools = [
    get_services_js_1.getServicesTool,
    get_slots_js_1.getAvailableSlotsTool,
    create_booking_js_1.createBookingTool
];
