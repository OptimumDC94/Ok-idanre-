import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, Users, Cpu, Sprout, Wrench, Flame, Sparkles, Shield, UserCheck } from 'lucide-react';

export const ChatRoomsTab: React.FC = () => {
  const { chatRooms, sendChatMessage, user } = useApp();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(chatRooms[0]?.id || 'room_tech');
  const [messageInput, setMessageInput] = useState('');

  const currentRoom = chatRooms.find(r => r.id === selectedRoomId) || chatRooms[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(selectedRoomId, messageInput);
    setMessageInput('');
  };

  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-600" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-600" />;
      default: return <MessageSquare className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Youth Group Chats · Idanre & Ifedore</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            Community Chat Rooms
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Connect directly with young artisans, tech talents, cocoa farmers, and student leaders across all wards. Share ideas, collaborate on projects, and build community together!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rooms Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            Available Chat Rooms ({chatRooms.length})
          </h3>
          <div className="space-y-2">
            {chatRooms.map(room => {
              const isActive = room.id === selectedRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 border flex items-start gap-3 ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-emerald-200/80 text-emerald-900' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {getRoomIcon(room.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-emerald-950' : 'text-stone-900'}`}>
                        {room.name}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{room.topic}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <Users className="w-3 h-3" />
                        {room.membersCount} active
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center shadow-sm">
                {getRoomIcon(currentRoom.iconName)}
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">{currentRoom.name}</h2>
                <p className="text-xs text-stone-500">{currentRoom.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-900 font-mono">
                {currentRoom.membersCount} online
              </span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-stone-50/50 to-white">
            <div className="text-center my-2">
              <span className="text-[11px] font-medium text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                🔒 Secure End-to-End Community Channel · Respect community guidelines & local decorum
              </span>
            </div>

            {currentRoom.messages.map(msg => {
              const isMe = msg.authorUsername === user.username;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-bold text-stone-800">{msg.authorName}</span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                      {msg.authorLga}
                    </span>
                    <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-sm shadow-xs ${
                      isMe
                        ? 'bg-emerald-800 text-white rounded-tr-xs'
                        : 'bg-stone-100 text-stone-800 rounded-tl-xs border border-stone-200/60'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-stone-200 bg-white flex items-center gap-3">
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder={`Message ${currentRoom.name}... (+5 points per message)`}
              className="flex-1 min-h-[46px] px-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm bg-stone-50/50"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="min-h-[46px] px-6 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
