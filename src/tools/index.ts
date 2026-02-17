import { getServicesTool } from './get-services';
import { getAvailableSlotsTool } from './get-slots';
import { createBookingTool } from './create-booking';
import { getClassesTool } from './get-classes';
import { getCompanyInfoTool } from './get-company-info';
import { getAgendasTool } from './get-agendas';
import { getBookablesTool } from './get-bookables';
import { getAvailabilitiesTool } from './get-availabilities';
import { configureBookingTool } from './configure-booking';
import { confirmBookingTool } from './confirm-booking';
import { cancelAppointmentTool } from './cancel-appointment';

export const tools = [
  // Convenience tools
  getServicesTool,
  getAvailableSlotsTool,
  createBookingTool,
  
  // Raw API tools
  getClassesTool,
  getCompanyInfoTool,
  getAgendasTool,
  getBookablesTool,
  getAvailabilitiesTool,
  configureBookingTool,
  confirmBookingTool,
  cancelAppointmentTool
];
