import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  Video, 
  MapPin, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PlanUpgradeModal } from './modals/PlanUpgradeModal';
import { OwnerSubmitModal } from './modals/OwnerSubmitModal';
import { CreateAgentModal } from './modals/CreateAgentModal';
import { PhotoPickerModal } from './modals/PhotoPickerModal';
import { AIDescriptionModal } from './modals/AIDescriptionModal';

export const Modals: React.FC = () => {
  const {
    messageModal,
    setMessageModal,
    tourModal,
    setTourModal,
    shareModal,
    setShareModal,
    aiDescriptionModal,
    setAiDescriptionModal,
    sendInquiry,
    createBooking,
    hosts,
    showToast
  } = useApp();

  // Message Form State
  const [senderName, setSenderName] = useState('Alex Harrison');
  const [senderEmail, setSenderEmail] = useState('alex.harrison@gmail.com');
  const [senderPhone, setSenderPhone] = useState('+62 812 8899 1122');
  const [messageText, setMessageText] = useState('');

  // Tour Form State
  const [tourDate, setTourDate] = useState('2026-09-01');
  const [tourTime, setTourTime] = useState('14:00');
  const [tourType, setTourType] = useState<'in_person' | 'video_call'>('in_person');
  const [tourGuestName, setTourGuestName] = useState('Alex Harrison');
  const [tourGuestEmail, setTourGuestEmail] = useState('alex.harrison@gmail.com');
  const [tourGuestPhone, setTourGuestPhone] = useState('+62 812 8899 1122');

  // Share Copy
  const [copied, setCopied] = useState(false);

  const activeModalHost = hosts.find(h => h.id === messageModal.hostId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendInquiry({
      hostId: messageModal.hostId || 'host-budi',
      propertyId: messageModal.propertyId,
      senderName,
      senderEmail,
      senderPhone,
      message: messageText,
      serviceType: 'general'
    });

    setMessageModal({ isOpen: false });
    setMessageText('');
  };

  const handleScheduleTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourModal.property) return;

    createBooking({
      propertyId: tourModal.property.id,
      guestName: tourGuestName,
      guestEmail: tourGuestEmail,
      guestPhone: tourGuestPhone,
      tourDateTime: `${tourDate} at ${tourTime}`,
      tourType,
      totalAmountUSD: 0
    });

    setTourModal({ isOpen: false });
    confetti({ particleCount: 70, spread: 50 });
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareModal.url);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      {/* 1. DIRECT INQUIRY MESSAGE MODAL */}
      {messageModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Message {activeModalHost ? activeModalHost.name : 'Agent'}
                </h3>
              </div>
              <button 
                onClick={() => setMessageModal({ isOpen: false })}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 space-y-3 text-xs">
              {messageModal.defaultSubject && (
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 font-semibold">
                  Regarding: {messageModal.defaultSubject}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hi, I am interested in scheduling a viewing or learning more about the terms..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMessageModal({ isOpen: false })}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SCHEDULE TOUR MODAL */}
      {tourModal.isOpen && tourModal.property && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Schedule Private Viewing
                </h3>
              </div>
              <button 
                onClick={() => setTourModal({ isOpen: false })}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleTour} className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Viewing: <strong className="text-slate-900">{tourModal.property.title}</strong>
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tour Experience Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTourType('in_person')}
                    className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      tourType === 'in_person'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> In-Person On Site
                  </button>

                  <button
                    type="button"
                    onClick={() => setTourType('video_call')}
                    className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      tourType === 'video_call'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Live Video Call
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={tourTime}
                    onChange={(e) => setTourTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM (Sunset)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={tourGuestName}
                  onChange={(e) => setTourGuestName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={tourGuestEmail}
                    onChange={(e) => setTourGuestEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={tourGuestPhone}
                    onChange={(e) => setTourGuestPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTourModal({ isOpen: false })}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors cursor-pointer"
                >
                  Confirm Appointment 📅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SHARE MODAL */}
      {shareModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-serif">Share Listing</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {shareModal.title}
            </p>

            <div className="mt-4 p-2 bg-slate-100 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 flex items-center justify-between select-all">
              <span className="truncate flex-1 pr-2">{shareModal.url}</span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setShareModal({ isOpen: false, title: '', url: '' })}
              className="mt-5 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 4. PLAN UPGRADE & SUBSCRIPTION MODAL */}
      <PlanUpgradeModal />

      {/* 5. OWNER PROPERTY INTAKE SUBMIT MODAL */}
      <OwnerSubmitModal />

      {/* 6. CREATE AGENT PRIVATE WEB MODAL */}
      <CreateAgentModal />

      {/* 7. PHOTO & HEADER PICKER MODAL */}
      <PhotoPickerModal />

      {/* 8. AI SMART LISTING DESCRIPTION MODAL */}
      <AIDescriptionModal 
        isOpen={aiDescriptionModal.isOpen}
        onClose={() => setAiDescriptionModal({ isOpen: false })}
        initialData={aiDescriptionModal.initialData}
        onApply={aiDescriptionModal.onApply}
      />
    </>
  );
};
