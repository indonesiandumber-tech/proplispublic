import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AgentStorefront } from './components/AgentStorefront';
import { AgentCrmLanding } from './components/landing/AgentCrmLanding';
import { ListPropertyWizard } from './components/ListPropertyWizard';
import { HostDashboard } from './components/HostDashboard';
import { BookingsView } from './components/BookingsView';
import { SavedWishlist } from './components/SavedWishlist';
import { Modals } from './components/Modals';
import { 
  Building2, 
  Sparkles, 
  KeyRound, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { formatPrice } from './utils/currency';

function MainApp() {
  const { 
    currentPath, 
    navigate, 
    properties, 
    hosts, 
    filters, 
    selectedProperty, 
    setSelectedProperty,
    toast,
    currency
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');

  // Filter properties based on active search filter state
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // 1. Service Type filter
      if (filters.serviceType !== 'all' && prop.serviceType !== filters.serviceType) {
        return false;
      }

      // 2. City filter
      if (filters.city !== 'all' && prop.location.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // 3. Category filter
      if (filters.category !== 'all' && prop.category !== filters.category) {
        return false;
      }

      // 4. Bedrooms filter
      if (filters.bedrooms !== 'any') {
        const requiredBeds = parseInt(filters.bedrooms);
        if (filters.bedrooms === '5+') {
          if (prop.specs.bedrooms < 5) return false;
        } else if (prop.specs.bedrooms < requiredBeds) {
          return false;
        }
      }

      // 5. Amenities filter
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(a => prop.amenities.includes(a));
        if (!hasAll) return false;
      }

      // 6. Query search
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchArea = prop.location.area.toLowerCase().includes(q);
        const matchCity = prop.location.city.toLowerCase().includes(q);
        const matchDesc = prop.description.toLowerCase().includes(q);
        if (!matchTitle && !matchArea && !matchCity && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.priceUSD - b.priceUSD;
      if (filters.sortBy === 'price_high') return b.priceUSD - a.priceUSD;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Recommended: featured & superhost first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, filters]);

  // Route Dispatcher
  const renderRouteContent = () => {
    const cleanPath = currentPath.replace(/^\//, '').toLowerCase();

    // 1. Check if the path matches a registered host custom storefront (e.g. /budi, /sarah-jenkins, /citra-villas, /kenji-tokyo)
    const matchedHost = hosts.find(h => h.slug.toLowerCase() === cleanPath);
    if (matchedHost) {
      return <AgentStorefront slug={matchedHost.slug} />;
    }

    // 2. Specific App Routes
    if (cleanPath === 'list-property') {
      return <ListPropertyWizard />;
    }

    if (cleanPath === 'host-dashboard' || cleanPath === 'crm') {
      return <HostDashboard />;
    }

    if (cleanPath === 'bookings') {
      return <BookingsView />;
    }

    if (cleanPath === 'saved') {
      return <SavedWishlist />;
    }

    // 3. Front Page of proplis.com: Dedicated Agent CRM & Private Website Builder Landing with 3 Plans
    if (cleanPath === '' || cleanPath === 'pricing') {
      return <AgentCrmLanding />;
    }

    // 4. Global Search / Explore View (when /explore is visited)
    return (
      <div className="min-h-screen pb-16">
        
        {/* Hero Showcase Strip */}
        <div className="bg-slate-900 text-white relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 opacity-90 pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/30 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Multi-Agent Property Directory
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight">
                Search All Verified Agent Listings
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Browse verified properties for <strong className="text-emerald-400">Rent</strong>, <strong className="text-amber-400">Sale</strong>, and <strong className="text-indigo-300">Lease</strong> directly from licensed agent websites.
              </p>

              {/* Quick Jump Pills for Agents */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Agent Websites:</span>
                {hosts.map(h => (
                  <button
                    key={h.id}
                    onClick={() => navigate(`/${h.slug}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-indigo-400 font-mono text-[11px] transition-all cursor-pointer shadow-xs"
                  >
                    <img src={h.avatar} alt={h.name} className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-600" />
                    <span>proplis.com/{h.slug}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Listing Intent Card */}
            <div className="bg-slate-950/85 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-2xl w-full md:w-80 shrink-0 space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Are you an Agent?
              </span>
              <h3 className="font-bold text-white text-sm font-serif">
                Get Your Own Private Website
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Launch your branded real estate showcase at <strong className="font-mono text-slate-200">proplis.com/yourname</strong> with CRM lead tracking.
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-98"
              >
                <span>View Plans & Create Web &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar with Horizontal Category Tabs */}
        <FilterBar 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          resultCount={filteredProperties.length} 
        />

        {/* Content Views: Grid vs Split vs Map */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          
          {/* VIEW MODE 1: GRID VIEW */}
          {viewMode === 'grid' && (
            <div>
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/90 shadow-xs">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 font-serif">No properties match your filter criteria</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try loosening your price, destination, or bedroom filters to view more listings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: SPLIT VIEW (50% Map / 50% Grid like Airbnb!) */}
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Grid (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>

              {/* Right Sticky Map (5 cols) */}
              <div className="lg:col-span-5 sticky top-36 h-[600px]">
                <InteractiveMap properties={filteredProperties} />
              </div>
            </div>
          )}

          {/* VIEW MODE 3: FULL MAP VIEW */}
          {viewMode === 'map' && (
            <div className="h-[750px] w-full">
              <InteractiveMap properties={filteredProperties} />
            </div>
          )}

        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-200 selection:text-slate-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
          toast.type === 'error'
            ? 'bg-rose-950 text-white border-rose-800/80 shadow-rose-950/20'
            : toast.type === 'info'
            ? 'bg-slate-900 text-white border-slate-800 shadow-slate-950/20'
            : 'bg-emerald-950 text-white border-emerald-800/80 shadow-emerald-950/20'
        }`}>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Main Routed Area */}
      <main className="flex-1">
        {renderRouteContent()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals Container */}
      <Modals />

      {/* Property Details Modal when clicked */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
