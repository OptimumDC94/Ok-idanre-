export interface SecondarySchool {
  id: string;
  name: string;
  lga: 'Idanre' | 'Ifedore';
  town: string;
  category: 'Public Secondary' | 'Mission / Community Grammar' | 'Technical / Science College';
  establishedYear: number;
  principalName: string;
  motto: string;
  studentPopulationEstimate: number;
  activeStudyGroupsCount: number;
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
  recentQuestions: {
    id: string;
    studentName: string;
    studentClass: string;
    questionText: string;
    timestamp: string;
    solutionsCount: number;
  }[];
}

export interface ReadingLearningGroup {
  id: string;
  title: string;
  category: 'Literature Book Club' | 'STEM & Coding Circle' | 'Debate & Public Speaking' | 'JAMB/WAEC Past Questions Drill';
  focusMaterial: string; // e.g. "The Lion and the Jewel by Wole Soyinka" or "New General Mathematics for SS3"
  curatorStudent: string;
  membersCount: number;
  weeklySchedule: string;
  targetExam: 'WAEC' | 'NECO' | 'JAMB UTME' | 'Term Examinations';
  synopsis: string;
  isJoined?: boolean;
}

export interface PracticeQuizQuestion {
  id: string;
  subject: string;
  topic: string;
  examType: 'WAEC' | 'NECO' | 'JAMB';
  year: string;
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

// ========================================================
// Recognized Secondary Schools in Idanre & Ifedore
// ========================================================
export const RECOGNIZED_SECONDARY_SCHOOLS: SecondarySchool[] = [
  // Idanre Schools
  {
    id: 'sch_idn_01',
    name: 'Olofin High School, Idanre',
    lga: 'Idanre',
    town: 'Odode Idanre',
    category: 'Public Secondary',
    establishedYear: 1957,
    principalName: 'Mr. A. O. Fasua',
    motto: 'Honour and Service',
    studentPopulationEstimate: 1450,
    activeStudyGroupsCount: 14,
  },
  {
    id: 'sch_idn_02',
    name: 'Idanre High School, Odo-Ode',
    lga: 'Idanre',
    town: 'Odode Idanre',
    category: 'Public Secondary',
    establishedYear: 1974,
    principalName: 'Mrs. F. K. Adeboye',
    motto: 'Knowledge is Power',
    studentPopulationEstimate: 1200,
    activeStudyGroupsCount: 11,
  },
  {
    id: 'sch_idn_03',
    name: 'Alade Community Grammar School, Alade',
    lga: 'Idanre',
    town: 'Alade Idanre',
    category: 'Mission / Community Grammar',
    establishedYear: 1980,
    principalName: 'Mr. B. T. Akinwumi',
    motto: 'Perseverance and Truth',
    studentPopulationEstimate: 980,
    activeStudyGroupsCount: 9,
  },
  {
    id: 'sch_idn_04',
    name: 'Atosin Community High School, Atosin',
    lga: 'Idanre',
    town: 'Atosin Idanre',
    category: 'Public Secondary',
    establishedYear: 1982,
    principalName: 'Mr. O. M. Akindele',
    motto: 'Strive for Excellence',
    studentPopulationEstimate: 720,
    activeStudyGroupsCount: 6,
  },
  {
    id: 'sch_idn_05',
    name: 'Commercial High School, Idanre',
    lga: 'Idanre',
    town: 'Idale Idanre',
    category: 'Public Secondary',
    establishedYear: 1979,
    principalName: 'Mrs. E. O. Fagbemi',
    motto: 'Integrity and Skill',
    studentPopulationEstimate: 850,
    activeStudyGroupsCount: 8,
  },

  // Ifedore Schools
  {
    id: 'sch_ifd_01',
    name: 'Anglican Grammar School, Igbara-Oke',
    lga: 'Ifedore',
    town: 'Igbara-Oke',
    category: 'Mission / Community Grammar',
    establishedYear: 1958,
    principalName: 'Ven. Dr. S. A. Balogun',
    motto: 'Faith and Light',
    studentPopulationEstimate: 1320,
    activeStudyGroupsCount: 12,
  },
  {
    id: 'sch_ifd_02',
    name: 'Ilara-Mokin Community Grammar School',
    lga: 'Ifedore',
    town: 'Ilara-Mokin',
    category: 'Public Secondary',
    establishedYear: 1976,
    principalName: 'Mr. K. J. Ogunsakin',
    motto: 'Diligent Hands Prosper',
    studentPopulationEstimate: 1100,
    activeStudyGroupsCount: 10,
  },
  {
    id: 'sch_ifd_03',
    name: 'Ijare Community Grammar School, Ijare',
    lga: 'Ifedore',
    town: 'Ijare',
    category: 'Public Secondary',
    establishedYear: 1973,
    principalName: 'Mr. D. O. Omotayo',
    motto: 'Wisdom and Character',
    studentPopulationEstimate: 940,
    activeStudyGroupsCount: 8,
  },
  {
    id: 'sch_ifd_04',
    name: 'Comprehensive High School, Ipogun',
    lga: 'Ifedore',
    town: 'Ipogun',
    category: 'Public Secondary',
    establishedYear: 1984,
    principalName: 'Mrs. T. A. Ajayi',
    motto: 'Forward Ever',
    studentPopulationEstimate: 610,
    activeStudyGroupsCount: 5,
  },
  {
    id: 'sch_ifd_05',
    name: 'Baptist High School, Ibule Soro',
    lga: 'Ifedore',
    town: 'Ibule Soro',
    category: 'Mission / Community Grammar',
    establishedYear: 1981,
    principalName: 'Mr. R. O. Adesanya',
    motto: 'Truth Shall Prevail',
    studentPopulationEstimate: 590,
    activeStudyGroupsCount: 4,
  },
];

// ========================================================
// Assignment Groups
// ========================================================
export const INITIAL_ASSIGNMENT_GROUPS: AssignmentGroup[] = [
  {
    id: 'asg_01',
    title: 'SS3 WAEC Mathematics & Calculus Masters',
    subject: 'Mathematics',
    classLevel: 'SS 3 (WAEC/NECO)',
    schoolName: 'Olofin High School, Idanre',
    description: 'Collaborative group tackling quadratic equations, circle geometry, trigonometry, and calculus past questions from 2018–2025 WAEC exams.',
    activeTopic: 'Circle Theorems & Geometric Proofs',
    membersCount: 48,
    questionsCount: 31,
    isJoined: true,
    leadStudent: 'Ayomide Alade (SS3 Science)',
    meetingTime: 'Mondays & Thursdays, 4:30 PM',
    recentQuestions: [
      {
        id: 'q_01',
        studentName: 'Funke Oladipo',
        studentClass: 'SS3 Science, Olofin High',
        questionText: 'Can someone explain how to calculate the angle subtended by an arc at the center when radius = 7cm and arc length = 11cm?',
        timestamp: '2 hours ago',
        solutionsCount: 4,
      },
      {
        id: 'q_02',
        studentName: 'Segun Fakuade',
        studentClass: 'SS3 Science, Anglican Grammar Igbara-Oke',
        questionText: 'Need step-by-step working for 2024 WAEC Question 12b on Probability of independent events.',
        timestamp: '5 hours ago',
        solutionsCount: 6,
      },
    ],
  },
  {
    id: 'asg_02',
    title: 'Chemistry Lab & Organic Reactions Study Pod',
    subject: 'Chemistry',
    classLevel: 'SS 3 (WAEC/NECO)',
    schoolName: 'Anglican Grammar School, Igbara-Oke',
    description: 'Reviewing qualitative analysis (salt analysis cations/anions), volumetric titration calculations, and functional group reactions in organic chemistry.',
    activeTopic: 'Volumetric Analysis (Acid-Base Titration Molarity)',
    membersCount: 36,
    questionsCount: 22,
    isJoined: false,
    leadStudent: 'Chinedu Adeleke (SS3 Science)',
    meetingTime: 'Tuesdays, 5:00 PM',
    recentQuestions: [
      {
        id: 'q_03',
        studentName: 'Kemi Fasua',
        studentClass: 'SS3, Ilara-Mokin Community Grammar',
        questionText: 'How do you accurately calculate the percentage purity of anhydrous Na2CO3 from titration titer value of 24.50cm3?',
        timestamp: 'Yesterday',
        solutionsCount: 3,
      },
    ],
  },
  {
    id: 'asg_03',
    title: 'English Language Summary & Essay Guild',
    subject: 'English Language',
    classLevel: 'All Secondary',
    schoolName: 'Alade Community Grammar School',
    description: 'Weekly essay drafts, lexis & structure drills, and summary passage comprehension for WAEC and NECO English papers.',
    activeTopic: 'Formal Letter Writing & Argumentative Essays',
    membersCount: 64,
    questionsCount: 42,
    isJoined: true,
    leadStudent: 'Zainab Balogun (SS3 Arts)',
    meetingTime: 'Wednesdays & Saturdays, 3:30 PM',
    recentQuestions: [
      {
        id: 'q_04',
        studentName: 'Tunde Akinyemi',
        studentClass: 'SS2 Arts, Commercial High Idanre',
        questionText: 'What is the standard format for writing a formal petition to the LGA Chairman regarding school library books?',
        timestamp: '3 days ago',
        solutionsCount: 5,
      },
    ],
  },
  {
    id: 'asg_04',
    title: 'Physics Mechanics, Electricity & Waves Hub',
    subject: 'Physics',
    classLevel: 'SS 3 (WAEC/NECO)',
    schoolName: 'Ilara-Mokin Community Grammar School',
    description: 'Mastering projectile motion, Newton’s laws, Ohm’s law electrical circuits, optics, and radioactive decay equations.',
    activeTopic: 'Alternating Current (AC) Circuits & Resonance',
    membersCount: 29,
    questionsCount: 19,
    isJoined: false,
    leadStudent: 'Emmanuel Ojo (SS3)',
    meetingTime: 'Fridays, 4:00 PM',
    recentQuestions: [
      {
        id: 'q_05',
        studentName: 'Boluwatife Ogunsakin',
        studentClass: 'SS3, Atosin High',
        questionText: 'Solving for impedance in a series R-L-C circuit when resistance is 40 ohms and inductive reactance is 30 ohms.',
        timestamp: '4 days ago',
        solutionsCount: 2,
      },
    ],
  },
  {
    id: 'asg_05',
    title: 'Biology & Agricultural Science Field Circle',
    subject: 'Biology',
    classLevel: 'SS 2',
    schoolName: 'Ijare Community Grammar School',
    description: 'Exploring genetics, ecology of tropical rainforests, cocoa plant pathology (black pod disease), and genetics heredity crosses.',
    activeTopic: 'Mendelian Genetics & Monohybrid Crosses',
    membersCount: 41,
    questionsCount: 27,
    isJoined: false,
    leadStudent: 'Fatima Adeyemi (SS2)',
    meetingTime: 'Thursdays, 4:00 PM',
    recentQuestions: [
      {
        id: 'q_06',
        studentName: 'Dare Omotayo',
        studentClass: 'SS2, Ijare Grammar',
        questionText: 'What phenotypic ratio do you obtain when crossing two heterozygous tall pea plants (Tt x Tt)?',
        timestamp: '5 days ago',
        solutionsCount: 7,
      },
    ],
  },
];

// ========================================================
// Learning & Reading Groups
// ========================================================
export const INITIAL_READING_GROUPS: ReadingLearningGroup[] = [
  {
    id: 'rg_01',
    title: 'WAEC Literature: "The Lion and the Jewel" & Poetry Readers',
    category: 'Literature Book Club',
    focusMaterial: 'The Lion and the Jewel by Wole Soyinka & Selected African Poems',
    curatorStudent: 'Temiloluwa Adeboye (SS3 Arts, Idanre High)',
    membersCount: 52,
    weeklySchedule: 'Saturdays, 11:00 AM',
    targetExam: 'WAEC',
    synopsis: 'Deep thematic analysis of Baroka vs Lakunle, modern westernization vs Yoruba tradition, character sketches, and likely WAEC essay questions.',
    isJoined: true,
  },
  {
    id: 'rg_02',
    title: 'JAMB UTME 2026 High Scorers Prep Club',
    category: 'JAMB/WAEC Past Questions Drill',
    focusMaterial: 'JAMB Syllabus past 10 years (CBT practice)',
    curatorStudent: 'Oluwaseun Akindele (SS3 Science, Olofin High)',
    membersCount: 88,
    weeklySchedule: 'Sundays, 3:00 PM',
    targetExam: 'JAMB UTME',
    synopsis: 'Speed and accuracy CBT drills across Use of English, Mathematics, Biology, Chemistry, and Physics aiming for 280+ UTME scores.',
    isJoined: true,
  },
  {
    id: 'rg_03',
    title: 'Junior Secondary BECE High Flyers (JSS 3)',
    category: 'JAMB/WAEC Past Questions Drill',
    focusMaterial: 'Basic Science, Mathematics & English for Junior BECE',
    curatorStudent: 'Grace Oladapo (Prefect, Anglican Grammar Igbara-Oke)',
    membersCount: 39,
    weeklySchedule: 'Tuesdays & Thursdays, 4:00 PM',
    targetExam: 'Term Examinations',
    synopsis: 'Mentorship circle for JSS 3 students transitioning to Senior Secondary, focusing on science foundation and English comprehension.',
    isJoined: false,
  },
  {
    id: 'rg_04',
    title: 'Idanre & Ifedore Young Coders & STEM Innovators',
    category: 'STEM & Coding Circle',
    focusMaterial: 'Python basics, HTML/CSS, and Science Fair Projects',
    curatorStudent: 'Farouq Bello (SS2, Ilara-Mokin Grammar)',
    membersCount: 44,
    weeklySchedule: 'Fridays, 4:30 PM',
    targetExam: 'Term Examinations',
    synopsis: 'Collaborative coding circle building simple weather apps, agriculture calculators, and robotics models using accessible open tools.',
    isJoined: false,
  },
];

// ========================================================
// Sample Practice Questions for AI / Syllabus Assistant
// ========================================================
export const SAMPLE_PRACTICE_QUESTIONS: PracticeQuizQuestion[] = [
  {
    id: 'quiz_01',
    subject: 'Mathematics',
    topic: 'Circle Geometry',
    examType: 'WAEC',
    year: '2024',
    question: 'The angle subtended by an arc at the center of a circle is 120°. If the radius of the circle is 7 cm, what is the length of the arc? (Take π = 22/7)',
    options: [
      { label: 'A', text: '14.67 cm' },
      { label: 'B', text: '22.00 cm' },
      { label: 'C', text: '44.00 cm' },
      { label: 'D', text: '7.33 cm' },
    ],
    correctOption: 'A',
    explanation: 'Arc length L = (θ / 360°) × 2πr = (120 / 360) × 2 × (22 / 7) × 7 = (1/3) × 44 = 14.67 cm.',
  },
  {
    id: 'quiz_02',
    subject: 'Chemistry',
    topic: 'Stoichiometry & Gas Laws',
    examType: 'JAMB',
    year: '2023',
    question: 'What volume of oxygen gas at s.t.p. is required to completely burn 2.0 moles of methane (CH4)? (Molar volume of gas at s.t.p. = 22.4 dm³)',
    options: [
      { label: 'A', text: '22.4 dm³' },
      { label: 'B', text: '44.8 dm³' },
      { label: 'C', text: '89.6 dm³' },
      { label: 'D', text: '11.2 dm³' },
    ],
    correctOption: 'C',
    explanation: 'Equation: CH4 + 2O2 → CO2 + 2H2O. 1 mole CH4 requires 2 moles O2. Thus 2.0 moles CH4 requires 4.0 moles O2. Volume = 4 × 22.4 dm³ = 89.6 dm³.',
  },
  {
    id: 'quiz_03',
    subject: 'Biology',
    topic: 'Ecology',
    examType: 'WAEC',
    year: '2024',
    question: 'In the tropical rainforest of Idanre, which of the following ecological layers is characterized by tall emergent trees rising above the general canopy?',
    options: [
      { label: 'A', text: 'Forest Floor Layer' },
      { label: 'B', text: 'Understory Layer' },
      { label: 'C', text: 'Emergent Layer' },
      { label: 'D', text: 'Shrub Layer' },
    ],
    correctOption: 'C',
    explanation: 'The emergent layer consists of the tallest giant trees (up to 50–60 meters) that tower over the continuous canopy layer.',
  },
  {
    id: 'quiz_04',
    subject: 'English Language',
    topic: 'Concord & Grammar',
    examType: 'NECO',
    year: '2023',
    question: 'Neither the principal nor the teachers _______ in favor of postponing the school inter-house sports festival.',
    options: [
      { label: 'A', text: 'is' },
      { label: 'B', text: 'was' },
      { label: 'C', text: 'are' },
      { label: 'D', text: 'has been' },
    ],
    correctOption: 'C',
    explanation: 'Rule of Proximity for "Neither... nor": The verb agrees in number with the nearer subject. "Teachers" is plural, so the plural verb "are" is required.',
  },
];
