
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

// Helper function to create agent-friendly error messages
function createAgentError(error: unknown, context: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data as any;
    
    if (status === 404) {
      return new Error(
        `${context} failed: Resource not found (404).\n\n` +
        `AGENT ACTION REQUIRED:\n` +
        `1. Verify the IDs are correct and exist:\n` +
        `   - Check that service_id exists in get_bookables response\n` +
        `   - Check that location_id exists in get_company_info response\n` +
        `   - Ensure the service is available at the selected location (check locationIds array)\n` +
        `2. If checking availabilities, verify:\n` +
        `   - The bookable_id and location_id combination is valid\n` +
        `   - The service is not hidden (hiddenOnWidget: false)\n` +
        `3. Try calling get_bookables and get_company_info again to verify current data\n\n` +
        `API Response: ${JSON.stringify(data, null, 2)}`
      );
    }
    
    if (status === 422) {
      return new Error(
        `${context} failed: Validation error (422).\n\n` +
        `AGENT ACTION REQUIRED:\n` +
        `1. Check that all required fields from configure_booking are included in the detail object\n` +
        `2. Verify data formats:\n` +
        `   - Phone numbers: Use format +41791234567 (no spaces, include country code)\n` +
        `   - Email: Must be valid email format\n` +
        `   - Start time: Must be ISO 8601 format with timezone (e.g., 2026-02-18T09:00:00+01:00)\n` +
        `3. Ensure all detail field keys match the field names from configure_booking\n` +
        `4. Call configure_booking again to see required fields\n\n` +
        `API Response: ${JSON.stringify(data, null, 2)}`
      );
    }
    
    if (status === 400) {
      return new Error(
        `${context} failed: Bad request (400).\n\n` +
        `AGENT ACTION REQUIRED:\n` +
        `1. Check that all numeric IDs are actually numbers (not strings with NaN)\n` +
        `2. Verify the request parameters match the API requirements\n` +
        `3. Ensure date format is YYYY-MM-DD\n\n` +
        `API Response: ${JSON.stringify(data, null, 2)}`
      );
    }
    
    return new Error(
      `${context} failed: HTTP ${status || 'unknown'}\n` +
      `API Response: ${JSON.stringify(data, null, 2)}\n` +
      `Error: ${axiosError.message}`
    );
  }
  
  return new Error(`${context} failed: ${error instanceof Error ? error.message : String(error)}`);
}
import { 
  AgendaClassesResponse, 
 
  AgendaClass, 
  AgendaClassesResponseSchema,
  AvailabilitiesResponseSchema,
  AvailabilitiesResponse,
  BookingConfigureResponseSchema,
  BookingConfigureResponse,
  BookingConfirmResponseSchema,
  BookingConfirmResponse,
  CancelAppointmentResponseSchema,
  CancelAppointmentResponse,
  CompanyInfoResponseSchema,
  CompanyInfoResponse,
  AgendasResponseSchema,
  AgendasResponse,
  Agenda,
  BookablesResponseSchema,
  BookableService
} from '../types/agenda';

const BASE_URL = 'https://node.agenda.ch';

export const AgendaClient = {
  getClasses: async (companyId: number | string, locale: string = 'en'): Promise<AgendaClass[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/book/classes`, {
        params: {
          companyId,
          locale,
          _: Date.now()
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      
      const parsed = AgendaClassesResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `get_classes validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure has changed or is invalid.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `This usually means the API schema has been updated.\n` +
          `Try using the raw response or contact support.`
        );
      }
      
      return parsed.data.data;
    } catch (error) {
      throw createAgentError(error, 'get_classes');
    }
  },

  getCompanyInfo: async (companyId: number | string, locale: string = 'en'): Promise<CompanyInfoResponse> => {
    try {
      const response = await axios.get(`${BASE_URL}/api_front/pro_users`, {
        params: {
          company_id: companyId,
          locale,
          _: Date.now()
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      
      const parsed = CompanyInfoResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `get_company_info validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid or has changed.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `This usually means the API schema has been updated.\n` +
          `The raw response was received but doesn't match expected structure.`
        );
      }
      
      return parsed.data;
    } catch (error) {
      throw createAgentError(error, 'get_company_info');
    }
  },

  getAgendas: async (companyId: number | string, locale: string = 'en'): Promise<Agenda[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api_front/agendas`, {
        params: {
          company_id: companyId,
          locale,
          _: Date.now()
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      
      const parsed = AgendasResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `get_agendas validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `This usually means the API schema has been updated.`
        );
      }
      
      return parsed.data;
    } catch (error) {
      throw createAgentError(error, 'get_agendas');
    }
  },

  getBookables: async (companyId: number | string, locale: string = 'en'): Promise<BookableService[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api_front/bookables`, {
        params: {
          company_id: companyId,
          locale,
          'types[]': 'services',
          _: Date.now()
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      
      const parsed = BookablesResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `get_bookables validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `Remember to filter services where hiddenOnWidget: false before showing to users.`
        );
      }
      
      return parsed.data.services;
    } catch (error) {
      throw createAgentError(error, 'get_bookables');
    }
  },

  getAvailabilities: async (
    companyId: number | string, 
    date: string, 
    bookableId: number, 
    locationId: number, 
    agendaId: string = 'anyone',
    range: string = '3months'
  ): Promise<AvailabilitiesResponse> => {
    try {
      // Validate numeric parameters
      if (!Number.isFinite(bookableId)) {
        throw new Error(`Invalid bookableId: ${bookableId} is not a valid number`);
      }
      if (!Number.isFinite(locationId)) {
        throw new Error(`Invalid locationId: ${locationId} is not a valid number`);
      }

      const response = await axios.get(`${BASE_URL}/api_front/pro_users/availabilities`, {
        params: {
          company_id: companyId,
          locale: 'en',
          date,
          range,
          'bookables[0][id]': bookableId,
          'bookables[0][type]': 'Service',
          agenda_id: agendaId,
          as_minutes: true,
          'location_ids[0]': locationId,
          simultaneous_count: 1,
          returning_customer: false,
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      const parsed = AvailabilitiesResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `get_availabilities validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `If no slots were found, the API may return an empty object. Try:\n` +
          `1. Expanding the date range (use range='1month' or '3months')\n` +
          `2. Trying a different date\n` +
          `3. Verifying the service is available at this location`
        );
      }
      
      return parsed.data;
    } catch (error) {
      throw createAgentError(error, 'get_availabilities');
    }
  },

  configureBooking: async (
    companyId: number | string,
    email: string,
    bookableId: number,
    participantCount: number = 1,
    phoneNumber: string = '',
    locale: string = 'en'
  ): Promise<BookingConfigureResponse> => {
    try {
      const payload = new URLSearchParams();
      payload.append('locale', locale);
      payload.append('company_id', companyId.toString());
      payload.append('email', email);
      payload.append('bookables[0][id]', bookableId.toString());
      payload.append('bookables[0][type]', 'Service');
      payload.append('bookables[0][participantCount]', participantCount.toString());
      payload.append('phone_number', phoneNumber);

      const response = await axios.post(`${BASE_URL}/api_front/bookings/configure`, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      const parsed = BookingConfigureResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `configure_booking validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `Check that:\n` +
          `1. The service_id (bookable_id) is valid\n` +
          `2. The email format is correct\n` +
          `3. Try calling get_bookables to verify the service exists`
        );
      }

      return parsed.data;
    } catch (error) {
      throw createAgentError(error, 'configure_booking');
    }
  },

  confirmBooking: async (
    companyId: number | string,
    bookableId: number,
    locationId: number,
    start: string,
    email: string,
    detail: Record<string, string>, // e.g., { firstname: 'John', lastname: 'Doe', mobile: '+1234567890', '2748': '0', '4982': 'Google' }
    participantCount: number = 1,
    locale: string = 'en',
    agendaId: string = '',
    bookingMode: string = 'self',
    referer: string = 'https://ssskin.ch/',
    acceptCancelConditions: string = 'on',
    acceptGdpr: string = 'on',
    atHomeInfo: string = ''
  ): Promise<BookingConfirmResponse> => {
    try {
      const payload = new URLSearchParams();
      
      // Static/Default fields
      payload.append('accept_cancel_conditions', acceptCancelConditions);
      payload.append('accept_gdpr', acceptGdpr);
      payload.append('booking_mode', bookingMode);
      payload.append('company_id', companyId.toString());
      payload.append('locale', locale);
      payload.append('referer', referer);
      payload.append('at_home_info', atHomeInfo);
      
      // Dynamic detail fields
      for (const [key, value] of Object.entries(detail)) {
        payload.append(`detail[${key}]`, value);
      }
      
      payload.append('email', email);
      
      // Arrays/Nested structures
      // Note: Using append multiple times for array-like keys as seen in URLSearchParams behavior or manual construction if needed
      // The target API seems to use PHP-style array naming: key[] or key[index]
      // Based on request: location_ids[]=3826
      payload.append('location_ids[]', locationId.toString());
      
      payload.append('view_id', ''); // Empty in request example
      
      // Bookables
      payload.append('bookables[][type]', 'Service');
      payload.append('bookables[][id]', bookableId.toString());
      payload.append('bookables[][counts]', participantCount.toString());
      
      payload.append('agenda_id', agendaId);
      payload.append('start', start);

      const response = await axios.post(`${BASE_URL}/api_front/bookings/confirm`, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      const parsed = BookingConfirmResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `confirm_booking validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid or the booking failed.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `Common issues:\n` +
          `1. Missing required fields - call configure_booking first to see required fields\n` +
          `2. Invalid phone format - use +41791234567 (no spaces)\n` +
          `3. Invalid start time format - use ISO 8601 (e.g., 2026-02-18T09:00:00+01:00)\n` +
          `4. Missing agenda_id - extract it from the selected slot in get_available_slots\n` +
          `5. Time slot no longer available - check availability again`
        );
      }

      return parsed.data;
    } catch (error) {
      throw createAgentError(error, 'confirm_booking');
    }
  },

  cancelAppointment: async (
    appointmentId: number,
    companyId: number | string,
    credentialId: number,
    credentialKey: string,
    message: string,
    locale: string = 'en'
  ): Promise<CancelAppointmentResponse> => {
    try {
      const response = await axios.delete(`${BASE_URL}/api_front/customer/appointments/${appointmentId}`, {
        params: {
          company_id: companyId,
          locale,
          credential_key: credentialKey,
          credential_id: credentialId,
          message
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      const parsed = CancelAppointmentResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(
          `cancel_appointment validation failed.\n\n` +
          `AGENT ACTION REQUIRED:\n` +
          `The API response structure is invalid.\n` +
          `Validation errors: ${errorDetails}\n\n` +
          `Check that:\n` +
          `1. The appointmentId is correct\n` +
          `2. The credentialId and credentialKey match the booking\n` +
          `3. The appointment hasn't already been cancelled`
        );
      }

      return parsed.data;
    } catch (error) {
      throw createAgentError(error, 'cancel_appointment');
    }
  }
};
