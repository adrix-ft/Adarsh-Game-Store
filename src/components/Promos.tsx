import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Play, ShoppingCart } from 'lucide-react';
import { getGameCoverUrl } from '../utils/image';
import { motion, AnimatePresence } from 'motion/react';

export default function Promos() {
  const { addToCart, catalog, platformFilter, setPlayingTrailerUrl } = useStore();
  
  const filteredCatalog = catalog.filter(game => {
    if (platformFilter !== 'All' && !game.categories?.includes(platformFilter)) return false;
    return true;
  });
  
  // STRICT LIMIT: Slices the array so it can never exceed exactly 5 games
  let promoGames = filteredCatalog.filter(game => game.isFeaturedPromo).slice(0, 5);
  
  if (promoGames.length === 0) {
    promoGames = filteredCatalog.slice(0, 5);
  } else if (promoGames.length < 5) {
    const additional = filteredCatalog.filter(game => !game.isFeaturedPromo).slice(0, 5 - promoGames.length);
    promoGames = [...promoGames, ...additional];
  }
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (promoGames.length === 0) return;
    setActiveIndex(0);
  }, [catalog]);

  if (promoGames.length === 0) return null;
  const activePromo = promoGames[activeIndex] || promoGames[0];

  return (
    // Changed lg:h-[320px] to lg:h-[360px] to perfectly fit 5 items + gaps without overflowing
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[360px]">
      <div className="flex flex-col gap-4">
        {promoGames.map((game, idx) => (
          <div 
            key={game.title}
            onClick={() => setActiveIndex(idx)}
            className="flex gap-4 h-[60px]"
          >
            <div className={`flex-1 bg-[#11212D] rounded-md relative overflow-hidden flex items-center justify-end px-8 group cursor-pointer border transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_15px_rgba(74,92,106,0.2)] hover:z-20 ${idx === activeIndex ? 'border-[#CCD0CF]' : 'border-[#253745] hover:border-[#4A5C6A]'}`}>
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out saturate-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:saturate-[1.2] group-hover:brightness-110 z-0" style={{ backgroundImage: `url('${game.customCoverUrl || getGameCoverUrl(game.title)}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-l from-[#06141B]/95 via-[#06141B]/60 to-transparent pointer-events-none transition-opacity duration-300 z-0" />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(255,255,255,0.15)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-10" />
              <span className="font-semibold text-sm tracking-wider text-[#9BA8AB] group-hover:text-[#CCD0CF] relative z-10 transition-colors uppercase drop-shadow-md text-right truncate w-48">{game.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[280px] lg:h-full bg-[#11212D] rounded-md relative overflow-hidden group flex flex-col items-center justify-center border border-[#253745] hover:border-[#4A5C6A] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(74,92,106,0.3)] hover:z-20">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out saturate-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:saturate-[1.2] group-hover:brightness-110 z-0" style={{ backgroundImage: `url('${activePromo.customCoverUrl || getGameCoverUrl(activePromo.title)}')` }}></div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#06141B]/95 via-[#06141B]/40 to-transparent pointer-events-none transition-opacity duration-300 z-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06141B]/95 via-[#06141B]/60 to-transparent pointer-events-none transition-opacity duration-300 z-0" />
        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(255,255,255,0.15)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-10" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activePromo.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
          >
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center w-full drop-shadow-md">
               <div className="text-xs text-[#9BA8AB] mb-1 uppercase tracking-widest">Featured Game</div>
               <div className="text-xl inline-block font-black tracking-widest uppercase border-b border-[#4A5C6A] pb-1 text-[#CCD0CF] truncate w-64 px-4">{activePromo.title}</div>
            </div>
            
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (activePromo.trailer) {
                  setPlayingTrailerUrl(activePromo.trailer);
                } else {
                  alert('Trailer coming soon for ' + activePromo.title);
                }
              }}
              className="w-14 h-14 bg-[#CCD0CF] backdrop-blur rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(204,208,207,0.1)] group-hover:scale-110 transition-all cursor-pointer pointer-events-auto mt-4 z-10"
            >
              <Play className="w-5 h-5 text-[#06141B] ml-1" fill="currentColor" />
            </div>
            
            <div className="absolute bottom-6 text-center w-full z-10 px-4 flex flex-col items-center drop-shadow-md">
              <div className="text-sm font-bold tracking-widest text-[#CCD0CF] uppercase">WATCH TRAILER</div>
              <div className="text-xs text-[#9BA8AB] mt-1.5 tracking-wider mb-3 font-semibold">{activePromo.price}</div>
              
              <button 
                 onClick={(e) => { e.stopPropagation(); addToCart(activePromo); }}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#253745]/80 hover:bg-[#4A5C6A] border border-[#4A5C6A] text-[#CCD0CF] hover:text-white text-xs font-medium transition-all pointer-events-auto shadow-lg backdrop-blur-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                BUY NOW - {activePromo.price}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}