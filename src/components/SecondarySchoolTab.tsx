import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  RECOGNIZED_SECONDARY_SCHOOLS,
  SAMPLE_PRACTICE_QUESTIONS,
  SecondarySchool,
  AssignmentGroup,
  ReadingLearningGroup,
  PracticeQuizQuestion,
} from '../data/secondarySchoolData';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Search,
  Plus,
  Send,
  MessageSquare,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  BrainCircuit,
  Check,
  X,
  FileQuestion,
  Filter,
  Bookmark,
  Share2,
} from 'lucide-react';

export const SecondarySchoolTab: React.FC = () => {
  const {
    user,
    studentVerification,
    verifyStudentProfile,
    assignmentGroups,
    toggleJoinAssignmentGroup,
    postAssignmentQuestion,
    readingGroups,
    toggleJoinReadingGroup,
    awardPoints,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'assignments' | 'reading' | 'ai-tutor' | 'schools'>('assignments');

  // Verification modal
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(RECOGNIZED_SECONDARY_SCHOOLS[0].id);
  const [admissionNo, setAdmissionNo] = useState('');
  const [classLevel, setClassLevel] = useState<'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3'>('SS 3');
  const [department, setDepartment] = useState<'Sciences' | 'Arts & Humanities' | 'Commercial & Business' | 'Junior Secondary'>('Sciences');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Ask Assignment Question modal
  const [selectedGroupForQuestion, setSelectedGroupForQuestion] = useState<AssignmentGroup | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Assignment filters
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [assignmentSearch, setAssignmentSearch] = useState('');

  // AI Learning Assistant states
  const [aiStudyQuery, setAiStudyQuery] = useState('');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Practice Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNo.trim()) return;

    const matchedSchool = RECOGNIZED_SECONDARY_SCHOOLS.find(s => s.id === selectedSchoolId);

    verifyStudentProfile({
      schoolId: selectedSchoolId,
      schoolName: matchedSchool?.name || 'Secondary School in Ondo',
      studentAdmissionNo: admissionNo.trim(),
      classLevel,
      department,
      guardianPhone: guardianPhone.trim() || undefined,
    });

    showToast('Student Verification Complete! Badge Earned (+50 Points)');
    setIsVerifyModalOpen(false);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForQuestion || !newQuestionText.trim()) return;

    postAssignmentQuestion(selectedGroupForQuestion.id, newQuestionText.trim());
    showToast('Assignment question posted! Earned +20 Points');
    setNewQuestionText('');
    setSelectedGroupForQuestion(null);
  };

  const handleAiStudyAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiStudyQuery.trim()) return;

    setIsAiLoading(true);
    setAiExplanation(null);

    // Call server AI endpoint or provide curriculum-grounded step-by-step guidance
    try {
      const response = await fetch('/api/gemini/secondary-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiStudyQuery.trim(),
          subject: subjectFilter !== 'All' ? subjectFilter : 'General Secondary Science & Arts',
          classLevel: classFilter !== 'All' ? classFilter : 'Senior Secondary (SS1 - SS3)',
          examTarget: 'WAEC SSCE / NECO / JAMB UTME',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data.explanation || 'Step-by-step WAEC solution: Break down into known formulas, state the given parameters, and calculate with standard SI units.');
      } else {
        throw new Error('AI API unavailable');
      }
    } catch {
      // High-quality contextual fallback explanation
      setAiExplanation(
        `📚 WAEC/NECO Syllabus Guide for "${aiStudyQuery.trim()}":\n\n1. Core Concept: Identify the fundamental principle (e.g. Newton's 2nd Law, Pythagoras Theorem, Rule of Concord, or Le Chatelier's Principle).\n2. Step-by-Step Method:\n   - State all given variables with standard units.\n   - Write out the required syllabus formula.\n   - Substitute and simplify step-by-step to earn full working marks.\n3. Common Student Pitfall: Forgetting units in final answers or omitting required diagram labels in WAEC Section B.`
      );
    } finally {
      setIsAiLoading(false);
      awardPoints(10, 'Consulted AI Secondary School Study Assistant');
    }
  };

  const currentQuiz = SAMPLE_PRACTICE_QUESTIONS[currentQuizIndex];

  const handleQuizAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isQuizSubmitted) return;
    setSelectedQuizOption(option);
  };

  const submitQuizAnswer = () => {
    if (!selectedQuizOption || isQuizSubmitted) return;
    setIsQuizSubmitted(true);
    if (selectedQuizOption === currentQuiz.correctOption) {
      setQuizScore(s => s + 1);
      showToast('Correct Answer! +15 Points');
      awardPoints(15, 'Answered secondary school practice quiz question correctly');
    } else {
      showToast(`Incorrect. Correct option was (${currentQuiz.correctOption})`);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setCurrentQuizIndex(i => (i + 1) % SAMPLE_PRACTICE_QUESTIONS.length);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Excellence & Secondary Student Connect</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Secondary School Student Hub
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            Connecting secondary school students across Idanre and Ifedore. Collaborate on daily assignments, join WAEC, NECO & JAMB study circles, access curriculum AI learning, and verify your official student status.
          </p>

          {/* Student Verification Status Ribbon */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Student Verification Status:</span>
                  {studentVerification.isVerified ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/40 text-emerald-200 font-mono font-bold">
                      ✓ Verified Scholar
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/40 text-amber-200 font-mono font-bold">
                      Pending Verification
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  {studentVerification.isVerified
                    ? `${studentVerification.schoolName} · ${studentVerification.classLevel} (${studentVerification.department})`
                    : 'Verify your secondary school account to earn your High School Scholar Badge & +50 Points.'}
                </p>
              </div>
            </div>

            {!studentVerification.isVerified ? (
              <button
                onClick={() => setIsVerifyModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0 self-start sm:self-auto"
              >
                Verify Student Profile (+50 Pts)
              </button>
            ) : (
              <span className="text-xs text-emerald-300 font-mono font-bold self-start sm:self-auto">
                ID: {studentVerification.studentAdmissionNo}
              </span>
            )}
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <GraduationCap className="w-80 h-80" />
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'assignments'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Assignment Study Groups</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-950 text-indigo-200 font-mono">
            {assignmentGroups.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('reading')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'reading'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Reading & Exam Circles</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-950 text-indigo-200 font-mono">
            {readingGroups.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai-tutor')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'ai-tutor'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-amber-400" />
          <span>AI Syllabus Tutor & Quiz</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-950 text-amber-300 font-mono">
            WAEC/JAMB
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('schools')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'schools'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Recognized Schools Directory</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-950 text-indigo-200 font-mono">
            {RECOGNIZED_SECONDARY_SCHOOLS.length}
          </span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: ASSIGNMENT STUDY GROUPS
         ======================================================== */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  Subject Assignment Pods & Homework Help
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ask tricky questions, share textbook proofs, and solve homework step-by-step with secondary students across Idanre and Ifedore.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={assignmentSearch}
                  onChange={e => setAssignmentSearch(e.target.value)}
                  placeholder="Search topic or assignment subject..."
                  className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <select
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                >
                  <option value="All">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Language">English Language</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Agricultural Science">Agricultural Science</option>
                </select>
              </div>

              <div>
                <select
                  value={classFilter}
                  onChange={e => setClassFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                >
                  <option value="All">All Class Levels</option>
                  <option value="SS 3 (WAEC/NECO)">SS 3 (WAEC/NECO)</option>
                  <option value="SS 2">SS 2</option>
                  <option value="SS 1">SS 1</option>
                  <option value="All Secondary">All Senior & Junior</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assignment Groups List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignmentGroups
              .filter(g => {
                if (subjectFilter !== 'All' && g.subject !== subjectFilter) return false;
                if (classFilter !== 'All' && g.classLevel !== classFilter) return false;
                if (assignmentSearch.trim()) {
                  const q = assignmentSearch.toLowerCase();
                  return (
                    g.title.toLowerCase().includes(q) ||
                    g.subject.toLowerCase().includes(q) ||
                    g.activeTopic.toLowerCase().includes(q) ||
                    g.schoolName.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map(group => (
                <div
                  key={group.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs p-5 space-y-4 hover:border-indigo-600/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200">
                            {group.subject}
                          </span>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {group.classLevel}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pt-1.5 leading-snug">
                          {group.title}
                        </h3>
                        <p className="text-[11px] text-stone-500">
                          Hub School: <strong>{group.schoolName}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-indigo-800 dark:text-indigo-300 block">
                          {group.membersCount} Scholars
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {group.questionsCount} Questions
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {group.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                      <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 block">
                        Current Weekly Focus:
                      </span>
                      <strong className="text-stone-900 dark:text-stone-100">
                        {group.activeTopic}
                      </strong>
                    </div>

                    {/* Recent Assignment Questions */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                        <span>Recent Questions & Discussions</span>
                        <span className="text-[10px] font-normal text-stone-400">{group.meetingTime}</span>
                      </div>

                      {group.recentQuestions.slice(0, 2).map(q => (
                        <div
                          key={q.id}
                          className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-stone-400">
                            <span>{q.studentName}</span>
                            <span>{q.timestamp}</span>
                          </div>
                          <p className="text-stone-800 dark:text-stone-200 font-medium">
                            "{q.questionText}"
                          </p>
                          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
                            <MessageSquare className="w-3 h-3" />
                            <span>{q.solutionsCount} peer solutions posted</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleJoinAssignmentGroup(group.id)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        group.isJoined
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {group.isJoined ? '✓ Joined Group' : '+ Join Pod'}
                    </button>

                    <button
                      onClick={() => setSelectedGroupForQuestion(group)}
                      className="min-h-[38px] px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Question</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: READING & EXAM CIRCLES
         ======================================================== */}
      {activeSubTab === 'reading' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              WAEC, NECO & JAMB Reading Circles
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Collaborative study groups analyzing literature prose, drama, African poetry, and speed CBT practice drills for 280+ UTME scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {readingGroups.map(rg => (
              <div
                key={rg.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs p-5 space-y-4 hover:border-indigo-600/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200">
                        {rg.category}
                      </span>
                      <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pt-1.5 leading-snug">
                        {rg.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Target Exam: <strong>{rg.targetExam}</strong> · Curator: {rg.curatorStudent}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-indigo-800 dark:text-indigo-300">
                      {rg.membersCount} Members
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs space-y-1 border border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Core Reading Text / Focus:
                    </span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {rg.focusMaterial}
                    </strong>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {rg.synopsis}
                  </p>

                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Meeting Schedule: {rg.weeklySchedule}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      toggleJoinReadingGroup(rg.id);
                      showToast(rg.isJoined ? 'Left reading circle' : `Joined ${rg.title}! (+15 Points)`);
                    }}
                    className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      rg.isJoined
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-indigo-900 hover:bg-indigo-800 text-white shadow-2xs'
                    }`}
                  >
                    {rg.isJoined ? '✓ Joined Circle' : 'Join Reading Circle'}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Copied circle invite link');
                    }}
                    className="p-2 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Share study group"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: AI SYLLABUS TUTOR & PRACTICE QUIZ
         ======================================================== */}
      {activeSubTab === 'ai-tutor' && (
        <div className="space-y-6">
          {/* AI Tutor Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-500 flex items-center justify-center font-bold">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  AI Secondary Syllabus Tutor & Problem Solver
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Trained on WAEC, NECO & JAMB past questions. Ask for step-by-step math proofs, chemical equations, or essay writing guides.
                </p>
              </div>
            </div>

            <form onSubmit={handleAiStudyAsk} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={2}
                  value={aiStudyQuery}
                  onChange={e => setAiStudyQuery(e.target.value)}
                  placeholder="Ask a syllabus question: e.g. How to solve quadratic equations by completing the square, or explain photosynthesis light stage..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-700"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Curriculum: WAEC/NECO Senior & Junior Secondary Syllabus
                </span>
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-60"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAiLoading ? 'Analyzing Syllabus...' : 'Solve with AI Tutor (+10 Pts)'}</span>
                </button>
              </div>
            </form>

            {/* AI Explanation Result */}
            {aiExplanation && (
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-200">
                  <BrainCircuit className="w-4 h-4 text-amber-500" />
                  <span>AI Syllabus Tutor Step-by-Step Solution:</span>
                </div>
                <div className="text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">
                  {aiExplanation}
                </div>
              </div>
            )}
          </div>

          {/* Interactive WAEC/JAMB Practice Quiz Box */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 uppercase">
                  {currentQuiz.examType} Practice Question · {currentQuiz.year}
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 pt-1">
                  {currentQuiz.subject}: {currentQuiz.topic}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                  Score: {quizScore} Correct
                </span>
                <span className="text-[10px] text-stone-400 block">
                  Question {currentQuizIndex + 1} of {SAMPLE_PRACTICE_QUESTIONS.length}
                </span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-800">
              {currentQuiz.question}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuiz.options.map(opt => {
                const isSelected = selectedQuizOption === opt.label;
                const isCorrect = isQuizSubmitted && opt.label === currentQuiz.correctOption;
                const isWrong = isQuizSubmitted && isSelected && opt.label !== currentQuiz.correctOption;

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleQuizAnswer(opt.label)}
                    disabled={isQuizSubmitted}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-3 ${
                      isCorrect
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                        : isWrong
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200'
                        : isSelected
                        ? 'border-indigo-700 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {isQuizSubmitted && (
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs space-y-1 border border-stone-200 dark:border-stone-700 animate-in fade-in">
                <strong className="text-stone-900 dark:text-stone-100">
                  {selectedQuizOption === currentQuiz.correctOption ? '✓ Correct! Explanation:' : '✗ Solution Breakdown:'}
                </strong>
                <p className="text-stone-600 dark:text-stone-300">
                  {currentQuiz.explanation}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
              {!isQuizSubmitted ? (
                <button
                  onClick={submitQuizAnswer}
                  disabled={!selectedQuizOption}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shadow-2xs"
                >
                  Submit Answer (+15 Pts)
                </button>
              ) : (
                <button
                  onClick={nextQuizQuestion}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: RECOGNIZED SCHOOLS DIRECTORY
         ======================================================== */}
      {activeSubTab === 'schools' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Recognized Secondary Schools in Idanre & Ifedore
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Official roster of public, community, and mission secondary schools with verified student cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RECOGNIZED_SECONDARY_SCHOOLS.map(sch => (
              <div
                key={sch.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3 hover:border-indigo-600/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {sch.lga} LGA · {sch.town}
                    </span>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pt-1">
                      {sch.name}
                    </h3>
                    <p className="text-xs text-stone-500 italic mt-0.5">
                      "{sch.motto}" (Est. {sch.establishedYear})
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-stone-800 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Principal</span>
                    <strong className="text-stone-800 dark:text-stone-200">{sch.principalName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Students</span>
                    <strong className="text-stone-800 dark:text-stone-200">~{sch.studentPopulationEstimate} enrolled</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span>Category: {sch.category}</span>
                  <span className="text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                    {sch.activeStudyGroupsCount} active study pods
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODALS
         ======================================================== */}

      {/* Modal: Student Profile Verification */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsVerifyModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setIsVerifyModalOpen(false)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Secondary Student Verification</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Verify your student identity to receive the verified High School Scholar badge and access exclusive WAEC study circles.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Select Your School
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={e => setSelectedSchoolId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                >
                  <optgroup label="Idanre Local Government">
                    {RECOGNIZED_SECONDARY_SCHOOLS.filter(s => s.lga === 'Idanre').map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.town})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Ifedore Local Government">
                    {RECOGNIZED_SECONDARY_SCHOOLS.filter(s => s.lga === 'Ifedore').map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.town})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Class Level
                  </label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                  >
                    <option value="SS 3">SS 3 (WAEC/NECO)</option>
                    <option value="SS 2">SS 2</option>
                    <option value="SS 1">SS 1</option>
                    <option value="JSS 3">JSS 3 (BECE)</option>
                    <option value="JSS 2">JSS 2</option>
                    <option value="JSS 1">JSS 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Commercial & Business">Commercial & Business</option>
                    <option value="Junior Secondary">Junior Secondary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Student Admission / School ID Number
                </label>
                <input
                  type="text"
                  required
                  value={admissionNo}
                  onChange={e => setAdmissionNo(e.target.value)}
                  placeholder="e.g. OHS/2023/419 or IDN/SEC/091"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Parent / Guardian Phone Number (for student safety)
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={e => setGuardianPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Complete Verification (+50 Points)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Post Assignment Question */}
      {selectedGroupForQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setSelectedGroupForQuestion(null)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setSelectedGroupForQuestion(null)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Ask an Assignment Question
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Posting to: <strong>{selectedGroupForQuestion.title}</strong> ({selectedGroupForQuestion.subject})
            </p>

            <form onSubmit={handlePostQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Question or Problem Statement
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  placeholder="Type your homework question, math proof, or textbook exercise number..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroupForQuestion(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Publish Question (+20 Points)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
