
import axios from 'axios';
import { z } from 'zod';
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
} from '../types/agenda.js';

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
        console.error('Validation error fetching classes:', parsed.error);
        throw new Error('Invalid API response format');
      }
      
      return parsed.data.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
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
        console.error('Validation error fetching company info:', parsed.error);
        throw new Error('Invalid API response format');
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
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
        console.error('Validation error fetching agendas:', parsed.error);
        throw new Error('Invalid API response format');
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Error fetching agendas:', error);
      throw error;
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
        console.error('Validation error fetching bookables:', parsed.error);
        throw new Error('Invalid API response format');
      }
      
      return parsed.data.services;
    } catch (error) {
      console.error('Error fetching bookables:', error);
      throw error;
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
          returning_customer: true,
          _: Date.now()
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      const parsed = AvailabilitiesResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        console.error('Validation error fetching availabilities:', parsed.error);
        throw new Error('Invalid API response format');
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      throw error;
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
        console.error('Validation error configuring booking:', parsed.error);
        throw new Error('Invalid API response format');
      }

      return parsed.data;
    } catch (error) {
      console.error('Error configuring booking:', error);
      throw error;
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
    returningCustomer: string = 'true',
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
      payload.append('returning_customer', returningCustomer);
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
        console.error('Validation error confirming booking:', parsed.error);
        throw new Error('Invalid API response format');
      }

      return parsed.data;
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
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
        console.error('Validation error cancelling appointment:', parsed.error);
        throw new Error('Invalid API response format');
      }

      return parsed.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
};
