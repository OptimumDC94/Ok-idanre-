import {
  IDANRE_IMAGE,
  YOUTH_IMAGE,
  VOLUNTEER_IMAGE,
  CULTURE_IMAGE,
} from './initialData';

export interface OralHistoryClip {
  id: string;
  title: string;
  elderName: string;
  elderTitle: string;
  villageOrQuarter: string;
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
  countdownTargetDate: string; // ISO string for countdown
  organizer: string;
  attendeesCount: number;
  remindersCount: number;
  isReminderSet?: boolean;
  directionsLandmark: string;
  imageUrl?: string;
}

export interface HeritageCard {
  id: string;
  title: string;
  subtitle: string;
  yearOrEra: string;
  summary: string;
  detailedHistory: string;
  culturalSignificance: string;
  keySpots: string[];
  imageUrl: string;
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

export interface DialectPhrase {
  phrase: string;
  standardYoruba: string;
  englishMeaning: string;
  usageContext: string;
}

export interface UnescoBenchmarkCriterion {
  id: string;
  criterionNumber: string;
  category: 'Cultural' | 'Natural' | 'Mixed';
  title: string;
  justification: string;
  heritageEvidence: string;
  conservationStatus: 'Safeguarded' | 'Ongoing Vigilance' | 'High Integrity';
}

export interface StepAscentWaypoint {
  id: string;
  stepRange: string;
  name: string;
  yorubaName: string;
  elevationMeters: number;
  restingStationNumber?: number;
  description: string;
  architecturalFeature: string;
  folkloreOrHistoricNote: string;
  visitorsGuidance: string;
  photoUrl: string;
}

export interface EcoTourismBenchmark {
  id: string;
  title: string;
  category: 'Fauna Protection' | 'Watershed Preservation' | 'Agroforestry Buffer' | 'Sustainable Trail Code';
  targetSpeciesOrAsset: string;
  statusMetric: string;
  protocolDescription: string;
  communityGuardians: string;
  threatLevel: 'Low' | 'Moderate Vigilance' | 'Protected';
}

export interface Historical1923Milestone {
  year: string;
  title: string;
  yorubaTitle: string;
  historicalDetail: string;
  significance: string;
}

// ========================================================
// 1. Oral History Audio Clips Archive (1923 Descent & Elders)
// ========================================================
export const ORAL_HISTORY_CLIPS: OralHistoryClip[] = [
  {
    id: 'oral_01',
    title: 'The Great Descent: Leaving Ancient Ufe Oke in 1923',
    elderName: 'High Chief Rufus Akindutire',
    elderTitle: 'The Sasere of Idanre Kingdom (Elder Historian, 91 yrs)',
    villageOrQuarter: 'Idale Quarters, Idanre',
    topic: '1923 Descent from Ufe Oke',
    duration: '3 min 45 sec',
    yearRecorded: 'Oral Heritage Project 2024',
    yorubaExcerpt: 'Ní ọdún 1923, àwọn bàbá wa pinnu láti sọ̀kalẹ̀ láti orí òkè Ufe Oke wá sí àfonífojì Odode. Òkè dáàbò bò wá ní àkókò ogun, ṣùgbọ́n ilẹ̀ oko, ọ̀nà ọkọ̀, àti ìdàgbàsókè ló mú wa wá sí ìsàlẹ̀.',
    englishTranslation: 'In 1923, our ancestors resolved to descend from the fortress summit of Ufe Oke down to the fertile Odode valley. The mountain protected us during the centuries of tribal wars, but peace, expansive cocoa farmland, motor roads, and modern trade required us to build our new city below.',
    historicalContext: 'For nearly a millennium, the Idanre people lived safely perched atop the inselberg plateau 3,000 feet above sea level. In 1923, during the reign of Owa Towobola, the historic descent was formally initiated, leaving the ancient settlement preserved as a living archaeological sacred site.',
    audioToneType: 'history',
  },
  {
    id: 'oral_02',
    title: 'The Secret of the 682 Granite Steps',
    elderName: 'Mama Comfort Folorunso',
    elderTitle: 'Matriarch of Alade & Hill Custodian (86 yrs)',
    villageOrQuarter: 'Alade Idanre',
    topic: 'The 682 Ancient Steps',
    duration: '2 min 50 sec',
    yearRecorded: 'Oral Heritage Project 2024',
    yorubaExcerpt: 'Àwọn igbese mẹ́rìndínlẹ́ẹ̀dẹ́gbẹ̀rin (682 steps) yẹn kì í ṣe àtẹ̀gùn lásán. Ọ̀kọ̀ọ̀kan wọn ní ìtàn akọni tí ó kọjá lórí rẹ̀. Bí o bá dé ibi ìsinmi kẹta (rest stop 3), gba afẹ́fẹ́ Orosun kí o tó tẹ̀síwájú.',
    englishTranslation: 'The 682 steps carved into the granite rock face are not mere stairs. Each level carries the memory of ancient warriors and carriers. When you reach the resting points along the climb, inhale the mountain breeze of Orosun before ascending to the ancient kingdom.',
    historicalContext: 'Originally negotiated via natural stone crevices and handholds, the steps were engineered into stone stairways with five resting clearings so that pilgrims, royal guards, and traders could ascend with cocoa and goods.',
    audioToneType: 'folklore',
  },
  {
    id: 'oral_03',
    title: 'Orosun: The Sacred Hill, the Maiden Deity & the Mist',
    elderName: 'Pa Elijah Olabanji',
    elderTitle: 'Priest Historian of Oke Idanre (88 yrs)',
    villageOrQuarter: 'Irowo Quarters',
    topic: 'Orosun Sacred Peak',
    duration: '4 min 12 sec',
    yearRecorded: 'Oral Heritage Project 2024',
    yorubaExcerpt: 'Orosun jẹ́ òkè mímọ́ tí kì í jẹ́ kí owó tàbí ìbànújẹ́ wọ ìlú. Bí ìkùukùu bá bò orí Orosun, àwọn àgbẹ̀ mọ̀ pé òjò ìbùkún àti ọ̀rọ̀ cocoa ti dé.',
    englishTranslation: 'Orosun is the sacred towering pinnacle of Idanre. Folklore tells of Orosun, the revered queen mother whose spirit dwells in the mountain clouds, protecting infants and bringing fertile harvest. When morning mist blankets Orosun peak, the elders know abundant rain and prosperous cocoa seasons have arrived.',
    historicalContext: 'Orosun Peak is the highest rock formation in Ondo State, often cloaked in thick vapor clouds. The annual Orosun festival brings together descendants worldwide for thanksgiving and prayers for fruitfulness.',
    audioToneType: 'chants',
  },
  {
    id: 'oral_04',
    title: 'Aafin Owa: 600 Years of Royalty in the High Clouds',
    elderName: 'Chief Adekunle Ogundipe',
    elderTitle: 'High Chief Odofin of Idanre',
    villageOrQuarter: 'Odode Idanre',
    topic: 'Aafin Owa (Old Palace)',
    duration: '3 min 20 sec',
    yearRecorded: 'Oral Heritage Project 2025',
    yorubaExcerpt: 'Aafin tí ó wà lórí òkè jẹ́ ibi tí ọba mẹ́ẹ̀dọ́gbọ̀n (25 Owás) ti jẹ. Àwọn kòtò, àwọn ère igi, àti àwọn ojúbọ ọba kò ní parẹ́ títí láé.',
    englishTranslation: 'The ancient palace on the hilltop was home to 25 successive Owás (Kings) of Idanre. Its courtyards, carved wooden caryatid pillars, court halls, and sacred chambers remain preserved today as an unmatched testament to Yoruba architecture and royal continuity.',
    historicalContext: 'Unlike many ancient African palaces destroyed during colonization, Aafin Owa on Oke Idanre remains remarkably intact because of the dry mountain elevation and community guardianship.',
    audioToneType: 'history',
  },
  {
    id: 'oral_05',
    title: 'Osu Ise: The Nocturnal Bat-Hunting Expedition of the Brave Youth',
    elderName: 'Pa James Akinlosotu',
    elderTitle: 'Veteran Hunter & Clan Elder (84 yrs)',
    villageOrQuarter: 'Owena Idanre',
    topic: 'Osu Ise (Bat-Hunting)',
    duration: '3 min 10 sec',
    yearRecorded: 'Oral Heritage Project 2025',
    yorubaExcerpt: 'Osu Ise kì í ṣe eré ọmọdé. Àwọn ọ̀dọ́kùnrin máa ń gun orí àwọn àpáta gíga nínú òkùnkùn pẹ̀lú iná ọwọ́ láti kó àwọn àdán mímọ́. Ẹni tí ó bá kùnà nínú ìgboyà kò le dán an wò.',
    englishTranslation: 'The Osu Ise expedition was an ancient rite of passage for young Idanre men. Scaling vertical cliffs in the dead of night with pine torches to harvest roosting fruit bats in sacred caves tested courage, stealth, and teamwork. A youth who conquered Osu Ise was certified a warrior ready for leadership.',
    historicalContext: 'Celebrated seasonally, Osu Ise tests mountain agility and physical endurance. Today it is honored through guided hiking expeditions and cultural storytelling.',
    audioToneType: 'folklore',
  },
];

// ========================================================
// 2. Idanre Dialect Glossary
// ========================================================
export const IDANRE_DIALECT_GLOSSARY: DialectPhrase[] = [
  {
    phrase: 'Ẹ kú iṣé o / Ẹ kú ìrìn',
    standardYoruba: 'Ẹ kú iṣẹ́ / Ẹ kú ìrìn àjò',
    englishMeaning: 'Greetings on your work / Safe journey on the rocky trails',
    usageContext: 'Used when encountering farmers descending from hill cocoa groves.',
  },
  {
    phrase: 'Ufe Oke',
    standardYoruba: 'Orí Òkè Ìdànrè',
    englishMeaning: 'The Ancient Mountain Top Settlement',
    usageContext: 'The indigenous name for the pre-1923 hilltop kingdom.',
  },
  {
    phrase: 'Agbàjo ọwọ́',
    standardYoruba: 'Àpapọ̀ ọwọ́ / Ìṣọ̀kan',
    englishMeaning: 'Hands joined together in unbreakable collective unity',
    usageContext: 'The core communal philosophy guiding Idanre youth development.',
  },
  {
    phrase: 'Owa Ọlọ́fin',
    standardYoruba: 'Ọba Ìdànrè',
    englishMeaning: 'The paramount monarch and ruler of Idanre Kingdom',
    usageContext: 'Formal royal salutation for His Imperial Majesty, the Owa of Idanre.',
  },
  {
    phrase: 'Agbooogun',
    standardYoruba: 'Ẹsẹ̀ Àrònì / Àpẹẹrẹ Ẹsẹ̀ Akọni',
    englishMeaning: 'The legendary footprint of mythical warrior Agbooogun on the rock',
    usageContext: 'Mythical imprint that miraculously expands or contracts to fit any human foot.',
  },
];

// ========================================================
// 3. Cultural Celebrations & Religion Tracker Calendar
// ========================================================
export const CULTURAL_CALENDAR_EVENTS: CulturalEvent[] = [
  {
    id: 'evt_cult_01',
    title: 'Mare Mountaineering, Cultural Marathon & Youth Eco-Fest',
    category: 'Traditional Cultural Festival',
    faithOrTradition: 'Traditional Heritage',
    date: 'December 18 – 20, 2026',
    time: '9:00 AM – 8:00 PM Daily',
    venue: 'Oke Idanre Tourist Center & Cultural Amphitheatre',
    lga: 'Idanre',
    description: 'Flagship festival combining rock-climbing competitions across granite peaks, marathon, Yoruba traditional folk dance troupes, agro-produce exhibitions, and contemporary youth concerts.',
    countdownTargetDate: '2026-12-18T09:00:00Z',
    organizer: 'Idanre Cultural Heritage Council & Ondo Tourism Ministry',
    attendeesCount: 4200,
    remindersCount: 680,
    directionsLandmark: 'Base of the 682 steps, Odode Idanre',
    imageUrl: IDANRE_IMAGE,
  },
  {
    id: 'evt_cult_02',
    title: 'Annual Orosun Sacred Cultural Thanksgiving & Heritage Walk',
    category: 'Traditional Cultural Festival',
    faithOrTradition: 'Traditional Heritage',
    date: 'May 14 – 16, 2026',
    time: '10:00 AM',
    venue: 'Orosun Sacred Footprints Trail & Aafin Owa, Ufe Oke',
    lga: 'Idanre',
    description: 'Centuries-old festival paying homage to Queen Orosun with cultural dances, mountain prayers for peace and maternal fruitfulness, and community feasts.',
    countdownTargetDate: '2026-05-14T10:00:00Z',
    organizer: 'High Chiefs & Cultural Custodians of Idanre',
    attendeesCount: 2800,
    remindersCount: 410,
    directionsLandmark: 'Ascend the 682 steps to Old Palace Plateau',
    imageUrl: CULTURE_IMAGE,
  },
  {
    id: 'evt_cult_03',
    title: 'Interfaith Youth Development & Peace Rally (Christian, Muslim & Traditional)',
    category: 'Interfaith & Peace Drive',
    faithOrTradition: 'Interfaith Coalition',
    date: 'Saturday, November 28, 2026',
    time: '10:00 AM – 3:00 PM',
    venue: 'Idanre Civic Centre, Commercial Road, Odo-Ode',
    lga: 'Both',
    description: 'Joint peace assembly co-hosted by Christian Association of Nigeria (CAN) Youth Wing, Muslim Students Society of Nigeria (MSSN), and traditional youth leaders to launch joint community scholarship drives.',
    countdownTargetDate: '2026-11-28T10:00:00Z',
    organizer: 'Idanre & Ifedore Interfaith Youth Peace Council',
    attendeesCount: 950,
    remindersCount: 220,
    directionsLandmark: 'Near Idanre High School roundabout',
    imageUrl: YOUTH_IMAGE,
  },
  {
    id: 'evt_cult_04',
    title: 'Christian Youth Fellowship Summit & Agri-Entrepreneurship Conference',
    category: 'Christian Youth Fellowship',
    faithOrTradition: 'Christian',
    date: 'Sunday, November 22, 2026',
    time: '2:00 PM – 6:00 PM',
    venue: 'St. Paul’s Anglican Cathedral Auditorium, Odode Idanre',
    lga: 'Idanre',
    description: 'Annual interdenominational youth gathering combining praise, mentorship on cocoa value-addition, and zero-interest youth cooperative startup grants.',
    countdownTargetDate: '2026-11-22T14:00:00Z',
    organizer: 'Idanre Christian Youth Fellowship Network',
    attendeesCount: 1200,
    remindersCount: 340,
    directionsLandmark: 'Broad Street, Cathedral Square, Odode',
    imageUrl: VOLUNTEER_IMAGE,
  },
  {
    id: 'evt_cult_05',
    title: 'Ifedore Juma’at & MSSN Youth Leadership & Digital Bootcamp',
    category: 'Islamic Youth Gathering',
    faithOrTradition: 'Muslim',
    date: 'Friday, December 4, 2026',
    time: '3:00 PM – 7:00 PM',
    venue: 'Igbara-Oke Central Mosque Community Hall',
    lga: 'Ifedore',
    description: 'Post-Juma’at youth development assembly with special workshops on ethical technology, AI tools for agribusiness, and moral leadership in civic governance.',
    countdownTargetDate: '2026-12-04T15:00:00Z',
    organizer: 'Muslim Students’ Society of Nigeria (MSSN) Ifedore Area Council',
    attendeesCount: 800,
    remindersCount: 195,
    directionsLandmark: 'Opposite Igbara-Oke Post Office, Main Road',
    imageUrl: YOUTH_IMAGE,
  },
  {
    id: 'evt_cult_06',
    title: 'Osu Ise Night Expedition & Ancient Mountain Camping Walk',
    category: 'Traditional Cultural Festival',
    faithOrTradition: 'Traditional Heritage',
    date: 'October 24, 2026',
    time: '7:00 PM – Midnight',
    venue: 'Oke Idanre High Ridge Caves & Aganyin Camp',
    lga: 'Idanre',
    description: 'Guided evening mountain hike and cultural torchlit vigil recreating the historic bat-cave reconnaissance expedition, complete with campfire folklore and traditional drumming.',
    countdownTargetDate: '2026-10-24T19:00:00Z',
    organizer: 'Idanre Youth Mountain Explorers Club',
    attendeesCount: 450,
    remindersCount: 180,
    directionsLandmark: 'Rendezvous at base camp gatehouse at 6:30 PM',
    imageUrl: IDANRE_IMAGE,
  },
  {
    id: 'evt_cult_07',
    title: 'Ilara-Mokin New Yam & Cultural Heritage Fiesta',
    category: 'Traditional Cultural Festival',
    faithOrTradition: 'Traditional Heritage',
    date: 'August 28, 2026',
    time: '11:00 AM',
    venue: 'Alara Palace Square, Ilara-Mokin',
    lga: 'Ifedore',
    description: 'Vibrant thanksgiving festival marking the harvest of first yams with cultural dances, age-grade masquerade displays, and community feasting.',
    countdownTargetDate: '2026-08-28T11:00:00Z',
    organizer: 'Ilara-Mokin Traditional Council & Youth League',
    attendeesCount: 2200,
    remindersCount: 310,
    directionsLandmark: 'Town Roundabout into Royal Palace grounds',
    imageUrl: CULTURE_IMAGE,
  },
];

// ========================================================
// 4. Cultural History & Heritage Cards
// ========================================================
export const HERITAGE_CARDS: HeritageCard[] = [
  {
    id: 'hc_01',
    title: 'The 1923 Valley Migration (From Ufe Oke to Odode)',
    subtitle: 'From Ancient Fortress to Agrarian Prosperity',
    yearOrEra: '1923 AD',
    summary: 'How an entire civilization made a peaceful, planned descent from a thousand-year mountain fortress to establish modern Idanre in the fertile cocoa valleys below.',
    detailedHistory: 'For centuries, the rugged inselberg summits of Ufe Oke provided impenetrable natural defenses during the Yoruba civil wars and slave raids. In 1923, with regional peace established and cash-crop cocoa farming expanding, the visionary Owa Towobola and royal elders led the peaceful descent. They established Odode, Alade, and Atosin, while preserving the sacred hilltop as a sanctified living monument.',
    culturalSignificance: 'Represents the courage to embrace modern economic transformation while jealously guarding spiritual roots and ancestral landmarks.',
    keySpots: ['Old Palace Court', 'Ancient Prison of Aganyin', 'The 682 Steps', 'King’s Primary School (1927)'],
    imageUrl: IDANRE_IMAGE,
  },
  {
    id: 'hc_02',
    title: 'The Mystery of Agbooogun: The Miraculous Footprint',
    subtitle: 'Mythical Warrior’s Imprint on the High Rock',
    yearOrEra: 'Pre-Colonial Epoch',
    summary: 'A carved imprint in solid granite that miraculously contracts or expands to fit the foot size of any clean-hearted person who steps inside it.',
    detailedHistory: 'Agbooogun was a legendary warrior credited with protecting the hilltop settlement. Legend states that in ancient judicial traditions, individuals accused of treason or heinous crimes were brought to place their foot into Agbooogun’s footprint. If it shrank and rejected their foot, their guilt was exposed; if it welcomed their foot, their innocence was affirmed.',
    culturalSignificance: 'A cornerstone of Idanre civic ethics symbolizing that truth and justice cannot be concealed before ancestral conscience.',
    keySpots: ['Agbooogun Granite Ledge', 'Ancient Lookout Post', 'Warriors’ Resting Bower'],
    imageUrl: CULTURE_IMAGE,
  },
  {
    id: 'hc_03',
    title: 'Arun River & the Sacred Water of Healing',
    subtitle: 'Crystal Mountain Stream Between the Twin Ridges',
    yearOrEra: 'Ancient Times – Present',
    summary: 'A crystal-clear mountain stream cascading through the rocky peaks that elders and visitors revere for its pure, therapeutic properties.',
    detailedHistory: 'Flowing from an unmapped subterranean spring within the rocky fissures of Oke Idanre, Arun River never dries even in the peak of the dry harmattan season. Royalty and commoners would bathe in its cold waters for health, mental clarity, and spiritual renewal.',
    culturalSignificance: 'Source of life for the hilltop city during decades of sieges and a lasting symbol of unpolluted natural purity.',
    keySpots: ['Arun Gorge Cascades', 'Pilgrims’ Washing Basin', 'Twin Rock Fissure'],
    imageUrl: IDANRE_IMAGE,
  },
  {
    id: 'hc_04',
    title: 'The Sacred Bat Expedition of Osu Ise',
    subtitle: 'Ancient Rite of Courage & Forest Stewardship',
    yearOrEra: 'Centuries-Old Tradition',
    summary: 'A seasonal cultural expedition where youth journey into high cliffside caverns to harvest sacred bats under strict communal conservation rules.',
    detailedHistory: 'Far from indiscriminate hunting, Osu Ise was governed by strict ecological taboos forbidding the capture of nursing mothers or young bats. Only seasoned young hunters who passed trials of stealth could ascend the sheer rock walls to harvest fruit bats for royal banquet seasoning.',
    culturalSignificance: 'Demonstrated indigenous conservation ethics, physical bravery, and cooperative hunting teamwork.',
    keySpots: ['Bat Caverns of Orosun', 'Torch-lighting rock shelf', 'Ancient hunters’ trail'],
    imageUrl: CULTURE_IMAGE,
  },
];

// ========================================================
// 5. Interfaith & Peace Forum Initiatives
// ========================================================
export const INTERFAITH_INITIATIVES: InterfaithInitiative[] = [
  {
    id: 'faith_01',
    title: 'Idanre & Ifedore Interfaith Youth Emergency Food & Orphan Care Drive',
    theme: 'Love Thy Neighbor Across All Faiths',
    faithPartners: ['Christian Association of Nigeria (Youth Wing)', 'Muslim Students’ Society of Nigeria (MSSN)', 'Traditional Royal Youth Council'],
    beneficiaries: '350 Vulnerable Elderly & Orphans in Idanre & Ifedore Wards',
    targetBudget: 2500000,
    raisedBudget: 1820000,
    status: 'Active Campaign',
    coordinatorNames: ['Pastor Emmanuel Adeyeye', 'Ustadh Mukhtar Balogun', 'Chief Segun Olowo'],
    description: 'Joint interfaith initiative providing bags of rice, garri, cooking oil, and school supplies to indigent homes regardless of religious background.',
    supportersCount: 284,
    isSupported: true,
  },
  {
    id: 'faith_02',
    title: 'Clean Oke Idanre & Shared Sacred Trails Sanitation Campaign',
    theme: 'Environmental Stewardship as a Shared Divine Duty',
    faithPartners: ['Joint Church Youth Fellowships', 'Muslim Youth Vanguard', 'Eco-Idanre Volunteers'],
    beneficiaries: 'Visitors, Tour Guides & Local Market Communities',
    targetBudget: 850000,
    raisedBudget: 850000,
    status: 'Completed',
    coordinatorNames: ['Deaconess Tola Akintola', 'Bro. Farooq Bello'],
    description: 'Christian, Muslim, and indigenous youth cleared 3 tons of plastic waste along the 682 stone steps and planted 200 indigenous shade trees.',
    supportersCount: 412,
    isSupported: true,
  },
  {
    id: 'faith_03',
    title: 'Ifedore Youth Peace & Electoral Tolerance Caravan',
    theme: 'No Youth Blood for Any Politician',
    faithPartners: ['CAN Youth Wing Ifedore', 'Imams & Alfas Youth Committee', 'Ilara & Igbara-Oke Youth Leagues'],
    beneficiaries: 'All 10 Political Wards of Ifedore LGA',
    targetBudget: 1200000,
    raisedBudget: 740000,
    status: 'Active Campaign',
    coordinatorNames: ['Rev. Samuel Ajayi', 'Mallam Ridwan Oladipo'],
    description: 'Educational roadshow across town squares preaching inter-ethnic unity, peaceful political campaigns, and violence-free elections.',
    supportersCount: 198,
    isSupported: false,
  },
];

// ========================================================
// 6. UNESCO World Heritage Tentative List Dossier (Oct 8, 2007)
// ========================================================
export const UNESCO_BENCHMARK_CRITERIA: UnescoBenchmarkCriterion[] = [
  {
    id: 'unesco_ii',
    criterionNumber: 'Criterion (ii)',
    category: 'Cultural',
    title: 'Interchange of Human Values & Mountain Architecture',
    justification: 'Exhibits an extraordinary synthesis between indigenous Yoruba mud-brick courtyard engineering and defensive inselberg cliff settlement that flourished undisturbed for over eight centuries.',
    heritageEvidence: 'Aafin Owa (Old Palace) with carved caryatid pillars, ancient court halls, and the three ceremonial royal entry gateways.',
    conservationStatus: 'Safeguarded',
  },
  {
    id: 'unesco_iii',
    criterionNumber: 'Criterion (iii)',
    category: 'Cultural',
    title: 'Unique Testimony to Living Inselberg Civilisation',
    justification: 'Bears exceptional testimony to the Ufe Oke civilisation that preserved its monarchical continuity, sacred rituals, and justice traditions uninterrupted until the peaceful 1923 valley descent.',
    heritageEvidence: 'Agbooogun’s miraculous granite footprint, sacred shrines of Orosun, and ancient resting plateaus along the rock face.',
    conservationStatus: 'High Integrity',
  },
  {
    id: 'unesco_v',
    criterionNumber: 'Criterion (v)',
    category: 'Cultural',
    title: 'Traditional Human Settlement in Extreme Topography',
    justification: 'An outstanding paradigm of human environmental adaptation where an entire kingdom harmonized agriculture, natural stone rainwater cisterns, and cliffside cavern refuges 3,000 feet above sea level.',
    heritageEvidence: 'Dry-stone terrace foundations, ancient prison of Aganyin, and stone water channels leading to perennial streams.',
    conservationStatus: 'Safeguarded',
  },
  {
    id: 'unesco_vi',
    criterionNumber: 'Criterion (vi)',
    category: 'Cultural',
    title: 'Living Spiritual Traditions, Festivals & Deities',
    justification: 'Directly and tangibly associated with living beliefs, including the annual Orosun festival for maternal fertility and agricultural abundance, and Mare mountain heritage celebrations.',
    heritageEvidence: 'Annual Orosun sacred pilgrim trail, Mare mountain climbing rites, and the bat-cave preservation protocols of Osu Ise.',
    conservationStatus: 'Ongoing Vigilance',
  },
  {
    id: 'unesco_vii',
    criterionNumber: 'Criterion (vii)',
    category: 'Natural',
    title: 'Superlative Natural Phenomena & Inselberg Scenery',
    justification: 'Contains superlative natural inselberg monoliths rising dramatically above the lush tropical cocoa forest canopy, draped in perpetual atmospheric mist clouds at Orosun peak.',
    heritageEvidence: 'The 3,018m atmospheric summit of Orosun Peak, panoramic granite domes, and virgin high-altitude cliff ecosystems.',
    conservationStatus: 'High Integrity',
  },
];

// ========================================================
// 7. Interactive 682-Step Ascent Architectural Waypoints
// ========================================================
export const STEPS_ASCENT_WAYPOINTS: StepAscentWaypoint[] = [
  {
    id: 'step_wp_01',
    stepRange: 'Steps 1 – 60',
    name: 'Base Welcome Sanctuary & Gateway Arch',
    yorubaName: 'Àbáwọlé Òkè Ìdànrè',
    elevationMeters: 334,
    description: 'The entrance threshold where modern Odode Idanre meets the soaring granite inselberg base. Towering tropical trees frame the start of the stone stairway.',
    architecturalFeature: 'Ashlar granite archway, ticketing log, and native timber resting pavilion.',
    folkloreOrHistoricNote: 'Before climbing, pilgrims in ancient times paid respects at the foot of the hill for physical endurance and safe footing.',
    visitorsGuidance: 'Carry refillable water, wear sturdy grip footwear, and pace your ascent gently.',
    photoUrl: IDANRE_IMAGE,
  },
  {
    id: 'step_wp_02',
    stepRange: 'Steps 61 – 150',
    name: 'First Rest Stop (Dagunro Rock Pass)',
    yorubaName: 'Ibi Ìsinmi Kíní (Àpáta Dágúnró)',
    elevationMeters: 410,
    restingStationNumber: 1,
    description: 'The first clearing where the tree canopy parts, exposing the shear granite overhang. Historic defensive rocks guarded this bottleneck.',
    architecturalFeature: 'Shaded stone bench alcove cut into the rock face with timber rafters.',
    folkloreOrHistoricNote: 'Dagunro was an ancient military watchpoint where royal sentries monitored approaching visitors or hostile armies.',
    visitorsGuidance: 'Catch your breath for 3 minutes; check your pulse and admire the lower canopy.',
    photoUrl: CULTURE_IMAGE,
  },
  {
    id: 'step_wp_03',
    stepRange: 'Steps 151 – 275',
    name: 'Second Rest Stop (Carriers’ Bower & Spring Well)',
    yorubaName: 'Ibi Ìsinmi Kejì (Kòtò Omi Àwọn Akéru)',
    elevationMeters: 495,
    restingStationNumber: 2,
    description: 'A natural stone terrace where cocoa porters and royal attendants rested during heavy ascents with harvested produce and ceremonial brasswares.',
    architecturalFeature: 'Covered canopy with stone masonry balustrade overlooking the southern valley.',
    folkloreOrHistoricNote: 'Elders recount that spring water seeping from rock crevices here was naturally cool and rejuvenating.',
    visitorsGuidance: 'Hydrate lightly; look southeast for breathtaking views of Odode town roofs below.',
    photoUrl: VOLUNTEER_IMAGE,
  },
  {
    id: 'step_wp_04',
    stepRange: 'Steps 276 – 400',
    name: 'Third Rest Stop (Orosun Breeze Plateau)',
    yorubaName: 'Ibi Ìsinmi Kẹta (Àtẹ́gùn Orosun)',
    elevationMeters: 590,
    restingStationNumber: 3,
    description: 'Halfway up the mountain. Cool high-altitude breezes from Orosun peak blow across the cliff face, dissipating heat and fatigue.',
    architecturalFeature: 'Wide circular stone observation terrace with panoramic perimeter parapet.',
    folkloreOrHistoricNote: 'Legend states that Queen Orosun’s protective mist frequently envelops this station during the morning prayers.',
    visitorsGuidance: 'Take panoramic photos here; do not lean over raw granite ledges.',
    photoUrl: IDANRE_IMAGE,
  },
  {
    id: 'step_wp_05',
    stepRange: 'Steps 401 – 520',
    name: 'Fourth Rest Stop (Arokunso Royal Fissure)',
    yorubaName: 'Ibi Ìsinmi Kẹrin (Ojú Ọ̀nà Àrokunso)',
    elevationMeters: 690,
    restingStationNumber: 4,
    description: 'A dramatic natural cleft between massive boulders forming a secluded passageway. Historically used as an emergency royal escape conduit.',
    architecturalFeature: 'Steeply inclined stone staircase flanking natural monolithic granite columns.',
    folkloreOrHistoricNote: 'The Arokunso pass was disguised with foliage in wartime so only initiates could guide the monarch to safety.',
    visitorsGuidance: 'Maintain three points of contact on steep sections; silence is respected here.',
    photoUrl: CULTURE_IMAGE,
  },
  {
    id: 'step_wp_06',
    stepRange: 'Steps 521 – 625',
    name: 'Fifth Rest Stop (Agbooogun Footprint Ledge)',
    yorubaName: 'Ibi Ìsinmi Kárùn-ún (Ẹsẹ̀ Agbóògùn)',
    elevationMeters: 780,
    restingStationNumber: 5,
    description: 'The final clearing before the plateau crest. Home to the legendary mythical footprint indented deeply into the flat granite tableland.',
    architecturalFeature: 'Carved perimeter stone bench circling the ancient footprint trial rock.',
    folkloreOrHistoricNote: 'Any person could place their foot inside Agbooogun’s footprint: it miraculously expands or contracts to fit the pure of heart.',
    visitorsGuidance: 'Visitors may gently test their foot size inside the miraculous footprint with respectful composure.',
    photoUrl: IDANRE_IMAGE,
  },
  {
    id: 'step_wp_07',
    stepRange: 'Steps 626 – 682',
    name: 'Summit Threshold & Ufe Oke Ancient Kingdom Gates',
    yorubaName: 'Orí Òkè Ufe Oke (Ẹnu Ibodè Ọba)',
    elevationMeters: 914,
    description: 'The 682nd step crests onto the expansive ancient hilltop tableland: entering the historic kingdom of Aafin Owa, the ancient courthouse, and the sacred Arun River.',
    architecturalFeature: 'Courtyard palace, historic stone belfry (1927), colonial mud-brick courthouse, and Aganyin prison cells.',
    folkloreOrHistoricNote: 'Where 25 kings reigned in glory above the clouds for over 800 years before the 1923 peaceful descent.',
    visitorsGuidance: 'Welcome to the ancient sacred kingdom. Remove shoes before entering inner palace shrines.',
    photoUrl: YOUTH_IMAGE,
  },
];

// ========================================================
// 8. Eco-Tourism & Inselberg Biodiversity Benchmarks
// ========================================================
export const ECO_TOURISM_BENCHMARKS: EcoTourismBenchmark[] = [
  {
    id: 'eco_01',
    title: 'Tailless Rock Hyrax (Procavia capensis) Cliff Protection',
    category: 'Fauna Protection',
    targetSpeciesOrAsset: 'Rock Hyrax & Lithophytic Crevice Fauna',
    statusMetric: 'Protected Colony (~420 individuals monitored)',
    protocolDescription: 'Strict prohibition of nocturnal hunting on high rock crevices. Cultural sanctions enforced alongside forestry rangers to allow breeding in sacred Orosun caves.',
    communityGuardians: 'Idanre Hunters’ Guild & Youth Mountain Rangers',
    threatLevel: 'Moderate Vigilance',
  },
  {
    id: 'eco_02',
    title: 'Arun River Perennial Watershed & Purity Sanctuary',
    category: 'Watershed Preservation',
    targetSpeciesOrAsset: 'High-Altitude Cold Stream & Freshwater Ecology',
    statusMetric: 'Zero Industrial Runoff (100% Organic Purity)',
    protocolDescription: 'Banning plastic containers, chemical soaps, and agricultural pesticides within 500 meters of the sacred Arun River spring gorge.',
    communityGuardians: 'Indigenous Water Custodians & CAN/MSSN Eco-Youth',
    threatLevel: 'Protected',
  },
  {
    id: 'eco_03',
    title: 'Sustainable Cocoa Agroforestry Buffer Management',
    category: 'Agroforestry Buffer',
    targetSpeciesOrAsset: 'Canopy Shade Trees & Organic Cocoa Farms',
    statusMetric: '1,800 Hectares of Certified Shade-Grown Cocoa',
    protocolDescription: 'Intercropping indigenous hardwood shade trees (Iroko, Mahogany) with cocoa seedlings at the base of the inselberg to prevent rock erosion and support bird biodiversity.',
    communityGuardians: 'Idanre Farmers Cooperative Union & Agro-Youth Hub',
    threatLevel: 'Protected',
  },
  {
    id: 'eco_04',
    title: 'Zero-Waste Trail Code for 682 Steps & Mare Fest',
    category: 'Sustainable Trail Code',
    targetSpeciesOrAsset: 'Granite Rock Faces & Visitor Trail Cleanliness',
    statusMetric: '98% Plastic-Free Trail Compliance',
    protocolDescription: 'Mandatory biodegradable water pouch policy, designated waste sorting stations at each of the 5 resting stations, and community post-festival cleanups.',
    communityGuardians: 'Idanre Tourism Board, Rotary & Student Volunteers',
    threatLevel: 'Low',
  },
];

// ========================================================
// 9. Historical 1923 Descent Archival Milestones
// ========================================================
export const DESCENT_1923_MILESTONES: Historical1923Milestone[] = [
  {
    year: '1915 – 1920',
    title: 'Peace in the Land & Expansion of Cocoa Farmlands',
    yorubaTitle: 'Àlàáfíà Ilẹ̀ Yorùbá àti Ìbísí Oko Kòkó',
    historicalDetail: 'With the cessation of regional tribal wars and the introduction of high-yielding cocoa trees into the moist valley plains, farmers spent weeks commuting from hilltop to valley.',
    significance: 'Created the economic rationale for descending down to fertile soil and modern transport roads.',
  },
  {
    year: '1923 AD',
    title: 'The Great Royal Decree & Orderly Migration by Owa Towobola',
    yorubaTitle: 'Àṣẹ Ọba Towobola láti Sọ̀kalẹ̀ sí Àfonífojì',
    historicalDetail: 'His Imperial Majesty Owa Towobola and the High Chiefs formally convened the kingdom council, decreeing a planned, dignified descent to establish Odode, Alade, and Atosin without abandoning the sacred hill.',
    significance: 'Preserved the hilltop as an uncompromised spiritual monument while building modern towns below.',
  },
  {
    year: '1927 AD',
    title: 'Establishment of King’s Primary School & Native Court',
    yorubaTitle: 'Dídá Ilé-ìwé Alákọ̀ọ́bẹ̀rẹ̀ Ọba àti Ilé-Ẹjọ́ Ìbílẹ̀',
    historicalDetail: 'Formal education and civic governance took root with the first permanent school on the hill and modern administrative structures in Odode.',
    significance: 'Bridged classical Yoruba monarchical justice with modern education for young Idanre boys and girls.',
  },
  {
    year: '2007 (Oct 8)',
    title: 'Inscribed on the UNESCO World Heritage Tentative List',
    yorubaTitle: 'Fífilọ́ sí Àkọsílẹ̀ UNESCO fún Àwọn Ojú-Ilẹ̀ Àgbáyé',
    historicalDetail: 'The Federal Republic of Nigeria and Ondo State formally submitted Oke Idanre Cultural Landscape to UNESCO World Heritage Centre under Criteria (ii), (iii), (v), (vi), and (vii).',
    significance: 'International recognition of Idanre’s unparalleled blend of nature, architecture, and enduring living folklore.',
  },
];

