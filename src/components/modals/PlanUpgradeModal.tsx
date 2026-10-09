import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentPlanTier } from '../../types';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  MessageSquare, 
  PhoneCall, 
  Video, 
  Tag, 
  RefreshCw, 
  Building,
  X,
  ShieldCheck
} from 'lucide-react';

export const PlanUpgradeModal: React.FC = () => {
  const { 
    planUpgradeModal, 
    setPlanUpgradeModal, 
    activeUserHost, 
    updateHostPlan, 
    showToast,
    t,
    language,
    localizedPlans
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<AgentPlanTier>(
    planUpgradeModal.preselectedTier || activeUserHost?.plan || 'starter'
  );

  if (!planUpgradeModal.isOpen) return null;

  const currentPlan = activeUserHost?.plan || 'free';

  const handleConfirmUpgrade = (tier: AgentPlanTier) => {
    if (!activeUserHost) {
      showToast(language === 'id' ? 'Silakan pilih agen demo atau login terlebih dahulu' : 'Please log in or register as an agent first', 'error');
      return;
    }
    updateHostPlan(activeUserHost.id, tier);
    setPlanUpgradeModal({ isOpen: false });
  };

  const planTiers: AgentPlanTier[] = ['starter', 'growth', 'elite'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-800/80 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={() => setPlanUpgradeModal({ isOpen: false })}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t('pricingSectionBadge')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            {t('pricingSectionTitle')}
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            {activeUserHost ? (
              <span>{language === 'id' ? 'Sedang aktif sebagai ' : 'Currently logged in as '}<strong className="text-white">{activeUserHost.name}</strong> ({language === 'id' ? 'Paket saat ini: ' : 'Current Plan: '}<span className="capitalize text-amber-400 font-bold">{localizedPlans[currentPlan].name}</span>). {language === 'id' ? 'Tukar atau upgrade paket kapan saja.' : 'Switch or upgrade tier anytime.'}</span>
            ) : (
              <span>{t('pricingSectionSubtitle')}</span>
            )}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planTiers.map((tier) => {
              const cfg = localizedPlans[tier];
              const isSelected = selectedTier === tier;
              const isCurrent = activeUserHost?.plan === tier;

              return (
                <div
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded-2xl p-6 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    cfg.isPopular
                      ? 'bg-slate-800/90 border-amber-500/60 ring-2 ring-amber-500/30 shadow-xl shadow-amber-950/20'
                      : (tier === 'elite' || tier === 'pro')
                      ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  } ${isSelected ? 'ring-2 ring-white scale-[1.02]' : ''}`}
                >
                  {/* Badge */}
                  {cfg.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      {cfg.badge || (language === 'id' ? 'Terpopuler' : 'Most Popular')}
                    </div>
                  )}

                  {(tier === 'elite' || tier === 'pro') && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Crown className="w-3 h-3" /> {cfg.badge || (language === 'id' ? 'Top Agency' : 'Power Agent')}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-white font-serif">{cfg.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/40">
                          {language === 'id' ? 'Paket Aktif' : 'Active Plan'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 min-h-[32px]">{cfg.tagline}</p>

                    {/* Price display */}
                    <div className="my-4 pt-4 border-t border-slate-800/80">
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
                        {cfg.priceFormatted}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {cfg.billingPeriod}
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 text-xs pt-3 border-t border-slate-800/60">
                      {cfg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {feat.included ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className={feat.included ? 'text-slate-200' : 'text-slate-500 line-through'}>
                            {feat.title}
                            {feat.note && <span className="text-slate-400 text-[10px] ml-1">({feat.note})</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmUpgrade(tier);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                          : tier === 'starter'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md'
                          : tier === 'pro'
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-md shadow-indigo-900/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <span>{language === 'id' ? 'Paket Aktif Saat Ini' : 'Current Plan (Selected)'}</span>
                      ) : (
                        <span>{t('choosePlan')} ({cfg.name})</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'id' ? 'Aktivasi Instan • Batalkan atau ganti paket kapan saja tanpa ikatan kontrak.' : 'Instant activation • Cancel or upgrade at any time with 0 lock-in.'}</span>
          </div>
          <button
            onClick={() => setPlanUpgradeModal({ isOpen: false })}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
};
