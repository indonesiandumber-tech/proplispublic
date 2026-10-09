import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentPlanTier } from '../../types';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  PhoneCall, 
  Globe, 
  Video, 
  Tag, 
  RefreshCw, 
  Crown, 
  Zap, 
  ShieldCheck, 
  Users, 
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Sliders,
  Play
} from 'lucide-react';

export const AgentCrmLanding: React.FC = () => {
  const { 
    hosts, 
    properties, 
    navigate, 
    setCreateAgentModal, 
    setPlanUpgradeModal,
    switchUser,
    activeHostId,
    t,
    language,
    localizedPlans
  } = useApp();

  const [desiredSlug, setDesiredSlug] = useState('');

  const handleStartWebsite = (preselectedTier: AgentPlanTier = 'starter') => {
    setCreateAgentModal({
      isOpen: true,
      initialSlug: desiredSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      preselectedTier: preselectedTier
    });
  };

  const planKeys: AgentPlanTier[] = ['starter', 'growth', 'elite'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{language === 'id' ? 'Tanpa perlu skill teknis. Buat website pribadi agen dalam 60 detik dengan konversi WhatsApp & CRM.' : 'No technical skills needed. Launch your private agent website in 60 seconds with WhatsApp conversion & CRM.'}</span>
      </div>

      {/* 1. HERO SECTION: Claim your private real estate website */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-800/80">
        {/* Background glow & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-400 text-xs font-semibold shadow-inner">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            {t('heroTitleLine1')} <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')} <strong className="text-white font-mono">proplis.com/{language === 'id' ? 'nama-anda' : 'your-name'}</strong> {t('heroSubtitleEnd')}
          </p>

          {/* Interactive URL Claim Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-700/90 shadow-2xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-amber-400 transition-colors">
              <div className="flex items-center w-full px-3 py-1.5 sm:py-0">
                <span className="text-slate-400 font-mono text-xs sm:text-sm select-none">proplis.com/</span>
                <input
                  type="text"
                  placeholder={t('heroInputPlaceholder')}
                  value={desiredSlug}
                  onChange={(e) => setDesiredSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartWebsite('starter')}
                  className="w-full bg-transparent text-amber-300 font-mono text-xs sm:text-sm font-semibold placeholder-slate-500 focus:outline-hidden px-1"
                />
              </div>

              <button
                onClick={() => handleStartWebsite('starter')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-98"
              >
                <span>{t('heroButtonClaim')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> {language === 'id' ? 'Tersedia Paket Gratis' : 'Free Plan Available'}</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> {language === 'id' ? 'Aktif dalam 60 Detik' : 'Ready in 60s'}</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> {language === 'id' ? 'Dukungan WhatsApp & Pixel Tag' : 'WhatsApp & Pixel Ready'}</span>
            </div>
          </div>

          {/* Quick Demo Live Sites Preview Strip */}
          <div className="pt-8 flex flex-col items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              {language === 'id' ? 'Contoh Website Agen Live di Proplis:' : 'Live Agent Websites Powered By Proplis:'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {hosts.map((host) => {
                const planCfg = localizedPlans[host.plan || 'free'];
                return (
                  <button
                    key={host.id}
                    onClick={() => navigate(`/${host.slug}`)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-amber-400/80 text-xs font-mono transition-all cursor-pointer shadow-sm group"
                  >
                    <img 
                      src={host.avatar} 
                      alt={host.name} 
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-600 group-hover:ring-amber-400" 
                    />
                    <span>proplis.com/{host.slug}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-sans uppercase font-extrabold ${
                      host.plan === 'pro' 
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60' 
                        : host.plan === 'starter' 
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/60' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {planCfg.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE 3 CORE VALUE PILLARS */}
      <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-serif text-white">
              {t('featuresTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('feat1Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feat1Desc')}
              </p>
              <div className="pt-2 text-[11px] text-amber-400 font-mono">
                {language === 'id' ? '✓ Tersedia di semua paket (Free, Starter, Pro)' : '✓ Available in all plans (Free, Starter, Pro)'}
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-all relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('feat2Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feat2Desc')}
              </p>
              <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
                {language === 'id' ? '✓ Starter & Pro Plan (Konversi instan)' : '✓ Starter & Pro Plan (Instant conversion)'}
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('feat3Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feat3Desc')}
              </p>
              <div className="pt-2 text-[11px] text-indigo-300 font-mono">
                {language === 'id' ? '✓ Meta Pixel, TikTok Tag & Google Analytics' : '✓ Meta Pixel, TikTok Tag & Google Analytics'}
              </div>
            </div>

          </div>

          {/* Secondary 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {/* Feat 4 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <Video className="w-4 h-4" />
                <span>{t('feat4Title')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feat4Desc')}
              </p>
            </div>

            {/* Feat 5 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                <RefreshCw className="w-4 h-4" />
                <span>{t('feat5Title')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feat5Desc')}
              </p>
            </div>

            {/* Feat 6 */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-bold">
                <Building2 className="w-4 h-4" />
                <span>{t('feat6Title')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feat6Desc')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PRICING MATRIX: The 3 Plans (Free, Starter, Pro) */}
      <section id="pricing" className="py-20 sm:py-28 border-b border-slate-800 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> {t('pricingSectionBadge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              {t('pricingSectionTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('pricingSectionSubtitle')}
            </p>
          </div>

          {/* The 3 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {planKeys.map((tier) => {
              const cfg = localizedPlans[tier];
              const isStarter = tier === 'starter' || tier === 'free';
              const isGrowth = tier === 'growth';
              const isElite = tier === 'elite' || tier === 'pro';

              return (
                <div
                  key={tier}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    isGrowth
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 lg:-translate-y-2'
                      : isElite
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-indigo-600 shadow-2xl shadow-indigo-600/10'
                      : 'bg-slate-900/80 border border-slate-800'
                  }`}
                >
                  {/* Popular / Agency Badge */}
                  {cfg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md ${
                        isGrowth
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-indigo-600 text-white'
                      }`}>
                        {cfg.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold font-serif text-white">{cfg.name}</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {isStarter ? 'Tier 1' : isGrowth ? 'Tier 2' : 'Tier 3'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 min-h-[36px] leading-relaxed">
                      {cfg.tagline}
                    </p>

                    {/* Price display */}
                    <div className="my-6 pt-6 border-t border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                          {cfg.priceFormatted}
                        </span>
                        <span className="text-xs text-slate-400">{cfg.billingPeriod}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isStarter 
                          ? (language === 'id' ? 'Untuk agen baru menguji platform & katalog.' : 'For new agents testing the platform & storefront.')
                          : isGrowth
                          ? (language === 'id' ? 'Untuk agen solo yang beriklan Meta/TikTok & closing cepat.' : 'For solo agents scaling local ads & lead capture.')
                          : (language === 'id' ? 'Untuk kantor agency & tim volume tinggi + video tours & booking engine.' : 'For agencies, teams & brokers with video tours & booking engine.')}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 text-xs pt-4 border-t border-slate-800/80">
                      {cfg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          {feat.included ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className={feat.included ? 'text-slate-200 font-medium' : 'text-slate-500 line-through'}>
                            {feat.title}
                            {feat.note && <span className="text-slate-400 text-[10px] ml-1">({feat.note})</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleStartWebsite(tier)}
                      className={`w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-md ${
                        isStarter
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                          : isElite
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>{t('choosePlan')} ({cfg.name})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. AGENT SPOTLIGHT / LIVE DEMOS */}
      <section className="py-16 sm:py-24 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Users className="w-3.5 h-3.5" /> {t('demoSectionTitle')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                {t('demoSectionTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {t('demoSectionSubtitle')}
              </p>
            </div>

            <button
              onClick={() => handleStartWebsite('starter')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
            >
              <span>{t('createPrivateWeb')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hosts.map((host) => {
              const hostProps = properties.filter(p => p.hostId === host.id);
              const planCfg = localizedPlans[host.plan || 'free'];

              return (
                <div
                  key={host.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl group"
                >
                  <div className="space-y-4">
                    {/* Host Avatar & Details */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={host.avatar}
                          alt={host.name}
                          className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-amber-400 transition-all"
                        />
                        {(host.plan === 'elite' || host.plan === 'pro') && (
                          <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full text-white shadow-xs">
                            <Crown className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-sm truncate">{host.name}</h3>
                        <p className="text-[11px] text-slate-400 truncate">{host.agency}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                          host.plan === 'elite' || host.plan === 'pro'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                            : host.plan === 'growth'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {planCfg.name}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>{language === 'id' ? 'Listing Aktif:' : 'Live Listings:'}</span>
                        <span className="text-white font-bold">{hostProps.length} {t('activeListingsCount')}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>{language === 'id' ? 'Lokasi:' : 'Location:'}</span>
                        <span className="text-slate-300 truncate max-w-[120px]">{host.location}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>WhatsApp:</span>
                        <span className={host.whatsappEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {host.whatsappEnabled ? (language === 'id' ? 'Aktif' : 'Enabled') : (language === 'id' ? 'In-App Saja' : 'Direct Msg Only')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                    <button
                      onClick={() => navigate(`/${host.slug}`)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono font-bold transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>proplis.com/{host.slug}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        switchUser(host.id);
                        navigate('/host-dashboard');
                      }}
                      className="w-full py-1.5 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                    >
                      {language === 'id' ? '→ Masuk sebagai Agen Ini (CRM)' : '→ Log in as this Agent (CRM)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER */}
      <section className="py-16 sm:py-20 text-center bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
            {language === 'id' ? 'Siap Meningkatkan Penjualan Properti Anda?' : 'Ready to Elevate Your Real Estate Business?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {language === 'id' 
              ? 'Klaim URL website pribadi Anda sekarang. Nikmati 5 listing gratis selamanya atau upgrade ke Starter untuk WhatsApp langsung & tag iklan.' 
              : 'Claim your private storefront URL today. Start with 5 free listings or upgrade to Starter for instant WhatsApp links and pixel retargeting.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleStartWebsite('starter')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>{t('createAgentWeb')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              {t('allPropertyListings')}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
