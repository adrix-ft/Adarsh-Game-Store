/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Promos from './components/Promos';
import HotTrends from './components/HotTrends';
import PlayerReviews from './components/PlayerReviews';
import Discounts from './components/Discounts';
import GameLibrary from './components/GameLibrary';
import Subscriptions from './components/Subscriptions';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { StoreProvider, useStore } from './context/StoreContext';
import PlatformFilter from './components/PlatformFilter';
import VideoModal from './components/VideoModal';
import FilteredGames from './components/FilteredGames';
import CollectionsView from './components/CollectionsView';
import ProofSection from './components/ProofSection';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

function AppContent() {
  const { selectedCategory, setSelectedCategory, isAdmin } = useStore();
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(null);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const navLinks = ['Store', 'Subscriptions', 'Top Sellers', 'Popular games', 'Genres', 'Collections'];

  return (
    <div className="bg-[#06141B] text-[#CCD0CF] min-h-screen font-sans selection:bg-[#253745] selection:text-[#CCD0CF] overflow-x-hidden relative">
      <Navbar />
      
      {/* UNIFIED STICKY FILTER BAR SECTION WITH FULL-WIDTH BOTTOM BORDER */}
      <div className="w-full bg-[#06141B]/90 backdrop-blur-md border-b border-[#253745] sticky top-[73px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-2.5">
          <PlatformFilter />
          
          {/* Proofs Filter Pill grouped cleanly right alongside platform filters */}
          <button
            onClick={() => setSelectedCategory('Proofs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
              selectedCategory === 'Proofs'
                ? 'bg-[#4A5C6A] text-white border-[#4A5C6A]'
                : 'bg-[#11212D] text-[#9BA8AB] border-[#253745] hover:border-[#4A5C6A] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Proofs</span>
          </button>
        </div>
      </div>
      
      {/* MOBILE CATEGORY SCROLLER */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2.5 bg-[#06141B]/80 border-b border-[#253745] gap-2 no-scrollbar sticky top-[133px] z-20 backdrop-blur-md">
        {navLinks.map(link => {
          const isActive = selectedCategory === link || (link === 'Genres' && selectedCategory.startsWith('Genre:'));
          return (
            <button
              key={link}
              onClick={() => setSelectedCategory(link === 'Genres' ? 'Genres' : link)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                isActive
                  ? 'bg-[#4A5C6A] text-white border border-[#4A5C6A] shadow-sm' 
                  : 'bg-[#11212D] text-[#9BA8AB] border border-[#253745]'
              }`}
            >
              <span>{link}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedCategory === 'Store' && (
            <>
              <Hero />
              <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 space-y-16 py-12 relative z-10">
                <Promos />
                <HotTrends />
                <PlayerReviews />
                <Discounts />
                <GameLibrary />
              </main>
            </>
          )}

          {selectedCategory === 'Subscriptions' && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <Subscriptions />
            </main>
          )}

          {selectedCategory === 'Top Sellers' && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <FilteredGames category="Top Sellers" title="TOP SELLERS" />
            </main>
          )}
          {selectedCategory === 'Popular games' && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <FilteredGames category="Popular games" title="POPULAR GAMES" />
            </main>
          )}

          {selectedCategory === 'Genres' && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-white tracking-wide uppercase">Browse By Genre</h2>
                  <p className="text-xs text-[#9BA8AB]">Select a genre below to filter games instantly.</p>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {['Action-Adventure', 'Action', 'Action RPG', 'Survival Horror', 'Sci-Fi Horror', 'Stealth Action', 'First-Person Shooter', 'Sports', 'Racing', 'Interactive Drama', 'Metroidvania', 'Role-Playing'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedCategory(`Genre: ${genre}`)}
                      className="px-4 py-2 rounded-xl bg-[#11212D] border border-[#253745] hover:border-[#4A5C6A] text-xs font-bold text-[#CCD0CF] hover:text-white transition-all shadow-sm"
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </main>
          )}

          {selectedCategory.startsWith('Genre: ') && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <FilteredGames 
                genre={selectedCategory.replace('Genre: ', '')} 
                title={`${selectedCategory.replace('Genre: ', '')} GAMES`.toUpperCase()} 
              />
            </main>
          )}

          {selectedCategory === 'Collections' && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <CollectionsView />
            </main>
          )}

          {selectedCategory === 'Proofs' && (
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 relative z-10">
              <ProofSection onSelectImage={setSelectedProofImage} />
            </main>
          )}
        </motion.div>
      </AnimatePresence>

      <Footer />
      <CartDrawer />
      <AdminLogin />
      <VideoModal />

      {/* GLOBAL LIGHTBOX MODAL RENDERED AT ROOT TO ELIMINATE CLIPPING */}
      {selectedProofImage && (
        <div 
          onClick={() => setSelectedProofImage(null)}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-3xl w-full bg-[#11212D] rounded-2xl border border-[#4A5C6A] shadow-[0_0_50px_rgba(0,0,0,0.9)] p-3 my-auto"
          >
            <button 
              onClick={() => setSelectedProofImage(null)}
              className="absolute -top-4 -right-4 z-50 bg-[#06141B] hover:bg-[#253745] text-white p-2.5 rounded-full border border-[#4A5C6A] shadow-2xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedProofImage} 
              alt="Enlarged Proof" 
              className="w-full h-auto max-h-[82vh] object-contain rounded-xl block mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}