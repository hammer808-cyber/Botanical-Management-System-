import { normalizePlantName } from '../services/botanyService';

export type ThreatType = 'pest' | 'disease';
export type ThreatSeverity = 'low' | 'medium' | 'high';

/** Visual symptom tags used by the guided identifier. */
export type SymptomTag =
  | 'holes'
  | 'skeleton'
  | 'spots'
  | 'powder'
  | 'fuzz'
  | 'sticky'
  | 'webbing'
  | 'bugs-visible'
  | 'wilting'
  | 'discolored'
  | 'fruit-damage'
  | 'slime'
  | 'stunted'
  | 'tunnels';

export interface SymptomOption {
  tags: SymptomTag[];
  emoji: string;
  label: string;
}

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  { tags: ['holes'], emoji: '🕳️', label: 'Holes chewed in leaves' },
  { tags: ['bugs-visible'], emoji: '🐛', label: 'I can see bugs on it' },
  { tags: ['powder'], emoji: '⚪', label: 'White powdery coating' },
  { tags: ['fuzz'], emoji: '🍄', label: 'Fuzzy gray mold' },
  { tags: ['spots'], emoji: '🟡', label: 'Spots or patches on leaves' },
  { tags: ['wilting'], emoji: '🥀', label: 'Wilting or drooping' },
  { tags: ['discolored'], emoji: '🍂', label: 'Yellow or discolored leaves' },
  { tags: ['fruit-damage'], emoji: '🍅', label: 'Damaged fruit, buds, or flowers' },
  { tags: ['slime'], emoji: '🐌', label: 'Slimy trails' },
  { tags: ['webbing', 'sticky'], emoji: '🕸️', label: 'Webbing or sticky leaves' },
  { tags: ['stunted'], emoji: '🌱', label: 'Stunted or twisted growth' },
  { tags: ['tunnels'], emoji: '🥕', label: 'Tunnels in roots or stems' },
  { tags: ['skeleton'], emoji: '🍃', label: 'Lacy, skeletonized leaves' },
];

export interface PlantThreat {
  id: string;
  name: string;
  type: ThreatType;
  icon: string;
  /** Normalized plant names this threat targets (see normalizePlantName) */
  affects: string[];
  /** Visual symptom tags for the guided identifier */
  symptoms: SymptomTag[];
  /** 2 dead-simple steps: the easy solution */
  quickFix: string[];
  signs: string[];
  organicTreatment: string[];
  prevention: string[];
  severity: ThreatSeverity;
  /** Local reference photo path, e.g. "/threats/hornworm.jpg" */
  image?: string;
  /** Photo credit / source */
  credit?: string;
}

export const THREAT_LIBRARY: PlantThreat[] = [
  // ---------------- PESTS ----------------
  {
    id: 'hornworm',
    image: '/threats/hornworm.jpg',
    credit: 'The Homestead Post',
    name: 'Tomato Hornworm',
    type: 'pest',
    icon: '🐛',
    affects: ['Tomato', 'Pepper', 'Eggplant', 'Potato'],
    symptoms: ['holes', 'bugs-visible', 'fruit-damage'],
    quickFix: ['Pick off every caterpillar you find — check leaf undersides too', 'Spray Bt on the leaves; reapply after rain'],
    signs: ['Large ragged holes chewed in leaves, starting at the top', 'Dark green-black droppings (frass) on leaves below', 'Can strip a whole plant nearly overnight'],
    organicTreatment: ['Handpick at dawn or dusk — they glow under a UV flashlight at night', 'Spray Bt (Bacillus thuringiensis) on foliage', 'Leave white-cocooned ones alone: parasitic wasps are already handling them'],
    prevention: ['Till soil in fall to destroy overwintering pupae', 'Interplant marigolds and basil to confuse the moths'],
    severity: 'high',
  },
  {
    id: 'aphids',
    image: '/threats/aphids.jpg',
    credit: 'Vecteezy',
    name: 'Aphids',
    type: 'pest',
    icon: '🐜',
    affects: ['Tomato', 'Pepper', 'Lettuce', 'Cabbage', 'Broccoli', 'Kale', 'Pea', 'Eggplant'],
    symptoms: ['bugs-visible', 'sticky', 'discolored'],
    quickFix: ['Blast them off with a strong spray of water', 'Spray neem oil on leaf undersides; repeat in 5 days'],
    signs: ['Clusters of tiny soft-bodied insects on new growth and leaf undersides', 'Curled, yellowing leaves and sticky honeydew', 'Ants crawling on the plant farming the aphids'],
    organicTreatment: ['Blast off with a strong jet of water', 'Spray neem oil or insecticidal soap', 'Release ladybugs or lacewings'],
    prevention: ['Avoid excess nitrogen fertilizer — lush growth attracts them', 'Use reflective mulch early in the season'],
    severity: 'medium',
  },
  {
    id: 'flea-beetle',
    image: '/threats/flea-beetle.jpg',
    credit: 'University of Minnesota Extension',
    name: 'Flea Beetles',
    type: 'pest',
    icon: '🦗',
    affects: ['Eggplant', 'Radish', 'Cabbage', 'Broccoli', 'Kale'],
    symptoms: ['holes', 'bugs-visible'],
    quickFix: ['Cover the plant with row cover right now', 'Dust leaves with diatomaceous earth'],
    signs: ['Tiny round "shotholes" chewed through leaves', 'Seedlings stunted or killed outright'],
    organicTreatment: ['Dust with diatomaceous earth or spray neem oil', 'Set out yellow sticky traps to monitor'],
    prevention: ['Cover seedlings with floating row cover until established', 'Delay planting until weather is warm — beetles fade in heat'],
    severity: 'medium',
  },
  {
    id: 'colorado-potato-beetle',
    image: '/threats/colorado-potato-beetle.webp',
    credit: 'Penn State Extension',
    name: 'Colorado Potato Beetle',
    type: 'pest',
    icon: '🪲',
    affects: ['Potato', 'Eggplant', 'Tomato', 'Pepper'],
    symptoms: ['bugs-visible', 'holes', 'discolored'],
    quickFix: ['Handpick beetles and crush orange egg masses into soapy water', 'Spray spinosad on the young larvae'],
    signs: ['Yellow-striped beetles and orange egg masses under leaves', 'Rapid defoliation starting at leaf edges'],
    organicTreatment: ['Handpick beetles, larvae, and egg masses into soapy water', 'Spray spinosad or Bt tenebrionis on young larvae'],
    prevention: ['Rotate nightshades to a new bed each year', 'Mulch heavily with straw to block emerging beetles'],
    severity: 'high',
  },
  {
    id: 'cabbage-worm',
    image: '/threats/cabbage-worm.jpg',
    credit: 'PositiveBloom',
    name: 'Cabbage Worms',
    type: 'pest',
    icon: '🐛',
    affects: ['Cabbage', 'Broccoli', 'Kale', 'Brussels Sprouts', 'Radish'],
    symptoms: ['holes', 'bugs-visible'],
    quickFix: ['Spray Bt — it only kills caterpillars, nothing else', 'Handpick the green worms in the cool morning'],
    signs: ['Ragged holes chewed in leaves', 'Velvety green caterpillars and dark green frass pellets'],
    organicTreatment: ['Spray Bt (Bacillus thuringiensis) — very effective and targeted', 'Handpick caterpillars in the cool of the morning'],
    prevention: ['Cover with floating row cover from transplant day one', 'Interplant thyme and nasturtiums as decoys'],
    severity: 'high',
  },
  {
    id: 'cucumber-beetle',
    image: '/threats/cucumber-beetle.webp',
    credit: 'Growfully',
    name: 'Cucumber Beetles',
    type: 'pest',
    icon: '🪲',
    affects: ['Cucumber', 'Zucchini', 'Gourd/Squash', 'Corn'],
    symptoms: ['bugs-visible', 'holes', 'wilting'],
    quickFix: ['Cover with row cover until the flowers open', 'Spray neem oil in the evening'],
    signs: ['Chewed leaves, flowers, and scarred fruit', 'Sudden wilting — they spread bacterial wilt disease'],
    organicTreatment: ['Spray kaolin clay or neem oil', 'Handpick in the morning when they are sluggish'],
    prevention: ['Keep row cover on until flowering starts', 'Delay planting by two weeks to dodge the first generation'],
    severity: 'high',
  },
  {
    id: 'squash-vine-borer',
    image: '/threats/squash-vine-borer.jpg',
    credit: 'Pinterest',
    name: 'Squash Vine Borer',
    type: 'pest',
    icon: '🐛',
    affects: ['Zucchini', 'Gourd/Squash', 'Cucumber'],
    symptoms: ['wilting', 'tunnels'],
    quickFix: ['Slit the stem, pull out the white grub, bury the stem in soil', 'Wrap remaining stem bases with foil'],
    signs: ['Sudden wilting of a single vine on a healthy plant', 'Sawdust-like orange frass at the stem base near the soil'],
    organicTreatment: ['Slit the stem lengthwise, remove the white grub, bury the stem', 'Inject Bt into the stem with a syringe'],
    prevention: ['Wrap stem bases with foil or row cover until flowering', 'Plant a second succession in midsummer as insurance'],
    severity: 'high',
  },
  {
    id: 'corn-earworm',
    image: '/threats/corn-earworm.jpg',
    credit: 'University of Maryland Extension',
    name: 'Corn Earworm',
    type: 'pest',
    icon: '🌽',
    affects: ['Corn', 'Tomato', 'Pepper'],
    symptoms: ['bugs-visible', 'fruit-damage'],
    quickFix: ['Dab a few drops of mineral oil on the silks of each ear', 'Spray Bt on the silks every 3 days'],
    signs: ['Chewed silks and frass packed into the ear tip', 'Half-eaten kernels at the top of the ear'],
    organicTreatment: ['Apply a few drops of mineral oil to the silks after pollination', 'Spray Bt on silks every few days'],
    prevention: ['Plant as early as your climate allows', 'Choose resistant varieties with tight husks'],
    severity: 'medium',
  },
  {
    id: 'mexican-bean-beetle',
    image: '/threats/mexican-bean-beetle.jpg',
    credit: 'Crop Protection Network',
    name: 'Mexican Bean Beetle',
    type: 'pest',
    icon: '🪲',
    affects: ['Green Beans'],
    symptoms: ['skeleton', 'bugs-visible'],
    quickFix: ['Handpick beetles into soapy water; crush the yellow eggs', 'Spray neem on the larvae under the leaves'],
    signs: ['Leaves skeletonized — tissue eaten between the veins', 'Yellow spiny larvae on leaf undersides'],
    organicTreatment: ['Handpick beetles and crush yellow egg masses', 'Spray neem oil on larvae'],
    prevention: ['Cover young plants with row cover', 'Plant early to mature before peak beetle season'],
    severity: 'medium',
  },
  {
    id: 'carrot-rust-fly',
    image: '/threats/carrot-rust-fly.webp',
    credit: 'Garden UK',
    name: 'Carrot Rust Fly',
    type: 'pest',
    icon: '🪰',
    affects: ['Carrot'],
    symptoms: ['tunnels', 'discolored'],
    quickFix: ["Pull and trash tunneled roots — don't compost them", 'Cover the bed with insect mesh immediately'],
    signs: ['Rusty-brown tunnels through the roots', 'Seedling foliage turns reddish-purple and wilts'],
    organicTreatment: ['No good cure — pull and destroy tunneled roots', 'Yellow sticky traps catch the adult flies'],
    prevention: ['Cover the bed with insect mesh from sowing', 'Thin promptly and never crush foliage (the scent attracts them)'],
    severity: 'medium',
  },
  {
    id: 'onion-thrips',
    image: '/threats/onion-thrips.jpg',
    credit: 'Viaverda',
    name: 'Onion Thrips',
    type: 'pest',
    icon: '🦟',
    affects: ['Onion', 'Garlic', 'Chives'],
    symptoms: ['discolored', 'spots'],
    quickFix: ['Spray insecticidal soap deep into the leaf folds', 'Lay reflective mulch around the plants'],
    signs: ['Silvery-white streaks and speckles on leaves', 'Leaf tips wither and curl in heavy infestations'],
    organicTreatment: ['Spray insecticidal soap or neem oil into leaf folds', 'Blast with water to knock them off'],
    prevention: ['Keep the bed weed-free — weeds host thrips', 'Lay reflective silver mulch at planting'],
    severity: 'medium',
  },
  {
    id: 'slugs-snails',
    image: '/threats/slugs-snails.jpg',
    credit: 'Glorious Garden',
    name: 'Slugs & Snails',
    type: 'pest',
    icon: '🐌',
    affects: ['Lettuce', 'Strawberry', 'Cabbage', 'Basil', 'Marigold', 'Petunia', 'Dahlia'],
    symptoms: ['holes', 'slime'],
    quickFix: ['Sink a cup of beer at soil level tonight', 'Scatter iron phosphate bait around the plants'],
    signs: ['Irregular holes with smooth edges, mostly at night', 'Silvery slime trails on leaves and soil'],
    organicTreatment: ['Sink beer traps (a cup of beer at soil level)', 'Scatter iron phosphate bait — safe around pets and wildlife'],
    prevention: ['Water in the morning so surfaces dry by night', 'Clear boards, debris, and dense mulch where they hide'],
    severity: 'high',
  },
  {
    id: 'spider-mites',
    image: '/threats/spider-mites.webp',
    credit: 'Urbane Eight',
    name: 'Spider Mites',
    type: 'pest',
    icon: '🕷️',
    affects: ['Tomato', 'Pepper', 'Cucumber', 'Green Beans', 'Strawberry', 'Marigold'],
    symptoms: ['discolored', 'webbing', 'sticky'],
    quickFix: ['Blast leaf undersides hard with water', 'Spray neem oil weekly until clear'],
    signs: ['Fine stippling that turns leaves bronze', 'Delicate webbing on leaf undersides in dry heat'],
    organicTreatment: ['Spray leaves hard with water, especially undersides', 'Apply neem oil or insecticidal soap weekly'],
    prevention: ['Keep plants well-watered — mites explode in dusty drought stress', 'Avoid broad-spectrum insecticides that kill their predators'],
    severity: 'medium',
  },
  {
    id: 'whiteflies',
    image: '/threats/whiteflies.webp',
    credit: 'This Is My Garden',
    name: 'Whiteflies',
    type: 'pest',
    icon: '🦟',
    affects: ['Tomato', 'Pepper', 'Cucumber', 'Kale'],
    symptoms: ['bugs-visible', 'sticky'],
    quickFix: ['Hang yellow sticky traps at leaf height', 'Spray insecticidal soap under the leaves'],
    signs: ['Clouds of tiny white flies when the plant is shaken', 'Sticky honeydew and black sooty mold on leaves'],
    organicTreatment: ['Hang yellow sticky traps at canopy height', 'Spray insecticidal soap on leaf undersides'],
    prevention: ['Inspect transplants before they go in the ground', 'Use reflective mulch to confuse incoming flies'],
    severity: 'medium',
  },
  // ---------------- FLOWER PESTS ----------------
  {
    id: 'flower-thrips',
    image: '/threats/flower-thrips.webp',
    credit: 'Agri Farming',
    name: 'Flower Thrips',
    type: 'pest',
    icon: '🦟',
    affects: ['Marigold', 'Petunia', 'Snapdragon', 'Zinnia', 'Cosmos', 'Dahlia', 'Calendula'],
    symptoms: ['discolored', 'spots', 'stunted'],
    quickFix: ['Spray spinosad directly into the buds and flowers', 'Deadhead every spent flower right away'],
    signs: ['Silvery stippled streaks on petals and leaves', 'Buds deform and fail to open; tiny dark specks (frass) in flowers'],
    organicTreatment: ['Spray spinosad or insecticidal soap into the buds', 'Hang blue sticky traps to catch adults'],
    prevention: ['Remove spent flowers promptly', 'Weed the bed — weeds host thrips'],
    severity: 'medium',
  },
  {
    id: 'japanese-beetle',
    image: '/threats/japanese-beetle.webp',
    credit: 'La Vie des Reines',
    name: 'Japanese Beetles',
    type: 'pest',
    icon: '🪲',
    affects: ['Marigold', 'Basil', 'Zinnia', 'Cosmos'],
    symptoms: ['skeleton', 'bugs-visible'],
    quickFix: ['Shake beetles into soapy water first thing in the morning', 'Spray neem so the leaves taste bad to them'],
    signs: ['Metallic green-bronze beetles skeletonizing leaves and flowers', 'Heavy damage appears almost overnight'],
    organicTreatment: ['Knock beetles into soapy water in the morning', 'Spray neem oil to deter feeding'],
    prevention: ['Skip beetle traps near the garden — they attract more beetles', 'Apply milky spore or nematodes to lawn areas in fall'],
    severity: 'high',
  },
  {
    id: 'leafhopper',
    image: '/threats/leafhopper.jpg',
    credit: 'AllUneedPest',
    name: 'Leafhoppers',
    type: 'pest',
    icon: '🦗',
    affects: ['Marigold', 'Zinnia', 'Cosmos', 'Petunia', 'Calendula', 'Echinacea'],
    symptoms: ['bugs-visible', 'discolored', 'spots'],
    quickFix: ['Spray neem oil over the whole plant', 'Cover with row cover for two weeks'],
    signs: ['Tiny wedge-shaped insects that hop when disturbed', 'White stippling on leaves; they spread aster yellows'],
    organicTreatment: ['Spray insecticidal soap or neem oil', 'Use yellow sticky traps to monitor'],
    prevention: ['Row cover on young plants', 'Keep weeds down around the bed'],
    severity: 'medium',
  },
  {
    id: 'earwig',
    image: '/threats/earwig.jpg',
    credit: 'ArtDatabanken',
    name: 'Earwigs',
    type: 'pest',
    icon: '🌙',
    affects: ['Marigold', 'Petunia', 'Dahlia', 'Zinnia'],
    symptoms: ['holes', 'fruit-damage'],
    quickFix: ['Set a rolled damp newspaper trap tonight', 'Toss the full roll in the trash at dawn'],
    signs: ['Ragged holes chewed in petals and leaves overnight', 'Plants look fine by day — earwigs hide'],
    organicTreatment: ['Roll damp newspaper, leave overnight, toss the filled roll at dawn', 'Set shallow traps of soy sauce with a layer of oil'],
    prevention: ['Clear mulch piles and boards they hide under by day', 'Water in the morning so the surface dries'],
    severity: 'medium',
  },
  {
    id: 'budworm',
    image: '/threats/budworm.jpg',
    credit: 'Plant My Plants',
    name: 'Tobacco Budworm',
    type: 'pest',
    icon: '🐛',
    affects: ['Petunia'],
    symptoms: ['fruit-damage', 'bugs-visible'],
    quickFix: ['Spray Bt on all the buds', 'Pinch off every damaged bud'],
    signs: ['Flower buds chewed open or failing to open', 'Tiny green caterpillars inside buds; black frass pellets'],
    organicTreatment: ['Spray Bt on buds and foliage', 'Pick off damaged buds'],
    prevention: ['Deadhead regularly', 'Plant early so bloom peaks before moths arrive'],
    severity: 'medium',
  },
  // ---------------- DISEASES ----------------
  {
    id: 'early-blight',
    image: '/threats/early-blight.jpg',
    credit: 'Epic Gardening',
    name: 'Early Blight',
    type: 'disease',
    icon: '🍂',
    affects: ['Tomato', 'Potato', 'Pepper', 'Eggplant'],
    symptoms: ['spots', 'discolored'],
    quickFix: ['Strip every spotted lower leaf and trash it', 'Mulch under the plant and water only at the base'],
    signs: ['Dark bullseye-ringed spots on lower leaves first', 'Yellowing leaves that drop, exposing fruit to sunscald'],
    organicTreatment: ['Strip and destroy affected leaves — never compost them', 'Spray copper fungicide to protect new growth'],
    prevention: ['Mulch to stop soil splashing onto leaves', 'Water at the base, rotate nightshades yearly'],
    severity: 'high',
  },
  {
    id: 'late-blight',
    image: '/threats/late-blight.jpg',
    credit: 'Potatoes News',
    name: 'Late Blight',
    type: 'disease',
    icon: '🌧️',
    affects: ['Potato', 'Tomato'],
    symptoms: ['spots', 'fuzz', 'wilting'],
    quickFix: ['Cut off infected foliage immediately and bag it', "Spray copper to protect what's still healthy"],
    signs: ['Water-soaked dark lesions on leaves and stems', 'White fuzzy mold on leaf undersides in humid weather'],
    organicTreatment: ['Remove and destroy infected foliage immediately', 'Copper spray can slow it — this one moves fast'],
    prevention: ['Plant certified disease-free seed potatoes', 'Hill potatoes well and space for airflow'],
    severity: 'high',
  },
  {
    id: 'powdery-mildew',
    image: '/threats/powdery-mildew.webp',
    credit: 'Growing Organic',
    name: 'Powdery Mildew',
    type: 'disease',
    icon: '🌫️',
    affects: ['Cucumber', 'Zucchini', 'Gourd/Squash', 'Pea', 'Zinnia', 'Bee Balm', 'Cosmos'],
    symptoms: ['powder', 'discolored'],
    quickFix: ['Spray a 1:9 milk-water mix on all the leaves', 'Thin leaves for airflow; water the soil, not the plant'],
    signs: ['White powdery coating spreading over leaves', 'Leaves yellow, dry out, and die back'],
    organicTreatment: ['Spray potassium bicarbonate or a 1:9 milk-to-water mix', 'Neem oil slows early infections'],
    prevention: ['Choose resistant varieties', 'Space for airflow and water the soil, not the leaves'],
    severity: 'high',
  },
  {
    id: 'downy-mildew',
    image: '/threats/downy-mildew.jpg',
    credit: 'Dishcuss',
    name: 'Downy Mildew',
    type: 'disease',
    icon: '💧',
    affects: ['Cucumber', 'Lettuce', 'Onion', 'Basil', 'Spinach'],
    symptoms: ['spots', 'fuzz', 'discolored'],
    quickFix: ['Remove the worst leaves; open up airflow', 'Water at the base in the morning only'],
    signs: ['Yellow angular patches on leaf tops', 'Gray-purple fuzz on leaf undersides in the morning'],
    organicTreatment: ['Remove worst leaves; improve air circulation fast', 'Copper or potassium bicarbonate sprays help'],
    prevention: ['Water in the morning at the base of plants', 'Give each plant its full spacing — crowding invites it'],
    severity: 'medium',
  },
  {
    id: 'blossom-end-rot',
    image: '/threats/blossom-end-rot.jpg',
    credit: 'Homestead Acres',
    name: 'Blossom End Rot',
    type: 'disease',
    icon: '🍅',
    affects: ['Tomato', 'Pepper', 'Eggplant', 'Zucchini'],
    symptoms: ['fruit-damage'],
    quickFix: ['Water deeply and evenly — same amount, same time daily', 'Mulch 3 inches deep to hold moisture steady'],
    signs: ['Dark sunken leathery spot on the blossom end of fruit', 'Not a pathogen — a calcium-uptake problem'],
    organicTreatment: ['Water deeply and consistently — no feast-or-famine', 'Mulch to hold soil moisture steady'],
    prevention: ['Test soil pH and calcium before amending blindly', 'Avoid damaging roots with deep cultivation'],
    severity: 'medium',
  },
  {
    id: 'bacterial-leaf-spot',
    image: '/threats/bacterial-leaf-spot.jpg',
    credit: 'University of Maryland Extension',
    name: 'Bacterial Leaf Spot',
    type: 'disease',
    icon: '🦠',
    affects: ['Pepper', 'Tomato'],
    symptoms: ['spots', 'fruit-damage'],
    quickFix: ["Spray copper early — it only protects, doesn't cure", 'Stop touching wet plants; work them dry'],
    signs: ['Small water-soaked spots that turn brown with yellow halos', 'Spots on fruit make them unmarketable'],
    organicTreatment: ['Copper spray is the only organic option — apply early', 'Remove infected leaves when dry to avoid spreading'],
    prevention: ['Never work wet plants', 'Rotate crops and buy certified disease-free seed'],
    severity: 'medium',
  },
  {
    id: 'bean-rust',
    image: '/threats/bean-rust.webp',
    credit: 'GardenUK',
    name: 'Bean Rust',
    type: 'disease',
    icon: '🟠',
    affects: ['Green Beans'],
    symptoms: ['spots', 'discolored'],
    quickFix: ['Strip spotted leaves into the trash', 'Spray sulfur on the new growth'],
    signs: ['Orange-brown powdery pustules on leaf undersides', 'Leaves yellow and drop in severe cases'],
    organicTreatment: ['Strip affected leaves; sulfur spray protects new growth'],
    prevention: ['Water at the base and space for airflow', 'Plant resistant varieties next season'],
    severity: 'medium',
  },
  {
    id: 'gray-mold',
    image: '/threats/gray-mold.jpg',
    credit: 'Senasica',
    name: 'Gray Mold (Botrytis)',
    type: 'disease',
    icon: '🍄',
    affects: ['Strawberry', 'Lettuce', 'Tomato', 'Petunia', 'Zinnia', 'Marigold', 'Snapdragon', 'Dahlia'],
    symptoms: ['fuzz', 'fruit-damage'],
    quickFix: ['Pick off every moldy fruit and flower now', 'Thin the foliage so air moves through'],
    signs: ['Fuzzy gray mold on ripening fruit and dying flowers', 'Spreads fast in cool damp weather'],
    organicTreatment: ['Pick off every infected fruit — do not compost', 'Thin foliage to let air and sun in'],
    prevention: ['Mulch strawberries with straw to keep fruit off soil', 'Water at the base in the morning'],
    severity: 'medium',
  },
  {
    id: 'clubroot',
    image: '/threats/clubroot.jpg',
    credit: 'MorningChores',
    name: 'Clubroot',
    type: 'disease',
    icon: '🌱',
    affects: ['Cabbage', 'Broccoli', 'Kale', 'Brussels Sprouts', 'Radish'],
    symptoms: ['wilting', 'stunted'],
    quickFix: ['Pull the plant, bag it, trash it — not compost', 'Lime the soil toward pH 7 for next planting'],
    signs: ['Stunted, wilting plants despite wet soil', 'Swollen deformed knobby roots when pulled up'],
    organicTreatment: ['No cure — pull, bag, and trash the plant, not the compost'],
    prevention: ['Lime soil toward pH 7.0+', 'Rotate brassicas on a long cycle — up to 7 years'],
    severity: 'medium',
  },
  {
    id: 'fusarium-wilt',
    image: '/threats/fusarium-wilt.jpg',
    credit: 'University of Maryland Extension',
    name: 'Fusarium Wilt',
    type: 'disease',
    icon: '🥀',
    affects: ['Tomato', 'Pepper', 'Eggplant', 'Potato'],
    symptoms: ['wilting', 'discolored'],
    quickFix: ['Pull and destroy the plant plus surrounding soil', 'Next time: plant a variety labeled "F" resistant'],
    signs: ['One-sided yellowing and wilting that starts on lower leaves', 'Brown streaks inside the stem when cut open'],
    organicTreatment: ['No cure — remove and destroy the plant and its soil'],
    prevention: ['Plant resistant varieties (look for "F" on the label)', 'Never plant nightshades in the same spot two years running'],
    severity: 'high',
  },
  {
    id: 'damping-off',
    image: '/threats/damping-off.jpg',
    credit: 'Gardening.org',
    name: 'Damping Off',
    type: 'disease',
    icon: '🌱',
    affects: ['Tomato', 'Pepper', 'Lettuce', 'Cabbage', 'Broccoli'],
    symptoms: ['wilting', 'stunted'],
    quickFix: ['Start over with fresh sterile mix', 'Bottom-water and run a small fan for airflow'],
    signs: ['Seedlings keel over at the soil line and die', 'Stems look pinched and water-soaked at the base'],
    organicTreatment: ['No rescue — start over with fresh mix', 'Chamomile tea or cinnamon dust can suppress it on new sowings'],
    prevention: ['Use sterile seed-starting mix, not garden soil', 'Bottom-water and give seedlings airflow'],
    severity: 'low',
  },
  // ---------------- FLOWER DISEASES ----------------
  {
    id: 'aster-yellows',
    image: '/threats/aster-yellows.jpg',
    credit: 'Georgia Perennial Plant Association',
    name: 'Aster Yellows',
    type: 'disease',
    icon: '🥀',
    affects: ['Marigold', 'Zinnia', 'Cosmos', 'Petunia', 'Calendula', 'Echinacea', 'Snapdragon'],
    symptoms: ['discolored', 'stunted', 'fruit-damage'],
    quickFix: ['Pull the plant now — it will not recover', 'Bag and trash it; never compost it'],
    signs: ["Leaves yellow while veins stay green; bizarre bushy 'witches' broom' growth", 'Flowers come out green and deformed'],
    organicTreatment: ['No cure — pull the plant immediately and trash it', 'Control the leafhoppers that spread it'],
    prevention: ['Cover susceptible flowers with row cover', 'Weed diligently — weeds harbor the disease'],
    severity: 'high',
  },
  {
    id: 'snapdragon-rust',
    image: '/threats/snapdragon-rust.webp',
    credit: 'EatHealthy365',
    name: 'Snapdragon Rust',
    type: 'disease',
    icon: '🟠',
    affects: ['Snapdragon'],
    symptoms: ['spots', 'discolored'],
    quickFix: ['Strip the spotted leaves into the trash', 'Spray sulfur on the rest of the plant'],
    signs: ['Orange-brown powdery pustules on leaf undersides', 'Leaves yellow and drop'],
    organicTreatment: ['Strip affected leaves; spray sulfur'],
    prevention: ['Space for airflow; water at the base', 'Choose resistant varieties'],
    severity: 'low',
  },
];

/** All threats relevant to a plant, pests first then diseases, high severity first. */
export function getThreatsForPlant(plantName: string): PlantThreat[] {
  const normalized = normalizePlantName(plantName);
  const rank: Record<ThreatSeverity, number> = { high: 0, medium: 1, low: 2 };
  return THREAT_LIBRARY.filter((t) => t.affects.includes(normalized)).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'pest' ? -1 : 1;
    return rank[a.severity] - rank[b.severity];
  });
}

export interface ThreatMatch {
  threat: PlantThreat;
  matchedTags: SymptomTag[];
  score: number;
}

/**
 * Guided identifier: rank a plant's threats by how many of the
 * user-picked symptom tags they match.
 */
export function identifyThreats(plantName: string, tags: SymptomTag[]): ThreatMatch[] {
  if (tags.length === 0) return [];
  const rank: Record<ThreatSeverity, number> = { high: 0, medium: 1, low: 2 };
  return getThreatsForPlant(plantName)
    .map((threat) => {
      const matchedTags = threat.symptoms.filter((s) => tags.includes(s));
      return { threat, matchedTags, score: matchedTags.length };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || rank[a.threat.severity] - rank[b.threat.severity]);
}
