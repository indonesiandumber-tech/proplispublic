import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  DollarSign, 
  KeyRound, 
  FileText, 
  PlusCircle, 
  ExternalLink, 
  Settings, 
  MessageSquare, 
  Eye, 
  Trash2, 
  Edit3, 
  Check, 
  Copy,
  Sparkles,
  ShieldCheck,
  Globe,
  Building2,
  Crown,
  Zap,
  Tag,
  Video,
  RefreshCw,
  Phone,
  Mail,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice, formatExactPrice } from '../utils/currency';
import { OwnerSubmission } from '../types';
import { PRESET_AVATARS, PRESET_COVERS } from './modals/PhotoPickerModal';

export const HostDashboard: React.FC = () => {
  const { 
    activeUserHost, 
    properties, 
    bookings, 
    inquiries, 
    ownerSubmissions,
    currency, 
    navigate, 
    updateHostProfile, 
    updateHostTrackingTags,
    updateOwnerSubmissionStatus,
    convertOwnerSubmissionToListing,
    deleteProperty,
    updateProperty,
    setPlanUpgradeModal,
    setCreateAgentModal,
    setPhotoPickerModal,
    setAiDescriptionModal,
    showToast,
    t,
    language,
    localizedPlans
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'pipeline' | 'inquiries' | 'marketing' | 'settings'>('listings');
  const [copiedLink, setCopiedLink] = useState(false);

  // Settings form state
  const [name, setName] = useState(activeUserHost?.name || '');
  const [slug, setSlug] = useState(activeUserHost?.slug || '');
  const [title, setTitle] = useState(activeUserHost?.title || '');
  const [agency, setAgency] = useState(activeUserHost?.agency || '');
  const [phone, setPhone] = useState(activeUserHost?.phone || '');
  const [whatsapp, setWhatsapp] = useState(activeUserHost?.whatsapp || '');
  const [bio, setBio] = useState(activeUserHost?.bio || '');
  const [avatar, setAvatar] = useState(activeUserHost?.avatar || '');
  const [coverImage, setCoverImage] = useState(activeUserHost?.coverImage || '');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever activeUserHost changes
  useEffect(() => {
    if (activeUserHost) {
      setName(activeUserHost.name || '');
      setSlug(activeUserHost.slug || '');
      setTitle(activeUserHost.title || '');
      setAgency(activeUserHost.agency || '');
      setPhone(activeUserHost.phone || '');
      setWhatsapp(activeUserHost.whatsapp || '');
      setBio(activeUserHost.bio || '');
      setAvatar(activeUserHost.avatar || '');
      setCoverImage(activeUserHost.coverImage || '');
      setFacebookPixelId(activeUserHost.trackingTags?.facebookPixelId || '');
      setTiktokPixelId(activeUserHost.trackingTags?.tiktokPixelId || '');
      setGoogleTagId(activeUserHost.trackingTags?.googleTagId || '');
    }
  }, [activeUserHost]);

  // Marketing Tags Form
  const [facebookPixelId, setFacebookPixelId] = useState(activeUserHost?.trackingTags?.facebookPixelId || 'FB-98827361');
  const [tiktokPixelId, setTiktokPixelId] = useState(activeUserHost?.trackingTags?.tiktokPixelId || 'TT-44589210');
  const [googleTagId, setGoogleTagId] = useState(activeUserHost?.trackingTags?.googleTagId || 'GTM-PROP772');

  if (!activeUserHost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-white">{t('agentCrmAccountRequired')}</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2">
          {language === 'id' 
            ? 'Pilih profil agen dari menu atas atau buat website pribadi Anda untuk membuka portal CRM agen.' 
            : 'Select an agent profile from the header or create your own private real estate website to access the CRM portal.'}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setCreateAgentModal({ isOpen: true, preselectedTier: 'starter' })}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
          >
            + {t('createAgentWeb')}
          </button>
        </div>
      </div>
    );
  }

  const hostProperties = properties.filter(p => p.hostId === activeUserHost.id);
  const hostInquiries = inquiries.filter(i => i.hostId === activeUserHost.id);
  const hostSubmissions = ownerSubmissions.filter(s => s.hostId === activeUserHost.id);

  const planCfg = localizedPlans[activeUserHost.plan || 'starter'];
  const isUnlimited = activeUserHost.plan === 'elite' || activeUserHost.plan === 'pro';
  const isGrowth = activeUserHost.plan === 'growth';
  const isStarter = activeUserHost.plan === 'starter' || activeUserHost.plan === 'free';
  const listingCap = planCfg.listingLimit;
  const usedCount = hostProperties.length;
  const isAtLimit = !isUnlimited && usedCount >= listingCap;
  const usagePercent = isUnlimited ? 20 : Math.min(100, Math.round((usedCount / listingCap) * 100));

  const publicUrl = `https://proplis.com/${activeUserHost.slug}`;

  const copyStorefrontLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    showToast(`Storefront link copied: ${publicUrl}`, 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleFileUploadLocal = (file: File, type: 'avatar' | 'cover') => {
    if (!file.type.startsWith('image/')) {
      showToast(language === 'id' ? 'Silakan pilih file gambar (JPG, PNG, WebP).' : 'Please select an image file (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast(language === 'id' ? 'Ukuran file maksimal 8MB.' : 'Maximum file size is 8MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        if (type === 'avatar') {
          setAvatar(dataUrl);
          updateHostProfile(activeUserHost.id, { avatar: dataUrl });
        } else {
          setCoverImage(dataUrl);
          updateHostProfile(activeUserHost.id, { coverImage: dataUrl });
        }
        showToast(language === 'id' ? 'Foto berhasil diperbarui dan disimpan!' : 'Photo updated and saved!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateHostProfile(activeUserHost.id, {
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      title,
      agency,
      phone,
      whatsapp,
      bio,
      avatar,
      coverImage
    });
    showToast(t('photoUpdatedSuccess') || 'Storefront settings saved successfully!', 'success');
  };

  const handleSaveMarketingTags = (e: React.FormEvent) => {
    e.preventDefault();
    updateHostTrackingTags(activeUserHost.id, {
      facebookPixelId: facebookPixelId.trim(),
      tiktokPixelId: tiktokPixelId.trim(),
      googleTagId: googleTagId.trim()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP HEADER & ACTIVE PLAN BADGE */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800">
        
        {/* Cover Photo Background with overlay */}
        {activeUserHost.coverImage && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={activeUserHost.coverImage}
              alt="Cover background"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80" />
          </div>
        )}

        {/* Change Cover Photo floating button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setPhotoPickerModal({ isOpen: true, initialTab: 'cover', hostId: activeUserHost.id })}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-[11px] font-bold text-slate-200 border border-slate-700/80 backdrop-blur-sm flex items-center gap-1.5 cursor-pointer shadow-md hover:text-amber-400 transition-all"
            title={t('changeHeaderCover')}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('changeHeaderCover')}</span>
          </button>
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Agent Info */}
          <div className="flex items-center gap-4">
            <div 
              className="relative group cursor-pointer"
              onClick={() => setPhotoPickerModal({ isOpen: true, initialTab: 'avatar', hostId: activeUserHost.id })}
              title={t('changeProfilePhoto')}
            >
              <img
                src={activeUserHost.avatar}
                alt={activeUserHost.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-white transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all text-white">
                <Camera className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] font-bold mt-0.5">Edit</span>
              </div>
              {activeUserHost.plan === 'pro' && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full text-white shadow-md z-10">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {activeUserHost.name}
                </h1>
                <span className="text-xs font-mono font-bold bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  proplis.com/{activeUserHost.slug}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                {activeUserHost.title} • {activeUserHost.agency}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <button
                  onClick={() => navigate(`/${activeUserHost.slug}`)}
                  className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  Open Live Website <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={copyStorefrontLink}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded-md text-slate-300 transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy URL'}</span>
                </button>
                <button
                  onClick={() => setPhotoPickerModal({ isOpen: true, initialTab: 'avatar', hostId: activeUserHost.id })}
                  className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>{t('changeProfilePhoto')}</span>
                </button>
              </div>
            </div>
          </div>

        {/* Current Plan Card & Upgrade Trigger */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="text-left w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Plan:</span>
              <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-md ${
                isUnlimited 
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-700' 
                  : isGrowth 
                  ? 'bg-amber-950 text-amber-300 border border-amber-700' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {planCfg.name} ({planCfg.priceFormatted})
              </span>
            </div>

            {/* Quota Gauge */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Listings Used:</span>
                <span className="text-white font-bold">
                  {isUnlimited ? `${usedCount} (Unlimited)` : `${usedCount} / ${listingCap}`}
                </span>
              </div>
              <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    isAtLimit ? 'bg-rose-500' : isUnlimited ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setPlanUpgradeModal({ isOpen: true, preselectedTier: activeUserHost.plan })}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer shrink-0"
          >
            {isUnlimited ? 'Manage Agency Elite' : isGrowth ? 'Upgrade to Agency Elite' : 'Upgrade Plan (Growth / Elite)'}
          </button>
        </div>

        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Properties
          </span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{hostProperties.length}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isUnlimited ? 'Unlimited Pro plan' : `${listingCap - usedCount} remaining in tier`}
          </span>
        </div>

        {/* Owner Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Owner Submissions
          </span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{hostSubmissions.length}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className={`text-[11px] font-semibold mt-1 block ${activeUserHost.enableOwnerSubmission ? 'text-indigo-600' : 'text-slate-400'}`}>
            {activeUserHost.enableOwnerSubmission ? 'Pro intake pipeline active' : 'Pro tier unlocks owner intake'}
          </span>
        </div>

        {/* Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Buyer Inquiries
          </span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{hostInquiries.length}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {activeUserHost.whatsappEnabled ? 'Direct WhatsApp linked' : 'Direct Messages active'}
          </span>
        </div>

        {/* Ad Tracking */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Marketing Pixel Tags
          </span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-slate-900">
              {activeUserHost.plan !== 'free' ? '3/3' : '0/3'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {activeUserHost.plan !== 'free' ? 'FB, TikTok & Google Tags' : 'Starter/Pro only'}
          </span>
        </div>

      </div>

      {/* 3. CRM TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'listings' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>My Listings ({hostProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'pipeline' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Owner Submissions ({hostSubmissions.length})</span>
          {hostSubmissions.some(s => s.status === 'new') && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inquiries' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Buyer Leads ({hostInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'marketing' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Ad Pixel Tags</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Storefront Settings</span>
        </button>
      </div>

      {/* 4. TAB 1: LISTINGS INVENTORY */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">
                Property Inventory ({hostProperties.length} listings)
              </h3>
              <p className="text-xs text-slate-500">
                {isUnlimited 
                  ? 'Your Pro plan has Unlimited listings.' 
                  : `Plan tier limit: ${usedCount} / ${listingCap} used.`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAiDescriptionModal({
                  isOpen: true,
                  initialData: {
                    city: activeUserHost.location?.split(',')[0] || 'Bali',
                    area: 'Canggu',
                    agentName: activeUserHost.name,
                    agentPhone: activeUserHost.whatsapp || activeUserHost.phone
                  }
                })}
                className="px-3.5 py-2 bg-gradient-to-r from-indigo-50 to-amber-50 hover:from-indigo-100 hover:to-amber-100 text-indigo-900 border border-indigo-200 font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Description Studio</span>
              </button>

              <button
                onClick={() => {
                  if (isAtLimit) {
                    showToast(`You have reached your ${listingCap} listing limit. Upgrade your plan to add more.`, 'error');
                    setPlanUpgradeModal({ isOpen: true, preselectedTier: 'starter' });
                  } else {
                    navigate('/list-property');
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Listing</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {hostProperties.map(property => {
                const isMonthlyRent = property.serviceType === 'rent' && (
                  property.pricePeriod === 'month' || 
                  property.rentDurationPeriod === 'monthly' || 
                  (!property.rentDurationPeriod && property.pricePeriod !== 'year')
                );
                const isYearlyRent = (property.serviceType === 'rent' && (property.pricePeriod === 'year' || property.rentDurationPeriod === 'yearly')) || property.serviceType === 'lease';
                
                return (
                  <div key={property.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={property.featuredImage}
                        alt={property.title}
                        className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {property.serviceType === 'sale' ? (
                            <span className="px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-white bg-amber-600">
                              For Sale (Dijual)
                            </span>
                          ) : isMonthlyRent ? (
                            <span className="px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-white bg-emerald-600">
                              Sewa Bulanan (Monthly)
                            </span>
                          ) : isYearlyRent ? (
                            <span className="px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-white bg-teal-600">
                              Sewa Tahunan (Yearly)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-white bg-indigo-600">
                              For {property.serviceType}
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 capitalize">
                            {property.category}
                          </span>

                          <span className="text-xs text-slate-500 font-medium">
                            {property.location.area}, {property.location.city}
                          </span>

                          {property.videoUrl && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-semibold border border-amber-200 flex items-center gap-1">
                              <Video className="w-2.5 h-2.5" /> Video Tour
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {property.title}
                        </h4>
                        <p className="text-xs font-bold text-amber-600">
                          {formatPrice(
                            property.priceUSD, 
                            currency, 
                            property.serviceType === 'sale' 
                              ? 'total' 
                              : isMonthlyRent 
                              ? 'month' 
                              : isYearlyRent 
                              ? 'year' 
                              : 'night'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                      <button
                        onClick={() => setAiDescriptionModal({
                          isOpen: true,
                          initialData: {
                            draftDescription: property.description,
                            category: property.category,
                            serviceType: property.serviceType,
                            rentPeriod: isMonthlyRent ? 'monthly' : isYearlyRent ? 'yearly' : 'daily',
                            city: property.location.city,
                            area: property.location.area,
                            address: property.location.address,
                            bedrooms: property.specs?.bedrooms,
                            bathrooms: property.specs?.bathrooms,
                            buildingSize: property.specs?.buildingSizeSqm,
                            landSize: property.specs?.landSizeSqm,
                            furnishing: property.specs?.furnishing,
                            certificateType: property.specs?.certificateType,
                            amenities: property.amenities,
                            priceFormatted: formatPrice(property.priceUSD, currency, property.serviceType === 'sale' ? 'total' : isMonthlyRent ? 'month' : 'year'),
                            agentName: activeUserHost.name,
                            agentPhone: activeUserHost.whatsapp || activeUserHost.phone
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
                        className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500/15 to-indigo-600/15 hover:from-amber-500/25 hover:to-indigo-600/25 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-500/30 cursor-pointer"
                        title="Generate/Rewrite description with AI"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Copy
                      </button>

                      <button
                        onClick={() => navigate(`/${activeUserHost.slug}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        onClick={() => deleteProperty(property.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: OWNER SUBMISSIONS CRM PIPELINE (PRO PLAN FEATURE) */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase">
                <Crown className="w-3 h-3 text-amber-400" /> Growth & Agency Elite Feature
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                Owner Property Intake Pipeline
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Property owners who clicked "List Your Property" on your website submitted these listings. Review details, contact the owner via WhatsApp, and 1-click convert them into active listings!
              </p>
            </div>

            {!activeUserHost.enableOwnerSubmission && (
              <button
                onClick={() => setPlanUpgradeModal({ isOpen: true, preselectedTier: 'growth' })}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shrink-0 cursor-pointer"
              >
                Upgrade to Growth (Rp 99.000) &rarr;
              </button>
            )}
          </div>

          {hostSubmissions.length > 0 ? (
            <div className="space-y-4">
              {hostSubmissions.map((sub) => (
                <div 
                  key={sub.id} 
                  className={`bg-white rounded-2xl p-6 border shadow-xs transition-all ${
                    sub.status === 'converted' 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : sub.status === 'new' 
                      ? 'border-amber-300 ring-2 ring-amber-400/20' 
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          For {sub.serviceType.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 font-medium capitalize">
                          {sub.category} in {sub.area}, {sub.city}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          sub.status === 'new' 
                            ? 'bg-amber-100 text-amber-800' 
                            : sub.status === 'contacted' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : sub.status === 'converted' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          Status: {sub.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 font-serif">
                        {sub.propertyTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={sub.status}
                        onChange={(e) => updateOwnerSubmissionStatus(sub.id, e.target.value as any)}
                        className="text-xs bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                      >
                        <option value="new">New Submission</option>
                        <option value="contacted">Contacted Owner</option>
                        <option value="converted">Converted to Listing</option>
                        <option value="declined">Declined</option>
                      </select>

                      {sub.status !== 'converted' && (
                        <button
                          onClick={() => convertOwnerSubmissionToListing(sub.id)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>1-Click Convert to Live Listing</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submission Details Body */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                    {/* Owner details */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Property Owner Contact
                      </span>
                      <div className="font-bold text-slate-900 text-sm">{sub.ownerName}</div>
                      <div className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{sub.ownerPhone}</span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{sub.ownerEmail}</span>
                      </div>

                      <button
                        onClick={() => {
                          const text = encodeURIComponent(`Hi ${sub.ownerName}, thank you for submitting your property "${sub.propertyTitle}" to my website on Proplis. I would love to discuss representing your listing.`);
                          window.open(`https://wa.me/${sub.ownerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                        }}
                        className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp Owner</span>
                      </button>
                    </div>

                    {/* Specs & Pricing */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Valuation & Specifications
                      </span>
                      <div className="text-amber-600 font-extrabold text-sm">
                        Expected: {sub.expectedPriceFormatted || `$${sub.expectedPrice}`}
                      </div>
                      <div className="text-slate-600">
                        {sub.bedrooms} Bedrooms • {sub.bathrooms} Bathrooms
                      </div>
                      <div className="text-slate-600">
                        Building: {sub.buildingSizeSqm} m² • Land: {sub.landSizeSqm} m²
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Owner Notes & Features
                      </span>
                      <p className="text-slate-700 italic leading-relaxed line-clamp-3">
                        "{sub.description}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No owner submissions yet</p>
              <p className="max-w-sm mx-auto">
                Once property owners visit your site at <strong className="font-mono text-slate-800">proplis.com/{activeUserHost.slug}</strong> and click "List Your Property", their details will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 3: BUYER INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Buyer Leads & Inquiries ({hostInquiries.length})
            </h3>
            <span className="text-xs text-slate-500">Real-time inquiries received via storefront</span>
          </div>

          {hostInquiries.length > 0 ? (
            <div className="space-y-3">
              {hostInquiries.map(inq => (
                <div key={inq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{inq.senderName}</span>
                      <span className="text-xs text-slate-500 ml-2 font-mono">({inq.senderPhone} • {inq.senderEmail})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {inq.propertyTitle && (
                    <div className="inline-block px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-semibold border border-amber-200">
                      Property Ref: {inq.propertyTitle}
                    </div>
                  )}

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{inq.message}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`Hi ${inq.senderName}, thanks for inquiring on Proplis regarding ${inq.propertyTitle || 'my listings'}.`);
                        window.open(`https://wa.me/${inq.senderPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Reply via WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No inquiries yet. Share your website URL <strong className="font-mono text-slate-800">proplis.com/{activeUserHost.slug}</strong> to start receiving client leads.
            </div>
          )}
        </div>
      )}

      {/* 7. TAB 4: MARKETING PIXEL TAGS (STARTER & PRO) */}
      {activeTab === 'marketing' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase mb-2">
              <Tag className="w-3 h-3" /> Starter & Pro Feature
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Retargeting & Ad Pixel Tags
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Inject your tracking pixels directly into <strong className="font-mono text-slate-800">proplis.com/{activeUserHost.slug}</strong> to run Facebook, Instagram, and TikTok retargeting campaigns.
            </p>
          </div>

          <form onSubmit={handleSaveMarketingTags} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Facebook Pixel ID / Meta Tag
              </label>
              <input
                type="text"
                placeholder="e.g. FB-19283746"
                value={facebookPixelId}
                onChange={(e) => setFacebookPixelId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Tracks pageviews and WhatsApp chat clicks for Meta Ads.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                TikTok Pixel Tag ID
              </label>
              <input
                type="text"
                placeholder="e.g. TT-44589210"
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Google Analytics / Tag Manager (GTM) Tag ID
              </label>
              <input
                type="text"
                placeholder="e.g. G-ABC123XYZ or GTM-XXXXXX"
                value={googleTagId}
                onChange={(e) => setGoogleTagId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Save Tracking Tags
            </button>
          </form>
        </div>
      )}

      {/* 8. TAB 5: STOREFRONT SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="font-bold text-slate-900 text-lg font-serif mb-0.5">
                {t('brandingPhotosTitle') || 'Storefront & Branding Customization'}
              </h3>
              <p className="text-xs text-slate-500">
                {t('brandingPhotosDesc') || 'Modify your personal URL slug, profile avatar, cover photo, contact details, and bio.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPhotoPickerModal({ isOpen: true, hostId: activeUserHost.id })}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'id' ? 'Galeri Foto Lengkap' : 'Open Full Photo Gallery'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            
            {/* BRANDING PHOTOS SECTION */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>{t('brandingPhotosTitle')}</span>
              </h4>

              {/* A. Header Cover Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    {t('headerCover')}
                  </label>
                  <span className="text-[11px] text-slate-400">Rekomendasi: 1600 x 400px</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 h-32 w-full group">
                  <img
                    src={coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}
                    alt="Header Cover"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-slate-100"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('uploadFromDevice')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoPickerModal({ isOpen: true, initialTab: 'cover', hostId: activeUserHost.id })}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-amber-400"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{language === 'id' ? 'Pilih Koleksi' : 'Presets'}</span>
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUploadLocal(file, 'cover');
                  }}
                />

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://... atau paste URL gambar header langsung"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] flex items-center gap-1 border border-slate-300 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('uploadFromDevice')}</span>
                  </button>
                </div>

                {/* Quick Cover Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Preset Cepat:</span>
                  {PRESET_COVERS.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setCoverImage(p.url);
                        updateHostProfile(activeUserHost.id, { coverImage: p.url });
                        showToast(t('photoUpdatedSuccess') || 'Cover photo updated!', 'success');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        coverImage === p.url
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* B. Profile Avatar */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    {t('profileAvatar')}
                  </label>
                  <span className="text-[11px] text-slate-400">Rekomendasi: 400 x 400px (1:1)</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <img
                      src={avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-white"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Upload</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUploadLocal(file, 'avatar');
                    }}
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://... atau paste URL gambar avatar"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="flex-1 p-2 border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] flex items-center gap-1 border border-slate-300 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t('uploadFromDevice')}</span>
                      </button>
                    </div>

                    {/* Quick Avatar Presets */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Preset Cepat:</span>
                      {PRESET_AVATARS.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setAvatar(p.url);
                            updateHostProfile(activeUserHost.id, { avatar: p.url });
                            showToast(t('photoUpdatedSuccess') || 'Avatar updated!', 'success');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            avatar === p.url
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {p.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Custom URL Slug *</label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                <span className="bg-slate-100 px-3 py-2 text-slate-600 font-mono font-bold border-r border-slate-300">
                  proplis.com/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2 font-mono font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Full Agent / Host Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Agency Affiliation</label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Direct Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">WhatsApp Number (For instant chat link)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">About Me / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              Save Storefront Settings
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
