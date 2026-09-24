import { Inhabitant, EventLog, WeatherRecord, Expense, SpatialPlot } from '../types';
import { differenceInDays, parseISO, format } from 'date-fns';

/**
 * 1. Vigor & Vitality Weighted Algorithm
 * V_i = (G_act / G_exp) * (1 - 0.1 * P_i)
 */
export function calculateVigorIndex(
  inhabitant: Inhabitant,
  activeTreatments: EventLog[]
): number {
  const gAct = inhabitant.actualGrowthRate || 0;
  const gExp = inhabitant.expectedGrowthRate || 1; // Avoid division by zero
  const pi = activeTreatments.filter(t => t.type === 'Treatment').length;
  
  const vigor = (gAct / gExp) * (1 - 0.1 * pi);
  return Math.max(0, Math.min(1, vigor));
}

/**
 * 2. ETc (Evapotranspiration) Irrigation
 * Penman-Monteith Equation (Simplified for this context)
 * ET_0 = Reference ET
 * ET_c = ET_0 * K_c
 */
export function calculateETc(
  weather: WeatherRecord,
  cropCoefficient: number
): number {
  // Simplified Penman-Monteith for demonstration
  const tempAvg = (weather.tempMax + weather.tempMin) / 2;
  const et0 = weather.et0 || (0.0023 * (tempAvg + 17.8) * Math.sqrt(weather.tempMax - weather.tempMin) * 0.408 * weather.solarRadiation);
  
  return et0 * cropCoefficient;
}

/**
 * 3. Financial "Cost-per-Yield" (CPY) Analysis
 */
export function calculateCPY(
  inhabitant: Inhabitant,
  expenses: Expense[]
): { totalCost: number; cpy: number } {
  const totalYield = inhabitant.totalYield || 0;
  if (totalYield <= 0) return { totalCost: 0, cpy: 0 };

  const amortizedCost = expenses.reduce((acc, e) => acc + (e.category === 'Tools' ? e.amount / 60 : 0), 0);
  const consumableCost = expenses.reduce((acc, e) => acc + (e.category !== 'Tools' ? e.amount : 0), 0);
  
  const totalCost = amortizedCost + consumableCost;
  return {
    totalCost,
    cpy: totalCost / totalYield
  };
}

/**
 * 4. Phenological Stage Tracking (GDD)
 * GDD = ((T_max + T_min) / 2) - T_base
 */
export function calculateGDD(
  weather: WeatherRecord,
  baseTemp: number
): number {
  const gdd = ((weather.tempMax + weather.tempMin) / 2) - baseTemp;
  return Math.max(0, gdd);
}

/**
 * 5. Automated "Treatment" Conflict Checker
 */
export function checkTreatmentConflict(
  newTreatmentType: string,
  recentLogs: EventLog[]
): { conflict: boolean; message?: string; conflictingLog?: EventLog } {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const conflicts = {
    'Neem Oil': ['Sulfur'],
    'Sulfur': ['Neem Oil']
  };

  const recentTreatments = recentLogs.filter(log => 
    (log.type === 'Treatment' || log.eventType === 'Treatment') && 
    new Date(log.date) >= fourteenDaysAgo
  );

  for (const log of recentTreatments) {
    const existingType = log.treatmentType || (log.data?.type === 'Treatment' ? log.data.action : null);
    if (existingType && conflicts[newTreatmentType as keyof typeof conflicts]?.includes(existingType)) {
      return {
        conflict: true,
        conflictingLog: log,
        message: `Phytotoxicity Warning: ${newTreatmentType} conflicts with ${existingType} applied on ${log.date}. (14-day safety window required)`
      };
    }
  }

  return { conflict: false };
}

/**
 * 6. Lifecycle Monitor Service (Temporal Logic)
 * Categorizes plants into seasonal cohorts and calculates Urgency Index (U).
 */
export function calculateUrgencyIndex(pullDate: string): { urgency: number; daysRemaining: number; color: string } {
  const now = new Date();
  const target = new Date(pullDate);
  const daysRemaining = differenceInDays(target, now);
  
  if (daysRemaining < 0) return { urgency: 100, daysRemaining, color: 'text-red-600' };
  
  // U = 1 / (D_rem + 1) * 100 (scaled for UI)
  // Using an exponential-like curve for better visualization
  const urgency = Math.min(100, (1 / (daysRemaining + 1)) * 500);
  
  let color = 'text-green-500';
  if (daysRemaining <= 7) color = 'text-red-600';
  else if (daysRemaining <= 14) color = 'text-amber-500';
  
  return { urgency, daysRemaining, color };
}

export function getSeasonalCohort(inhabitant: Inhabitant): string {
  const pullDate = inhabitant.pullDate;
  if (!pullDate) return 'Ongoing';
  
  const date = new Date(pullDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if (month === 11 && day === 15) return 'Winter Closeout';
  if (month === 5 && day === 15) return 'Spring Transition';
  if (month === 8 && day === 15) return 'Fall Prep';
  if (month === 3 && day === 15) return 'Summer Kickoff';
  
  return 'Custom';
}

/**
 * 7. Spatial Recommendation Engine
 * Calculates Suitability Score (S) for a grid cell.
 */
/**
 * Normalizes a plant name for companion lookups.
 * Quiz/database names carry variety suffixes ("Tomato 'Celebrity'",
 * "Eggplant (Black Beauty)") and near-duplicates ("Strawberries",
 * "Green Pepper") that all share the base plant's companions.
 */
const NAME_ALIASES: Record<string, string> = {
  'Green Pepper': 'Pepper',
  'Strawberries': 'Strawberry',
  'Lemon Cucumber': 'Cucumber',
};

export function normalizePlantName(name: string): string {
  const aliased = NAME_ALIASES[name] ?? name;
  return aliased
    .replace(/\s*\([^)]*\)/g, '') // (Black Beauty), (San Marzano)
    .replace(/\s*'[^']*'/g, '') // 'Celebrity'
    .trim();
}

export const BOTANICAL_RELATIONS: Record<string, { friends: string[]; enemies: string[] }> = {
  // --- Vegetables ---
  'Tomato': { friends: ['Basil', 'Marigold', 'Carrot', 'Onion', 'Garlic', 'Lettuce', 'Parsley', 'Asparagus', 'Nasturtium', 'Borage'], enemies: ['Fennel', 'Walnut', 'Potato', 'Corn', 'Cabbage', 'Kale', 'Broccoli'] },
  'Pepper': { friends: ['Basil', 'Marigold', 'Onion', 'Tomato', 'Oregano', 'Parsley'], enemies: ['Fennel', 'Kale'] },
  'Eggplant': { friends: ['Marigold', 'Green Beans', 'Pepper', 'Thyme', 'Tarragon'], enemies: ['Fennel'] },
  'Green Beans': { friends: ['Corn', 'Cucumber', 'Eggplant', 'Carrot', 'Radish', 'Potato', 'Strawberry', 'Cabbage', 'Rosemary', 'Oregano'], enemies: ['Onion', 'Garlic', 'Chives', 'Sunflower'] },
  'Corn': { friends: ['Green Beans', 'Cucumber', 'Potato', 'Pea', 'Sunflower', 'Parsley', 'Zucchini'], enemies: ['Tomato'] },
  'Cucumber': { friends: ['Corn', 'Green Beans', 'Marigold', 'Radish', 'Nasturtium', 'Sunflower', 'Pea', 'Lettuce', 'Dill', 'Chamomile'], enemies: ['Sage', 'Potato'] },
  'Zucchini': { friends: ['Corn', 'Green Beans', 'Marigold', 'Nasturtium', 'Sunflower'], enemies: ['Potato'] },
  'Gourd/Squash': { friends: ['Corn', 'Green Beans', 'Marigold', 'Nasturtium', 'Borage'], enemies: ['Potato'] },
  'Onion': { friends: ['Carrot', 'Lettuce', 'Tomato', 'Pepper', 'Cabbage', 'Beet', 'Strawberry', 'Chard', 'Chamomile'], enemies: ['Green Beans', 'Pea', 'Asparagus'] },
  'Garlic': { friends: ['Tomato', 'Carrot', 'Lettuce', 'Pepper', 'Cabbage', 'Beet', 'Chamomile'], enemies: ['Green Beans', 'Pea', 'Asparagus'] },
  'Chives': { friends: ['Carrot', 'Tomato', 'Pepper', 'Cucumber'], enemies: ['Green Beans', 'Pea'] },
  'Carrot': { friends: ['Onion', 'Garlic', 'Tomato', 'Lettuce', 'Rosemary', 'Pea', 'Sage', 'Chives', 'Lavender'], enemies: ['Dill'] },
  'Lettuce': { friends: ['Carrot', 'Onion', 'Garlic', 'Radish', 'Strawberry', 'Cucumber', 'Sweet Alyssum'], enemies: ['Broccoli', 'Cabbage'] },
  'Potato': { friends: ['Green Beans', 'Corn', 'Cabbage', 'Marigold', 'Sweet Alyssum'], enemies: ['Tomato', 'Cucumber', 'Sunflower', 'Zucchini', 'Gourd/Squash'] },
  'Cabbage': { friends: ['Onion', 'Garlic', 'Dill', 'Rosemary', 'Nasturtium', 'Marigold', 'Potato', 'Beet', 'Chamomile', 'Thyme', 'Mint', 'Oregano', 'Borage'], enemies: ['Tomato', 'Strawberry', 'Green Beans', 'Lettuce'] },
  'Broccoli': { friends: ['Onion', 'Garlic', 'Dill', 'Rosemary', 'Nasturtium', 'Potato', 'Beet', 'Chamomile', 'Thyme'], enemies: ['Tomato', 'Strawberry', 'Lettuce'] },
  'Kale': { friends: ['Onion', 'Garlic', 'Dill', 'Potato', 'Beet', 'Nasturtium', 'Thyme'], enemies: ['Tomato', 'Strawberry', 'Pepper'] },
  'Brussels Sprouts': { friends: ['Onion', 'Garlic', 'Dill', 'Potato', 'Nasturtium'], enemies: ['Tomato'] },
  'Radish': { friends: ['Cucumber', 'Lettuce', 'Carrot', 'Pea', 'Nasturtium', 'Spinach'], enemies: [] },
  'Pea': { friends: ['Carrot', 'Cucumber', 'Corn', 'Radish', 'Lettuce', 'Calendula'], enemies: ['Onion', 'Garlic', 'Chives'] },
  'Spinach': { friends: ['Strawberry', 'Pea', 'Green Beans', 'Radish', 'Cilantro'], enemies: [] },
  'Strawberry': { friends: ['Green Beans', 'Lettuce', 'Onion', 'Spinach', 'Thyme', 'Borage'], enemies: ['Cabbage', 'Broccoli', 'Kale'] },
  'Beet': { friends: ['Onion', 'Garlic', 'Lettuce', 'Cabbage', 'Chard'], enemies: [] },
  'Chard': { friends: ['Onion', 'Beet', 'Lettuce'], enemies: [] },
  'Asparagus': { friends: ['Tomato', 'Parsley', 'Basil', 'Calendula'], enemies: ['Onion', 'Garlic'] },
  // --- Herbs ---
  'Basil': { friends: ['Tomato', 'Pepper', 'Asparagus'], enemies: ['Rue', 'Sage'] },
  'Dill': { friends: ['Cabbage', 'Broccoli', 'Onion', 'Lettuce', 'Cucumber', 'Brussels Sprouts', 'Kale'], enemies: ['Carrot'] },
  'Parsley': { friends: ['Tomato', 'Corn', 'Asparagus', 'Pepper'], enemies: [] },
  'Rosemary': { friends: ['Carrot', 'Cabbage', 'Green Beans', 'Sage', 'Broccoli'], enemies: [] },
  'Sage': { friends: ['Carrot', 'Cabbage', 'Rosemary', 'Strawberry'], enemies: ['Cucumber', 'Rue', 'Basil'] },
  'Thyme': { friends: ['Eggplant', 'Strawberry', 'Cabbage', 'Broccoli', 'Kale'], enemies: [] },
  'Oregano': { friends: ['Pepper', 'Green Beans', 'Cabbage'], enemies: [] },
  'Cilantro': { friends: ['Tomato', 'Pepper', 'Spinach'], enemies: [] },
  'Mint': { friends: ['Tomato', 'Cabbage'], enemies: [] },
  'Chamomile': { friends: ['Cabbage', 'Onion', 'Cucumber', 'Broccoli'], enemies: [] },
  'Borage': { friends: ['Tomato', 'Strawberry', 'Cabbage', 'Gourd/Squash'], enemies: [] },
  'Lemon Balm': { friends: ['Tomato'], enemies: [] },
  'Rue': { friends: [], enemies: ['Basil', 'Sage'] },
  'Tarragon': { friends: ['Eggplant', 'Pepper'], enemies: [] },
  'Lavender': { friends: ['Carrot'], enemies: [] },
  // --- Flowers ---
  'Marigold': { friends: ['Tomato', 'Pepper', 'Eggplant', 'Cucumber', 'Green Beans', 'Potato', 'Cabbage', 'Zucchini', 'Gourd/Squash'], enemies: [] },
  'Nasturtium': { friends: ['Cucumber', 'Cabbage', 'Broccoli', 'Tomato', 'Zucchini', 'Radish', 'Gourd/Squash', 'Kale'], enemies: [] },
  'Sunflower': { friends: ['Cucumber', 'Corn', 'Zucchini'], enemies: ['Potato', 'Green Beans'] },
  'Calendula': { friends: ['Tomato', 'Asparagus', 'Pea'], enemies: [] },
  'Sweet Alyssum': { friends: ['Lettuce', 'Potato'], enemies: [] },
  'Zinnia': { friends: ['Tomato', 'Pepper'], enemies: [] },
  'Cosmos': { friends: ['Tomato', 'Pepper'], enemies: [] },
  'Bee Balm': { friends: ['Tomato', 'Pepper'], enemies: [] },
};

/**
 * 7b. Companion Checker
 * Bidirectional companion/antagonist conflict detection between a plant
 * and its grid neighbors. Returns one entry per conflicting neighbor.
 */
export interface CompanionConflict {
  neighborId: string;
  neighborName: string;
  type: 'enemy' | 'family';
  message: string;
}

function areEnemies(nameA: string, nameB: string): boolean {
  const a = normalizePlantName(nameA);
  const b = normalizePlantName(nameB);
  if (a === b) return false;
  const relA = BOTANICAL_RELATIONS[a];
  const relB = BOTANICAL_RELATIONS[b];
  return (
    (relA?.enemies.includes(b) ?? false) ||
    (relB?.enemies.includes(a) ?? false)
  );
}

export function checkCompanionConflicts(
  plant: { name: string; familyId?: string },
  position: { x: number; y: number },
  neighbors: { id: string; name: string; familyId?: string; gridPosition: { x: number; y: number } }[]
): CompanionConflict[] {
  const conflicts: CompanionConflict[] = [];
  const adjacent = neighbors.filter(
    (n) =>
      Math.abs(n.gridPosition.x - position.x) <= 1 &&
      Math.abs(n.gridPosition.y - position.y) <= 1 &&
      !(n.gridPosition.x === position.x && n.gridPosition.y === position.y)
  );

  for (const n of adjacent) {
    if (areEnemies(plant.name, n.name)) {
      conflicts.push({
        neighborId: n.id,
        neighborName: n.name,
        type: 'enemy',
        message: `${plant.name} and ${n.name} are antagonists — they compete for nutrients and stunt each other's growth.`,
      });
    } else if (plant.familyId && n.familyId && plant.familyId === n.familyId) {
      conflicts.push({
        neighborId: n.id,
        neighborName: n.name,
        type: 'family',
        message: `${plant.name} and ${n.name} are both ${plant.familyId} — same-family neighbors share pests and drain the same nutrients. Give them space.`,
      });
    }
  }
  return conflicts;
}

export function calculateSuitabilityScore(
  x: number,
  y: number,
  newPlant: Partial<Inhabitant>,
  plot: SpatialPlot,
  allInhabitants: Inhabitant[]
): number {
  let score = 50; // Base score
  
  // 1. Companion/Antagonist Logic
  const neighbors = allInhabitants.filter(p => 
    p.plotId === plot.id && 
    Math.abs(p.gridPosition.x - x) <= 1 && 
    Math.abs(p.gridPosition.y - y) <= 1 &&
    !(p.gridPosition.x === x && p.gridPosition.y === y)
  );
  
  const relations = BOTANICAL_RELATIONS[normalizePlantName(newPlant.name || '')] || { friends: [], enemies: [] };
  
  neighbors.forEach(neighbor => {
    const neighborName = normalizePlantName(neighbor.name);
    if (relations.friends.includes(neighborName)) score += 10;
    if (relations.enemies.includes(neighborName)) score -= 20;
    
    // Family check (Allelopathy/Antagonism)
    if (neighbor.familyId === newPlant.familyId) score -= 5;
  });
  
  // 2. Crop Rotation
  const currentYear = new Date().getFullYear();
  const recentHistory = plot.cropHistory?.filter(h => h.year >= currentYear - 2) || [];
  const sameFamilyHistory = recentHistory.find(h => h.familyId === newPlant.familyId);
  if (sameFamilyHistory) score -= 15;
  
  // 3. Light/Microclimate (Simplified)
  if (newPlant.sunExposure === plot.sunlight) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * 8. Case Manager Triggers
 */
export function checkMonoculture(inhabitants: Inhabitant[]): { isMonoculture: boolean; dominantFamily?: string; percentage?: number } {
  if (inhabitants.length < 3) return { isMonoculture: false };
  
  const familyCounts: Record<string, number> = {};
  inhabitants.forEach(p => {
    if (p.familyId) familyCounts[p.familyId] = (familyCounts[p.familyId] || 0) + 1;
  });
  
  for (const familyId in familyCounts) {
    const percentage = (familyCounts[familyId] / inhabitants.length) * 100;
    if (percentage > 30) {
      return { 
        isMonoculture: true, 
        dominantFamily: familyId,
        percentage
      };
    }
  }
  
  return { isMonoculture: false };
}

export function getRecommendedSuccessor(inhabitants: Inhabitant[]): { recommendedCrop: string; reason: string } {
  const heavyFeeders = inhabitants.filter(p => p.nutrientDraw === 'Heavy');
  if (heavyFeeders.length > 0) {
    return { 
      recommendedCrop: 'Beans or Clover', 
      reason: 'To restore nitrogen after heavy feeders like ' + heavyFeeders[0].name 
    };
  }
  
  const solanaceae = inhabitants.filter(p => p.familyId === 'Solanaceae');
  if (solanaceae.length > 0) {
    return { 
      recommendedCrop: 'Carrots or Onions', 
      reason: 'To break pest cycles common to the Solanaceae family.' 
    };
  }

  return { 
    recommendedCrop: 'General Cover Crop', 
    reason: 'Maintain soil health between major planting cycles.' 
  };
}

/**
 * 9. Weeding Gamification & Invasion Biology
 */
export const WEED_LIBRARY: Record<string, { threat: number; regeneration: number; icon: string }> = {
  'Crabgrass': { threat: 8, regeneration: 1.2, icon: '🌾' },
  'Purslane': { threat: 4, regeneration: 1.5, icon: '🌿' },
  'Dandelion': { threat: 6, regeneration: 1.8, icon: '🌼' },
  'Bindweed': { threat: 10, regeneration: 2.5, icon: '🌀' },
  'Mallow': { threat: 5, regeneration: 1.4, icon: '🌸' },
};

/**
 * Propagule Pressure Index (P_i)
 * P_i = (R * S) / (Delta T + 1)
 */
export function calculateInvasionPressure(
  weedType: string,
  wentToSeed: boolean,
  lastWeededDate: string
): number {
  const weed = WEED_LIBRARY[weedType] || { threat: 5, regeneration: 1.0 };
  const r = weed.regeneration;
  const s = wentToSeed ? 10 : 1;
  const deltaT = differenceInDays(new Date(), new Date(lastWeededDate));
  
  // Scale to 0-100
  const pressure = (r * s) / (deltaT + 1) * 10;
  return Math.min(100, pressure);
}

/**
 * Weeding Efficiency Quotient (WEQ)
 * WEQ = (Area * Intensity) / Time
 */
export function calculateWEQ(
  areaCleared: number, // sq ft
  intensity: number, // 1-10
  timeSpent: number // minutes
): number {
  if (timeSpent <= 0) return 0;
  return (areaCleared * intensity) / timeSpent;
}

/**
 * Sunflower Health Normalization
 * H_total = (Avg_V_i * 0.4) + (Water_status * 0.3) + (Pest_status * 0.3)
 */
export function calculateSunflowerHealth(
  avgVigor: number, // 0-100
  thirstyCount: number,
  totalPlants: number,
  activePests: number
): number {
  if (totalPlants === 0) return 1;
  
  const waterStatus = 1 - (thirstyCount / totalPlants);
  const pestStatus = Math.max(0, 1 - (activePests / totalPlants));
  
  return (avgVigor / 100 * 0.4) + (waterStatus * 0.3) + (pestStatus * 0.3);
}
export function processInhabitantEliteMetrics(
  inhabitant: Inhabitant,
  logs: EventLog[],
  weather: WeatherRecord,
  expenses: Expense[]
): Partial<Inhabitant> {
  const activeTreatments = logs.filter(l => l.targetId === inhabitant.id && (l.type === 'Treatment' || l.eventType === 'Treatment'));
  
  // 1. Vigor Index
  const vigorIndex = calculateVigorIndex(inhabitant, activeTreatments);
  
  // 2. GDD Accumulation
  const dailyGDD = calculateGDD(weather, inhabitant.baseTemperature || 10);
  const cumulativeGDD = (inhabitant.cumulativeGDD || 0) + dailyGDD;
  
  // 3. Status update based on GDD (Example threshold)
  let status = inhabitant.status;
  if (cumulativeGDD > 500 && status === 'Vegetative') {
    status = 'Flowering';
  }

  // 4. Financials
  const inhabitantExpenses = expenses.filter(e => e.plotId === inhabitant.plotId);
  const { cpy } = calculateCPY(inhabitant, inhabitantExpenses);

  // 5. Urgency & Cohort
  const { urgency } = inhabitant.pullDate ? calculateUrgencyIndex(inhabitant.pullDate) : { urgency: 0 };
  const seasonalCohort = getSeasonalCohort(inhabitant);

  // 6. ETc
  const etc = calculateETc(weather, inhabitant.cropCoefficient || 1.0);

  return {
    vigorIndex: Math.round(vigorIndex * 100),
    cumulativeGDD,
    status,
    urgencyIndex: urgency / 100,
    seasonalCohort,
    etc,
    cpy
  };
}
