import { Plant } from '../types';

export const generateTasksForPlants = (plants: Plant[], uid: string) => {
  const today = new Date();

  return plants.flatMap(plant => {
    const lastWatered = plant.lastWatered
      ? new Date(plant.lastWatered)
      : new Date(0);

    const daysSinceWater =
      (today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24);

    const tasks: any[] = [];

    if (daysSinceWater >= plant.waterFrequencyDays) {
      tasks.push({
        title: `Water ${plant.name}`,
        type: 'water',
        dueDate: today.toISOString(),
        completed: false,
        plantId: plant.id,
        ownerUid: uid
      });
    }

    // weekly inspection
    tasks.push({
      title: `Inspect ${plant.name}`,
      type: 'inspect',
      dueDate: today.toISOString(),
      completed: false,
      plantId: plant.id,
      ownerUid: uid
    });

    return tasks;
  });
};