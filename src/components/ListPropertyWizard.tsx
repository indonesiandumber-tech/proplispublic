import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Upload, 
  KeyRound, 
  DollarSign, 
  FileText, 
  Image as ImageIcon,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Video,
  Crown,
  Lock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PropertyCategory, ServiceType } from '../types';

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
];

const PRESET_AMENITIES = [
  'Private Swimming Pool',
  'High-Speed Wi-Fi (250+ Mbps)',
  'Air Conditioning',
  'Dedicated Workspace',
  'Enclosed Car Parking',
  '24/7 Security Guard',
  'Fully Equipped Kitchen',
  'Ocean / River Valley View',
  'Solar Energy System',
  'Smart TV with Netflix'
];

export const ListPropertyWizard: React.FC = () => {
  const { activeUserHost, addProperty, navigate, showToast, setAiDescriptionModal, setPlanUpgradeModal } = useApp();
  const [step, setStep] = useState(1);

  const [serviceType, setServiceType] = useState<ServiceType>('rent');
  const [rentPeriod, setRentPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [category, setCategory] = useState<PropertyCategory>('villa');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [city, setCity] = useState('Bali');
  const [area, setArea] = useState('Canggu');
  const [address, setAddress] = useState('Jl. Raya Batu Bolong No. 18');
  
  // Specs
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [maxGuests, setMaxGuests] = useState(6);
  const [buildingSize, setBuildingSize] = useState(280);
  const [landSize, setLandSize] = useState(350);
  const [furnishing, setFurnishing] = useState<'Fully Furnished' | 'Semi Furnished' | 'Unfurnished'>('Fully Furnished');
  const [certificateType, setCertificateType] = useState('Freehold (SHM)');

  // Pricing
  const [priceUSD, setPriceUSD] = useState(1800);
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Private Swimming Pool',
    'High-Speed Wi-Fi (250+ Mbps)',
    'Air Conditioning',
    'Dedicated Workspace'
  ]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    SAMPLE_PHOTO_PRESETS[0],
    SAMPLE_PHOTO_PRESETS[1]
  ]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Video Tours (Agency Elite: Up to 3 videos)
  const [videoUrl1, setVideoUrl1] = useState('');
  const [videoUrl2, setVideoUrl2] = useState('');
  const [videoUrl3, setVideoUrl3] = useState('');

  // Booking Engine Integration (Agency Elite for Rentals: SiteMinder, Book and Link)
  const [bookingEngineEnabled, setBookingEngineEnabled] = useState(false);
  const [bookingEngineProvider, setBookingEngineProvider] = useState<'siteminder' | 'book_and_link' | 'cloudbeds' | 'custom'>('siteminder');
  const [bookingEngineUrl, setBookingEngineUrl] = useState('');
  const [bookingEngineButtonLabel, setBookingEngineButtonLabel] = useState('Instant Direct Booking (SiteMinder)');

  const isAgencyElite = activeUserHost?.plan === 'elite' || activeUserHost?.plan === 'pro';

  // AI Description Generator via Gemini AI Modal (Polish Mode)
  const openAIDescriptionStudio = () => {
    setAiDescriptionModal({
      isOpen: true,
      initialData: {
        draftDescription: description,
        category,
        serviceType,
        rentPeriod: serviceType === 'rent' ? rentPeriod : undefined,
        city,
        area,
        address,
        priceFormatted: `$${priceUSD} ${serviceType === 'rent' ? (rentPeriod === 'monthly' ? '/ month' : '/ year') : ''}`,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        buildingSize: Number(buildingSize),
        landSize: Number(landSize),
        furnishing,
        certificateType,
        amenities: selectedAmenities,
        agentName: activeUserHost?.name || 'Agent',
        agentPhone: activeUserHost?.whatsapp || activeUserHost?.phone
      },
      onApply: (aiTitle, aiTagline, aiDesc) => {
        setTitle(aiTitle);
        setTagline(aiTagline);
        setDescription(aiDesc);
      }
    });
  };

  const generateAIDescription = () => {
    openAIDescriptionStudio();
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a property title', 'error');
      return;
    }

    const videoUrls = [videoUrl1, videoUrl2, videoUrl3].filter(u => u && u.trim() !== '');

    const created = addProperty({
      title,
      tagline: tagline || `Beautiful ${category} in ${city}`,
      serviceType: serviceType === 'all' ? 'rent' : serviceType,
      category,
      priceUSD: Number(priceUSD),
      pricePeriod: serviceType === 'sale' 
        ? 'total' 
        : serviceType === 'lease' 
        ? 'year' 
        : rentPeriod === 'monthly' 
        ? 'month' 
        : 'year',
      rentDurationPeriod: serviceType === 'rent' ? rentPeriod : undefined,
      aiGenerated: true,
      videoUrl: isAgencyElite && videoUrls.length > 0 ? videoUrls[0] : undefined,
      videoTours: isAgencyElite && videoUrls.length > 0 ? videoUrls.map((u, i) => ({
        url: u,
        platform: u.includes('tiktok') ? 'tiktok' : u.includes('vimeo') ? 'vimeo' : u.includes('instagram') ? 'instagram' : 'youtube',
        title: `Video Tour #${i + 1}`
      })) : undefined,
      bookingEngine: (isAgencyElite && serviceType === 'rent' && bookingEngineEnabled) ? {
        enabled: true,
        provider: bookingEngineProvider,
        bookingUrl: bookingEngineUrl || undefined,
        buttonLabel: bookingEngineButtonLabel || `Direct Booking (${bookingEngineProvider === 'siteminder' ? 'SiteMinder' : 'Book and Link'})`
      } : undefined,
      location: {
        city,
        area,
        country: 'Indonesia',
        address,
        lat: -8.65 + (Math.random() * 0.04 - 0.02),
        lng: 115.13 + (Math.random() * 0.04 - 0.02)
      },
      specs: {
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        maxGuests: Number(maxGuests),
        buildingSizeSqm: Number(buildingSize),
        landSizeSqm: Number(landSize),
        furnishing,
        certificateType: serviceType === 'sale' ? certificateType : undefined,
        cleaningFeeUSD: 35,
        serviceFeeUSD: 25,
        depositUSD: 200
      },
      amenities: selectedAmenities,
      images: selectedPhotos,
      featuredImage: selectedPhotos[0],
      description: description || 'Stunning newly listed property on Proplis.'
    });

    if (!created) return;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });

    if (activeUserHost) {
      navigate(`/${activeUserHost.slug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            List Your Property on Proplis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish under <strong className="text-slate-900">proplis.com/{activeUserHost?.slug || 'budi'}</strong> for Rent, Sale, or Lease.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : step > s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mt-6">
        
        {/* STEP 1: INTENT & CATEGORY */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">
                1. What type of listing is this?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose whether you want to offer monthly or yearly rental, freehold sale, or commercial lease.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setServiceType('rent')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  serviceType === 'rent'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">For Rent (Sewa)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pilihan sewa bulanan ($/bulan) atau sewa tahunan ($/tahun).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('sale')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  serviceType === 'sale'
                    ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">For Sale (Dijual)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kepemilikan hak milik (SHM), strata title, investasi aset.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('lease')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  serviceType === 'lease'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">For Lease (Sewa Panjang)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kontrak jangka panjang 1-25 tahun untuk hunian / komersial.
                </p>
              </button>
            </div>

            {/* If Rent is selected: Sub-period selector (Monthly vs Yearly ONLY) */}
            {serviceType === 'rent' && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-950 block">
                  Tipe Periode Sewa (Rent Period Type - Khusus Bulanan & Tahunan):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setRentPeriod('monthly'); setPriceUSD(1500); }}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer text-left flex items-center gap-3 ${
                      rentPeriod === 'monthly'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="font-bold text-sm">Sewa Bulanan (Monthly)</div>
                      <div className={`text-[11px] ${rentPeriod === 'monthly' ? 'text-emerald-100' : 'text-slate-500'}`}>Tarif per bulan ($ / month)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRentPeriod('yearly'); setPriceUSD(18000); }}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer text-left flex items-center gap-3 ${
                      rentPeriod === 'yearly'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">🗓️</span>
                    <div>
                      <div className="font-bold text-sm">Sewa Tahunan (Yearly)</div>
                      <div className={`text-[11px] ${rentPeriod === 'yearly' ? 'text-emerald-100' : 'text-slate-500'}`}>Kontrak per 1 tahun ($ / year)</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Property Category & Architecture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'land', label: 'Land (Tanah)', icon: '🏝️' },
                  { id: 'ruko', label: 'Ruko / Shophouse', icon: '🏢' },
                  { id: 'house', label: 'House (Rumah)', icon: '🏡' },
                  { id: 'villa', label: 'Villa', icon: '🌺' },
                  { id: 'apartment', label: 'Apartment', icon: '🏬' },
                  { id: 'business', label: 'Business / Usaha', icon: '💼' },
                  { id: 'warehouse', label: 'Warehouse (Gudang)', icon: '🏭' },
                  { id: 'kost', label: 'Kost / Coliving', icon: '🛏️' },
                  { id: 'hotel_room', label: 'Hotel Room / Suite', icon: '🏨' },
                  { id: 'commercial', label: 'Commercial', icon: '🏬' },
                  { id: 'beachfront', label: 'Beachfront', icon: '🌊' },
                  { id: 'penthouse', label: 'Penthouse', icon: '✨' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as PropertyCategory)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      category === cat.id
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in text-xs">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">
                2. Where is your property located?
              </h2>
              <p className="text-slate-500 mt-0.5">
                Pinpoint the exact area to attract targeted buyers and tenants.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Destination City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Bali">Bali (Canggu, Uluwatu, Ubud, Seminyak)</option>
                  <option value="Jakarta">Jakarta (SCBD, Senopati, Menteng, PIK)</option>
                  <option value="Singapore">Singapore (Marina Bay, Orchard, Sentosa)</option>
                  <option value="Tokyo">Tokyo (Shibuya, Ginza, Minato)</option>
                  <option value="Sydney">Sydney (Bondi, CBD, Manly)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Area / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canggu / Pererenan"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jl. Pantai Nelayan No. 42, Canggu, Bali"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SPECS & CERTIFICATES */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in text-xs">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">
                3. Specifications & Certificate
              </h2>
              <p className="text-slate-500 mt-0.5">
                Enter room capacity, land size, and legal deed credentials.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Max Guests (Rent)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Building Area (m²)</label>
                <input
                  type="number"
                  min="20"
                  value={buildingSize}
                  onChange={(e) => setBuildingSize(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Land Area (m²)</label>
                <input
                  type="number"
                  min="0"
                  value={landSize}
                  onChange={(e) => setLandSize(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Furnishing Status</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi Furnished">Semi Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {serviceType === 'sale' && (
              <div>
                <label className="block font-bold text-slate-800 mb-1">Title / Certificate Deed</label>
                <input
                  type="text"
                  placeholder="e.g. Freehold (SHM) + PBG Building Permit"
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 4: AMENITIES & PHOTOS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in text-xs">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">
                4. Select Amenities & Photos
              </h2>
              <p className="text-slate-500 mt-0.5">
                Highlight key comforts and pick curated high-definition photos.
              </p>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_AMENITIES.map(amenity => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        setSelectedAmenities(prev => 
                          isChecked ? prev.filter(x => x !== amenity) : [...prev, amenity]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isChecked 
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-950 ring-1 ring-indigo-500/30' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photos Picker */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Select High-Res Photos</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SAMPLE_PHOTO_PRESETS.map((imgUrl, i) => {
                  const isSelected = selectedPhotos.includes(imgUrl);
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedPhotos(prev => 
                          isSelected ? prev.filter(x => x !== imgUrl) : [...prev, imgUrl]
                        );
                      }}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PRICING & AI DESCRIPTION GENERATION */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-slate-900">
                  5. Pricing & Smart Listing AI
                </h2>
                <p className="text-slate-500 mt-0.5">
                  Set your price and generate an enticing description.
                </p>
              </div>

              <button
                type="button"
                onClick={openAIDescriptionStudio}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-50 to-amber-50 hover:from-indigo-100 hover:to-amber-100 text-indigo-800 border border-indigo-200 rounded-xl font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>AI Auto-Write Description Studio</span>
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                {serviceType === 'rent' 
                  ? (rentPeriod === 'monthly' ? 'Monthly Rental Price (USD $ / month)' : 'Yearly Rental Price (USD $ / year)')
                  : serviceType === 'sale' 
                  ? 'Total Purchase Price (USD $)' 
                  : 'Annual Lease Rate (USD $ / year)'} *
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="bg-slate-100 px-3 py-2 text-slate-600 font-bold border-r border-slate-300">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(Number(e.target.value))}
                  className="w-full p-2.5 text-sm font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Listing Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. The Celestial Infinity Pool Villa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Short Tagline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Modern architectural villa overlooking peaceful rice fields"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Comprehensive Description</label>
              <textarea
                rows={4}
                placeholder="Describe the atmosphere, architecture, furnishings, and neighborhood..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Video Tours Embed (Agency Elite Exclusive: up to 3 video tours) */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <span>Video Tour Embeds (YouTube, Vimeo, TikTok, Instagram Reels)</span>
                </label>
                {isAgencyElite ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                    Agency Elite (Up to 3 Tours)
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Agency Elite Feature
                  </span>
                )}
              </div>

              {isAgencyElite ? (
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Video Tour #1 (Primary YouTube / TikTok / Vimeo / Reels URL)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or TikTok / Reels URL"
                      value={videoUrl1}
                      onChange={(e) => setVideoUrl1(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Video Tour #2 (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://vimeo.com/... or YouTube Short"
                      value={videoUrl2}
                      onChange={(e) => setVideoUrl2(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Video Tour #3 (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/reel/... or TikTok"
                      value={videoUrl3}
                      onChange={(e) => setVideoUrl3(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-3.5 rounded-xl border border-indigo-800/60 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unlock 3 Video Tour Embeds per Listing</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Upgrade to Agency Elite to embed YouTube walkthroughs, TikTok viral clips, and Instagram Reels directly into listing pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlanUpgradeModal({ isOpen: true, preselectedTier: 'elite' })}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-lg text-xs transition-all shrink-0 cursor-pointer shadow-md"
                  >
                    Upgrade Plan
                  </button>
                </div>
              )}
            </div>

            {/* Booking Engine Integration (For Rental properties - Agency Elite) */}
            {serviceType === 'rent' && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <span>Direct Booking Engine Embed (SiteMinder, Book and Link)</span>
                  </label>
                  {isAgencyElite ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Agency Elite Feature
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" /> Agency Elite Feature
                    </span>
                  )}
                </div>

                {isAgencyElite ? (
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingEngineEnabled}
                        onChange={(e) => setBookingEngineEnabled(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Enable Direct Booking Engine on this Rental
                      </span>
                    </label>

                    {bookingEngineEnabled && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Booking Engine Provider
                            </label>
                            <select
                              value={bookingEngineProvider}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setBookingEngineProvider(val);
                                if (val === 'siteminder') setBookingEngineButtonLabel('Instant Direct Booking (SiteMinder)');
                                else if (val === 'book_and_link') setBookingEngineButtonLabel('Instant Direct Booking (Book and Link)');
                                else if (val === 'cloudbeds') setBookingEngineButtonLabel('Reserve via Cloudbeds');
                              }}
                              className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                            >
                              <option value="siteminder">SiteMinder Direct</option>
                              <option value="book_and_link">Book and Link Channel Manager</option>
                              <option value="cloudbeds">Cloudbeds Booking Engine</option>
                              <option value="custom">Custom Reservation Engine</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Button Display Label
                            </label>
                            <input
                              type="text"
                              value={bookingEngineButtonLabel}
                              onChange={(e) => setBookingEngineButtonLabel(e.target.value)}
                              className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Direct Booking Engine URL (e.g. SiteMinder / Book and Link link)
                          </label>
                          <input
                            type="url"
                            placeholder="https://direct-book.com/properties/villa-canggu-direct or https://bookandlink.com/..."
                            value={bookingEngineUrl}
                            onChange={(e) => setBookingEngineUrl(e.target.value)}
                            className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-3.5 rounded-xl border border-emerald-800/60 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Embed SiteMinder or Book and Link Engine</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Exclusive for Agency Elite: Let rental guests book live rooms directly with zero OTA commission.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlanUpgradeModal({ isOpen: true, preselectedTier: 'elite' })}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 text-slate-950 font-extrabold rounded-lg text-xs transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              ← Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Listing to Storefront 🚀</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
