/**
 * syncWatering Google Apps Script
 * 
 * Aggregation Logic: Groups all plants by their calculated watering date.
 * Consolidated Formatting: Creates one single Calendar event per unique date.
 * Efficiency: Uses a JavaScript Object to store dates as keys and arrays of plant names as values.
 * Cleanup: Clears existing consolidated events to prevent duplicates.
 */

function syncWatering() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inventorySheet = ss.getSheetByName('Inventory');
  const calendarSheet = ss.getSheetByName('Calendar'); // Buffer sheet for calendar events
  
  if (!inventorySheet || !calendarSheet) {
    Logger.log('Required sheets (Inventory or Calendar) not found.');
    return;
  }

  // 1. Get data from Inventory
  const data = inventorySheet.getDataRange().getValues();
  const headers = data.shift();
  
  // Find column indices (adjust these to match your actual Inventory sheet structure)
  const plantNameIdx = headers.indexOf('Plant Name');
  const wateringDateIdx = headers.indexOf('Next Watering');
  
  if (plantNameIdx === -1 || wateringDateIdx === -1) {
    Logger.log('Required columns (Plant Name, Next Watering) not found in Inventory.');
    return;
  }

  // 2. Aggregation Phase: Group plants by date
  const wateringMap = {}; // { "YYYY-MM-DD": ["Plant A", "Plant B"] }

  data.forEach(row => {
    const plantName = row[plantNameIdx];
    const rawDate = row[wateringDateIdx];
    
    if (plantName && rawDate) {
      try {
        const dateObj = new Date(rawDate);
        if (isNaN(dateObj.getTime())) return; // Skip invalid dates
        
        const dateStr = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
        
        if (!wateringMap[dateStr]) {
          wateringMap[dateStr] = [];
        }
        wateringMap[dateStr].push(plantName);
      } catch (e) {
        Logger.log('Error processing date for plant: ' + plantName);
      }
    }
  });

  // 3. Cleanup: Clear the Calendar sheet to avoid duplicates
  calendarSheet.clear();
  calendarSheet.appendRow(['Date', 'Event Title', 'Description']);
  
  // 4. Creation Phase: Write consolidated events to the Calendar sheet
  const sortedDates = Object.keys(wateringMap).sort();
  
  sortedDates.forEach(dateStr => {
    const plants = wateringMap[dateStr];
    const title = 'Watering Day';
    const description = plants.map(p => `• ${p}`).join('\n');
    
    calendarSheet.appendRow([dateStr, title, description]);
  });

  // Optional: Sync to Google Calendar directly
  // syncToGoogleCalendar(wateringMap);
  
  Logger.log('Watering sync complete. ' + sortedDates.length + ' consolidated events created.');
}

/**
 * Optional: Directly sync the aggregated map to Google Calendar
 */
function syncToGoogleCalendar(wateringMap) {
  const calendar = CalendarApp.getDefaultCalendar();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 60); // Sync for next 60 days

  // Delete existing "Watering Day" events in the range to prevent duplicates
  const existingEvents = calendar.getEvents(startDate, endDate, {search: 'Watering Day'});
  existingEvents.forEach(event => event.deleteEvent());

  // Create new consolidated events
  Object.keys(wateringMap).forEach(dateStr => {
    const eventDate = new Date(dateStr + "T00:00:00");
    if (eventDate >= startDate && eventDate <= endDate) {
      const plants = wateringMap[dateStr];
      const description = plants.map(p => `• ${p}`).join('\n');
      calendar.createAllDayEvent('Watering Day', eventDate, {
        description: description
      });
    }
  });
}
