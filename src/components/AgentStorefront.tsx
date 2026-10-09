import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Phone, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  Building,
  Award, 
  Mail, 
  QrCode,
  KeyRound,
  DollarSign,
  FileText,
  Home,
  CheckCircle2,
  Crown,
  Zap,
  Tag,
  RefreshCw,
  Video,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Camera,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { PhoneRevealButton } from './PhoneRevealButton';
import { ServiceType } from '../types';
import { formatPrice } from '../utils/currency';
import { trackWhatsAppClick } from '../utils/tracking';

interface AgentStorefrontProps {
  slug: string;
}

export const AgentStorefront: React.FC<AgentStorefrontProps> = ({ slug }) => {
  const { 
    hosts, 
    properties, 
    reviews, 
    currency,
    navigate, 
    setMessageModal, 
    setShareModal, 
    setOwnerSubmitModal,
    setPlanUpgradeModal,
    setPhotoPickerModal,
    setAiDescriptionModal,
    showToast,
    activeHostId,
    setSelectedProperty,
    t,
    language,
    localizedPlans
  } = useApp();

  const [selectedPurpose, setSelectedPurpose] = useState<'all' | 'sale' | 'rent_all' | 'rent_monthly' | 'rent_yearly' | 'lease'>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [rotatingIndex, setRotatingIndex] = useState(0);

  const host = hosts.find(h => h.slug.toLowerCase() === slug.toLowerCase()) || hosts[0];
  const isOwner = activeHostId === host.id;
  const planCfg = localizedPlans[host.plan || 'free'];

  // All listings for this specific host
  const hostProperties = useMemo(() => {
    return properties.filter(p => p.hostId === host.id);
  }, [properties, host.id]);

  // Extract available districts from host's property listings
  const availableDistricts = useMemo(() => {
    const districtCountMap = new Map<string, number>();
    
    // Core landmark districts to test specifically for Canggu, Kuta, Ubud, Seminyak, Uluwatu, SCBD, etc.
    const priorityDistricts = ['Canggu', 'Kuta', 'Ubud', 'Seminyak', 'Uluwatu', 'Pererenan', 'Berawa', 'SCBD', 'Sanur'];

    hostProperties.forEach(p => {
      const area = p.location?.area || '';
      const city = p.location?.city || '';
      const fullLoc = `${area} ${city}`;

      let matched = false;
      for (const pd of priorityDistricts) {
        if (fullLoc.toLowerCase().includes(pd.toLowerCase())) {
          districtCountMap.set(pd, (districtCountMap.get(pd) || 0) + 1);
          matched = true;
        }
      }

      if (!matched) {
        const parts = area.split(/[\/,]/).map(s => s.trim()).filter(Boolean);
        const name = parts[0] || city || 'Central';
        districtCountMap.set(name, (districtCountMap.get(name) || 0) + 1);
      }
    });

    return Array.from(districtCountMap.entries()).map(([name, count]) => ({ name, count }));
  }, [hostProperties]);

  // Available categories in host's listings
  const availableCategories = useMemo(() => {
    const catMap = new Map<string, number>();
    hostProperties.forEach(p => {
      if (p.category) {
        catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      }
    });
    return catMap;
  }, [hostProperties]);

  // Multi-dimensional filtering logic
  // Multi-dimensional filtering logic
  const filteredProperties = useMemo(() => {
    return hostProperties.filter(p => {
      // 1. Purpose & Rent Duration Filter (Sale vs Rent Monthly vs Rent Yearly vs Lease vs All)
      if (selectedPurpose === 'sale' && p.serviceType !== 'sale') {
        return false;
      }
      if (selectedPurpose === 'rent_all' && p.serviceType !== 'rent') {
        return false;
      }
      if (selectedPurpose === 'rent_monthly') {
        const isMonthly = p.serviceType === 'rent' && (
          p.pricePeriod === 'month' || 
          p.rentDurationPeriod === 'monthly' || 
          (!p.rentDurationPeriod && p.pricePeriod !== 'year')
        );
        if (!isMonthly) return false;
      }
      if (selectedPurpose === 'rent_yearly') {
        const isYearly = (
          (p.serviceType === 'rent' && (p.pricePeriod === 'year' || p.rentDurationPeriod === 'yearly')) || 
          p.serviceType === 'lease'
        );
        if (!isYearly) return false;
      }
      if (selectedPurpose === 'lease' && p.serviceType !== 'lease') {
        return false;
      }

      // 2. District / Location
      if (selectedDistrict !== 'all') {
        const target = selectedDistrict.toLowerCase();
        const area = (p.location?.area || '').toLowerCase();
        const city = (p.location?.city || '').toLowerCase();
        const address = (p.location?.address || '').toLowerCase();
        if (!area.includes(target) && !city.includes(target) && !address.includes(target)) {
          return false;
        }
      }

      // 3. Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // 4. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = p.title.toLowerCase().includes(q);
        const taglineMatch = p.tagline.toLowerCase().includes(q);
        const areaMatch = (p.location?.area || '').toLowerCase().includes(q);
        const cityMatch = (p.location?.city || '').toLowerCase().includes(q);
        const amenityMatch = p.amenities?.some(a => a.toLowerCase().includes(q));
        if (!titleMatch && !taglineMatch && !areaMatch && !cityMatch && !amenityMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      return 0;
    });
  }, [hostProperties, selectedPurpose, selectedDistrict, selectedCategory, searchQuery, sortBy]);

  const featuredProperties = hostProperties.filter(p => p.isFeatured).length > 0
    ? hostProperties.filter(p => p.isFeatured)
    : hostProperties;

  // Auto-rotate hero listing if Pro tier
  useEffect(() => {
    if (host.enableRotatingHero && featuredProperties.length > 1) {
      const interval = setInterval(() => {
        setRotatingIndex(prev => (prev + 1) % featuredProperties.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [host.enableRotatingHero, featuredProperties.length]);

  const saleCount = hostProperties.filter(p => p.serviceType === 'sale').length;
  const rentAllCount = hostProperties.filter(p => p.serviceType === 'rent').length;
  const rentMonthlyCount = hostProperties.filter(p => 
    p.serviceType === 'rent' && (
      p.pricePeriod === 'month' || 
      p.rentDurationPeriod === 'monthly' || 
      (!p.rentDurationPeriod && p.pricePeriod !== 'year')
    )
  ).length;
  const rentYearlyCount = hostProperties.filter(p => 
    (p.serviceType === 'rent' && (p.pricePeriod === 'year' || p.rentDurationPeriod === 'yearly')) || 
    p.serviceType === 'lease'
  ).length;
  const leaseCount = hostProperties.filter(p => p.serviceType === 'lease').length;

  const hasActiveFilters = selectedPurpose !== 'all' || selectedDistrict !== 'all' || selectedCategory !== 'all' || searchQuery.trim() !== '' || sortBy !== 'default';

  const resetFilters = () => {
    setSelectedPurpose('all');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
  };

  const publicUrl = `https://proplis.com/${host.slug}`;

  const copyStorefrontLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    showToast(language === 'id' ? `Tautan website disalin: ${publicUrl}` : `Storefront link copied: ${publicUrl}`, 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleWhatsAppClick = () => {
    // Fire tracking for WhatsApp conversion
    trackWhatsAppClick(host.name, host.phone || host.whatsapp);

    if (!host.whatsappEnabled) {
      showToast(language === 'id' ? 'Agen ini menggunakan paket Free. Fitur pesan langsung dalam aplikasi tersedia.' : 'This agent is on the Free plan. Direct in-app messaging is available.', 'info');
      setMessageModal({ isOpen: true, hostId: host.id });
      return;
    }
    const text = encodeURIComponent(language === 'id' 
      ? `Halo ${host.name}, saya sedang melihat website properti Anda di Proplis (proplis.com/${host.slug}) dan ingin bertanya tentang listing properti Anda.`
      : `Hi ${host.name}, I am browsing your private website on Proplis (proplis.com/${host.slug}) and would like to inquire about your property listings.`);
    window.open(`https://wa.me/${host.whatsapp || '6281288990011'}?text=${text}`, '_blank');
  };

  const currentRotatingProp = featuredProperties[rotatingIndex] || hostProperties[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Custom Storefront Announcement & URL Bar */}
      <div className="bg-slate-950 text-slate-100 py-3 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">{t('agentPrivateWebsite')}:</span>
            <span className="font-mono text-amber-400 font-bold bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
              proplis.com/{host.slug}
            </span>

            {/* Plan Tier Badge */}
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
              (host.plan === 'elite' || host.plan === 'pro')
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                : host.plan === 'growth'
                ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {(host.plan === 'elite' || host.plan === 'pro') && <Crown className="w-2.5 h-2.5" />}
              {host.plan === 'growth' && <Zap className="w-2.5 h-2.5" />}
              {planCfg.name} Plan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyStorefrontLink}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-800"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (language === 'id' ? 'Disalin' : 'Copied') : t('copyUrl')}</span>
            </button>

            <button
              onClick={() => setQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-800"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('qrCode')}</span>
            </button>

            {isOwner && (
              <button
                onClick={() => navigate('/host-dashboard')}
                className="flex items-center gap-1.5 px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <span>{t('agentCrmPortal')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ROTATING HERO FEATURED LISTING BANNER (PRO PLAN TIER EXCLUSIVE) */}
      {host.enableRotatingHero && currentRotatingProp && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl text-white">
            <div className="relative h-72 sm:h-96 w-full">
              <img
                src={currentRotatingProp.images[0]}
                alt={currentRotatingProp.title}
                className="w-full h-full object-cover transition-all duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Rotating Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                  <RefreshCw className="w-3 h-3 animate-spin duration-3000" /> {t('rotatingHeroBadge')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-mono font-bold border border-slate-700">
                  {rotatingIndex + 1} / {featuredProperties.length}
                </span>
              </div>

              {/* Slider Controls */}
              {featuredProperties.length > 1 && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                  <button
                    onClick={() => setRotatingIndex(prev => (prev - 1 + featuredProperties.length) % featuredProperties.length)}
                    className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors cursor-pointer border border-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRotatingIndex(prev => (prev + 1) % featuredProperties.length)}
                    className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors cursor-pointer border border-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Property Details in Hero */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase">
                      {currentRotatingProp.serviceType === 'rent' ? t('forRent') : currentRotatingProp.serviceType === 'sale' ? t('forSale') : t('forLease')}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {currentRotatingProp.location.area}, {currentRotatingProp.location.city}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-bold font-serif text-white line-clamp-1">
                    {currentRotatingProp.title}
                  </h2>

                  <p className="text-xs text-slate-300 line-clamp-1">
                    {currentRotatingProp.specs.bedrooms} {language === 'id' ? 'KT' : 'Beds'} • {currentRotatingProp.specs.bathrooms} {language === 'id' ? 'KM' : 'Baths'} • {currentRotatingProp.specs.buildingSizeSqm} m² • {currentRotatingProp.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block uppercase">{language === 'id' ? 'Harga' : 'Price'}</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
                      {formatPrice(currentRotatingProp.priceUSD, currency, currentRotatingProp.serviceType === 'rent' ? 'night' : currentRotatingProp.serviceType === 'lease' ? 'year' : 'total')}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedProperty(currentRotatingProp)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Host Profile Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
          {/* Cover Photo */}
          <div className="h-44 sm:h-56 w-full relative group">
            <img
              src={host.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}
              alt={host.name}
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* If the active user is this agent, allow direct cover photo edit */}
            {isOwner && (
              <button
                onClick={() => setPhotoPickerModal({ isOpen: true, initialTab: 'cover', hostId: host.id })}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700/80 backdrop-blur-sm flex items-center gap-1.5 cursor-pointer shadow-lg hover:text-amber-400 transition-all"
                title={t('changeHeaderCover')}
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('changeHeaderCover')}</span>
              </button>
            )}
          </div>

          {/* Host Profile Info Row */}
          <div className="relative px-6 sm:px-10 pb-8 -mt-16 sm:-mt-20 z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar with Verified Ring */}
              <div className="relative group">
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl bg-white"
                />

                {/* If owner, allow avatar change directly */}
                {isOwner && (
                  <button
                    onClick={() => setPhotoPickerModal({ isOpen: true, initialTab: 'avatar', hostId: host.id })}
                    className="absolute inset-0 bg-slate-950/65 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-white gap-1 z-10"
                    title={t('changeProfilePhoto')}
                  >
                    <Camera className="w-5 h-5 text-amber-400" />
                    <span className="text-[10px] font-bold">{t('changeProfilePhoto')}</span>
                  </button>
                )}

                {host.verified && (
                  <span 
                    className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-900 z-10"
                    title={language === 'id' ? 'Agen Terverifikasi' : 'Verified Certified Agent'}
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  </span>
                )}
              </div>

              {/* Identity Details */}
              <div className="text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                    {host.name}
                  </h1>
                  <span className="text-xs font-mono font-bold bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-700">
                    @{host.slug}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl font-medium">
                  {host.title}
                </p>
                {host.agency && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" /> {host.agency} • {host.location}
                  </p>
                )}
              </div>
            </div>

            {/* Direct Contact Buttons + OWNER LISTING SUBMISSION BUTTON + PHONE REVEAL (CONVERSION TRACKING) */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              
              {/* CLICK-TO-REVEAL & COPY PHONE NUMBER (GROWTH & ELITE ONLY) */}
              {host.whatsappEnabled && (
                <PhoneRevealButton
                  phone={host.phone}
                  agentName={host.name}
                  variant="dark"
                />
              )}

              {/* PLEASE LIST MY PROPERTY (FOR OWNERS) */}
              <button
                onClick={() => setOwnerSubmitModal({ isOpen: true, targetHostId: host.id })}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg transition-all cursor-pointer active:scale-98"
                title={language === 'id' ? 'Titipkan properti Anda (jual, sewa, leasehold) kepada agen ini' : 'Submit your property to be listed with this agent'}
              >
                <Building2 className="w-4 h-4" />
                <span>{t('pleaseListMyProperty')}</span>
              </button>

              {/* WhatsApp Button (Active on Growth & Agency Elite, In-App Message on Starter) */}
              {host.whatsappEnabled ? (
                <button
                  onClick={handleWhatsAppClick}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white"
                  title="Direct WhatsApp Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('whatsappChat')}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Privasi Terjaga: WhatsApp Privat</span>
                </div>
              )}

              <button
                onClick={() => setMessageModal({ isOpen: true, hostId: host.id })}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('directMessage')} (CRM)</span>
              </button>
            </div>

          </div>

          {/* Metrics Strip */}
          <div className="bg-slate-950/90 border-t border-slate-800 px-6 sm:px-10 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">{t('ratingAndTrust')}</span>
              <div className="flex items-center gap-1 text-white font-bold text-sm mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{host.rating.toFixed(2)}</span>
                <span className="text-slate-400 font-normal">({host.reviewCount} {t('reviews')})</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">{t('activePropertyListings')}</span>
              <span className="text-white font-bold text-sm mt-0.5 block">
                {hostProperties.length} {host.plan === 'pro' ? `(${language === 'id' ? 'Tanpa Batas' : 'Unlimited'})` : `(Max: ${planCfg.listingLimit})`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">{t('whatsappLeadIntegration')}</span>
              <span className={`font-bold text-sm mt-0.5 block ${host.whatsappEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {host.whatsappEnabled ? (language === 'id' ? 'Aktif (Direct WA)' : 'Enabled (Direct)') : (language === 'id' ? 'Hanya Pesan In-App' : 'In-App Message Only')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">{t('ownerListingIntake')}</span>
              <span className={`font-bold text-sm mt-0.5 block ${host.enableOwnerSubmission ? 'text-amber-400' : 'text-emerald-400'}`}>
                {language === 'id' ? 'Aktif (Terbuka)' : 'Active (Open)'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Two Column Layout: Left Host Bio & Credentials, Right Property Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Left Column: About & Host Profile */}
          <div className="space-y-6">
            
            {/* Owner CTA Card (PLEASE LIST MY PROPERTY) */}
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> {language === 'id' ? 'Titip Properti Anda' : 'Property Owners'}
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {t('wantToListProperty')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('wantToListPropertySub')}
              </p>
              <button
                onClick={() => setOwnerSubmitModal({ isOpen: true, targetHostId: host.id })}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('pleaseListMyProperty')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bio Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base font-serif mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> {t('aboutAgent')} {host.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {host.bio}
              </p>

              {host.featuredQuote && (
                <blockquote className="mt-4 p-3 bg-amber-50/70 border-l-3 border-amber-500 text-slate-800 text-xs italic rounded-r-xl">
                  "{host.featuredQuote}"
                </blockquote>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{language === 'id' ? 'Bahasa:' : 'Languages:'}</span>
                  <span className="font-semibold text-slate-800">{host.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1.5">{language === 'id' ? 'Nomor HP & WhatsApp Agen:' : 'Agent Phone & WhatsApp:'}</span>
                  <PhoneRevealButton
                    phone={host.phone}
                    agentName={host.name}
                    variant="light"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">{language === 'id' ? 'Email Resmi:' : 'Official Email:'}</span>
                  <span className="font-semibold text-slate-800 font-mono">{host.email}</span>
                </div>
              </div>
            </div>

            {/* Marketing Pixels / Tags Active Status */}
            {host.plan !== 'free' && (
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  {t('activeTrackingPixels')}
                </span>
                <p className="text-xs text-slate-300">
                  {language === 'id' ? 'Website agen ini terhubung dengan tag retargeting iklan:' : 'This storefront is integrated with ad tracking tags for retargeting:'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    FB: {host.trackingTags?.facebookPixelId || 'Active'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    TikTok: {host.trackingTags?.tiktokPixelId || 'Active'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    Google: {host.trackingTags?.googleTagId || 'Active'}
                  </span>
                </div>
              </div>
            )}

            {/* Client Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm font-serif mb-4 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {t('clientReviews')} ({reviews.length})
              </h3>
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{rev.authorName}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-slate-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Properties Portfolio (Rent, Sale, Lease, Districts & Categories) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* COMPREHENSIVE FILTER & SEARCH CONTROLS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              
              {/* 1. Primary Purpose Tabs: For Sale vs Rent (Monthly & Yearly) vs All */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {/* ALL */}
                  <button
                    id="filter-purpose-all"
                    onClick={() => setSelectedPurpose('all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPurpose === 'all'
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-700/50'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>{t('all')}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedPurpose === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'}`}>
                      {hostProperties.length}
                    </span>
                  </button>

                  {/* FOR SALE */}
                  <button
                    id="filter-purpose-sale"
                    onClick={() => setSelectedPurpose('sale')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPurpose === 'sale'
                        ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400 font-extrabold'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{language === 'id' ? 'Dijual (For Sale)' : 'For Sale'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedPurpose === 'sale' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-900'}`}>
                      {saleCount}
                    </span>
                  </button>

                  {/* FOR RENT - ALL */}
                  <button
                    id="filter-purpose-rent"
                    onClick={() => setSelectedPurpose('rent_all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPurpose === 'rent_all'
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{language === 'id' ? 'Semua Sewa' : 'All Rentals'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedPurpose === 'rent_all' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-200/70 text-emerald-800'}`}>
                      {rentAllCount}
                    </span>
                  </button>

                  {/* FOR RENT - MONTHLY */}
                  <button
                    id="filter-purpose-rent-monthly"
                    onClick={() => setSelectedPurpose('rent_monthly')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPurpose === 'rent_monthly'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs ring-2 ring-emerald-400 font-extrabold'
                        : 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    <span>📅</span>
                    <span>{language === 'id' ? 'Sewa Bulanan' : 'Monthly Rent'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedPurpose === 'rent_monthly' ? 'bg-emerald-600 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
                      {rentMonthlyCount}
                    </span>
                  </button>

                  {/* FOR RENT - YEARLY */}
                  <button
                    id="filter-purpose-rent-yearly"
                    onClick={() => setSelectedPurpose('rent_yearly')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPurpose === 'rent_yearly'
                        ? 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-500 font-extrabold'
                        : 'bg-teal-50 text-teal-900 hover:bg-teal-100'
                    }`}
                  >
                    <span>🗓️</span>
                    <span>{language === 'id' ? 'Sewa Tahunan' : 'Yearly Rent'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedPurpose === 'rent_yearly' ? 'bg-teal-700 text-teal-100' : 'bg-teal-200 text-teal-900'}`}>
                      {rentYearlyCount}
                    </span>
                  </button>

                  {/* LEASE */}
                  {leaseCount > 0 && (
                    <button
                      id="filter-purpose-lease"
                      onClick={() => setSelectedPurpose('lease')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedPurpose === 'lease'
                          ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500'
                          : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t('forLease')}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedPurpose === 'lease' ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-200/70 text-indigo-800'}`}>
                        {leaseCount}
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAiDescriptionModal({
                      isOpen: true,
                      initialData: {
                        city: host.location?.split(',')[0] || 'Bali',
                        area: availableDistricts[0]?.name || 'Canggu',
                        agentName: host.name,
                        agentPhone: host.whatsapp || host.phone
                      }
                    })}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500/15 to-indigo-600/15 hover:from-amber-500/25 hover:to-indigo-600/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0"
                    title="Generate professional property descriptions using Gemini AI"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{language === 'id' ? 'AI Magic Copy' : 'AI Description Studio'}</span>
                  </button>
                </div>
              </div>

              {/* 2. LOCATION BY DISTRICT FILTER (e.g. Canggu, Kuta, Ubud, Seminyak, Uluwatu, SCBD) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t('filterByDistrict')}</span>
                  </div>
                  {selectedDistrict !== 'all' && (
                    <button
                      onClick={() => setSelectedDistrict('all')}
                      className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                    >
                      {t('allDistricts')}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    id="district-pill-all"
                    onClick={() => setSelectedDistrict('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedDistrict === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{t('allDistricts')}</span>
                    <span className="text-[10px] opacity-75 font-mono">({hostProperties.length})</span>
                  </button>

                  {availableDistricts.map(dist => (
                    <button
                      key={dist.name}
                      id={`district-pill-${dist.name.toLowerCase()}`}
                      onClick={() => setSelectedDistrict(dist.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        selectedDistrict.toLowerCase() === dist.name.toLowerCase()
                          ? 'bg-slate-900 text-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{dist.name}</span>
                      <span className={`text-[10px] font-mono px-1 rounded ${selectedDistrict.toLowerCase() === dist.name.toLowerCase() ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-600'}`}>
                        {dist.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. PROPERTY CATEGORY FILTER: Land, Ruko, House, Villa, Apartment, Business, Warehouse, Kost, Hotel Room */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{t('filterByCategory')}</span>
                  </div>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                    >
                      {t('allCategories')}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    id="category-pill-all"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t('allCategories')}
                  </button>

                  {[
                    { id: 'land', labelId: 'Tanah', labelEn: 'Land', icon: '🏝️' },
                    { id: 'ruko', labelId: 'Ruko', labelEn: 'Ruko / Shophouse', icon: '🏢' },
                    { id: 'house', labelId: 'Rumah', labelEn: 'House', icon: '🏡' },
                    { id: 'villa', labelId: 'Villa', labelEn: 'Villa', icon: '🌺' },
                    { id: 'apartment', labelId: 'Apartemen', labelEn: 'Apartment', icon: '🏬' },
                    { id: 'business', labelId: 'Bisnis & Usaha', labelEn: 'Business', icon: '💼' },
                    { id: 'warehouse', labelId: 'Gudang', labelEn: 'Warehouse', icon: '🏭' },
                    { id: 'kost', labelId: 'Kost', labelEn: 'Kost / Coliving', icon: '🛏️' },
                    { id: 'hotel_room', labelId: 'Kamar Hotel', labelEn: 'Hotel Room', icon: '🏨' },
                    { id: 'commercial', labelId: 'Komersial', labelEn: 'Commercial', icon: '🏬' },
                    { id: 'beachfront', labelId: 'Beachfront', labelEn: 'Beachfront', icon: '🌊' },
                    { id: 'penthouse', labelId: 'Penthouse', labelEn: 'Penthouse', icon: '✨' }
                  ]
                    .filter(cat => availableCategories.has(cat.id) || selectedCategory === cat.id)
                    .map(cat => {
                      const count = availableCategories.get(cat.id) || 0;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          id={`category-pill-${cat.id}`}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/40'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span className="text-xs">{cat.icon}</span>
                          <span>{language === 'id' ? cat.labelId : cat.labelEn}</span>
                          <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* 4. KEYWORD SEARCH & PRICE SORT BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 border-t border-slate-100">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchByKeyword')}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                    >
                      <option value="default">{t('priceDefault')}</option>
                      <option value="price-asc">{t('priceLowToHigh')}</option>
                      <option value="price-desc">{t('priceHighToLow')}</option>
                    </select>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 5. ACTIVE FILTER CHIPS STRIP & RESULTS SUMMARY */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-400 text-[11px] font-medium">{t('activeFiltersLabel')}</span>

                    {selectedServiceType !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                        {selectedServiceType === 'rent' ? t('forRent') : selectedServiceType === 'sale' ? t('forSale') : t('forLease')}
                        <button onClick={() => setSelectedServiceType('all')} className="hover:text-amber-400 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {selectedDistrict !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                        <MapPin className="w-3 h-3 text-rose-500" /> {selectedDistrict}
                        <button onClick={() => setSelectedDistrict('all')} className="hover:text-rose-900 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                        <Building className="w-3 h-3 text-indigo-500" /> {selectedCategory}
                        <button onClick={() => setSelectedCategory('all')} className="hover:text-indigo-900 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                        "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="hover:text-amber-950 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">
                      {t('showingResults')} <strong className="text-slate-900 font-bold">{filteredProperties.length}</strong> {t('propertiesCount')}
                    </span>
                    <button
                      onClick={resetFilters}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
                    >
                      {t('resetFilters')}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* LISTINGS GRID */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm font-serif">
                  {t('noPropertiesFound')}
                </h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  {t('tryAdjustingFilters')}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('resetFilters')}
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => navigate('/list-property')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      + {t('addNewListing')}
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* QR Code Share Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg font-serif">
              {language === 'id' ? `Scan untuk Kunjungi Website ${host.name}` : `Scan to Visit ${host.name}'s Website`}
            </h3>
            <p className="text-xs text-amber-400 mt-1 mb-4 font-mono">
              proplis.com/{host.slug}
            </p>

            <div className="bg-slate-950 p-5 rounded-2xl inline-block shadow-inner mx-auto border border-slate-800">
              <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}`}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              {language === 'id' ? 'Arahkan kamera smartphone Anda untuk membuka website pribadi agen ini secara langsung.' : 'Point your smartphone camera to open this private website directly.'}
            </p>

            <button
              onClick={() => setQrModalOpen(false)}
              className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
