import { z } from 'zod';

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

export const AgendaSubclassSchema = z.object({
  id: z.number(),
  unit: z.string(),
  quantity: z.number(),
  class_id: z.number(),
  description_fr: z.string().nullable(),
  description_de: z.string().nullable(),
  description_en: z.string().nullable(),
  expiration_days: z.number().nullable(),
  expiration_date: z.string().nullable(),
  name_fr: z.string().nullable(),
  name_de: z.string().nullable(),
  name_en: z.string().nullable(),
  price: z.number(),
  has_restrictions: z.boolean(),
  picture_url: z.string().nullable(),
  background_picture_url: z.string().nullable(),
  position: z.number(),
  booking_view_ids: z.array(z.number()).nullable(),
  font_family: z.string(),
  print_account_name: z.boolean(),
  print_booking_url: z.boolean(),
  print_logo: z.boolean(),
  print_qr_code: z.boolean(),
  print_voucher_reference: z.boolean(),
});

export type AgendaSubclass = z.infer<typeof AgendaSubclassSchema>;

export const AgendaClassSchema = z.object({
  id: z.number(),
  name_fr: z.string().nullable(),
  name_de: z.string().nullable(),
  name_en: z.string().nullable(),
  description_fr: z.string().nullable(),
  description_de: z.string().nullable(),
  description_en: z.string().nullable(),
  type: z.string(),
  sell_online: z.boolean(),
  active: z.boolean(),
  position: z.number(),
  location_ids: z.array(z.number()).nullable(),
  display_on_widget: z.boolean(),
  apply_restrictions_for_users: z.boolean(),
  bookable_attributes: z.array(z.any()),
  subclasses: z.array(AgendaSubclassSchema),
});

export type AgendaClass = z.infer<typeof AgendaClassSchema>;

export const AgendaClassesResponseSchema = z.object({
  data: z.array(AgendaClassSchema),
});

export type AgendaClassesResponse = z.infer<typeof AgendaClassesResponseSchema>;

export const AvailabilitySlotSchema = z.object({
  start: z.number(),
  end: z.string(),
  agenda_ids: z.array(z.number()),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;

export const AvailabilitiesResponseSchema = z.record(z.string(), z.array(AvailabilitySlotSchema));

export type AvailabilitiesResponse = z.infer<typeof AvailabilitiesResponseSchema>;

export const BookingFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean(),
  self: z.boolean().optional(),
  parent: z.boolean().optional(),
  child: z.boolean().optional(),
  patient: z.boolean().optional(),
  referrer: z.boolean().optional(),
  min: z.number().nullable(),
  max: z.number().nullable(),
  warning: z.string().nullable().optional(),
  hint: z.string().optional(),
  choices: z.string().optional(),
});

export type BookingField = z.infer<typeof BookingFieldSchema>;

export const BookingConfigureResponseSchema = z.object({
  fields: z.array(BookingFieldSchema),
  is_known: z.boolean(),
});

export type BookingConfigureResponse = z.infer<typeof BookingConfigureResponseSchema>;

export const TransactionProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number().nullable(),
  quantity: z.number(),
});

export type TransactionProduct = z.infer<typeof TransactionProductSchema>;

export const TransactionSchema = z.object({
  transactionId: z.string(),
  transactionTotal: z.number(),
  transactionTax: z.number(),
  transactionShipping: z.number(),
  transactionProducts: z.array(TransactionProductSchema),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const BookingConfirmResponseSchema = z.object({
  messages: z.array(z.string()),
  status: z.string(),
  transaction: TransactionSchema,
  appointmentId: z.number(),
  credentialId: z.number(),
  credentialKey: z.string(),
});

export type BookingConfirmResponse = z.infer<typeof BookingConfirmResponseSchema>;

export const CancelAppointmentResponseSchema = z.object({});

export type CancelAppointmentResponse = z.infer<typeof CancelAppointmentResponseSchema>;
