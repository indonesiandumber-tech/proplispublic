import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Check, 
  Phone, 
  Calculator, 
  Building2, 
  ArrowRight,
  FileCheck,
  Tag,
  KeyRound,
  FileText,
  ChevronRight,
  Video,
  ExternalLink,
  DollarSign,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice, formatExactPrice, convertUSDToCurrency } from '../utils/currency';
import { PhoneRevealButton } from './PhoneRevealButton';
import { trackWhatsAppClick } from '../utils/tracking';

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, onClose }) => {
  const { 
    currency, 
    hosts, 
    savedPropertyIds, 
    toggleSaveProperty, 
    navigate, 
    createBooking, 
    setMessageModal,
    setTourModal,
    setShareModal,
    setAiDescriptionModal,
    updateProperty,
    showToast
  } = useApp();

  const isSaved = savedPropertyIds.includes(property.id);
  const host = hosts.find(h => h.id === property.hostId);
  const hostPlan = host?.plan || 'starter';
  const isStarter = hostPlan === 'starter' || hostPlan === 'free';
  const isGrowth = hostPlan === 'growth';
  const isElite = hostPlan === 'elite' || hostPlan === 'pro';

  const isMonthlyRent = property.serviceType === 'rent' && (property.pricePeriod === 'month' || property.rentDurationPeriod === 'monthly');
  const isYearlyRent = property.serviceType === 'rent' && (property.pricePeriod === 'year' || property.rentDurationPeriod === 'yearly');

  // Photo viewer state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Rental Inquiry / Contact Parameters
  const [rentDurationSelection, setRentDurationSelection] = useState<string>(
    isMonthlyRent ? '1 Month' : isYearlyRent ? '1 Year' : '1 Month'
  );
  const [checkInDate, setCheckInDate] = useState('2026-09-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-20');
  const [guestCount, setGuestCount] = useState(2);
  const [guestName, setGuestName] = useState('Alex Harrison');
  const [guestEmail, setGuestEmail] = useState('alex.harrison@gmail.com');
  const [guestPhone, setGuestPhone] = useState('+62 812 9900 1122');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState('');

  // For Sale Mortgage Calculator
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanYears, setLoanYears] = useState(25);
  const [interestRatePercent, setInterestRatePercent] = useState(5.5);

  // For Lease
  const [leaseYears, setLeaseYears] = useState(2);

  // Calculate rental nights
  const calculateNights = () => {
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const baseRentTotalUSD = property.priceUSD * nights;
  const cleaningFeeUSD = property.specs.cleaningFeeUSD || 35;
  const serviceFeeUSD = property.specs.serviceFeeUSD || 25;
  const grandTotalRentUSD = baseRentTotalUSD + cleaningFeeUSD + serviceFeeUSD;

  // Calculate monthly mortgage estimate for sale
  const calculateMonthlyMortgage = () => {
    const principal = property.priceUSD * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRatePercent / 100 / 12;
    const totalMonths = loanYears * 12;
    if (monthlyRate === 0) return principal / totalMonths;
    const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(monthlyPayment);
  };

  const handleRentReserve = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = createBooking({
      propertyId: property.id,
      guestName,
      guestEmail,
      guestPhone,
      startDate: checkInDate,
      endDate: checkOutDate,
      nights,
      guestsCount: guestCount,
      totalAmountUSD: grandTotalRentUSD
    });

    setConfirmedBookingCode(newBooking.bookingCode);
    setIsBookingSuccess(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLeaseRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const annualTotalUSD = property.priceUSD * leaseYears;
    const newBooking = createBooking({
      propertyId: property.id,
      guestName,
      guestEmail,
      guestPhone,
      leaseDurationYears: leaseYears,
      totalAmountUSD: annualTotalUSD
    });

    setConfirmedBookingCode(newBooking.bookingCode);
    setIsBookingSuccess(true);
    confetti({ particleCount: 80, spread: 60 });
  };

  const openShare = () => {
    setShareModal({
      isOpen: true,
      title: property.title,
      url: `https://proplis.com/p/${property.id}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-xs ${
              property.serviceType === 'rent' ? 'bg-emerald-600 text-white' : property.serviceType === 'sale' ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'
            }`}>
              For {property.serviceType}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ref: <span className="font-mono text-slate-700 font-bold">{property.id}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openShare}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveProperty(property.id)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors font-bold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Title & Location Header */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {property.serviceType === 'sale' ? (
                  <span className="px-2.5 py-1 rounded-md text-xs uppercase font-extrabold text-white bg-amber-600 shadow-xs">
                    Dijual (For Sale)
                  </span>
                ) : (property.pricePeriod === 'month' || property.rentDurationPeriod === 'monthly') ? (
                  <span className="px-2.5 py-1 rounded-md text-xs uppercase font-extrabold text-white bg-emerald-600 shadow-xs">
                    Sewa Bulanan (Monthly)
                  </span>
                ) : (property.pricePeriod === 'year' || property.rentDurationPeriod === 'yearly') ? (
                  <span className="px-2.5 py-1 rounded-md text-xs uppercase font-extrabold text-white bg-teal-600 shadow-xs">
                    Sewa Tahunan (Yearly)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs uppercase font-extrabold text-white bg-indigo-600 shadow-xs">
                    For {property.serviceType}
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 capitalize">
                  {property.category}
                </span>

                {property.aiGenerated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-500" /> AI Verified Specs
                  </span>
                )}
              </div>

              <button
                onClick={() => setAiDescriptionModal({
                  isOpen: true,
                  initialData: {
                    draftDescription: property.description,
                    category: property.category,
                    serviceType: property.serviceType,
                    rentPeriod: property.pricePeriod === 'year' || property.rentDurationPeriod === 'yearly' ? 'yearly' : 'monthly',
                    city: property.location.city,
                    area: property.location.area,
                    address: property.location.address,
                    bedrooms: property.specs.bedrooms,
                    bathrooms: property.specs.bathrooms,
                    buildingSize: property.specs.buildingSizeSqm,
                    landSize: property.specs.landSizeSqm,
                    furnishing: property.specs.furnishing,
                    certificateType: property.specs.certificateType,
                    amenities: property.amenities,
                    priceFormatted: formatPrice(property.priceUSD, currency, property.serviceType === 'sale' ? 'total' : (property.pricePeriod === 'year' || property.rentDurationPeriod === 'yearly') ? 'year' : 'month'),
                    agentName: host?.name,
                    agentPhone: host?.whatsapp || host?.phone
                  },
                  onApply: (aiTitle, aiTagline, aiDesc) => {
                    updateProperty(property.id, {
                      title: aiTitle,
                      tagline: aiTagline,
                      description: aiDesc
                    });
                    showToast('Listing updated with AI Polished description!', 'success');
                  }
                })}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500/15 to-indigo-600/15 hover:from-amber-500/25 hover:to-indigo-600/25 text-amber-900 border border-amber-500/30 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Copy Studio</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
              {property.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {property.tagline}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{property.rating.toFixed(2)}</span>
                  <span className="text-slate-400 font-normal">({property.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.location.address}</span>
                </span>
              </div>

              {property.specs.certificateType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {property.specs.certificateType}
                </span>
              )}
            </div>
          </div>

          {/* Photo Mosaic Grid (5 Hero Photos) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden aspect-16/9 md:aspect-21/9 max-h-[440px]">
            <div className="md:col-span-2 h-full cursor-pointer relative group" onClick={() => setSelectedPhotoIndex(0)}>
              <img
                src={property.images[0] || property.featuredImage}
                alt="Main view"
                className="w-full h-full object-cover transition-transform group-hover:scale-102"
              />
            </div>
            <div className="hidden md:grid col-span-2 grid-cols-2 gap-3 h-full">
              {property.images.slice(1, 5).map((img, idx) => (
                <div 
                  key={idx} 
                  className="h-full cursor-pointer relative group overflow-hidden" 
                  onClick={() => setSelectedPhotoIndex(idx + 1)}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Two Columns: Left Property Details, Right Sticky Booking / Purchase Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content Area (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Host Banner Card with Direct URL link & Click-to-Reveal Phone */}
              {host && (
                <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={host.avatar}
                        alt={host.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            Listed & Managed by {host.name}
                          </h4>
                          <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full font-bold">
                            @{host.slug}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {host.title} • {host.responseRate} response rate
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/${host.slug}`);
                          }}
                          className="text-xs font-mono font-bold text-indigo-800 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          Visit Storefront: proplis.com/{host.slug} <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {host.whatsappEnabled ? (
                        <>
                          <button
                            onClick={() => {
                              trackWhatsAppClick(host.name, host.phone || host.whatsapp, property.title);
                              const text = encodeURIComponent(`Hi ${host.name}, I am interested in ${property.title} on Proplis.`);
                              window.open(`https://wa.me/${host.whatsapp}?text=${text}`, '_blank');
                            }}
                            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                          </button>
                          <button
                            onClick={() => setMessageModal({ isOpen: true, hostId: host.id, propertyId: property.id, defaultSubject: property.title })}
                            className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Inquire
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setMessageModal({ isOpen: true, hostId: host.id, propertyId: property.id, defaultSubject: property.title })}
                          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Kirim Pesan (CRM Inbox)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Direct Phone Reveal & Conversion Tracking Bar */}
                  {host.whatsappEnabled ? (
                    <div className="pt-2 border-t border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">Direct Phone & WhatsApp:</span>
                      <PhoneRevealButton
                        phone={host.phone}
                        agentName={host.name}
                        propertyTitle={property.title}
                        variant="light"
                        className="w-full sm:w-auto"
                      />
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-indigo-100 flex items-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Privasi Terjaga: Nomor HP & WhatsApp privat (Hanya pesan in-app).</span>
                    </div>
                  )}
                </div>
              )}

              {/* Core Property Specifications */}
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif mb-3">
                  Property Highlights & Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Bedrooms</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mt-1">
                      <Bed className="w-4 h-4 text-indigo-600" />
                      <span>{property.specs.bedrooms} Beds</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Bathrooms</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mt-1">
                      <Bath className="w-4 h-4 text-indigo-600" />
                      <span>{property.specs.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Building Area</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mt-1">
                      <Maximize2 className="w-4 h-4 text-indigo-600" />
                      <span>{property.specs.buildingSizeSqm} m²</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Furnishing</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mt-1 truncate">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{property.specs.furnishing}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif mb-2">
                  About This Property
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif mb-3">
                  What this place offers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neighborhood & Distances */}
              {property.neighborhoodInfo && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif mb-3">
                    Neighborhood & Surroundings
                  </h3>
                  <div className="space-y-2">
                    {property.neighborhoodInfo.placesNearby.map((place, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs">
                        <span className="font-semibold text-slate-800">{place.name} ({place.type})</span>
                        <span className="font-mono text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                          {place.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Tours (Up to 3 Tours for Agency Elite) */}
              {((property.videoTours && property.videoTours.length > 0) || property.videoUrl) && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                      <Video className="w-4 h-4 text-indigo-600" />
                      <span>Video Walkthrough Tours & Reels</span>
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      {property.videoTours?.length || 1} Video Tours
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.videoTours && property.videoTours.length > 0 ? (
                      property.videoTours.map((vt, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                            <span>{vt.platform.toUpperCase()} TOUR #{idx + 1}</span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">4K / HD</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-100 truncate">{vt.title || `Property Tour ${idx + 1}`}</p>
                          <a
                            href={vt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                          >
                            <span>Play Video Tour</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))
                    ) : property.videoUrl ? (
                      <div className="sm:col-span-2 p-3 bg-slate-900 rounded-2xl overflow-hidden">
                        <video controls className="w-full h-56 rounded-xl object-cover bg-black">
                          <source src={property.videoUrl} type="video/mp4" />
                        </video>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

            </div>

            {/* Right Action Widget (Sticky) */}
            <div className="space-y-6">
              
              {/* Booking Engine Embed (SiteMinder / Book and Link) for Agency Elite */}
              {property.bookingEngine?.enabled && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-500/50 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                        Booking Engine
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-bold uppercase">
                      {property.bookingEngine.provider === 'siteminder' ? 'SiteMinder' : property.bookingEngine.provider === 'book_and_link' ? 'Book and Link' : property.bookingEngine.provider}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">Direct Reservation & Live Availability</h4>
                    <p className="text-[11px] text-slate-300 leading-tight">Instant confirmation with zero OTA markup. Connected to live channel manager.</p>
                  </div>

                  <a
                    href={property.bookingEngine.bookingUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>{property.bookingEngine.buttonLabel || `Book Direct (${property.bookingEngine.provider === 'siteminder' ? 'SiteMinder' : 'Book and Link'})`}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Main Transaction Widget */}
              <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-xl sticky top-24">
                
                {/* Price display */}
                <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      {property.serviceType === 'rent' 
                        ? (isYearlyRent ? 'Yearly Rental Rate' : 'Monthly Rental Rate') 
                        : property.serviceType === 'sale' 
                        ? 'Purchase Price' 
                        : 'Annual Lease Rate'}
                    </span>
                    <span className="text-2xl font-bold font-serif text-slate-900">
                      {formatPrice(
                        property.priceUSD, 
                        currency, 
                        property.serviceType === 'rent' 
                          ? (isYearlyRent ? 'year' : 'month') 
                          : property.serviceType === 'lease' 
                          ? 'year' 
                          : 'total'
                      )}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{property.rating.toFixed(2)}</span>
                  </span>
                </div>

                {/* SUCCESS BOOKING CONFIRMATION STATE */}
                {isBookingSuccess ? (
                  <div className="mt-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-emerald-900 text-base font-serif">
                      {property.serviceType === 'rent' ? 'Reservation Confirmed!' : 'Request Sent Successfully!'}
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Booking Reference Code: <strong className="font-mono">{confirmedBookingCode}</strong>
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/bookings');
                      }}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      View in My Bookings & Tours →
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 1. FOR RENT: Contact Agent based on their subscription */}
                    {property.serviceType === 'rent' && (
                      <div className="mt-4 space-y-3.5 text-xs">
                        {/* Rental Term & Inquiry Parameters */}
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Rental Inquiry Details</span>
                          </span>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Preferred Move-in
                              </label>
                              <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Rental Term
                              </label>
                              <select
                                value={rentDurationSelection}
                                onChange={(e) => setRentDurationSelection(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white text-xs font-semibold"
                              >
                                {isYearlyRent ? (
                                  <>
                                    <option value="1 Year">1 Tahun (1 Year Term)</option>
                                    <option value="2 Years">2 Tahun (2 Years Term)</option>
                                    <option value="3 Years">3 Tahun (3 Years Term)</option>
                                    <option value="5 Years">5 Tahun (5 Years Term)</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="1 Month">1 Bulan (1 Month)</option>
                                    <option value="3 Months">3 Bulan (Quarterly)</option>
                                    <option value="6 Months">6 Bulan (Semester)</option>
                                    <option value="12 Months">12 Bulan (1 Tahun Penuh)</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Occupants / Guests
                            </label>
                            <select
                              value={guestCount}
                              onChange={(e) => setGuestCount(Number(e.target.value))}
                              className="w-full p-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white text-xs"
                            >
                              <option value={1}>1 Occupant</option>
                              <option value={2}>2 Occupants (Couple)</option>
                              <option value={3}>3 Occupants</option>
                              <option value={4}>4 Occupants (Family)</option>
                              <option value={6}>6+ Occupants</option>
                            </select>
                          </div>

                          {/* Quoted Rate Summary */}
                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Quoted Rental Rate:</span>
                            <span className="font-bold text-slate-900 font-mono">
                              {formatPrice(property.priceUSD, currency, isYearlyRent ? 'year' : 'month')}
                            </span>
                          </div>
                        </div>

                        {/* Contact Agent based on Subscription Tier */}
                        <div className="space-y-2 pt-1">
                          {isStarter ? (
                            /* TIER 1: STARTER (Free) -> Privacy Controls Active -> Direct In-App CRM Inbox Message */
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  setMessageModal({
                                    isOpen: true,
                                    hostId: property.hostId,
                                    propertyId: property.id,
                                    defaultSubject: `Rental Inquiry: ${property.title} (${rentDurationSelection}, Move-in: ${checkInDate || 'Flexible'})`
                                  });
                                }}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span>Contact Agent via CRM Message</span>
                              </button>

                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span>Starter Privacy Control: Direct in-app message delivered to agent CRM inbox.</span>
                              </div>
                            </div>
                          ) : (
                            /* TIER 2: GROWTH & TIER 3: AGENCY ELITE -> Direct WhatsApp + Phone Reveal + CRM Message */
                            <div className="space-y-2">
                              {/* 1-Click WhatsApp Direct Lead Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  trackWhatsAppClick(host?.name || 'Agent', property.title);
                                  const text = encodeURIComponent(
                                    `Halo ${host?.name || 'Agent'},\n` +
                                    `Saya tertarik menyewa properti Anda di Proplis:\n\n` +
                                    `🏡 *Properti:* ${property.title}\n` +
                                    `📍 *Lokasi:* ${property.location.area}, ${property.location.city}\n` +
                                    `💰 *Tarif:* ${formatPrice(property.priceUSD, currency, isYearlyRent ? 'year' : 'month')}\n` +
                                    `📅 *Rencana Masuk:* ${checkInDate || 'Segera'}\n` +
                                    `⏱️ *Durasi Sewa:* ${rentDurationSelection}\n` +
                                    `👥 *Jumlah Penghuni:* ${guestCount} orang\n\n` +
                                    `Mohon info ketersediaan unit dan jadwal surveinya. Terima kasih!`
                                  );
                                  window.open(`https://wa.me/${host?.whatsapp || host?.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                }}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                              >
                                <MessageSquare className="w-4 h-4 fill-white" />
                                <span>Contact Agent via WhatsApp (1-Click)</span>
                              </button>

                              {/* Phone Reveal Button (tracks phoneClicks) */}
                              {host?.phone && (
                                <PhoneRevealButton
                                  phone={host.phone}
                                  agentName={host.name}
                                  variant="light"
                                />
                              )}

                              {/* In-App CRM Message alternative */}
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  setMessageModal({
                                    isOpen: true,
                                    hostId: property.hostId,
                                    propertyId: property.id,
                                    defaultSubject: `Rental Inquiry: ${property.title} (${rentDurationSelection}, Move-in: ${checkInDate || 'Flexible'})`
                                  });
                                }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5 text-slate-500" />
                                <span>Send In-App Message (CRM)</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 2. FOR SALE: Mortgage & Tour Scheduler */}
                    {property.serviceType === 'sale' && (
                      <div className="mt-4 space-y-4 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <Calculator className="w-3.5 h-3.5 text-indigo-600" /> Mortgage Estimator
                            </span>
                            <span className="font-mono text-indigo-900 font-bold">
                              ~{formatExactPrice(calculateMonthlyMortgage(), currency)} / mo
                            </span>
                          </div>

                          <div className="space-y-2 pt-1 text-[11px]">
                            <div>
                              <div className="flex justify-between text-slate-500">
                                <span>Down Payment:</span>
                                <span className="font-bold text-slate-800">{downPaymentPercent}% ({formatExactPrice((property.priceUSD * downPaymentPercent) / 100, currency)})</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="50"
                                step="5"
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>

                            <div className="flex justify-between text-slate-500">
                              <span>Loan Term:</span>
                              <span className="font-bold text-slate-800">{loanYears} Years</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => setTourModal({ isOpen: true, property })}
                            className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-md transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Calendar className="w-4 h-4" /> Schedule Private Tour (In-Person / Live)
                          </button>

                          <button
                            onClick={() => setMessageModal({ 
                              isOpen: true, 
                              hostId: property.hostId, 
                              propertyId: property.id, 
                              defaultSubject: `Offer for ${property.title}` 
                            })}
                            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 rounded-xl font-bold transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <DollarSign className="w-4 h-4" /> Submit Buyer Offer / Request Deed
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. FOR LEASE: Term picker & Contact Agent */}
                    {property.serviceType === 'lease' && (
                      <div className="mt-4 space-y-3.5 text-xs">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Leasehold Agreement Parameters</span>
                          </span>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Lease Period</label>
                            <select
                              value={leaseYears}
                              onChange={(e) => setLeaseYears(Number(e.target.value))}
                              className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-semibold text-xs"
                            >
                              <option value={1}>1 Year Term</option>
                              <option value={2}>2 Years Term (Standard)</option>
                              <option value={5}>5 Years Term (Commercial Leasehold)</option>
                              <option value={10}>10 Years Long-Term Lease</option>
                              <option value={25}>25 Years Complete Leasehold</option>
                            </select>
                          </div>

                          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs space-y-1 text-indigo-950">
                            <div className="flex justify-between">
                              <span>Annual Rate:</span>
                              <span className="font-bold">{formatExactPrice(property.priceUSD, currency)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Security Deposit:</span>
                              <span>{formatExactPrice(property.specs.depositUSD || 5000, currency)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-indigo-200 font-bold">
                              <span>{leaseYears}-Year Total:</span>
                              <span>{formatExactPrice(property.priceUSD * leaseYears, currency)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Agent based on subscription */}
                        <div className="space-y-2 pt-1">
                          {isStarter ? (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                setMessageModal({
                                  isOpen: true,
                                  hostId: property.hostId,
                                  propertyId: property.id,
                                  defaultSubject: `Leasehold Inquiry: ${property.title} (${leaseYears} Years Term)`
                                });
                              }}
                              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Contact Agent for Leasehold Draft (CRM)</span>
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => {
                                  trackWhatsAppClick(host?.name || 'Agent', property.title);
                                  const text = encodeURIComponent(
                                    `Halo ${host?.name || 'Agent'},\n` +
                                    `Saya tertarik untuk sewa jangka panjang (leasehold) properti "${property.title}" di ${property.location.area}, ${property.location.city}.\n\n` +
                                    `⏱️ Durasi yang diajukan: ${leaseYears} Tahun\n` +
                                    `💰 Perkiraan Nilai Kontrak: ${formatExactPrice(property.priceUSD * leaseYears, currency)}\n\n` +
                                    `Mohon draft perjanjian sewa dan informasi jadwal surveinya. Terima kasih!`
                                  );
                                  window.open(`https://wa.me/${host?.whatsapp || host?.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                }}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                              >
                                <MessageSquare className="w-4 h-4 fill-white" />
                                <span>Contact Agent via WhatsApp (Leasehold)</span>
                              </button>

                              {host?.phone && (
                                <PhoneRevealButton
                                  phone={host.phone}
                                  agentName={host.name}
                                  variant="light"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
