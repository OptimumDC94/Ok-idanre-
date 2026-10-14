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

export const INITIAL_CITIZEN_SPOTLIGHTS: CitizenSpotlightItem[] = [
  {
    id: 'spot_01',
    title: 'Emergency Community Repair of Odo-Ode Cocoa Bridge Handrail',
    youthLeaderOrGroup: 'Idale & Logbosere Youth Vanguard (14 volunteers)',
    lga: 'Idanre',
    wardName: 'Idale-Logbosere',
    dateCompleted: 'October 2026',
    category: 'Infrastructure & Safety',
    impactSummary: 'Youth pooled personal contributions to purchase cement, gravel, and iron rebar to weld broken bridge guardrails that previously caused farm produce bike accidents.',
    fullStory: 'After heavy rains caused a tree branch to snap off the outer bridge barrier along the busy farm transit route, local youth led by Kehinde Akinwumi organized an emergency weekend work camp. Over 3 days, they cast reinforced concrete supports and welded safety rails, protecting over 500 daily motorcycle riders carrying cocoa bags.',
    metricNumber: '500+',
    metricLabel: 'Daily Farm Transporters Protected',
    supportsCount: 342,
    isSupported: true,
    photoUrl: '',
    verifiedBadge: 'Verified Community Action',
  },
  {
    id: 'spot_02',
    title: '682 Steps Eco-Sanitation & 12 Waste Bins Installation at Oke Idanre',
    youthLeaderOrGroup: 'Ok Idanre Eco-Youth Rangers & Tour Volunteers',
    lga: 'Idanre',
    wardName: 'Irowo',
    dateCompleted: 'September 2026',
    category: 'Eco-Sanitation & Tourism',
    impactSummary: 'Volunteers cleared over 2 tons of single-use plastic waste from ancient rock crevices and fabricated 12 rain-proof bins at every resting plateau.',
    fullStory: 'Tourism on Oke Idanre left plastic bottles and sachets lodged between sacred granite rocks. A team of 35 youth mobilizers carried heavy empty drums and tools up the mountain, thoroughly scrubbing the ancient steps and mounting signs discouraging littering in English and Yoruba.',
    metricNumber: '2 Tons',
    metricLabel: 'Plastic Removed from Mountain',
    supportsCount: 489,
    isSupported: false,
    photoUrl: '',
    verifiedBadge: 'Eco Hero Certified',
  },
  {
    id: 'spot_03',
    title: 'Igbara-Oke Community School 45 Broken Desks Carpentry Restoration',
    youthLeaderOrGroup: 'Ifedore Young Carpenters & Students Cooperative',
    lga: 'Ifedore',
    wardName: 'Igbara-Oke I',
    dateCompleted: 'September 2026',
    category: 'Education & Schools',
    impactSummary: 'Young artisan apprentices scavenged reclaimed timber and donated labor to repair 45 damaged classroom desks before new school term resumption.',
    fullStory: 'Seeing JSS1 pupils sitting on concrete blocks, 8 young carpenters in Igbara-Oke teamed up with Anglican Grammar School alumni to sand, nail, varnish, and assemble sturdy wooden desks and benches, creating comfortable seating for 90 students.',
    metricNumber: '90',
    metricLabel: 'Students Given Proper Desks',
    supportsCount: 298,
    isSupported: true,
    photoUrl: '',
    verifiedBadge: 'Education Champion',
  },
  {
    id: 'spot_04',
    title: 'Solar Streetlight Battery Theft Prevention Patrol & Night Monitoring',
    youthLeaderOrGroup: 'Ijomu/Isurin Youth Security Vigilance Unit',
    lga: 'Idanre',
    wardName: 'Ijomu/Isurin',
    dateCompleted: 'October 2026',
    category: 'Neighborhood Watch',
    impactSummary: 'Young volunteers instituted an evening neighborhood patrol that protected newly installed municipal solar lights and safeguarded night market women.',
    fullStory: 'When battery vandalism threatened the newly commissioned solar streetlights along the market stretch, youth organized a non-violent patrol with whistles and torches, coordinating with local elders to guarantee 100% uptime for women selling evening produce.',
    metricNumber: '250',
    metricLabel: 'Solar Lights Kept Functioning',
    supportsCount: 215,
    isSupported: false,
    photoUrl: '',
    verifiedBadge: 'Civic Watch Verified',
  },
  {
    id: 'spot_05',
    title: 'Desilting Choked Irrigation Canals across Ilara-Mokin Vegetable Belts',
    youthLeaderOrGroup: 'Ilara Youth Agritech Alliance (22 young farmers)',
    lga: 'Ifedore',
    wardName: 'Ilara II (Ilare II)',
    dateCompleted: 'August 2026',
    category: 'Agribusiness & Water',
    impactSummary: 'Young farmers cleared 3.4km of weed-choked water channels to supply gravity irrigation for dry-season cucumber and pepper cultivation.',
    fullStory: 'Silt and overgrowth had choked water flow from the stream into communal vegetable farms. Youth brought shovels, cutlasses, and boots to widen the waterways, boosting farm output for over 40 youth farming households in Ilara-Mokin.',
    metricNumber: '3.4 km',
    metricLabel: 'Irrigation Canals Opened',
    supportsCount: 270,
    isSupported: true,
    photoUrl: '',
    verifiedBadge: 'Agri Innovation Hero',
  },
];
