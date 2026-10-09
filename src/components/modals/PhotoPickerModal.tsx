import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Link as LinkIcon,
  Eye,
  Sliders,
  User,
  Building
} from 'lucide-react';

// Curated high-resolution profile avatars for real estate agents
export const PRESET_AVATARS = [
  {
    id: 'budi',
    title: 'Indonesian Luxury Partner',
    category: 'Male Executive',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sarah',
    title: 'Penthouse & High-End Broker',
    category: 'Female Executive',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'citra',
    title: 'Creative Villa & Resort Director',
    category: 'Female Specialist',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'reza',
    title: 'Prime Capital & Commercial Agent',
    category: 'Male Partner',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'maya',
    title: 'Beachfront & Investment Specialist',
    category: 'Female Senior',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'daniel',
    title: 'Global Advisory & Expat Relocation',
    category: 'Male Broker',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'kevin',
    title: 'Modern Architecture & Land Broker',
    category: 'Male Specialist',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'elena',
    title: 'Luxury Hospitality & Estate Manager',
    category: 'Female Executive',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
  }
];

// Curated high-resolution cover / header photos for real estate portals
export const PRESET_COVERS = [
  {
    id: 'canggu-villa',
    title: 'Tropical Bali Villa with Pool',
    location: 'Canggu, Bali',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'glass-pavilion',
    title: 'Modern Glass Architectural Estate',
    location: 'Pererenan, Bali',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'palm-lagoon',
    title: 'Palm Courtyard & Sunlit Terrace',
    location: 'Seminyak, Bali',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'cliffside-sunset',
    title: 'Panoramic Ocean Sunset Villa',
    location: 'Uluwatu, Bali',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'scbd-penthouse',
    title: 'Skyline Luxury Penthouse',
    location: 'SCBD, Jakarta',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'designer-residence',
    title: 'Minimalist Contemporary Manor',
    location: 'Sanur, Bali',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80'
  }
];

export const PhotoPickerModal: React.FC = () => {
  const { 
    photoPickerModal, 
    setPhotoPickerModal, 
    hosts, 
    activeUserHost, 
    updateHostProfile, 
    showToast,
    language,
    t
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'avatar' | 'cover'>('avatar');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Determine current host
  const targetHost = hosts.find(h => h.id === photoPickerModal.hostId) || activeUserHost || hosts[0];

  useEffect(() => {
    if (photoPickerModal.isOpen && targetHost) {
      setActiveTab(photoPickerModal.initialTab || 'avatar');
      setAvatarUrl(targetHost.avatar || '');
      setCoverUrl(targetHost.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80');
      setCustomInputUrl('');
    }
  }, [photoPickerModal.isOpen, photoPickerModal.initialTab, targetHost]);

  if (!photoPickerModal.isOpen || !targetHost) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast(language === 'id' ? 'Silakan pilih file gambar (JPG, PNG, WebP).' : 'Please select an image file (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast(language === 'id' ? 'Ukuran file maksimal 8MB.' : 'File size cannot exceed 8MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        if (activeTab === 'avatar') {
          setAvatarUrl(dataUrl);
        } else {
          setCoverUrl(dataUrl);
        }
        showToast(language === 'id' ? 'Foto berhasil diunggah! Klik Simpan untuk menerapkan.' : 'Photo uploaded! Click Save to apply.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customInputUrl.trim()) return;
    if (activeTab === 'avatar') {
      setAvatarUrl(customInputUrl.trim());
    } else {
      setCoverUrl(customInputUrl.trim());
    }
    showToast(language === 'id' ? 'Foto berhasil dipilih!' : 'Photo selected!', 'info');
    setCustomInputUrl('');
  };

  const handleSave = () => {
    updateHostProfile(targetHost.id, {
      avatar: avatarUrl,
      coverImage: coverUrl
    });
    showToast(t('photoUpdatedSuccess') || 'Photos updated successfully!', 'success');
    setPhotoPickerModal({ isOpen: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={() => setPhotoPickerModal({ isOpen: false })}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Camera className="w-3.5 h-3.5 text-amber-400" /> {t('brandingPhotosTitle')}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            {t('brandingPhotosTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('brandingPhotosDesc')}
          </p>
        </div>

        {/* Tab Selection: Avatar vs Cover */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'avatar'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('profileAvatar')}</span>
            {avatarUrl && <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1"></span>}
          </button>

          <button
            onClick={() => setActiveTab('cover')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cover'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{t('headerCover')}</span>
            {coverUrl && <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1"></span>}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
          
          {/* Live Composite Preview Card */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" /> {language === 'id' ? 'Pratinjau Tampilan Header Website' : 'Live Header Preview'}
            </span>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-lg">
              {/* Cover Banner */}
              <div className="h-32 sm:h-36 w-full relative">
                <img
                  src={coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}
                  alt="Cover preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <button
                  onClick={() => setActiveTab('cover')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-[10px] font-bold text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-amber-400" /> {language === 'id' ? 'Edit Header' : 'Edit Header'}
                </button>
              </div>

              {/* Avatar overlay */}
              <div className="p-4 pt-0 -mt-10 sm:-mt-12 flex items-end gap-3 relative z-10">
                <div className="relative group cursor-pointer" onClick={() => setActiveTab('avatar')}>
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt="Avatar preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl bg-slate-800"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                <div className="pb-1">
                  <h4 className="font-bold text-sm text-white">{targetHost.name}</h4>
                  <p className="text-[11px] text-slate-400">{targetHost.title || 'Property Agent'} • <span className="font-mono text-amber-400">proplis.com/{targetHost.slug}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Option 1: Upload from Device */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              1. {t('uploadFromDevice')}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-amber-400 bg-amber-500/10' 
                  : 'border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/70'
              }`}
            >
              <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-200">
                {activeTab === 'avatar' ? t('changeProfilePhoto') : t('changeHeaderCover')}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {t('dragAndDropImage')}
              </p>
            </div>
          </div>

          {/* Option 2: Paste Direct Image URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              2. {t('orPasteImageUrl')}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or cloud image link"
                  value={customInputUrl}
                  onChange={(e) => setCustomInputUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customInputUrl.trim()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
              >
                {language === 'id' ? 'Terapkan' : 'Apply'}
              </button>
            </div>
          </div>

          {/* Option 3: Curated Presets Library */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300">
                3. {t('selectFromPresets')} ({activeTab === 'avatar' ? 'Headshots' : 'Luxury Architecture'})
              </label>
            </div>

            {activeTab === 'avatar' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AVATARS.map((item) => {
                  const isSelected = avatarUrl === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setAvatarUrl(item.url)}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                        isSelected 
                          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-102' 
                          : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square w-full">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-white leading-tight">{item.title}</span>
                        <span className="text-[9px] text-amber-400">{item.category}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_COVERS.map((item) => {
                  const isSelected = coverUrl === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCoverUrl(item.url)}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                        isSelected 
                          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-102' 
                          : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="h-24 w-full">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-end">
                        <span className="text-[11px] font-bold text-white leading-tight">{item.title}</span>
                        <span className="text-[10px] text-amber-400">{item.location}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setAvatarUrl(targetHost.avatar);
              setCoverUrl(targetHost.coverImage || '');
            }}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {t('resetDefaultPhoto')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPhotoPickerModal({ isOpen: false })}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              {language === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>{t('savePhotos')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
