import { HostProfile, Property, Review, OwnerSubmission, PLANS_CONFIG } from '../types';
export { PLANS_CONFIG };

export const INITIAL_HOSTS: HostProfile[] = [
  {
    id: 'host-budi',
    name: 'Budi Santoso',
    slug: 'budi',
    title: 'Top Bali & Jakarta Luxury Real Estate Partner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    badge: 'Superhost & Premier Agent',
    rating: 4.98,
    reviewCount: 142,
    responseRate: '100%',
    responseTime: 'within 15 minutes',
    phone: '+62 812-8899-4455',
    whatsapp: '6281288994455',
    email: 'budi.santoso@proplis.com',
    agency: 'Horizon Prime Estates Bali & Capital',
    bio: 'Hello! I am Budi. Born in Jakarta and living in Bali for 12 years. I help vacationers find idyllic beachfront villas for rent, long-term expatriates secure verified leases, and international investors acquire high-yield freehold luxury real estate.',
    yearsActive: 8,
    languages: ['Bahasa Indonesia', 'English', 'Javanese'],
    location: 'Canggu, Bali & SCBD Jakarta',
    verified: true,
    featuredQuote: 'Direct integrity, transparent contracts, and authentic local guidance.',
    plan: 'elite', // Tier 3: Agency Elite (Unlimited, Video Tours, Booking Engine, Digital Commission Agreements)
    whatsappEnabled: true,
    enableRotatingHero: true,
    enableOwnerSubmission: true,
    trackingTags: {
      facebookPixelId: 'FB-98421034',
      tiktokPixelId: 'TT-8932401',
      googleTagId: 'G-82938491'
    },
    socials: {
      instagram: 'budisantoso_properties',
      linkedin: 'budi-santoso-realestate',
      website: 'https://proplis.com/budi',
      tiktok: '@budi_luxury_bali'
    }
  },
  {
    id: 'host-sarah',
    name: 'Sarah Jenkins',
    slug: 'sarah-jenkins',
    title: 'Luxury Residential & Penthouse Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    badge: 'Tier 2 Growth Broker',
    rating: 4.95,
    reviewCount: 98,
    responseRate: '98%',
    responseTime: 'within an hour',
    phone: '+65 9123 4567',
    whatsapp: '6591234567',
    email: 'sarah.j@proplis.com',
    agency: 'Marina Bay & South East Asia Realty',
    bio: 'Specializing in high-end urban living, sky penthouses, and executive long-term corporate leases in Singapore and Jakarta.',
    yearsActive: 10,
    languages: ['English', 'Mandarin'],
    location: 'Singapore & Jakarta',
    verified: true,
    plan: 'growth', // Tier 2: Growth (20 listings, WhatsApp, Pixels, AI Assistant, Light Intake)
    whatsappEnabled: true,
    enableRotatingHero: false,
    enableOwnerSubmission: true,
    trackingTags: {
      facebookPixelId: 'FB-43920194',
      tiktokPixelId: 'TT-74892019',
      googleTagId: 'G-74839201'
    },
    socials: {
      instagram: 'sarahj_realestate',
      linkedin: 'sarah-jenkins-broker'
    }
  },
  {
    id: 'host-citra',
    name: 'Citra Dewi',
    slug: 'citra-villas',
    title: 'Eco-Luxury Architecture & Retreat Host',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    badge: 'Eco-Superhost',
    rating: 4.99,
    reviewCount: 215,
    responseRate: '100%',
    responseTime: 'within 10 minutes',
    phone: '+62 811-3344-7788',
    whatsapp: '6281133447788',
    email: 'citra.dewi@proplis.com',
    agency: 'Nusantara Bamboo & Sustainable Living',
    bio: 'Architect turned hospitality curator. We design and manage bamboo sanctuaries, tranquil jungle estates in Ubud, and cliffside oceanfront stays.',
    yearsActive: 6,
    languages: ['Bahasa Indonesia', 'English', 'French'],
    location: 'Ubud & Uluwatu, Bali',
    verified: true,
    plan: 'starter', // Tier 1: Starter (Free) (2 listings, In-App CRM Inbox only, No Video, No Pixels)
    whatsappEnabled: false,
    enableRotatingHero: false,
    enableOwnerSubmission: false
  },
  {
    id: 'host-kenji',
    name: 'Kenji Sato',
    slug: 'kenji-tokyo',
    title: 'Tokyo Modern Residences & Commercial Leases',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    badge: 'Tokyo Licensed Consultant',
    rating: 4.92,
    reviewCount: 76,
    responseRate: '95%',
    responseTime: 'within 2 hours',
    phone: '+81 3-5555-0199',
    whatsapp: '81355550199',
    email: 'kenji.sato@proplis.com',
    agency: 'Shibuya Metro Real Estate',
    bio: 'Assisting global digital nomads and international business founders with turnkey modern apartments and retail leaseholds in Tokyo.',
    yearsActive: 7,
    languages: ['Japanese', 'English'],
    location: 'Shibuya, Tokyo',
    verified: true,
    plan: 'starter',
    whatsappEnabled: true,
    enableRotatingHero: false,
    enableOwnerSubmission: false,
    trackingTags: {
      googleTagId: 'G-99381022'
    }
  }
];

export const INITIAL_OWNER_SUBMISSIONS: OwnerSubmission[] = [
  {
    id: 'own-sub-1',
    hostId: 'host-budi',
    ownerName: 'Hendra Wijaya',
    ownerPhone: '+62 813-9988-1122',
    ownerEmail: 'hendra.w@gmail.com',
    propertyTitle: 'Sunset Hill Modern Villa 4BR',
    serviceType: 'sale',
    category: 'villa',
    city: 'Bali',
    area: 'Uluwatu',
    address: 'Jl. Pantai Suluban No. 12',
    expectedPrice: 650000,
    expectedPriceFormatted: '$650,000 (SHM Freehold)',
    bedrooms: 4,
    bathrooms: 4,
    buildingSizeSqm: 380,
    landSizeSqm: 500,
    description: 'Brand new luxury villa completed late 2025. Ocean view sunset facing with private 12m pool. Looking for Budi to represent the exclusive sale listing.',
    status: 'new',
    createdAt: '2026-08-16T14:20:00Z'
  },
  {
    id: 'own-sub-2',
    hostId: 'host-budi',
    ownerName: 'Clara Sutedja',
    ownerPhone: '+62 812-3344-5566',
    ownerEmail: 'clara.s@yahoo.com',
    propertyTitle: 'Tropical Bohemian Villa - Long Term Lease',
    serviceType: 'lease',
    category: 'villa',
    city: 'Bali',
    area: 'Berawa / Canggu',
    address: 'Jl. Pantai Berawa Gg. Sri',
    expectedPrice: 28000,
    expectedPriceFormatted: '$28,000 / year (Min 2 Yrs)',
    bedrooms: 3,
    bathrooms: 3,
    buildingSizeSqm: 220,
    landSizeSqm: 300,
    description: 'Fully furnished enclosed living villa with solar power system. Walk to cafes and beach. Ready for 2-5 year lease contracts.',
    status: 'contacted',
    createdAt: '2026-08-14T09:15:00Z'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  // BUDI'S PROPERTIES (Rent, Sale, Lease)
  {
    id: 'prop-budi-1',
    title: 'The Glass Pavilion & Infinity Pool Villa',
    tagline: 'Architectural tropical marvel overlooking Pererenan river valley',
    serviceType: 'rent',
    category: 'villa',
    priceUSD: 4200,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-with-swimming-pool-42512-large.mp4',
    videoDurationMinutes: 2,
    videoTours: [
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', platform: 'youtube', title: '4K Architectural Villa Walkthrough' },
      { url: 'https://vimeo.com/76979871', platform: 'vimeo', title: 'Sunset Drone & Surrounding Enclave' },
      { url: 'https://www.tiktok.com/@budi_luxury_bali/video/7192837492', platform: 'tiktok', title: 'Instagram Reel & Master Suite' }
    ],
    bookingEngine: {
      enabled: true,
      provider: 'siteminder',
      bookingUrl: 'https://direct-book.com/properties/theglasspavilionpererenan',
      buttonLabel: 'Direct Booking Engine (SiteMinder)',
      widgetEmbedCode: '<iframe src="https://direct-book.com/properties/theglasspavilionpererenan" width="100%" height="450" frameborder="0"></iframe>'
    },
    isHeroRotating: true,
    location: {
      city: 'Bali',
      area: 'Canggu / Pererenan',
      country: 'Indonesia',
      address: 'Jl. Pantai Pererenan No. 88, Mengwi, Bali',
      lat: -8.6478,
      lng: 115.1325
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4.5,
      maxGuests: 8,
      buildingSizeSqm: 420,
      landSizeSqm: 650,
      floors: 2,
      yearBuilt: 2023,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 45,
      serviceFeeUSD: 30,
      depositUSD: 200
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Private Infinity Pool',
      'High-Speed Fiber Wi-Fi (250 Mbps)',
      'Chef Kitchen & Espresso Bar',
      'Daily Housekeeping',
      'Air Conditioning in all rooms',
      'Dedicated Ergonomic Workspace',
      'Smart TV with Netflix',
      'Free Enclosed Parking',
      'Security 24/7'
    ],
    hostId: 'host-budi',
    rating: 4.98,
    reviewCount: 64,
    isFeatured: true,
    isSuperhost: true,
    status: 'active',
    createdAt: '2026-01-15',
    description: 'Designed by renowned Indonesian architects, The Glass Pavilion offers a serene sanctuary where indoor luxury merges seamlessly with lush tropical river valleys. Featuring sunken living spaces, a 16-meter saltwater infinity pool, and ultra-comfortable king master suites with terrazzo stone tubs. Enjoy private butler service, morning yoga on the lawn, and high-speed fiber internet.',
    neighborhoodInfo: {
      highlights: [
        '3 minutes to Pererenan Beach surf breaks',
        'Walking distance to top organic artisan cafes',
        'Peaceful and quiet residential cul-de-sac'
      ],
      placesNearby: [
        { name: 'Pererenan Beach', distance: '850 m', type: 'Beach / Surf' },
        { name: 'Woods Bali Artisan Bakery', distance: '300 m', type: 'Cafe & Dining' },
        { name: 'Ngurah Rai Int. Airport (DPS)', distance: '45 mins', type: 'Airport' }
      ]
    }
  },
  {
    id: 'prop-budi-2',
    title: 'Freehold Modern Sanctuary Villa - Canggu Center',
    tagline: 'High-ROI investment property with full SHM Freehold title and turnkey rental license',
    serviceType: 'sale',
    category: 'villa',
    priceUSD: 720000,
    pricePeriod: 'total',
    location: {
      city: 'Bali',
      area: 'Canggu / Batu Bolong',
      country: 'Indonesia',
      address: 'Jl. Nelayan No. 42, Canggu, Bali',
      lat: -8.6534,
      lng: 115.1382
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3.5,
      buildingSizeSqm: 310,
      landSizeSqm: 450,
      floors: 2,
      yearBuilt: 2024,
      certificateType: 'Freehold (SHM) + PBG / SLF Licensed',
      furnishing: 'Fully Furnished',
      depositUSD: 36000
    },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'SHM Freehold Certificate',
      'Turnkey Vacation Rental Management',
      'Private 12m Swimming Pool',
      'Solar Panel Energy System',
      'Carport with EV Charging',
      'Imported Italian Kitchen & Marble',
      'Soundproof Triple-Glazed Windows',
      'Projected 14.8% Net Annual ROI'
    ],
    hostId: 'host-budi',
    rating: 4.97,
    reviewCount: 38,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-01',
    description: 'A premier freehold asset in high demand Canggu Batu Bolong. Built with reinforced concrete, microcement walls, solid teak accents, and European fittings. Fully licensed for short-term daily hospitality letting with an established 88% average annual occupancy history managed by Budi Santoso and his team.',
    neighborhoodInfo: {
      highlights: [
        '500m to Nelayan and Batu Bolong beaches',
        'Direct road access with 6-meter asphalt street',
        'Prime tourist and digital nomad destination'
      ],
      placesNearby: [
        { name: 'Nelayan Beach', distance: '500 m', type: 'Beach' },
        { name: 'The Lawn Beach Club', distance: '1.1 km', type: 'Leisure' },
        { name: 'Canggu Community School', distance: '2.5 km', type: 'Education' }
      ]
    }
  },
  {
    id: 'prop-budi-3',
    title: '25-Year Commercial Shophouse & Creative Studio Lease',
    tagline: 'Prime double-frontage boutique retail & creative hub leasehold on main Canggu strip',
    serviceType: 'lease',
    category: 'commercial',
    priceUSD: 28000,
    pricePeriod: 'year',
    location: {
      city: 'Bali',
      area: 'Berawa / Canggu',
      country: 'Indonesia',
      address: 'Jl. Pantai Berawa No. 101, Tibubeneng, Bali',
      lat: -8.6612,
      lng: 115.1435
    },
    specs: {
      bedrooms: 1, // rooftop manager suite
      bathrooms: 3,
      buildingSizeSqm: 280,
      landSizeSqm: 220,
      floors: 3,
      yearBuilt: 2022,
      certificateType: 'Commercial Leasehold (Extendable)',
      furnishing: 'Semi Furnished',
      minLeaseMonths: 12,
      depositUSD: 5000
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'High Foot-Traffic Commercial Zoning',
      '3-Phase Industrial Electricity (16,500 VA)',
      'Floor-to-Ceiling Glass Showcase',
      'Rooftop Lounge & Sunset Deck',
      'Dedicated Customer Motorcycle & Car Parking',
      'Grease Trap & Kitchen Exhaust Installed'
    ],
    hostId: 'host-budi',
    rating: 4.94,
    reviewCount: 19,
    status: 'active',
    createdAt: '2026-02-10',
    description: 'Exceptional opportunity to establish a flagship cafe, retail boutique, wellness studio, or creative agency in Berawa. Available for flexible 3 to 25 year lease agreements with transparent extension clauses. Ground floor features high ceilings and polished terrazzo, second level provides open-plan coworking spaces, and third level boasts a sunset deck.',
    neighborhoodInfo: {
      highlights: [
        'Directly next to renowned lifestyle hotspots',
        '25,000+ daily vehicle and pedestrian exposure',
        'Complete commercial operational permits'
      ],
      placesNearby: [
        { name: 'Atlas Beach Fest & Finns', distance: '900 m', type: 'Lifestyle' },
        { name: 'Berawa Central Market', distance: '200 m', type: 'Shopping' }
      ]
    }
  },
  {
    id: 'prop-budi-4',
    title: 'The Sky Loft Residence at SCBD Sudirman',
    tagline: 'Ultra-luxurious corner suite with panoramic skyline views in Jakarta financial center',
    serviceType: 'rent',
    category: 'apartment',
    priceUSD: 2200,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    bookingEngine: {
      enabled: true,
      provider: 'book_and_link',
      bookingUrl: 'https://bookandlink.com/booking/scbd-sky-loft-jakarta',
      buttonLabel: 'Direct Booking Engine (Book and Link)',
      widgetEmbedCode: '<iframe src="https://bookandlink.com/booking/scbd-sky-loft-jakarta" width="100%" height="450" frameborder="0"></iframe>'
    },
    location: {
      city: 'Jakarta',
      area: 'SCBD / Senopati',
      country: 'Indonesia',
      address: 'Sudirman Central Business District Lot 28, Jakarta Selatan',
      lat: -6.2255,
      lng: 106.8095
    },
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      buildingSizeSqm: 145,
      floors: 1,
      yearBuilt: 2021,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 30,
      serviceFeeUSD: 20,
      depositUSD: 150
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Private Elevator Access',
      'Skyline Infinity Pool & Gym',
      '500 Mbps Dedicated Workspace',
      'Miele & Sub-Zero Kitchen Appliances',
      'Concierge & Valet 24/7',
      'Direct MRT Istora Link'
    ],
    hostId: 'host-budi',
    rating: 4.99,
    reviewCount: 45,
    isSuperhost: true,
    status: 'active',
    createdAt: '2026-01-20',
    description: 'Experience Jakarta from the highest vantage point. The Sky Loft offers an executive retreat equipped for corporate leaders, diplomat stays, and discerning travelers. Walking distance to Pacific Place mall, world-class dining on Senopati, and top corporate headquarters.',
    neighborhoodInfo: {
      highlights: [
        'Direct pedestrian skywalk to Pacific Place Mall',
        '2 minutes walk to Senopati gourmet strip',
        'Underground link to Istora Mandiri MRT station'
      ],
      placesNearby: [
        { name: 'Pacific Place Mall', distance: '150 m', type: 'Shopping & Dining' },
        { name: 'MRT Istora Mandiri', distance: '250 m', type: 'Metro' },
        { name: 'Soekarno-Hatta Int. Airport (CGK)', distance: '35 mins', type: 'Airport' }
      ]
    }
  },
  {
    id: 'prop-budi-5',
    title: 'Kuta Golden Sands Modern Beach Villa',
    tagline: 'Turnkey vacation villa walking distance to Kuta Beach & Beachwalk Mall',
    serviceType: 'rent',
    category: 'villa',
    priceUSD: 3200,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    location: {
      city: 'Bali',
      area: 'Kuta',
      country: 'Indonesia',
      address: 'Jl. Pantai Kuta Gg. Poppies II, Kuta, Bali',
      lat: -8.7185,
      lng: 115.1691
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      buildingSizeSqm: 260,
      landSizeSqm: 380,
      floors: 2,
      yearBuilt: 2023,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 35,
      serviceFeeUSD: 25,
      depositUSD: 150
    },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Private Swimming Pool',
      'High-Speed Wi-Fi',
      'Enclosed Air-Conditioned Living',
      'Walk to Kuta Beach (4 mins)',
      'Daily Housekeeping',
      'Airport Pick-up Available'
    ],
    hostId: 'host-budi',
    rating: 4.96,
    reviewCount: 41,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-12',
    description: 'A serene private sanctuary right in the heart of Kuta. Step out to sunset surf sessions, world-class beach clubs, and vibrant dining while enjoying absolute tranquility and privacy within your gated garden villa.',
    neighborhoodInfo: {
      highlights: [
        '4 minutes walk to Kuta Beach',
        '6 minutes walk to Beachwalk Shopping Center',
        '15 minutes to Ngurah Rai International Airport'
      ],
      placesNearby: [
        { name: 'Kuta Beach', distance: '350 m', type: 'Beach / Surf' },
        { name: 'Beachwalk Mall', distance: '500 m', type: 'Shopping & Dining' }
      ]
    }
  },
  {
    id: 'prop-budi-6',
    title: 'Ubud River Valley Freehold Estate',
    tagline: 'Rare freehold luxury designer home with jungle canopy and river views',
    serviceType: 'sale',
    category: 'villa',
    priceUSD: 590000,
    pricePeriod: 'total',
    location: {
      city: 'Bali',
      area: 'Ubud',
      country: 'Indonesia',
      address: 'Jl. Raya Sayan, Ubud, Gianyar, Bali',
      lat: -8.5145,
      lng: 115.2441
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4.5,
      buildingSizeSqm: 410,
      landSizeSqm: 850,
      floors: 2,
      yearBuilt: 2024,
      certificateType: 'Freehold (SHM)',
      furnishing: 'Fully Furnished',
      depositUSD: 30000
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'SHM Freehold Certificate',
      '14m Saltwater Infinity Pool',
      'Yoga Shala & Meditation Terrace',
      'Solar Panel Energy Integration',
      'Bespoke Teak & Travertine Finishes',
      'Enclosed Security Gate & Carport'
    ],
    hostId: 'host-budi',
    rating: 4.99,
    reviewCount: 29,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-15',
    description: 'Immerse in the spiritual serenity of Ubud. This freehold architectural masterpiece overlooks the pristine Ayung River valley. Built with reclaimed ironwood, natural stone, and German double-glazed glass panels.',
    neighborhoodInfo: {
      highlights: [
        'Overlooking sacred river valley',
        '7 minutes to Ubud Center and Monkey Forest',
        'Paved car access in private villa enclave'
      ],
      placesNearby: [
        { name: 'Sayan Valley Viewpoint', distance: '400 m', type: 'Scenic' },
        { name: 'Ubud Center', distance: '2.8 km', type: 'Culture & Dining' }
      ]
    }
  },
  {
    id: 'prop-budi-7',
    title: 'Seminyak Chic Courtyard Villa & Plunge Pool',
    tagline: 'Modern minimalist 2BR holiday villa near Kayu Aya Eat Street',
    serviceType: 'rent',
    category: 'villa',
    priceUSD: 2400,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    location: {
      city: 'Bali',
      area: 'Seminyak',
      country: 'Indonesia',
      address: 'Jl. Kayu Aya Gg. Astinapura, Seminyak, Bali',
      lat: -8.6872,
      lng: 115.1558
    },
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      buildingSizeSqm: 180,
      landSizeSqm: 250,
      floors: 1,
      yearBuilt: 2023,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 25,
      serviceFeeUSD: 18,
      depositUSD: 100
    },
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Private Swimming Pool',
      'Fiber Optic Wi-Fi 200 Mbps',
      'Open-Plan Tropical Living',
      'Steps to Top Seminyak Restaurants',
      'Daily Housekeeping Service'
    ],
    hostId: 'host-budi',
    rating: 4.95,
    reviewCount: 52,
    status: 'active',
    createdAt: '2026-02-18',
    description: 'The quintessential Seminyak getaway. Tucked quietly behind Kayu Aya (Eat Street), this sunlit 2-bedroom villa features open living, tropical landscaping, and a refreshing pool just minutes from Petitenget Beach.',
    neighborhoodInfo: {
      highlights: [
        '2 minutes walk to Seminyak Eat Street (Ultimo, Sisterfields)',
        '10 minutes walk to Petitenget Beach & KU DE TA',
        'Private and quiet residential alley'
      ],
      placesNearby: [
        { name: 'Eat Street (Kayu Aya)', distance: '150 m', type: 'Dining' },
        { name: 'Petitenget Beach', distance: '850 m', type: 'Beach' }
      ]
    }
  },
  {
    id: 'prop-budi-8',
    title: 'Uluwatu Ocean View Freehold Villa',
    tagline: 'Spectacular sunset ocean views from cliff plateau in Pecatu Uluwatu',
    serviceType: 'sale',
    category: 'villa',
    priceUSD: 850000,
    pricePeriod: 'total',
    location: {
      city: 'Bali',
      area: 'Uluwatu',
      country: 'Indonesia',
      address: 'Jl. Labuansait No. 55, Pecatu, Uluwatu, Bali',
      lat: -8.8124,
      lng: 115.1092
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      buildingSizeSqm: 460,
      landSizeSqm: 700,
      floors: 2,
      yearBuilt: 2024,
      certificateType: 'Freehold (SHM)',
      furnishing: 'Fully Furnished',
      depositUSD: 40000
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'SHM Freehold Certificate',
      'Panoramic Ocean Sunset View',
      '15m Infinity Horizon Pool',
      'Rooftop Sunset Lounge & Bar',
      'High Vacation Rental Yield'
    ],
    hostId: 'host-budi',
    rating: 4.98,
    reviewCount: 35,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-20',
    description: 'Elevated luxury living in southern Bali. Experience panoramic sunset vistas over Padang Padang and Bingin surf breaks. Fully furnished with Italian minimalist furniture and private pool.',
    neighborhoodInfo: {
      highlights: [
        '5 minutes to Padang Padang Beach',
        '8 minutes to Uluwatu Temple & Sunset Point',
        'Gated residential luxury enclave'
      ],
      placesNearby: [
        { name: 'Padang Padang Beach', distance: '1.2 km', type: 'Beach' },
        { name: 'Single Fin Bali', distance: '2.5 km', type: 'Lounge' }
      ]
    }
  },
  {
    id: 'prop-budi-land-1',
    title: 'Tanah Kavling SHM Sunset Canggu 600m²',
    tagline: 'Peluang investasi tanah emas di area premium Canggu dengan jalan aspal 6 meter',
    serviceType: 'sale',
    category: 'land',
    priceUSD: 395000,
    pricePeriod: 'total',
    aiGenerated: true,
    location: {
      city: 'Bali',
      area: 'Canggu',
      country: 'Indonesia',
      address: 'Jl. Padang Linjong No. 22, Canggu, Bali',
      lat: -8.6492,
      lng: 115.1311
    },
    specs: {
      bedrooms: 0,
      bathrooms: 0,
      buildingSizeSqm: 0,
      landSizeSqm: 600,
      certificateType: 'Freehold (SHM) Clean & Clear',
      furnishing: 'Unfurnished'
    },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'SHM Freehold Certificate',
      'Zonasi Pariwisata / Pemukiman',
      'Akses Jalan Aspal 6 Meter',
      'Jaringan Listrik PLN & PDAM Tersedia',
      'Lingkungan Villa Mewah & Tenang'
    ],
    hostId: 'host-budi',
    rating: 5.0,
    reviewCount: 14,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-25',
    description: 'Tanah kavling langka di pusat pariwisata Canggu Padang Linjong. Cocok untuk pembangunan 2-3 luxury rental villa dengan tingkat ROI tinggi.',
    neighborhoodInfo: {
      highlights: ['4 menit ke Pantai Echo Beach', 'Dekat cafe ternama Canggu'],
      placesNearby: [{ name: 'Echo Beach', distance: '1.1 km', type: 'Beach' }]
    }
  },
  {
    id: 'prop-budi-ruko-1',
    title: 'Ruko Prime 3 Lantai Double Frontage SCBD',
    tagline: 'Sewa ruko strategis di jalur bisnis utama Jakarta Selatan untuk kantor, klinik atau cafe',
    serviceType: 'rent',
    category: 'ruko',
    priceUSD: 2400,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    aiGenerated: true,
    location: {
      city: 'Jakarta',
      area: 'SCBD / Senopati',
      country: 'Indonesia',
      address: 'Jl. Senopati Raya No. 45, Kebayoran Baru, Jakarta Selatan',
      lat: -6.2301,
      lng: 106.8089
    },
    specs: {
      bedrooms: 1,
      bathrooms: 3,
      buildingSizeSqm: 260,
      landSizeSqm: 120,
      floors: 3,
      furnishing: 'Semi Furnished',
      certificateType: 'HGB Komersial'
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Double Frontage Kaca Tempered',
      'Parkir Mobil & Motor Representatif',
      'Listrik 16.500 VA 3 Phase',
      'Keamanan 24 Jam CCTV',
      'AC Central Terpasang'
    ],
    hostId: 'host-budi',
    rating: 4.95,
    reviewCount: 22,
    status: 'active',
    createdAt: '2026-02-28',
    description: 'Ruko komersial 3 lantai siap pakai di koridor gourmet and business Senopati SCBD. Sangat cocok untuk kantor agency, klinik kecantikan, showroom boutique, atau coffee shop premium.',
    neighborhoodInfo: {
      highlights: ['Jantung pusat kuliner Senopati', 'Akses mudah dari Sudirman'],
      placesNearby: [{ name: 'MRT Senayan', distance: '600 m', type: 'Transit' }]
    }
  },
  {
    id: 'prop-budi-house-1',
    title: 'Rumah Modern Minimalis Sanur Gated Compound',
    tagline: 'Sewa tahunan rumah keluarga 3 kamar dengan taman privat dan lingkungan ekspatriat tenang',
    serviceType: 'rent',
    category: 'house',
    priceUSD: 16000,
    pricePeriod: 'year',
    rentDurationPeriod: 'yearly',
    aiGenerated: true,
    location: {
      city: 'Bali',
      area: 'Sanur',
      country: 'Indonesia',
      address: 'Jl. Danau Tamblingan Gg. Sari No. 8, Sanur, Bali',
      lat: -8.6945,
      lng: 115.2592
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      buildingSizeSqm: 220,
      landSizeSqm: 280,
      floors: 2,
      furnishing: 'Fully Furnished',
      certificateType: 'SHM Residential'
    },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Taman Hijau & Kolam Renang Mini',
      'Dapur Kitchen Set European Modern',
      'Carport 2 Mobil Tertutup',
      'Internet Fiber 150 Mbps',
      'Dekat Sekolah Internasional Sanur'
    ],
    hostId: 'host-budi',
    rating: 4.97,
    reviewCount: 18,
    status: 'active',
    createdAt: '2026-03-01',
    description: 'Rumah tinggal modern 2 lantai di Sanur Selatan. Lingkungan sangat ramah keluarga, bersih, dan hanya 5 menit berkendara ke pantai berpasir putih Sanur.',
    neighborhoodInfo: {
      highlights: ['5 menit ke Pantai Sanur', 'Dekat Bali Island School'],
      placesNearby: [{ name: 'Sanur Beach', distance: '1.2 km', type: 'Beach' }]
    }
  },
  {
    id: 'prop-budi-business-1',
    title: 'Tempat Usaha Cafe & Resto Siap Pakai di Berawa',
    tagline: 'Takeover / Dijual tempat usaha komersial lengkap peralatan dan izin operasional',
    serviceType: 'sale',
    category: 'business',
    priceUSD: 185000,
    pricePeriod: 'total',
    aiGenerated: true,
    location: {
      city: 'Bali',
      area: 'Canggu / Berawa',
      country: 'Indonesia',
      address: 'Jl. Pantai Berawa No. 64, Tibubeneng, Bali',
      lat: -8.6588,
      lng: 115.1415
    },
    specs: {
      bedrooms: 1,
      bathrooms: 2,
      buildingSizeSqm: 240,
      landSizeSqm: 200,
      floors: 2,
      furnishing: 'Fully Furnished',
      certificateType: 'Izin Usaha Restoran & Sewa Panjang'
    },
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Peralatan Dapur Komersial Lengkap',
      'Espresso Machine La Marzocco',
      'Kapasitas Duduk 75 Pax',
      'Grease Trap & Cerobong Exhaust',
      'Sistem POS Kasir & Sound System'
    ],
    hostId: 'host-budi',
    rating: 4.93,
    reviewCount: 27,
    status: 'active',
    createdAt: '2026-03-02',
    description: 'Kesempatan emas memiliki bisnis kuliner berjalan di jalur emas Pantai Berawa Canggu. Omset stabil dengan pelanggan setia harian wisatawan mancanegara.',
    neighborhoodInfo: {
      highlights: ['Traffic padat turis mancanegara', 'Parkir motor & mobil siap'],
      placesNearby: [{ name: 'Finns Beach Club', distance: '800 m', type: 'Club' }]
    }
  },
  {
    id: 'prop-budi-warehouse-1',
    title: 'Gudang Logistik Modern Akses Kontainer By Pass',
    tagline: 'Sewa tahunan gudang logistik dan distribusi tinggi plafon 9m bebas banjir',
    serviceType: 'rent',
    category: 'warehouse',
    priceUSD: 36000,
    pricePeriod: 'year',
    rentDurationPeriod: 'yearly',
    aiGenerated: true,
    location: {
      city: 'Bali',
      area: 'Kuta',
      country: 'Indonesia',
      address: 'Jl. Bypass Ngurah Rai No. 808, Kuta, Bali',
      lat: -8.7312,
      lng: 115.1852
    },
    specs: {
      bedrooms: 0,
      bathrooms: 2,
      buildingSizeSqm: 850,
      landSizeSqm: 1200,
      floors: 1,
      furnishing: 'Unfurnished',
      certificateType: 'SHGB Industri & Pergudangan'
    },
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Akses Kontainer 40 Feet',
      'Lantai Cor Beton Bertulang K-300',
      'Loading Dock Luas',
      'Plafon Tinggi 9 Meter',
      'Pos Security 24 Jam'
    ],
    hostId: 'host-budi',
    rating: 4.96,
    reviewCount: 9,
    status: 'active',
    createdAt: '2026-03-03',
    description: 'Gudang modern berstandar industri logistik di jalur arteri Bypass Ngurah Rai. Sangat strategis untuk pusat suplai retail, cold storage, dan ekspedisi antar pulau.',
    neighborhoodInfo: {
      highlights: ['8 menit ke Bandara Ngurah Rai', '15 menit ke Pelabuhan Benoa'],
      placesNearby: [{ name: 'Bandara DPS', distance: '3.5 km', type: 'Airport' }]
    }
  },
  {
    id: 'prop-budi-kost-1',
    title: 'Kost Eksklusif 16 Kamar AC Dekat Kampus & SCBD',
    tagline: 'Sewa bulanan kamar kost mewah dengan fasilitas hotel bintang, WiFi cepat dan dapur komunal',
    serviceType: 'rent',
    category: 'kost',
    priceUSD: 280,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    aiGenerated: true,
    location: {
      city: 'Jakarta',
      area: 'SCBD / Senopati',
      country: 'Indonesia',
      address: 'Jl. Birah Raya No. 16, Kebayoran Baru, Jakarta Selatan',
      lat: -6.2345,
      lng: 106.8123
    },
    specs: {
      bedrooms: 16,
      bathrooms: 16,
      buildingSizeSqm: 450,
      landSizeSqm: 380,
      floors: 3,
      furnishing: 'Fully Furnished',
      certificateType: 'SHM'
    },
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Kamar Mandi Dalam & Water Heater',
      'Smart TV & AC Tiap Kamar',
      'Springbed King Koil & Meja Kerja',
      'WiFi Fiber 300 Mbps',
      'Akses Pintu Smart Lock Card 24 Jam'
    ],
    hostId: 'host-budi',
    rating: 4.98,
    reviewCount: 36,
    status: 'active',
    createdAt: '2026-03-04',
    description: 'Hunian coliving dan kost eksklusif favorit profesional muda dan pekerja kantoran SCBD Sudirman. Bersih, tenang, fasilitas lengkap layaknya hotel butik.',
    neighborhoodInfo: {
      highlights: ['Jalan kaki ke area perkantoran SCBD', 'Dekat pusat kuliner Senopati'],
      placesNearby: [{ name: 'Pacific Place', distance: '700 m', type: 'Mall' }]
    }
  },
  {
    id: 'prop-budi-hotel-1',
    title: 'Deluxe Suite Condotel & Resort Room Seminyak',
    tagline: 'Sewa bulanan suite hotel resort bintang 4 dengan akses kolam lagoon dan sarapan',
    serviceType: 'rent',
    category: 'hotel_room',
    priceUSD: 1100,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    aiGenerated: true,
    location: {
      city: 'Bali',
      area: 'Seminyak',
      country: 'Indonesia',
      address: 'Jl. Camplung Tanduk No. 99, Seminyak, Bali',
      lat: -8.6912,
      lng: 115.1601
    },
    specs: {
      bedrooms: 1,
      bathrooms: 1,
      buildingSizeSqm: 58,
      floors: 1,
      furnishing: 'Fully Furnished',
      certificateType: 'Strata Title Condotel'
    },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Akses Lagoon Pool & Fitness Center',
      'Layanan Housekeeping 2x Seminggu',
      'Balkon Luas Menghadap Sunset',
      'Bathtub Marmer & Rain Shower',
      'Room Service & Resepsionis 24 Jam'
    ],
    hostId: 'host-budi',
    rating: 4.97,
    reviewCount: 42,
    status: 'active',
    createdAt: '2026-03-05',
    description: 'Suite kamar hotel mewah siap huni bulanan untuk digital nomad dan eksekutif di Seminyak. Menikmati kemewahan resort bintang 4 dengan harga bulanan ekonomis.',
    neighborhoodInfo: {
      highlights: ['250m ke Pantai Seminyak', 'Dikelilingi beach club ternama'],
      placesNearby: [{ name: 'Seminyak Beach', distance: '250 m', type: 'Beach' }]
    }
  },

  // SARAH JENKINS PROPERTIES
  {
    id: 'prop-sarah-1',
    title: 'Marina Horizon Sky Penthouse',
    tagline: 'Triplex penthouse with private rooftop pool overlooking Marina Bay Sands',
    serviceType: 'sale',
    category: 'penthouse',
    priceUSD: 4850000,
    pricePeriod: 'total',
    location: {
      city: 'Singapore',
      area: 'Marina Bay / Downtown',
      country: 'Singapore',
      address: '10 Marina Boulevard, Singapore 018983',
      lat: 1.2804,
      lng: 103.8546
    },
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      buildingSizeSqm: 520,
      floors: 3,
      yearBuilt: 2023,
      certificateType: 'Strata Title 99-Year Leasehold',
      furnishing: 'Fully Furnished',
      depositUSD: 240000
    },
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Private 10m Sky Pool',
      'Wine Cellar & Tasting Room',
      'Dual Key Elevator Foyer',
      'Full Marina Bay Fireworks View',
      'Clubhouse & Tennis Courts',
      '2 Dedicated Basement Supercar Lots'
    ],
    hostId: 'host-sarah',
    rating: 4.96,
    reviewCount: 31,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-01-10',
    description: 'An iconic pinnacle residence in Singapore downtown core. Designed for high-net-worth families, this triplex residence pairs double-height ceiling voids with unencumbered views of the Singapore Strait and Gardens by the Bay.',
    neighborhoodInfo: {
      highlights: [
        'Direct link to Marina Bay Financial Centre',
        'Steps to Michelin-starred dining',
        'Seamless transport links'
      ],
      placesNearby: [
        { name: 'Marina Bay Sands', distance: '400 m', type: 'Landmark' },
        { name: 'Raffles Place MRT', distance: '300 m', type: 'Transport' }
      ]
    }
  },
  {
    id: 'prop-sarah-2',
    title: 'Orchard Boulevard Executive Residence',
    tagline: 'Contemporary 3-bedroom apartment for long-term expat corporate lease',
    serviceType: 'lease',
    category: 'apartment',
    priceUSD: 8500,
    pricePeriod: 'month',
    location: {
      city: 'Singapore',
      area: 'Orchard / Tanglin',
      country: 'Singapore',
      address: '28 Orchard Boulevard, Singapore 248643',
      lat: 1.3048,
      lng: 103.8298
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      buildingSizeSqm: 180,
      floors: 1,
      yearBuilt: 2022,
      furnishing: 'Fully Furnished',
      minLeaseMonths: 12,
      depositUSD: 17000
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Olympic-Length Lap Pool',
      'Private Dining Pavilion',
      'Direct Elevator to Foyer',
      '24-Hour Concierge & Security',
      'Pet Friendly with Garden Walk'
    ],
    hostId: 'host-sarah',
    rating: 4.93,
    reviewCount: 22,
    status: 'active',
    createdAt: '2026-02-05',
    description: 'Luxurious corporate tenancy property situated on quiet Orchard Boulevard. Fully outfitted with Minotti Italian furniture and Gaggenau kitchen appliances. Ideal for executives and diplomats seeking prime city central address.',
    neighborhoodInfo: {
      highlights: [
        '3 minutes walk to Orchard Boulevard TEL MRT',
        'Close to Singapore Botanic Gardens (UNESCO)',
        'Adjacent to international embassies'
      ],
      placesNearby: [
        { name: 'ION Orchard', distance: '600 m', type: 'Shopping' },
        { name: 'Singapore Botanic Gardens', distance: '1.2 km', type: 'Park' }
      ]
    }
  },
  {
    id: 'prop-sarah-3',
    title: 'The Botanica Sky Suite & Garden Terrace',
    tagline: 'Ultra-modern 2-bedroom serviced penthouse suite available for monthly expat rental',
    serviceType: 'rent',
    category: 'apartment',
    priceUSD: 3400,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    location: {
      city: 'Jakarta',
      area: 'Senopati / SCBD',
      country: 'Indonesia',
      address: 'Jl. Senopati Raya No. 44, Kebayoran Baru, Jakarta Selatan',
      lat: -6.2312,
      lng: 106.8122
    },
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      buildingSizeSqm: 145,
      floors: 1,
      yearBuilt: 2023,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 40,
      serviceFeeUSD: 30,
      depositUSD: 1000
    },
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Infinity Heated Rooftop Pool',
      'Private High-Speed Fiber Internet (300 Mbps)',
      'Direct Lift Access with Keycard',
      'Designer Poggenpohl Kitchen',
      'Bi-Weekly Housekeeping & Linen Service',
      'Walking Distance to Senopati Cafes'
    ],
    hostId: 'host-sarah',
    rating: 4.98,
    reviewCount: 18,
    status: 'active',
    createdAt: '2026-02-20',
    description: 'Designed for discerning international executives, this turnkey serviced residence in vibrant Senopati blends understated Japanese-Scandinavian aesthetics with five-star residential services. Walking distance to ASHTA District 8 and premier dining.',
    neighborhoodInfo: {
      highlights: [
        'Heart of Senopati culinary district',
        '5 minutes drive to SCBD financial core',
        '24/7 concierge and biometric building access'
      ],
      placesNearby: [
        { name: 'ASHTA District 8 SCBD', distance: '500 m', type: 'Shopping' },
        { name: 'Senopati Culinary Strip', distance: '100 m', type: 'Dining' }
      ]
    }
  },

  // CITRA DEWI (ECO RETREATS & VILLAS)
  {
    id: 'prop-citra-1',
    title: 'The Bamboo Cathedral & River Sanctuary',
    tagline: 'Award-winning eco-architectural bamboo estate nestled above Ayung River',
    serviceType: 'rent',
    category: 'villa',
    priceUSD: 4500,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    location: {
      city: 'Bali',
      area: 'Ubud / Sayan',
      country: 'Indonesia',
      address: 'Jl. Raya Sayan No. 120, Ubud, Bali',
      lat: -8.5069,
      lng: 115.2426
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      maxGuests: 8,
      buildingSizeSqm: 550,
      landSizeSqm: 1200,
      floors: 3,
      yearBuilt: 2023,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 50,
      serviceFeeUSD: 35,
      depositUSD: 250
    },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Natural Springwater Plunge Pool',
      'Yoga Shala & Meditation Deck',
      'Chef-Prepared Organic Breakfast Included',
      'River Valley & Jungle Canopy Views',
      '100% Solar & Geothermal Air Cooling',
      'High-Speed Starlink Internet (220 Mbps)'
    ],
    hostId: 'host-citra',
    rating: 4.99,
    reviewCount: 118,
    isFeatured: true,
    isSuperhost: true,
    status: 'active',
    createdAt: '2026-01-05',
    description: 'Constructed entirely from sustainable black and blonde petung bamboo, The Bamboo Cathedral offers an awe-inspiring union of organic geometry and contemporary comfort. Listen to the gentle murmurs of the Ayung river, enjoy morning sound healings, and unwind in handcrafted copper soaking tubs.',
    neighborhoodInfo: {
      highlights: [
        'Surrounded by protected jungle reserves',
        '8 minutes to Ubud Center & Monkey Forest',
        'Private walking trail down to the sacred river'
      ],
      placesNearby: [
        { name: 'Ubud Palace', distance: '3.2 km', type: 'Cultural Site' },
        { name: 'Locavore NXT', distance: '2.5 km', type: 'Fine Dining' }
      ]
    }
  },
  {
    id: 'prop-citra-2',
    title: 'Cliffside Oceanfront Villa & Private Beach Access',
    tagline: 'Perched 70 meters above the Indian Ocean with unobstructed sunset vistas',
    serviceType: 'rent',
    category: 'beachfront',
    priceUSD: 58000,
    pricePeriod: 'year',
    rentDurationPeriod: 'yearly',
    location: {
      city: 'Bali',
      area: 'Uluwatu / Bingin',
      country: 'Indonesia',
      address: 'Jl. Pantai Bingin, Pecatu, Bali',
      lat: -8.8055,
      lng: 115.1132
    },
    specs: {
      bedrooms: 5,
      bathrooms: 5.5,
      maxGuests: 10,
      buildingSizeSqm: 680,
      landSizeSqm: 950,
      floors: 2,
      yearBuilt: 2024,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 60,
      serviceFeeUSD: 45,
      depositUSD: 300
    },
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Cliff Edge Heated Infinity Pool',
      'Private Incline Lift to Bingin Beach',
      'Outdoor Cinema & Fire Pit',
      'Private Chef & Butler Staff',
      'Gym & Finnish Sauna',
      'Sonos Architectural Sound System'
    ],
    hostId: 'host-citra',
    rating: 4.98,
    reviewCount: 84,
    isSuperhost: true,
    status: 'active',
    createdAt: '2026-01-28',
    description: 'An unparalleled cliff-edge sanctuary in Bingin, Uluwatu. Gaze across turquoise surf breaks where you can watch world-class surfers from your daybed or take your private cliff lift down to the golden sand.',
    neighborhoodInfo: {
      highlights: [
        'Direct access to Bingin Beach',
        '5 minutes to Uluwatu Temple',
        'Unmatched year-round sunsets'
      ],
      placesNearby: [
        { name: 'Bingin Beach', distance: 'Direct Lift', type: 'Beach' },
        { name: 'Single Fin Uluwatu', distance: '1.8 km', type: 'Sunset Lounge' }
      ]
    }
  },

  // KENJI SATO (TOKYO)
  {
    id: 'prop-kenji-1',
    title: 'Minimalist Shibuya Design Studio & Terrace',
    tagline: 'Curated architect-designed apartment steps from Yoyogi Park & Shibuya Crossing',
    serviceType: 'rent',
    category: 'apartment',
    priceUSD: 2200,
    pricePeriod: 'month',
    rentDurationPeriod: 'monthly',
    location: {
      city: 'Tokyo',
      area: 'Shibuya / Tomigaya',
      country: 'Japan',
      address: '1-14 Tomigaya, Shibuya-ku, Tokyo 151-0063',
      lat: 35.6645,
      lng: 139.6898
    },
    specs: {
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      buildingSizeSqm: 58,
      floors: 1,
      yearBuilt: 2022,
      furnishing: 'Fully Furnished',
      cleaningFeeUSD: 25,
      serviceFeeUSD: 18,
      depositUSD: 100
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Balmuda Kitchen Appliances',
      'Hinoki Cypress Wooden Soaking Tub',
      'Pocket Wi-Fi + High Speed Home Fiber',
      'Japanese Washlet Toilet',
      'Floor Heating & Daikin Climate Control'
    ],
    hostId: 'host-kenji',
    rating: 4.97,
    reviewCount: 92,
    isSuperhost: true,
    status: 'active',
    createdAt: '2026-02-03',
    description: 'Located in fashionable "Okushibu" (Deep Shibuya/Tomigaya), this refined studio combines Scandinavian ergonomics with warm Japanese cedar woodwork. Enjoy morning artisanal espresso at Fuglen coffee and serene morning strolls through Yoyogi park.',
    neighborhoodInfo: {
      highlights: [
        '5 mins walk to Yoyogi-Koen Station',
        'Surrounded by world-famous boutique bakeries and vinyl bars',
        'Safe, tree-lined residential enclave'
      ],
      placesNearby: [
        { name: 'Yoyogi Park', distance: '350 m', type: 'Park' },
        { name: 'Shibuya Crossing', distance: '1.1 km', type: 'Landmark' }
      ]
    }
  },
  {
    id: 'prop-kenji-2',
    title: 'Ginza Prime Commercial Ground Floor Leasehold',
    tagline: 'High-visibility luxury retail boutique location on Ginza 6th Avenue corridor',
    serviceType: 'lease',
    category: 'commercial',
    priceUSD: 14500,
    pricePeriod: 'month',
    location: {
      city: 'Tokyo',
      area: 'Ginza / Chuo-ku',
      country: 'Japan',
      address: '6-8-3 Ginza, Chuo City, Tokyo 104-0061',
      lat: 35.6702,
      lng: 139.7634
    },
    specs: {
      bedrooms: 0,
      bathrooms: 2,
      buildingSizeSqm: 125,
      floors: 1,
      yearBuilt: 2021,
      certificateType: 'Standard Commercial Lease',
      furnishing: 'Unfurnished',
      minLeaseMonths: 24,
      depositUSD: 43500
    },
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Heavy Foot Traffic Premium Retail District',
      'Floor-to-Ceiling Glass Facade',
      'Independent HVAC System',
      'Commercial Freight Elevator Access'
    ],
    hostId: 'host-kenji',
    rating: 4.9,
    reviewCount: 14,
    status: 'active',
    createdAt: '2026-01-18',
    description: 'Premier turnkey ground-floor commercial space in Ginza district. Suitable for flagship watchmaker, jewelry brand, designer showroom, or specialty cafe concept with high pedestrian density.',
    neighborhoodInfo: {
      highlights: [
        'Surrounded by world-renowned luxury flagships',
        '2 minutes from Ginza Station exit A2'
      ],
      placesNearby: [
        { name: 'GINZA SIX', distance: '120 m', type: 'Luxury Mall' },
        { name: 'Ginza Station', distance: '180 m', type: 'Subway' }
      ]
    }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Sydney, Australia',
    rating: 5,
    date: 'February 2026',
    comment: 'Budi was an outstanding host! The Glass Pavilion villa in Pererenan exceeded all expectations. Fast Wi-Fi for remote work, incredible pool, and Budi arranged scooter rentals and airport transport seamlessly. 10/10 will book through proplis.com/budi again.',
    stayType: 'Stayed 7 nights - The Glass Pavilion'
  },
  {
    id: 'rev-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Zurich, Switzerland',
    rating: 5,
    date: 'January 2026',
    comment: 'We closed our freehold villa purchase in Canggu with Budi Santoso. Very transparent paperwork, verified land certificate, and honest advisory. Having his direct agent storefront made sharing listings with our family super easy.',
    stayType: 'Purchased Freehold Villa - Canggu'
  },
  {
    id: 'rev-3',
    authorName: 'David Lee',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Singapore',
    rating: 5,
    date: 'January 2026',
    comment: 'Citra eco-bamboo sanctuary in Ubud is pure magic. The tranquility, river sound, and organic breakfast made it our best holiday ever.',
    stayType: 'Stayed 4 nights - Bamboo Cathedral'
  }
];
