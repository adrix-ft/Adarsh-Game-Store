import { useStore } from '../context/StoreContext';
import { Monitor, Gamepad2, Layers } from 'lucide-react';

export default function PlatformFilter() {
  const { platformFilter, setPlatformFilter, setSelectedCategory } = useStore();

  const filters = [
    { id: 'All', label: 'All Platforms', icon: Layers },
    { id: 'PC', label: 'PC Games', icon: Monitor },
    { id: 'PS5', label: 'PS5 Games', icon: Gamepad2 }
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {filters.map(filter => {
        const Icon = filter.icon;
        const isActive = platformFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => {
              setPlatformFilter(filter.id);
              setSelectedCategory('Store'); // Forces the view out of Proofs/other sections back to the main store grid
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 border shadow-sm cursor-pointer ${
              isActive 
                ? 'bg-[#4A5C6A] text-white border-[#4A5C6A]' 
                : 'bg-[#11212D] text-[#9BA8AB] hover:border-[#4A5C6A] hover:text-white border-[#253745]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.id}</span>
          </button>
        );
      })}
    </div>
  );
}