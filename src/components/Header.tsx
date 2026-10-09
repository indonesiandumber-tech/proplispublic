import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Globe, 
  Heart, 
  CalendarCheck, 
  PlusCircle, 
  User, 
  ChevronDown, 
  Sparkles, 
  ExternalLink,
  Crown,
  Zap,
  Tag,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../utils/currency';
import { CurrencyCode } from '../types';
import { PLANS_CONFIG } from '../data/mockData';

export const Header: React.FC = () => {
  const { 
    currentPath, 
    navigate, 
    currency, 
    setCurrency, 
    language,
    setLanguage,
    t,
    localizedPlans,
    savedPropertyIds, 
    bookings, 
    activeUserHost, 
    activeHostId, 
    switchUser, 
    hosts,
    setPlanUpgradeModal,
    setCreateAgentModal,
    setAiDescriptionModal
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const activePlanCfg = activeUserHost ? localizedPlans[activeUserHost.plan || 'free'] : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md transition-all text-slate-100">
      {/* Top Strip with Instant Tier Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Quick Switcher for Tiers: Review Tier 1, Tier 2, Tier 3 */}
          <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto py-0.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] hidden sm:inline">
              Review Tiers:
            </span>
            <button
              onClick={() => {
                switchUser('host-budi');
                navigate('/budi');
              }}
              className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeHostId === 'host-budi'
                  ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Review Tier 3: Agency Elite (Unlimited listings, 3 video tours, rental booking engine, digital commission agreements)"
            >
              <span>👑 Tier 3: Agency Elite (Budi)</span>
            </button>

            <button
              onClick={() => {
                switchUser('host-sarah');
                navigate('/sarah-jenkins');
              }}
              className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeHostId === 'host-sarah'
                  ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-300'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Review Tier 2: Growth (Up to 20 listings, WhatsApp direct, pixel tags, light owner intake)"
            >
              <span>🚀 Tier 2: Growth (Sarah)</span>
            </button>

            <button
              onClick={() => {
                switchUser('host-citra');
                navigate('/citra-villas');
              }}
              className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeHostId === 'host-citra'
                  ? 'bg-slate-700 text-amber-300 shadow-xs ring-1 ring-slate-500'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Review Tier 1: Starter Free (2 listings, WhatsApp hidden, direct in-app CRM inbox only)"
            >
              <span>🌿 Tier 1: Starter Free (Citra)</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs ml-auto">
            <button 
              onClick={() => setPlanUpgradeModal({ isOpen: true, preselectedTier: 'starter' })}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <Zap className="w-3 h-3" /> {t('viewPlansPricing')}
            </button>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <button 
              onClick={() => setCreateAgentModal({ isOpen: true, preselectedTier: 'starter' })}
              className="hidden sm:inline text-slate-300 hover:text-white font-medium cursor-pointer text-[11px]"
            >
              {t('createPrivateWeb')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17 gap-4">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white font-serif">Proplis</span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Agent CRM
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Private Website Builder</p>
              </div>
            </button>

            {/* Quick Links */}
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/' 
                    ? 'bg-slate-800 text-amber-300 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {t('agentPlatform')}
              </button>

              <button
                onClick={() => navigate('/explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPath === '/explore' 
                    ? 'bg-slate-800 text-amber-300 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {t('allPropertyListings')}
              </button>

              <button
                onClick={() => setAiDescriptionModal({
                  isOpen: true,
                  initialData: {
                    city: activeUserHost?.location?.split(',')[0] || 'Bali',
                    area: 'Canggu',
                    agentName: activeUserHost?.name || 'Agent',
                    agentPhone: activeUserHost?.whatsapp || activeUserHost?.phone
                  }
                })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
                title="AI Real Estate Copy & Description Generator"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Copy Studio</span>
              </button>

              {activeUserHost && (
                <button
                  onClick={() => navigate(`/${activeUserHost.slug}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 cursor-pointer font-mono"
                >
                  <span>proplis.com/{activeUserHost.slug}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Agent CRM Portal Button */}
            <button
              onClick={() => navigate('/host-dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm hover:border-amber-400/80"
              title={t('agentCrmPortal')}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('agentCrmPortal')}</span>
              <span className="sm:hidden">CRM</span>
            </button>

            {/* Create Website / Plan Upgrade Button */}
            <button
              onClick={() => setCreateAgentModal({ isOpen: true, preselectedTier: 'starter' })}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md active:scale-98"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('createAgentWeb')}</span>
            </button>

            {/* Language Switcher (Indonesian / English) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer border border-slate-800 bg-slate-900/60"
                title="Switch Language / Ganti Bahasa"
              >
                <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-1 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('selectLanguage')}
                  </div>
                  <button
                    onClick={() => {
                      setLanguage('id');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                      language === 'id' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">🇮🇩 Bahasa Indo</span>
                    {language === 'id' && <span className="text-amber-400">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                      language === 'en' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">🇬🇧 English</span>
                    {language === 'en' && <span className="text-amber-400">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer border border-slate-800"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-1.5 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('selectCurrency')}
                  </div>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => (
                    <button
                      key={cCode}
                      onClick={() => {
                        setCurrency(cCode);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                        currency === cCode ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{cCode} - {CURRENCIES[cCode].locale.includes('id') ? 'Indonesian Rupiah' : cCode}</span>
                      <span className="font-mono text-slate-400">{CURRENCIES[cCode].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Account / Multi-Agent Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-900 transition-all cursor-pointer"
              >
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-white line-clamp-1 leading-tight">
                    {activeUserHost ? activeUserHost.name : t('guestUser')}
                  </p>
                  <p className="text-[10px] text-amber-400 font-bold uppercase">
                    {activeUserHost ? (activePlanCfg?.name || `${activeUserHost.plan} Plan`) : t('demoMode')}
                  </p>
                </div>

                {activeUserHost ? (
                  <div className="relative">
                    <img
                      src={activeUserHost.avatar}
                      alt={activeUserHost.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    {(activeUserHost.plan === 'elite' || activeUserHost.plan === 'pro') && (
                      <div className="absolute -top-1 -right-1 p-0.5 bg-indigo-600 rounded-full text-white">
                        <Crown className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 text-xs animate-in fade-in">
                  
                  {/* Current Active Agent Card */}
                  <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {t('currentAgentProfile')}
                      </span>
                      {activeUserHost && (
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          activeUserHost.plan === 'elite' || activeUserHost.plan === 'pro'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-700' 
                            : activeUserHost.plan === 'growth'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {activePlanCfg?.name}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-sm mt-1">
                      {activeUserHost ? activeUserHost.name : t('guestUser')}
                    </div>
                    {activeUserHost && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-amber-400 font-mono text-[11px]">
                          proplis.com/{activeUserHost.slug}
                        </span>
                        <button
                          onClick={() => {
                            setPlanUpgradeModal({ isOpen: true, preselectedTier: activeUserHost.plan });
                            setUserDropdownOpen(false);
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                        >
                          Change Tier
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Primary Actions */}
                  <div className="py-1">
                    {activeUserHost && (
                      <>
                        <button
                          onClick={() => {
                            navigate(`/${activeUserHost.slug}`);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 flex items-center justify-between text-white hover:bg-slate-800 font-medium cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t('openLiveWebsite')}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </button>

                        <button
                          onClick={() => {
                            navigate('/host-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-800 cursor-pointer font-medium"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {t('agentCrmPortal')}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        navigate('/list-property');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-2 text-amber-400 font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> + {t('addNewListing')}
                    </button>
                  </div>

                  {/* Multi-Agent Switcher List */}
                  <div className="border-t border-slate-800 pt-2 px-3 pb-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                      {t('switchAgent')}
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {hosts.map(h => {
                        const hPlan = localizedPlans[h.plan || 'free'];
                        return (
                          <button
                            key={h.id}
                            onClick={() => {
                              switchUser(h.id);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                              activeHostId === h.id ? 'bg-slate-800 font-bold text-amber-300' : 'hover:bg-slate-800/60 text-slate-300'
                            }`}
                          >
                            <img src={h.avatar} alt={h.name} className="w-5 h-5 rounded-full object-cover" />
                            <div className="truncate flex-1">
                              <span className="block truncate text-xs">{h.name}</span>
                              <span className="block text-[10px] text-slate-500 font-mono">@{h.slug} • {hPlan.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setCreateAgentModal({ isOpen: true, preselectedTier: 'starter' });
                      }}
                      className="w-full mt-2 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-center text-xs font-bold transition-colors cursor-pointer shadow-md"
                    >
                      {t('createAgentWeb')}
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
