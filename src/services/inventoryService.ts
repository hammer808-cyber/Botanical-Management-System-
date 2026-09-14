/**
 * Service for sending session data to an external inventory sync (e.g., Google Sheets via Apps Script)
 */

export interface SessionPayload {
  ownerUid: string;
  plantId: string | null;
  session_date: string;
  types: string[];
  notes: string;
}

export async function sendToInventorySync(payload: SessionPayload): Promise<void> {
  // This URL would typically be a Google Apps Script Web App URL or a Cloud Run endpoint
  // We'll use an environment variable if available, otherwise a placeholder
  const INVENTORY_SYNC_URL = import.meta.env.VITE_INVENTORY_SYNC_URL || import.meta.env.VITE_LEDGER_URL || '';

  if (!INVENTORY_SYNC_URL) {
    console.warn('VITE_INVENTORY_SYNC_URL not defined. Skipping external inventory sync.');
    return;
  }

  try {
    const response = await fetch(INVENTORY_SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Inventory sync failed: ${response.statusText}`);
    }

    console.log('Successfully synced to external inventory');
  } catch (error) {
    console.error('Error syncing to inventory:', error);
    // We don't necessarily want to block the app if the external sync fails,
    // but we should log it.
    throw error;
  }
}
