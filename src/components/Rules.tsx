import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Info, AlertTriangle, Scale, Clock, DollarSign, Users, Leaf } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const FAQ_DATA = [
  {
    category: "Membership",
    icon: Users,
    questions: [
      {
        question: "Who is eligible to be a member?",
        answer: "You must be a current Long Beach resident (no business addresses). You need a California driver's license or ID plus a recent utility bill, insurance bill, or deed dated within the last 3 months."
      },
      {
        question: "Can two people at the same address both have plots?",
        answer: "No. Each Long Beach residential address may be assigned only one plot."
      },
      {
        question: "Can I transfer my plot to someone else?",
        answer: "No. Plots cannot be transferred, exchanged, or sublet. Members may request one plot change and must leave the current plot ready for the next member."
      },
      {
        question: "What happens if I move out of Long Beach?",
        answer: "You must immediately notify the Membership Chair/1st Vice President and relinquish your plot."
      },
      {
        question: "Can a family member take over my plot?",
        answer: "Only at the Board's discretion, if you leave in good standing, and the family member must complete an orientation and become a new member."
      },
      {
        question: "What are the garden hours?",
        answer: "Dawn to dusk, any time of year."
      }
    ]
  },
  {
    category: "Fees & Dues",
    icon: DollarSign,
    questions: [
      {
        question: "How much are annual dues?",
        answer: "$160 per year. The garden year runs May 1 through April 30. New members starting after October receive pro-rated dues."
      },
      {
        question: "What is the application fee?",
        answer: "$10 non-refundable application fee to be added to the waiting list."
      },
      {
        question: "When is renewal due?",
        answer: "Renewal paperwork and fees must be received by April 30. A $45 penalty applies if not received by April 30. If not paid by May 15, you lose garden privileges."
      },
      {
        question: "How much is a gate opener?",
        answer: "$20 per opener (rental fee for lifetime of membership, must be returned). Vehicle tag replacement is $5. Replacement for lost opener is $20; lost vehicle pass is $5."
      },
      {
        question: "Are dues refundable?",
        answer: "No. All dues and fees are non-refundable."
      },
      {
        question: "How do I pay?",
        answer: "By check or money order only. Cash is not accepted. A $50 fee applies for returned checks."
      }
    ]
  },
  {
    category: "Community Service",
    icon: Clock,
    questions: [
      {
        question: "How many community service hours are required?",
        answer: "Minimum 4 hours per garden year (May 1 – April 30). At least 2 of those 4 hours must be completed by December 31. If you miss the December 31 deadline, you owe 6 total hours by April 30."
      },
      {
        question: "When are work parties?",
        answer: "Normally the first Saturday of each month. Check-in at 7:15 AM, work from 7:30 AM to 9:30 AM."
      },
      {
        question: "Can I bring helpers to work parties?",
        answer: "Yes — family or friends over age 13 may help, but all workers must stay for the full 2-hour period."
      },
      {
        question: "Can I pay instead of working?",
        answer: "Yes. You may pay $50/hour for unserved hours. Payment must be made by end of December and April to meet requirements."
      },
      {
        question: "Can unused community service hours carry over to next year?",
        answer: "No. Hours cannot carry over to or from previous or future membership years. There is no grace period or waiver."
      }
    ]
  },
  {
    category: "Planting Rules",
    icon: Leaf,
    questions: [
      {
        question: "What percentage of my plot must be edible crops?",
        answer: "At least 75% must be edible crops at all times. The remaining 25% can include flowers, pathways, storage containers, seating, a small potting table, and composters."
      },
      {
        question: "How many flowers can I plant?",
        answer: "No more than 10% of your plot may be beneficial flowers."
      },
      {
        question: "Are cover crops allowed?",
        answer: "No. Token planting and cover crops are not allowed. Your plot must always be fully planted with seasonal vegetables."
      },
      {
        question: "Can I plant in containers?",
        answer: "No. Planting in containers of any type is not permitted."
      },
      {
        question: "What is the Four-Foot Rule?",
        answer: "Plants that grow very large at maturity — like asparagus, artichokes, sunflowers, and corn — must be planted at least 4 feet from the plot borders."
      },
      {
        question: "Can I plant perennials like rosemary or lavender?",
        answer: "Yes, but they must be maintained at no more than 3 feet in height and width, and the main stem must be no larger than 1–2 inches in diameter. A community herb garden is also available at the southeast corner of the orchard."
      },
      {
        question: "Am I allowed to hand water only?",
        answer: "Yes. Hand watering only — no drip systems, oscillating sprinklers, or soaker hoses are permitted."
      }
    ]
  },
  {
    category: "Seasonal Rules",
    icon: Clock,
    questions: [
      {
        question: "When must tomatoes, peppers, and eggplant be removed?",
        answer: "They must be removed before November 15 and cannot be replanted before March 1. This controls overwintering diseases."
      },
      {
        question: "When must broccoli, Brussels sprouts, cabbage, and cauliflower be removed?",
        answer: "All must be removed before May 1 to control disease."
      },
      {
        question: "What are the seasonal planting deadlines?",
        answer: "Spring/Summer deadline: May 1. Fall/Winter deadline: November 15. Your plot must be planted by these dates."
      }
    ]
  },
  {
    category: "Banned Plants",
    icon: AlertTriangle,
    questions: [
      {
        question: "What plants are completely banned from the garden?",
        answer: "Banned plants include: Bamboo, thorny berries (blackberries, raspberries), Cactus, Calendula/Pot Marigold, Canna Lily, Castor Beans, Dandelion, Datura, Four O'Clock, Gopher Purge, Grapevines, Horseradish, Jerusalem Artichokes, Melissa/Lemon Balm, Milkweed, Mint and Catnip, Morning Glory, Nightshade, Petunia, Plumeria, Potatoes/Sweet Potatoes/Yams, Roses, Sorghum, Stinging Nettle, Succulents including Taro, Sugar Cane, any thorny plants, trees or tree-like plants, Volunteer Tomatoes, woody perennials over 3 feet, Cannabis or illegal plants."
      },
      {
        question: "Are berries allowed?",
        answer: "Strawberries and blueberries are allowed. Blackberries, raspberries, and all Rubus genus berries are banned. Plants in plots before July 1, 2008 are grandfathered and will be removed when those plots are vacated."
      },
      {
        question: "Can I grow potatoes or sweet potatoes?",
        answer: "No. Potatoes, sweet potatoes, and yams are banned because they negatively affect tomatoes."
      },
      {
        question: "Is mint allowed?",
        answer: "No. Mint, including catnip, is banned because it is invasive."
      },
      {
        question: "Can I grow volunteer tomatoes?",
        answer: "No. Volunteer tomatoes are banned due to disease risk."
      }
    ]
  },
  {
    category: "Plot Conduct",
    icon: ShieldCheck,
    questions: [
      {
        question: "Can I enter another member's plot?",
        answer: "No. You must have permission. Entering without permission can result in termination of membership."
      },
      {
        question: "Can I sell produce from my garden?",
        answer: "No. Selling or using garden produce for profit is prohibited."
      },
      {
        question: "What should I do with weeds?",
        answer: "Remove them by the roots immediately. Mulch does not stop weeds. Uncontrolled weeds can lead to Correction Notices and plot termination."
      },
      {
        question: "Can I raise the soil level in my plot?",
        answer: "No more than 8 inches above the border boards."
      },
      {
        question: "Can structures shade my neighbor's plot?",
        answer: "No. Nothing — plant or structure — may shade any neighboring plots."
      },
      {
        question: "Can I bring my dog or pet to the garden?",
        answer: "No. Animals are not allowed in the garden, including leaving pets in vehicles."
      },
      {
        question: "Can I drink alcohol or smoke in the garden?",
        answer: "No. Alcoholic beverages and smoking (including vaping) are prohibited per Long Beach park rules."
      },
      {
        question: "What happens if I go on vacation?",
        answer: "You are responsible for arranging someone to care for your plot. LBCGA is not responsible for maintaining any member's plot."
      }
    ]
  },
  {
    category: "Food Bank & Orchard",
    icon: Info,
    questions: [
      {
        question: "Can I take items from the Food Bank table?",
        answer: "No. Removing any items (food, containers, bags, etc.) from the Food Bank plots or table is prohibited and can result in termination."
      },
      {
        question: "Can I enter the orchard?",
        answer: "No, not without permission from the designated Orchard Manager."
      },
      {
        question: "How is orchard fruit distributed?",
        answer: "The Orchard Manager picks fruit and places it on the Orchard Table under the gazebo. Each person in a plot may take the posted amount for themselves only — you cannot take fruit for others."
      }
    ]
  },
  {
    category: "Termination",
    icon: Scale,
    questions: [
      {
        question: "What can get me terminated from the garden?",
        answer: "Reasons include: falsifying information, theft or destruction of property, drinking/smoking, taking Food Bank items, taking more than the posted fruit amount, failing to fix a Correction Notice, three Correction Notices in 12 months, abandoning your plot, entering another member's plot without permission, and disrespectful or threatening behavior."
      },
      {
        question: "What is considered an abandoned plot?",
        answer: "No crops, no activity (planting, watering, or weeding), overrun by weeds or blooming weeds, or crops going to waste or rotting."
      },
      {
        question: "Can I appeal a termination?",
        answer: "Yes. You can appeal in person or in writing to the Board of Directors by contacting the President to be placed on the next meeting agenda. The Board's decision is final."
      },
      {
        question: "Can I rejoin after losing my membership?",
        answer: "A minor infraction: you may reapply after a one-year waiting period. A major infraction: you may permanently lose membership and be barred from the garden entirely."
      }
    ]
  }
];

export default function Rules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Membership");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (q: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [q]: !prev[q]
    }));
  };

  const filteredFaqs = FAQ_DATA.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="px-6 max-w-5xl mx-auto py-8 space-y-12 pb-32">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-6 relative">
        <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
          <BookOpen size={140} className="text-primary rotate-12" />
        </div>
        <div className="flex-1 relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block"
          >
            Governance & Conduct
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary leading-none mb-6"
          >
            Garden Rules & Agreements
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-on-surface-variant max-w-md text-lg leading-relaxed"
          >
            Effective May 1, 2025. Long Beach Community Garden Association standards for all botanical inhabitants and their curators.
          </motion.p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
        <input 
          type="text" 
          placeholder="Search rules, banned plants, or membership requirements..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-6 bg-surface-container-low border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all text-lg shadow-inner"
        />
      </section>

      {/* FAQ Content */}
      <div className="space-y-6">
        {filteredFaqs.map((cat, catIdx) => (
          <motion.div 
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.05 }}
            className="rounded-[2.5rem] overflow-hidden border border-outline-variant/10 glass-card"
          >
            <button 
              onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
              className="w-full p-8 flex items-center justify-between hover:bg-surface-container-high transition-colors text-left"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <cat.icon size={28} />
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-black tracking-tight">{cat.category}</h3>
                  <p className="text-sm text-on-surface-variant font-medium">{cat.questions.length} Articles</p>
                </div>
              </div>
              {expandedCategory === cat.category ? <ChevronUp className="text-outline" /> : <ChevronDown className="text-outline" />}
            </button>

            <AnimatePresence>
              {expandedCategory === cat.category && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-surface-container-lowest/50"
                >
                  <div className="p-8 pt-0 space-y-4">
                    {cat.questions.map((q, qIdx) => (
                      <div 
                        key={qIdx}
                        className="border-b border-outline-variant/10 last:border-0 py-4"
                      >
                        <button 
                          onClick={() => toggleQuestion(`${cat.category}-${qIdx}`)}
                          className="w-full flex items-start justify-between text-left group"
                        >
                          <span className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors pr-4">
                            {q.question}
                          </span>
                          <div className="mt-1 shrink-0">
                            {expandedQuestions[`${cat.category}-${qIdx}`] ? 
                              <ChevronUp size={20} className="text-primary" /> : 
                              <ChevronDown size={20} className="text-outline" />
                            }
                          </div>
                        </button>
                        <AnimatePresence>
                          {expandedQuestions[`${cat.category}-${qIdx}`] && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-4 text-on-surface-variant leading-relaxed text-lg font-medium">
                                {q.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <section className="p-10 border border-outline-variant/20 rounded-[3rem] glass-card flex flex-col md:flex-row gap-8 items-center shadow-inner relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <ShieldCheck size={160} className="text-primary rotate-12" />
        </div>
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl shrink-0 relative z-10">
          <Scale className="text-primary" size={32} />
        </div>
        <div className="space-y-2 relative z-10">
          <h4 className="font-headline text-2xl font-black text-on-surface tracking-tight">Official Notice</h4>
          <p className="text-on-surface-variant text-lg leading-relaxed italic font-medium">
            "These rules are established to ensure the longevity and harmony of our shared botanical sanctuary. Membership is a privilege contingent upon adherence to these standards."
          </p>
        </div>
      </section>
    </div>
  );
}
