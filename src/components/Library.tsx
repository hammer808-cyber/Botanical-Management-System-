import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowUpRight, Droplets, Sun, Activity, Heart, Expand } from 'lucide-react';

const plants = [
  {
    name: "Bee Balm",
    scientific: "Monarda didyma",
    type: "Perennial",
    moisture: "Moderate",
    image: "https://images.unsplash.com/photo-1597333581232-26130cc5bb7c?auto=format&fit=crop&q=80&w=800",
    category: "Flower"
  },
  {
    name: "Echinacea",
    scientific: "Echinacea purpurea",
    type: "Perennial",
    moisture: "Full Sun",
    image: "https://images.unsplash.com/photo-1588613254750-cf5d9966600c?auto=format&fit=crop&q=80&w=800",
    category: "Flower"
  },
  {
    name: "Calendula",
    scientific: "Calendula officinalis",
    type: "Annual",
    moisture: "Medicinal",
    image: "https://images.unsplash.com/photo-1599591037488-8a3006d6999d?auto=format&fit=crop&q=80&w=800",
    category: "Herb"
  },
  {
    name: "Black-Eyed Susan",
    scientific: "Rudbeckia hirta",
    type: "Biennial",
    moisture: "Hardy",
    image: "https://images.unsplash.com/photo-1589123053646-4e8c46480638?auto=format&fit=crop&q=80&w=800",
    category: "Flower"
  },
  {
    name: "Roma Tomato",
    scientific: "Solanum lycopersicum",
    type: "Annual",
    moisture: "High",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800",
    category: "Vegetable"
  },
  {
    name: "Lavender",
    scientific: "Lavandula angustifolia",
    type: "Perennial",
    moisture: "Low",
    image: "https://images.unsplash.com/photo-1591038332313-3599903e493c?auto=format&fit=crop&q=80&w=800",
    category: "Herb"
  },
  {
    name: "Basil",
    scientific: "Ocimum basilicum",
    type: "Annual",
    moisture: "Moderate",
    image: "https://images.unsplash.com/photo-1618376168163-050a03475107?auto=format&fit=crop&q=80&w=800",
    category: "Herb"
  },
  {
    name: "Rosemary",
    scientific: "Salvia rosmarinus",
    type: "Perennial",
    moisture: "Low",
    image: "https://images.unsplash.com/photo-1515589177083-8d84bb936341?auto=format&fit=crop&q=80&w=800",
    category: "Herb"
  },
  {
    name: "Zucchini",
    scientific: "Cucurbita pepo",
    type: "Annual",
    moisture: "High",
    image: "https://images.unsplash.com/photo-1599591037488-8a3006d6999d?auto=format&fit=crop&q=80&w=800",
    category: "Vegetable"
  },
  {
    name: "Bell Pepper",
    scientific: "Capsicum annuum",
    type: "Annual",
    moisture: "Moderate",
    image: "https://images.unsplash.com/photo-1566275529824-cca6d008f3da?auto=format&fit=crop&q=80&w=800",
    category: "Vegetable"
  },
  {
    name: "Sunflowers",
    scientific: "Helianthus annuus",
    type: "Annual",
    moisture: "Moderate",
    image: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=800",
    category: "Flower"
  },
  {
    name: "Mint",
    scientific: "Mentha",
    type: "Perennial",
    moisture: "High",
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&q=80&w=800",
    category: "Herb"
  }
];

export default function Library() {
  const [activeFilter, setActiveFilter] = React.useState('All Species');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPlants = plants.filter(plant => {
    const matchesFilter = activeFilter === 'All Species' || 
                         (activeFilter === 'Flowers' && plant.category === 'Flower') ||
                         (activeFilter === 'Herbs' && plant.category === 'Herb') ||
                         (activeFilter === 'Vegetables' && plant.category === 'Vegetable') ||
                         (activeFilter === 'Perennials' && plant.type === 'Perennial');
    
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.scientific.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="px-6 max-w-7xl mx-auto py-8 space-y-12">
      {/* Hero Search & Editorial Title */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-label text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block">Reference Catalog</span>
            <h2 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface tracking-tighter leading-none mb-6">
              Botanical <br/><span className="text-primary italic">Library</span>
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
              An academic archive of botanical specimens curated for the modern horticulturalist. Find cultivation insights and morphological data.
            </p>
          </div>
          <div className="w-full md:w-80">
            <div className="relative group transition-all duration-300 ease-out focus-within:scale-[1.02] focus-within:shadow-lg focus-within:shadow-primary/5">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                <Search size={20} className="transition-all duration-300 group-focus-within:-translate-x-1 group-focus-within:text-primary" />
              </div>
              <input 
                className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:bg-surface-container-highest transition-all font-body text-sm focus:ring-primary/30 placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-2 focus:placeholder:opacity-50" 
                placeholder="Search species..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="overflow-x-auto hide-scrollbar flex gap-2 pb-2">
        {['All Species', 'Flowers', 'Herbs', 'Vegetables', 'Perennials'].map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-6 py-2.5 rounded-full font-label text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors",
              activeFilter === filter ? "bg-primary text-on-primary shadow-md shadow-primary/10" : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {filteredPlants.map((plant, i) => (
          <article key={plant.name} className={cn("group relative flex flex-col", i % 3 === 0 && "md:col-span-2")}>
            <div className={cn("relative overflow-hidden rounded-3xl mb-6", i % 3 === 0 ? "aspect-[16/9] md:h-[500px]" : "aspect-[4/5]")}>
              <img 
                src={plant.image} 
                alt={plant.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-white/95 backdrop-blur-sm text-primary text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
                  {plant.category}
                </span>
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-primary italic font-serif text-sm mb-1">{plant.scientific}</p>
                <h3 className="text-3xl font-headline font-bold text-on-surface tracking-tight leading-none group-hover:text-primary transition-colors">{plant.name}</h3>
                <div className="flex items-center gap-3 mt-4 text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <Droplets size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{plant.moisture}</span>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300">
                <ArrowUpRight size={20} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      <section className="mt-20 flex flex-col items-center">
        <button className="px-12 py-5 bg-primary text-on-primary rounded-full font-headline font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-3 active:scale-95">
          Discover More Species
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </section>
    </div>
  );
}

import { cn } from '@/src/lib/utils';
