import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyCategory, ServiceType } from '../../types';
import { 
  Building2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Maximize2,
  FileText,
  MessageSquare,
  Building,
  KeyRound,
  Camera,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Award,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackOwnerPropertySubmit } from '../../utils/tracking';

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
];

export const OwnerSubmitModal: React.FC = () => {
  const { 
    ownerSubmitModal, 
    setOwnerSubmitModal, 
    hosts, 
    submitOwnerProperty, 
    showToast,
    language,
    t,
    setMessageModal
  } = useApp();

  const targetHostId = ownerSubmitModal.targetHostId || hosts[0]?.id;
  const targetHost = hosts.find(h => h.id === targetHostId) || hosts[0];

  const hostPlan = targetHost?.plan || 'starter';
  const isStarter = hostPlan === 'starter' || hostPlan === 'free';
  const isGrowth = hostPlan === 'growth';
  const isElite = hostPlan === 'elite' || hostPlan === 'pro';

  // Wizard step for Agency Elite (1: Owner Info, 2: Specs & Location, 3: Photos, 4: Digital Agreement)
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  
  // Property basic
  const [propertyTitle, setPropertyTitle] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('sale');
  const [category, setCategory] = useState<PropertyCategory>('villa');
  const [city, setCity] = useState('Bali');
  const [area, setArea] = useState('Canggu');
  const [address, setAddress] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('Rp 5.500.000.000');
  
  // Specs (Elite)
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [buildingSizeSqm, setBuildingSizeSqm] = useState(250);
  const [landSizeSqm, setLandSizeSqm] = useState(350);

  // Description & Photos
  const [description, setDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(SAMPLE_PHOTOS[0]);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([SAMPLE_PHOTOS[0], SAMPLE_PHOTOS[1]]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Digital Signature Pad state (for Agency Elite)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [agreementAgreed, setAgreementAgreed] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Submission result
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  // Canvas drawing handlers
  useEffect(() => {
    if (wizardStep === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#f59e0b'; // amber color
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [wizardStep]);

  if (!ownerSubmitModal.isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setSignatureDataUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureDataUrl(null);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setWizardStep(1);
    setOwnerSubmitModal({ isOpen: false });
  };

  // Submit Handler for Light Form (Growth Tier)
  const handleLightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerPhone.trim()) {
      showToast(language === 'id' ? 'Mohon isi nomor WhatsApp Anda.' : 'Please enter your WhatsApp phone number.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast(language === 'id' ? 'Mohon berikan deskripsi singkat properti.' : 'Please provide a short description.', 'error');
      return;
    }

    const titleAuto = propertyTitle.trim() || `${category.toUpperCase()} in ${area || 'Bali'}`;
    const newSub = submitOwnerProperty({
      hostId: targetHost.id,
      ownerName: ownerName.trim() || 'Property Owner',
      ownerPhone: ownerPhone.trim(),
      ownerEmail: ownerEmail.trim() || `${ownerPhone.replace(/[^0-9]/g, '')}@owner.proplis.com`,
      propertyTitle: titleAuto,
      serviceType,
      category,
      city: city || 'Bali',
      area: area || 'Canggu',
      address,
      expectedPrice: 250000,
      expectedPriceFormatted: expectedPrice,
      bedrooms: 2,
      bathrooms: 2,
      buildingSizeSqm: 150,
      description,
      images: [selectedPhoto],
      intakeMode: 'light'
    });

    trackOwnerPropertySubmit(targetHost.name, {
      ownerName: ownerName || 'Owner',
      ownerPhone,
      propertyTitle: titleAuto,
      serviceType,
      category
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    setSubmissionId(newSub.id);
    setIsSubmitted(true);
  };

  // Submit Handler for Complete Form (Agency Elite)
  const handleEliteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !ownerPhone.trim()) {
      showToast(language === 'id' ? 'Mohon lengkapi nama dan nomor WhatsApp Anda.' : 'Please provide owner name and phone.', 'error');
      return;
    }
    if (!agreementAgreed) {
      showToast(language === 'id' ? 'Mohon setujui perjanjian komisi broker.' : 'Please agree to the brokerage commission terms.', 'error');
      return;
    }
    if (!hasSignature) {
      showToast(language === 'id' ? 'Mohon bubuhkan tanda tangan digital pada kotak tanda tangan.' : 'Please sign your digital signature before submitting.', 'error');
      return;
    }

    const titleAuto = propertyTitle.trim() || `${category.toUpperCase()} ${bedrooms}BR in ${area}`;
    const newSub = submitOwnerProperty({
      hostId: targetHost.id,
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim(),
      ownerEmail: ownerEmail.trim(),
      propertyTitle: titleAuto,
      serviceType,
      category,
      city: city || 'Bali',
      area: area || 'Canggu',
      address,
      expectedPrice: 350000,
      expectedPriceFormatted: expectedPrice,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      buildingSizeSqm: Number(buildingSizeSqm),
      landSizeSqm: Number(landSizeSqm),
      description,
      images: galleryPhotos,
      intakeMode: 'complete',
      digitalAgreementSigned: true,
      signatureDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      signatureDataUrl: signatureDataUrl || undefined
    });

    trackOwnerPropertySubmit(targetHost.name, {
      ownerName,
      ownerPhone,
      propertyTitle: titleAuto,
      serviceType,
      category
    });

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    setSubmissionId(newSub.id);
    setIsSubmitted(true);
  };

  // Instant Deal Routing WhatsApp Generator
  const handleWhatsAppInstantRoute = () => {
    const serviceLabel = serviceType === 'sale' ? 'FOR SALE / JUAL' : serviceType === 'rent' ? 'FOR RENT / SEWA' : 'FOR LEASE';
    const text = encodeURIComponent(
      `Halo ${targetHost.name},\nSaya baru saja menitipkan properti saya melalui website Anda di Proplis:\n\n` +
      `📋 *Ref ID:* ${submissionId}\n` +
      `🏷️ *Tujuan:* ${serviceLabel} (${category.toUpperCase()})\n` +
      `📍 *Lokasi:* ${area}, ${city}\n` +
      `💰 *Harga Harapan:* ${expectedPrice}\n` +
      `👤 *Nama Pemilik:* ${ownerName || 'Owner'}\n` +
      `📞 *WhatsApp:* ${ownerPhone}\n` +
      (isElite ? `✍️ *Perjanjian Komisi:* Sudah Ditandatangani Digital ✅\n` : `📝 *Mode:* Intake Cepat (Light)\n`) +
      `\nMohon dibantu tindak lanjut dan jadwal survei / verifikasi. Terima kasih!`
    );

    window.open(`https://wa.me/${targetHost.whatsapp || targetHost.phone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={targetHost.avatar} 
                alt={targetHost.name} 
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md" 
              />
              {isElite && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full text-white shadow-xs">
                  <Crown className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase">
                  <Building2 className="w-3 h-3 text-amber-400" />
                  {isStarter 
                    ? 'Inquiry Agen' 
                    : isGrowth 
                    ? 'Owner Intake (Light)' 
                    : 'Complete Owner Onboarding'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {targetHost.agency}
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                {language === 'id' ? `Titipkan Properti ke ${targetHost.name}` : `List Your Property with ${targetHost.name}`}
              </h2>
              <p className="text-xs text-slate-300">
                {isGrowth 
                  ? (language === 'id' ? 'Formulir cepat: Cukup isi nomor HP, 1 foto, dan deskripsi singkat.' : 'Quick intake: Phone number, 1 photo, and short description.')
                  : isElite
                  ? (language === 'id' ? 'Wizard otomatis lengkap: Spesifikasi detail, galeri, & tanda tangan komisi digital.' : 'Complete automated onboarding wizard with digital commission agreement.')
                  : (language === 'id' ? 'Kirimkan pesan CRM langsung untuk konsultasi listing.' : 'Direct CRM message to discuss property representation.')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          /* SUCCESS & INSTANT ROUTING VIEW */
          <div className="p-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold font-serif text-white">
                {language === 'id' ? 'Properti Berhasil Diterima!' : 'Property Successfully Submitted!'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {isElite
                  ? (language === 'id' ? 'Data spesifikasi lengkap dan tanda tangan komisi digital telah aman tercatat di CRM agen.' : 'Specs and digital commission agreement have been logged into the agent CRM.')
                  : (language === 'id' ? 'Draf listing telah masuk ke antrean intake agen. Hubungi agen via WhatsApp untuk percepatan.' : 'Quick intake logged to agent queue. Chat with agent via WhatsApp for expedited review.')}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>{language === 'id' ? 'ID Registrasi:' : 'Registration Ref:'}</span>
                <span className="font-mono text-amber-400 font-bold">{submissionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'id' ? 'Judul / Tipe:' : 'Headline / Type:'}</span>
                <span className="text-white font-medium truncate max-w-[200px]">{propertyTitle || `${category.toUpperCase()} in ${area}`}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'id' ? 'Mode Intake:' : 'Intake Mode:'}</span>
                <span className="text-amber-300 font-bold uppercase">{isElite ? 'Complete (Agency Elite)' : 'Light (Growth)'}</span>
              </div>
              {isElite && (
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'id' ? 'Perjanjian Komisi:' : 'Commission Agreement:'}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ditandatangani Digital
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>{language === 'id' ? 'Agen Bertugas:' : 'Assigned Agent:'}</span>
                <span className="text-white font-bold">{targetHost.name}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppInstantRoute}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'id' ? 'Hubungi Agen via WhatsApp (1-Klik)' : 'Instant Deal Routing (WhatsApp)'}</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        ) : isStarter ? (
          /* TIER 1 STARTER: Friendly Direct CRM Inbox Route */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-slate-800 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-slate-700">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-white">
                {language === 'id' ? 'Inquiry Langsung ke CRM Agen' : 'Direct In-App CRM Inquiry'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {language === 'id'
                  ? `Agen ${targetHost.name} menggunakan paket Starter. Hubungi agen langsung melalui CRM Inbox untuk konsultasi titip listing atau transaksi properti.`
                  : `Agent ${targetHost.name} is on the Starter plan. Inquire directly via CRM inbox messages to consult on property representation.`}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleClose();
                  setMessageModal({ isOpen: true, hostId: targetHost.id });
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'id' ? 'Kirim Pesan ke Inbox Agen' : 'Send Direct CRM Message'}</span>
              </button>
              
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        ) : isGrowth ? (
          /* TIER 2 GROWTH: OWNER INTAKE (LIGHT) */
          /* Quick form: Phone number, 1 Photo, Short Description for follow-up */
          <form onSubmit={handleLightSubmit} className="p-6 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'id' ? 'Intake Cepat: Masukkan kontak WhatsApp, pilih 1 foto & deskripsi singkat. Agen akan segera menghubungi Anda.' : 'Quick Intake: Enter WhatsApp number, 1 photo, and short description. The agent will follow up quickly.'}</span>
            </div>

            {/* 1. Phone number (WhatsApp) & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'id' ? 'Nomor WhatsApp Pemilik *' : 'Owner WhatsApp Phone *'}
                </label>
                <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-amber-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                  <input
                    type="tel"
                    required
                    placeholder="+62 812 3456 7890"
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'id' ? 'Nama Lengkap Pemilik' : 'Owner Name'}
                </label>
                <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-amber-400">
                  <User className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Hendra Kusuma"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 2. Listing Goal & Category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Tujuan Listing</label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as ServiceType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="sale">Jual (For Sale)</option>
                  <option value="rent">Sewa (For Rent)</option>
                  <option value="lease">Leasehold</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as PropertyCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="villa">Villa</option>
                  <option value="house">Rumah (House)</option>
                  <option value="land">Tanah (Land)</option>
                  <option value="apartment">Apartemen</option>
                  <option value="ruko">Ruko / Shophouse</option>
                  <option value="commercial">Komersial</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Lokasi / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Canggu, Bali"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* 3. 1 Photo: Quick Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'id' ? 'Pilih 1 Foto Properti' : 'Select 1 Photo Preview'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Klik salah satu foto representatif</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SAMPLE_PHOTOS.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPhoto(imgUrl)}
                    className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedPhoto === imgUrl
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                    {selectedPhoto === imgUrl && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Short Description for follow-up */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'id' ? 'Deskripsi Singkat untuk Tindak Lanjut *' : 'Short Description for Follow-up *'}
              </label>
              <textarea
                required
                rows={3}
                placeholder={language === 'id' 
                  ? 'Contoh: Villa 3 kamar di Canggu dekat Pantai Echo, kolam renang pribadi, full furnished. Harga sewa Rp 35jt/bulan atau dijual 6 Miliar.' 
                  : 'e.g. 3 BR pool villa in Canggu close to Echo beach, fully furnished. Asking 35M IDR / month or 6B IDR freehold.'}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 leading-relaxed"
              />
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Data aman di CRM agen</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-98"
                >
                  <span>{language === 'id' ? 'Kirim Intake Cepat' : 'Submit Quick Intake'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* TIER 3 AGENCY ELITE: COMPLETE AUTOMATED OWNER ONBOARDING */
          /* Step-by-step submission wizard: Owner Name, exact location, property features (size, rooms, bathrooms), photo gallery upload, Digital Commission Agreement Signing, Instant Deal Routing */
          <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto space-y-5">
            {/* Wizard Steps Stepper */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              {[
                { step: 1, label: 'Owner Profile' },
                { step: 2, label: 'Location & Specs' },
                { step: 3, label: 'Photo Gallery' },
                { step: 4, label: 'Commission Agreement' },
              ].map(s => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => s.step < wizardStep && setWizardStep(s.step)}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    wizardStep === s.step
                      ? 'text-amber-400'
                      : wizardStep > s.step
                      ? 'text-emerald-400 cursor-pointer'
                      : 'text-slate-500'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    wizardStep === s.step
                      ? 'bg-amber-500 text-slate-950'
                      : wizardStep > s.step
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {wizardStep > s.step ? '✓' : s.step}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            {/* STEP 1: OWNER CONTACT */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-serif">
                    1. Owner Profile & Verified Contacts
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your direct identity is kept strictly confidential and only accessed by {targetHost.name}.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Owner Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ir. Bambang Wicaksono / Sarah Jenkins"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+62 812 3456 7890"
                        value={ownerPhone}
                        onChange={e => setOwnerPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="owner@domain.com"
                        value={ownerEmail}
                        onChange={e => setOwnerEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!ownerName.trim() || !ownerPhone.trim()) {
                        showToast('Please provide owner legal name and WhatsApp phone number.', 'error');
                        return;
                      }
                      setWizardStep(2);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Location & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EXACT LOCATION & SPECS */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-serif">
                    2. Property Features & Exact Location
                  </h3>
                  <p className="text-xs text-slate-400">
                    Exact location coordinates and dimensions for accurate broker valuation.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Listing Goal</label>
                    <select
                      value={serviceType}
                      onChange={e => setServiceType(e.target.value as ServiceType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="sale">For Sale (Dijual)</option>
                      <option value="rent">For Rent (Disewakan)</option>
                      <option value="lease">Leasehold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Property Type</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as PropertyCategory)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="villa">Villa</option>
                      <option value="house">House (Rumah)</option>
                      <option value="apartment">Apartment</option>
                      <option value="land">Plot of Land (Tanah)</option>
                      <option value="ruko">Ruko / Shophouse</option>
                      <option value="warehouse">Warehouse (Gudang)</option>
                      <option value="commercial">Commercial / Hotel</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Expected Price</label>
                    <input
                      type="text"
                      placeholder="e.g. Rp 6.800.000.000"
                      value={expectedPrice}
                      onChange={e => setExpectedPrice(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">District / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Canggu / Pererenan / Seminyak"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">City / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Bali / Jakarta Selatan"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Exact Street Address (Confidential)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jl. Pantai Batu Mejan No. 42, Canggu, Badung"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                {/* Rooms & Sizes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      min="0"
                      value={bedrooms}
                      onChange={e => setBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      min="0"
                      value={bathrooms}
                      onChange={e => setBathrooms(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Building (m²)</label>
                    <input
                      type="number"
                      min="10"
                      value={buildingSizeSqm}
                      onChange={e => setBuildingSizeSqm(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Land (m²)</label>
                    <input
                      type="number"
                      min="10"
                      value={landSizeSqm}
                      onChange={e => setLandSizeSqm(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Next: Photo Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PHOTO GALLERY */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-serif">
                    3. Curated Photo Gallery
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select high-resolution photos that showcase exterior architecture, pool, and master suites.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_PHOTOS.map((imgUrl, i) => {
                    const isSelected = galleryPhotos.includes(imgUrl);
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setGalleryPhotos(prev => 
                            isSelected ? prev.filter(p => p !== imgUrl) : [...prev, imgUrl]
                          );
                        }}
                        className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Features & Legal Notes</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Freehold SHM certificate, 100% flood-free, 6-meter paved road access, 5kW solar power..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Next: Commission Agreement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DIGITAL COMMISSION AGREEMENT SIGNING */}
            {wizardStep === 4 && (
              <form onSubmit={handleEliteSubmit} className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Agency Elite Legal Module
                  </div>
                  <h3 className="text-base font-bold text-white font-serif">
                    4. Digital Commission Agreement Signing
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sign integrated digital agreement before the listing hits the agent's CRM dashboard.
                  </p>
                </div>

                {/* Agreement Terms Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                  <p className="font-bold text-amber-300 uppercase">
                    STANDARD REAL ESTATE BROKERAGE COMMISSION AGREEMENT
                  </p>
                  <p>
                    1. <strong>APPOINTMENT:</strong> The undersigned Owner hereby authorizes <strong>{targetHost.name}</strong> ({targetHost.agency}) to market, represent, and promote the property located at <strong>{area}, {city}</strong>.
                  </p>
                  <p>
                    2. <strong>COMMISSION SCHEDULE:</strong>
                    <br />• <strong>Sales Transaction:</strong> 2.5% of the gross realized transacted purchase price upon notary closing.
                    <br />• <strong>Rental Lease Transaction:</strong> 5.0% of gross contract rental value upon signing.
                  </p>
                  <p>
                    3. <strong>CONFIDENTIALITY:</strong> Owner personal contact details and certificate deed numbers are strictly private and will NEVER be publicly indexed on search engines or third-party datasets.
                  </p>
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreementAgreed}
                    onChange={e => setAgreementAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-amber-400 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-200">
                    I confirm that I am the legal title holder or authorized representative of this property and agree to the 2.5% - 5% brokerage commission terms upon successful deal completion.
                  </span>
                </label>

                {/* Signature Pad */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>Interactive Digital Signature Pad</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Sign with finger or mouse)</span>
                    </label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear Signature</span>
                    </button>
                  </div>

                  <div className="relative border-2 border-dashed border-amber-500/40 rounded-2xl bg-slate-950 overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={560}
                      height={130}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-32 cursor-crosshair touch-none"
                    />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs italic">
                        ✍️ Sign your digital signature here
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-xl flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Award className="w-4 h-4" />
                    <span>Sign Agreement & Onboard Property 🚀</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
