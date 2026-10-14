import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Calendar, MessageSquare, HeartHandshake, Gift, Sparkles } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useApp();

  if (!isNotificationsModalOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-700" />;
      case 'discussion':
        return <MessageSquare className="w-4 h-4 text-sky-700" />;
      case 'volunteer':
        return <HeartHandshake className="w-4 h-4 text-amber-700" />;
      case 'giveaway':
        return <Gift className="w-4 h-4 text-purple-700" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-800" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        onClick={() => setIsNotificationsModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">Community Alerts</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-stone-600 hover:text-emerald-800 flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationsModalOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 py-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs">
              No new alerts. You are completely up to date!
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.linkTab) {
                    setActiveTab(n.linkTab);
                    setIsNotificationsModalOpen(false);
                  }
                }}
                className={`p-3 rounded-xl transition-colors cursor-pointer text-left ${
                  n.isRead ? 'hover:bg-stone-50 opacity-80' : 'bg-emerald-50/50 hover:bg-emerald-50/80 font-medium'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-stone-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-700 mt-1 shrink-0" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
