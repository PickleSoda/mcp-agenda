
import { AgendaClient } from '../src/services/agenda-client';

const COMPANY_ID = process.env.COMPANY_ID || '10068'; 

async function runTestFlow() {
  console.log(`Starting test flow for Company ID: ${COMPANY_ID}`);

  try {
    // 1. Get Company Info
    console.log('\n--- 1. Fetching Company Info ---');
    const companyInfo = await AgendaClient.getCompanyInfo(COMPANY_ID);
    console.log('Company Name:', companyInfo.name);
    
    const locationId = companyInfo.locations[0]?.id;
    if (!locationId) {
      throw new Error('No locations found');
    }
    console.log('Found Location ID:', locationId);

    // 2. Get Bookables (Services)
    console.log('\n--- 2. Fetching Bookables ---');
    const bookables = await AgendaClient.getBookables(COMPANY_ID);
    console.log(`Found ${bookables.length} bookables.`);
    
    // Find first service that is not hidden on widget
    const visibleBookables = bookables.filter(b => !b.hiddenOnWidget);
    console.log('Visible Services:', visibleBookables.map(b => `${b.name} (${b.id})`).join('\n'));
    
    const service = visibleBookables[0];
    if (!service) {
      throw new Error('No visible services found');
    }

    // 3. Get Agendas (Staff)
    console.log('\n--- 3. Fetching Agendas ---');
    const agendas = await AgendaClient.getAgendas(COMPANY_ID);
    console.log(`Found ${agendas.length} agendas.`);
    // agenda_id can be 'anyone' or a specific ID.
    const agendaId = 'anyone'; // or agendas[0].id.toString()

    // 4. Get Availabilities
    console.log('\n--- 4. Fetching Availabilities (Trying to find a service with slots) ---');
    const today = new Date().toISOString().split('T')[0];
    
    let selectedSlot: { start: number; end: string } | null = null;
    let selectedDate: string = '';
    let selectedService = service;

    // Try ALL visible services (limit 10 to avoid too many requests if many fail)
    const servicesToTry = visibleBookables.slice(0, 10);

    for (const s of servicesToTry) {
        console.log(`Checking availability for: ${s.name} (ID: ${s.id})`);
        try {
            const availabilities = await AgendaClient.getAvailabilities(
                COMPANY_ID,
                today,
                s.id,
                locationId,
                agendaId,
                '3months'
            );

            for (const [date, slots] of Object.entries(availabilities)) {
                if (Array.isArray(slots) && slots.length > 0) {
                    selectedSlot = slots[0];
                    selectedDate = date;
                    selectedService = s;
                    break;
                }
            }
        } catch (err) {
            console.log(`Failed to check availability for ${s.name}: ${(err as Error).message}`);
        }
        
        if (selectedSlot) break;
    }
    
    if (!selectedSlot) {
      console.log('No slots found for any of the tested services in the next 3 months.');
    } else {
      console.log('Found Slot for:', selectedService.name);
      console.log('Date:', selectedDate, 'at', new Date(selectedSlot.start * 1000).toLocaleTimeString());
      
      // 5. Configure Booking (Pre-check)
      console.log('\n--- 5. Configuring Booking ---');
      const email = 'test@example.com';
      const config = await AgendaClient.configureBooking(
        COMPANY_ID,
        email,
        selectedService.id,
        1,
        '',
        'en'
      );
      
      console.log('Is Known Customer:', config.is_known);
      if (config.fields) {
          console.log('Required Fields:', config.fields.map(f => f.name).join(', '));
      }

      // 6. Confirm Booking (Dry Run - creating payload only)
      console.log('\n--- 6. Confirming Booking (Dry Run - creating payload only) ---');
      console.log('Skipping actual confirmation to avoid spamming the production API.');
    }

  } catch (error: any) {
    console.error('Test Flow Failed:', error.message);
    if (error.response) {
      console.error('API Error Data:', error.response.data);
    } else if (error instanceof Error) {
        console.error('Stack:', error.stack);
    }
  }
}

runTestFlow();
