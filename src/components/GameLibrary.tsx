import SectionHeader from './SectionHeader';
import { ShoppingCart, Check, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { getGameCoverUrl } from '../utils/image';

export default function GameLibrary() {
  const { selectedCategory, addToCart, cart, catalog, platformFilter, catalogLoaded } = useStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    setVisibleCount(30);
  }, [selectedCategory, platformFilter]);

  const filteredGames = catalog.filter(game => {
    if (!game.categories?.includes(selectedCategory)) return false;
    if (platformFilter !== 'All' && !game.categories?.includes(platformFilter)) return false;
    return true;
  });

  const displayedGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  return (
    <section>
      <SectionHeader title={selectedCategory.toUpperCase() + (selectedCategory === 'Store' ? " CATALOG" : "")} />

      <div className="relative min-h-[400px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {!catalogLoaded && Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={`skeleton-${index}`}
                className="bg-[#11212D] border border-[#253745] rounded-xl overflow-hidden flex flex-col animate-pulse"
              >
                <div className="aspect-[3/4] w-full bg-[#06141B]" />
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <div className="h-4 bg-[#253745] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#253745] rounded w-1/2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-[#253745] rounded w-1/3" />
                    <div className="w-8 h-8 rounded-full bg-[#253745]" />
                  </div>
                </div>
              </div>
            ))}

            {catalogLoaded && displayedGames.map((game, index) => {
              const inCart = cart.some(item => item.title === game.title);
              const isSelected = selectedGame === game.title;
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: (index % 30) * 0.02 }}
                  key={game.title}
                  onClick={() => setSelectedGame(game.title)}
                  className={`relative rounded-xl overflow-hidden border transition-transform duration-200 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl group flex flex-col cursor-pointer will-change-transform
                    ${isSelected ? 'bg-[#06141B] z-10 border-[#4A5C6A] shadow-lg' : 'bg-[#11212D] border-[#253745] hover:border-[#4A5C6A]'}`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#06141B]">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-105 saturate-[1.1]"
                      style={{ backgroundImage: `url('${game.customCoverUrl || getGameCoverUrl(game.title)}')` }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06141B] via-[#06141B]/40 to-transparent opacity-80 pointer-events-none" />
                    {game.onSale && (
                      <div className="absolute top-2 right-2 bg-green-500 text-[10px] font-black px-2 py-0.5 rounded text-[#06141B] shadow uppercase tracking-wider z-10">
                        SALE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1 justify-between bg-[#11212D] relative z-10">
                    <div>
                      <h3 className={`text-sm font-bold leading-tight transition-colors truncate uppercase ${isSelected ? 'text-white' : 'text-[#CCD0CF] group-hover:text-white'}`}>
                        {game.title}
                      </h3>
                      <p className="text-[10px] text-[#4A5C6A] font-bold tracking-widest uppercase mt-1">Digital Edition</p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        {game.onSale && game.originalPrice && (
                          <span className="text-[10px] font-bold text-red-400 line-through decoration-red-400/50 mb-0.5">{game.originalPrice}</span>
                        )}
                        <span className="text-base font-black text-[#CCD0CF] tracking-wider">{game.price}</span>
                      </div>
                    </div>

                    {/* Expandable Buy Button on Hover / Selection */}
                    <div className="mt-3">
                      <motion.button 
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(game);
                        }}
                        className={`w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                          inCart 
                            ? 'bg-[#4A5C6A] text-white border-[#4A5C6A]' 
                            : 'bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] hover:text-white border-[#4A5C6A]/50 shadow-[0_0_10px_rgba(37,55,69,0.3)]'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Buy Now</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {catalogLoaded && hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 30)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#11212D] border border-[#253745] hover:border-[#4A5C6A] text-[#CCD0CF] hover:text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:scale-105"
            >
              <span>Show More Games</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {catalogLoaded && filteredGames.length === 0 && (
          <div className="py-16 flex items-center justify-center text-[#4A5C6A] bg-[#11212D]/30 border border-[#253745]/30 rounded-xl border-dashed">
            <p className="text-lg font-medium">No games found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}