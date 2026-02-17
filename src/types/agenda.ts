export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Slot {
  datetime: string;
  id: string;
}

export interface Booking {
  referenceNumber: string;
  status: string;
}
