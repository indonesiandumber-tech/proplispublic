// Comprehensive Conversion & Event Tracking Utility
// Integrates with Google Analytics 4 (gtag), Meta / Facebook Pixel (fbq), and TikTok Pixel (ttq)

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (eventName: string, params?: Record<string, any>) => void;
      page?: () => void;
    };
    dataLayer?: any[];
  }
}

export interface TrackingEventRecord {
  id: string;
  timestamp: string;
  platform: 'Meta (FB)' | 'Google Ads (GA4)' | 'TikTok';
  eventName: string;
  payload: Record<string, any>;
}

// In-memory log of tracked conversion events for agent inspection & telemetry
export const eventLog: TrackingEventRecord[] = [];

function recordEvent(platform: 'Meta (FB)' | 'Google Ads (GA4)' | 'TikTok', eventName: string, payload: Record<string, any>) {
  const record: TrackingEventRecord = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toLocaleTimeString(),
    platform,
    eventName,
    payload
  };
  eventLog.unshift(record);
  if (eventLog.length > 50) eventLog.pop();

  // Log to developer console for verify
  console.log(`[CONVERSION TRACKED] [${platform}] ${eventName}:`, payload);
}

/**
 * 1. Track Click-to-Reveal Phone Number
 * Fires when user clicks "Show Phone Number" on agent storefront or property modal
 */
export function trackPhoneReveal(agentName: string, phone: string, context: { propertyTitle?: string; page?: string } = {}) {
  const payload = {
    agent_name: agentName,
    phone_number: phone,
    content_name: context.propertyTitle || 'Agent Storefront',
    page_location: window.location.href,
    event_time: new Date().toISOString()
  };

  // 1. Meta / Facebook Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'RevealPhoneNumber', payload);
    window.fbq('track', 'Contact', { content_name: `Phone Reveal: ${agentName}`, status: true });
  }
  recordEvent('Meta (FB)', 'Contact / RevealPhoneNumber', payload);

  // 2. Google Analytics 4 & Google Ads Conversion
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'phone_number_revealed', {
      event_category: 'Lead Generation',
      event_label: agentName,
      value: 1,
      ...payload
    });
    window.gtag('event', 'contact', {
      method: 'phone_reveal',
      agent: agentName
    });
  }
  recordEvent('Google Ads (GA4)', 'phone_number_revealed (Contact)', payload);

  // 3. TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('Contact', payload);
  }
  recordEvent('TikTok', 'Contact', payload);
}

/**
 * 2. Track Phone Number Copied
 * Fires when user clicks "Copy Phone Number"
 */
export function trackPhoneCopy(agentName: string, phone: string, context: { propertyTitle?: string } = {}) {
  const payload = {
    agent_name: agentName,
    phone_number: phone,
    content_name: context.propertyTitle || 'Agent Profile',
    page_location: window.location.href
  };

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'CopyPhoneNumber', payload);
  }
  recordEvent('Meta (FB)', 'CopyPhoneNumber', payload);

  // Google Ads / GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'phone_number_copied', {
      event_category: 'Lead Engagement',
      event_label: `${agentName} - ${phone}`,
      ...payload
    });
  }
  recordEvent('Google Ads (GA4)', 'phone_number_copied', payload);
}

/**
 * 3. Track WhatsApp Lead / Click
 */
export function trackWhatsAppClick(agentName: string, phone: string, propertyTitle?: string) {
  const payload = {
    agent_name: agentName,
    phone_number: phone,
    property_title: propertyTitle || 'Direct Agent Inquiry',
    channel: 'WhatsApp'
  };

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_category: 'WhatsApp',
      content_name: propertyTitle || agentName,
      value: 5.0,
      currency: 'USD'
    });
  }
  recordEvent('Meta (FB)', 'Contact (WhatsApp Chat)', payload);

  // Google Tag
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'whatsapp_chat_click', {
      event_category: 'High-Intent Lead',
      event_label: propertyTitle || agentName,
      ...payload
    });
  }
  recordEvent('Google Ads (GA4)', 'whatsapp_chat_click', payload);

  // TikTok
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('Contact', payload);
  }
  recordEvent('TikTok', 'Contact', payload);
}

/**
 * 4. Track Owner Listing Submission ("Please List My Property")
 */
export function trackOwnerPropertySubmit(agentName: string, propertyData: {
  ownerName: string;
  ownerPhone: string;
  propertyTitle: string;
  serviceType: string;
  category: string;
  expectedPrice?: number;
}) {
  const payload = {
    agent_name: agentName,
    owner_name: propertyData.ownerName,
    property_title: propertyData.propertyTitle,
    service_type: propertyData.serviceType,
    property_category: propertyData.category,
    value: propertyData.expectedPrice || 100000,
    currency: 'USD'
  };

  // Meta Pixel: Lead Event
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', payload);
    window.fbq('track', 'SubmitApplication', { content_name: propertyData.propertyTitle });
  }
  recordEvent('Meta (FB)', 'Lead (SubmitApplication)', payload);

  // Google Ads / GA4: generate_lead
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'Owner Acquisition',
      event_label: propertyData.propertyTitle,
      value: propertyData.expectedPrice || 100000,
      currency: 'USD',
      ...payload
    });
  }
  recordEvent('Google Ads (GA4)', 'generate_lead', payload);

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('SubmitForm', payload);
  }
  recordEvent('TikTok', 'SubmitForm', payload);
}
