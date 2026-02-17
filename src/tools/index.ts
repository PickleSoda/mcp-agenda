import { getServicesTool } from './get-services.js';
import { getAvailableSlotsTool } from './get-slots.js';
import { createBookingTool } from './create-booking.js';

export const tools = [
  getServicesTool,
  getAvailableSlotsTool,
  createBookingTool
];
