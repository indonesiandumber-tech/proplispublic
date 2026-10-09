import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  Share2, 
  Building2, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Tag, 
  FileText, 
  Zap, 
  Send,
  Search,
  Megaphone,
  Smile,
  Globe,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { PropertyCategory, ServiceType } from '../../types';
import { 
  generatePropertyDescriptionAI, 
  AIDescriptionInput, 
  AIGeneratedResult, 
  AITone, 
  AILanguage 
} from '../../utils/aiDescriptionGenerator';
import { useApp } from '../../context/AppContext';

interface AIDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AIDescriptionInput>;
  onApply?: (title: string, tagline: string, description: string) => void;
}

const CATEGORIES: { id: PropertyCategory; labelId: string; labelEn: string; icon: string }[] = [
  { id: 'land', labelId: 'Tanah (Land)', labelEn: 'Land', icon: '🏝️' },
  { id: 'ruko', labelId: 'Ruko / Shophouse', labelEn: 'Ruko', icon: '🏢' },
  { id: 'house', labelId: 'Rumah (House)', labelEn: 'House', icon: '🏡' },
  { id: 'villa', labelId: 'Villa', labelEn: 'Villa', icon: '🌺' },
  { id: 'apartment', labelId: 'Apartemen', labelEn: 'Apartment', icon: '🏬' },
  { id: 'business', labelId: 'Bisnis / Komersial', labelEn: 'Business', icon: '💼' },
  { id: 'warehouse', labelId: 'Gudang (Warehouse)', labelEn: 'Warehouse', icon: '🏭' },
  { id: 'kost', labelId: 'Kost / Coliving', labelEn: 'Kost', icon: '🛏️' },
  { id: 'hotel_room', labelId: 'Kamar Hotel / Resort', labelEn: 'Hotel Room', icon: '🏨' },
];

const QUICK_TAGS = [
  'SHM Ready & Clean',
  'Bebas Banjir 100%',
  'Jalan Lebar 2 Mobil',
  'Fully Furnished Mewah',
  'Passive Income Tinggi',
  'Dekat Tol & Mall',
  'Akses Kontainer 40ft',
  'Private Swimming Pool',
  'Siap Huni Langsung',
  'Dekat Kampus & Kantor'
];

export const AIDescriptionModal: React.FC<AIDescriptionModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onApply
}) => {
  const { language, activeUserHost, showToast } = useApp();

  // Agent Raw Draft Input first
  const [draftDescription, setDraftDescription] = useState<string>(
    initialData?.draftDescription || ''
  );

  // New User Options: Emojis, SEO Friendly, Google Ads Ready
  const [useEmojis, setUseEmojis] = useState<boolean>(
    initialData?.useEmojis !== undefined ? initialData.useEmojis : true
  );
  const [seoFriendly, setSeoFriendly] = useState<boolean>(
    initialData?.seoFriendly !== undefined ? initialData.seoFriendly : true
  );
  const [googleAdsReady, setGoogleAdsReady] = useState<boolean>(
    initialData?.googleAdsReady !== undefined ? initialData.googleAdsReady : true
  );

  // Listing Specifications
  const [category, setCategory] = useState<PropertyCategory>(initialData?.category || 'villa');
  const [serviceType, setServiceType] = useState<ServiceType>(initialData?.serviceType || 'rent');
  const [rentPeriod, setRentPeriod] = useState<'monthly' | 'yearly' | 'daily'>(initialData?.rentPeriod || 'monthly');
  const [city, setCity] = useState(initialData?.city || 'Bali');
  const [area, setArea] = useState(initialData?.area || 'Canggu');
  const [address, setAddress] = useState(initialData?.address || '');
  const [priceFormatted, setPriceFormatted] = useState(initialData?.priceFormatted || 'Rp 25.000.000 / bln');
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || 3);
  const [buildingSize, setBuildingSize] = useState(initialData?.buildingSize || 200);
  const [landSize, setLandSize] = useState(initialData?.landSize || 300);
  const [floors, setFloors] = useState(initialData?.floors || 2);
  const [furnishing, setFurnishing] = useState(initialData?.furnishing || 'Fully Furnished');
  const [certificateType, setCertificateType] = useState(initialData?.certificateType || 'SHM (Freehold)');
  
  const [tone, setTone] = useState<AITone>(initialData?.tone || 'luxury');
  const [selectedLanguage, setSelectedLanguage] = useState<AILanguage>(initialData?.language || (language === 'id' ? 'id' : 'en'));
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.keywords || ['SHM Ready & Clean', 'Fully Furnished Mewah']);
  const [customKeyword, setCustomKeyword] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<AIGeneratedResult | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'description' | 'seo' | 'googleAds' | 'whatsapp' | 'social'>('description');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePreFillDraft = () => {
    const purposeText = serviceType === 'rent' 
      ? `Sewa ${rentPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}` 
      : 'Dijual SHM';
    const prefill = `${category.toUpperCase()} di ${area}, ${city}. ${purposeText} harga ${priceFormatted}. ${bedrooms} KT, ${bathrooms} KM, LB ${buildingSize}m2 / LT ${landSize}m2. ${furnishing}, ${certificateType}. Fasilitas: ${selectedTags.join(', ')}. Lingkungan aman, akses mobil luas, siap huni.`;
    setDraftDescription(prefill);
    showToast(language === 'id' ? 'Draf awal diisi dari spesifikasi listing!' : 'Draft populated from listing specs!', 'info');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePropertyDescriptionAI({
        draftDescription,
        useEmojis,
        seoFriendly,
        googleAdsReady,
        category,
        serviceType,
        rentPeriod: serviceType === 'rent' ? rentPeriod : undefined,
        city,
        area,
        address,
        priceFormatted,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        buildingSize: Number(buildingSize),
        landSize: Number(landSize),
        floors: Number(floors),
        furnishing,
        certificateType,
        amenities: selectedTags,
        keywords: selectedTags,
        tone,
        language: selectedLanguage,
        agentName: activeUserHost?.name || 'Agent Proplis',
        agentPhone: activeUserHost?.whatsapp || activeUserHost?.phone || '+62 812-8899-4455'
      });
      setGeneratedResult(result);
      showToast(
        language === 'id' 
          ? `Draf berhasil dipoles AI (${result.source === 'gemini' ? 'Gemini 3.8 Flash' : 'AI Copy Engine'})!` 
          : `AI polished description generated successfully (${result.source === 'gemini' ? 'Gemini 3.8 Flash' : 'AI Copy Engine'})!`, 
        'success'
      );
    } catch (err) {
      showToast('Failed to generate description', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(language === 'id' ? 'Teks berhasil disalin ke clipboard!' : 'Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyToForm = () => {
    if (generatedResult && onApply) {
      onApply(generatedResult.title, generatedResult.tagline, generatedResult.description);
      showToast(language === 'id' ? 'Deskripsi AI berhasil diterapkan ke formulir listing!' : 'AI text applied to listing!', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 my-auto overflow-hidden">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif">
                  {language === 'id' ? 'AI Description & Polish Studio' : 'AI Description & Polish Studio'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Gemini Flash + SEO & Ads
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'id' 
                  ? 'Tulis draf kasar Anda terlebih dahulu, lalu biarkan AI memolesnya dengan opsi Emoji, SEO Friendly, dan Google Ads Ready' 
                  : 'Draft your notes first, then let AI polish it with Emoji toggle, SEO Friendly meta & Google Ads Ready copy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[78vh] overflow-y-auto">
          
          {/* Left Column: Draft Input & Parameters (5 cols) */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4 bg-slate-950/60">
            
            {/* Step 1: Agent Draft First */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'id' ? '1. Draf / Catatan Awal Anda' : '1. Your Initial Draft / Notes'}
                </label>
                <button
                  type="button"
                  onClick={handlePreFillDraft}
                  className="text-[10px] text-slate-400 hover:text-amber-300 underline cursor-pointer transition-colors"
                >
                  {language === 'id' ? '✨ Isi Otomatis dari Spesifikasi' : '✨ Pre-fill from specs'}
                </button>
              </div>
              <textarea
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                rows={4}
                placeholder={
                  language === 'id' 
                    ? 'Tulis draf atau poin bebas Anda di sini...\nContoh: 3 KT di Canggu dekat pantai 500m, pool besar, SHM, sewa bulanan 35jt, cocok untuk expat dan digital nomad, full furnished tinggal bawa koper.'
                    : 'Write your raw draft or bullet points here...\ne.g. 3 BR pool villa in Canggu 500m to beach, SHM freehold, monthly rental 35M IDR, perfect for expats and digital nomads, turnkey furnished.'
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{language === 'id' ? '💡 AI akan memoles & menyempurnakan tulisan ini' : '💡 AI will polish & elevate your notes'}</span>
                <span>{draftDescription.length} karakter</span>
              </p>
            </div>

            {/* Step 2: Three Core Feature Toggles: Emoji, SEO, Google Ads */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                {language === 'id' ? '2. Opsi Output Kustomisasi' : '2. Output Customization Options'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Emoji toggle */}
                <button
                  type="button"
                  onClick={() => setUseEmojis(!useEmojis)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    useEmojis
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smile className={`w-4 h-4 ${useEmojis ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-[11px]">{language === 'id' ? 'Gunakan Emoji' : 'Use Emoji'}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${useEmojis ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-500'}`}>
                    {useEmojis ? 'ON 😃' : 'OFF'}
                  </span>
                </button>

                {/* SEO Friendly toggle */}
                <button
                  type="button"
                  onClick={() => setSeoFriendly(!seoFriendly)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    seoFriendly
                      ? 'bg-indigo-500/15 border-indigo-500/60 text-indigo-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Search className={`w-4 h-4 ${seoFriendly ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[11px]">SEO Friendly</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${seoFriendly ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-500'}`}>
                    {seoFriendly ? 'ON 🔍' : 'OFF'}
                  </span>
                </button>

                {/* Google Ads Ready toggle */}
                <button
                  type="button"
                  onClick={() => setGoogleAdsReady(!googleAdsReady)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    googleAdsReady
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Megaphone className={`w-4 h-4 ${googleAdsReady ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[11px]">Google Ads</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${googleAdsReady ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'}`}>
                    {googleAdsReady ? 'ON 📢' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Step 3: Property Category Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'id' ? '3. Kategori Properti' : '3. Property Category'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl text-[11px] font-semibold text-left transition-all border cursor-pointer flex items-center gap-1.5 ${
                      category === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span className="truncate">{language === 'id' ? cat.labelId.split(' ')[0] : cat.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Listing Purpose & Rent Separation */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'id' ? '4. Tujuan Listing & Periode' : '4. Listing Purpose & Period'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setServiceType('sale')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all ${
                    serviceType === 'sale'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {language === 'id' ? '🏷️ Dijual (For Sale)' : '🏷️ For Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType('rent')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all ${
                    serviceType === 'rent'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-extrabold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {language === 'id' ? '🔑 Disewa (For Rent)' : '🔑 For Rent'}
                </button>
              </div>

              {/* Sub-selector if Rent: Monthly vs Yearly */}
              {serviceType === 'rent' && (
                <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-1">
                  <span className="text-[10px] text-slate-400 font-medium pl-1">
                    {language === 'id' ? 'Periode Sewa:' : 'Rent Period:'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setRentPeriod('monthly')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        rentPeriod === 'monthly'
                          ? 'bg-emerald-500 text-slate-950 font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'id' ? '📅 Sewa Bulanan' : '📅 Monthly'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentPeriod('yearly')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        rentPeriod === 'yearly'
                          ? 'bg-indigo-500 text-white font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'id' ? '🗓️ Sewa Tahunan' : '🗓️ Yearly'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Location & Target Price */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'Kota' : 'City'}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'Area / Distrik' : 'District'}</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'Harga Taksiran' : 'Target Price'}</label>
              <input
                type="text"
                value={priceFormatted}
                onChange={(e) => setPriceFormatted(e.target.value)}
                placeholder="Contoh: Rp 25.000.000 / bln atau Rp 3,5 Milyar"
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Specs Quick Fields */}
            {category !== 'land' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'K. Tidur' : 'Beds'}</label>
                  <input
                    type="number"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'K. Mandi' : 'Baths'}</label>
                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'LB (m²)' : 'Building'}</label>
                  <input
                    type="number"
                    min="0"
                    value={buildingSize}
                    onChange={(e) => setBuildingSize(Number(e.target.value))}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Tone & Language Selectors */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'Gaya Penulisan (Tone)' : 'Tone Style'}</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as AITone)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="luxury">💎 Mewah & Eksklusif</option>
                  <option value="investment">📈 High ROI & Investasi</option>
                  <option value="family">🏡 Nyaman & Keluarga</option>
                  <option value="commercial">💼 Bisnis & Strategis</option>
                  <option value="expat">🌴 Expat & Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'Bahasa Output' : 'Output Language'}</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as AILanguage)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="id">🇮🇩 Bahasa Indonesia</option>
                  <option value="en">🇬🇧 English (International)</option>
                  <option value="bilingual">🌐 Bilingual (ID + EN)</option>
                </select>
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">{language === 'id' ? 'Poin Keunggulan (Tags)' : 'Standout Tags'}</label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {QUICK_TAGS.map(t => {
                  const isSel = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {isSel ? '✓ ' : '+ '} {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-slate-950 font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'id' ? 'AI Sedang Memoles Deskripsi...' : 'AI is Polishing Description...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {draftDescription.trim() 
                      ? (language === 'id' ? 'Poles Draf Saya Sekarang (Polish Draft)' : 'Polish My Draft with AI') 
                      : (language === 'id' ? 'Generate & Tulis Otomatis dengan AI' : 'Generate Description with AI')}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Generated Output & Multi-format Views (7 cols) */}
          <div className="lg:col-span-7 p-5 flex flex-col justify-between bg-slate-900/60">
            {generatedResult ? (
              <div className="space-y-4">
                
                {/* Output Navigation Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveOutputTab('description')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      activeOutputTab === 'description'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{language === 'id' ? '✨ Deskripsi Terpoles' : '✨ Polished Description'}</span>
                  </button>

                  {seoFriendly && (
                    <button
                      type="button"
                      onClick={() => setActiveOutputTab('seo')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        activeOutputTab === 'seo'
                          ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>SEO Friendly</span>
                    </button>
                  )}

                  {googleAdsReady && (
                    <button
                      type="button"
                      onClick={() => setActiveOutputTab('googleAds')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        activeOutputTab === 'googleAds'
                          ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Google Ads</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveOutputTab('whatsapp')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      activeOutputTab === 'whatsapp'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveOutputTab('social')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      activeOutputTab === 'social'
                        ? 'bg-pink-600 text-white shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Sosmed</span>
                  </button>
                </div>

                {/* Tab 1: Polished Listing Description */}
                {activeOutputTab === 'description' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
                        {language === 'id' ? 'Judul & Subjudul Listing' : 'Listing Title & Subtitle'}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{generatedResult.title}</h3>
                      <p className="text-xs text-slate-400 italic">{generatedResult.tagline}</p>
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
                        <span className="font-semibold text-slate-300">
                          {language === 'id' ? 'Deskripsi Lengkap Terpoles' : 'Full Polished Description'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {useEmojis ? '😃 Emojis: Active' : 'Clean text only'}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(generatedResult.description, 'desc')}
                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === 'desc' ? 'Tersalin' : 'Salin Deskripsi'}</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        readOnly
                        value={generatedResult.description}
                        rows={11}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 font-sans leading-relaxed focus:outline-none resize-none font-mono selection:bg-amber-500/30"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: SEO Friendly Package */}
                {activeOutputTab === 'seo' && generatedResult.seo && (
                  <div className="space-y-3">
                    {/* Google Search Mockup Snippet */}
                    <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-2">
                        <Globe className="w-3 h-3" />
                        <span>Google Search Snippet Preview</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                          <span className="text-emerald-400">proplis.com</span>
                          <span>›</span>
                          <span className="text-slate-400 truncate">listing › {generatedResult.seo.urlSlug}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                          {generatedResult.seo.titleTag}
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {generatedResult.seo.metaDescription}
                        </p>
                      </div>
                    </div>

                    {/* SEO Fields Breakdown */}
                    <div className="space-y-2.5">
                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-300">Title Tag (Ideal &lt; 60 chars)</span>
                          <span className={`font-mono text-[10px] ${generatedResult.seo.titleTag.length <= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {generatedResult.seo.titleTag.length} / 60 chars
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-white font-medium truncate">{generatedResult.seo.titleTag}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(generatedResult.seo!.titleTag, 'titleTag')}
                            className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer p-1"
                          >
                            {copiedKey === 'titleTag' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-300">Meta Description (Ideal &lt; 155 chars)</span>
                          <span className={`font-mono text-[10px] ${generatedResult.seo.metaDescription.length <= 155 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {generatedResult.seo.metaDescription.length} / 155 chars
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs text-slate-300 leading-relaxed">{generatedResult.seo.metaDescription}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(generatedResult.seo!.metaDescription, 'metaDesc')}
                            className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer p-1 shrink-0"
                          >
                            {copiedKey === 'metaDesc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-300 mb-1.5">Focus Keywords & Search Queries</div>
                        <div className="flex flex-wrap gap-1.5">
                          {generatedResult.seo.focusKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium">
                              #{kw}
                            </span>
                          ))}
                          {generatedResult.seo.secondaryKeywords.map((kw, i) => (
                            <span key={`sec-${i}`} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[11px]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Google Ads Ready Copy */}
                {activeOutputTab === 'googleAds' && generatedResult.googleAds && (
                  <div className="space-y-3">
                    {/* Visual Google Search Ad Mockup */}
                    <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                            Ad
                          </span>
                          <span className="text-[11px] text-slate-400">
                            proplis.com/{generatedResult.googleAds.displayPath1}/{generatedResult.googleAds.displayPath2}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">Google Search Ad Preview</span>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
                        {generatedResult.googleAds.headlines.slice(0, 3).join(' | ')}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {generatedResult.googleAds.descriptions.join(' ')}
                      </p>
                      
                      {/* Callout extensions */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                        {generatedResult.googleAds.callouts.map((c, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Headlines with strict 30-char counters */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Headlines (Max 30 chars each)</span>
                        <span className="text-emerald-400 text-[10px]">Strict Google limit</span>
                      </div>
                      {generatedResult.googleAds.headlines.map((hl, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[10px] font-mono text-slate-500 font-bold">H{i+1}:</span>
                            <span className="text-xs text-white truncate font-medium">{hl}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-mono ${hl.length <= 30 ? 'text-emerald-400' : 'text-red-400 font-bold'}`}>
                              {hl.length}/30
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(hl, `h-${i}`)}
                              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              {copiedKey === `h-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Descriptions with strict 90-char counters */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Descriptions (Max 90 chars each)</span>
                        <span className="text-emerald-400 text-[10px]">Strict Google limit</span>
                      </div>
                      {generatedResult.googleAds.descriptions.map((desc, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-mono text-slate-500 font-bold">Desc {i+1}:</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-mono ${desc.length <= 90 ? 'text-emerald-400' : 'text-red-400 font-bold'}`}>
                                {desc.length}/90
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(desc, `d-${i}`)}
                                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                              >
                                {copiedKey === `d-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: WhatsApp Broadcast */}
                {activeOutputTab === 'whatsapp' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {language === 'id' ? 'Format Broadcast WhatsApp' : 'WhatsApp Broadcast Copy'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedResult.whatsappBroadcast, 'wa')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'wa' ? 'Tersalin' : 'Salin Pesan WA'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={generatedResult.whatsappBroadcast}
                      rows={12}
                      className="w-full p-3 bg-slate-950 border border-emerald-900/40 rounded-2xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none resize-none"
                    />
                  </div>
                )}

                {/* Tab 5: Social Media Caption */}
                {activeOutputTab === 'social' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span className="font-semibold text-pink-400 flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" />
                        {language === 'id' ? 'Caption Instagram & TikTok' : 'Instagram & TikTok Caption'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedResult.socialCaption, 'social')}
                        className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedKey === 'social' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'social' ? 'Tersalin' : 'Salin Caption'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={generatedResult.socialCaption}
                      rows={12}
                      className="w-full p-3 bg-slate-950 border border-pink-900/40 rounded-2xl text-xs text-slate-200 font-sans leading-relaxed focus:outline-none resize-none"
                    />
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {generatedResult.source === 'gemini' 
                        ? 'Dibuat dengan Gemini 3.8 Flash' 
                        : 'Real Estate Algorithmic Engine'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onApply && (
                      <button
                        type="button"
                        onClick={handleApplyToForm}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:from-amber-400 hover:to-amber-300 cursor-pointer flex items-center gap-1.5 transition-all active:scale-98"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{language === 'id' ? 'Terapkan ke Listing Ini' : 'Apply to Listing'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              /* Empty state before generation */
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {language === 'id' ? 'Tulis Draf Anda & Poles dengan AI' : 'Draft First, Then Polish with AI'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                  {language === 'id'
                    ? 'Agen dapat menulis catatan kasar atau draf awal di kolom sebelah kiri. AI akan memoles menjadi bahasa pemasaran premium, menghasilkan paket SEO lengkap, serta teks Google Ads siap tayang.'
                    : 'Write your initial notes or rough draft in the left panel. The AI will elevate it into a luxury marketing copy, optimized SEO package, and Google Ads headlines.'}
                </p>

                <div className="grid grid-cols-3 gap-3 w-full max-w-md text-left">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                      <Smile className="w-3.5 h-3.5" />
                      <span>Emoji Option</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Pilih gaya formal bersih atau ekspresif dengan emoji properti.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                      <Search className="w-3.5 h-3.5" />
                      <span>SEO Friendly</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Title tag &lt;60 char, meta description &lt;155 char, & kata kunci.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Google Ads</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Headlines &lt;30 char dan deskripsi &lt;90 char siap pasang.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
