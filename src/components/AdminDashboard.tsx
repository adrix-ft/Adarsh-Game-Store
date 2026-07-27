import React, { useState } from 'react';
import { useStore, Game } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Plus, Trash2, Edit2, Copy, X, RefreshCw, Image as ImageIcon, Upload, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { getGameCoverUrl } from '../utils/image';

export default function AdminDashboard() {
  const { catalog, updateGame, addGame, removeGame, resetCatalog, setIsAdmin, collections, updateCollection, addCollection, removeCollection } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Platform Filter & Sorting State
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'za' | 'priceLow' | 'priceHigh'>('default');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const defaultGame: Game = {
    title: '',
    price: '',
    categories: ['Store'],
    description: '',
    onSale: false,
    originalPrice: '',
    customCoverUrl: '',
    showInHero: false,
    isFeaturedPromo: false,
    trailer: ''
  };
  
  const [formData, setFormData] = useState<Game>(defaultGame);

  // Helper to parse price safely for sorting
  const parsePriceNum = (priceStr?: string) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const filteredCatalog = catalog.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedPlatform === 'All') return true;
    return game.categories?.some(cat => cat.toLowerCase() === selectedPlatform.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    if (sortBy === 'za') return b.title.localeCompare(a.title);
    if (sortBy === 'priceLow') return parsePriceNum(a.price) - parsePriceNum(b.price);
    if (sortBy === 'priceHigh') return parsePriceNum(b.price) - parsePriceNum(a.price);
    return 0; // 'default' keeps original order
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredCatalog.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTableData = filteredCatalog.slice(startIndex, startIndex + itemsPerPage);

  const openAddForm = () => {
    setEditingTitle(null);
    setFormData(defaultGame);
    setShowForm(true);
  };

  const openEditForm = (game: Game) => {
    setEditingTitle(game.title);
    setFormData({
      ...defaultGame,
      ...game
    });
    setShowForm(true);
  };

  const handleDuplicateGame = (game: Game) => {
    let newTitle = `${game.title} (Copy)`;
    // Ensure unique title name if duplicate of duplicate exists
    while (catalog.some(g => g.title.toLowerCase() === newTitle.toLowerCase())) {
      newTitle += ' (Copy)';
    }

    const duplicatedGame: Game = {
      ...game,
      title: newTitle,
      showInHero: false,
      isFeaturedPromo: false
    };

    addGame(duplicatedGame);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.price) {
      const savedGame = {
        ...formData,
        price: formData.price.endsWith('Rs') ? formData.price : `${formData.price}Rs`,
        originalPrice: formData.onSale && formData.originalPrice 
          ? (formData.originalPrice.endsWith('Rs') ? formData.originalPrice : `${formData.originalPrice}Rs`)
          : undefined
      };

      if (editingTitle) {
        updateGame(editingTitle, savedGame);
      } else {
        addGame(savedGame);
      }
      setShowForm(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const cats = prev.categories || [];
      if (cats.includes(category)) {
        return { ...prev, categories: cats.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...cats, category] };
      }
    });
  };

  const currentCoverPreview = formData.customCoverUrl || (formData.title ? getGameCoverUrl(formData.title) : '');

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-wider uppercase">Admin Dashboard</h1>
            <p className="text-[#9BA8AB] mt-1 text-sm tracking-wide">Manage Game Catalog & Collections</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if(window.confirm('Reset catalog to default? All changes will be lost.')) {
                  resetCatalog();
                }
              }}
              className="flex items-center gap-2 bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] px-4 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors border border-[#4A5C6A]"
            >
              <RefreshCw className="w-4 h-4" /> Reset Catalog
            </button>
            <button 
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 px-4 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors border border-red-500/50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="fixed inset-0 bg-[#06141B]/90 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#11212D] border border-[#253745] rounded-xl p-6 shadow-2xl w-full max-w-4xl relative z-10 my-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black tracking-wider text-[#CCD0CF] uppercase">
                    {editingTitle ? 'Edit Game' : 'Add New Game'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-[#9BA8AB] hover:text-white p-2">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Image Preview Column */}
                  <div className="lg:col-span-1 space-y-4">
                    <label className="block text-[#9BA8AB] text-xs font-bold uppercase tracking-wide">Cover Preview</label>
                    <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-[#253745] overflow-hidden flex flex-col items-center justify-center bg-[#06141B] relative">
                      {currentCoverPreview ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${currentCoverPreview}')` }}
                        />
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 text-[#253745] mb-2" />
                          <span className="text-[#4A5C6A] text-sm">No image available</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Form Fields Column */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Game Title</label>
                        <input 
                          type="text" 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-[#06141B] border border-[#253745] rounded p-3 text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Cover Image URL / Upload</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={formData.customCoverUrl || ''}
                            onChange={e => setFormData({...formData, customCoverUrl: e.target.value})}
                            className="flex-1 bg-[#06141B] border border-[#253745] rounded p-3 text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A]"
                            placeholder="Leave empty for default"
                          />
                          <label className="cursor-pointer bg-[#253745] hover:bg-[#4A5C6A] border border-[#4A5C6A] text-[#CCD0CF] rounded px-4 py-3 flex items-center justify-center font-bold text-xs uppercase transition-colors">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                            <input 
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = async () => {
                                    const base64Image = reader.result as string;
                                    try {
                                      const res = await fetch('https://amin-game-store-backend.onrender.com/api/upload', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ title: formData.title || 'untitled', base64Image })
                                      });
                                      const data = await res.json();
                                      if (data.url) {
                                        setFormData({...formData, customCoverUrl: data.url});
                                      } else {
                                        alert('Upload failed: ' + (data.error || 'Unknown error'));
                                      }
                                    } catch (err) {
                                      console.error('Upload failed', err);
                                      alert('Network error during image upload.');
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Selling Price (Rs)</label>
                        <input 
                          type="text" 
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                          className="w-full bg-[#06141B] border border-[#253745] rounded p-3 text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A]"
                          placeholder="e.g. 199Rs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Discount Pricing</label>
                        <div className="flex items-center gap-4 bg-[#06141B] border border-[#253745] rounded p-3">
                          <label className="flex items-center gap-2 cursor-pointer text-[#CCD0CF]">
                            <input 
                              type="checkbox"
                              checked={formData.onSale || false}
                              onChange={e => setFormData({...formData, onSale: e.target.checked})}
                              className="w-4 h-4 rounded bg-[#11212D] border-[#4A5C6A] text-[#4A5C6A] focus:ring-[#4A5C6A]"
                            />
                            <span className="text-sm font-medium">Mark as Trending / On Sale</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.onSale && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Original Crossed-out Price (Rs)</label>
                          <input 
                            type="text" 
                            value={formData.originalPrice || ''}
                            onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                            className="w-full bg-[#06141B] border border-[#253745] rounded p-3 text-red-400 focus:outline-none focus:border-[#4A5C6A]"
                            placeholder="e.g. 299Rs"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Description / Details</label>
                      <textarea 
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-[#06141B] border border-[#253745] rounded p-3 text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A] min-h-[100px]"
                        placeholder="Game description..."
                      />
                    </div>
                    <div>
                      <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Trailer Video URL</label>
                      <input 
                        type="text" 
                        value={formData.trailer || ''} 
                        onChange={e => setFormData({...formData, trailer: e.target.value})} 
                        className="w-full bg-[#06141B] border border-[#253745] rounded p-3 text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A]"
                        placeholder="YouTube URL or MP4 link"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center gap-2 text-[#CCD0CF] cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={formData.showInHero || false}
                          onChange={e => setFormData({...formData, showInHero: e.target.checked})}
                          className="w-4 h-4 bg-[#06141B] border border-[#253745] rounded"
                        />
                        <span className="text-sm font-bold uppercase tracking-wider">Show in Top Featured Carousel</span>
                      </label>
                      <label className="flex items-center gap-2 text-[#CCD0CF] cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={formData.isFeaturedPromo || false}
                          onChange={e => setFormData({...formData, isFeaturedPromo: e.target.checked})}
                          className="w-4 h-4 bg-[#06141B] border border-[#253745] rounded"
                        />
                        <span className="text-sm font-bold uppercase tracking-wider">Featured Trailer Game</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Platforms</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['PC', 'PS5'].map(plat => (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => handleCategoryToggle(plat)}
                            className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase border transition-colors ${
                              formData.categories?.includes(plat) 
                                ? 'bg-[#CCD0CF] border-[#CCD0CF] text-[#06141B] shadow-[0_0_10px_rgba(204,208,207,0.3)]' 
                                : 'bg-[#06141B] border-[#253745] text-[#9BA8AB] hover:border-[#4A5C6A]'
                            }`}
                          >
                            {plat}
                          </button>
                        ))}
                      </div>
                      <label className="block text-[#9BA8AB] text-xs font-bold mb-2 uppercase">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {['Store', 'Top Sellers', 'Popular games', 'Upcoming', 'Collections'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryToggle(cat)}
                            className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase border transition-colors ${
                              formData.categories?.includes(cat) 
                                ? 'bg-[#4A5C6A] border-[#4A5C6A] text-white shadow-md' 
                                : 'bg-[#06141B] border-[#253745] text-[#9BA8AB] hover:border-[#4A5C6A]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[#253745]">
                      <button 
                        type="submit"
                        className="bg-[#253745] hover:bg-[#4A5C6A] text-white px-8 py-3 rounded-lg font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(37,55,69,0.5)] transform hover:scale-105"
                      >
                        {editingTitle ? 'Update Game' : 'Save Game'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="bg-[#11212D] border border-[#253745] rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#253745] flex flex-col lg:flex-row justify-between items-center gap-4 bg-[#11212D]">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <input 
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#06141B] border border-[#253745] rounded px-4 py-2 text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A] w-full sm:w-64"
              />
              
              {/* Platform Filter Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['All', 'PC', 'PS5'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => {
                      setSelectedPlatform(platform);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                      selectedPlatform === platform
                        ? 'bg-[#253745] border-[#4A5C6A] text-white shadow-md'
                        : 'bg-[#06141B] border-[#253745] text-[#9BA8AB] hover:border-[#4A5C6A]'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown className="w-4 h-4 text-[#9BA8AB] hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-[#06141B] border border-[#253745] rounded px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#CCD0CF] focus:outline-none focus:border-[#4A5C6A] w-full sm:w-auto"
                >
                  <option value="default">Default (Newest Added)</option>
                  <option value="az">Alphabetical (A - Z)</option>
                  <option value="za">Alphabetical (Z - A)</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between w-full lg:w-auto gap-4">
              <span className="text-xs text-[#9BA8AB]">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCatalog.length)} of {filteredCatalog.length} games</span>
              <button 
                onClick={openAddForm}
                className="flex items-center gap-2 bg-[#253745] hover:bg-[#4A5C6A] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Game
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#06141B] text-[#9BA8AB] text-xs uppercase tracking-wider border-b border-[#253745]">
                <tr>
                  <th className="p-4 font-medium">Cover</th>
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Categories</th>
                  <th className="p-4 font-medium text-center">Featured (Hero/Promo)</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253745]">
                {currentTableData.map(game => (
                  <tr key={game.title} className="hover:bg-[#06141B]/50 transition-colors group">
                    <td className="p-4">
                      <div 
                        className="w-12 h-16 bg-cover bg-center rounded border border-[#253745]"
                        style={{ backgroundImage: `url('${game.customCoverUrl || getGameCoverUrl(game.title)}')` }}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm tracking-wide uppercase text-[#CCD0CF]">{game.title}</div>
                      {game.onSale && (
                        <span className="inline-block mt-1 bg-green-500/15 text-green-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase border border-green-500/30">
                          ON SALE
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#CCD0CF]">{game.price}</span>
                        {game.onSale && game.originalPrice && (
                          <span className="text-xs text-red-400 line-through decoration-red-400/50">{game.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {game.categories?.map(cat => (
                          <span key={cat} className="bg-[#253745] text-[#9BA8AB] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <label className="flex items-center gap-1 cursor-pointer" title="Show in Top Featured Carousel">
                          <input 
                            type="checkbox" 
                            checked={game.showInHero || false} 
                            onChange={(e) => updateGame(game.title, { ...game, showInHero: e.target.checked })}
                            className="w-3 h-3"
                          />
                          <span className="text-[10px] text-[#9BA8AB] uppercase tracking-wider">Hero</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer" title="Featured Trailer Game">
                          <input 
                            type="checkbox" 
                            checked={game.isFeaturedPromo || false} 
                            onChange={(e) => updateGame(game.title, { ...game, isFeaturedPromo: e.target.checked })}
                            className="w-3 h-3"
                          />
                          <span className="text-[10px] text-[#9BA8AB] uppercase tracking-wider">Promo</span>
                        </label>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleDuplicateGame(game)}
                          className="p-2 text-[#4A5C6A] hover:text-[#CCD0CF] hover:bg-[#253745] rounded-full transition-colors"
                          title="Duplicate Game"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditForm(game)}
                          className="p-2 text-[#4A5C6A] hover:text-[#CCD0CF] hover:bg-[#253745] rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${game.title}?`)) {
                              removeGame(game.title);
                            }
                          }}
                          className="p-2 text-[#4A5C6A] hover:text-red-400 hover:bg-red-500/15 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCatalog.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#9BA8AB]">
                      No games found matching your filter and sorting criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Bar */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#253745] flex items-center justify-between bg-[#06141B]">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#11212D] border border-[#253745] text-xs font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#4A5C6A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <span className="text-xs font-bold text-[#9BA8AB]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#11212D] border border-[#253745] text-xs font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#4A5C6A] transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Manage Collections Section */}
        <div className="mt-12 bg-[#11212D] border border-[#253745] rounded-xl overflow-hidden shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-wider text-[#CCD0CF] uppercase">Manage Collections</h2>
              <p className="text-[#9BA8AB] text-sm mt-1">Create, delete, and edit collection names, banners, descriptions, and assigned games</p>
            </div>
            <button 
              onClick={() => {
                const newCol = {
                  id: Date.now().toString(),
                  title: 'New Collection',
                  description: 'Collection description here...',
                  banner: 'default.jpg',
                  customBannerUrl: '',
                  keywords: []
                };
                addCollection(newCol);
              }}
              className="flex items-center gap-2 bg-[#253745] hover:bg-[#4A5C6A] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Collection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map(collection => (
              <div key={collection.id} className="bg-[#06141B] border border-[#253745] p-5 rounded-lg flex flex-col gap-4 relative group">
                
                {/* Delete Collection Action */}
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete collection "${collection.title}"?`)) {
                      removeCollection(collection.id);
                    }
                  }}
                  className="absolute top-4 right-4 text-red-400 hover:bg-red-500/15 p-2 rounded-full transition-colors"
                  title="Delete Collection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Collection Title Edit */}
                <div>
                  <label className="block text-[#9BA8AB] text-xs font-bold mb-1 uppercase">Collection Title</label>
                  <input 
                    type="text" 
                    value={collection.title} 
                    onChange={(e) => updateCollection(collection.id, { ...collection, title: e.target.value })}
                    className="w-full bg-[#11212D] border border-[#253745] rounded p-2.5 text-[#CCD0CF] font-bold focus:outline-none focus:border-[#4A5C6A]"
                  />
                </div>

                {/* Collection Description Edit */}
                <div>
                  <label className="block text-[#9BA8AB] text-xs font-bold mb-1 uppercase">Description</label>
                  <textarea 
                    value={collection.description || ''} 
                    onChange={(e) => updateCollection(collection.id, { ...collection, description: e.target.value })}
                    className="w-full bg-[#11212D] border border-[#253745] rounded p-2.5 text-[#CCD0CF] text-sm focus:outline-none focus:border-[#4A5C6A] h-20 resize-none"
                  />
                </div>

                {/* Custom Banner URL & Upload Button */}
                <div>
                  <label className="block text-[#9BA8AB] text-xs font-bold mb-1 uppercase">Custom Banner URL / Upload</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={collection.customBannerUrl || ''} 
                      onChange={(e) => updateCollection(collection.id, { ...collection, customBannerUrl: e.target.value })}
                      className="flex-1 bg-[#11212D] border border-[#253745] rounded p-2.5 text-[#CCD0CF] text-sm focus:outline-none focus:border-[#4A5C6A]"
                      placeholder="https://... or upload image"
                    />
                    <label className="cursor-pointer bg-[#253745] hover:bg-[#4A5C6A] border border-[#4A5C6A] text-[#CCD0CF] rounded px-4 py-2.5 flex items-center justify-center font-bold text-xs uppercase transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const base64Image = reader.result as string;
                              try {
                                const res = await fetch('https://amin-game-store-backend.onrender.com/api/upload', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ title: collection.title || 'collection-banner', base64Image })
                                });
                                const data = await res.json();
                                if (data.url) {
                                  updateCollection(collection.id, { ...collection, customBannerUrl: data.url });
                                } else {
                                  alert('Upload failed: ' + (data.error || 'Unknown error'));
                                }
                              } catch (err) {
                                console.error('Upload failed', err);
                                alert('Network error during image upload.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Games / Keywords Assignment Manager */}
                <div>
                  <label className="block text-[#9BA8AB] text-xs font-bold mb-1 uppercase">Assigned Games (Keywords / Titles)</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#11212D] border border-[#253745] rounded">
                    {catalog.map(game => {
                      const isAssigned = collection.keywords.some(kw => game.title.includes(kw));
                      return (
                        <button
                          key={game.title}
                          type="button"
                          onClick={() => {
                            const updatedKeywords = isAssigned
                              ? collection.keywords.filter(k => !game.title.includes(k))
                              : [...collection.keywords, game.title];
                            updateCollection(collection.id, { ...collection, keywords: updatedKeywords });
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors border ${
                            isAssigned 
                              ? 'bg-[#4A5C6A] text-white border-[#4A5C6A]' 
                              : 'bg-[#06141B] text-[#9BA8AB] border-[#253745] hover:border-[#4A5C6A]'
                          }`}
                        >
                          {game.title} {isAssigned ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#9BA8AB] mt-1">Click games to toggle them in or out of this collection.</p>
                </div>

                {/* Live Preview Banner */}
                <div className="mt-2">
                  <label className="block text-[#9BA8AB] text-xs font-bold mb-1 uppercase">Banner Preview</label>
                  <div 
                    className="aspect-[16/9] w-full rounded border border-[#253745] bg-cover bg-center" 
                    style={{ backgroundImage: `url('${collection.customBannerUrl || getGameCoverUrl(collection.banner)}')` }} 
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}