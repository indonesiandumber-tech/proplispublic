import React from 'react';
import { CalendarCheck, MapPin, KeyRound, DollarSign, FileText, CheckCircle2, QrCode, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookingsView: React.FC = () => {
  const { bookings, navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            My Bookings, Tours & Lease Agreements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Confirmed vacation stays, scheduled property viewing tours, and commercial lease requests.
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          <CalendarCheck className="w-5 h-5" />
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                {/* Header Strip */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold text-white ${
                      b.serviceType === 'rent' ? 'bg-emerald-600' : b.serviceType === 'sale' ? 'bg-amber-600' : 'bg-indigo-600'
                    }`}>
                      {b.serviceType === 'rent' ? 'Vacation Stay' : b.serviceType === 'sale' ? 'Private Tour' : 'Lease Request'}
                    </span>
                    <span className="text-xs font-mono text-indigo-300 font-bold">
                      {b.bookingCode}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                  </span>
                </div>

                {/* Property Summary */}
                <div className="p-5 flex gap-4 border-b border-slate-100">
                  <img
                    src={b.propertyImage}
                    alt={b.propertyTitle}
                    className="w-24 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {b.propertyTitle}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {b.propertyLocation}
                    </p>
                    <p className="text-xs text-indigo-700 font-bold mt-1">
                      Host: {b.hostName}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="p-5 space-y-2 text-xs text-slate-600">
                  {b.startDate && b.endDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stay Dates:</span>
                      <span className="font-semibold text-slate-900">
                        {b.startDate} → {b.endDate} ({b.nights} nights)
                      </span>
                    </div>
                  )}

                  {b.guestsCount && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Guests:</span>
                      <span className="font-semibold text-slate-900">{b.guestsCount} Guests</span>
                    </div>
                  )}

                  {b.leaseDurationYears && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lease Term:</span>
                      <span className="font-semibold text-slate-900">{b.leaseDurationYears} Year Leasehold</span>
                    </div>
                  )}

                  {b.tourDateTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scheduled Tour:</span>
                      <span className="font-semibold text-slate-900">{b.tourDateTime} ({b.tourType})</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-indigo-900 text-sm">{b.totalAmountFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Action voucher bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Guest: <strong className="text-slate-800">{b.guestName}</strong>
                </span>
                <button
                  onClick={() => window.print()}
                  className="text-slate-700 hover:text-slate-950 font-bold flex items-center gap-1 underline text-[11px] cursor-pointer"
                >
                  Print Voucher
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 mt-8 shadow-xs">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 font-serif">No Bookings or Tours Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Browse our curated properties for Rent, Sale, and Lease and reserve directly with top agents.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            Explore Properties →
          </button>
        </div>
      )}

    </div>
  );
};
