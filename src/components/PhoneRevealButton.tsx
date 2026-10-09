import React, { useState } from 'react';
import { Phone, Copy, Check, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { trackPhoneReveal, trackPhoneCopy } from '../utils/tracking';
import { useApp } from '../context/AppContext';

interface PhoneRevealButtonProps {
  phone: string;
  agentName: string;
  propertyTitle?: string;
  variant?: 'dark' | 'light' | 'compact';
  className?: string;
}

export const PhoneRevealButton: React.FC<PhoneRevealButtonProps> = ({
  phone,
  agentName,
  propertyTitle,
  variant = 'dark',
  className = ''
}) => {
  const { language, showToast } = useApp();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showConversionBadge, setShowConversionBadge] = useState(false);

  // Masked phone format e.g. +62 812 •••• 7890
  const maskedPhone = React.useMemo(() => {
    const clean = phone.trim();
    if (clean.length < 8) return '+62 812 •••• ••••';
    const prefix = clean.slice(0, 7);
    const suffix = clean.slice(-3);
    return `${prefix} •••• ${suffix}`;
  }, [phone]);

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(true);
    setShowConversionBadge(true);

    // Fire Google & Meta Conversion Tracking
    trackPhoneReveal(agentName, phone, { propertyTitle });

    // Optional toast
    showToast(
      language === 'id' 
        ? `Nomor HP ditampilkan. Pixel Google & Meta berhasil dicatat.` 
        : `Phone number revealed. Google & Meta ad conversions tracked!`,
      'info'
    );

    setTimeout(() => {
      setShowConversionBadge(false);
    }, 4000);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setIsCopied(true);

    // Fire Google & Meta copy tracking
    trackPhoneCopy(agentName, phone, { propertyTitle });

    showToast(
      language === 'id' ? `Nomor HP ${phone} berhasil disalin ke clipboard!` : `Phone number ${phone} copied to clipboard!`,
      'success'
    );

    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  // Compact variant for cards/tables
  if (variant === 'compact') {
    if (!isRevealed) {
      return (
        <button
          onClick={handleReveal}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 ${className}`}
          title={language === 'id' ? 'Klik untuk melihat nomor lengkap' : 'Click to reveal phone number'}
        >
          <Phone className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono text-[11px]">{maskedPhone}</span>
          <span className="text-[10px] font-bold text-amber-500 ml-1">
            {language === 'id' ? 'Lihat' : 'Show'}
          </span>
        </button>
      );
    }

    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200 ${className}`}>
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold text-emerald-600 hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          {phone}
        </a>
        <button
          onClick={handleCopy}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isCopied 
              ? 'bg-emerald-600 text-white' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
          }`}
          title={language === 'id' ? 'Salin nomor' : 'Copy phone'}
        >
          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    );
  }

  // Dark variant (used in Agent Storefront Hero / Dark sections)
  if (variant === 'dark') {
    return (
      <div className={`relative ${className}`}>
        {!isRevealed ? (
          <button
            onClick={handleReveal}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 rounded-xl border border-slate-700/80 shadow-md transition-all group cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                  {language === 'id' ? 'Nomor Telepon Agen' : 'Agent Direct Phone'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-200 tracking-wide">
                  {maskedPhone}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-extrabold shadow-xs group-hover:bg-amber-400 transition-colors ml-2 shrink-0">
              {language === 'id' ? 'Lihat Nomor' : 'Show Phone'}
            </span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-amber-500/40 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl transition-all cursor-pointer group"
              title={language === 'id' ? 'Panggil langsung' : 'Call now'}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block font-medium uppercase">
                  {language === 'id' ? 'Panggil Langsung' : 'Direct Call'}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {phone}
                </span>
              </div>
            </a>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'id' ? 'Tersalin!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'id' ? 'Salin Nomor' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Live Conversion Tag Signal */}
        {showConversionBadge && (
          <div className="absolute -top-7 left-0 right-0 sm:right-auto sm:left-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold shadow-lg animate-in slide-in-from-bottom-2 duration-200">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>Google & FB Pixel: Contact Conversion Fired</span>
          </div>
        )}
      </div>
    );
  }

  // Light variant (for white modals / property details)
  return (
    <div className={`relative ${className}`}>
      {!isRevealed ? (
        <button
          onClick={handleReveal}
          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-300 shadow-xs transition-all group cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">
                {language === 'id' ? 'Nomor Kontak Agen' : 'Agent Direct Phone'}
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">
                {maskedPhone}
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0">
            {language === 'id' ? 'Lihat Nomor' : 'Show Phone'}
          </span>
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-amber-400 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex-1 flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">
                {language === 'id' ? 'Panggil Sekarang' : 'Direct Call'}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">
                {phone}
              </span>
            </div>
          </a>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{language === 'id' ? 'Tersalin' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>{language === 'id' ? 'Salin' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      )}

      {showConversionBadge && (
        <div className="absolute -top-6 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold shadow-xs animate-in fade-in duration-200">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Google & Meta Ad Pixel Event Captured!</span>
        </div>
      )}
    </div>
  );
};
