import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Discussion,
  CommunityUpdate,
  CommunityEvent,
  VolunteerOpportunity,
  Giveaway,
  AppNotification,
  BookmarkItem,
  SkillListing,
  MarketplaceItem,
  EmergencyContact,
  ChatRoom,
  ChatMessage,
  PeerProfile,
  HangoutMeetup,
  SubtownGroup,
  SubtownMessage,
  CivicProject,
  ProjectComment,
  ProjectResidentReport,
  FactCheckItem,
  CitizenSpotlightItem,
  StudentProfileVerification,
  AssignmentGroup,
  ReadingLearningGroup,
  CulturalEvent,
  InterfaithInitiative,
} from '../types';
import { ThemeId, ThemeConfig, COMMUNITY_THEMES } from '../types/theme';
import { soundEffects } from '../services/soundEffects';
import {
  DEFAULT_USER,
  DEMO_USERS,
  INITIAL_DISCUSSIONS,
  INITIAL_UPDATES,
  INITIAL_EVENTS,
  INITIAL_VOLUNTEERING,
  INITIAL_GIVEAWAYS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SKILLS,
  INITIAL_MARKETPLACE,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_CHAT_ROOMS,
  INITIAL_PEERS,
  INITIAL_MEETUPS,
  INITIAL_SUBTOWN_GROUPS,
} from '../data/initialData';
import {
  INITIAL_CIVIC_PROJECTS,
  INITIAL_FACT_CHECKS,
} from '../data/civicData';
import { INITIAL_CITIZEN_SPOTLIGHTS } from '../data/spotlightData';
import { CULTURAL_CALENDAR_EVENTS, INTERFAITH_INITIATIVES } from '../data/cultureData';
import { INITIAL_ASSIGNMENT_GROUPS, INITIAL_READING_GROUPS } from '../data/secondarySchoolData';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  discussions: Discussion[];
  addDiscussion: (
    title: string,
    content: string,
    category: Discussion['category'],
    lga: Discussion['lga'],
    tags: string[],
    pollData?: { question: string; options: string[] }
  ) => void;
  votePoll: (discussionId: string, optionId: string) => void;
  upvoteDiscussion: (id: string) => void;
  addComment: (discussionId: string, content: string) => void;
  updates: CommunityUpdate[];
  likeUpdate: (id: string) => void;
  addUpdate: (title: string, content: string, category: CommunityUpdate['category'], lga: CommunityUpdate['lga'], imageUrl?: string) => void;
  events: CommunityEvent[];
  toggleRsvp: (eventId: string, status: 'going' | 'interested' | 'none') => void;
  toggleReminder: (eventId: string) => void;
  volunteering: VolunteerOpportunity[];
  toggleEnrollVolunteer: (id: string) => void;
  giveaways: Giveaway[];
  enterGiveaway: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  bookmarks: import('../types').BookmarkItem[];
  toggleBookmark: (item: Omit<import('../types').BookmarkItem, 'id' | 'savedAt'>) => boolean;
  removeBookmark: (itemId: string) => void;
  isBookmarked: (itemId: string) => boolean;
  isSavedModalOpen: boolean;
  setIsSavedModalOpen: (open: boolean) => void;
  dailyCheckIn: () => { success: boolean; pointsAwarded: number; streak: number; message: string };
  hasCheckedInToday: boolean;
  isCheckInModalOpen: boolean;
  setIsCheckInModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLGA: 'All' | 'Idanre' | 'Ifedore';
  setSelectedLGA: (lga: 'All' | 'Idanre' | 'Ifedore') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  isAuthenticated: boolean;
  login: (identifier: string, pin?: string) => boolean;
  loginWithDemoUser: (demoUser: UserProfile) => void;
  signup: (data: {
    name: string;
    username: string;
    phone: string;
    lga: 'Idanre' | 'Ifedore';
    community: string;
    interests: string[];
    pin?: string;
    bio?: string;
  }) => boolean;
  logout: () => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isSiteMenuOpen: boolean;
  setIsSiteMenuOpen: (open: boolean) => void;
  toggleSiteMenu: () => void;
  awardPoints: (amount: number, reason: string) => void;
  skills: SkillListing[];
  addSkillListing: (listing: Omit<SkillListing, 'id' | 'timestamp' | 'rating' | 'reviewsCount' | 'verified' | 'name' | 'username'>) => void;
  marketplaceItems: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'timestamp' | 'isAvailable' | 'sellerName' | 'sellerUsername'>) => void;
  emergencyContacts: EmergencyContact[];
  chatRooms: ChatRoom[];
  sendChatMessage: (roomId: string, content: string) => void;
  peers: PeerProfile[];
  addPeerProfile: (profile: Omit<PeerProfile, 'id' | 'timestamp' | 'connectedCount' | 'name' | 'username'>) => void;
  meetups: HangoutMeetup[];
  toggleMeetupRsvp: (meetupId: string) => void;
  subtownGroups: SubtownGroup[];
  toggleJoinSubtownGroup: (subtownId: string) => void;
  addSubtownMessage: (subtownId: string, content: string) => void;
  civicProjects: CivicProject[];
  addProjectReport: (
    projectId: string,
    statusClaimed: CivicProject['status'],
    note: string,
    photoUrl?: string,
    coordinates?: { lat: number; lng: number; accuracy?: number },
    geotagLabel?: string,
    reportType?: 'Project Update' | 'New Infrastructure Need' | 'Urgent Defect / Hazard',
    priority?: 'High / Critical' | 'Moderate' | 'Routine'
  ) => void;
  upvoteProjectReport: (projectId: string, reportId: string) => void;
  addCivicProject: (project: Omit<CivicProject, 'id' | 'residentReports'>) => void;
  addProjectComment: (projectId: string, text: string) => void;
  upvoteProjectComment: (projectId: string, commentId: string) => void;
  factChecks: FactCheckItem[];
  submitFactCheckClaim: (claim: string, claimant: string, category: FactCheckItem['category']) => void;
  citizenSpotlights: CitizenSpotlightItem[];
  toggleSupportSpotlight: (id: string) => void;
  nominateSpotlight: (spotlight: Omit<CitizenSpotlightItem, 'id' | 'supportsCount' | 'isSupported' | 'verifiedBadge'>) => void;
  studentVerification: StudentProfileVerification;
  verifyStudentProfile: (data: Omit<StudentProfileVerification, 'isVerified' | 'verificationDate' | 'badgeEarned'>) => void;
  assignmentGroups: AssignmentGroup[];
  toggleJoinAssignmentGroup: (id: string) => void;
  postAssignmentQuestion: (groupId: string, questionText: string) => void;
  readingGroups: ReadingLearningGroup[];
  toggleJoinReadingGroup: (id: string) => void;
  culturalEvents: CulturalEvent[];
  toggleCulturalReminder: (eventId: string) => void;
  interfaithInitiatives: InterfaithInitiative[];
  toggleSupportInterfaith: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentTheme: ThemeId;
  setCurrentTheme: (theme: ThemeId) => void;
  themeConfig: ThemeConfig;
  soundEnabled: boolean;
  toggleSound: () => void;
  ambientMotion: boolean;
  toggleAmbientMotion: () => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  playSound: (type: 'click' | 'upvote' | 'success' | 'celebrate' | 'proverb' | 'theme') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ok_idanre_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = localStorage.getItem('ok_idanre_discussions');
    if (saved) {
      try {
        const parsed: Discussion[] = JSON.parse(saved);
        return parsed.map(d => {
          const init = INITIAL_DISCUSSIONS.find(i => i.id === d.id);
          if (init?.poll && !d.poll) {
            return { ...d, poll: init.poll };
          }
          return d;
        });
      } catch {
        // fallback to initial
      }
    }
    return INITIAL_DISCUSSIONS;
  });

  const [updates, setUpdates] = useState<CommunityUpdate[]>(() => {
    const saved = localStorage.getItem('ok_idanre_updates');
    return saved ? JSON.parse(saved) : INITIAL_UPDATES;
  });

  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    const saved = localStorage.getItem('ok_idanre_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [volunteering, setVolunteering] = useState<VolunteerOpportunity[]>(() => {
    const saved = localStorage.getItem('ok_idanre_volunteering');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERING;
  });

  const [giveaways, setGiveaways] = useState<Giveaway[]>(() => {
    const saved = localStorage.getItem('ok_idanre_giveaways');
    return saved ? JSON.parse(saved) : INITIAL_GIVEAWAYS;
  });

  const [skills, setSkills] = useState<SkillListing[]>(() => {
    const saved = localStorage.getItem('ok_idanre_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('ok_idanre_marketplace');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  const [emergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('ok_idanre_chat_rooms');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_ROOMS;
  });

  const [peers, setPeers] = useState<PeerProfile[]>(() => {
    const saved = localStorage.getItem('ok_idanre_peers');
    return saved ? JSON.parse(saved) : INITIAL_PEERS;
  });

  const [meetups, setMeetups] = useState<HangoutMeetup[]>(() => {
    const saved = localStorage.getItem('ok_idanre_meetups');
    return saved ? JSON.parse(saved) : INITIAL_MEETUPS;
  });

  const [subtownGroups, setSubtownGroups] = useState<SubtownGroup[]>(() => {
    const saved = localStorage.getItem('ok_idanre_subtown_groups');
    return saved ? JSON.parse(saved) : INITIAL_SUBTOWN_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_subtown_groups', JSON.stringify(subtownGroups));
  }, [subtownGroups]);

  const toggleJoinSubtownGroup = (subtownId: string) => {
    setSubtownGroups(prev =>
      prev.map(group => {
        if (group.id === subtownId) {
          const nextJoined = !group.isJoined;
          return {
            ...group,
            isJoined: nextJoined,
            memberCount: nextJoined ? group.memberCount + 1 : Math.max(0, group.memberCount - 1),
          };
        }
        return group;
      })
    );
  };

  const addSubtownMessage = (subtownId: string, content: string) => {
    if (!content.trim()) return;
    const newMessage: SubtownMessage = {
      id: `msg_sub_${Date.now()}`,
      subtownId,
      authorName: user.name,
      authorUsername: user.username,
      authorLga: user.lga,
      content: content.trim(),
      timestamp: 'Just now',
    };
    setSubtownGroups(prev =>
      prev.map(group => {
        if (group.id === subtownId) {
          return {
            ...group,
            messages: [newMessage, ...group.messages],
          };
        }
        return group;
      })
    );
  };

  const [civicProjects, setCivicProjects] = useState<CivicProject[]>(() => {
    const saved = localStorage.getItem('ok_idanre_civic_projects');
    if (saved) {
      try {
        const parsed: CivicProject[] = JSON.parse(saved);
        return parsed.map(p => {
          const initial = INITIAL_CIVIC_PROJECTS.find(ip => ip.id === p.id);
          const comments = (p.comments && p.comments.length > 0) ? p.comments : (initial?.comments || []);
          return {
            ...p,
            comments,
          };
        });
      } catch {
        // fallback
      }
    }
    return INITIAL_CIVIC_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_civic_projects', JSON.stringify(civicProjects));
  }, [civicProjects]);

  const [factChecks, setFactChecks] = useState<FactCheckItem[]>(() => {
    const saved = localStorage.getItem('ok_idanre_fact_checks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_FACT_CHECKS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_fact_checks', JSON.stringify(factChecks));
  }, [factChecks]);

  const addProjectReport = (
    projectId: string,
    statusClaimed: CivicProject['status'],
    note: string,
    photoUrl?: string,
    coordinates?: { lat: number; lng: number; accuracy?: number },
    geotagLabel?: string,
    reportType?: 'Project Update' | 'New Infrastructure Need' | 'Urgent Defect / Hazard',
    priority?: 'High / Critical' | 'Moderate' | 'Routine'
  ) => {
    if (!note.trim()) return;
    const newReport: ProjectResidentReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reporterName: user.name,
      reporterUsername: user.username,
      reporterLga: user.lga,
      timestamp: 'Just now',
      statusClaimed,
      photoUrl,
      note: note.trim(),
      upvotes: 1,
      isUpvoted: true,
      verified: true,
      coordinates,
      geotagLabel,
      reportType: reportType || 'Project Update',
      priority: priority || 'Moderate',
      verificationsCount: 1,
    };

    setCivicProjects(prev =>
      prev.map(proj => {
        if (proj.id === projectId) {
          return {
            ...proj,
            status: statusClaimed,
            residentReports: [newReport, ...proj.residentReports],
          };
        }
        return proj;
      })
    );

    awardPoints(35, 'Submitted geotagged infrastructure report with photo verification');
  };

  const upvoteProjectReport = (projectId: string, reportId: string) => {
    setCivicProjects(prev =>
      prev.map(proj => {
        if (proj.id === projectId) {
          return {
            ...proj,
            residentReports: proj.residentReports.map(rep => {
              if (rep.id === reportId) {
                const nextUpvoted = !rep.isUpvoted;
                const newUpvotes = nextUpvoted ? rep.upvotes + 1 : Math.max(0, rep.upvotes - 1);
                const currentVerifs = rep.verificationsCount || rep.upvotes || 1;
                return {
                  ...rep,
                  isUpvoted: nextUpvoted,
                  upvotes: newUpvotes,
                  verificationsCount: nextUpvoted ? currentVerifs + 1 : Math.max(1, currentVerifs - 1),
                };
              }
              return rep;
            }),
          };
        }
        return proj;
      })
    );
    awardPoints(5, 'Verified community infrastructure update');
  };

  const addCivicProject = (projectData: Omit<CivicProject, 'id' | 'residentReports'>) => {
    const newProj: CivicProject = {
      ...projectData,
      id: `proj_${Date.now()}`,
      residentReports: [
        {
          id: `rep_init_${Date.now()}`,
          reporterName: user.name,
          reporterUsername: user.username,
          reporterLga: user.lga,
          timestamp: 'Just now',
          statusClaimed: projectData.status,
          note: 'Initial citizen project tracking logged on Ok Idanre portal.',
          upvotes: 1,
          isUpvoted: true,
          verified: false,
        },
      ],
    };
    setCivicProjects(prev => [newProj, ...prev]);
    awardPoints(40, 'Logged new ward capital project for community tracking');
  };

  const addProjectComment = (projectId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: ProjectComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      authorName: user.name,
      authorUsername: user.username,
      authorCommunity: user.community || `${user.lga} Resident`,
      authorLga: user.lga,
      timestamp: 'Just now',
      text: text.trim(),
      upvotes: 0,
      isUpvoted: false,
    };

    setCivicProjects(prev =>
      prev.map(proj => {
        if (proj.id === projectId) {
          const currentComments = proj.comments || [];
          return {
            ...proj,
            comments: [newComment, ...currentComments],
          };
        }
        return proj;
      })
    );
    awardPoints(15, 'Contributed citizen observation on ward capital project');
  };

  const upvoteProjectComment = (projectId: string, commentId: string) => {
    setCivicProjects(prev =>
      prev.map(proj => {
        if (proj.id === projectId) {
          return {
            ...proj,
            comments: (proj.comments || []).map(comm => {
              if (comm.id === commentId) {
                const nextUpvoted = !comm.isUpvoted;
                return {
                  ...comm,
                  isUpvoted: nextUpvoted,
                  upvotes: nextUpvoted ? comm.upvotes + 1 : Math.max(0, comm.upvotes - 1),
                };
              }
              return comm;
            }),
          };
        }
        return proj;
      })
    );
  };

  const submitFactCheckClaim = (
    claim: string,
    claimant: string,
    category: FactCheckItem['category']
  ) => {
    const newItem: FactCheckItem = {
      id: `fc_${Date.now()}`,
      claim: claim.trim(),
      claimant: claimant.trim() || 'Community Submission',
      verdict: 'Misleading / Unverified',
      explanation: 'Under active verification by the Ok Idanre Civic Tech Desk. Citizen report logged for field confirmation.',
      publishedDate: 'Just now',
      verifiedBy: 'Ok Idanre Community Fact-Checking Desk',
      sources: ['Citizen Submission', 'Field verification scheduled'],
      category,
    };
    setFactChecks(prev => [newItem, ...prev]);
    awardPoints(15, 'Submitted civic claim for fact-checking');
  };

  // Citizen Spotlights State
  const [citizenSpotlights, setCitizenSpotlights] = useState<CitizenSpotlightItem[]>(() => {
    const saved = localStorage.getItem('ok_idanre_citizen_spotlights');
    if (saved) {
      try {
        const parsed: CitizenSpotlightItem[] = JSON.parse(saved);
        return parsed.map(item => ({
          ...item,
          photoUrl: item.photoUrl?.includes('assets/images') ? '' : item.photoUrl,
        }));
      } catch {
        // fallback
      }
    }
    return INITIAL_CITIZEN_SPOTLIGHTS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_citizen_spotlights', JSON.stringify(citizenSpotlights));
  }, [citizenSpotlights]);

  const toggleSupportSpotlight = (id: string) => {
    setCitizenSpotlights(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextSupported = !item.isSupported;
          return {
            ...item,
            isSupported: nextSupported,
            supportsCount: nextSupported ? item.supportsCount + 1 : Math.max(0, item.supportsCount - 1),
          };
        }
        return item;
      })
    );
    awardPoints(5, 'Supported a fellow citizen community action');
  };

  const nominateSpotlight = (data: Omit<CitizenSpotlightItem, 'id' | 'supportsCount' | 'isSupported' | 'verifiedBadge'>) => {
    const newItem: CitizenSpotlightItem = {
      ...data,
      id: `spot_${Date.now()}`,
      supportsCount: 1,
      isSupported: true,
      verifiedBadge: 'Community Action Nominated',
    };
    setCitizenSpotlights(prev => [newItem, ...prev]);
    awardPoints(35, 'Nominated youth citizen community achievement');
  };

  // Secondary School Student Verification State
  const [studentVerification, setStudentVerification] = useState<StudentProfileVerification>(() => {
    const saved = localStorage.getItem('ok_idanre_student_verification');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      isVerified: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_student_verification', JSON.stringify(studentVerification));
  }, [studentVerification]);

  const verifyStudentProfile = (data: Omit<StudentProfileVerification, 'isVerified' | 'verificationDate' | 'badgeEarned'>) => {
    const verifiedData: StudentProfileVerification = {
      ...data,
      isVerified: true,
      verificationDate: 'Verified Today',
      badgeEarned: 'Verified High School Scholar 🎓',
    };
    setStudentVerification(verifiedData);
    awardPoints(50, 'Verified secondary school student account');
  };

  // Assignment Groups State
  const [assignmentGroups, setAssignmentGroups] = useState<AssignmentGroup[]>(() => {
    const saved = localStorage.getItem('ok_idanre_assignment_groups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_ASSIGNMENT_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_assignment_groups', JSON.stringify(assignmentGroups));
  }, [assignmentGroups]);

  const toggleJoinAssignmentGroup = (id: string) => {
    setAssignmentGroups(prev =>
      prev.map(grp => {
        if (grp.id === id) {
          const nextJoined = !grp.isJoined;
          const currentCount = grp.membersCount || 10;
          return {
            ...grp,
            isJoined: nextJoined,
            membersCount: nextJoined ? currentCount + 1 : Math.max(1, currentCount - 1),
          };
        }
        return grp;
      })
    );
    awardPoints(15, 'Joined secondary school assignment study pod');
  };

  const postAssignmentQuestion = (groupId: string, questionText: string) => {
    if (!questionText.trim()) return;
    const newQ = {
      id: `q_${Date.now()}`,
      studentName: user.name,
      studentClass: studentVerification.classLevel ? `${studentVerification.classLevel}, ${studentVerification.schoolName || user.lga}` : `Student, ${user.lga}`,
      questionText: questionText.trim(),
      timestamp: 'Just now',
      solutionsCount: 0,
    };

    setAssignmentGroups(prev =>
      prev.map(grp => {
        if (grp.id === groupId) {
          const qCount = grp.questionsCount || 0;
          const questions = grp.recentQuestions || [];
          return {
            ...grp,
            questionsCount: qCount + 1,
            recentQuestions: [newQ, ...questions],
          };
        }
        return grp;
      })
    );
    awardPoints(20, 'Posted question in secondary school assignment study pod');
  };

  // Reading & Learning Groups State
  const [readingGroups, setReadingGroups] = useState<ReadingLearningGroup[]>(() => {
    const saved = localStorage.getItem('ok_idanre_reading_groups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_READING_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_reading_groups', JSON.stringify(readingGroups));
  }, [readingGroups]);

  const toggleJoinReadingGroup = (id: string) => {
    setReadingGroups(prev =>
      prev.map(rg => {
        if (rg.id === id) {
          const nextJoined = !rg.isJoined;
          const mCount = rg.membersCount || 15;
          return {
            ...rg,
            isJoined: nextJoined,
            membersCount: nextJoined ? mCount + 1 : Math.max(1, mCount - 1),
          };
        }
        return rg;
      })
    );
    awardPoints(15, 'Joined secondary school reading & exam prep circle');
  };

  // Cultural Events State
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>(() => {
    const saved = localStorage.getItem('ok_idanre_cultural_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return CULTURAL_CALENDAR_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_cultural_events', JSON.stringify(culturalEvents));
  }, [culturalEvents]);

  const toggleCulturalReminder = (eventId: string) => {
    setCulturalEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          const nextReminder = !evt.isReminderSet;
          const remCount = evt.remindersCount || 5;
          return {
            ...evt,
            isReminderSet: nextReminder,
            remindersCount: nextReminder ? remCount + 1 : Math.max(0, remCount - 1),
          };
        }
        return evt;
      })
    );
  };

  // Interfaith Initiatives State
  const [interfaithInitiatives, setInterfaithInitiatives] = useState<InterfaithInitiative[]>(() => {
    const saved = localStorage.getItem('ok_idanre_interfaith');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INTERFAITH_INITIATIVES;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_interfaith', JSON.stringify(interfaithInitiatives));
  }, [interfaithInitiatives]);

  const toggleSupportInterfaith = (id: string) => {
    setInterfaithInitiatives(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextSupported = !item.isSupported;
          const supCount = item.supportersCount || 20;
          return {
            ...item,
            isSupported: nextSupported,
            supportersCount: nextSupported ? supCount + 1 : Math.max(0, supCount - 1),
          };
        }
        return item;
      })
    );
    awardPoints(10, 'Supported interfaith community peace initiative');
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ok_idanre_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('ok_idanre_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const [currentTheme, setCurrentThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('ok_idanre_theme');
    return (saved && COMMUNITY_THEMES[saved as ThemeId]) ? (saved as ThemeId) : 'oke-emerald';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ok_idanre_sound_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [ambientMotion, setAmbientMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem('ok_idanre_ambient_motion');
    return saved ? JSON.parse(saved) : true;
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ok_idanre_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_sound_enabled', JSON.stringify(soundEnabled));
    soundEffects.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_ambient_motion', JSON.stringify(ambientMotion));
  }, [ambientMotion]);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      soundEffects.setMuted(!next);
      if (next) soundEffects.playClick();
      return next;
    });
  };

  const toggleAmbientMotion = () => {
    setAmbientMotion(prev => !prev);
  };

  const setCurrentTheme = (theme: ThemeId) => {
    setCurrentThemeState(theme);
    if (soundEnabled) soundEffects.playThemeSwitch();
  };

  const playSound = (type: 'click' | 'upvote' | 'success' | 'celebrate' | 'proverb' | 'theme') => {
    if (!soundEnabled) return;
    switch (type) {
      case 'click': soundEffects.playClick(); break;
      case 'upvote': soundEffects.playUpvote(); break;
      case 'success': soundEffects.playSuccess(); break;
      case 'celebrate': soundEffects.playCelebrate(); break;
      case 'proverb': soundEffects.playProverb(); break;
      case 'theme': soundEffects.playThemeSwitch(); break;
    }
  };

  const themeConfig = COMMUNITY_THEMES[currentTheme] || COMMUNITY_THEMES['oke-emerald'];

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ok_idanre_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('ok_idanre_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'bm_init_1',
        itemId: 'disc_1',
        type: 'discussion',
        title: 'How can young people in Idanre & Ifedore collaborate on cocoa value addition rather than selling raw beans?',
        snippet: 'Ondo State remains the heartbeat of Nigerian cocoa production, yet most youth in Idanre and Ifedore sell raw cocoa beans to middlemen...',
        lga: 'Both',
        category: 'Agribusiness',
        timestamp: '2 hours ago',
        savedAt: 'Saved recently',
        authorOrOrganizer: 'Kehinde Akinwumi',
      },
      {
        id: 'bm_init_2',
        itemId: 'ev_1',
        type: 'event',
        title: 'Idanre Hills Youth Tech & Eco Summit 2026',
        snippet: 'A 2-day flagship convention bringing together 500+ young innovators, student leaders, agricultural pioneers...',
        lga: 'Both',
        category: 'Youth Summit',
        timestamp: 'Saturday, Nov 14, 2026',
        savedAt: 'Saved recently',
        authorOrOrganizer: 'Ok Idanre Youth Network',
        imageUrl: '',
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedLGA, setSelectedLGA] = useState<'All' | 'Idanre' | 'Ifedore'>('All');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('ok_idanre_authenticated');
    return saved !== null ? saved === 'true' : true;
  });

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const loginWithDemoUser = (demoUser: UserProfile) => {
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem('ok_idanre_authenticated', 'true');
    localStorage.setItem('ok_idanre_user', JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
    playSound('success');
  };

  const login = (identifier: string, _pin?: string): boolean => {
    const cleanId = identifier.trim().toLowerCase().replace('@', '');
    const cleanDigits = identifier.replace(/[^0-9]/g, '');

    // Check demo profiles first
    const matched = DEMO_USERS.find(
      u =>
        u.username.toLowerCase() === cleanId ||
        (cleanDigits.length >= 8 && u.phone.replace(/[^0-9]/g, '').endsWith(cleanDigits.slice(-8)))
    );

    if (matched) {
      loginWithDemoUser(matched);
      return true;
    }

    // Check localStorage saved accounts DB
    const savedDb = localStorage.getItem('ok_idanre_users_db');
    if (savedDb) {
      try {
        const users: UserProfile[] = JSON.parse(savedDb);
        const userMatch = users.find(
          u =>
            u.username.toLowerCase() === cleanId ||
            (cleanDigits.length >= 8 && u.phone.replace(/[^0-9]/g, '').endsWith(cleanDigits.slice(-8)))
        );
        if (userMatch) {
          loginWithDemoUser(userMatch);
          return true;
        }
      } catch {}
    }

    // Fallback: create fresh member profile with this identifier
    const newProfile: UserProfile = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      username: cleanId || 'citizen_idanre',
      name: identifier.includes('@') ? identifier.replace('@', '') : identifier,
      phone: identifier.startsWith('0') || identifier.startsWith('+') ? identifier : '+234 803 123 4567',
    };
    loginWithDemoUser(newProfile);
    return true;
  };

  const signup = (data: {
    name: string;
    username: string;
    phone: string;
    lga: 'Idanre' | 'Ifedore';
    community: string;
    interests: string[];
    pin?: string;
    bio?: string;
  }): boolean => {
    const formattedUsername = data.username.trim()
      ? data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
      : data.name.toLowerCase().replace(/\s+/g, '_');

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      phone: data.phone.startsWith('+234') ? data.phone : `+234 ${data.phone.replace(/^0/, '')}`,
      name: data.name.trim(),
      username: formattedUsername,
      lga: data.lga,
      community: data.community.trim() || (data.lga === 'Idanre' ? 'Odode Idanre' : 'Igbara-Oke'),
      interests: data.interests.length > 0 ? data.interests : ['Civic Leadership', 'Agribusiness'],
      bio: data.bio || `Young changemaker from ${data.community || data.lga}. Committed to youth empowerment and community development.`,
      points: 100, // 100 Welcome Points
      volunteerHours: 0,
      badges: ['New Member', 'Active Citizen'],
      joinedDate: 'Joined Today',
      checkInStreak: 1,
      totalCheckIns: 1,
    };

    // Save to users DB in localStorage
    const savedDb = localStorage.getItem('ok_idanre_users_db');
    const existing: UserProfile[] = savedDb ? JSON.parse(savedDb) : [...DEMO_USERS];
    existing.push(newProfile);
    localStorage.setItem('ok_idanre_users_db', JSON.stringify(existing));

    setUser(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('ok_idanre_authenticated', 'true');
    localStorage.setItem('ok_idanre_user', JSON.stringify(newProfile));
    awardPoints(50, 'Welcome bonus for joining Ok Idanre community!');
    setIsAuthModalOpen(false);
    playSound('celebrate');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('ok_idanre_authenticated', 'false');
    playSound('click');
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const toggleSiteMenu = () => {
    setIsSiteMenuOpen(prev => !prev);
    playSound('click');
  };

  const getTodayDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayDateStr = () => {
    const yesterday = new Date(Date.now() - 86400000);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasCheckedInToday = user.lastCheckInDate === getTodayDateStr();

  const dailyCheckIn = () => {
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();

    if (user.lastCheckInDate === today) {
      return {
        success: false,
        pointsAwarded: 0,
        streak: user.checkInStreak || 1,
        message: 'You have already checked in today! Come back tomorrow to continue your streak.',
      };
    }

    const wasYesterday = user.lastCheckInDate === yesterday;
    const newStreak = wasYesterday ? (user.checkInStreak || 0) + 1 : 1;
    const streakBonus = newStreak >= 3 ? 10 : 0;
    const totalAwarded = 20 + streakBonus;

    setUser(prev => ({
      ...prev,
      points: prev.points + totalAwarded,
      lastCheckInDate: today,
      checkInStreak: newStreak,
      totalCheckIns: (prev.totalCheckIns || 0) + 1,
    }));

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Daily Check-in: +${totalAwarded} Points!`,
      message: streakBonus > 0
        ? `🔥 ${newStreak}-Day Streak! Earned 20 base points + 10 streak bonus for active community engagement.`
        : `Earned 20 community points for today's check-in! Keep visiting Ok Idanre daily to build your streak.`,
      timestamp: 'Just now',
      type: 'system',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    playSound('celebrate');

    return {
      success: true,
      pointsAwarded: totalAwarded,
      streak: newStreak,
      message: streakBonus > 0
        ? `Checked in! +${totalAwarded} points (${newStreak}-day streak bonus!)`
        : `Checked in! +${totalAwarded} community points earned!`,
    };
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ok_idanre_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_updates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_volunteering', JSON.stringify(volunteering));
  }, [volunteering]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_giveaways', JSON.stringify(giveaways));
  }, [giveaways]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  const awardPoints = (amount: number, reason: string) => {
    setUser(prev => ({
      ...prev,
      points: prev.points + amount,
    }));
    // Also push a notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `+${amount} Community Points!`,
      message: reason,
      timestamp: 'Just now',
      type: 'system',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    playSound('celebrate');
  };

  const addDiscussion = (
    title: string,
    content: string,
    category: Discussion['category'],
    lga: Discussion['lga'],
    tags: string[],
    pollData?: { question: string; options: string[] }
  ) => {
    let createdPoll: Discussion['poll'] = undefined;
    if (pollData && pollData.question.trim() && pollData.options.length >= 2) {
      createdPoll = {
        id: `poll_${Date.now()}`,
        question: pollData.question.trim(),
        options: pollData.options.map((optText, i) => ({
          id: `opt_${Date.now()}_${i}`,
          text: optText.trim(),
          votesCount: 0,
        })),
        totalVotes: 0,
      };
    }

    const newDisc: Discussion = {
      id: `disc_${Date.now()}`,
      title,
      content,
      category,
      lga,
      authorName: user.name,
      authorUsername: user.username,
      authorLga: user.lga,
      timestamp: 'Just now',
      upvotes: 1,
      isUpvoted: true,
      commentsCount: 0,
      tags: tags.length > 0 ? tags : ['YouthVoice', category],
      comments: [],
      poll: createdPoll,
    };
    setDiscussions(prev => [newDisc, ...prev]);
    awardPoints(25, 'Earned 25 community impact points for initiating a discussion.');
  };

  const votePoll = (discussionId: string, optionId: string) => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId && d.poll) {
          const previousVotedOptionId = d.poll.userVotedOptionId;
          // If clicked same option again, ignore
          if (previousVotedOptionId === optionId) return d;

          const updatedOptions = d.poll.options.map(opt => {
            if (opt.id === optionId) {
              return { ...opt, votesCount: opt.votesCount + 1 };
            }
            if (opt.id === previousVotedOptionId) {
              return { ...opt, votesCount: Math.max(0, opt.votesCount - 1) };
            }
            return opt;
          });

          const newTotalVotes = previousVotedOptionId
            ? d.poll.totalVotes
            : d.poll.totalVotes + 1;

          return {
            ...d,
            poll: {
              ...d.poll,
              options: updatedOptions,
              totalVotes: newTotalVotes,
              userVotedOptionId: optionId,
            },
          };
        }
        return d;
      })
    );
    awardPoints(10, 'Participated in a community poll! +10 points.');
  };

  const upvoteDiscussion = (id: string) => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === id) {
          const wasUpvoted = d.isUpvoted;
          return {
            ...d,
            isUpvoted: !wasUpvoted,
            upvotes: wasUpvoted ? d.upvotes - 1 : d.upvotes + 1,
          };
        }
        return d;
      })
    );
  };

  const addComment = (discussionId: string, content: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: user.name,
      authorUsername: user.username,
      authorLga: user.lga,
      content,
      timestamp: 'Just now',
      upvotes: 0,
    };
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            commentsCount: d.commentsCount + 1,
            comments: [...d.comments, newComment],
          };
        }
        return d;
      })
    );
    awardPoints(15, 'Earned 15 points for constructive community dialogue.');
  };

  const likeUpdate = (id: string) => {
    setUpdates(prev =>
      prev.map(u => {
        if (u.id === id) {
          const wasLiked = u.isLiked;
          return {
            ...u,
            isLiked: !wasLiked,
            likes: wasLiked ? u.likes - 1 : u.likes + 1,
          };
        }
        return u;
      })
    );
  };

  const addUpdate = (
    title: string,
    content: string,
    category: CommunityUpdate['category'],
    lga: CommunityUpdate['lga'],
    imageUrl?: string
  ) => {
    const newUpdate: CommunityUpdate = {
      id: `upd_${Date.now()}`,
      title,
      content,
      category,
      lga,
      publisher: user.name,
      publisherRole: `${user.community} Youth Rep`,
      timestamp: 'Just now',
      imageUrl,
      likes: 1,
      isLiked: true,
      shares: 0,
      tags: ['YouthUpdate', user.lga],
    };
    setUpdates(prev => [newUpdate, ...prev]);
    awardPoints(20, 'Earned 20 points for publishing a community update.');
  };

  const toggleRsvp = (eventId: string, status: 'going' | 'interested' | 'none') => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const delta = status === 'going' && ev.rsvpStatus !== 'going' ? 1 : ev.rsvpStatus === 'going' && status !== 'going' ? -1 : 0;
          return {
            ...ev,
            rsvpStatus: status,
            attendeesCount: Math.max(0, ev.attendeesCount + delta),
          };
        }
        return ev;
      })
    );
    if (status === 'going') {
      awardPoints(10, 'RSVP confirmed for community event.');
    }
  };

  const toggleReminder = (eventId: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const newState = !ev.reminderSet;
          if (newState) {
            setNotifications(nPrev => [
              {
                id: `notif_${Date.now()}`,
                title: 'Event Reminder Set',
                message: `We will notify you before "${ev.title}" starts!`,
                timestamp: 'Just now',
                type: 'event',
                isRead: false,
                linkTab: 'events',
              },
              ...nPrev,
            ]);
          }
          return { ...ev, reminderSet: newState };
        }
        return ev;
      })
    );
  };

  const toggleEnrollVolunteer = (id: string) => {
    setVolunteering(prev =>
      prev.map(v => {
        if (v.id === id) {
          const newStatus = !v.isEnrolled;
          return {
            ...v,
            isEnrolled: newStatus,
            enrolledCount: newStatus ? v.enrolledCount + 1 : Math.max(0, v.enrolledCount - 1),
          };
        }
        return v;
      })
    );
    setUser(prev => ({
      ...prev,
      volunteerHours: prev.volunteerHours + 4,
    }));
    awardPoints(50, 'Registered as volunteer for community development project.');
  };

  const enterGiveaway = (id: string) => {
    setGiveaways(prev =>
      prev.map(gw => {
        if (gw.id === id) {
          return {
            ...gw,
            isEntered: true,
            entriesCount: gw.entriesCount + 1,
          };
        }
        return gw;
      })
    );
    awardPoints(5, 'Entered community reward raffle.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleBookmark = (item: Omit<BookmarkItem, 'id' | 'savedAt'>): boolean => {
    const existing = bookmarks.find(b => b.itemId === item.itemId);
    if (existing) {
      setBookmarks(prev => prev.filter(b => b.itemId !== item.itemId));
      return false; // removed
    } else {
      const newBm: BookmarkItem = {
        ...item,
        id: `bm_${Date.now()}`,
        savedAt: 'Just now',
      };
      setBookmarks(prev => [newBm, ...prev]);
      awardPoints(5, `Bookmarked "${item.title.slice(0, 32)}..." to your saved list.`);
      return true; // saved
    }
  };

  const removeBookmark = (itemId: string) => {
    setBookmarks(prev => prev.filter(b => b.itemId !== itemId));
  };

  const isBookmarked = (itemId: string) => {
    return bookmarks.some(b => b.itemId === itemId);
  };

  const addSkillListing = (listingData: Omit<SkillListing, 'id' | 'timestamp' | 'rating' | 'reviewsCount' | 'verified' | 'name' | 'username'>) => {
    const newListing: SkillListing = {
      ...listingData,
      id: `skill_${Date.now()}`,
      name: user.name,
      username: user.username,
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      timestamp: 'Just now',
    };
    setSkills(prev => [newListing, ...prev]);
    awardPoints(30, 'Earned 30 points for registering your verified youth skill listing.');
  };

  const addMarketplaceItem = (itemData: Omit<MarketplaceItem, 'id' | 'timestamp' | 'isAvailable' | 'sellerName' | 'sellerUsername'>) => {
    const newItem: MarketplaceItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      sellerName: user.name,
      sellerUsername: user.username,
      isAvailable: true,
      timestamp: 'Just now',
    };
    setMarketplaceItems(prev => [newItem, ...prev]);
    awardPoints(20, 'Earned 20 points for posting an item on the youth marketplace.');
  };

  const sendChatMessage = (roomId: string, content: string) => {
    if (!content.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId,
      authorName: user.name,
      authorUsername: user.username,
      authorLga: user.lga,
      content,
      timestamp: 'Just now',
    };
    setChatRooms(prev =>
      prev.map(room => {
        if (room.id === roomId) {
          return { ...room, messages: [...room.messages, newMsg] };
        }
        return room;
      })
    );
    awardPoints(5, 'Earned 5 points for participating in youth community group chat.');
  };

  const addPeerProfile = (profileData: Omit<PeerProfile, 'id' | 'timestamp' | 'connectedCount' | 'name' | 'username'>) => {
    const newPeer: PeerProfile = {
      ...profileData,
      id: `peer_${Date.now()}`,
      name: user.name,
      username: user.username,
      connectedCount: 1,
      timestamp: 'Just now',
    };
    setPeers(prev => [newPeer, ...prev]);
    awardPoints(25, 'Earned 25 points for listing your profile in the Peer Matching directory.');
  };

  const toggleMeetupRsvp = (meetupId: string) => {
    setMeetups(prev =>
      prev.map(m => {
        if (m.id === meetupId) {
          const nextRsvp = !m.isRSVPed;
          const updatedAttendees = nextRsvp
            ? [...m.attendees, { name: user.name, username: user.username }]
            : m.attendees.filter(a => a.username !== user.username);
          if (nextRsvp) {
            awardPoints(15, 'Earned 15 points for RSVPing to a local hangout meetup.');
          }
          return {
            ...m,
            isRSVPed: nextRsvp,
            attendeesCount: nextRsvp ? m.attendeesCount + 1 : Math.max(0, m.attendeesCount - 1),
            attendees: updatedAttendees,
          };
        }
        return m;
      })
    );
  };

  useEffect(() => {
    localStorage.setItem('ok_idanre_chat_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_peers', JSON.stringify(peers));
  }, [peers]);

  useEffect(() => {
    localStorage.setItem('ok_idanre_meetups', JSON.stringify(meetups));
  }, [meetups]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        discussions,
        addDiscussion,
        votePoll,
        upvoteDiscussion,
        addComment,
        updates,
        likeUpdate,
        addUpdate,
        events,
        toggleRsvp,
        toggleReminder,
        volunteering,
        toggleEnrollVolunteer,
        giveaways,
        enterGiveaway,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        bookmarks,
        toggleBookmark,
        removeBookmark,
        isBookmarked,
        isSavedModalOpen,
        setIsSavedModalOpen,
        dailyCheckIn,
        hasCheckedInToday,
        isCheckInModalOpen,
        setIsCheckInModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        activeTab,
        setActiveTab,
        selectedLGA,
        setSelectedLGA,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        isAuthenticated,
        login,
        loginWithDemoUser,
        signup,
        logout,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        isSiteMenuOpen,
        setIsSiteMenuOpen,
        toggleSiteMenu,
        awardPoints,
        skills,
        addSkillListing,
        marketplaceItems,
        addMarketplaceItem,
        emergencyContacts,
        chatRooms,
        sendChatMessage,
        peers,
        addPeerProfile,
        meetups,
        toggleMeetupRsvp,
        subtownGroups,
        toggleJoinSubtownGroup,
        addSubtownMessage,
        civicProjects,
        addProjectReport,
        upvoteProjectReport,
        addCivicProject,
        addProjectComment,
        upvoteProjectComment,
        factChecks,
        submitFactCheckClaim,
        citizenSpotlights,
        toggleSupportSpotlight,
        nominateSpotlight,
        studentVerification,
        verifyStudentProfile,
        assignmentGroups,
        toggleJoinAssignmentGroup,
        postAssignmentQuestion,
        readingGroups,
        toggleJoinReadingGroup,
        culturalEvents,
        toggleCulturalReminder,
        interfaithInitiatives,
        toggleSupportInterfaith,
        isDarkMode,
        toggleDarkMode,
        currentTheme,
        setCurrentTheme,
        themeConfig,
        soundEnabled,
        toggleSound,
        ambientMotion,
        toggleAmbientMotion,
        isThemeModalOpen,
        setIsThemeModalOpen,
        playSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
