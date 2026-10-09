import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  Tag,
  KeyRound,
  DollarSign,
  FileText
} from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/currency';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { 
    currency, 
    savedPropertyIds, 
    toggleSaveProperty, 
    hosts, 
    navigate, 
    setSelectedProperty 
  } = useApp();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isSaved = savedPropertyIds.includes(property.id);
  const host = hosts.find(h => h.id === property.hostId);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const CATEGORY_LABELS: Record<string, { id: string; en: string }> = {
    land: { id: 'Tanah', en: 'Land' },
    ruko: { id: 'Ruko', en: 'Shophouse' },
    house: { id: 'Rumah', en: 'House' },
    villa: { id: 'Villa', en: 'Villa' },
    apartment: { id: 'Apartemen', en: 'Apartment' },
    business: { id: 'Bisnis / Usaha', en: 'Business' },
    warehouse: { id: 'Gudang', en: 'Warehouse' },
    kost: { id: 'Kost', en: 'Kost' },
    hotel_room: { id: 'Kamar Hotel', en: 'Hotel Room' },
    commercial: { id: 'Komersial', en: 'Commercial' },
    beachfront: { id: 'Beachfront', en: 'Beachfront' },
    penthouse: { id: 'Penthouse', en: 'Penthouse' },
    townhouse: { id: 'Townhouse', en: 'Townhouse' }
  };

  const { language } = useApp();

  // Badge config based on service type and rent duration
  const getBadgeInfo = () => {
    if (property.serviceType === 'sale') {
      return {
        label: language === 'id' ? 'Dijual' : 'For Sale',
        icon: <DollarSign className="w-3 h-3" />,
        bg: 'bg-amber-600 text-white',
        periodLabel: 'total' as const
      };
    }
    if (property.serviceType === 'lease') {
      return {
        label: language === 'id' ? 'Sewa Tahunan / Lease' : 'For Lease (Yearly)',
        icon: <FileText className="w-3 h-3" />,
        bg: 'bg-indigo-600 text-white',
        periodLabel: 'year' as const
      };
    }
    // Rent: Strictly monthly or yearly
    if (property.pricePeriod === 'year' || property.rentDurationPeriod === 'yearly') {
      return {
        label: language === 'id' ? 'Sewa Tahunan' : 'Yearly Rent',
        icon: <KeyRound className="w-3 h-3" />,
        bg: 'bg-teal-600 text-white',
        periodLabel: 'year' as const
      };
    }
    return {
      label: language === 'id' ? 'Sewa Bulanan' : 'Monthly Rent',
      icon: <KeyRound className="w-3 h-3" />,
      bg: 'bg-emerald-600 text-white',
      periodLabel: 'month' as const
    };
  };

  const badge = getBadgeInfo();
  const displayPrice = formatPrice(property.priceUSD, currency, badge.periodLabel);
  const catLabel = CATEGORY_LABELS[property.category] 
    ? (language === 'id' ? CATEGORY_LABELS[property.category].id : CATEGORY_LABELS[property.category].en)
    : property.category;

  return (
    <div 
      id={`property-card-${property.id}`}
      onClick={() => setSelectedProperty(property)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image Container with Slider */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={property.images[currentImageIndex] || property.featuredImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm tracking-wider uppercase ${badge.bg}`}>
            {badge.icon} {badge.label}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white shadow-sm backdrop-blur-xs border border-white/20">
            {catLabel}
          </span>
          {property.aiGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950 shadow-sm backdrop-blur-xs" title="AI Optimized Description & Specs">
              <Sparkles className="w-3 h-3" /> AI
            </span>
          )}
          {property.isSuperhost && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-500" /> Superhost
            </span>
          )}
        </div>

        {/* Save Wishlist Button */}
        <button
          id={`save-btn-${property.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProperty(property.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-rose-600 shadow-sm transition-all backdrop-blur-xs cursor-pointer"
          title={isSaved ? 'Remove from wishlist' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
        </button>

        {/* Carousel Arrow Controls (Visible on hover) */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/85 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/85 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {property.images.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'bg-white w-3 shadow-xs' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium truncate text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{property.location.area}, {property.location.city}</span>
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{property.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal">({property.reviewCount})</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {property.tagline}
          </p>

          {/* Specs bar */}
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
            <span className="flex items-center gap-1" title={`${property.specs.bedrooms} Bedrooms`}>
              <Bed className="w-3.5 h-3.5 text-slate-400" /> {property.specs.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1" title={`${property.specs.bathrooms} Bathrooms`}>
              <Bath className="w-3.5 h-3.5 text-slate-400" /> {property.specs.bathrooms} Baths
            </span>
            <span className="flex items-center gap-1" title={`${property.specs.buildingSizeSqm} sqm building area`}>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {property.specs.buildingSizeSqm} m²
            </span>
          </div>
        </div>

        {/* Footer: Price & Agent Host Link */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
              {property.serviceType === 'rent' ? 'Rate' : property.serviceType === 'sale' ? 'Purchase Price' : 'Lease Rate'}
            </span>
            <span className="text-base font-bold text-slate-900">
              {displayPrice}
            </span>
          </div>

          {/* Host link button */}
          {host && (
            <button
              id={`host-profile-btn-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${host.slug}`);
              }}
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer"
              title={`View ${host.name}'s custom storefront (proplis.com/${host.slug})`}
            >
              <img
                src={host.avatar}
                alt={host.name}
                className="w-5 h-5 rounded-full object-cover border border-white"
              />
              <div className="max-w-[70px] truncate">
                <span className="block text-[10px] font-bold text-slate-800 truncate leading-tight">
                  @{host.slug}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
