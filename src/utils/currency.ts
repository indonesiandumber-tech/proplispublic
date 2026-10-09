import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rateFromUSD: 1,
    locale: 'en-US'
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    rateFromUSD: 15800,
    locale: 'id-ID'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateFromUSD: 0.92,
    locale: 'de-DE'
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    rateFromUSD: 1.35,
    locale: 'en-SG'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    rateFromUSD: 1.54,
    locale: 'en-AU'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateFromUSD: 0.79,
    locale: 'en-GB'
  }
};

export function convertUSDToCurrency(amountUSD: number, currency: CurrencyCode): number {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  return Math.round(amountUSD * config.rateFromUSD);
}

export function formatPrice(amountUSD: number, currency: CurrencyCode, period?: 'night' | 'month' | 'year' | 'total'): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountUSD * config.rateFromUSD;
  
  let formattedNumber = '';
  if (currency === 'IDR') {
    if (converted >= 1000000000) {
      formattedNumber = `${(converted / 1000000000).toFixed(1)} Miliar`;
    } else if (converted >= 1000000) {
      formattedNumber = `${(converted / 1000000).toFixed(1)} Juta`;
    } else {
      formattedNumber = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 }).format(converted);
    }
    const full = `${config.symbol} ${formattedNumber}`;
    if (period === 'night') return `${full} / malam`;
    if (period === 'month') return `${full} / bulan`;
    if (period === 'year') return `${full} / tahun`;
    return full;
  }
  
  if (converted >= 1000000) {
    formattedNumber = `${(converted / 1000000).toFixed(2)}M`;
  } else if (converted >= 10000) {
    formattedNumber = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 }).format(converted);
  } else {
    formattedNumber = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 }).format(converted);
  }

  const prefix = config.symbol;
  const full = `${prefix}${formattedNumber}`;
  
  if (period === 'night') return `${full} / night`;
  if (period === 'month') return `${full} / mo`;
  if (period === 'year') return `${full} / yr`;
  return full;
}

export function formatExactPrice(amountUSD: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = Math.round(amountUSD * config.rateFromUSD);
  return `${config.symbol} ${new Intl.NumberFormat(config.locale).format(converted)}`;
}
