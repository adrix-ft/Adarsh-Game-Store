import SectionHeader from './SectionHeader';
import { useStore } from '../context/StoreContext';
import { ShoppingCart } from 'lucide-react';
import { getGameCoverUrl } from '../utils/image';
import { useState } from 'react';

export default function Discounts() {
  const { addToCart, catalog, platformFilter } = useStore();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const discountGames = catalog.filter(game => {
    if (!game.onSale) return false;
    if (platformFilter !== 'All' && !game.categories?.includes(platformFilter)) return false;
    return true;
  });

  if (discountGames.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader title="SPECIAL OFFERS" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {discountGames.slice(0, 5).map((game, idx) => {
          const isSelected = activeCard === game.title;

          return (
            <div 
              key={game.title} 
              onClick={() => setActiveCard(isSelected ? null : game.title)}
              className={`col-span-1 h-[280px] bg-gradient-to-b ${idx % 2 === 0 ? 'from-[#11212D] to-[#06141B]' : 'from-[#253745] to-[#06141B]'} rounded-md relative group overflow-hidden cursor-pointer flex flex-col justify-end p-4 border border-[#253745] hover:border-[#4A5C6A] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(74,92,106,0.3)] hover:z-20`}
            >
              
              <div className="absolute top-0 left-0 right-0 bg-green-500/90 backdrop-blur text-[9px] text-center py-1 font-black tracking-widest text-[#06141B] z-20">
                SALE
              </div>
              
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out saturate-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:saturate-[1.2] group-hover:brightness-110 z-0" style={{ backgroundImage: `url('${game.customCoverUrl || getGameCoverUrl(game.title)}')` }}></div>
              
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#06141B]/95 via-[#06141B]/40 to-transparent pointer-events-none transition-opacity duration-300 z-0" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06141B]/95 via-[#06141B]/60 to-transparent pointer-events-none transition-opacity duration-300 z-0" />
              
              <div className="relative z-20 flex flex-col justify-end bg-transparent -mx-4 -mb-4 p-4 pt-3">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex-1 pr-2 text-left drop-shadow-md">
                    <div className="text-xs font-medium text-[#CCD0CF] line-clamp-2 tracking-wide mb-1 leading-tight">{game.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      {game.originalPrice && (
                        <span className="text-[10px] text-red-400 font-bold line-through decoration-red-400/50">{game.originalPrice}</span>
                      )}
                      <span className="text-sm font-black text-[#CCD0CF] tracking-wider">{game.price}</span>
                    </div>
                  </div>

                  {/* Compact Cart Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(game); }}
                    className={`w-8 h-8 rounded-full bg-[#253745]/90 flex items-center justify-center text-[#9BA8AB] transition-all duration-200 border border-transparent shrink-0 backdrop-blur-sm shadow-md ${isSelected ? 'opacity-0 scale-75' : 'group-hover:opacity-0'}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Buy Now Button (Appears on desktop hover or mobile tap) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(game); }}
                  className={`w-full py-2 px-3 rounded-lg bg-[#253745] hover:bg-[#4A5C6A] border border-[#4A5C6A] text-[#CCD0CF] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${isSelected ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-12'}`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}