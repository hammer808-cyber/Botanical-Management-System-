import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../firebase';
import { format } from 'date-fns';
import { globalEventTimestamp, resolveEventTarget } from '../lib/writeGuards';

export type EventType = 'Watering' | 'Fertilizing' | 'Pruning' | 'Harvesting' | 'Pest Control' | 'Soil Amendment' | 'Propagation' | 'Task' | 'Treatment' | 'Weeding' | 'Health Check' | 'Manual';

interface LogEventParams {
  ownerUid: string;
  category: string; // e.g., 'treatments', 'weeding_events', 'fertilizing_events'
  data: any; // The full technical record
  calendarTitle: string;
  calendarDescription: string;
  eventType: EventType;
  date?: string; // YYYY-MM-DD
  targetId?: string;
  targetType?: string;
}

/**
 * Universal logEvent utility for Dual-Write logic.
 * Saves full record to category source, simplified entry to Calendar,
 * and a master entry to Global_Events.
 */
export async function logEvent({
  ownerUid,
  category,
  data,
  calendarTitle,
  calendarDescription,
  eventType,
  date = format(new Date(), 'yyyy-MM-dd'),
  targetId,
  targetType
}: LogEventParams) {
  try {
    // 1. Save full technical record to the specific Category Source
    const categoryRef = collection(db, category);
    const target = resolveEventTarget({
      targetId,
      targetType,
      dataTargetId: data.targetId,
      dataTargetType: data.targetType,
      plantId: data.plantId,
      plotId: data.plotId,
    });
    const technicalRecord: Record<string, any> = {
      ...data,
      ownerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (target.targetId) technicalRecord.targetId = target.targetId;
    else delete technicalRecord.targetId;
    if (target.targetType) technicalRecord.targetType = target.targetType;
    else delete technicalRecord.targetType;
    const docRef = await addDoc(categoryRef, technicalRecord);

    // 2. Emit a simplified 'When/Where' entry to the Calendar Tab
    const calendarRef = collection(db, 'calendar_events');
    await addDoc(calendarRef, {
      ownerUid,
      title: calendarTitle,
      description: calendarDescription,
      date: date,
      type: eventType,
      priority: 'Medium',
      plotId: data.plotId || (targetType === 'SpatialPlot' ? targetId : null),
      sourceId: docRef.id,
      sourceCategory: category,
      createdAt: serverTimestamp(),
    });

    // 3. Master entry to Global_Events for SSOT
    const globalRef = collection(db, 'global_events');
    await addDoc(globalRef, {
      ...technicalRecord,
      eventType,
      sourceId: docRef.id,
      sourceCategory: category,
      xpEarned: data.xpEarned || 0,
      timestamp: globalEventTimestamp(data),
    });

    return docRef;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${category} & calendar_events & global_events`);
    throw error;
  }
}
