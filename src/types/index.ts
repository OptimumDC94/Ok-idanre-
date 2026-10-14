export type LGA = 'Idanre' | 'Ifedore' | 'Both';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  username: string;
  lga: 'Idanre' | 'Ifedore';
  community: string;
  interests: string[];
  bio: string;
  avatarUrl?: string;
  points: number;
  volunteerHours: number;
  badges: string[];
  joinedDate: string;
  lastCheckInDate?: string;
  checkInStreak?: number;
  totalCheckIns?: number;
}

export interface DiscussionComment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorLga: 'Idanre' | 'Ifedore';
  content: string;
  timestamp: string;
  upvotes: number;
  isUpvoted?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}

export interface DiscussionPoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  expiresAt?: string;
}

export type DiscussionSortOption = 'latest' | 'popular' | 'unanswered';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  category: 'Governance' | 'Agribusiness' | 'Tourism & Culture' | 'Education & Tech' | 'Infrastructure' | 'Sports';
  lga: LGA;
  authorName: string;
  authorUsername: string;
  authorLga: 'Idanre' | 'Ifedore';
  timestamp: string;
  upvotes: number;
  isUpvoted?: boolean;
  commentsCount: number;
  comments: DiscussionComment[];
  isPinned?: boolean;
  tags: string[];
  poll?: DiscussionPoll;
}

export interface CommunityUpdate {
  id: string;
  title: string;
  content: string;
  category: 'Official Announcement' | 'Youth News' | 'Development Progress' | 'Cultural Heritage';
  lga: LGA;
  publisher: string;
  publisherRole: string;
  timestamp: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
  shares: number;
  tags: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: 'Town Hall' | 'Youth Summit' | 'Agriculture' | 'Culture & Tourism' | 'Sports' | 'Civic';
  lga: LGA;
  venue: string;
  date: string;
  time: string;
  organizer: string;
  imageUrl?: string;
  attendeesCount: number;
  rsvpStatus: 'going' | 'interested' | 'none';
  reminderSet: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  category: 'Environment' | 'Education' | 'Health' | 'Agriculture' | 'Community Service';
  lga: LGA;
  location: string;
  date: string;
  time: string;
  organizer: string;
  slotsTotal: number;
  slotsFilled: number;
  isEnrolled?: boolean;
  pointsReward: number;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Giveaway {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  category: string;
  totalSlots: number;
  claimedSlots: number;
  deadline: string;
  isEntered?: boolean;
  requirements: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'discussion' | 'event' | 'giveaway' | 'badge' | 'system' | 'civic';
  linkTab?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  type: 'discussion' | 'update' | 'event' | 'volunteer' | 'giveaway' | 'civic' | 'spotlight';
  itemId: string;
  savedAt: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  points: number;
  volunteerHours: number;
  badge: string;
  community: string;
  rank: number;
}

export interface SkillListing {
  id: string;
  name: string;
  username: string;
  skillCategory: 'Tech & Coding' | 'Agribusiness' | 'Artisan & Craft' | 'Creative & Media' | 'Languages & Tutoring';
  title: string;
  description: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  community: string;
  contactPhone: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  timestamp: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'Agri-Produce' | 'Crafts & Art' | 'Tech Gadgets' | 'Fashion & Books';
  lga: LGA;
  sellerName: string;
  sellerUsername: string;
  sellerPhone: string;
  pickupLocation: string;
  imageUrl?: string;
  isAvailable: boolean;
  condition: 'Brand New' | 'Fairly Used' | 'Locally Processed';
  timestamp: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  category: 'Police & Security' | 'Medical Emergency' | 'Fire Service' | 'Youth Helpline' | 'Traditional Council';
  phone: string;
  location: string;
  lga: LGA;
  description: string;
  hours: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  authorName: string;
  authorUsername: string;
  authorLga: 'Idanre' | 'Ifedore';
  content: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  topic: string;
  lga: LGA;
  membersCount: number;
  iconName: string;
  messages: ChatMessage[];
  isJoined?: boolean;
}

export interface PeerProfile {
  id: string;
  name: string;
  username: string;
  lga: 'Idanre' | 'Ifedore';
  community: string;
  skillsToOffer: string[];
  skillsSeeking: string[];
  matchType: string;
  bio: string;
  phone: string;
  whatsapp: string;
  connectedCount: number;
  isConnected?: boolean;
  timestamp: string;
}

export interface HangoutMeetup {
  id: string;
  title: string;
  description: string;
  category: string;
  lga: LGA;
  venue: string;
  date: string;
  time: string;
  organizer: string;
  attendeesCount: number;
  attendees: { name: string; username: string }[];
  isRSVPed?: boolean;
  imageUrl?: string;
}

export interface SubtownMessage {
  id: string;
  authorName: string;
  authorUsername: string;
  content: string;
  timestamp: string;
}

export interface SubtownGroup {
  id: string;
  name: string;
  lga: 'Idanre' | 'Ifedore';
  subtown: string;
  description: string;
  leaderName: string;
  memberCount: number;
  activeProjects: string[];
  meetingLocation: string;
  meetingTime: string;
  imageUrl: string;
  isJoined?: boolean;
  messages: SubtownMessage[];
}

// ==========================================
// Civic Tech, Polling Units & Fact-Check Interfaces
// ==========================================

export interface PoliticalWard {
  id: string;
  name: string;
  lga: 'Idanre' | 'Ifedore';
  code: string;
  councillorName: string;
  councillorPhone: string;
  councillorParty: string;
  registeredVotersEstimate: number;
  pollingUnitsCount: number;
  majorTowns: string[];
}

export interface ProjectComment {
  id: string;
  reporterName: string;
  reporterUsername: string;
  reporterLga: 'Idanre' | 'Ifedore';
  timestamp: string;
  statusClaimed: 'Proposed' | 'In Progress' | 'Completed' | 'Stalled';
  photoUrl?: string;
  note: string;
  upvotes: number;
  isUpvoted?: boolean;
  verified: boolean;
}

export interface ProjectResidentReport {
  id: string;
  reporterName: string;
  reporterUsername: string;
  reporterLga: 'Idanre' | 'Ifedore';
  timestamp: string;
  statusClaimed: 'Proposed' | 'In Progress' | 'Completed' | 'Stalled';
  photoUrl?: string;
  note: string;
  upvotes: number;
  isUpvoted?: boolean;
  verified: boolean;
  verificationsCount: number;
}

export interface CivicProject {
  id: string;
  title: string;
  lga: 'Idanre' | 'Ifedore';
  wardName: string;
  category: 'Roads & Bridges' | 'Water & Boreholes' | 'Solar & Power' | 'Education & Schools' | 'Healthcare' | 'Agriculture';
  status: 'Proposed' | 'In Progress' | 'Completed' | 'Stalled';
  budgetAllocated: string;
  contractorOrAgency: string;
  startDate: string;
  expectedCompletion: string;
  description: string;
  photoUrl?: string;
  residentReports: ProjectResidentReport[];
}

export interface PoliticalRepresentative {
  id: string;
  name: string;
  titleRole: string;
  level: 'Federal' | 'State' | 'Local Government';
  lga: 'Idanre' | 'Ifedore';
  politicalParty: string;
  tenurePeriod: string;
  constituencyOffice: string;
  officialEmail: string;
  officialPhone: string;
  committeeAssignments: string[];
  billsOrMotionsSponsored: { title: string; status: string; summary: string }[];
  campaignPromises: { promiseText: string; status: 'Fulfilled' | 'In Progress' | 'Stalled'; category: string }[];
  allocatedConstituencyProjects: { title: string; budget: string; status: string }[];
  imageUrl: string;
}

export interface PollingUnit {
  id: string;
  lga: 'Idanre' | 'Ifedore';
  wardName: string;
  puCode: string;
  puName: string;
  locationDescription: string;
  registeredVotersCount: number;
  pvcCollectionStatus: 'High (>80%)' | 'Moderate (50-80%)' | 'Low (<50%)';
  accessibilityRating: 'Good' | 'Fair' | 'Challenging';
  presidingOfficerContact: string;
}

export interface FactCheckItem {
  id: string;
  claimStatement: string;
  sourceSpeaker: string;
  speakerRole: string;
  dateClaimed: string;
  verdict: 'Verified True' | 'Misleading / Unverified' | 'False Claim';
  factSummary: string;
  category: 'Elections & INEC' | 'Budget & Projects' | 'Infrastructure' | 'Security';
  evidenceLinks: { title: string; url: string }[];
  auditDate: string;
}

export interface VoterGuideStep {
  id: string;
  title: string;
  stage: 'PVC Registration' | 'Polling Unit Locator' | 'Election Day Voting' | 'Result Verification';
  description: string;
  checklist: string[];
}

// ==========================================
// Citizen Spotlight, Culture & Secondary School Interfaces
// ==========================================

export interface CitizenSpotlightItem {
  id: string;
  title: string;
  youthLeaderOrGroup: string;
  lga: 'Idanre' | 'Ifedore';
  wardName: string;
  dateCompleted: string;
  category: 'Infrastructure & Safety' | 'Eco-Sanitation & Tourism' | 'Education & Schools' | 'Agribusiness & Water' | 'Neighborhood Watch';
  impactSummary: string;
  fullStory: string;
  metricNumber: string;
  metricLabel: string;
  supportsCount: number;
  isSupported?: boolean;
  photoUrl: string;
  verifiedBadge: string;
}

export interface StudentProfileVerification {
  isVerified: boolean;
  schoolId?: string;
  schoolName?: string;
  studentAdmissionNo?: string;
  classLevel?: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3';
  department?: 'Sciences' | 'Arts & Humanities' | 'Commercial & Business' | 'Junior Secondary';
  verificationDate?: string;
  guardianPhone?: string;
  badgeEarned?: string;
}

export interface AssignmentGroupQuestion {
  id: string;
  studentName: string;
  studentClass: string;
  questionText: string;
  timestamp: string;
  solutionsCount: number;
}

export interface AssignmentGroup {
  id: string;
  title: string;
  subject: 'Mathematics' | 'English Language' | 'Biology' | 'Chemistry' | 'Physics' | 'Economics' | 'Agricultural Science' | 'Yoruba Language' | 'Civic Education';
  classLevel: 'SS 3 (WAEC/NECO)' | 'SS 2' | 'SS 1' | 'JSS 3 (BECE)' | 'All Secondary';
  schoolName: string;
  description: string;
  activeTopic: string;
  membersCount: number;
  questionsCount: number;
  isJoined?: boolean;
  leadStudent: string;
  meetingTime: string;
  recentQuestions: AssignmentGroupQuestion[];
}

export interface ReadingLearningGroup {
  id: string;
  title: string;
  category: 'Literature Book Club' | 'STEM & Coding Circle' | 'Debate & Public Speaking' | 'JAMB/WAEC Past Questions Drill';
  focusMaterial: string;
  curatorStudent: string;
  membersCount: number;
  weeklySchedule: string;
  targetExam: 'WAEC' | 'NECO' | 'JAMB UTME' | 'Term Examinations';
  synopsis: string;
  isJoined?: boolean;
}

export interface OralHistoryClip {
  id: string;
  title: string;
  elderName: string;
  elderTitle: string;
  quarterOrStreet: string;
  topic: '1923 Descent from Ufe Oke' | 'The 682 Ancient Steps' | 'Orosun Sacred Peak' | 'Aafin Owa (Old Palace)' | 'Osu Ise (Bat-Hunting)' | 'Idanre Dialect & Proverbs';
  duration: string;
  yearRecorded: string;
  yorubaExcerpt: string;
  englishTranslation: string;
  historicalContext: string;
  audioToneType: 'folklore' | 'history' | 'dialect' | 'chants';
}

export interface CulturalEvent {
  id: string;
  title: string;
  category: 'Traditional Cultural Festival' | 'Christian Youth Fellowship' | 'Islamic Youth Gathering' | 'Interfaith & Peace Drive';
  faithOrTradition: 'Traditional Heritage' | 'Christian' | 'Muslim' | 'Interfaith Coalition';
  date: string;
  time: string;
  venue: string;
  lga: 'Idanre' | 'Ifedore' | 'Both';
  description: string;
  countdownTargetDate: string;
  organizer: string;
  attendeesCount: number;
  remindersCount: number;
  isReminderSet?: boolean;
  directionsLandmark: string;
  imageUrl?: string;
}

export interface InterfaithInitiative {
  id: string;
  title: string;
  theme: string;
  faithPartners: string[];
  beneficiaries: string;
  targetBudget: number;
  raisedBudget: number;
  status: 'Active Campaign' | 'Completed' | 'Upcoming';
  coordinatorNames: string[];
  description: string;
  supportersCount: number;
  isSupported?: boolean;
}
