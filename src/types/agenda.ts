
import { z } from 'zod';

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

export const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable(),
  region: z.string().nullable(),
  zip: z.string().nullable(),
  website: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  mobile: z.string().nullable(),
  country_id: z.number().nullable(),
  agenda_ids: z.array(z.number()),
  service_ids: z.array(z.number()),
  pictureUrls: z.any().nullable(),
  enabled: z.boolean(),
  internet: z.boolean(),
  description: z.string().nullable(),
  type: z.string(),
  zones: z.any().nullable(),
  exclusionZones: z.any().nullable(),
  position: z.number(),
  hasCourses: z.boolean(),
  restrictOrigin: z.boolean()
});

export type Location = z.infer<typeof LocationSchema>;

export const ResourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  position: z.number(),
  group: z.any().nullable(),
  group_id: z.any().nullable(),
  services: z.array(z.number()),
  locations: z.array(z.number()),
  enabled: z.boolean()
});

export type Resource = z.infer<typeof ResourceSchema>;

export const PaxCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  warning: z.string().nullable()
});

export type PaxCategory = z.infer<typeof PaxCategorySchema>;

export const CompanyInfoResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  mobile: z.string(),
  address: z.string(),
  zip: z.string(),
  region: z.string(),
  canton: z.string(),
  country: z.string(),
  pictureUrl: z.string().nullable(),
  locations: z.array(LocationSchema),
  resources: z.array(ResourceSchema),
  paxCategories: z.array(PaxCategorySchema),
  defaultCurrency: z.string(),
  customerName: z.string(),
});

export type CompanyInfoResponse = z.infer<typeof CompanyInfoResponseSchema>;

export const AgendaPictureUrlsSchema = z.object({
  medium: z.string(),
  hd: z.string()
});

export type AgendaPictureUrls = z.infer<typeof AgendaPictureUrlsSchema>;

export const AgendaLanguageSchema = z.object({
  name_iso: z.string(),
  name_native: z.string()
});

export type AgendaLanguage = z.infer<typeof AgendaLanguageSchema>;

export const AgendaSchema = z.object({
  id: z.number(),
  name: z.string(),
  pictureUrls: AgendaPictureUrlsSchema.optional().nullable(),
  hasServices: z.boolean(),
  languages: z.array(AgendaLanguageSchema),
  fixedStartTime: z.number()
});

export type Agenda = z.infer<typeof AgendaSchema>;

export const AgendasResponseSchema = z.array(AgendaSchema);

export type AgendasResponse = z.infer<typeof AgendasResponseSchema>;

export const BookableServiceSchema = z.object({
  type: z.string(),
  id: z.number(),
  agendasId: z.array(z.number()),
  name: z.string(),
  groupId: z.number().nullable(),
  groupName: z.string().nullable(),
  duration: z.number(),
  pictureUrls: z.array(AgendaPictureUrlsSchema),
  widgetSlotSelectionComment: z.string().nullable(),
  isTeleconsultation: z.boolean(),
  currency: z.string(),
  paymentMode: z.string(),
  position: z.number(),
  maxParticipantPerBooking: z.number(),
  bookablesAttributes: z.array(z.any()),
  hasResources: z.boolean(),
  showNewCustomerPrompt: z.boolean(),
  voucher_templates: z.array(z.any()),
  hideDuration: z.boolean(),
  locationIds: z.array(z.number()),
  bookingViewIds: z.array(z.number()),
  isAtHome: z.boolean(),
  fluidBooking: z.boolean(),
  hiddenOnWidget: z.boolean(),
  payByVoucher: z.boolean(),
  waitingListEnabled: z.boolean(),
  restrictedTo: z.any().nullable(),
  hasCustomServices: z.boolean(),
  description: z.string().optional(),
  priceComment: z.string().optional(),
  paymentPrice: z.number().optional()
});

export type BookableService = z.infer<typeof BookableServiceSchema>;

export const BookablesResponseSchema = z.object({
  services: z.array(BookableServiceSchema)
});

export type BookablesResponse = z.infer<typeof BookablesResponseSchema>;
