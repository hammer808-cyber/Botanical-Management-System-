export interface PlantInfo {
  name: string;
  scientific: string;
  type: string;
  water: string;
  sun: string;
  temp: string;
  image: string;
  description?: string;
}

export const PLANT_DATABASE: PlantInfo[] = [
  { 
    name: "Bee Balm", 
    scientific: "Monarda didyma", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Black-Eyed Susan", 
    scientific: "Rudbeckia hirta", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-85°F",
    image: "https://images.unsplash.com/photo-1569911440061-9f9392268753?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Calendula", 
    scientific: "Calendula officinalis", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://images.unsplash.com/photo-1626761191319-dd0e58f14a36?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Cosmos", 
    scientific: "Cosmos bipinnatus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1500336624123-b016d67dfb35?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Dahlia", 
    scientific: "Dahlia spp.", 
    type: "Flower", 
    water: "Moderate", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Echinacea", 
    scientific: "Echinacea purpurea", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1588613254750-cf5d90906801?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Foxglove", 
    scientific: "Digitalis purpurea", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Marigold", 
    scientific: "Tagetes spp.", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1588613254750-cf5d90906801?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Morning Glory", 
    scientific: "Ipomoea purpurea", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1558236714-d1ae5369395b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Nasturtium", 
    scientific: "Tropaeolum majus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1596273410100-2974fd973216?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Pansy", 
    scientific: "Viola × wittrockiana", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "45-70°F",
    image: "https://images.unsplash.com/photo-1596273410100-2974fd973216?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Petunia", 
    scientific: "Petunia × atkinsiana", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1567331711402-509c139474e2?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Salvia", 
    scientific: "Salvia splendens", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Snapdragon", 
    scientific: "Antirrhinum majus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-75°F",
    image: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Sunflower", 
    scientific: "Helianthus annuus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Sweet Alyssum", 
    scientific: "Lobularia maritima", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Sweet Pea", 
    scientific: "Lathyrus odoratus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-70°F",
    image: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Zinnia", 
    scientific: "Zinnia elegans", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1501685532562-aa6846b14a0e?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Basil", 
    scientific: "Ocimum basilicum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1618375511471-8394fd97be63?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Borage", 
    scientific: "Borago officinalis", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1618375511471-8394fd97be63?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Chamomile", 
    scientific: "Matricaria chamomilla", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1567331711402-509c139474e2?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Chives", 
    scientific: "Allium schoenoprasum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1567331711402-509c139474e2?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Cilantro", 
    scientific: "Coriandrum sativum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "50-75°F",
    image: "https://images.unsplash.com/photo-1567331711402-509c139474e2?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Dill", 
    scientific: "Anethum graveolens", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Lavender", 
    scientific: "Lavandula angustifolia", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "65-80°F",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Lemon Balm", 
    scientific: "Melissa officinalis", 
    type: "Herb", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Mint", 
    scientific: "Mentha spp.", 
    type: "Herb", 
    water: "High", 
    sun: "Partial Shade", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Oregano", 
    scientific: "Origanum vulgare", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Parsley", 
    scientific: "Petroselinum crispum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-75°F",
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Rosemary", 
    scientific: "Salvia rosmarinus", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Sage", 
    scientific: "Salvia officinalis", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Tarragon", 
    scientific: "Artemisia dracunculus", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Thyme", 
    scientific: "Thymus vulgaris", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Asparagus", 
    scientific: "Asparagus officinalis", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Beet", 
    scientific: "Beta vulgaris", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Broccoli", 
    scientific: "Brassica oleracea var. italica", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Cabbage", 
    scientific: "Brassica oleracea var. capitata", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Carrot", 
    scientific: "Daucus carota", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Chard", 
    scientific: "Beta vulgaris subsp.", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Corn", 
    scientific: "Zea mays", 
    type: "Vegetable", 
    water: "High", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Cucumber", 
    scientific: "Cucumis sativus", 
    type: "Vegetable", 
    water: "High", 
    sun: "Full Sun", 
    temp: "75-90°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Eggplant", 
    scientific: "Solanum melongena", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Garlic", 
    scientific: "Allium sativum", 
    type: "Vegetable", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Green Beans", 
    scientific: "Phaseolus vulgaris", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Kale", 
    scientific: "Brassica oleracea", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Lettuce", 
    scientific: "Lactuca sativa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "55-70°F",
    image: "https://images.unsplash.com/photo-1622206141580-579f30d1b135?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Onion", 
    scientific: "Allium cepa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1622206141580-579f30d1b135?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Pea", 
    scientific: "Pisum sativum", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-70°F",
    image: "https://images.unsplash.com/photo-1622206141580-579f30d1b135?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Pepper", 
    scientific: "Capsicum annuum", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Potato", 
    scientific: "Solanum tuberosum", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Radish", 
    scientific: "Raphanus sativus", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Spinach", 
    scientific: "Spinacia oleracea", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "55-70°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Strawberry", 
    scientific: "Fragaria × ananassa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Tomato", 
    scientific: "Solanum lycopersicum", 
    type: "Vegetable", 
    water: "Daily", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Zucchini", 
    scientific: "Cucurbita pepo", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Green Pepper", 
    scientific: "Capsicum annuum", 
    type: "Vegetable", 
    water: "Daily", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Iris (White)", 
    scientific: "Iris germanica", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Rue", 
    scientific: "Ruta graveolens", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Tricolor Sage", 
    scientific: "Salvia officinalis 'Tricolor'", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Sage (Yellow)", 
    scientific: "Salvia officinalis 'Icterina'", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Lion's Tail", 
    scientific: "Leonotis leonurus", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Strawberries", 
    scientific: "Fragaria × ananassa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Globe Amaranth (red)", 
    scientific: "Gomphrena haageana", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Globe Amaranth (orange)", 
    scientific: "Gomphrena haageana", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Globe Amaranth (pink)", 
    scientific: "Gomphrena globosa", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Eggplant (Japanese Long)", 
    scientific: "Solanum melongena", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Cucamelons", 
    scientific: "Melothria scabra", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Eggplant (Black Beauty)", 
    scientific: "Solanum melongena", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Brussels Sprouts", 
    scientific: "Brassica oleracea var. gemmifera", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Lemon Cucumber", 
    scientific: "Cucumis sativus", 
    type: "Vegetable", 
    water: "High", 
    sun: "Full Sun", 
    temp: "75-90°F",
    image: "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Hellebore", 
    scientific: "Helleborus spp.", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "50-70°F",
    image: "https://images.unsplash.com/photo-1563513307168-a4262ed35cdd?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Tomato (San Marzano)", 
    scientific: "Solanum lycopersicum", 
    type: "Vegetable", 
    water: "Daily", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Gourd/Squash", 
    scientific: "Cucurbita spp.", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Shell Ginger", 
    scientific: "Alpinia zerumbet", 
    type: "Flower", 
    water: "High", 
    sun: "Partial Shade", 
    temp: "60-85°F",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "California Poppy",
    scientific: "Eschscholzia californica",
    type: "Wildflower",
    water: "Low",
    sun: "Full Sun",
    temp: "15°C - 30°C",
    image: "https://images.unsplash.com/photo-1550534791-2677533605ab?auto=format&fit=crop&q=80&w=800",
    description: "The state flower of California, known for its vibrant orange petals and drought tolerance."
  },
  {
    name: "Matilija Poppy",
    scientific: "Romneya coulteri",
    type: "Perennial",
    water: "Low",
    sun: "Full Sun",
    temp: "10°C - 35°C",
    image: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&q=80&w=800",
    description: "Also known as the 'fried egg plant' for its large white flowers with yellow centers."
  },
  {
    name: "Cleveland Sage",
    scientific: "Salvia clevelandii",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun",
    temp: "5°C - 38°C",
    image: "https://images.unsplash.com/photo-1596438415017-0a2569720b0c?auto=format&fit=crop&q=80&w=800",
    description: "A fragrant native shrub with beautiful purple flower whorls, highly attractive to hummingbirds."
  },
  {
    name: "California Lilac 'Concha'",
    scientific: "Ceanothus 'Concha'",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun",
    temp: "0°C - 32°C",
    image: "https://images.unsplash.com/photo-1599003846001-903158971988?auto=format&fit=crop&q=80&w=800",
    description: "One of the best Ceanothus for garden use, with deep blue flower clusters in spring."
  },
  {
    name: "Toyon",
    scientific: "Heteromeles arbutifolia",
    type: "Shrub/Tree",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-5°C - 40°C",
    image: "https://images.unsplash.com/photo-1603912627214-921967707593?auto=format&fit=crop&q=80&w=800",
    description: "Also known as Christmas Berry, this native provides beautiful red berries for birds in winter."
  },
  {
    name: "Manzanita 'Howard McMinn'",
    scientific: "Arctostaphylos 'Howard McMinn'",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-10°C - 38°C",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800",
    description: "A versatile manzanita with smooth mahogany bark and delicate bell-shaped flowers."
  },
  {
    name: "Western Redbud",
    scientific: "Cercis occidentalis",
    type: "Tree",
    water: "Low/Moderate",
    sun: "Full Sun / Part Shade",
    temp: "-15°C - 40°C",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&q=80&w=800",
    description: "A stunning small tree with magenta flowers in spring and heart-shaped leaves."
  },
  {
    name: "California Fuchsia",
    scientific: "Epilobium canum",
    type: "Perennial",
    water: "Low",
    sun: "Full Sun",
    temp: "-5°C - 40°C",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=800",
    description: "Brilliant orange-red tubular flowers that bloom in late summer, a hummingbird favorite."
  },
  {
    name: "Deer Grass",
    scientific: "Muhlenbergia rigens",
    type: "Grass",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-10°C - 45°C",
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=800",
    description: "A large, architectural bunchgrass that adds texture and movement to the garden."
  },
  {
    name: "Coffeeberry",
    scientific: "Frangula californica",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-10°C - 40°C",
    image: "https://images.unsplash.com/photo-1596438415017-0a2569720b0c?auto=format&fit=crop&q=80&w=800",
    description: "An evergreen shrub with attractive berries that turn from green to red to black."
  },
  {
    name: "Island Alumroot",
    scientific: "Heuchera maxima",
    type: "Perennial",
    water: "Moderate",
    sun: "Part Shade / Full Shade",
    temp: "0°C - 30°C",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=800",
    description: "Large, lush green leaves and tall spikes of tiny white flowers, perfect for dry shade."
  },
  {
    name: "Blue-eyed Grass",
    scientific: "Sisyrinchium bellum",
    type: "Perennial",
    water: "Moderate",
    sun: "Full Sun / Part Shade",
    temp: "-5°C - 35°C",
    image: "https://images.unsplash.com/photo-1550534791-2677533605ab?auto=format&fit=crop&q=80&w=800",
    description: "A small, iris-like plant with charming blue-purple flowers with yellow centers."
  },
  {
    name: "Woolly Blue Curls",
    scientific: "Trichostema lanatum",
    type: "Shrub",
    water: "Very Low",
    sun: "Full Sun",
    temp: "0°C - 40°C",
    image: "https://images.unsplash.com/photo-1596438415017-0a2569720b0c?auto=format&fit=crop&q=80&w=800",
    description: "An exceptionally beautiful native with fuzzy blue flowers and aromatic foliage."
  },
  {
    name: "Desert Willow",
    scientific: "Chilopsis linearis",
    type: "Tree",
    water: "Low",
    sun: "Full Sun",
    temp: "-15°C - 45°C",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&q=80&w=800",
    description: "A deciduous tree with willow-like leaves and showy, trumpet-shaped pink flowers."
  },
  {
    name: "Palo Verde 'Desert Museum'",
    scientific: "Parkinsonia 'Desert Museum'",
    type: "Tree",
    water: "Low",
    sun: "Full Sun",
    temp: "-10°C - 45°C",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&q=80&w=800",
    description: "A fast-growing, thornless tree with brilliant yellow flowers and green bark."
  },
  {
    name: "Agave attenuata",
    scientific: "Agave attenuata",
    type: "Succulent",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "0°C - 40°C",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?auto=format&fit=crop&q=80&w=800",
    description: "Also known as Fox Tail Agave, it has soft, spineless green leaves in a rosette."
  },
  {
    name: "Aeonium arboreum",
    scientific: "Aeonium arboreum",
    type: "Succulent",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "0°C - 35°C",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?auto=format&fit=crop&q=80&w=800",
    description: "A tree-like succulent with rosettes of leaves at the ends of its branches."
  },
  {
    name: "Jade Plant",
    scientific: "Crassula ovata",
    type: "Succulent",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "5°C - 40°C",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e5f?auto=format&fit=crop&q=80&w=800",
    description: "A classic succulent with thick, woody stems and fleshy green leaves."
  },
  {
    name: "Bougainvillea",
    scientific: "Bougainvillea spectabilis",
    type: "Vine",
    water: "Moderate",
    sun: "Full Sun",
    temp: "5°C - 45°C",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=800",
    description: "A vigorous climber known for its brilliant, colorful bracts that surround tiny flowers."
  },
  {
    name: "Meyer Lemon",
    scientific: "Citrus × limon 'Meyer'",
    type: "Fruit Tree",
    water: "Moderate",
    sun: "Full Sun",
    temp: "0°C - 35°C",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800",
    description: "A popular citrus tree producing thin-skinned, sweet lemons throughout the year."
  },
  {
    name: "Hass Avocado",
    scientific: "Persea americana 'Hass'",
    type: "Fruit Tree",
    water: "Moderate",
    sun: "Full Sun",
    temp: "0°C - 35°C",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    description: "The most popular avocado variety, known for its rich, creamy fruit and pebbly skin."
  },
  {
    name: "Fig 'Black Mission'",
    scientific: "Ficus carica 'Black Mission'",
    type: "Fruit Tree",
    water: "Moderate",
    sun: "Full Sun",
    temp: "-10°C - 40°C",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    description: "A reliable producer of sweet, dark purple figs with pink flesh."
  },
  {
    name: "Rosemary",
    scientific: "Salvia rosmarinus",
    type: "Herb",
    water: "Low",
    sun: "Full Sun",
    temp: "-10°C - 45°C",
    image: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=800",
    description: "A versatile, aromatic herb that is both culinary and ornamental."
  },
  {
    name: "Lavender 'Munstead'",
    scientific: "Lavandula angustifolia 'Munstead'",
    type: "Herb",
    water: "Low",
    sun: "Full Sun",
    temp: "-15°C - 35°C",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    description: "A compact lavender variety with fragrant purple flowers and silvery foliage."
  },
  {
    name: "Tomato 'Celebrity'",
    scientific: "Solanum lycopersicum 'Celebrity'",
    type: "Vegetable",
    water: "Moderate",
    sun: "Full Sun",
    temp: "10°C - 35°C",
    image: "https://images.unsplash.com/photo-1592150621344-224218e0da99?auto=format&fit=crop&q=80&w=800",
    description: "An award-winning, disease-resistant tomato variety that produces large, flavorful fruit."
  }
];

export function getPlantInfo(name: string): PlantInfo | undefined {
  const searchName = name.toLowerCase();
  return PLANT_DATABASE.find(p => 
    p.name.toLowerCase() === searchName || 
    p.scientific.toLowerCase() === searchName ||
    searchName.includes(p.name.toLowerCase())
  );
}
