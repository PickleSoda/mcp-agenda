"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaClient = void 0;
exports.AgendaClient = {
    getServices: async (companyId, locationId) => {
        // Mock implementation
        return [
            { id: '1', name: 'Mock Service', duration: 30, price: 50 },
            { id: '2', name: 'Another Service', duration: 60, price: 100 }
        ];
    },
    getAvailableSlots: async (companyId, serviceId, locationId, date, range) => {
        // Mock implementation
        return [
            { id: 'slot_1', datetime: `${date}T10:00:00Z` },
            { id: 'slot_2', datetime: `${date}T11:00:00Z` }
        ];
    },
    createBooking: async (companyId, slotId, serviceId, customer) => {
        // Mock implementation
        return {
            referenceNumber: `BK-${Math.floor(Math.random() * 10000)}`,
            status: 'confirmed'
        };
    }
};
