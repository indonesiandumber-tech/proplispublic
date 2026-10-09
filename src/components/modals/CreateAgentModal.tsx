import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentPlanTier } from '../../types';
import { 
  Sparkles, 
  X, 
  Globe, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  Check, 
  Crown, 
  ArrowRight,
  ShieldCheck,
  Camera,
  Upload
} from 'lucide-react';
import { PRESET_AVATARS, PRESET_COVERS } from './PhotoPickerModal';

export const CreateAgentModal: React.FC = () => {
  const { 
    createAgentModal, 
    setCreateAgentModal, 
    registerHost, 
    navigate,
    showToast,
    t,
    language,
    localizedPlans
  } = useApp();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState(createAgentModal.initialSlug || '');
  const [phone, setPhone] = useState('+62 812 8899 0011');
  const [whatsapp, setWhatsapp] = useState('6281288990011');
  const [email, setEmail] = useState('');
  const [agency, setAgency] = useState('Independent Real Estate Partner');
  const [location, setLocation] = useState('Bali & Jakarta, Indonesia');
  const [selectedPlan, setSelectedPlan] = useState<AgentPlanTier>(
    createAgentModal.preselectedTier || 'starter'
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string>(PRESET_AVATARS[0].url);
  const [selectedCover, setSelectedCover] = useState<string>(PRESET_COVERS[0].url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!createAgentModal.isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast(language === 'id' ? 'Silakan pilih file gambar.' : 'Please select an image file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setSelectedAvatar(dataUrl);
        showToast(language === 'id' ? 'Foto profil diunggah!' : 'Profile photo uploaded!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!createAgentModal.initialSlug) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      showToast(language === 'id' ? 'Silakan masukkan nama lengkap dan pilih alamat URL website.' : 'Please enter your full name and choose a website address.', 'error');
      return;
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

    const newAgent = registerHost({
      name: name.trim(),
      slug: cleanSlug,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.replace(/[^0-9]/g, ''),
      email: email.trim() || `${cleanSlug}@proplis.com`,
      agency: agency.trim(),
      location: location.trim(),
      avatar: selectedAvatar,
      coverImage: selectedCover,
      plan: selectedPlan
    });

    setCreateAgentModal({ isOpen: false });
    navigate(`/${newAgent.slug}`);
  };

  const planTiers: AgentPlanTier[] = ['starter', 'growth', 'elite'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full text-white shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={() => setCreateAgentModal({ isOpen: false })}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {language === 'id' ? 'Setup Website Agen & CRM Instan' : 'Instant Agent Website & CRM Setup'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            {t('createAgentWeb')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'id' ? 'Dapatkan website portal properti pribadi Anda di ' : 'Launch your own branded property portal at '}<span className="font-mono text-amber-400">proplis.com/{slug || (language === 'id' ? 'nama-anda' : 'your-name')}</span> {language === 'id' ? 'lengkap dengan lead real-time.' : 'with real-time leads.'}
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Identity & Website URL */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" /> 1. {language === 'id' ? 'Pilih Alamat URL & Profil Agen' : 'Choose Your Custom URL & Profile'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{language === 'id' ? 'Nama Lengkap Agen *' : 'Your Full Name *'}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'id' ? 'contoh: Budi Santoso' : 'e.g. Sarah Jenkins'}
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{language === 'id' ? 'URL Website Pribadi *' : 'Your Private Website URL *'}</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-800/90 focus-within:border-amber-400">
                  <span className="bg-slate-950 px-3 py-2.5 text-[11px] text-slate-400 font-mono flex items-center border-r border-slate-800 shrink-0">
                    proplis.com/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={language === 'id' ? 'budi-santoso' : 'sarah-jenkins'}
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="w-full bg-transparent px-3 py-2.5 text-xs text-amber-300 font-mono placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{language === 'id' ? 'Nomor WhatsApp / HP *' : 'WhatsApp / Phone *'}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="+62 812 3456 7890"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="agent@agency.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{language === 'id' ? 'Nama Kantor / Agency' : 'Agency / Brokerage Name'}</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Independent / ERA / Ray White"
                    value={agency}
                    onChange={e => setAgency(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Photo & Header Selection */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'id' ? 'Foto Profil Website' : 'Profile Picture'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>{language === 'id' ? 'Upload Foto Sendiri' : 'Upload Photo'}</span>
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />

              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={selectedAvatar}
                    alt="Selected avatar"
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow-sm cursor-pointer hover:bg-amber-400"
                    title="Upload photo"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-[10px] text-slate-400 block">{language === 'id' ? 'Pilih headshot cepat atau upload:' : 'Select quick headshot or upload:'}</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {PRESET_AVATARS.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedAvatar(p.url)}
                        className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          selectedAvatar === p.url ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                        title={p.title}
                      >
                        <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Choose Plan Tier */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>2. {language === 'id' ? 'Pilih Paket Layanan' : 'Select Your Plan Tier'}</span>
              <span className="text-[11px] text-slate-400 font-normal">{language === 'id' ? 'Bisa diganti atau dibatalkan kapan saja' : 'Switch or cancel anytime'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {planTiers.map((tier) => {
                const cfg = localizedPlans[tier];
                const isSelected = selectedPlan === tier;

                return (
                  <div
                    key={tier}
                    onClick={() => setSelectedPlan(tier)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cfg.isPopular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase">
                        {cfg.badge || (language === 'id' ? 'Terpopuler' : 'Most Popular')}
                      </span>
                    )}

                    {(tier === 'elite' || tier === 'pro') && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold uppercase flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> {cfg.badge || (language === 'id' ? 'Terbaik' : 'Best Value')}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white font-serif">{cfg.name}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="text-base font-extrabold text-white mt-1">
                        {cfg.priceFormatted}
                      </div>

                      <ul className="text-[11px] text-slate-400 space-y-1.5 mt-3">
                        <li className="flex items-center gap-1.5 text-slate-300">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{(tier === 'elite' || tier === 'pro') ? (language === 'id' ? 'Listing Tanpa Batas' : 'Unlimited Listings') : `${cfg.listingLimit} Listings`}</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          {cfg.allowWhatsApp ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="text-slate-300">{language === 'id' ? 'Link Direct WhatsApp' : 'WhatsApp Link'}</span>
                            </>
                          ) : (
                            <span className="text-slate-500">{language === 'id' ? 'Hanya Pesan In-App' : 'Direct messages only'}</span>
                          )}
                        </li>
                        <li className="flex items-center gap-1.5">
                          {cfg.allowTrackingTags ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="text-slate-300">FB, TikTok & Google Tags</span>
                            </>
                          ) : (
                            <span className="text-slate-500">{language === 'id' ? 'Tanpa Tag Iklan' : 'No ad pixels'}</span>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {language === 'id' ? 'Website aktif instan dalam hitungan detik.' : '100% Guaranteed Setup. Instant website deployment.'}
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCreateAgentModal({ isOpen: false })}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer w-full sm:w-auto"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto active:scale-98"
              >
                <span>{language === 'id' ? 'Luncurkan Website Saya' : 'Launch My Website'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
