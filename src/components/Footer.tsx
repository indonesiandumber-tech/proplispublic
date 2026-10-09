import React from 'react';
import { Building2, ShieldCheck, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate, hosts, updateFilter, t, language, setLanguage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">Proplis</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {language === 'id'
                ? 'Platform CRM dan Website Agen Properti modern yang memberikan domain pribadi bagi setiap agen properti (contoh: proplis.com/budi) dengan integrasi WhatsApp dan manajemen listing lengkap.'
                : 'The modern multi-agent real estate platform empowering brokers and hosts with personalized storefront URLs (e.g. proplis.com/budi) with WhatsApp conversion and CRM tools.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {language === 'id' ? 'Sertifikat & Lisensi Terverifikasi' : '100% Verified Titles & Licenses'}
              </span>
            </div>
          </div>

          {/* Service Types */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-100 tracking-wider mb-4">
              {language === 'id' ? 'Layanan Properti' : 'Real Estate Services'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => {
                    updateFilter('serviceType', 'rent');
                    navigate('/explore');
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('forRent')} ({language === 'id' ? 'Sewa Harian & Liburan' : 'Vacation & Daily Rentals'})
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    updateFilter('serviceType', 'sale');
                    navigate('/explore');
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('forSale')} ({language === 'id' ? 'Hak Milik / Freehold' : 'Properties For Sale'})
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    updateFilter('serviceType', 'lease');
                    navigate('/explore');
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('forLease')} ({language === 'id' ? 'Sewa Jangka Panjang' : 'Commercial & Long-term'})
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/list-property')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('addNewListing')}
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Agent Storefronts */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-100 tracking-wider mb-4">
              {language === 'id' ? 'Website Agen Pilihan' : 'Featured Agent Storefronts'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {hosts.map(h => (
                <li key={h.id}>
                  <button 
                    onClick={() => navigate(`/${h.slug}`)} 
                    className="flex items-center gap-2 hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-medium text-slate-200">{h.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">/{h.slug}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Hotspots & Language switcher */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-100 tracking-wider mb-4">
              {language === 'id' ? 'Bahasa & Lokasi' : 'Language & Locations'}
            </h4>
            
            {/* Quick language toggle */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'id' 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => { updateFilter('city', 'Bali'); navigate('/explore'); }} className="hover:text-white cursor-pointer">Bali (Canggu, Uluwatu, Ubud)</button></li>
              <li><button onClick={() => { updateFilter('city', 'Jakarta'); navigate('/explore'); }} className="hover:text-white cursor-pointer">Jakarta (SCBD, Senopati)</button></li>
              <li><button onClick={() => { updateFilter('city', 'Singapore'); navigate('/explore'); }} className="hover:text-white cursor-pointer">Singapore (Marina Bay)</button></li>
              <li><button onClick={() => { updateFilter('city', 'Tokyo'); navigate('/explore'); }} className="hover:text-white cursor-pointer">Tokyo (Shibuya, Ginza)</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Proplis Real Estate & Host Network. {language === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">{language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}</span>
            <span className="hover:text-slate-400 cursor-pointer">{language === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service'}</span>
            <span className="hover:text-slate-400 cursor-pointer">{language === 'id' ? 'Perjanjian Website Agen' : 'Agent Storefront Agreement'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
