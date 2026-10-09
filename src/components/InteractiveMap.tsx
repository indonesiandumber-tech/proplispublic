import React, { useState } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';
import { MapPin, Navigation, Plus, Minus, Layers, Star, X } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties, onSelectProperty }) => {
  const { currency, setSelectedProperty } = useApp();
  const [zoom, setZoom] = useState(1);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [mapType, setMapType] = useState<'terrain' | 'satellite'>('terrain');

  // Center default coordinates (Bali/Indonesia region)
  // Let's project lat/lng to 2D canvas coordinates normalized 0..100%
  const getCoordinatesPosition = (lat: number, lng: number) => {
    // Reference base bounds roughly Southeast Asia & East Asia coordinates
    // Lat: -12 to 40, Lng: 95 to 145
    const minLat = -12;
    const maxLat = 40;
    const minLng = 95;
    const maxLng = 145;

    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 75 + 12;

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(8, Math.min(92, y))}%`
    };
  };

  return (
    <div className="relative w-full h-[520px] lg:h-full min-h-[460px] bg-[#e5e3df] rounded-2xl overflow-hidden border border-stone-200 shadow-inner select-none">
      {/* Map Graphic Canvas / Background stylized vector */}
      <div 
        className="absolute inset-0 transition-transform duration-300"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Stylized Vector Map Grid and Landmass SVG */}
        <svg className="w-full h-full object-cover" viewBox="0 0 1000 700" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5d3ce" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="waterGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#d9e6eb" />
              <stop offset="100%" stopColor="#c5d8e0" />
            </radialGradient>
          </defs>

          {/* Ocean */}
          <rect width="1000" height="700" fill="url(#waterGrad)" />
          <rect width="1000" height="700" fill="url(#grid)" opacity="0.6" />

          {/* Stylized Island Landmasses (Bali/Java/Singapore/Japan) */}
          {/* Indonesia / Java & Bali chain */}
          <path
            d="M 150 560 Q 280 570 420 580 Q 550 590 620 595 Q 640 596 660 594 Q 670 605 650 615 Q 480 610 260 600 Q 140 585 150 560 Z"
            fill="#e2decb"
            stroke="#cfcaa7"
            strokeWidth="2"
          />
          {/* Bali Island shape */}
          <path
            d="M 640 580 C 660 575, 680 585, 675 605 C 660 615, 635 605, 640 580 Z"
            fill="#d4ceb0"
            stroke="#bfb895"
            strokeWidth="2"
          />
          {/* Singapore / Malay Peninsula */}
          <path
            d="M 220 380 Q 240 440 260 490 Q 275 500 270 510 Q 255 510 240 470 Q 215 420 220 380 Z"
            fill="#e2decb"
            stroke="#cfcaa7"
            strokeWidth="1.5"
          />
          {/* Japan Arch */}
          <path
            d="M 720 180 Q 770 190 820 150 Q 860 110 880 70 Q 890 85 860 130 Q 810 190 760 220 Q 725 215 720 180 Z"
            fill="#e2decb"
            stroke="#cfcaa7"
            strokeWidth="1.5"
          />

          {/* Regional Road & Sea Routes */}
          <path d="M 270 505 Q 450 540 655 590" fill="none" stroke="#2563eb" strokeDasharray="4,6" strokeWidth="1.5" opacity="0.4" />
          <path d="M 655 590 Q 750 380 820 160" fill="none" stroke="#2563eb" strokeDasharray="4,6" strokeWidth="1.5" opacity="0.4" />
        </svg>

        {/* Property Price Pins on the Map */}
        {properties.map((prop) => {
          const pos = getCoordinatesPosition(prop.location.lat, prop.location.lng);
          const isHovered = hoveredProperty?.id === prop.id;
          
          let priceSnippet = `$${prop.priceUSD}`;
          if (currency === 'IDR') {
            const inM = (prop.priceUSD * 15800) / 1000000;
            priceSnippet = inM >= 1000 ? `Rp ${(inM / 1000).toFixed(1)}B` : `Rp ${Math.round(inM)}M`;
          } else if (prop.priceUSD >= 1000000) {
            priceSnippet = `$${(prop.priceUSD / 1000000).toFixed(1)}M`;
          } else if (prop.priceUSD >= 1000) {
            priceSnippet = `$${Math.round(prop.priceUSD / 1000)}k`;
          }

          if (prop.serviceType === 'rent') priceSnippet += '/n';
          if (prop.serviceType === 'lease') priceSnippet += '/yr';

          const pinBg = prop.serviceType === 'rent' 
            ? 'bg-emerald-600 hover:bg-emerald-500' 
            : prop.serviceType === 'sale' 
            ? 'bg-amber-600 hover:bg-amber-500' 
            : 'bg-indigo-600 hover:bg-indigo-500';

          return (
            <div
              key={prop.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200"
              onMouseEnter={() => setHoveredProperty(prop)}
            >
              <button
                id={`map-pin-${prop.id}`}
                onClick={() => {
                  if (onSelectProperty) onSelectProperty(prop);
                  else setSelectedProperty(prop);
                }}
                className={`relative px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1 transition-transform cursor-pointer ${pinBg} ${
                  isHovered ? 'scale-125 ring-3 ring-white ring-offset-2 z-30' : 'hover:scale-110'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>{priceSnippet}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Hover Card Preview on the Map */}
      {hoveredProperty && (
        <div 
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 z-30 animate-in fade-in slide-in-from-bottom-2"
        >
          <button
            onClick={() => setHoveredProperty(null)}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div 
            onClick={() => setSelectedProperty(hoveredProperty)}
            className="flex gap-3 cursor-pointer"
          >
            <img
              src={hoveredProperty.featuredImage}
              alt={hoveredProperty.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <span className={`px-1.5 py-0.5 rounded-sm uppercase text-[9px] text-white font-bold ${
                  hoveredProperty.serviceType === 'rent' ? 'bg-emerald-600' : hoveredProperty.serviceType === 'sale' ? 'bg-amber-600' : 'bg-indigo-600'
                }`}>
                  For {hoveredProperty.serviceType}
                </span>
                <span className="truncate">{hoveredProperty.location.city}</span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 truncate mt-1">
                {hoveredProperty.title}
              </h4>
              <div className="text-xs font-bold text-indigo-700 mt-1">
                {formatPrice(hoveredProperty.priceUSD, currency, hoveredProperty.serviceType === 'rent' ? 'night' : hoveredProperty.serviceType === 'lease' ? 'year' : 'total')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.5))}
          className="w-8 h-8 rounded-lg bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.75))}
          className="w-8 h-8 rounded-lg bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="w-8 h-8 rounded-lg bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white transition-colors text-[10px] font-bold cursor-pointer"
          title="Reset Center"
        >
          <Navigation className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200 text-[11px] font-medium text-slate-700 shadow-xs flex items-center gap-3 z-10">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Rent</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600"></span> Sale</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Lease</span>
      </div>
    </div>
  );
};
