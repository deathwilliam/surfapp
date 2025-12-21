import { isSameDay } from 'date-fns';

const getLocalDay = (d: Date | string) => {
    const dateObj = new Date(d);
    return new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
};

async function main() {
    console.log('--- TIMEZONE LOGIC SIMULATION ---');

    // Test Case: Slot is "2025-12-21T00:00:00Z" (Midnight UTC)
    // Local Time (El Salvador/CST): 2025-12-20T18:00:00
    // "Today" (Local): 2025-12-21

    const slotDateUTC = "2025-12-21T00:00:00.000Z";
    const todayLocal = new Date(); // Simulating 2025-12-21 local time

    // Override today for consistency in test if real time changes
    // Assuming today IS Dec 21 for the test
    const mockToday = new Date('2025-12-21T12:00:00'); // Noon local time

    console.log(`Slot UTC String: ${slotDateUTC}`);
    console.log(`Mock Today Local: ${mockToday.toString()}`);

    const directDate = new Date(slotDateUTC);
    console.log(`Direct new Date(slot): ${directDate.toString()}`);
    console.log(`Direct isSameDay match? ${isSameDay(directDate, mockToday)}`); // Likely False in Western Hemisphere

    const localDay = getLocalDay(slotDateUTC);
    console.log(`getLocalDay(slot): ${localDay.toString()}`);
    console.log(`getLocalDay isSameDay match? ${isSameDay(localDay, mockToday)}`); // Should be True

    if (isSameDay(localDay, mockToday)) {
        console.log('✅ PASS: getLocalDay correctly matches the calendar day regardless of timezone.');
    } else {
        console.error('❌ FAIL: getLocalDay did not match.');
    }
}

main();
