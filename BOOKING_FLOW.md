# Agenda.ch Booking Flow Documentation

This document outlines the purpose of the initial API fetches and how they map to the user journey of creating a booking.

## 1. Initial Data Fetching (App Load)

When the booking widget loads, it fetches four key resources to build the application state.

### A. `GET /api_front/pro_users` (Company Info)
*   **Purpose:** The "master" configuration object. It defines **where** things happen and **who** works there.
*   **Key Data for Flow:**
    *   `locations`: An array of physical places (e.g., "Lion d'Or 4, Lausanne"). Each location has an `id` (e.g., `3826`) and a list of `service_ids` available there.
    *   `resources`: Groupings of services/locations, often used for internal logic or specific UI layouts.
    *   `paxCategories`: Categories for passenger/participant counts if applicable.
*   **Use in Flow:** Used to populate the **Location Selector** dropdown.

### B. `GET /api_front/bookables` (Services)
*   **Purpose:** The catalog of specific services a customer can buy.
*   **Key Data for Flow:**
    *   `id`: The service ID (e.g., `105925`).
    *   `name`: Display name (e.g., "Diagnostic de peau gratuit").
    *   `locationIds`: An array of Location IDs where this specific service is performed.
    *   `agendasId`: An array of Employee IDs who perform this service.
    *   `price`, `duration`: Display details.
*   **Use in Flow:** Used to populate the **Service Selector** list.

### C. `GET /book/classes` (Categories)
*   **Purpose:** High-level categorization of services (e.g., "Treatments", "Massages").
*   **Key Data for Flow:**
    *   `subclasses`: Often contains specific pricing variants or packages (e.g., "Pack 3 sessions").
*   **Use in Flow:** Used to group services in the UI to make the list less overwhelming.

### D. `GET /api_front/agendas` (Employees)
*   **Purpose:** Details about the staff members.
*   **Key Data for Flow:**
    *   `id`: Matches `agenda_ids` found in other endpoints.
    *   `name`, `pictureUrls`: For display purposes if the user is allowed to choose a specific practitioner.
*   **Use in Flow:** Used if the user selects a specific person ("Any practitioner" vs "Dr. Smith").

---

## 2. The Booking Flow Step-by-Step

Here is how to use the data above to construct the user's path.

### Step 1: Pick a Place (Location Selection)
1.  **Source:** `pro_users.locations`.
2.  **User Action:** Selects "Lion d'Or 4, Lausanne".
3.  **System Action:** Capture the `location_id` (e.g., `3826`).
4.  **Filtering:** You must now filter the **Services** list (`bookables`) to only show services where `locationIds` includes `3826`.

### Step 2: Pick a Service
1.  **Source:** Filtered `bookables` list from Step 1.
2.  **User Action:** Selects "Diagnostic de peau gratuit".
3.  **System Action:** Capture the `service_id` (e.g., `98289` or `105925`).
4.  **Prerequisite Check:** Ensure the service is linked to the selected location (verified in Step 1).

### Step 3: Choose Available Time
1.  **API Call:** `GET /api_front/pro_users/availabilities`
2.  **Required Params:**
    *   `company_id`: From config (e.g., `10068`).
    *   `location_ids[0]`: From Step 1 (`3826`).
    *   `bookables[0][id]`: From Step 2 (`105925`).
    *   `bookables[0][type]`: Usually "Service".
    *   `date`: The date to check (e.g., "2026-02-21").
    *   `agenda_id`: "anyone" (default) or a specific ID from the `agendas` list if the user picked a person.
3.  **Response:** Returns a list of available slots.
4.  **User Action:** Clicks "9:00 AM".
5.  **System Action:** Capture the `start` timestamp (ISO string).

### Step 4: Fill in Email (Configuration)
1.  **API Call:** `POST /api_front/bookings/configure`
2.  **Required Params:**
    *   `company_id`: `10068`
    *   `bookables[...]`: Service ID from Step 2.
    *   `email`: The user's input email.
3.  **Purpose:** The server checks if the user is new or returning and returns the specific **Form Fields** (`fields` array) required for this specific booking type.
4.  **System Action:** Render the form based on the response (e.g., First Name, Last Name, Phone, Custom Questions).

### Step 5: Fill in Rest of Fields & Confirm
1.  **User Action:** Fills out the dynamic form fields.
2.  **API Call:** `POST /api_front/bookings/confirm`
3.  **Required Params:**
    *   All collected IDs: `company_id`, `location_id`, `bookable_id`, `agenda_id` (optional).
    *   `start`: The chosen time slot.
    *   `email`: User email.
    *   `detail[...]`: The form data collected in Step 4.
    *   `accept_cancel_conditions`: "on".
4.  **Result:** Booking created. Returns `appointmentId`.
