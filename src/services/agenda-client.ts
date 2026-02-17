import { Service, Slot, Booking } from '../types/agenda.js';

export const AgendaClient = {
  getServices: async (companyId: string, locationId?: string): Promise<Service[]> => {
    // Mock implementation
    return [
      { id: '1', name: 'Mock Service', duration: 30, price: 50 },
      { id: '2', name: 'Another Service', duration: 60, price: 100 }
    ];
  },

  getAvailableSlots: async (companyId: string, serviceId: string, locationId: string, date: string, range?: string): Promise<Slot[]> => {
    // Mock implementation
    return [
      { id: 'slot_1', datetime: `${date}T10:00:00Z` },
      { id: 'slot_2', datetime: `${date}T11:00:00Z` }
    ];
  },

  createBooking: async (companyId: string, slotId: string, serviceId: string, customer: { name: string, phone: string, email: string, notes?: string }): Promise<Booking> => {
    // Mock implementation
    return {
      referenceNumber: `BK-${Math.floor(Math.random() * 10000)}`,
      status: 'confirmed'
    };
  }
};
