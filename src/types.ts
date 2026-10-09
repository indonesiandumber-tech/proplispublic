export type Language = 'id' | 'en';

export type ServiceType = 'all' | 'rent' | 'sale' | 'lease';

export type PropertyCategory = 
  | 'land' 
  | 'ruko' 
  | 'house' 
  | 'villa' 
  | 'apartment' 
  | 'business' 
  | 'warehouse' 
  | 'kost' 
  | 'hotel_room' 
  | 'commercial' 
  | 'beachfront' 
  | 'penthouse' 
  | 'townhouse';

export type RentPeriodFilter = 'all' | 'monthly' | 'yearly';
export type PurposeFilter = 'all' | 'sale' | 'rent' | 'rent_monthly' | 'rent_yearly' | 'lease';

export type CurrencyCode = 'USD' | 'IDR' | 'EUR' | 'SGD' | 'AUD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number; // 1 USD = rateFromUSD
  locale: string;
}

export type AgentPlanTier = 'starter' | 'growth' | 'elite' | 'free' | 'pro';

export interface TrackingTags {
  facebookPixelId?: string;
  tiktokPixelId?: string;
  googleTagId?: string; // GTM or GA4 (G-XXXXX)
}

export interface BookingEngineConfig {
  enabled: boolean;
  provider: 'siteminder' | 'book_and_link' | 'cloudbeds' | 'custom';
  customProviderName?: string;
  bookingUrl?: string; // Direct reservation engine URL
  widgetEmbedCode?: string; // Embed script / iframe code
  buttonLabel?: string; // e.g. "Direct Reservation (SiteMinder)"
}

export interface PlanConfig {
  tier: AgentPlanTier;
  name: string;
  tagline: string;
  priceIDR: number; // 0, 99000, 249000
  priceFormatted: string; // 'Gratis', 'Rp 99.000 / bln', 'Rp 249.000 / bln'
  billingPeriod: string;
  listingLimit: number; // 2, 20, 999999
  listingLimitLabel: string;
  allowWhatsApp: boolean;
  allowTrackingPixels: boolean; // Meta, TikTok, Google Tag
  allowTrackingTags?: boolean; // alias
  allowVideoPerListing: boolean; // false for Starter & Growth, true for Agency Elite
  maxVideosPerListing: number; // 0 for Starter & Growth, 3 for Agency Elite
  allowRotatingListings: boolean;
  allowOwnerListingSubmission: boolean;
  ownerIntakeMode: 'none' | 'light' | 'complete';
  allowAIAssistant: boolean; // true for Growth & Agency Elite
  allowBookingEngineEmbed: boolean; // Exclusive to Agency Elite
  isPopular?: boolean;
  badge?: string;
  features: { title: string; included: boolean; note?: string }[];
}

export const PLANS_CONFIG: Record<string, PlanConfig> = {
  starter: {
    tier: 'starter',
    name: 'Starter (Free)',
    tagline: 'For new agents testing the platform & launching an instant digital portfolio',
    priceIDR: 0,
    priceFormatted: 'Rp 0',
    billingPeriod: 'Selamanya Gratis',
    listingLimit: 2,
    listingLimitLabel: '2 Active Listings',
    allowWhatsApp: false,
    allowTrackingPixels: false,
    allowTrackingTags: false,
    allowVideoPerListing: false,
    maxVideosPerListing: 0,
    allowRotatingListings: false,
    allowOwnerListingSubmission: false,
    ownerIntakeMode: 'none',
    allowAIAssistant: false,
    allowBookingEngineEmbed: false,
    features: [
      { title: '2 Active Property Listings', included: true },
      { title: 'Instant Vanity Website: proplis.com/your-name', included: true },
      { title: 'Mobile & Desktop Responsive Storefront', included: true },
      { title: 'Catalogs: Rent, Sale & Lease', included: true },
      { title: 'Inquiries: Direct In-App CRM Inbox messages only', included: true },
      { title: 'Privacy Controls: Phone & WhatsApp hidden from public view', included: true },
      { title: 'Standard Photo Galleries', included: true },
      { title: '❌ No Video Tours', included: false, note: 'Exclusive to Agency Elite' },
      { title: '❌ No Tracking Pixels (Meta/TikTok/Google)', included: false },
      { title: '❌ No AI Assistant Copywriting', included: false }
    ]
  },
  // Backward compatibility alias
  free: {
    tier: 'starter',
    name: 'Starter (Free)',
    tagline: 'For new agents testing the platform & launching an instant digital portfolio',
    priceIDR: 0,
    priceFormatted: 'Rp 0',
    billingPeriod: 'Selamanya Gratis',
    listingLimit: 2,
    listingLimitLabel: '2 Active Listings',
    allowWhatsApp: false,
    allowTrackingPixels: false,
    allowTrackingTags: false,
    allowVideoPerListing: false,
    maxVideosPerListing: 0,
    allowRotatingListings: false,
    allowOwnerListingSubmission: false,
    ownerIntakeMode: 'none',
    allowAIAssistant: false,
    allowBookingEngineEmbed: false,
    features: [
      { title: '2 Active Property Listings', included: true },
      { title: 'Instant Vanity Website: proplis.com/your-name', included: true },
      { title: 'Mobile & Desktop Responsive Storefront', included: true },
      { title: 'Catalogs: Rent, Sale & Lease', included: true },
      { title: 'Inquiries: Direct In-App CRM Inbox messages only', included: true },
      { title: 'Privacy Controls: Phone & WhatsApp hidden from public view', included: true },
      { title: 'Standard Photo Galleries', included: true },
      { title: '❌ No Video Tours', included: false, note: 'Exclusive to Agency Elite' },
      { title: '❌ No Tracking Pixels (Meta/TikTok/Google)', included: false },
      { title: '❌ No AI Assistant Copywriting', included: false }
    ]
  },
  growth: {
    tier: 'growth',
    name: 'Growth',
    tagline: 'For solo agents scaling their local listings and running paid ad campaigns',
    priceIDR: 99000,
    priceFormatted: 'Rp 99.000',
    billingPeriod: '/ bulan',
    listingLimit: 20,
    listingLimitLabel: 'Up to 20 Active Listings',
    allowWhatsApp: true,
    allowTrackingPixels: true,
    allowTrackingTags: true,
    allowVideoPerListing: false,
    maxVideosPerListing: 0,
    allowRotatingListings: false,
    allowOwnerListingSubmission: true,
    ownerIntakeMode: 'light',
    allowAIAssistant: true,
    allowBookingEngineEmbed: false,
    isPopular: true,
    badge: 'Paling Populer',
    features: [
      { title: 'Up to 20 Active Property Listings', included: true },
      { title: 'All features in Starter (Free)', included: true },
      { title: 'Direct Lead Capture: Public phone shown + 1-Click Direct WhatsApp buttons', included: true },
      { title: 'Meta Pixel Tag Integration (Facebook & Instagram Ads)', included: true },
      { title: 'TikTok Pixel Tag Integration', included: true },
      { title: 'Google Tag / GA4 Analytics Integration', included: true },
      { title: 'Lead Analytics Dashboard: Total visitors & WhatsApp lead tracking', included: true },
      { title: 'Bilingual AI Assistant: Automated AI descriptions & AI Polish', included: true },
      { title: 'Owner Intake (Light): Quick phone, 1 photo & short description form', included: true },
      { title: '❌ No Video Tours / Embeds (Exclusive to Agency Elite)', included: false, note: 'Exclusive to Agency Elite' }
    ]
  },
  elite: {
    tier: 'elite',
    name: 'Agency Elite',
    tagline: 'For agencies, brokers, and high-volume teams wanting maximum presentation and automation',
    priceIDR: 249000,
    priceFormatted: 'Rp 249.000',
    billingPeriod: '/ bulan',
    listingLimit: 999999,
    listingLimitLabel: 'Unlimited Active Listings',
    allowWhatsApp: true,
    allowTrackingPixels: true,
    allowTrackingTags: true,
    allowVideoPerListing: true,
    maxVideosPerListing: 3,
    allowRotatingListings: true,
    allowOwnerListingSubmission: true,
    ownerIntakeMode: 'complete',
    allowAIAssistant: true,
    allowBookingEngineEmbed: true,
    badge: 'Agency & Top Team Choice',
    features: [
      { title: 'UNLIMITED Active Property Listings (Tanpa Batas)', included: true },
      { title: 'All features in Growth Plan', included: true },
      { title: '🎥 Video Tour Embeds: Up to 3 Video Tours per listing (YouTube, Vimeo, TikTok, Reels)', included: true },
      { title: '🏨 Rental Booking Engine Embeds: SiteMinder, Book and Link, Cloudbeds direct widget', included: true },
      { title: 'Complete Automated Owner Onboarding (Step-by-step wizard & photo gallery)', included: true },
      { title: 'Digital Commission Agreement Signing with integrated digital signature', included: true },
      { title: 'Instant Deal Routing: 1-click WhatsApp connection for owners & buyers', included: true },
      { title: 'Priority Agency Analytics: Deep listing engagement & team lead stats', included: true },
      { title: 'Rotating Spotlight Hero Banner Showcase', included: true }
    ]
  },
  // Backward compatibility alias
  pro: {
    tier: 'elite',
    name: 'Agency Elite',
    tagline: 'For agencies, brokers, and high-volume teams wanting maximum presentation and automation',
    priceIDR: 249000,
    priceFormatted: 'Rp 249.000',
    billingPeriod: '/ bulan',
    listingLimit: 999999,
    listingLimitLabel: 'Unlimited Active Listings',
    allowWhatsApp: true,
    allowTrackingPixels: true,
    allowTrackingTags: true,
    allowVideoPerListing: true,
    maxVideosPerListing: 3,
    allowRotatingListings: true,
    allowOwnerListingSubmission: true,
    ownerIntakeMode: 'complete',
    allowAIAssistant: true,
    allowBookingEngineEmbed: true,
    badge: 'Agency & Top Team Choice',
    features: [
      { title: 'UNLIMITED Active Property Listings (Tanpa Batas)', included: true },
      { title: 'All features in Growth Plan', included: true },
      { title: '🎥 Video Tour Embeds: Up to 3 Video Tours per listing (YouTube, Vimeo, TikTok, Reels)', included: true },
      { title: '🏨 Rental Booking Engine Embeds: SiteMinder, Book and Link, Cloudbeds direct widget', included: true },
      { title: 'Complete Automated Owner Onboarding (Step-by-step wizard & photo gallery)', included: true },
      { title: 'Digital Commission Agreement Signing with integrated digital signature', included: true },
      { title: 'Instant Deal Routing: 1-click WhatsApp connection for owners & buyers', included: true },
      { title: 'Priority Agency Analytics: Deep listing engagement & team lead stats', included: true },
      { title: 'Rotating Spotlight Hero Banner Showcase', included: true }
    ]
  }
};

export interface OwnerSubmission {
  id: string;
  hostId: string; // The agent receiving this submission
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  propertyTitle: string;
  serviceType: 'rent' | 'sale' | 'lease';
  category: PropertyCategory;
  city: string;
  area: string;
  address?: string;
  expectedPrice: number; // in USD or converted
  expectedPriceFormatted: string;
  bedrooms: number;
  bathrooms: number;
  buildingSizeSqm: number;
  landSizeSqm?: number;
  description: string;
  images?: string[];
  intakeMode?: 'light' | 'complete';
  digitalAgreementSigned?: boolean;
  signatureDate?: string;
  signatureDataUrl?: string;
  status: 'new' | 'contacted' | 'survey_scheduled' | 'converted' | 'declined';
  createdAt: string;
}

export interface HostProfile {
  id: string;
  name: string;
  slug: string; // e.g. "budi" -> proplis.com/budi
  title: string;
  avatar: string;
  coverImage?: string;
  badge: string;
  rating: number;
  reviewCount: number;
  responseRate: string;
  responseTime: string;
  phone: string;
  whatsapp: string;
  email: string;
  agency?: string;
  bio: string;
  yearsActive: number;
  languages: string[];
  location: string;
  verified: boolean;
  featuredQuote?: string;
  plan: AgentPlanTier; // 'free' | 'starter' | 'pro'
  trackingTags?: TrackingTags;
  whatsappEnabled?: boolean;
  enableRotatingHero?: boolean;
  enableOwnerSubmission?: boolean;
  socials?: {
    instagram?: string;
    linkedin?: string;
    website?: string;
    tiktok?: string;
  };
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  rating: number;
  date: string;
  comment: string;
  stayType?: string; // e.g. "Stayed 5 nights - Villa Serenity"
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  serviceType: 'rent' | 'sale' | 'lease';
  category: PropertyCategory;
  pricePeriod?: 'month' | 'year' | 'total' | 'night'; // month for monthly rent, year for yearly rent/lease, total for sale
  rentDurationPeriod?: 'monthly' | 'yearly'; // rentals strictly monthly or yearly
  
  // AI Automation Metadata
  aiGenerated?: boolean;
  aiTone?: string;
  
  // Video (Agency Elite: Up to 3 Video Tours)
  videoUrl?: string;
  videoDurationMinutes?: number; // max 3
  videoTours?: { url: string; platform: 'youtube' | 'vimeo' | 'tiktok' | 'instagram' | 'other'; title?: string }[];
  
  // Agency Elite Feature: Rental Booking Engine Embed (SiteMinder, Book and Link, Cloudbeds)
  bookingEngine?: BookingEngineConfig;
  
  // Pro / Elite Feature: Featured in Rotating Hero
  isHeroRotating?: boolean;

  // Location
  location: {
    city: string;
    area: string;
    country: string;
    address: string;
    lat: number;
    lng: number;
  };
  
  // Specs
  specs: {
    bedrooms: number;
    bathrooms: number;
    maxGuests?: number;
    buildingSizeSqm: number;
    landSizeSqm?: number;
    floors?: number;
    yearBuilt?: number;
    certificateType?: string; // e.g. "Freehold (SHM)", "Strata Title", "Leasehold 25 Yrs"
    furnishing: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';
    minLeaseMonths?: number;
    cleaningFeeUSD?: number;
    serviceFeeUSD?: number;
    depositUSD?: number;
  };
  
  images: string[];
  featuredImage: string;
  
  // Features & Amenities
  amenities: string[];
  
  // Host
  hostId: string;
  
  // Ratings & Stats
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isSuperhost?: boolean;
  status: 'active' | 'pending' | 'sold' | 'booked';
  createdAt: string;
  
  description: string;
  neighborhoodInfo?: {
    highlights: string[];
    placesNearby: { name: string; distance: string; type: string }[];
  };
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  serviceType: 'rent' | 'sale' | 'lease';
  hostId: string;
  hostName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  
  // Dates/Terms
  startDate?: string;
  endDate?: string;
  nights?: number;
  guestsCount?: number;
  leaseDurationYears?: number;
  tourDateTime?: string;
  tourType?: 'in_person' | 'video_call';
  
  // Financial
  totalAmountUSD: number;
  currency: CurrencyCode;
  totalAmountFormatted: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  bookingCode: string;
}

export interface InquiryMessage {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  hostId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  serviceType: 'rent' | 'sale' | 'lease' | 'general';
  createdAt: string;
  read: boolean;
  replies?: {
    sender: string;
    text: string;
    timestamp: string;
  }[];
}

export interface SearchFilterState {
  serviceType: ServiceType;
  query: string;
  city: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'any', '1', '2', '3', '4+'
  bathrooms: string;
  amenities: string[];
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'newest';
  dates?: {
    checkIn?: string;
    checkOut?: string;
  };
  guests?: number;
}
