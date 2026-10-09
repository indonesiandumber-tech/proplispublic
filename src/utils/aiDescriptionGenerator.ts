import { GoogleGenAI } from '@google/genai';
import { PropertyCategory, ServiceType } from '../types';

export type AITone = 'luxury' | 'investment' | 'family' | 'commercial' | 'expat';
export type AILanguage = 'id' | 'en' | 'bilingual';

export interface SEOPackage {
  titleTag: string; // Optimal: 50-60 characters
  metaDescription: string; // Optimal: 150-160 characters
  urlSlug: string;
  focusKeywords: string[];
  secondaryKeywords: string[];
  searchSnippetPreview: {
    title: string;
    url: string;
    snippet: string;
  };
}

export interface GoogleAdsPackage {
  headlines: string[]; // 3 to 5 headlines, STRICT max 30 characters each
  descriptions: string[]; // 2 to 3 descriptions, STRICT max 90 characters each
  displayPath1: string; // Max 15 chars (e.g. "Sewa" or "Bali")
  displayPath2: string; // Max 15 chars (e.g. "Villa" or "Diskon")
  callouts: string[]; // E.g. ["SHM Ready", "Private Pool", "Direct WhatsApp"]
}

export interface AIDescriptionInput {
  // Agent writes description first, AI polishes it
  draftDescription?: string;

  // Configuration options requested by user
  useEmojis?: boolean; // Default true, controls emoji inclusion
  seoFriendly?: boolean; // Default true, generates SEO title, meta & keywords
  googleAdsReady?: boolean; // Default true, generates Google Search Ad copy (30 & 90 char limits)

  category: PropertyCategory;
  serviceType: ServiceType;
  rentPeriod?: 'monthly' | 'yearly' | 'daily';
  title?: string;
  city: string;
  area: string;
  address?: string;
  priceFormatted?: string;
  bedrooms?: number;
  bathrooms?: number;
  buildingSize?: number;
  landSize?: number;
  floors?: number;
  furnishing?: string;
  certificateType?: string;
  amenities?: string[];
  keywords?: string[];
  tone?: AITone;
  language?: AILanguage;
  agentName?: string;
  agentPhone?: string;
}

export interface AIGeneratedResult {
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  whatsappBroadcast: string;
  socialCaption: string;
  seo?: SEOPackage;
  googleAds?: GoogleAdsPackage;
  useEmojis: boolean;
  source: 'gemini' | 'engine';
}

const CATEGORY_NAMES_ID: Record<PropertyCategory, string> = {
  land: 'Tanah Kavling',
  ruko: 'Ruko / Shophouse Komersial',
  house: 'Rumah Tinggal Modern',
  villa: 'Luxury Villa Private Pool',
  apartment: 'Apartemen Eksklusif',
  business: 'Tempat Usaha & Bisnis Komersial',
  warehouse: 'Gudang Logistik & Industri',
  kost: 'Kost Eksklusif & Coliving',
  hotel_room: 'Kamar Hotel Suite & Resort Condotel',
  commercial: 'Properti Komersial',
  beachfront: 'Properti Beachfront Pinggir Pantai',
  penthouse: 'Sky Penthouse Mewah',
  townhouse: 'Townhouse Modern'
};

const CATEGORY_NAMES_EN: Record<PropertyCategory, string> = {
  land: 'Prime Land Plot',
  ruko: 'Commercial Shophouse / Ruko',
  house: 'Modern Residential House',
  villa: 'Luxury Private Pool Villa',
  apartment: 'Exclusive High-Rise Apartment',
  business: 'Commercial Business Space / Retail',
  warehouse: 'Modern Logistics & Industrial Warehouse',
  kost: 'Exclusive Kost & Coliving Residence',
  hotel_room: 'Deluxe Hotel Room Suite & Condotel',
  commercial: 'Commercial Property',
  beachfront: 'Beachfront Oceanview Property',
  penthouse: 'Luxury Sky Penthouse',
  townhouse: 'Modern Townhouse'
};

export async function generatePropertyDescriptionAI(input: AIDescriptionInput): Promise<AIGeneratedResult> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';
  const useEmojis = input.useEmojis !== false;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildGeminiPrompt(input);
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || '';
      const parsed = parseGeminiResponse(responseText, input);
      if (parsed) {
        return {
          ...parsed,
          useEmojis,
          source: 'gemini'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to real estate copy engine:', err);
    }
  }

  // Domain copywriting engine fallback
  return generateDomainEngineDescription(input);
}

function buildGeminiPrompt(input: AIDescriptionInput): string {
  const catEn = CATEGORY_NAMES_EN[input.category] || input.category;
  const isRent = input.serviceType === 'rent';
  const rentType = input.rentPeriod === 'monthly' ? 'Monthly Rent (Sewa Bulanan)' : input.rentPeriod === 'yearly' ? 'Yearly Rent (Sewa Tahunan)' : 'Rental';
  const purpose = isRent ? rentType : input.serviceType === 'sale' ? 'For Sale / Dijual' : 'Commercial Lease';
  const useEmojis = input.useEmojis !== false;
  const seoFriendly = input.seoFriendly !== false;
  const googleAdsReady = input.googleAdsReady !== false;

  return `You are an elite real estate copywriter & ad strategist.
Your task is to take an AGENT'S RAW DRAFT DESCRIPTION and listing specifications, and POLISH IT into high-converting, professional listing copy, plus optional SEO metadata and Google Ads search campaign copy.

AGENT'S INITIAL RAW DRAFT NOTES:
"""
${input.draftDescription && input.draftDescription.trim() ? input.draftDescription.trim() : 'No draft provided, craft directly from specifications below.'}
"""

LISTING SPECIFICATIONS:
- Category: ${catEn} (${input.category})
- Purpose: ${purpose}
- Location: ${input.area}, ${input.city} (Address: ${input.address || 'Prime road'})
- Price: ${input.priceFormatted || 'Contact Agent'}
- Bedrooms: ${input.bedrooms || '-'} | Bathrooms: ${input.bathrooms || '-'}
- Building Size: ${input.buildingSize ? input.buildingSize + ' m²' : '-'} | Land Size: ${input.landSize ? input.landSize + ' m²' : '-'}
- Furnishing: ${input.furnishing || 'Fully Furnished'}
- Certificate / Deed: ${input.certificateType || 'SHM / Clean Title'}
- Key Amenities: ${(input.amenities || []).join(', ')}
- USPs / Keywords: ${(input.keywords || []).join(', ')}
- Tone Style: ${input.tone || 'luxury'}
- Target Language: ${input.language === 'id' ? 'Bahasa Indonesia' : input.language === 'en' ? 'English' : 'Bilingual (ID + EN)'}

CRITICAL RULES:
1. DRAFT POLISHING: Polish the agent's draft into fluent, persuasive, structured real-estate prose. Highlight key selling points, neighborhood perks, and an urgent call-to-action.
2. EMOJI POLICY: ${useEmojis ? 'USE tasteful, premium real-estate emojis (🏡, ✨, 📍, 🏊‍♂️, 📜, 🔑, 📲).' : 'DO NOT USE ANY EMOJIS WHATSOEVER. Keep the prose 100% formal and text-only.'}
3. SEO FRIENDLY: ${seoFriendly ? 'Generate a title tag (max 60 characters) and meta description (max 155 characters) packed with high search intent keywords.' : 'Provide basic title and summary.'}
4. GOOGLE ADS READY: ${googleAdsReady ? 'Generate 3 to 5 Google Search Ads headlines (EACH STRICTLY MAXIMUM 30 CHARACTERS) and 2 to 3 descriptions (EACH STRICTLY MAXIMUM 90 CHARACTERS). Character limits are strictly enforced by Google.' : 'Omit Google Ads.'}

Return your response strictly in the following JSON format without Markdown code fences:
{
  "title": "Short catchy listing title (max 70 chars)",
  "tagline": "One punchy subtitle highlighting top feature (max 110 chars)",
  "highlights": ["3-5 crisp bullet points of standout features"],
  "description": "Full structured polished description with paragraph hooks, specs breakdown, location accessibility, and closing call to action",
  "whatsappBroadcast": "Formatted ready-to-share WhatsApp broadcast text with bullet points, price, and CTA",
  "socialCaption": "Engaging Instagram/TikTok caption with hashtags",
  "seo": {
    "titleTag": "Optimized Google Title Tag (under 60 chars)",
    "metaDescription": "Optimized Google Meta Description (under 155 chars)",
    "urlSlug": "seo-friendly-url-slug",
    "focusKeywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2"],
    "secondaryKeywords": ["lsi keyword 1", "lsi keyword 2"]
  },
  "googleAds": {
    "headlines": ["Headline 1 (max 30 chars)", "Headline 2 (max 30 chars)", "Headline 3 (max 30 chars)"],
    "descriptions": ["Description 1 (max 90 chars)", "Description 2 (max 90 chars)"],
    "displayPath1": "Sewa or Jual",
    "displayPath2": "Lokasi or Promo",
    "callouts": ["SHM Ready", "Bebas Banjir", "Akses 2 Mobil", "Direct WhatsApp"]
  }
}`;
}

function parseGeminiResponse(raw: string, input: AIDescriptionInput): AIGeneratedResult | null {
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const data = JSON.parse(clean);
    if (data.title && data.description) {
      const useEmojis = input.useEmojis !== false;
      const area = input.area || 'Jakarta';
      const city = input.city || 'Indonesia';

      const seo: SEOPackage = {
        titleTag: data.seo?.titleTag || (data.title.length > 60 ? data.title.substring(0, 57) + '...' : data.title),
        metaDescription: data.seo?.metaDescription || (data.tagline || data.description.substring(0, 150)),
        urlSlug: data.seo?.urlSlug || `${input.category}-${area}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        focusKeywords: Array.isArray(data.seo?.focusKeywords) ? data.seo.focusKeywords : [input.category, area, `${input.category} ${area}`],
        secondaryKeywords: Array.isArray(data.seo?.secondaryKeywords) ? data.seo.secondaryKeywords : ['properti', city, input.serviceType],
        searchSnippetPreview: {
          title: data.seo?.titleTag || data.title,
          url: `https://proplis.com/listing/${(data.seo?.urlSlug || `${input.category}-${area}`).toLowerCase()}`,
          snippet: data.seo?.metaDescription || (data.tagline || data.description.substring(0, 150))
        }
      };

      const googleAds: GoogleAdsPackage = {
        headlines: Array.isArray(data.googleAds?.headlines) 
          ? data.googleAds.headlines.map((h: string) => h.length > 30 ? h.substring(0, 29) + '…' : h)
          : [`${input.category.toUpperCase()} di ${area}`, `${input.serviceType === 'rent' ? 'Sewa Bulanan/Tahunan' : 'Dijual SHM Siap Huni'}`, `Hubungi Agen Sekarang`],
        descriptions: Array.isArray(data.googleAds?.descriptions)
          ? data.googleAds.descriptions.map((d: string) => d.length > 90 ? d.substring(0, 89) + '…' : d)
          : [`Properti premium di ${area}, ${city}. Fasilitas lengkap & lokasi strategis. Survey sekarang!`, `Dapatkan penawaran terbaik untuk ${input.category} di ${area}. Konsultasi gratis via WhatsApp.`],
        displayPath1: data.googleAds?.displayPath1 || (input.serviceType === 'rent' ? 'Sewa' : 'Jual'),
        displayPath2: data.googleAds?.displayPath2 || area.substring(0, 15),
        callouts: Array.isArray(data.googleAds?.callouts) ? data.googleAds.callouts : ['SHM Ready', 'Freehold', 'Direct Owner', 'Akses Strategis']
      };

      return {
        title: data.title,
        tagline: data.tagline || data.title,
        description: data.description,
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        whatsappBroadcast: data.whatsappBroadcast || '',
        socialCaption: data.socialCaption || '',
        seo,
        googleAds,
        useEmojis,
        source: 'gemini'
      };
    }
  } catch (e) {
    // If JSON parsing fails, fallback
  }
  return null;
}

export function generateDomainEngineDescription(input: AIDescriptionInput): AIGeneratedResult {
  const lang = input.language || 'id';
  const isRent = input.serviceType === 'rent';
  const isSale = input.serviceType === 'sale';
  const rentType = input.rentPeriod === 'monthly' ? 'monthly' : input.rentPeriod === 'yearly' ? 'yearly' : 'daily';
  const useEmojis = input.useEmojis !== false;

  const catId = CATEGORY_NAMES_ID[input.category] || input.category;
  const catEn = CATEGORY_NAMES_EN[input.category] || input.category;
  const area = input.area || 'Lokasi Strategis';
  const city = input.city || 'Indonesia';
  const price = input.priceFormatted || 'Hubungi Agen';
  const rawDraft = (input.draftDescription || '').trim();

  // Helper for emoji inclusion
  const em = (emoji: string) => (useEmojis ? `${emoji} ` : '');

  // 1. Title generation
  let title = '';
  let tagline = '';

  if (lang === 'id' || lang === 'bilingual') {
    if (isSale) {
      if (input.category === 'land') {
        title = `Tanah Kavling Siap Bangun SHM di ${area}, ${city}`;
        tagline = `Peluang investasi tanah emas di area berkembang pesat dengan akses jalan aspal lebar`;
      } else if (input.category === 'ruko') {
        title = `Ruko Komersial Strategis ${input.floors || 3} Lantai di ${area}`;
        tagline = `Double frontage di jalur utama ramai pembeli, cocok untuk cafe, kantor, atau klinik`;
      } else if (input.category === 'kost') {
        title = `Kost Eksklusif Penghasilan Pasif di ${area}, ${city}`;
        tagline = `Turnkey passive income dengan tingkat okupansi tinggi dan fasilitas kamar lengkap`;
      } else if (input.category === 'warehouse') {
        title = `Gudang Logistik Modern Akses Kontainer di ${area}`;
        tagline = `Bangunan kokoh, tinggi plafon 9 meter, siap operasional distribusi & industri`;
      } else if (input.category === 'business') {
        title = `Tempat Usaha & Komersial Siap Pakai di ${area}`;
        tagline = `Lokasi emas dengan eksposur tinggi dan izin usaha lengkap`;
      } else if (input.category === 'hotel_room') {
        title = `Condotel / Kamar Resort Bintang 5 di ${area}`;
        tagline = `Kepemilikan strata title dengan revenue sharing hospitality management profesional`;
      } else if (input.category === 'villa') {
        title = `Luxury Designer Villa Private Pool di ${area}, ${city}`;
        tagline = `Koleksi privat dengan arsitektur tropis kontemporer dan proyeksi ROI sewa tinggi`;
      } else {
        title = `Rumah Mewah Minimalis Siap Huni di ${area}, ${city}`;
        tagline = `Hunian asri dengan tata ruang lega, pencahayaan alami, dan sistem keamanan 24 jam`;
      }
    } else {
      // Rent
      const rentPeriodLabel = rentType === 'monthly' ? 'Bulanan' : rentType === 'yearly' ? 'Tahunan' : 'Harian';
      if (input.category === 'land') {
        title = `Sewa Lahan Strategis di ${area} (${rentPeriodLabel})`;
        tagline = `Lahan komersial siap pakai untuk display, pool logistik, atau usaha terbuka`;
      } else if (input.category === 'ruko') {
        title = `Sewa Ruko ${input.floors || 3} Lantai di ${area} (${rentPeriodLabel})`;
        tagline = `Lokasi ramai dan strategis di kawasan bisnis utama dengan parkir luas`;
      } else if (input.category === 'kost') {
        title = `Sewa Kamar Kost Eksklusif AC di ${area} (${rentPeriodLabel})`;
        tagline = `Fasilitas lengkap full furnished, kamar mandi dalam, WiFi kencang, bebas jam malam`;
      } else if (input.category === 'warehouse') {
        title = `Sewa Gudang Logistik di ${area} (${rentPeriodLabel})`;
        tagline = `Akses tronton kontainer 40ft, keamanan 24 jam, dan bebas banjir`;
      } else if (input.category === 'apartment') {
        title = `Sewa Apartemen Modern Full Furnished di ${area} (${rentPeriodLabel})`;
        tagline = `Unit lantai tinggi dengan pemandangan kota, fasilitas gym, kolam renang, dan akses transportasi`;
      } else if (input.category === 'hotel_room') {
        title = `Sewa Suite Hotel / Resort Mewah di ${area} (${rentPeriodLabel})`;
        tagline = `Layanan housekeeping berkala, fasilitas resort lengkap, dan lokasi prima`;
      } else {
        title = `Sewa ${catId} Nyaman di ${area} (${rentPeriodLabel})`;
        tagline = `Properti terawat siap huni dengan lingkungan tenang dan fasilitas lengkap`;
      }
    }
  } else {
    // English
    const rentLabel = rentType === 'monthly' ? 'Monthly' : rentType === 'yearly' ? 'Yearly' : 'Daily';
    if (isSale) {
      title = `Prime ${catEn} for Sale in ${area}, ${city}`;
      tagline = `Exclusive high-potential freehold opportunity in prime residential/commercial enclave`;
    } else {
      title = `${rentLabel} Rental: Stunning ${catEn} in ${area}, ${city}`;
      tagline = `Turnkey furnished property with prime lifestyle access and complete comforts`;
    }
  }

  // 2. Highlights
  const highlights: string[] = [];
  if (input.category === 'land') {
    highlights.push(
      `Luas Tanah: ${input.landSize || 500} m² dengan proporsi ideal`,
      `Legalitas: ${input.certificateType || 'SHM (Sertifikat Hak Milik)'} Clean & Clear`,
      `Akses jalan aspal lebar (simfoni 2 arah mobil)`,
      `Zonasi pemukiman / komersial siap rancang bangun`,
      `Lokasi prestisius bernilai investasi tinggi di kawasan ${area}`
    );
  } else if (input.category === 'ruko') {
    highlights.push(
      `Bangunan ${input.floors || 3} Lantai struktur kokoh beton bertulang`,
      `Area parkir customer luas dan aman`,
      `Listrik daya besar & pasokan air bersih lancar`,
      `Eksposur tinggi menghadap jalan utama ramai ${area}`,
      `Sangat ideal untuk Kantor, Klinik, Bank, Retail, atau Cafe`
    );
  } else if (input.category === 'warehouse') {
    highlights.push(
      `Luas Bangunan: ${input.buildingSize || 600} m² / Luas Tanah: ${input.landSize || 1000} m²`,
      `Tinggi plafon 8-10 meter dengan sirkulasi udara optimal`,
      `Lantai beton cor bertulang tahan beban tonase kontainer`,
      `Akses kontainer 20-40 ft dengan loading dock representatif`,
      `Keamanan 24 jam & terbukti bebas banjir 100%`
    );
  } else if (input.category === 'kost') {
    highlights.push(
      `Kamar full furnished: AC, Smart TV, Springbed, Meja Kerja, Lemari`,
      `Kamar mandi dalam dengan water heater modern`,
      `Internet WiFi super cepat & dapur komunal bersama`,
      `Sistem keamanan smart lock digital 24 jam`,
      `Sangat dekat ke area perkantoran, kampus, dan kuliner viral`
    );
  } else {
    highlights.push(
      `${input.bedrooms || 3} Kamar Tidur lega dengan pencahayaan alami optimal`,
      `${input.bathrooms || 3} Kamar Mandi modern dengan sanitari premium`,
      `Luas Bangunan ${input.buildingSize || 250} m² / Tanah ${input.landSize || 350} m²`,
      `Kondisi: ${input.furnishing || 'Fully Furnished'} interior rapi`,
      `Akses cepat ke fasilitas publik, sekolah internasional, & pusat lifestyle`
    );
  }

  // If agent provided custom draft keywords or draft text, weave into highlights
  if (rawDraft) {
    const draftWords = rawDraft.split(/[,\n.]/).map(s => s.trim()).filter(s => s.length > 8);
    if (draftWords.length > 0 && draftWords[0]) {
      highlights.unshift(`Catatan Khusus: ${draftWords[0]}`);
    }
  }

  // 3. Polished Full Description
  let description = '';
  const agentDraftSection = rawDraft ? `
${em('📝')}**POIN UTAMA DARI DRAF AGEN (POLISHED DRAFT):**
"${rawDraft}"
` : '';

  if (lang === 'id') {
    description = `${em('🌟')}**PENAWARAN PROPERTI EKSKLUSIF DI ${area.toUpperCase()}, ${city.toUpperCase()}**

Selamat datang di properti pilihan yang memadukan kenyamanan maksimal, arsitektur estetis, dan nilai investasi jangka panjang yang sangat menjanjikan. Berlokasi di kawasan primadona **${area}**, properti ini menawarkan aksesibilitas tak tertandingi menuju pusat gaya hidup, kuliner, dan sarana transportasi.
${agentDraftSection}
---

### ${em('📋')}**SPESIFIKASI DETAIL PROPERTI:**
- **Tipe Properti:** ${catId}
- **Status Penawaran:** ${isSale ? 'Dijual (Hak Milik / SHM)' : isRent ? `Disewakan (${rentType === 'monthly' ? 'Sewa Bulanan' : 'Sewa Tahunan'})` : 'Leasehold'}
- **Harga Penawaran:** ${price}
- **Luas Bangunan:** ${input.buildingSize ? `${input.buildingSize} m²` : '-'}
- **Luas Tanah:** ${input.landSize ? `${input.landSize} m²` : '-'}
${input.bedrooms ? `- **Kamar Tidur:** ${input.bedrooms} Kamar` : ''}
${input.bathrooms ? `- **Kamar Mandi:** ${input.bathrooms} Kamar Mandi` : ''}
${input.floors ? `- **Jumlah Lantai:** ${input.floors} Lantai` : ''}
- **Status Perabotan:** ${input.furnishing || 'Furnished'}
- **Legalitas Dokumen:** ${input.certificateType || 'Sertifikat Lengkap & Terverifikasi'}

---

### ${em('💎')}**KEUNGGULAN UTAMA (SELLING POINTS):**
${highlights.map(h => `${em('✅')}• ${h}`).join('\n')}

${input.amenities && input.amenities.length > 0 ? `\n### ${em('🛋️')}**FASILITAS & FITUR LENGKAP:**\n${input.amenities.map(a => `• ${a}`).join('\n')}\n` : ''}
---

### ${em('📍')}**LOKASI & AKSESIBILITAS PRIMA:**
Berada di lingkungan yang sangat tenang, aman, dan bebas dari kebisingan, namun tetap memiliki akses super cepat ke fasilitas penting:
- Hanya hitungan menit ke jalan protokol, pusat perbelanjaan, dan sekolah ternama.
- Dikelilingi cafe artisan ternama, restoran kuliner, dan minimarket 24 jam.
- Sistem keamanan lingkungan terjamin dengan pengawasan 24/7.

---

### ${em('📞')}**INFORMASI & JADWAL SURVEY UNIT:**
Unit ini sangat diminati dan jarang tersedia di pasaran. Jangan lewatkan kesempatan emas ini! Hubungi kami untuk informasi penawaran terbaik dan jadwal kunjungan langsung:
${em('👤')}**${input.agentName || 'Official Agent'}**
${em('📱')}**WhatsApp / Telp:** ${input.agentPhone || 'Tersedia di halaman web'}`;
  } else if (lang === 'en') {
    description = `${em('🌟')}**PREMIER PROPERTY SHOWCASE IN ${area.toUpperCase()}, ${city.toUpperCase()}**

Welcome to a truly remarkable real estate opportunity combining architectural refinement, daily lifestyle convenience, and solid capital appreciation in the prestigious district of **${area}**.
${agentDraftSection}
---

### ${em('📋')}**PROPERTY SPECIFICATIONS:**
- **Category:** ${catEn}
- **Offering Type:** ${isSale ? 'For Sale (Freehold Title)' : `For Rent (${rentType === 'monthly' ? 'Monthly Lease' : 'Annual Lease'})`}
- **Asking Price:** ${price}
- **Building Footprint:** ${input.buildingSize ? `${input.buildingSize} sqm` : '-'}
- **Land Plot Size:** ${input.landSize ? `${input.landSize} sqm` : '-'}
${input.bedrooms ? `- **Bedrooms:** ${input.bedrooms}` : ''}
${input.bathrooms ? `- **Bathrooms:** ${input.bathrooms}` : ''}
- **Furnishing Level:** ${input.furnishing || 'Fully Furnished'}
- **Title Documentation:** ${input.certificateType || 'Clean & Clear Title'}

---

### ${em('💎')}**HIGHLIGHTS & STANDOUT FEATURES:**
${highlights.map(h => `${em('✅')}• ${h}`).join('\n')}

${input.amenities && input.amenities.length > 0 ? `\n### ${em('🛋️')}**CURATED AMENITIES:**\n${input.amenities.map(a => `• ${a}`).join('\n')}\n` : ''}
---

### ${em('📍')}**SURROUNDING ENCLAVE & ACCESS:**
- Perfectly positioned within short walking or driving distance to premier dining, international schools, and lifestyle hubs.
- Highly secure and tranquil residential/commercial street with seamless road access.
- Ideal for high-net-worth residents, corporate executives, or high-yield rental investors.

---

### ${em('📞')}**PRIVATE VIEWINGS & INQUIRIES:**
Schedule your exclusive on-site or virtual walk-through today:
${em('👤')}**${input.agentName || 'Official Agent'}**
${em('📱')}**Phone / WhatsApp:** ${input.agentPhone || 'Available via WhatsApp button on this site'}`;
  } else {
    // Bilingual
    description = `${em('🌟')}**${title.toUpperCase()}**
${em('📍')}*${area}, ${city}* | ${em('🏷️')}*${price}*

[ BAHASA INDONESIA ]
Properti istimewa dengan spesifikasi unggulan di kawasan ${area}. Menawarkan kenyamanan hunian privat maupun instrumen investasi dengan pengembalian tinggi.
• Tipe: ${catId} (${isSale ? 'Dijual' : `Disewakan ${rentType}`})
• Spesifikasi: ${input.bedrooms ? `${input.bedrooms} KT / ` : ''}${input.bathrooms ? `${input.bathrooms} KM / ` : ''}LB ${input.buildingSize || '-'}m² / LT ${input.landSize || '-'}m²
• Keunggulan: ${highlights.slice(0, 3).join(', ')}

---

[ ENGLISH SUMMARY ]
Exceptional ${catEn} situated in the coveted enclave of ${area}, ${city}. Tailored for discerning clients seeking turnkey comforts and prime accessibility.
• Status: ${isSale ? 'For Sale' : `For Rent (${rentType})`}
• Specs: ${input.bedrooms ? `${input.bedrooms} Beds / ` : ''}${input.bathrooms ? `${input.bathrooms} Baths / ` : ''}Building: ${input.buildingSize || '-'}sqm
• Key Perks: Strategic asphalt road access, secure environment, and premium finishes.

---
${em('📞')}Hubungi / Contact: **${input.agentName || 'Agent'}** (${input.agentPhone || 'Tersedia di halaman web'})`;
  }

  // 4. WhatsApp Broadcast
  const whatsappBroadcast = `${em('🔥')}*LISTING TERBARU: ${title}*
${em('📍')}*Lokasi:* ${area}, ${city}
${em('🏷️')}*Harga:* ${price} (${isSale ? 'Dijual SHM' : `Sewa ${rentType === 'monthly' ? 'Bulanan' : 'Tahunan'}`})

${em('✨')}*Keunggulan Utama:*
${highlights.slice(0, 4).map(h => `• ${h}`).join('\n')}

Cocok untuk Anda yang mencari properti berkualitas siap pakai di area prestisius.
Info lengkap & jadwalkan survey sekarang:
${em('📱')}Chat WA: ${input.agentPhone || 'Klik nomor di profil'}`;

  // 5. Social Caption
  const socialCaption = `${em('✨')}${title} ${em('✨')}
Lokasi prime di ${area}, ${city}! ${em('🌴')}

${tagline}

Spesifikasi:
${input.bedrooms ? `${em('🛏️')}${input.bedrooms} Kamar Tidur\n` : ''}${input.bathrooms ? `${em('🚿')}${input.bathrooms} Kamar Mandi\n` : ''}${em('📐')}LB ${input.buildingSize || '-'} m² | LT ${input.landSize || '-'} m²
${em('📜')}${input.certificateType || 'Legalitas Lengkap'}

Harga: ${price}
DM atau hubungi link bio untuk booking survey unit langsung! ${em('📲')}

#properti #properti${city.toLowerCase().replace(/[^a-z0-9]/g, '')} #properti${area.toLowerCase().replace(/[^a-z0-9]/g, '')} #investasiproperti #${input.category} #agenproperti #realestateindonesia`;

  // 6. SEO Package
  const titleTag = `${catId} di ${area} - ${price}`.length <= 60 
    ? `${catId} di ${area} - ${price}` 
    : `${catId} di ${area} ${city}`.substring(0, 58);
  const metaDescription = `Cari ${catId.toLowerCase()} di ${area}, ${city}? Harga ${price}. ${highlights[0] || 'Akses strategis & siap huni'}. Hubungi agen sekarang!`.substring(0, 155);
  const urlSlug = `${input.category}-${area}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const seo: SEOPackage = {
    titleTag,
    metaDescription,
    urlSlug,
    focusKeywords: [
      `${input.category} ${area}`.toLowerCase(),
      `${isSale ? 'jual' : 'sewa'} ${input.category} ${city}`.toLowerCase(),
      `properti ${area}`.toLowerCase()
    ],
    secondaryKeywords: [
      `${input.category} siap huni`,
      `${area} ${city}`,
      `agen properti ${city}`
    ],
    searchSnippetPreview: {
      title: titleTag,
      url: `https://proplis.com/listing/${urlSlug}`,
      snippet: metaDescription
    }
  };

  // 7. Google Ads Ready (Strict character limits: Headlines <= 30 chars, Descriptions <= 90 chars)
  const h1 = `${catId} di ${area}`.substring(0, 30);
  const h2 = isRent ? `Sewa ${rentType === 'monthly' ? 'Bulanan' : 'Tahunan'}`.substring(0, 30) : `Dijual SHM Siap Huni`.substring(0, 30);
  const h3 = `Harga ${price}`.substring(0, 30);
  const h4 = `Direct WhatsApp Agen`.substring(0, 30);

  const d1 = `Temukan ${catId.toLowerCase()} impian di ${area}. Lokasi strategis, fasilitas lengkap. Survey sekarang!`.substring(0, 90);
  const d2 = `Dapatkan penawaran terbaik untuk ${catId.toLowerCase()} di ${area}. Konsultasi gratis via WhatsApp.`.substring(0, 90);

  const googleAds: GoogleAdsPackage = {
    headlines: [h1, h2, h3, h4],
    descriptions: [d1, d2],
    displayPath1: (isRent ? 'Sewa' : 'Jual').substring(0, 15),
    displayPath2: area.replace(/\s+/g, '-').substring(0, 15),
    callouts: ['SHM Ready', 'Freehold', 'Akses 2 Mobil', 'Direct WhatsApp', 'Legalitas Terjamin']
  };

  return {
    title,
    tagline,
    description,
    highlights,
    whatsappBroadcast,
    socialCaption,
    seo,
    googleAds,
    useEmojis,
    source: 'engine'
  };
}
