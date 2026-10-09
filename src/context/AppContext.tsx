import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  HostProfile, 
  CurrencyCode, 
  Booking, 
  InquiryMessage, 
  SearchFilterState, 
  ServiceType,
  Review,
  AgentPlanTier,
  PlanConfig,
  PLANS_CONFIG,
  OwnerSubmission,
  TrackingTags,
  Language
} from '../types';
import { INITIAL_HOSTS, INITIAL_PROPERTIES, INITIAL_REVIEWS, INITIAL_OWNER_SUBMISSIONS } from '../data/mockData';
import { formatExactPrice } from '../utils/currency';
import { TRANSLATIONS, getLocalizedPlans, PlanTranslation } from '../i18n/translations';

interface AppContextType {
  // Navigation & Route
  currentPath: string;
  navigate: (path: string) => void;

  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['id'] | string, fallback?: string) => string;
  localizedPlans: Record<AgentPlanTier, PlanTranslation>;
  
  // Data
  properties: Property[];
  hosts: HostProfile[];
  reviews: Review[];
  savedPropertyIds: string[];
  bookings: Booking[];
  inquiries: InquiryMessage[];
  ownerSubmissions: OwnerSubmission[];
  
  // User Session & CRM Agent
  activeHostId: string; // 'guest' or hostId
  activeUserHost: HostProfile | null;
  activePlanConfig: PlanConfig;
  switchUser: (hostIdOrGuest: string) => void;
  registerHost: (data: Partial<HostProfile> & { plan?: AgentPlanTier }) => HostProfile;
  updateHostProfile: (id: string, updates: Partial<HostProfile>) => void;
  updateHostPlan: (hostId: string, newPlan: AgentPlanTier) => void;
  updateHostTrackingTags: (hostId: string, tags: TrackingTags) => void;
  
  // Property Actions
  addProperty: (property: Partial<Property>) => Property | null;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  toggleSaveProperty: (id: string) => void;
  
  // Owner Submissions Pipeline (Growth & Agency Elite)
  submitOwnerProperty: (submission: {
    hostId: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail?: string;
    propertyTitle: string;
    serviceType: 'rent' | 'sale' | 'lease';
    category: any;
    city: string;
    area: string;
    address?: string;
    expectedPrice: number;
    expectedPriceFormatted: string;
    bedrooms?: number;
    bathrooms?: number;
    buildingSizeSqm?: number;
    landSizeSqm?: number;
    description: string;
    images?: string[];
    intakeMode?: 'light' | 'complete';
    digitalAgreementSigned?: boolean;
    signatureDate?: string;
    signatureDataUrl?: string;
  }) => OwnerSubmission;
  updateOwnerSubmissionStatus: (id: string, status: OwnerSubmission['status']) => void;
  convertOwnerSubmissionToListing: (submissionId: string) => Property | null;
  
  // Transactions & Inquiries
  createBooking: (bookingData: {
    propertyId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    startDate?: string;
    endDate?: string;
    nights?: number;
    guestsCount?: number;
    leaseDurationYears?: number;
    tourDateTime?: string;
    tourType?: 'in_person' | 'video_call';
    totalAmountUSD: number;
  }) => Booking;
  sendInquiry: (inquiryData: {
    hostId: string;
    propertyId?: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    message: string;
    serviceType: 'rent' | 'sale' | 'lease' | 'general';
  }) => InquiryMessage;
  
  // Currency & UI
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  
  // Filters
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  updateFilter: <K extends keyof SearchFilterState>(key: K, value: SearchFilterState[K]) => void;
  resetFilters: () => void;
  
  // Modals & UI States
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  
  messageModal: { isOpen: boolean; hostId?: string; propertyId?: string; defaultSubject?: string };
  setMessageModal: (state: { isOpen: boolean; hostId?: string; propertyId?: string; defaultSubject?: string }) => void;
  
  tourModal: { isOpen: boolean; property?: Property };
  setTourModal: (state: { isOpen: boolean; property?: Property }) => void;
  
  shareModal: { isOpen: boolean; title: string; url: string };
  setShareModal: (state: { isOpen: boolean; title: string; url: string }) => void;
  
  planUpgradeModal: { isOpen: boolean; preselectedTier?: AgentPlanTier };
  setPlanUpgradeModal: (state: { isOpen: boolean; preselectedTier?: AgentPlanTier }) => void;

  ownerSubmitModal: { isOpen: boolean; targetHostId?: string; targetHostName?: string };
  setOwnerSubmitModal: (state: { isOpen: boolean; targetHostId?: string; targetHostName?: string }) => void;

  createAgentModal: { isOpen: boolean; initialSlug?: string; preselectedTier?: AgentPlanTier };
  setCreateAgentModal: (state: { isOpen: boolean; initialSlug?: string; preselectedTier?: AgentPlanTier }) => void;

  photoPickerModal: { isOpen: boolean; initialTab?: 'avatar' | 'cover'; hostId?: string };
  setPhotoPickerModal: (state: { isOpen: boolean; initialTab?: 'avatar' | 'cover'; hostId?: string }) => void;

  aiDescriptionModal: { 
    isOpen: boolean; 
    initialData?: any; 
    onApply?: (title: string, tagline: string, description: string) => void;
  };
  setAiDescriptionModal: (state: { 
    isOpen: boolean; 
    initialData?: any; 
    onApply?: (title: string, tagline: string, description: string) => void;
  }) => void;

  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_FILTERS: SearchFilterState = {
  serviceType: 'all',
  query: '',
  city: 'all',
  category: 'all',
  minPrice: 0,
  maxPrice: 5000000,
  bedrooms: 'any',
  bathrooms: 'any',
  amenities: [],
  sortBy: 'recommended',
  guests: 1
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync URL route simulation (e.g. "/budi", "/explore", "/property/prop-budi-1", "/host-dashboard")
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.length > 1 ? window.location.pathname : '/';
  });

  // Local storage synced states
  const [hosts, setHosts] = useState<HostProfile[]>(() => {
    const saved = localStorage.getItem('proplis_hosts');
    if (!saved) return INITIAL_HOSTS;
    try {
      const parsed: HostProfile[] = JSON.parse(saved);
      return INITIAL_HOSTS.map(initH => {
        const existing = parsed.find(p => p.id === initH.id);
        if (!existing) return initH;
        return {
          ...initH,
          ...existing,
          plan: initH.plan, // Preserve canonical demo tier: Tier 2 Growth for Sarah, Tier 3 Elite for Budi, Tier 1 Starter for Citra
          whatsappEnabled: initH.whatsappEnabled,
          enableOwnerSubmission: initH.enableOwnerSubmission,
          trackingTags: { ...initH.trackingTags, ...existing.trackingTags }
        };
      });
    } catch {
      return INITIAL_HOSTS;
    }
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('proplis_properties');
    if (!saved) return INITIAL_PROPERTIES;
    try {
      const parsed: Property[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(p => p.id));
      const missingInitial = INITIAL_PROPERTIES.filter(p => !existingIds.has(p.id));
      return [...parsed, ...missingInitial];
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [reviews] = useState<Review[]>(INITIAL_REVIEWS);

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('proplis_saved');
    return saved ? JSON.parse(saved) : ['prop-budi-1', 'prop-citra-1'];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('proplis_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'bk-1001',
        propertyId: 'prop-budi-1',
        propertyTitle: 'The Glass Pavilion & Infinity Pool Villa',
        propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        propertyLocation: 'Canggu / Pererenan, Bali',
        serviceType: 'rent',
        hostId: 'host-budi',
        hostName: 'Budi Santoso',
        guestName: 'Alex Harrison',
        guestEmail: 'alex.h@gmail.com',
        guestPhone: '+61 412 888 999',
        startDate: '2026-09-10',
        endDate: '2026-09-15',
        nights: 5,
        guestsCount: 4,
        totalAmountUSD: 1975,
        currency: 'USD',
        totalAmountFormatted: '$1,975',
        status: 'confirmed',
        createdAt: '2026-08-15',
        bookingCode: 'PL-8829-DPS'
      }
    ];
  });

  const [inquiries, setInquiries] = useState<InquiryMessage[]>(() => {
    const saved = localStorage.getItem('proplis_inquiries');
    return saved ? JSON.parse(saved) : [
      {
        id: 'inq-1',
        propertyId: 'prop-budi-2',
        propertyTitle: 'Freehold Modern Sanctuary Villa - Canggu Center',
        hostId: 'host-budi',
        senderName: 'David Miller',
        senderEmail: 'david.m@sginvest.com',
        senderPhone: '+65 8822 1100',
        message: 'Hi Budi, I am interested in viewing the SHM freehold certificate and discussing the rental yield projections for this Canggu villa. Are you available for a WhatsApp call this Thursday?',
        serviceType: 'sale',
        createdAt: '2026-08-17T10:30:00Z',
        read: false
      }
    ];
  });

  const [ownerSubmissions, setOwnerSubmissions] = useState<OwnerSubmission[]>(() => {
    const saved = localStorage.getItem('proplis_owner_submissions');
    return saved ? JSON.parse(saved) : INITIAL_OWNER_SUBMISSIONS;
  });

  // Active User: defaults to Budi Santoso so the user can immediately experience agent CRM features
  const [activeHostId, setActiveHostId] = useState<string>('host-budi');

  // Language & i18n
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('proplis_language') as Language;
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('proplis_language', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS['id'] | string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] as Record<string, string>;
    const defaultDict = TRANSLATIONS['id'] as Record<string, string>;
    return langDict?.[key] || defaultDict?.[key] || fallback || key;
  };

  const localizedPlans = getLocalizedPlans(language);

  // Currency
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('proplis_currency') as CurrencyCode;
    return saved || 'USD';
  });

  // Search Filters
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; hostId?: string; propertyId?: string; defaultSubject?: string }>({
    isOpen: false
  });
  const [tourModal, setTourModal] = useState<{ isOpen: boolean; property?: Property }>({
    isOpen: false
  });
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; title: string; url: string }>({
    isOpen: false,
    title: '',
    url: ''
  });

  const [planUpgradeModal, setPlanUpgradeModal] = useState<{ isOpen: boolean; preselectedTier?: AgentPlanTier }>({
    isOpen: false
  });

  const [ownerSubmitModal, setOwnerSubmitModal] = useState<{ isOpen: boolean; targetHostId?: string; targetHostName?: string }>({
    isOpen: false
  });

  const [createAgentModal, setCreateAgentModal] = useState<{ isOpen: boolean; initialSlug?: string; preselectedTier?: AgentPlanTier }>({
    isOpen: false
  });

  const [photoPickerModal, setPhotoPickerModal] = useState<{ isOpen: boolean; initialTab?: 'avatar' | 'cover'; hostId?: string }>({
    isOpen: false
  });

  const [aiDescriptionModal, setAiDescriptionModal] = useState<{ 
    isOpen: boolean; 
    initialData?: any; 
    onApply?: (title: string, tagline: string, description: string) => void;
  }>({
    isOpen: false
  });

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('proplis_hosts', JSON.stringify(hosts));
  }, [hosts]);

  useEffect(() => {
    localStorage.setItem('proplis_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('proplis_saved', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  useEffect(() => {
    localStorage.setItem('proplis_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('proplis_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('proplis_owner_submissions', JSON.stringify(ownerSubmissions));
  }, [ownerSubmissions]);

  useEffect(() => {
    localStorage.setItem('proplis_currency', currency);
  }, [currency]);

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    showToast(`Currency converted to ${c}`, 'info');
  };

  const activeUserHost = hosts.find(h => h.id === activeHostId) || null;
  const activePlanConfig = activeUserHost?.plan ? PLANS_CONFIG[activeUserHost.plan] : PLANS_CONFIG.free;

  const switchUser = (hostIdOrGuest: string) => {
    setActiveHostId(hostIdOrGuest);
    if (hostIdOrGuest === 'guest') {
      showToast('Switched to Buyer / Client View', 'info');
    } else {
      const h = hosts.find(x => x.id === hostIdOrGuest);
      if (h) {
        showToast(`Logged in as Agent: ${h.name} (${PLANS_CONFIG[h.plan || 'free'].name} Plan)`, 'success');
      }
    }
  };

  const updateHostPlan = (hostId: string, newPlan: AgentPlanTier) => {
    setHosts(prev => prev.map(h => {
      if (h.id === hostId) {
        return {
          ...h,
          plan: newPlan,
          whatsappEnabled: PLANS_CONFIG[newPlan].allowWhatsApp,
          enableRotatingHero: PLANS_CONFIG[newPlan].allowRotatingListings,
          enableOwnerSubmission: PLANS_CONFIG[newPlan].allowOwnerListingSubmission
        };
      }
      return h;
    }));
    const targetPlan = PLANS_CONFIG[newPlan];
    showToast(`Agent plan upgraded to ${targetPlan.name} (${targetPlan.priceFormatted})! 🎉`, 'success');
  };

  const updateHostTrackingTags = (hostId: string, tags: TrackingTags) => {
    setHosts(prev => prev.map(h => {
      if (h.id === hostId) {
        return {
          ...h,
          trackingTags: { ...h.trackingTags, ...tags }
        };
      }
      return h;
    }));
    showToast('Tracking pixels (Facebook, TikTok, Google Tag) updated successfully!', 'success');
  };

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved wishlist', 'info');
        return prev.filter(x => x !== id);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, id];
      }
    });
  };

  const addProperty = (propertyData: Partial<Property>): Property | null => {
    const currentHost = activeUserHost || hosts[0];
    const planConfig = PLANS_CONFIG[currentHost.plan || 'free'];
    
    // Check plan listing limit
    const currentHostListingCount = properties.filter(p => p.hostId === currentHost.id).length;
    if (currentHostListingCount >= planConfig.listingLimit) {
      showToast(
        `Plan Limit Reached! ${planConfig.name} allows max ${planConfig.listingLimit} active listings. Upgrade your plan to add more.`, 
        'error'
      );
      setPlanUpgradeModal({ 
        isOpen: true, 
        preselectedTier: (currentHost.plan === 'starter' || currentHost.plan === 'free') ? 'growth' : 'elite' 
      });
      return null;
    }

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: propertyData.title || 'Untitled Property',
      tagline: propertyData.tagline || 'Modern luxury listing on Proplis CRM',
      serviceType: propertyData.serviceType || 'rent',
      category: propertyData.category || 'villa',
      priceUSD: propertyData.priceUSD || 250,
      pricePeriod: propertyData.pricePeriod || (propertyData.serviceType === 'rent' ? 'night' : propertyData.serviceType === 'lease' ? 'year' : 'total'),
      videoUrl: planConfig.allowVideoPerListing ? propertyData.videoUrl : undefined,
      videoDurationMinutes: planConfig.allowVideoPerListing ? (propertyData.videoDurationMinutes || 2) : undefined,
      isHeroRotating: planConfig.allowRotatingListings ? propertyData.isHeroRotating : false,
      location: propertyData.location || {
        city: 'Bali',
        area: 'Canggu',
        country: 'Indonesia',
        address: 'Jl. Sunset Road',
        lat: -8.65,
        lng: 115.14
      },
      specs: {
        bedrooms: propertyData.specs?.bedrooms || 2,
        bathrooms: propertyData.specs?.bathrooms || 2,
        maxGuests: propertyData.specs?.maxGuests || 4,
        buildingSizeSqm: propertyData.specs?.buildingSizeSqm || 180,
        landSizeSqm: propertyData.specs?.landSizeSqm || 250,
        furnishing: propertyData.specs?.furnishing || 'Fully Furnished',
        cleaningFeeUSD: propertyData.specs?.cleaningFeeUSD || 30,
        serviceFeeUSD: propertyData.specs?.serviceFeeUSD || 20,
        depositUSD: propertyData.specs?.depositUSD || 100,
        ...propertyData.specs
      },
      images: propertyData.images && propertyData.images.length > 0 
        ? propertyData.images 
        : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
        ],
      featuredImage: propertyData.featuredImage || (propertyData.images && propertyData.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      amenities: propertyData.amenities || ['High-Speed Wi-Fi', 'Air Conditioning', 'Swimming Pool'],
      hostId: currentHost.id,
      rating: 5.0,
      reviewCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      description: propertyData.description || 'Stunning property listed on Proplis.',
      neighborhoodInfo: propertyData.neighborhoodInfo || {
        highlights: ['Convenient location', 'Close to cafes and transport'],
        placesNearby: [{ name: 'City Center', distance: '1.5 km', type: 'Center' }]
      }
    };

    setProperties(prev => [newProp, ...prev]);
    showToast(`Listing "${newProp.title}" published to your website!`, 'success');
    return newProp;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Property updated successfully', 'success');
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast('Property listing removed', 'info');
  };

  const registerHost = (data: Partial<HostProfile> & { plan?: AgentPlanTier }): HostProfile => {
    const slug = data.slug 
      ? data.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '')
      : (data.name || 'agent').toLowerCase().replace(/\s+/g, '-');

    const chosenPlan = data.plan || 'free';
    const planConfig = PLANS_CONFIG[chosenPlan];

    const newHost: HostProfile = {
      id: `host-${Date.now()}`,
      name: data.name || 'Proplis Agent',
      slug: slug,
      title: data.title || 'Licensed Property Agent & Consultant',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      badge: (chosenPlan === 'elite' || chosenPlan === 'pro') ? 'Agency Elite Member' : chosenPlan === 'growth' ? 'Growth Agent' : 'Starter Agent',
      rating: 5.0,
      reviewCount: 0,
      responseRate: '100%',
      responseTime: 'within 15 mins',
      phone: data.phone || '+62 812 0000 0000',
      whatsapp: data.whatsapp || '6281200000000',
      email: data.email || `${slug}@proplis.com`,
      agency: data.agency || 'Independent Real Estate Agent',
      bio: data.bio || `Welcome to my private real estate website! Browse all my verified properties for rent, sale, and long-term lease.`,
      yearsActive: data.yearsActive || 2,
      languages: data.languages || ['English', 'Bahasa Indonesia'],
      location: data.location || 'Bali & Jakarta, Indonesia',
      verified: true,
      plan: chosenPlan,
      whatsappEnabled: planConfig.allowWhatsApp,
      enableRotatingHero: planConfig.allowRotatingListings,
      enableOwnerSubmission: planConfig.allowOwnerListingSubmission,
      trackingTags: planConfig.allowTrackingPixels ? {
        facebookPixelId: 'FB-DEMO-PIXEL',
        tiktokPixelId: 'TT-DEMO-TAG',
        googleTagId: 'G-DEMO-TAG'
      } : undefined,
      socials: {
        instagram: slug,
        website: `https://proplis.com/${slug}`
      }
    };

    setHosts(prev => [...prev, newHost]);
    setActiveHostId(newHost.id);
    showToast(`🎉 Your private agent website is live at proplis.com/${newHost.slug}!`, 'success');
    return newHost;
  };

  const updateHostProfile = (id: string, updates: Partial<HostProfile>) => {
    setHosts(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    showToast('Agent profile & website settings updated!', 'success');
  };

  // Owner Listing Submissions
  const submitOwnerProperty = (submissionData: {
    hostId: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail?: string;
    propertyTitle: string;
    serviceType: 'rent' | 'sale' | 'lease';
    category: any;
    city: string;
    area: string;
    address?: string;
    expectedPrice: number;
    expectedPriceFormatted: string;
    bedrooms?: number;
    bathrooms?: number;
    buildingSizeSqm?: number;
    landSizeSqm?: number;
    description: string;
    images?: string[];
    intakeMode?: 'light' | 'complete';
    digitalAgreementSigned?: boolean;
    signatureDate?: string;
    signatureDataUrl?: string;
  }): OwnerSubmission => {
    const newSubmission: OwnerSubmission = {
      id: `own-sub-${Date.now()}`,
      hostId: submissionData.hostId,
      ownerName: submissionData.ownerName,
      ownerPhone: submissionData.ownerPhone,
      ownerEmail: submissionData.ownerEmail || `${submissionData.ownerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      propertyTitle: submissionData.propertyTitle,
      serviceType: submissionData.serviceType,
      category: submissionData.category,
      city: submissionData.city,
      area: submissionData.area,
      address: submissionData.address,
      expectedPrice: submissionData.expectedPrice,
      expectedPriceFormatted: submissionData.expectedPriceFormatted,
      bedrooms: submissionData.bedrooms ?? 2,
      bathrooms: submissionData.bathrooms ?? 2,
      buildingSizeSqm: submissionData.buildingSizeSqm ?? 150,
      landSizeSqm: submissionData.landSizeSqm,
      description: submissionData.description,
      images: submissionData.images,
      intakeMode: submissionData.intakeMode || 'light',
      digitalAgreementSigned: submissionData.digitalAgreementSigned,
      signatureDate: submissionData.signatureDate,
      signatureDataUrl: submissionData.signatureDataUrl,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    setOwnerSubmissions(prev => [newSubmission, ...prev]);
    showToast('Property submitted successfully to the agent CRM!', 'success');
    return newSubmission;
  };

  const updateOwnerSubmissionStatus = (id: string, status: OwnerSubmission['status']) => {
    setOwnerSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    showToast(`Owner submission marked as ${status}`, 'info');
  };

  const convertOwnerSubmissionToListing = (submissionId: string): Property | null => {
    const submission = ownerSubmissions.find(s => s.id === submissionId);
    if (!submission) return null;

    const currentHost = hosts.find(h => h.id === submission.hostId) || activeUserHost || hosts[0];
    const planConfig = PLANS_CONFIG[currentHost.plan || 'free'];
    const currentHostCount = properties.filter(p => p.hostId === currentHost.id).length;

    if (currentHostCount >= planConfig.listingLimit) {
      showToast(`Cannot convert: Plan listing limit (${planConfig.listingLimit}) reached. Upgrade plan first.`, 'error');
      setPlanUpgradeModal({ isOpen: true, preselectedTier: 'elite' });
      return null;
    }

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: submission.propertyTitle,
      tagline: `Exclusive listing by ${currentHost.name} - ${submission.area}, ${submission.city}`,
      serviceType: submission.serviceType,
      category: submission.category,
      priceUSD: submission.expectedPrice || 350,
      pricePeriod: submission.serviceType === 'rent' ? 'night' : submission.serviceType === 'lease' ? 'year' : 'total',
      location: {
        city: submission.city,
        area: submission.area,
        country: 'Indonesia',
        address: submission.address || `${submission.area}, ${submission.city}`,
        lat: -8.65,
        lng: 115.14
      },
      specs: {
        bedrooms: submission.bedrooms || 3,
        bathrooms: submission.bathrooms || 3,
        buildingSizeSqm: submission.buildingSizeSqm || 200,
        landSizeSqm: submission.landSizeSqm || 300,
        furnishing: 'Fully Furnished',
        cleaningFeeUSD: 30,
        serviceFeeUSD: 20,
        depositUSD: 100
      },
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
      ],
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Private Pool', 'Air Conditioning', 'Modern Kitchen', 'Parking'],
      hostId: currentHost.id,
      rating: 5.0,
      reviewCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      description: submission.description || `Submitted directly by owner: ${submission.ownerName} (${submission.ownerPhone})`
    };

    setProperties(prev => [newProp, ...prev]);
    updateOwnerSubmissionStatus(submissionId, 'converted');
    showToast(`Listing published to your private website from Owner intake! 🚀`, 'success');
    return newProp;
  };

  const createBooking = (bookingData: {
    propertyId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    startDate?: string;
    endDate?: string;
    nights?: number;
    guestsCount?: number;
    leaseDurationYears?: number;
    tourDateTime?: string;
    tourType?: 'in_person' | 'video_call';
    totalAmountUSD: number;
  }): Booking => {
    const prop = properties.find(p => p.id === bookingData.propertyId);
    const host = hosts.find(h => h.id === prop?.hostId);
    
    const randomCode = `PL-${Math.floor(1000 + Math.random() * 9000)}-${(prop?.location.city || 'RES').substring(0, 3).toUpperCase()}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      propertyId: bookingData.propertyId,
      propertyTitle: prop?.title || 'Property',
      propertyImage: prop?.featuredImage || '',
      propertyLocation: `${prop?.location.area}, ${prop?.location.city}`,
      serviceType: prop?.serviceType || 'rent',
      hostId: prop?.hostId || 'host-budi',
      hostName: host?.name || 'Proplis Host',
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      nights: bookingData.nights,
      guestsCount: bookingData.guestsCount,
      leaseDurationYears: bookingData.leaseDurationYears,
      tourDateTime: bookingData.tourDateTime,
      tourType: bookingData.tourType,
      totalAmountUSD: bookingData.totalAmountUSD,
      currency: currency,
      totalAmountFormatted: formatExactPrice(bookingData.totalAmountUSD, currency),
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      bookingCode: randomCode
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(`Reservation confirmed! Booking Code: ${randomCode}`, 'success');
    return newBooking;
  };

  const sendInquiry = (inquiryData: {
    hostId: string;
    propertyId?: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    message: string;
    serviceType: 'rent' | 'sale' | 'lease' | 'general';
  }): InquiryMessage => {
    const prop = properties.find(p => p.id === inquiryData.propertyId);
    
    const newInquiry: InquiryMessage = {
      id: `inq-${Date.now()}`,
      propertyId: inquiryData.propertyId,
      propertyTitle: prop?.title,
      hostId: inquiryData.hostId,
      senderName: inquiryData.senderName,
      senderEmail: inquiryData.senderEmail,
      senderPhone: inquiryData.senderPhone,
      message: inquiryData.message,
      serviceType: inquiryData.serviceType,
      createdAt: new Date().toISOString(),
      read: false
    };

    setInquiries(prev => [newInquiry, ...prev]);
    showToast('Inquiry message delivered to agent!', 'success');
    return newInquiry;
  };

  const updateFilter = <K extends keyof SearchFilterState>(key: K, value: SearchFilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    showToast('Filters reset', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        language,
        setLanguage,
        t,
        localizedPlans,
        properties,
        hosts,
        reviews,
        savedPropertyIds,
        bookings,
        inquiries,
        ownerSubmissions,
        activeHostId,
        activeUserHost,
        activePlanConfig,
        switchUser,
        registerHost,
        updateHostProfile,
        updateHostPlan,
        updateHostTrackingTags,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleSaveProperty,
        submitOwnerProperty,
        updateOwnerSubmissionStatus,
        convertOwnerSubmissionToListing,
        createBooking,
        sendInquiry,
        currency,
        setCurrency,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        selectedProperty,
        setSelectedProperty,
        messageModal,
        setMessageModal,
        tourModal,
        setTourModal,
        shareModal,
        setShareModal,
        planUpgradeModal,
        setPlanUpgradeModal,
        ownerSubmitModal,
        setOwnerSubmitModal,
        createAgentModal,
        setCreateAgentModal,
        photoPickerModal,
        setPhotoPickerModal,
        aiDescriptionModal,
        setAiDescriptionModal,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
