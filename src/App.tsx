import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AmbientBackground } from './components/AmbientBackground';
import { FloatingVibesDock } from './components/FloatingVibesDock';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { SkillsDirectoryTab } from './components/SkillsDirectoryTab';
import { MarketplaceTab } from './components/MarketplaceTab';
import { EmergencyTab } from './components/EmergencyTab';
import { DiscussionsTab } from './components/DiscussionsTab';
import { UpdatesTab } from './components/UpdatesTab';
import { EventsTab } from './components/EventsTab';
import { VolunteeringTab } from './components/VolunteeringTab';
import { GamesTab } from './components/GamesTab';
import { GiveawaysTab } from './components/GiveawaysTab';
import { CreativeStudioTab } from './components/CreativeStudioTab';
import { ChatRoomsTab } from './components/ChatRoomsTab';
import { PeerMatchingTab } from './components/PeerMatchingTab';
import { MeetupsTab } from './components/MeetupsTab';
import { SubtownGroupsTab } from './components/SubtownGroupsTab';
import { CivicTechTab } from './components/CivicTechTab';
import { CultureHeritageTab } from './components/CultureHeritageTab';
import { SecondarySchoolTab } from './components/SecondarySchoolTab';
import { YouthPulseHubTab } from './components/YouthPulseHubTab';
import { HomeTab } from './components/HomeTab';
import { AIAdvisorTab } from './components/AIAdvisorTab';
import { SiteMenuDrawer } from './components/SiteMenuDrawer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SavedBookmarksModal } from './components/SavedBookmarksModal';
import { CheckInModal } from './components/CheckInModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, isSearchModalOpen, setIsSearchModalOpen, themeConfig, playSound } = useApp();

  return (
    <div className="min-h-screen relative text-stone-900 dark:text-stone-100 flex flex-col justify-between transition-colors duration-500">
      {/* Dynamic Colorful Landscape Background */}
      <AmbientBackground />

      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-14">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'pulse' && <YouthPulseHubTab />}
          {activeTab === 'discussions' && <DiscussionsTab />}
          {activeTab === 'civic-tech' && <CivicTechTab />}
          {activeTab === 'culture-heritage' && <CultureHeritageTab />}
          {activeTab === 'secondary-school' && <SecondarySchoolTab />}
          {activeTab === 'subtowns' && <SubtownGroupsTab />}
          {activeTab === 'skills' && <SkillsDirectoryTab />}
          {activeTab === 'marketplace' && <MarketplaceTab />}
          {activeTab === 'emergency' && <EmergencyTab />}
          {activeTab === 'chat' && <ChatRoomsTab />}
          {activeTab === 'peers' && <PeerMatchingTab />}
          {activeTab === 'meetups' && <MeetupsTab />}
          {activeTab === 'ai-advisor' && <AIAdvisorTab />}
          {activeTab === 'updates' && <UpdatesTab />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'volunteering' && <VolunteeringTab />}
          {activeTab === 'games' && <GamesTab />}
          {activeTab === 'giveaways' && <GiveawaysTab />}
          {activeTab === 'studio' && <CreativeStudioTab />}
        </main>
      </div>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md py-8 text-stone-500 dark:text-stone-400 text-xs mt-12 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 dark:text-stone-100">Ok Idanre</span>
            <span aria-hidden="true">·</span>
            <span>Connecting Youth, Building Community, Creating Change</span>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('home');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('discussions');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Discussions
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('civic-tech');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Civic Tech
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('culture-heritage');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Culture & Heritage
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('secondary-school');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              School Connect
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('events');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Events
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('volunteering');
              }}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Volunteering
            </button>
          </div>

          <div className="text-stone-400 dark:text-stone-500 flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeConfig.primaryColor }} />
            <span>Idanre & Ifedore · Ondo State</span>
          </div>
        </div>
      </footer>

      {/* Floating Theme & Audio Control Pill */}
      <FloatingVibesDock />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Modals */}
      <SiteMenuDrawer />
      <ThemeSelectorModal />
      <AuthModal />
      <ProfileModal />
      <NotificationsModal />
      <SavedBookmarksModal />
      <CheckInModal />
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
