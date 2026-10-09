import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  MapPin, 
  DollarSign, 
  Bed, 
  Sparkles, 
  X, 
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  Columns,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCategory } from '../types';

interface FilterBarProps {
  viewMode: 'grid' | 'map' | 'split';
  setViewMode: (mode: 'grid' | 'map' | 'split') => void;
  resultCount: number;
}

const CATEGORIES: { id: PropertyCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Types', icon: '🏰' },
  { id: 'villa', label: 'Tropical Villas', icon: '🏡' },
  { id: 'apartment', label: 'Apartments', icon: '🏢' },
  { id: 'penthouse', label: 'Penthouses', icon: '🏙️' },
  { id: 'commercial', label: 'Commercial & Shophouse', icon: '🏪' },
  { id: 'beachfront', label: 'Beachfront', icon: '🏖️' },
  { id: 'house', label: 'Townhouses', icon: '🏠' },
  { id: 'land', label: 'Land & Estates', icon: '🌴' },
];

const CITIES = ['all', 'Bali', 'Jakarta', 'Singapore', 'Tokyo'];

const ALL_AMENITIES = [
  'Private Infinity Pool',
  'High-Speed Fiber Wi-Fi (250 Mbps)',
  'Chef Kitchen & Espresso Bar',
  'Dedicated Ergonomic Workspace',
  'Air Conditioning in all rooms',
  'Free Enclosed Parking',
  'Security 24/7',
  'Turnkey Vacation Rental Management',
  'SHM Freehold Certificate',
  'High Foot-Traffic Commercial Zoning'
];

export const FilterBar: React.FC<FilterBarProps> = ({ viewMode, setViewMode, resultCount }) => {
  const { filters, updateFilter, resetFilters } = useApp();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const activeFiltersCount = 
    (filters.city !== 'all' ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.bedrooms !== 'any' ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 5000000 ? 1 : 0);

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-18 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        {/* Category Horizontal Scroll Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
            {CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => updateFilter('category', cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Filter Modal Trigger */}
            <button
              id="filter-drawer-btn"
              onClick={() => setFilterDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeFiltersCount > 0
                  ? 'border-indigo-500 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20'
                  : 'border-slate-300 hover:border-slate-400 bg-white text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle (Grid vs Split vs Map) */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Split Map & Grid View"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Full Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-bar: Active Destination filter chips & result count */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-slate-400 font-medium shrink-0">City:</span>
            {CITIES.map(city => (
              <button
                key={city}
                id={`city-chip-${city}`}
                onClick={() => updateFilter('city', city)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  filters.city === city 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city === 'all' ? 'All Cities' : city}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs shrink-0">
            <span>
              <strong className="text-slate-900">{resultCount}</strong> {resultCount === 1 ? 'property' : 'properties'} found
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Advanced Filter Drawer Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg font-serif">Detailed Filters</h3>
              <button 
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5 text-xs">
              {/* Service Type */}
              <div>
                <label className="block text-slate-800 font-bold mb-2">Service Intent</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['all', 'rent', 'sale', 'lease'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateFilter('serviceType', st)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                        filters.serviceType === st 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st === 'all' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-slate-800 font-bold mb-2">Bedrooms</label>
                <div className="flex items-center gap-2">
                  {['any', '1', '2', '3', '4', '5+'].map(bed => (
                    <button
                      key={bed}
                      onClick={() => updateFilter('bedrooms', bed)}
                      className={`flex-1 py-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        filters.bedrooms === bed
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-slate-800 font-bold mb-2">Amenities & Perks</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_AMENITIES.map(amenity => {
                    const isChecked = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => {
                          const next = isChecked
                            ? filters.amenities.filter(a => a !== amenity)
                            : [...filters.amenities, amenity];
                          updateFilter('amenities', next);
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isChecked 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-semibold shadow-xs' 
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-slate-800 font-bold mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="recommended">Recommended & Superhost First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Guest Rating</option>
                  <option value="newest">Newest Listings</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={resetFilters}
                className="text-slate-500 hover:text-slate-900 font-semibold text-xs underline cursor-pointer"
              >
                Clear all filters
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                Show {resultCount} Properties
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
