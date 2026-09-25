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
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Monarda_didyma_inflorescence_with_black_background.jpg/960px-Monarda_didyma_inflorescence_with_black_background.jpg"
  },
  { 
    name: "Black-Eyed Susan", 
    scientific: "Rudbeckia hirta", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Rudbeckia_hirta%2C_by_Mary_Vaux_Walcott.jpg"
  },
  { 
    name: "Calendula", 
    scientific: "Calendula officinalis", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/03/Calendula_officinalis_pollen.jpg"
  },
  { 
    name: "Cosmos", 
    scientific: "Cosmos bipinnatus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Cosmos.jpg"
  },
  { 
    name: "Dahlia", 
    scientific: "Dahlia spp.", 
    type: "Flower", 
    water: "Moderate", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Dahlia_redoute.JPG"
  },
  { 
    name: "Echinacea", 
    scientific: "Echinacea purpurea", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Echinacea_purpurea.jpg"
  },
  { 
    name: "Foxglove", 
    scientific: "Digitalis purpurea", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Digitalis_purpurea6.jpg"
  },
  { 
    name: "Marigold", 
    scientific: "Tagetes spp.", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Aksamitn%C3%ADk_-_Czech_Republic_03_%28cropped%29.jpg/960px-Aksamitn%C3%ADk_-_Czech_Republic_03_%28cropped%29.jpg"
  },
  { 
    name: "Morning Glory", 
    scientific: "Ipomoea purpurea", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Ipomoea_purpurea1ULBO.jpg"
  },
  { 
    name: "Nasturtium", 
    scientific: "Tropaeolum majus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Pre-flowering_Garden_Nasturtium_%28Tropaeolum_majus%29_with_other_plants%2C_Gilroy%2C_California_-_20110331.jpg"
  },
  { 
    name: "Pansy", 
    scientific: "Viola × wittrockiana", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "45-70°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Viola_x_wittrockiana_omega_F1_blanc_pur_dsc00972.jpg/960px-Viola_x_wittrockiana_omega_F1_blanc_pur_dsc00972.jpg"
  },
  { 
    name: "Petunia", 
    scientific: "Petunia × atkinsiana", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/2008._Stamp_of_Belarus_11-2008-06-10-petuniya.jpg"
  },
  { 
    name: "Salvia", 
    scientific: "Salvia splendens", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "65-85°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/2012_06-21IMG_2248_%282%29.jpg/960px-2012_06-21IMG_2248_%282%29.jpg"
  },
  { 
    name: "Snapdragon", 
    scientific: "Antirrhinum majus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/2006-12-05Antirrhinum01.jpg"
  },
  { 
    name: "Sunflower", 
    scientific: "Helianthus annuus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Sunflower3a.JPG"
  },
  { 
    name: "Sweet Alyssum", 
    scientific: "Lobularia maritima", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Cruciferae1.jpg"
  },
  { 
    name: "Sweet Pea", 
    scientific: "Lathyrus odoratus", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-70°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Lathyrus_odoratus_gevleugelde_stengel.jpg/960px-Lathyrus_odoratus_gevleugelde_stengel.jpg"
  },
  { 
    name: "Zinnia", 
    scientific: "Zinnia elegans", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Zinnia_bed-300px.jpg"
  },
  { 
    name: "Basil", 
    scientific: "Ocimum basilicum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/64/Ocimum_basilicum_seeds.jpg"
  },
  { 
    name: "Borage", 
    scientific: "Borago officinalis", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/92/Close-up_of_plant_in_field_-_geograph.org.uk_-_503603.jpg"
  },
  { 
    name: "Chamomile", 
    scientific: "Matricaria chamomilla", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Cabbage_butterfly.jpg"
  },
  { 
    name: "Chives", 
    scientific: "Allium schoenoprasum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Allium_schoenoprasum%2C_by_Mary_Vaux_Walcott.jpg"
  },
  { 
    name: "Cilantro", 
    scientific: "Coriandrum sativum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "50-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Graines_coriandre.jpg"
  },
  { 
    name: "Dill", 
    scientific: "Anethum graveolens", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Anethum_graveolens.jpg"
  },
  { 
    name: "Lavender", 
    scientific: "Lavandula angustifolia", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "65-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Lawenda_w%C4%85skolistna_Lavandula_angustifolia.jpg"
  },
  { 
    name: "Lemon Balm", 
    scientific: "Melissa officinalis", 
    type: "Herb", 
    water: "Regular", 
    sun: "Partial Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Melissa_officinalis_flower.jpg"
  },
  { 
    name: "Mint", 
    scientific: "Mentha spp.", 
    type: "Herb", 
    water: "High", 
    sun: "Partial Shade", 
    temp: "60-75°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Mint.jpg/960px-Mint.jpg"
  },
  { 
    name: "Oregano", 
    scientific: "Origanum vulgare", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Origanum_vulgare1.jpg"
  },
  { 
    name: "Parsley", 
    scientific: "Petroselinum crispum", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Petroselinum_crispum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-103.jpg"
  },
  { 
    name: "Rosemary", 
    scientific: "Salvia rosmarinus", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Rozmarin.jpg"
  },
  { 
    name: "Sage", 
    scientific: "Salvia officinalis", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/2006-10-30-Salvia01.jpg"
  },
  { 
    name: "Tarragon", 
    scientific: "Artemisia dracunculus", 
    type: "Herb", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Estragon_1511.jpg"
  },
  { 
    name: "Thyme", 
    scientific: "Thymus vulgaris", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Thymian.jpg"
  },
  { 
    name: "Asparagus", 
    scientific: "Asparagus officinalis", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Asparagus_botanical.jpg"
  },
  { 
    name: "Beet", 
    scientific: "Beta vulgaris", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Some_Gartons_Mangels.jpg"
  },
  { 
    name: "Broccoli", 
    scientific: "Brassica oleracea var. italica", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flowering-kale.jpg"
  },
  { 
    name: "Cabbage", 
    scientific: "Brassica oleracea var. capitata", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flowering-kale.jpg"
  },
  { 
    name: "Carrot", 
    scientific: "Daucus carota", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Carrot_2.jpg"
  },
  { 
    name: "Chard", 
    scientific: "Beta vulgaris subsp.", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Some_Gartons_Mangels.jpg"
  },
  { 
    name: "Corn", 
    scientific: "Zea mays", 
    type: "Vegetable", 
    water: "High", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Zea_mays_002.JPG/960px-Zea_mays_002.JPG"
  },
  { 
    name: "Cucumber", 
    scientific: "Cucumis sativus", 
    type: "Vegetable", 
    water: "High", 
    sun: "Full Sun", 
    temp: "75-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Cucumis_sativus20090812_497.jpg"
  },
  { 
    name: "Eggplant", 
    scientific: "Solanum melongena", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Eggplant_%28Flower%29.jpg"
  },
  { 
    name: "Garlic", 
    scientific: "Allium sativum", 
    type: "Vegetable", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Garlic_bulbs_and_cloves.jpg/960px-Garlic_bulbs_and_cloves.jpg"
  },
  { 
    name: "Green Beans", 
    scientific: "Phaseolus vulgaris", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9e/A_green_bean.jpg"
  },
  { 
    name: "Kale", 
    scientific: "Brassica oleracea", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flowering-kale.jpg"
  },
  { 
    name: "Lettuce", 
    scientific: "Lactuca sativa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "55-70°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Kopfsalat_Setzlinge.JPG/960px-Kopfsalat_Setzlinge.JPG"
  },
  { 
    name: "Onion", 
    scientific: "Allium cepa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Allium_cepa.jpg"
  },
  { 
    name: "Pea", 
    scientific: "Pisum sativum", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "50-70°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Pisum_sativum_green.jpg"
  },
  { 
    name: "Pepper", 
    scientific: "Capsicum annuum", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Paprikapflanze.jpg"
  },
  { 
    name: "Potato", 
    scientific: "Solanum tuberosum", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Potato_blossom.JPG"
  },
  { 
    name: "Radish", 
    scientific: "Raphanus sativus", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "55-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Rabanete.jpg"
  },
  { 
    name: "Spinach", 
    scientific: "Spinacia oleracea", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "55-70°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Spinazie_vrouwelijke_bloemen_%28Spinacia_oleracea_male_flowers%29.jpg"
  },
  { 
    name: "Strawberry", 
    scientific: "Fragaria × ananassa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/01/Strawberry_flower.jpg"
  },
  { 
    name: "Tomato", 
    scientific: "Solanum lycopersicum", 
    type: "Vegetable", 
    water: "Daily", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Tomato_plant_growing_out_from_a_fence.jpg/960px-Tomato_plant_growing_out_from_a_fence.jpg"
  },
  { 
    name: "Zucchini", 
    scientific: "Cucurbita pepo", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/USDA_summer_squash.jpg"
  },
  { 
    name: "Green Pepper", 
    scientific: "Capsicum annuum", 
    type: "Vegetable", 
    water: "Daily", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Paprikapflanze.jpg"
  },
  { 
    name: "Iris (White)", 
    scientific: "Iris germanica", 
    type: "Flower", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Iris_%C3%97_germanica_%27Before_the_Storm%27_Flower.jpg/960px-Iris_%C3%97_germanica_%27Before_the_Storm%27_Flower.jpg"
  },
  { 
    name: "Rue", 
    scientific: "Ruta graveolens", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/17/Ruta_graveolens_jfg2.jpg"
  },
  { 
    name: "Tricolor Sage", 
    scientific: "Salvia officinalis 'Tricolor'", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/2006-10-30-Salvia01.jpg"
  },
  { 
    name: "Sage (Yellow)", 
    scientific: "Salvia officinalis 'Icterina'", 
    type: "Herb", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/2006-10-30-Salvia01.jpg"
  },
  { 
    name: "Lion's Tail", 
    scientific: "Leonotis leonurus", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "65-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Leonotis_leonurus.jpg"
  },
  { 
    name: "Strawberries", 
    scientific: "Fragaria × ananassa", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-80°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/01/Strawberry_flower.jpg"
  },
  { 
    name: "Globe Amaranth (red)", 
    scientific: "Gomphrena haageana", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Purple_flower.jpg"
  },
  { 
    name: "Globe Amaranth (orange)", 
    scientific: "Gomphrena haageana", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Purple_flower.jpg"
  },
  { 
    name: "Globe Amaranth (pink)", 
    scientific: "Gomphrena globosa", 
    type: "Flower", 
    water: "Low", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Purple_flower.jpg"
  },
  { 
    name: "Eggplant (Japanese Long)", 
    scientific: "Solanum melongena", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Eggplant_%28Flower%29.jpg"
  },
  { 
    name: "Cucamelons", 
    scientific: "Melothria scabra", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Melothria_scabra_fruit.jpg/960px-Melothria_scabra_fruit.jpg"
  },
  { 
    name: "Eggplant (Black Beauty)", 
    scientific: "Solanum melongena", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Eggplant_%28Flower%29.jpg"
  },
  { 
    name: "Brussels Sprouts", 
    scientific: "Brassica oleracea var. gemmifera", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "60-75°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flowering-kale.jpg"
  },
  { 
    name: "Lemon Cucumber", 
    scientific: "Cucumis sativus", 
    type: "Vegetable", 
    water: "High", 
    sun: "Full Sun", 
    temp: "75-90°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Cucumis_sativus20090812_497.jpg"
  },
  { 
    name: "Hellebore", 
    scientific: "Helleborus spp.", 
    type: "Flower", 
    water: "Regular", 
    sun: "Partial Shade", 
    temp: "50-70°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/82/Helleborus_foetidus_3.jpg"
  },
  { 
    name: "Tomato (San Marzano)", 
    scientific: "Solanum lycopersicum", 
    type: "Vegetable", 
    water: "Daily", 
    sun: "Full Sun", 
    temp: "70-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Tomaten_im_Supermarktregal.jpg"
  },
  { 
    name: "Gourd/Squash", 
    scientific: "Cucurbita spp.", 
    type: "Vegetable", 
    water: "Regular", 
    sun: "Full Sun", 
    temp: "70-90°F",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Yellow_squash_DSC01080.jpg/960px-Yellow_squash_DSC01080.jpg"
  },
  { 
    name: "Shell Ginger", 
    scientific: "Alpinia zerumbet", 
    type: "Flower", 
    water: "High", 
    sun: "Partial Shade", 
    temp: "60-85°F",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Alpinia_zerumbet_habit.jpg"
  },
  {
    name: "California Poppy",
    scientific: "Eschscholzia californica",
    type: "Wildflower",
    water: "Low",
    sun: "Full Sun",
    temp: "15°C - 30°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Eschscholtzia_az.jpg",
    description: "The state flower of California, known for its vibrant orange petals and drought tolerance."
  },
  {
    name: "Matilija Poppy",
    scientific: "Romneya coulteri",
    type: "Perennial",
    water: "Low",
    sun: "Full Sun",
    temp: "10°C - 35°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Romneya_coulteri_kz1.jpg/960px-Romneya_coulteri_kz1.jpg",
    description: "Also known as the 'fried egg plant' for its large white flowers with yellow centers."
  },
  {
    name: "Cleveland Sage",
    scientific: "Salvia clevelandii",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun",
    temp: "5°C - 38°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Salvia_clevelandii_-_jim_sage_-_desc-plant_-_status-rare.jpg",
    description: "A fragrant native shrub with beautiful purple flower whorls, highly attractive to hummingbirds."
  },
  {
    name: "California Lilac 'Concha'",
    scientific: "Ceanothus 'Concha'",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun",
    temp: "0°C - 32°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Ceanothus_cuneatus1.jpg",
    description: "One of the best Ceanothus for garden use, with deep blue flower clusters in spring."
  },
  {
    name: "Toyon",
    scientific: "Heteromeles arbutifolia",
    type: "Shrub/Tree",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-5°C - 40°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Bombycilla_cedrorum_on_Heteromeles_arbutifolia.jpg/960px-Bombycilla_cedrorum_on_Heteromeles_arbutifolia.jpg",
    description: "Also known as Christmas Berry, this native provides beautiful red berries for birds in winter."
  },
  {
    name: "Manzanita 'Howard McMinn'",
    scientific: "Arctostaphylos 'Howard McMinn'",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-10°C - 38°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Arctostaphylos_manzanita_3.jpg/960px-Arctostaphylos_manzanita_3.jpg",
    description: "A versatile manzanita with smooth mahogany bark and delicate bell-shaped flowers."
  },
  {
    name: "Western Redbud",
    scientific: "Cercis occidentalis",
    type: "Tree",
    water: "Low/Moderate",
    sun: "Full Sun / Part Shade",
    temp: "-15°C - 40°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Cercis_occidentalis_red_rock_canyon.jpg/960px-Cercis_occidentalis_red_rock_canyon.jpg",
    description: "A stunning small tree with magenta flowers in spring and heart-shaped leaves."
  },
  {
    name: "California Fuchsia",
    scientific: "Epilobium canum",
    type: "Perennial",
    water: "Low",
    sun: "Full Sun",
    temp: "-5°C - 40°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Zauschneria_mass-400px.jpg",
    description: "Brilliant orange-red tubular flowers that bloom in late summer, a hummingbird favorite."
  },
  {
    name: "Deer Grass",
    scientific: "Muhlenbergia rigens",
    type: "Grass",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-10°C - 45°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Muhlenbergia_rigens_stem.jpg",
    description: "A large, architectural bunchgrass that adds texture and movement to the garden."
  },
  {
    name: "Coffeeberry",
    scientific: "Frangula californica",
    type: "Shrub",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "-10°C - 40°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/46/Rhamnus_californica_ssp_californica.jpg",
    description: "An evergreen shrub with attractive berries that turn from green to red to black."
  },
  {
    name: "Island Alumroot",
    scientific: "Heuchera maxima",
    type: "Perennial",
    water: "Moderate",
    sun: "Part Shade / Full Shade",
    temp: "0°C - 30°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Heuchera_maxima_1.jpg/960px-Heuchera_maxima_1.jpg",
    description: "Large, lush green leaves and tall spikes of tiny white flowers, perfect for dry shade."
  },
  {
    name: "Blue-eyed Grass",
    scientific: "Sisyrinchium bellum",
    type: "Perennial",
    water: "Moderate",
    sun: "Full Sun / Part Shade",
    temp: "-5°C - 35°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Sisyrinchium_bellum_4798.JPG/960px-Sisyrinchium_bellum_4798.JPG",
    description: "A small, iris-like plant with charming blue-purple flowers with yellow centers."
  },
  {
    name: "Woolly Blue Curls",
    scientific: "Trichostema lanatum",
    type: "Shrub",
    water: "Very Low",
    sun: "Full Sun",
    temp: "0°C - 40°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Trichostema_lanatum_flowers_2005-03-24.jpg/960px-Trichostema_lanatum_flowers_2005-03-24.jpg",
    description: "An exceptionally beautiful native with fuzzy blue flowers and aromatic foliage."
  },
  {
    name: "Desert Willow",
    scientific: "Chilopsis linearis",
    type: "Tree",
    water: "Low",
    sun: "Full Sun",
    temp: "-15°C - 45°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Chilopsis_linearis_form.jpg/960px-Chilopsis_linearis_form.jpg",
    description: "A deciduous tree with willow-like leaves and showy, trumpet-shaped pink flowers."
  },
  {
    name: "Palo Verde 'Desert Museum'",
    scientific: "Parkinsonia 'Desert Museum'",
    type: "Tree",
    water: "Low",
    sun: "Full Sun",
    temp: "-10°C - 45°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Parkinsonia_aculeata_az.jpg",
    description: "A fast-growing, thornless tree with brilliant yellow flowers and green bark."
  },
  {
    name: "Agave attenuata",
    scientific: "Agave attenuata",
    type: "Succulent",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "0°C - 40°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Starr_030418-0139_Agave_attenuata.jpg/960px-Starr_030418-0139_Agave_attenuata.jpg",
    description: "Also known as Fox Tail Agave, it has soft, spineless green leaves in a rosette."
  },
  {
    name: "Aeonium arboreum",
    scientific: "Aeonium arboreum",
    type: "Succulent",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "0°C - 35°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Aeonium_arboreum_atropurppureum.jpg",
    description: "A tree-like succulent with rosettes of leaves at the ends of its branches."
  },
  {
    name: "Jade Plant",
    scientific: "Crassula ovata",
    type: "Succulent",
    water: "Low",
    sun: "Full Sun / Part Shade",
    temp: "5°C - 40°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Crassulagorda1.jpg",
    description: "A classic succulent with thick, woody stems and fleshy green leaves."
  },
  {
    name: "Bougainvillea",
    scientific: "Bougainvillea spectabilis",
    type: "Vine",
    water: "Moderate",
    sun: "Full Sun",
    temp: "5°C - 45°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Bougainvillea_spectabilis_in_Calella.JPG/960px-Bougainvillea_spectabilis_in_Calella.JPG",
    description: "A vigorous climber known for its brilliant, colorful bracts that surround tiny flowers."
  },
  {
    name: "Meyer Lemon",
    scientific: "Citrus × limon 'Meyer'",
    type: "Fruit Tree",
    water: "Moderate",
    sun: "Full Sun",
    temp: "0°C - 35°C",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/MeyerLemon.jpg/960px-MeyerLemon.jpg",
    description: "A popular citrus tree producing thin-skinned, sweet lemons throughout the year."
  },
  {
    name: "Hass Avocado",
    scientific: "Persea americana 'Hass'",
    type: "Fruit Tree",
    water: "Moderate",
    sun: "Full Sun",
    temp: "0°C - 35°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Avocado.jpeg",
    description: "The most popular avocado variety, known for its rich, creamy fruit and pebbly skin."
  },
  {
    name: "Fig 'Black Mission'",
    scientific: "Ficus carica 'Black Mission'",
    type: "Fruit Tree",
    water: "Moderate",
    sun: "Full Sun",
    temp: "-10°C - 40°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Feigenstrauch.JPG",
    description: "A reliable producer of sweet, dark purple figs with pink flesh."
  },
  {
    name: "Rosemary",
    scientific: "Salvia rosmarinus",
    type: "Herb",
    water: "Low",
    sun: "Full Sun",
    temp: "-10°C - 45°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Rozmarin.jpg",
    description: "A versatile, aromatic herb that is both culinary and ornamental."
  },
  {
    name: "Lavender 'Munstead'",
    scientific: "Lavandula angustifolia 'Munstead'",
    type: "Herb",
    water: "Low",
    sun: "Full Sun",
    temp: "-15°C - 35°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Lawenda_w%C4%85skolistna_Lavandula_angustifolia.jpg",
    description: "A compact lavender variety with fragrant purple flowers and silvery foliage."
  },
  {
    name: "Tomato 'Celebrity'",
    scientific: "Solanum lycopersicum 'Celebrity'",
    type: "Vegetable",
    water: "Moderate",
    sun: "Full Sun",
    temp: "10°C - 35°C",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Tomaten_im_Supermarktregal.jpg",
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
