export type PlantStage = 'seed' | 'seedling' | 'vegetative' | 'flowering' | 'harvest';

export interface Plant {
  id: string;
  name: string;
  variety?: string;
  location: string;
  plantedDate: string;
  stage: PlantStage;
  waterFrequencyDays: number;
  notes?: string;
  health?: 'thriving' | 'okay' | 'struggling';
  lastWatered?: string;
}

export interface Task {
  id: string;
  plantId?: string;
  title: string;
  type: 'water' | 'fertilize' | 'inspect' | 'harvest' | 'custom';
  dueDate: string;
  completed: boolean;
  ownerUid: string;
}

export interface LogEntry {
  id: string;
  plantId?: string;
  message: string;
  createdAt: string;
  ownerUid: string;
}