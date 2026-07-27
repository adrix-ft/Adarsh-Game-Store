import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getGameCoverUrl } from '../utils/image';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { addToCart, catalog, catalogLoaded } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Filter preferred hero games or prioritize local cache first
  let heroGames = catalog.filter(game => game.showInHero);
  if (heroGames.length === 0) {
    heroGames = [...catalog].sort((a, b) => (b.onSale ? 1 : 0) - (a.onSale ? 1 : 0)).slice(0, 5);
  }

  // 2. Ensure local storage/default heroes are strictly prioritized first in sequence
  heroGames.sort((a, b) => {
    const priorityTitles = ['God of War', 'God of War Ragnarök', "Marvel's Spider-Man 2", 'Ghost of Tsushima'];
    const indexA = priorityTitles.indexOf(a.title);
    const indexB = priorityTitles.indexOf(b.title);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });

  // Auto-transition timer that resets whenever activeIndex changes
  useEffect(() => {
    if (heroGames.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, heroGames.length]);

  if (heroGames.length === 0) return null;

  const safeIndex = activeIndex >= heroGames.length ? 0 : activeIndex;
  const activeGame = heroGames[safeIndex];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 pt-8 pb-4">
      {/* Optional subtle status indicator if database data is still syncing in background */}
      {!catalogLoaded && (
        <div className="text-[10px] text-[#9BA8AB] uppercase tracking-widest mb-1 text-right animate-pulse">
          Loading live database sync...
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-0 bg-[#11212D] rounded-2xl overflow-hidden border border-[#253745] shadow-2xl w-full">
        
        {/* Left: 16:9 Banner with Soft, Buttery Cross-Fade */}
        <div className="w-full lg:w-2/3 aspect-video relative group overflow-hidden bg-[#06141B]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeGame.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${activeGame.customCoverUrl || getGameCoverUrl(activeGame.title)}')` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#11212D] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#11212D]" />
          
          <button 
            onClick={() => setActiveIndex((prev) => (prev - 1 + heroGames.length) % heroGames.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#06141B]/70 border border-[#4A5C6A]/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#4A5C6A] cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setActiveIndex((prev) => (prev + 1) % heroGames.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#06141B]/70 border border-[#4A5C6A]/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#4A5C6A] cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Right: Game Details with Locked Fixed Height Container */}
        <div className="w-full lg:w-1/3 p-6 lg:p-8 flex flex-col justify-between relative bg-[#11212D] overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeGame.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col h-full justify-between"
            >
              {/* Locked height container so descriptions don't cause height jumps */}
              <div className="h-[210px] sm:h-[220px] flex flex-col justify-start overflow-hidden">
                <div className="inline-block px-3 py-1 mb-3 rounded-full bg-[#253745]/60 border border-[#4A5C6A]/40 text-[#CCD0CF] text-[10px] font-bold tracking-widest uppercase self-start shadow-sm shrink-0">
                  {activeGame.onSale ? 'Trending Now' : 'Featured'}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-1 drop-shadow-md line-clamp-1">
                  {activeGame.title}
                </h2>
                <p className="text-[#9BA8AB] text-[10px] font-extrabold tracking-widest uppercase mb-2 shrink-0">
                  EXPERIENCE THE JOURNEY
                </p>
                <p className="text-[#9BA8AB] text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {activeGame.description || 'Dive into an unforgettable adventure.'}
                </p>
              </div>
              
              <div className="pt-4 mt-auto">
                <div className="flex items-baseline gap-3 mb-4">
                  {activeGame.onSale && activeGame.originalPrice && (
                    <span className="text-xs font-bold text-red-400 line-through decoration-red-400/50">{activeGame.originalPrice}</span>
                  )}
                  <span className="text-3xl font-black text-white">{activeGame.price}</span>
                </div>
                
                <button
                  onClick={() => addToCart(activeGame)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#253745] to-[#4A5C6A] hover:from-[#4A5C6A] hover:to-[#596F80] border border-[#4A5C6A]/60 text-white font-bold transition-all shadow-[0_4px_20px_rgba(37,55,69,0.4)] flex items-center justify-center gap-2.5 uppercase tracking-wider text-xs sm:text-sm cursor-pointer group"
                >
                  <ShoppingCart className="w-4 h-4 text-[#CCD0CF] group-hover:scale-110 transition-transform" />
                  <span>Buy Now</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[#253745]/60">
            {heroGames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === safeIndex ? 'bg-white w-6' : 'bg-[#4A5C6A]/60 w-2 hover:bg-[#9BA8AB]'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}