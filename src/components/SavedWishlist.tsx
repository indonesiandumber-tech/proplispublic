import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from './PropertyCard';

export const SavedWishlist: React.FC = () => {
  const { properties, savedPropertyIds, navigate } = useApp();

  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            Saved Properties Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of your favorite luxury villas, freehold estates, and commercial leases.
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100 shadow-xs">
          <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
        </div>
      </div>

      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {savedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 mt-8 shadow-xs">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 font-serif">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Click the heart icon on any property to save it here for future consideration.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            Start Exploring →
          </button>
        </div>
      )}
    </div>
  );
};
