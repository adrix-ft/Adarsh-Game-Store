import { Search, ShoppingCart, Check, X, MessageCircle, Zap } from 'lucide-react';
import { useStore, Game } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { getGameCoverUrl } from '../utils/image'; 

export default function Navbar() {
  const { cart, setIsCartOpen, selectedCategory, setSelectedCategory, addToCart, catalog } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeHoverTitle, setActiveHoverTitle] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const cartItemCount = cart.length;
  const navLinks = ['Store', 'Subscriptions', 'Top Sellers', 'Popular games', 'Genres', 'Collections'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = catalog.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuyNow = (game: Game) => {
    const inCart = cart.some(item => item.title === game.title);
    if (!inCart) {
      addToCart(game);
    }
    setIsCartOpen(true);
    setIsSearchFocused(false);
    setActiveHoverTitle(null);
  };

  return (
    <nav className="relative flex items-center justify-between px-3 sm:px-6 lg:px-12 xl:px-24 py-5 bg-[#06141B]/95 backdrop-blur-xl border-b border-[#253745]/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)] sticky top-0 z-40 gap-2">
      
      {/* Left side: Brand & Nav Links */}
      <div className={`flex items-center gap-4 sm:gap-8 md:gap-14 overflow-hidden transition-all duration-300 ease-in-out ${isSearchFocused ? 'hidden sm:flex flex-1' : 'flex-1'}`}>
        <motion.div 
          layout 
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center gap-2 cursor-pointer shrink-0 group"
          onClick={() => setSelectedCategory('Store')}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-base sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#CCD0CF] to-[#9BA8AB] group-hover:opacity-90 transition-opacity">
              ADARSH
            </span>
            <span className="text-[9px] sm:text-xs uppercase font-extrabold tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-[#253745]/50 border border-[#4A5C6A]/30 text-[#CCD0CF] whitespace-nowrap">
              Game Store
            </span>
          </motion.div>
        </motion.div>

        <div className={`hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-[#9BA8AB] transition-opacity duration-200`}>
          {navLinks.map(link => {
            const isActive = selectedCategory === link || (link === 'Genres' && selectedCategory.startsWith('Genre:'));
            return (
              <button 
                key={link}
                onClick={() => setSelectedCategory(link === 'Genres' ? 'Genres' : link)}
                className={`transition-all duration-300 relative py-1 ${isActive ? 'text-white font-bold scale-105' : 'hover:text-[#CCD0CF]'}`}
              >
                {link}
                {isActive && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-[#4A5C6A] to-[#CCD0CF] rounded-full shadow-[0_0_10px_rgba(204,208,207,0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side / Search & Actions */}
      <div className={`flex items-center gap-2 sm:gap-4 md:gap-6 transition-all duration-300 ${isSearchFocused ? 'w-full sm:w-auto justify-end' : ''}`}>
        
        {/* Search Container */}
        <div className={`relative group transition-all duration-300 ease-in-out ${isSearchFocused ? 'w-full sm:w-[400px]' : 'w-28 sm:w-52'}`} ref={searchRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5C6A] group-focus-within:text-white transition-colors z-10" />
          
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="bg-[#11212D]/80 border border-[#253745] rounded-full py-2 pl-9 sm:pl-10 pr-8 sm:pr-9 text-xs font-medium text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#4A5C6A] focus:ring-2 focus:ring-[#4A5C6A]/20 transition-all w-full relative z-10 shadow-inner"
          />
          
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
                setActiveHoverTitle(null);
              }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#4A5C6A] hover:text-white z-20 p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          
          <AnimatePresence>
            {isSearchFocused && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-3 left-0 sm:left-auto sm:right-0 w-full sm:w-[400px] bg-[#11212D]/95 backdrop-blur-2xl border border-[#253745] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50"
              >
                {/* Smooth scrolling container with native touch momentum support */}
                <div className="max-h-[380px] overflow-y-auto scroll-smooth overscroll-contain p-1.5 space-y-1 [overflow-anchor:none] [-webkit-overflow-scrolling:touch]">
                  {searchResults.length > 0 ? (
                    searchResults.map(game => {
                      const inCart = cart.some(item => item.title === game.title);
                      const coverUrl = game.customCoverUrl || getGameCoverUrl(game.title); 
                      const isHovered = activeHoverTitle === game.title;

                      return (
                        <div 
                          key={game.title} 
                          onMouseEnter={() => setActiveHoverTitle(game.title)}
                          onMouseLeave={() => setActiveHoverTitle(null)}
                          onClick={() => {
                            if (activeHoverTitle === game.title) {
                              handleBuyNow(game);
                            } else {
                              setActiveHoverTitle(game.title);
                            }
                          }}
                          className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-[#06141B] transition-all cursor-pointer group/item border border-transparent hover:border-[#253745]"
                        >
                          {/* 100% Sharp & Static Image Container (Blur removed) */}
                          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#253745] bg-[#06141B] shadow-md">
                            <img 
                              src={coverUrl} 
                              alt={game.title} 
                              className="w-full h-full object-cover object-center [backface-visibility:hidden]"
                              onError={(e) => {
                                if (e.currentTarget.src.includes('placeholder.jpg')) return;
                                e.currentTarget.src = '/placeholder.jpg';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-[#CCD0CF] group-hover/item:text-white truncate uppercase tracking-wide">{game.title}</h4>
                            
                            {/* Platform Badges */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {game.categories?.map(cat => {
                                if (cat === 'PC' || cat === 'PS5') {
                                  return (
                                    <span 
                                      key={cat} 
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#06141B] text-[#9BA8AB] border border-[#253745]"
                                    >
                                      {cat}
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </div>

                            <p className="text-xs font-black text-white mt-1">{game.price}</p>
                          </div>
                          
                          {/* Morphing Cart / Buy Now Button */}
                          <div className="shrink-0 ml-2">
                            {isHovered ? (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyNow(game);
                                }}
                                className="flex items-center gap-1 bg-[#253745] hover:bg-[#4A5C6A] text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg transition-all border border-[#4A5C6A]"
                              >
                                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                <span>Buy Now</span>
                              </motion.button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(game);
                                }}
                                disabled={inCart}
                                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all shadow-md ${
                                  inCart 
                                    ? 'bg-[#4A5C6A] border-[#4A5C6A] text-white cursor-default' 
                                    : 'bg-[#253745] border-[#4A5C6A]/50 text-[#9BA8AB] hover:text-white hover:bg-[#4A5C6A]'
                                }`}
                              >
                                {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <p className="text-[#CCD0CF] text-xs font-bold uppercase tracking-wide">Didn't find your game?</p>
                      <p className="text-[#9BA8AB] text-[11px] leading-relaxed">
                        No titles found matching "{searchQuery}". Ask us directly and we'll get it for you!
                      </p>
                      <a 
                        href={`https://wa.me/916001189280?text=${encodeURIComponent(`Hey, I am looking for a game not found in your store: "${searchQuery}"`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Ask on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Cart controls */}
        <div className={`items-center gap-2 sm:gap-4 transition-all duration-300 ${isSearchFocused ? 'hidden sm:flex' : 'flex'}`}>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2.5 rounded-full bg-[#11212D]/60 border border-[#253745]/60 text-[#9BA8AB] hover:text-white hover:border-[#4A5C6A] transition-all cursor-pointer shadow-sm group shrink-0"
          >
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-[#4A5C6A] to-[#CCD0CF] text-[#06141B] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-[#06141B]"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}