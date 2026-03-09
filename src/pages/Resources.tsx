import { Video, BookOpen, ExternalLink, PlayCircle, Plus, Search, ChevronDown, ChevronUp, X, CheckCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGamification } from '@/hooks/useGamification';
import { useState, useMemo, useEffect } from 'react';

// Mock data with real-world images and descriptions
const RESOURCES = {
  'Acne': {
    description: "Acne is a skin condition that occurs when your hair follicles become plugged with oil and dead skin cells. It causes whiteheads, blackheads or pimples.",
    items: [
      { 
        type: 'video', 
        title: 'Dermatologist Guide to Treating Acne', 
        duration: '12:04', 
        url: 'https://www.youtube.com/embed/W_57Hk8-sIE', // Dr. Dray Acne Tips
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800'
      },
      { 
        type: 'article', 
        title: 'The Best Ingredients for Acne-Prone Skin', 
        readTime: '5 min', 
        url: '#',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'
      },
      { 
        type: 'article', 
        title: 'Diet and Acne: What is the Connection?', 
        readTime: '4 min', 
        url: '#',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
      },
    ]
  },
  'Eczema': {
    description: "Eczema is a condition that makes your skin red and itchy. It's common in children but can occur at any age. It is long lasting (chronic) and tends to flare periodically.",
    items: [
      { 
        type: 'video', 
        title: 'Managing Eczema Flare-ups', 
        duration: '08:30', 
        url: 'https://www.youtube.com/embed/3V36J5S5-0U',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
      },
      { 
        type: 'article', 
        title: 'Understanding Eczema Triggers', 
        readTime: '6 min', 
        url: '#',
        image: 'https://images.unsplash.com/photo-1611079830811-865ec446a617?auto=format&fit=crop&q=80&w=800'
      },
    ]
  },
  'Melanoma': {
    description: "Melanoma, the most serious type of skin cancer, develops in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color.",
    items: [
      { 
        type: 'video', 
        title: 'ABCDEs of Melanoma', 
        duration: '05:15', 
        url: 'https://www.youtube.com/embed/bkJd0a_tqG4',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
      },
      { 
        type: 'article', 
        title: 'When to See a Doctor About a Mole', 
        readTime: '3 min', 
        url: '#',
        image: 'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&q=80&w=800'
      },
    ]
  },
  'General': {
    description: "General skincare advice to maintain healthy, glowing skin. Learn about routines, sun protection, and hydration.",
    items: [
      { 
        type: 'video', 
        title: 'Basic Skincare Routine 101', 
        duration: '10:00', 
        url: 'https://www.youtube.com/embed/0e3GPea1Tyg',
        image: 'https://images.unsplash.com/photo-1556228552-e9a717092201?auto=format&fit=crop&q=80&w=800'
      },
      { 
        type: 'article', 
        title: 'Sun Protection: Why it Matters', 
        readTime: '4 min', 
        url: '#',
        image: 'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?auto=format&fit=crop&q=80&w=800'
      },
      { 
        type: 'article', 
        title: 'Hydration and Skin Health', 
        readTime: '3 min', 
        url: '#',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800'
      },
    ]
  }
};

export default function Resources() {
  const { addXP } = useGamification();
  const [xpAnimation, setXpAnimation] = useState<{ id: string, amount: number, achievements?: string[] } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ url: string, title: string, id: string } | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);

  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return Object.entries(RESOURCES);

    return Object.entries(RESOURCES).reduce((acc, [category, data]) => {
      const matchesCategory = category.toLowerCase().includes(query);
      const filteredItems = data.items.filter(item => 
        matchesCategory || item.title.toLowerCase().includes(query)
      );
      
      if (filteredItems.length > 0) {
        acc.push([category, { ...data, items: filteredItems }]);
      }
      return acc;
    }, [] as [string, typeof RESOURCES['Acne']][]);
  }, [searchQuery]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleResourceClick = (item: any, id: string) => {
    if (item.type === 'video') {
      setActiveVideo({ url: item.url, title: item.title, id });
      setVideoProgress(0);
      setVideoCompleted(false);
    } else {
      // For articles, we can award XP immediately or on return
      const xpAmount = 10;
      const { leveledUp, newAchievements } = addXP(xpAmount);
      setXpAnimation({ id, amount: xpAmount, achievements: newAchievements });
      setTimeout(() => setXpAnimation(null), 2000);
    }
  };

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeVideo && !videoCompleted) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setVideoCompleted(true);
            return 100;
          }
          return prev + 10; // 10 seconds to finish
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeVideo, videoCompleted]);

  const handleVideoComplete = () => {
    if (!activeVideo) return;
    
    const xpAmount = 20;
    const { leveledUp, newAchievements } = addXP(xpAmount);
    
    setXpAnimation({ id: activeVideo.id, amount: xpAmount, achievements: newAchievements });
    setTimeout(() => setXpAnimation(null), 2000);
    
    setActiveVideo(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header & Search */}
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Educational Resources</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Earn XP by learning about your skin. Curated articles and videos to help you manage conditions effectively.
          </p>
        </div>

        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
            placeholder="Search by condition or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No resources found matching "{searchQuery}"</p>
        </div>
      ) : (
        filteredResources.map(([category, data], index) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-6"
          >
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-xl font-bold text-slate-200 border-l-4 border-teal-500 pl-4 group-hover:text-teal-400 transition-colors">
                {category === 'General' ? 'General Skincare' : `If you have concerns about ${category}`}
              </h2>
              <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                {expandedCategories.includes(category) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedCategories.includes(category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-slate-400 mb-6 pl-5 border-l border-slate-700/50 italic">
                    {data.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((item, i) => {
                const id = `${category}-${i}`;
                return (
                  <div 
                    key={i} 
                    className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-teal-500/30 transition-all flex flex-col"
                  >
                    <div 
                      onClick={() => handleResourceClick(item, id)}
                      className="block h-full cursor-pointer"
                    >
                      <div className="aspect-video bg-slate-950 relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-teal-600/90 rounded-full p-3 text-white shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                            {item.type === 'video' ? <PlayCircle size={32} /> : <BookOpen size={32} />}
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium backdrop-blur-sm">
                          {item.type === 'video' ? item.duration : item.readTime}
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                            item.type === 'video' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {item.type}
                          </span>
                          {item.type !== 'video' && <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400" />}
                        </div>
                        <h3 className="text-slate-200 font-semibold leading-tight group-hover:text-teal-500 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* XP Animation */}
                    <AnimatePresence>
                      {xpAnimation?.id === id && (
                        <motion.div
                          initial={{ opacity: 0, y: 0, scale: 0.5 }}
                          animate={{ opacity: 1, y: -40, scale: 1.2 }}
                          exit={{ opacity: 0, y: -60 }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center gap-2"
                        >
                          <div className="flex items-center gap-1 text-amber-400 font-bold text-xl drop-shadow-lg">
                            <Plus size={20} strokeWidth={4} />
                            {xpAnimation.amount} XP
                          </div>
                          {xpAnimation.achievements?.map(ach => (
                            <div key={ach} className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full border border-amber-500/50 flex items-center gap-1">
                              <Trophy size={12} /> {ach}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-slate-200">{activeVideo.title}</h3>
                <button 
                  onClick={() => setActiveVideo(null)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative aspect-video bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={activeVideo.url} 
                  title={activeVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6 flex items-center justify-between bg-slate-900">
                <div className="flex-1 mr-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{videoCompleted ? 'Completed' : `${videoProgress}%`}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleVideoComplete}
                  disabled={!videoCompleted}
                  className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    videoCompleted 
                      ? 'bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {videoCompleted ? <CheckCircle size={18} /> : <PlayCircle size={18} />}
                  {videoCompleted ? 'Claim Reward' : 'Watching...'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
