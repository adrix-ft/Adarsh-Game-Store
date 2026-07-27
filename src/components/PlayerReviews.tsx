import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getGameCoverUrl } from '../utils/image';
import { motion, AnimatePresence } from 'motion/react';

export default function PlayerReviews() {
  const { addToCart, catalog } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Pick some games to feature as reviewed
  const reviewGames = catalog.slice(2, 5); 
  
  if (reviewGames.length === 0) return null;
  
  const mainReview = reviewGames[activeIndex];
  const sideReviews = reviewGames.filter((_, idx) => idx !== activeIndex).slice(0, 2);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + reviewGames.length) % reviewGames.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % reviewGames.length);
  };

  return (
    <section>
      <SectionHeader title="PLAYER REVIEWS" />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-stretch">
        
        {/* Large Review Card Container */}
        <div className="lg:col-span-6 bg-[#11212D] rounded-md overflow-hidden border border-[#253745] flex flex-col sm:flex-row group cursor-pointer hover:border-[#4A5C6A] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(74,92,106,0.3)] hover:z-20">
          
          {/* Left Image Box: Increased width and full height alignment matching the side cards */}
          <div className="w-full sm:w-[240px] h-[260px] sm:h-full bg-[#06141B] relative flex items-center justify-center overflow-hidden shrink-0">
             <AnimatePresence mode="wait">
               <motion.div
                 key={mainReview.title}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
                 className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out saturate-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:saturate-[1.2] group-hover:brightness-110 z-0" 
                 style={{ backgroundImage: `url('${mainReview.customCoverUrl || getGameCoverUrl(mainReview.title)}')` }}
               />
             </AnimatePresence>
             {/* Smooth blending gradient merging into the container */}
             <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-[#11212D]/30 to-[#11212D] pointer-events-none z-10" />
             <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-10" />
             
             {/* Navigation Buttons overlay */}
             <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#06141B]/80 flex items-center justify-center text-[#CCD0CF] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#4A5C6A] z-20">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#06141B]/80 flex items-center justify-center text-[#CCD0CF] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#4A5C6A] z-20 hidden sm:flex">
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
          
          {/* Right Content Space */}
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between bg-transparent relative z-10">
             <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#06141B]/80 flex items-center justify-center text-[#CCD0CF] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#4A5C6A] z-20 sm:hidden">
               <ChevronRight className="w-5 h-5" />
             </button>
             
             <AnimatePresence mode="wait">
                <motion.div
                    key={mainReview.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                      <div className="pr-4 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-black text-[#CCD0CF] leading-tight uppercase tracking-wide drop-shadow-md truncate">{mainReview.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {mainReview.onSale && mainReview.originalPrice && (
                            <span className="text-xs font-bold text-red-400 line-through decoration-red-400/50">{mainReview.originalPrice}</span>
                          )}
                          <span className="text-sm font-bold text-[#CCD0CF]">{mainReview.price}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-3xl sm:text-4xl font-black text-[#CCD0CF] drop-shadow-sm">9.5</div>
                        <div className="flex gap-0.5 mt-0.5 justify-end">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-[#CCD0CF]" fill="currentColor" />)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-[#9BA8AB] my-2">
                      <p className="flex"><span className="text-[#4A5C6A] w-16 shrink-0">Platform</span> <span className="text-[#CCD0CF]">PS5</span></p>
                      <p className="flex"><span className="text-[#4A5C6A] w-16 shrink-0">Genre</span> <span className="text-[#CCD0CF]">{mainReview.genre || 'Action'}</span></p>
                    </div>
                    
                    <div className="text-[11px] text-[#9BA8AB] border-l-2 border-[#4A5C6A] pl-3 line-clamp-2">
                      {mainReview.description || "Survival is just the beginning. Experience the reimagined classic with stunning visuals..."}
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                       <button 
                         onClick={(e) => { e.stopPropagation(); addToCart(mainReview); }}
                         className="px-6 py-1.5 rounded-full bg-[#253745] border border-[#4A5C6A] text-[#CCD0CF] text-xs font-medium transition-transform hover:scale-105 hover:bg-[#4A5C6A] hover:text-white shadow-lg">
                         Buy Now
                       </button>
                    </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>

        {/* Small Review Slots Container */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sideReviews.map(review => (
            <div 
              key={review.title} 
              onClick={() => {
                const newIndex = reviewGames.findIndex(g => g.title === review.title);
                if (newIndex !== -1) setActiveIndex(newIndex);
              }}
              className="relative bg-[#11212D] rounded-md overflow-hidden border border-[#253745] flex flex-col justify-end group cursor-pointer hover:border-[#4A5C6A] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(74,92,106,0.3)] hover:z-20 h-[340px]"
            >
              {/* Image now fills 100% of the card height with zero empty grey space */}
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out saturate-[1.1] contrast-[1.05] group-hover:scale-110 group-hover:saturate-[1.2] group-hover:brightness-110 z-0" style={{ backgroundImage: `url('${review.customCoverUrl || getGameCoverUrl(review.title)}')` }}></div>
              
              {/* Cinematic bottom fade for absolute text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06141B] via-[#06141B]/70 to-transparent pointer-events-none transition-opacity duration-300 z-0" />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(255,255,255,0.15)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-10" />
              
              <div className="p-4 relative z-10 w-full flex flex-col justify-end">
                 <div className="text-xs font-bold text-[#CCD0CF] uppercase truncate w-full mb-2 drop-shadow-md">{review.title}</div>
                 <div className="flex justify-between items-center w-full">
                   <div className="text-left">
                     <div className="text-lg font-black text-[#CCD0CF] flex justify-center items-baseline gap-1 drop-shadow-md">
                       {review.onSale && review.originalPrice && (
                         <span className="text-[9px] font-bold text-red-400 line-through decoration-red-400/50 mr-1">{review.originalPrice}</span>
                       )}
                       {review.price}
                     </div>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); addToCart(review); }}
                     className="w-8 h-8 rounded-full bg-[#253745]/80 backdrop-blur-sm flex items-center justify-center text-[#CCD0CF] hover:bg-[#4A5C6A] hover:text-white transition-colors border border-transparent hover:border-[#CCD0CF]/30 shrink-0 shadow-md"
                   >
                     <ShoppingCart className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}