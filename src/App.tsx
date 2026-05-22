import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Clock, BarChart3, BookOpen, Users, 
  TrendingUp, AlertCircle, BrainCircuit, Loader2, 
  CheckCircle2, FileText, Info, LayoutDashboard, History, Settings, Bell, Search, ChevronDown, User, Activity, Calendar, Download,
  Sun, Moon, ShieldAlert, Award, FileSpreadsheet, Plus, Sparkles, Filter, RefreshCw, Printer, Check, Trash2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, Line
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prediction {
  performance: string;
  confidence: number;
  improvement_tip: string;
  subject_scores?: {
    math?: number;
    biology?: number;
    physics: number;
    chemistry: number;
    english: number;
    computer_science?: number;
    physical_education?: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  entrance_readiness?: string;
  admit_card_eligible?: boolean;
}

interface HistoryItem {
  id: string;
  studentName?: string;
  rollNumber?: string;
  timestamp: string;
  stream: 'pcm' | 'pcb';
  inputs: {
    attendance: number;
    study_hours: number;
    assignment_score: number;
    internal_marks: number;
    previous_sem_score: number;
  };
  result: Prediction;
}

interface MockStudent {
  id: string; // CBSE Board Roll Number (8 digits)
  name: string;
  stream: 'pcm' | 'pcb';
  attendance: number;
  study_hours: number;
  assignment_score: number;
  internal_marks: number;
  previous_sem_score: number;
  predictedOutcome?: string;
  riskStatus: 'Low Risk' | 'Medium Risk' | 'High Risk';
  subjectScores?: Prediction['subject_scores'];
}

const MOCK_PROFILES = [
  {
    name: "PCM Distinction (JEE Prep Focus)",
    stream: "pcm" as const,
    data: { attendance: 96, study_hours: 8, assignment_score: 94, internal_marks: 46, previous_sem_score: 90 }
  },
  {
    name: "PCB Medical (NEET Prep Focus)",
    stream: "pcb" as const,
    data: { attendance: 92, study_hours: 7, assignment_score: 88, internal_marks: 42, previous_sem_score: 82 }
  },
  {
    name: "Average Standing Profile",
    stream: "pcm" as const,
    data: { attendance: 78, study_hours: 4, assignment_score: 72, internal_marks: 30, previous_sem_score: 64 }
  },
  {
    name: "At-Risk (Attendance Default)",
    stream: "pcb" as const,
    data: { attendance: 62, study_hours: 2, assignment_score: 45, internal_marks: 18, previous_sem_score: 42 }
  }
];

const MOCK_CLASS_ROSTER: MockStudent[] = [
  { id: "26681901", name: "Aarav Sharma", stream: "pcm", attendance: 95, study_hours: 8, assignment_score: 92, internal_marks: 46, previous_sem_score: 90, riskStatus: "Low Risk", predictedOutcome: "Distinction" },
  { id: "26681902", name: "Ananya Patel", stream: "pcb", attendance: 76, study_hours: 5, assignment_score: 68, internal_marks: 31, previous_sem_score: 64, riskStatus: "Medium Risk", predictedOutcome: "Second Division" },
  { id: "26681903", name: "Rohan Verma", stream: "pcm", attendance: 48, study_hours: 1, assignment_score: 38, internal_marks: 16, previous_sem_score: 42, riskStatus: "High Risk", predictedOutcome: "Essential Repeat" },
  { id: "26681904", name: "Priya Iyer", stream: "pcb", attendance: 93, study_hours: 7, assignment_score: 88, internal_marks: 44, previous_sem_score: 86, riskStatus: "Low Risk", predictedOutcome: "Distinction" },
  { id: "26681905", name: "Arjun Nair", stream: "pcm", attendance: 82, study_hours: 5, assignment_score: 76, internal_marks: 34, previous_sem_score: 70, riskStatus: "Medium Risk", predictedOutcome: "First Division" },
  { id: "26681906", name: "Sneha Reddy", stream: "pcb", attendance: 54, study_hours: 2, assignment_score: 48, internal_marks: 20, previous_sem_score: 46, riskStatus: "High Risk", predictedOutcome: "Essential Repeat" },
  { id: "26681907", name: "Aditya Joshi", stream: "pcm", attendance: 98, study_hours: 9, assignment_score: 96, internal_marks: 48, previous_sem_score: 95, riskStatus: "Low Risk", predictedOutcome: "Distinction" },
  { id: "26681908", name: "Tanvi Gupta", stream: "pcb", attendance: 72, study_hours: 3, assignment_score: 65, internal_marks: 29, previous_sem_score: 60, riskStatus: "Medium Risk", predictedOutcome: "Second Division" },
  { id: "26681909", name: "Sai Krishna", stream: "pcm", attendance: 42, study_hours: 1, assignment_score: 32, internal_marks: 12, previous_sem_score: 38, riskStatus: "High Risk", predictedOutcome: "Essential Repeat" },
  { id: "26681910", name: "Diya Sen", stream: "pcb", attendance: 90, study_hours: 6, assignment_score: 90, internal_marks: 43, previous_sem_score: 84, riskStatus: "Low Risk", predictedOutcome: "Distinction" },
  { id: "26681911", name: "Harpreet Singh", stream: "pcm", attendance: 79, study_hours: 4, assignment_score: 74, internal_marks: 33, previous_sem_score: 72, riskStatus: "Medium Risk", predictedOutcome: "First Division" },
  { id: "26681912", name: "Rahul Choudhury", stream: "pcb", attendance: 80, study_hours: 5, assignment_score: 81, internal_marks: 36, previous_sem_score: 75, riskStatus: "Medium Risk", predictedOutcome: "First Division" },
  { id: "26681913", name: "Abhinav Mishra", stream: "pcm", attendance: 92, study_hours: 6, assignment_score: 89, internal_marks: 45, previous_sem_score: 88, riskStatus: "Low Risk", predictedOutcome: "Distinction" },
  { id: "26681914", name: "Meenakshi Sundaram", stream: "pcb", attendance: 61, study_hours: 2, assignment_score: 52, internal_marks: 22, previous_sem_score: 50, riskStatus: "High Risk", predictedOutcome: "Essential Repeat" },
  { id: "26681915", name: "Shubham Deshmukh", stream: "pcm", attendance: 76, study_hours: 3, assignment_score: 67, internal_marks: 30, previous_sem_score: 62, riskStatus: "Medium Risk", predictedOutcome: "Second Division" }
];

export default function App() {
  const [formData, setFormData] = useState({
    studentName: "Aarav Sharma",
    rollNumber: "26681901",
    stream: "pcm" as 'pcm' | 'pcb',
    ...MOCK_PROFILES[0].data
  });
  
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classview' | 'history' | 'configuration' | 'documentation'>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Class view filtering states
  const [roster, setRoster] = useState<MockStudent[]>(MOCK_CLASS_ROSTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("All");
  
  // Chart selection State
  const [chartType, setChartType] = useState<'radar' | 'subject' | 'comparison'>('radar');
  
  // Interactive Goal Settings State
  const [targetGrade, setTargetGrade] = useState<'Distinction' | 'First Division' | 'Second Division' | 'Third Division' | 'Essential Repeat'>('Distinction');
  const [goalCheckedTasks, setGoalCheckedTasks] = useState<Record<string, boolean>>({});

  // Configuration Preferences
  const [preferences, setPreferences] = useState({
    evaluationMode: 'standard',
    localFallback: true
  });

  // Hydrate from Local Storage (supporting backwards compatibility with old branding keys)
  useEffect(() => {
    const savedHistory = localStorage.getItem('student_performance_history') || localStorage.getItem('edupredict_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    const savedTheme = (localStorage.getItem('student_performance_theme') || localStorage.getItem('edupredict_theme')) as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    const savedPrefs = localStorage.getItem('student_performance_preferences') || localStorage.getItem('edupredict_preferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {}
    }
  }, []);

  // Sync theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('student_performance_theme', theme);
  }, [theme]);

  // Persist predictions history
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('student_performance_history', JSON.stringify(newHistory));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'studentName' || name === 'rollNumber') {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }
    
    let numValue = parseInt(value) || 0;
    
    // Clamp values
    if (name === 'attendance' || name === 'assignment_score' || name === 'previous_sem_score') numValue = Math.min(100, Math.max(0, numValue));
    if (name === 'internal_marks') numValue = Math.min(50, Math.max(0, numValue));
    if (name === 'study_hours') numValue = Math.min(24, Math.max(0, numValue));

    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const loadProfile = (profileName: string) => {
    const profile = MOCK_PROFILES.find(p => p.name === profileName);
    if (profile) {
      setFormData(prev => ({
        ...prev,
        stream: profile.stream,
        ...profile.data
      }));
      setPrediction(null);
    }
  };

  const calculateLocalPrediction = (payload: typeof formData): Prediction => {
    const { attendance, study_hours, assignment_score, internal_marks, previous_sem_score, stream = 'pcm' } = payload;
    
    // Calculate a rough score to determine category
    const maxPossible = 100 + 50 + 100; // Assignment + Internal + Prev Sem
    const actualScore = Number(assignment_score) + Number(internal_marks) + Number(previous_sem_score);
    const scorePercentage = (actualScore / maxPossible) * 100;
    
    // Factor in attendance and study hours
    const attendanceFactor = Number(attendance) / 100;
    const finalScore = scorePercentage * attendanceFactor + (Number(study_hours) * 0.5);

    let performance = "Essential Repeat";
    let tip = "Critical academic intervention required. Focus on increasing attendance to sit for Board exams and get core subject support.";
    let confidence = Math.round(70 + Math.random() * 20);
    
    if (finalScore >= 75) {
      performance = "Distinction";
      tip = "Outstanding academic standing! You have exceptional mastery; maintain this pace to secure top ranks in Board exams.";
    } else if (finalScore >= 60) {
      performance = "First Division";
      tip = "Strong performance. Concentrating on weekly unit tests and practical writing will comfortably push you into the Distinction bracket.";
    } else if (finalScore >= 50) {
      performance = "Second Division";
      tip = "Satisfactory progress. Increasing self-study hours and practicing past papers will help elevate you to a First Division.";
    } else if (finalScore >= 35) {
      performance = "Third Division";
      tip = "Pass category. Immediate regular revision and solving NCERT questions is highly recommended to improve subject grasp.";
    }

    // Dynamic subject-wise estimation logic based on parameters (Indian Science Stream)
    const studyFactor = Math.min(10, Number(study_hours)) / 10;
    const assignmentFactor = Number(assignment_score) / 100;
    const prevSemFactor = Number(previous_sem_score) / 100;
    const internalFactor = Number(internal_marks) / 50;

    let subjects: any = {};
    if (stream === "pcb") {
      subjects = {
        biology: Math.round(42 + (prevSemFactor * 32) + (studyFactor * 16) + (internalFactor * 10)),
        physics: Math.round(38 + (assignmentFactor * 32) + (studyFactor * 18) + (prevSemFactor * 12)),
        chemistry: Math.round(42 + (attendanceFactor * 20) + (prevSemFactor * 22) + (studyFactor * 16)),
        english: Math.round(45 + (attendanceFactor * 25) + (prevSemFactor * 20) + (studyFactor * 10)),
        physical_education: Math.round(40 + (assignmentFactor * 35) + (studyFactor * 20) + (internalFactor * 5))
      };
    } else {
      subjects = {
        math: Math.round(40 + (prevSemFactor * 30) + (studyFactor * 20) + (internalFactor * 10)),
        physics: Math.round(38 + (assignmentFactor * 32) + (studyFactor * 18) + (prevSemFactor * 12)),
        chemistry: Math.round(42 + (attendanceFactor * 20) + (prevSemFactor * 22) + (studyFactor * 16)),
        english: Math.round(45 + (attendanceFactor * 25) + (prevSemFactor * 20) + (studyFactor * 10)),
        computer_science: Math.round(35 + (assignmentFactor * 35) + (studyFactor * 25) + (internalFactor * 5))
      };
    }

    // Clamp subject scores to 100 and minimum 0
    Object.keys(subjects).forEach(key => {
      subjects[key] = Math.max(0, Math.min(100, subjects[key]));
    });

    // Calculate entrance readiness indices
    let entrance_readiness = "";
    if (stream === "pcb") {
      const biologyScore = subjects.biology || 50;
      const physicsScore = subjects.physics || 50;
      const chemistryScore = subjects.chemistry || 50;
      const baseNEET = 180 + (biologyScore * 2.2) + (physicsScore * 1.2) + (chemistryScore * 1.2) + (Number(study_hours) * 8);
      const neetScore = Math.max(180, Math.min(720, Math.round(baseNEET)));
      entrance_readiness = `NEET Forecast: ${neetScore}/720 Marks`;
      if (neetScore >= 600) {
        tip += ` You are on track for a premier government medical college seat (NEET est: ${neetScore}+)!`;
      } else {
        tip += ` Focus on Biology (NCERT line-by-line) and active recall for organic naming reactions to elevate your NEET estimate (${neetScore}/720) to 600+.`;
      }
    } else {
      const mathScore = subjects.math || 50;
      const physicsScore = subjects.physics || 50;
      const chemistryScore = subjects.chemistry || 50;
      const baseJEE = 50 + (mathScore * 0.2) + (physicsScore * 0.15) + (chemistryScore * 0.1) + (Number(study_hours) * 0.5);
      const jeePercentile = Math.max(50.0, Math.min(99.99, Number(baseJEE.toFixed(2))));
      entrance_readiness = `JEE Main Forecast: ${jeePercentile}%ile`;
      if (jeePercentile >= 95) {
        tip += ` Excellent JEE Main forecast of ${jeePercentile}%ile! Practice mock test series and JEE Advanced previous papers.`;
      } else {
        tip += ` Focus on Calculus, Coordinate Geometry, and high-weightage Physics chapters to push your JEE Main forecast (${jeePercentile}%ile) above 97%ile.`;
      }
    }

    // Derive strengths and weaknesses based on the inputs (CBSE / Indian University Context)
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (Number(attendance) >= 85) strengths.push("Regular classroom presence aligns well with the 75% CBSE mandatory criteria.");
    else if (Number(attendance) < 75) weaknesses.push("Attendance falls below the mandatory 75% CBSE threshold, running the risk of having your admit card withheld.");

    if (Number(study_hours) >= 6) strengths.push("Strong daily study routine provides robust foundation for competitive exam prep (JEE/NEET).");
    else if (Number(study_hours) < 3.5) weaknesses.push("Daily self-study hours are low; dedicate at least 4.5+ hours to match high board syllabus rigour.");

    if (Number(assignment_score) >= 80) strengths.push("Excellent work on practical files, science lab manuals, and external project files.");
    else if (Number(assignment_score) < 60) weaknesses.push("Incomplete practical journals and school record logs are dragging down internal grade potential.");

    if (Number(internal_marks) >= 40) strengths.push("Strong scores in mid-term unit tests and school pre-boards.");
    else if (Number(internal_marks) < 25) weaknesses.push("Low performance in internal pre-boards indicates a need for comprehensive concept revision.");

    if (strengths.length === 0) strengths.push("Demonstrates basic concepts. Maintain solid, continuous revision.");
    if (weaknesses.length === 0) weaknesses.push("No major academic checkpoints. Keep following your daily schedule.");

    return {
      performance,
      confidence,
      improvement_tip: tip,
      subject_scores: subjects,
      strengths,
      weaknesses,
      entrance_readiness,
      admit_card_eligible: Number(attendance) >= 75
    };
  };

  const predictPerformance = async (e?: React.FormEvent, customData?: typeof formData) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    const payloadData = customData || formData;

    try {
      const apiUrl = ((import.meta as any).env?.VITE_API_GATEWAY_URL as string) || '/api/predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: payloadData.attendance,
          study_hours: payloadData.study_hours,
          assignment_score: payloadData.assignment_score,
          internal_marks: payloadData.internal_marks,
          previous_sem_score: payloadData.previous_sem_score,
          stream: payloadData.stream
        })
      });

      if (!response.ok) throw new Error('Prediction failed');
      
      const data: Prediction = await response.json();
      
      // Strict grading mode adjuster if enabled in preferences
      if (preferences.evaluationMode === 'strict') {
        if (data.performance === 'Distinction' && payloadData.attendance < 90) {
          data.performance = 'First Division';
          data.improvement_tip = "Strict Evaluation Mode: Attendance under 90% caps outcomes to First Division. " + data.improvement_tip;
        } else if (data.performance === 'First Division' && payloadData.attendance < 75) {
          data.performance = 'Second Division';
          data.improvement_tip = "Strict Evaluation Mode: Attendance under 75% drops outcomes to Second Division. " + data.improvement_tip;
        } else if (payloadData.attendance < 60) {
          data.performance = 'Essential Repeat';
          data.improvement_tip = "Strict Evaluation Mode: Attendance under 60% flags mandatory repeat class status. " + data.improvement_tip;
        }
      }

      setPrediction(data);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        studentName: payloadData.studentName || "Anonymous Student",
        rollNumber: payloadData.rollNumber || "26681901",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        stream: payloadData.stream,
        inputs: {
          attendance: payloadData.attendance,
          study_hours: payloadData.study_hours,
          assignment_score: payloadData.assignment_score,
          internal_marks: payloadData.internal_marks,
          previous_sem_score: payloadData.previous_sem_score
        },
        result: data
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 30);
      saveHistory(updatedHistory);
      
    } catch (err) {
      if (preferences.localFallback) {
        console.warn("API Server offline, using client-side calculation fallback:", err);
        const data = calculateLocalPrediction(payloadData);
        
        // Strict grading mode adjuster if enabled in preferences
        if (preferences.evaluationMode === 'strict') {
          if (data.performance === 'Distinction' && payloadData.attendance < 90) {
            data.performance = 'First Division';
            data.improvement_tip = "Strict Evaluation Mode: Attendance under 90% caps outcomes to First Division. " + data.improvement_tip;
          } else if (data.performance === 'First Division' && payloadData.attendance < 75) {
            data.performance = 'Second Division';
            data.improvement_tip = "Strict Evaluation Mode: Attendance under 75% drops outcomes to Second Division. " + data.improvement_tip;
          } else if (payloadData.attendance < 60) {
            data.performance = 'Essential Repeat';
            data.improvement_tip = "Strict Evaluation Mode: Attendance under 60% flags mandatory repeat class status. " + data.improvement_tip;
          }
        }

        setPrediction(data);
        
        // Add to history
        const newHistoryItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          studentName: payloadData.studentName || "Anonymous Student",
          rollNumber: payloadData.rollNumber || "26681901",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          stream: payloadData.stream,
          inputs: {
            attendance: payloadData.attendance,
            study_hours: payloadData.study_hours,
            assignment_score: payloadData.assignment_score,
            internal_marks: payloadData.internal_marks,
            previous_sem_score: payloadData.previous_sem_score
          },
          result: data
        };

        const updatedHistory = [newHistoryItem, ...history].slice(0, 30);
        saveHistory(updatedHistory);
      } else {
        setError('Failed to get prediction. Connection failure or local server offline.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
  };

  const clearAllHistory = () => {
    if (confirm("Are you sure you want to clear your prediction history?")) {
      saveHistory([]);
    }
  };

  // Class view metrics calculation
  const classAverages = React.useMemo(() => {
    const total = roster.length;
    if (total === 0) return { attendance: 0, studyHours: 0, assignments: 0, internal: 0, prevSem: 0 };
    return {
      attendance: Math.round(roster.reduce((acc, item) => acc + item.attendance, 0) / total),
      studyHours: Number((roster.reduce((acc, item) => acc + item.study_hours, 0) / total).toFixed(1)),
      assignments: Math.round(roster.reduce((acc, item) => acc + item.assignment_score, 0) / total),
      internal: Math.round(roster.reduce((acc, item) => acc + item.internal_marks, 0) / total),
      prevSem: Math.round(roster.reduce((acc, item) => acc + item.previous_sem_score, 0) / total)
    };
  }, [roster]);

  const classStatusDistribution = React.useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    roster.forEach(s => {
      if (s.riskStatus === 'Low Risk') counts.low++;
      else if (s.riskStatus === 'Medium Risk') counts.medium++;
      else counts.high++;
    });
    return counts;
  }, [roster]);

  // Handle loading student from Class Roster to Individual dashboard
  const loadStudentFromClass = (student: MockStudent) => {
    const updatedForm = {
      studentName: student.name,
      rollNumber: student.id,
      stream: student.stream,
      attendance: student.attendance,
      study_hours: student.study_hours,
      assignment_score: student.assignment_score,
      internal_marks: student.internal_marks,
      previous_sem_score: student.previous_sem_score
    };
    setFormData(updatedForm);
    setPrediction(null);
    setActiveTab('dashboard');
    
    // Proactively generate prediction for loaded student
    predictPerformance(undefined, updatedForm);
  };

  // Target Score Reverse Simulator Engine logic (Indian Context)
  const simulatedRequirement = React.useMemo(() => {
    if (targetGrade === 'Distinction') {
      const attDiff = Math.max(0, 85 - formData.attendance);
      const studyDiff = Math.max(0, 7.5 - formData.study_hours);
      const assignDiff = Math.max(0, 85 - formData.assignment_score);
      const internalDiff = Math.max(0, 42 - formData.internal_marks);
      const prevDiff = Math.max(0, 80 - formData.previous_sem_score);
      
      return {
        attendance: Math.max(85, formData.attendance),
        study_hours: Math.max(8, formData.study_hours),
        assignment_score: Math.max(85, formData.assignment_score),
        internal_marks: Math.max(42, formData.internal_marks),
        previous_sem_score: Math.max(80, formData.previous_sem_score),
        changes: {
          attendance: attDiff > 0 ? `Increase attendance by +${attDiff}% to fulfill CBSE Distinction criteria.` : 'Attendance is excellent.',
          study_hours: studyDiff > 0 ? `Increase study hours by +${Math.ceil(studyDiff)}h/day for entrance level mastery.` : 'Daily study commitment is solid.',
          assignment_score: assignDiff > 0 ? `Improve science lab file journals by +${assignDiff} marks` : 'Lab journal standing is excellent.',
          internal_marks: internalDiff > 0 ? `Raise school pre-board unit scores by +${internalDiff} marks` : 'Internal mid-terms are outstanding.',
          previous_sem_score: prevDiff > 0 ? `Target Class 11 cumulative baseline of ${formData.previous_sem_score + prevDiff}%` : 'Class 11 baseline is supportive.'
        },
        achievable: attDiff === 0 && studyDiff === 0 && assignDiff === 0 && internalDiff === 0 && prevDiff === 0
      };
    } else if (targetGrade === 'First Division') {
      const attDiff = Math.max(0, 75 - formData.attendance);
      const studyDiff = Math.max(0, 4.5 - formData.study_hours);
      const assignDiff = Math.max(0, 70 - formData.assignment_score);
      const internalDiff = Math.max(0, 32 - formData.internal_marks);
      
      return {
        attendance: Math.max(75, formData.attendance),
        study_hours: Math.max(5, Math.ceil(formData.study_hours)),
        assignment_score: Math.max(70, formData.assignment_score),
        internal_marks: Math.max(32, formData.internal_marks),
        previous_sem_score: formData.previous_sem_score,
        changes: {
          attendance: attDiff > 0 ? `Maintain minimum 75% CBSE mandatory attendance criteria (Current: ${formData.attendance}%)` : 'Secured board attendance mandate.',
          study_hours: studyDiff > 0 ? `Aim for daily study sessions of at least ${Math.ceil(formData.study_hours + studyDiff)}h/day.` : 'Study hours are reasonable.',
          assignment_score: assignDiff > 0 ? `Complete practical records and logbooks properly (+${assignDiff} points).` : 'Lab manual marks meet the standard.',
          internal_marks: internalDiff > 0 ? `Target pre-board unit score improvements (+${internalDiff} marks).` : 'Mid-terms grades support this target.',
          previous_sem_score: 'Previous marks are acceptable for average standing.'
        },
        achievable: attDiff === 0 && studyDiff === 0 && assignDiff === 0 && internalDiff === 0
      };
    } else if (targetGrade === 'Second Division') {
      const attDiff = Math.max(0, 75 - formData.attendance);
      const studyDiff = Math.max(0, 3.5 - formData.study_hours);
      
      return {
        attendance: Math.max(75, formData.attendance),
        study_hours: Math.max(4, Math.ceil(formData.study_hours)),
        assignment_score: formData.assignment_score,
        internal_marks: formData.internal_marks,
        previous_sem_score: formData.previous_sem_score,
        changes: {
          attendance: attDiff > 0 ? `Bring attendance up to 75% to prevent withhold of Admit Card.` : 'Board attendance quota satisfied.',
          study_hours: studyDiff > 0 ? `Study for at least ${Math.ceil(formData.study_hours + studyDiff)}h/day to prevent conceptual gaps.` : 'Daily hours are adequate.',
          assignment_score: 'Lab manuals standard is passing.',
          internal_marks: 'Internal marks meet the requirements.',
          previous_sem_score: 'Class 11 marks are supportive.'
        },
        achievable: attDiff === 0 && studyDiff === 0
      };
    } else {
      return {
        attendance: formData.attendance,
        study_hours: formData.study_hours,
        assignment_score: formData.assignment_score,
        internal_marks: formData.internal_marks,
        previous_sem_score: formData.previous_sem_score,
        changes: {
          attendance: 'No critical attendance adjustment for basic pass.',
          study_hours: 'Retain standard schedule.',
          assignment_score: 'Standard practical manuals complete.',
          internal_marks: 'Minimum marks secured.',
          previous_sem_score: 'Standard pass status maintained.'
        },
        achievable: true
      };
    }
  }, [formData, targetGrade]);

  const toggleTask = (taskKey: string) => {
    setGoalCheckedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  const getStatusStyle = (performance?: string) => {
    switch (performance?.toLowerCase()) {
      case 'distinction': return { color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-250 dark:border-emerald-900/50', fill: '#10b981' };
      case 'first division': return { color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-200 dark:border-sky-900/50', fill: '#0ea5e9' };
      case 'second division': return { color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900/50', fill: '#f59e0b' };
      case 'third division': return { color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900/50', fill: '#f97316' };
      case 'essential repeat': return { color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-250 dark:border-rose-900/50', fill: '#ef4444' };
      default: return { color: 'text-slate-505 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-800/50', fill: '#64748b' };
    }
  };

  // Recharts Chart Data Assemblers (Localized Indian Subjects)
  const radarChartData = [
    { subject: 'Attendance', Student: Math.round((formData.attendance / 100) * 100), Average: classAverages.attendance, fullMark: 100 },
    { subject: 'Study Hrs', Student: Math.round((formData.study_hours / 24) * 100), Average: Math.round((classAverages.studyHours / 24) * 100), fullMark: 100 },
    { subject: 'Lab Journals', Student: formData.assignment_score, Average: classAverages.assignments, fullMark: 100 },
    { subject: 'Unit Test', Student: Math.round((formData.internal_marks / 50) * 100), Average: Math.round((classAverages.internal / 50) * 100), fullMark: 100 },
    { subject: 'Class 11 Marks', Student: formData.previous_sem_score, Average: classAverages.prevSem, fullMark: 100 },
  ];

  const estimatedSubjectsData = formData.stream === 'pcb' ? [
    { 
      name: 'Biology (044)', 
      Score: prediction?.subject_scores?.biology || Math.round(42 + (formData.previous_sem_score * 0.32) + (formData.study_hours * 1.6) + (formData.internal_marks * 0.2)),
      Average: 75
    },
    { 
      name: 'Physics (042)', 
      Score: prediction?.subject_scores?.physics || Math.round(38 + (formData.assignment_score * 0.32) + (formData.study_hours * 1.8) + (formData.previous_sem_score * 0.12)),
      Average: 70
    },
    { 
      name: 'Chemistry (043)', 
      Score: prediction?.subject_scores?.chemistry || Math.round(42 + (formData.attendance * 0.2) + (formData.previous_sem_score * 0.22) + (formData.study_hours * 1.6)),
      Average: 73
    },
    { 
      name: 'English Core (301)', 
      Score: prediction?.subject_scores?.english || Math.round(45 + (formData.attendance * 0.25) + (formData.previous_sem_score * 0.2)),
      Average: 76
    },
    { 
      name: 'Physical Ed (048)', 
      Score: prediction?.subject_scores?.physical_education || Math.round(40 + (formData.assignment_score * 0.35) + (formData.study_hours * 2.0)),
      Average: 82
    }
  ] : [
    { 
      name: 'Mathematics (041)', 
      Score: prediction?.subject_scores?.math || Math.round(40 + (formData.previous_sem_score * 0.3) + (formData.study_hours * 2) + (formData.internal_marks * 0.2)),
      Average: 74
    },
    { 
      name: 'Physics (042)', 
      Score: prediction?.subject_scores?.physics || Math.round(38 + (formData.assignment_score * 0.32) + (formData.study_hours * 1.8) + (formData.previous_sem_score * 0.12)),
      Average: 70
    },
    { 
      name: 'Chemistry (043)', 
      Score: prediction?.subject_scores?.chemistry || Math.round(42 + (formData.attendance * 0.2) + (formData.previous_sem_score * 0.22) + (formData.study_hours * 1.6)),
      Average: 73
    },
    { 
      name: 'English Core (301)', 
      Score: prediction?.subject_scores?.english || Math.round(45 + (formData.attendance * 0.25) + (formData.previous_sem_score * 0.2)),
      Average: 76
    },
    { 
      name: 'Computer Sci (083)', 
      Score: prediction?.subject_scores?.computer_science || Math.round(35 + (formData.assignment_score * 0.35) + (formData.study_hours * 2.5)),
      Average: 81
    }
  ];

  const comparisonData = [
    { category: 'Attendance', Student: formData.attendance, ClassAverage: classAverages.attendance },
    { category: 'Study (x10)', Student: formData.study_hours * 10, ClassAverage: classAverages.studyHours * 10 },
    { category: 'Lab Journals', Student: formData.assignment_score, ClassAverage: classAverages.assignments },
    { category: 'Internals (x2)', Student: formData.internal_marks * 2, ClassAverage: classAverages.internal * 2 },
    { category: 'Class 11 Marks', Student: formData.previous_sem_score, ClassAverage: classAverages.prevSem }
  ];

  // Offline entrance score calculator fallback
  const getOfflineEntranceEstimate = () => {
    if (prediction?.entrance_readiness) return prediction.entrance_readiness;
    
    if (formData.stream === 'pcb') {
      const bio = estimatedSubjectsData[0].Score;
      const phy = estimatedSubjectsData[1].Score;
      const chm = estimatedSubjectsData[2].Score;
      const base = 180 + (bio * 2.2) + (phy * 1.2) + (chm * 1.2) + (formData.study_hours * 8);
      return `NEET Forecast: ${Math.max(180, Math.min(720, Math.round(base)))}/720 Marks`;
    } else {
      const mat = estimatedSubjectsData[0].Score;
      const phy = estimatedSubjectsData[1].Score;
      const chm = estimatedSubjectsData[2].Score;
      const base = 50 + (mat * 0.2) + (phy * 0.15) + (chm * 0.1) + (formData.study_hours * 0.5);
      return `JEE Main Forecast: ${Math.max(50.0, Math.min(99.99, Number(base.toFixed(2))))}%ile`;
    }
  };

  // Exporters
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'history') {
      csvContent += "ID,Student Name,Roll Number,Stream,Timestamp,Attendance,Study Hours,Lab Journal,Internal Marks,Class 11 Marks,Board Division,Confidence\n";
      history.forEach(item => {
        csvContent += `${item.id},${item.studentName},${item.rollNumber},${item.stream.toUpperCase()},${item.timestamp},${item.inputs.attendance},${item.inputs.study_hours},${item.inputs.assignment_score},${item.inputs.internal_marks},${item.inputs.previous_sem_score},${item.result.performance},${item.result.confidence}%\n`;
      });
    } else {
      csvContent += `Metric,Current Student (${formData.studentName} - Roll: ${formData.rollNumber}),Class Average\n`;
      csvContent += `Stream,${formData.stream.toUpperCase()},\n`;
      csvContent += `Attendance,${formData.attendance}%,${classAverages.attendance}%\n`;
      csvContent += `Daily Study Hours,${formData.study_hours}h,${classAverages.studyHours}h\n`;
      csvContent += `Lab Journal & Practicals,${formData.assignment_score}/100,${classAverages.assignments}/100\n`;
      csvContent += `Internal Assessment Marks,${formData.internal_marks}/50,${classAverages.internal}/50\n`;
      csvContent += `Class 11 Cumulative Marks,${formData.previous_sem_score}/100,${classAverages.prevSem}/100\n`;
      csvContent += `CBSE Admit Card Status,${formData.attendance >= 75 ? 'ELIGIBLE' : 'WITHHELD'},\n`;
      csvContent += `Competitive Entrance,${getOfflineEntranceEstimate()},\n`;
      if (prediction) {
        csvContent += `Predicted Board Division,${prediction.performance}\n`;
        csvContent += `Model Confidence,${prediction.confidence}%\n`;
      }
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", activeTab === 'history' ? "predictions_history.csv" : `${formData.studentName.replace(/\s+/g, '_')}_academic_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(activeTab === 'history' ? history : {
        student: formData.studentName,
        rollNumber: formData.rollNumber,
        stream: formData.stream,
        metrics: {
          attendance: formData.attendance,
          study_hours: formData.study_hours,
          assignment_score: formData.assignment_score,
          internal_marks: formData.internal_marks,
          previous_sem_score: formData.previous_sem_score
        },
        entranceForecast: getOfflineEntranceEstimate(),
        admitCardEligible: formData.attendance >= 75,
        prediction: prediction,
        classAverages: classAverages
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", activeTab === 'history' ? "predictions_history.json" : `${formData.studentName.replace(/\s+/g, '_')}_academic_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter roster students based on search and risk states
  const filteredRoster = roster.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (riskFilter === 'All') return matchesSearch;
    return matchesSearch && student.riskStatus === riskFilter;
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden bg-grid-pattern transition-colors duration-300">
      
      {/* Sleek Sidebar Navigation */}
      <aside className={cn(
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col transition-all duration-300 relative z-20 shadow-sm print:hidden",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        
        {/* Sidebar Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <GraduationCap className="w-5 h-5 animate-pulse" />
            </div>
            {!sidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-md font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 whitespace-nowrap"
              >
                Performance AI
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="Dashboard Analysis" 
            active={activeTab === 'dashboard'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Users />} 
            label="Classroom Roster" 
            active={activeTab === 'classview'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('classview')} 
            badge={roster.length.toString()}
          />
          <SidebarItem 
            icon={<History />} 
            label="Predictions History" 
            active={activeTab === 'history'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('history')} 
            badge={history.length > 0 ? history.length.toString() : undefined} 
          />
          
          <div className="pt-8 pb-2">
            {!sidebarCollapsed ? (
              <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Preferences</p>
            ) : (
              <div className="border-t border-slate-200 dark:border-slate-800 my-2"></div>
            )}
          </div>
          
          <SidebarItem 
            icon={<Settings />} 
            label="Settings" 
            active={activeTab === 'configuration'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('configuration')} 
          />
          <SidebarItem 
            icon={<Info />} 
            label="Documentation" 
            active={activeTab === 'documentation'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('documentation')} 
          />
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-955 border border-slate-200/60 dark:border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0 shadow-sm">
              IN
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">CBSE Educator</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 truncate">Sec-A HSC Science</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full w-6.5 h-6.5 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", sidebarCollapsed ? "-rotate-90" : "rotate-90")} />
        </button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 z-10 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-sm font-semibold text-slate-650 dark:text-slate-400 hidden md:block">
              {activeTab === 'dashboard' && 'Indian CBSE Class XII Academic Prediction Engine'}
              {activeTab === 'classview' && 'Batch Student Roster & Stream Performance'}
              {activeTab === 'history' && 'Local Session Audit Logs'}
              {activeTab === 'configuration' && 'Model Preferences Manager'}
              {activeTab === 'documentation' && 'HSC/CBSE Board Specifications Guide'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-505 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-all duration-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50 cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            
            {/* Calendar */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Dashboard tab */}
            {activeTab === 'dashboard' && (
              <>
                {/* Hero Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 dark:from-slate-900/30 dark:via-slate-900/60 dark:to-slate-950 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-950/20 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="z-10">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">HSC Class XII Prediction</span>
                      {preferences.evaluationMode === 'strict' && (
                        <span className="bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">Strict Grading</span>
                      )}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2.5">Predict Student Outcomes</h1>
                    <p className="text-xs text-slate-555 dark:text-slate-400 mt-1 max-w-xl">Evaluate attendance, study logs, practical journals, and mock unit tests mapped directly onto CBSE Board & Entrance metrics.</p>
                  </div>
                  
                  {/* Action Dropdown */}
                  <div className="flex flex-wrap items-center gap-3.5 z-10 shrink-0">
                    <div className="relative">
                      <select 
                        onChange={(e) => loadProfile(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer shadow-sm min-w-[220px]"
                      >
                        <option value="">🎯 Quick Load Profile...</option>
                        {MOCK_PROFILES.map(p => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Primary Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Metric Inputs Card */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                        <h3 className="text-xs font-bold tracking-widest text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                          <Activity className="w-4 h-4 text-indigo-500" />
                          BOARD PARAMETERS
                        </h3>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">Live Model</span>
                      </div>
                      
                      <div className="p-6 space-y-5">
                        {/* Stream selector buttons */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            HSC / CBSE Stream Selection
                          </label>
                          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-955 p-1 rounded-xl border border-slate-200/60 dark:border-slate-850">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, stream: 'pcm' }))}
                              className={cn(
                                "py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-center",
                                formData.stream === 'pcm' 
                                  ? "bg-indigo-600 text-white shadow-sm" 
                                  : "text-slate-555 hover:text-slate-800 dark:hover:text-slate-350"
                              )}
                            >
                              PCM (Engineering)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, stream: 'pcb' }))}
                              className={cn(
                                "py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-center",
                                formData.stream === 'pcb' 
                                  ? "bg-indigo-600 text-white shadow-sm" 
                                  : "text-slate-555 hover:text-slate-800 dark:hover:text-slate-350"
                              )}
                            >
                              PCB (Medical)
                            </button>
                          </div>
                        </div>

                        <form onSubmit={(e) => predictPerformance(e)} className="space-y-5">
                          
                          {/* Student Name */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Student Name
                              </label>
                              <input 
                                type="text" 
                                name="studentName"
                                value={formData.studentName} 
                                onChange={handleInputChange} 
                                placeholder="Student name..."
                                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" /> CBSE Board Roll No
                              </label>
                              <input 
                                type="text" 
                                name="rollNumber"
                                value={formData.rollNumber} 
                                onChange={handleInputChange} 
                                placeholder="Roll No (8 digits)..."
                                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                              />
                            </div>
                          </div>

                          <MetricInput 
                            label="CBSE Board Attendance" name="attendance" 
                            value={formData.attendance} onChange={handleInputChange}
                            icon={<Users className="w-3.5 h-3.5" />} min={0} max={100} suffix="%"
                          />
                          <MetricInput 
                            label="Entrance Prep Self-Study" name="study_hours" 
                            value={formData.study_hours} onChange={handleInputChange}
                            icon={<Clock className="w-3.5 h-3.5" />} min={0} max={24} suffix="h/day"
                          />
                          <MetricInput 
                            label="Practical Lab & Projects Score" name="assignment_score" 
                            value={formData.assignment_score} onChange={handleInputChange}
                            icon={<BookOpen className="w-3.5 h-3.5" />} min={0} max={100} suffix="/100"
                          />
                          <MetricInput 
                            label="Internal Tests & Pre-Boards" name="internal_marks" 
                            value={formData.internal_marks} onChange={handleInputChange}
                            icon={<FileText className="w-3.5 h-3.5" />} min={0} max={50} suffix="/50"
                          />
                          <MetricInput 
                            label="Class 11 Cumulative Marks" name="previous_sem_score" 
                            value={formData.previous_sem_score} onChange={handleInputChange}
                            icon={<TrendingUp className="w-3.5 h-3.5" />} min={0} max={100} suffix="/100"
                          />

                          <button 
                            type="submit" disabled={loading}
                            className="w-full mt-6 flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-indigo-400 disabled:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                          >
                            {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <BrainCircuit className="w-4.5 h-4.5" />}
                            {loading ? 'Evaluating Model Outputs...' : 'Assess Board Performance'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Results Panel */}
                  <div className="lg:col-span-7 space-y-6">
                    <AnimatePresence mode="wait">
                      {!prediction && !loading && !error && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="min-h-[480px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-12 text-center"
                        >
                          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 shadow-inner">
                            <BarChart3 className="w-8 h-8 text-slate-350 dark:text-slate-700" />
                          </div>
                          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-2">Awaiting Parameters</h3>
                          <p className="text-xs text-slate-555 dark:text-slate-400 max-w-xs leading-relaxed">Adjust academic sliders on the left, check name / roll, and run Assessment to trigger our local localized Random Forest classification model.</p>
                        </motion.div>
                      )}

                      {loading && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="min-h-[480px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center"
                        >
                          <div className="relative w-16 h-16 mb-6">
                            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                            <BrainCircuit className="w-7 h-7 text-indigo-500 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
                          </div>
                          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-2">Evaluating Random Forest Nodes</h3>
                          <p className="text-xs text-slate-555 dark:text-slate-400">Aggregating decision branches for student outcomes...</p>
                        </motion.div>
                      )}

                      {prediction && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          {/* Visual Grade Outcome Card */}
                          <div className={cn("rounded-2xl border p-6 shadow-sm relative overflow-hidden", getStatusStyle(prediction.performance).bg, getStatusStyle(prediction.performance).border)}>
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 dark:bg-black/5 rounded-full translate-x-10 -translate-y-10"></div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 z-10 relative">
                              <div>
                                <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80", getStatusStyle(prediction.performance).color)}>Predicted Indian Board Division</p>
                                <div className="flex items-center gap-2.5">
                                  <h2 className={cn("text-2xl font-black tracking-tight", getStatusStyle(prediction.performance).color)}>
                                    {prediction.performance === 'Distinction' ? 'First Class with Distinction' : prediction.performance}
                                  </h2>
                                  {prediction.performance === 'Distinction' && <Award className="w-7 h-7 text-emerald-500 animate-bounce" />}
                                  {prediction.performance === 'Essential Repeat' && <ShieldAlert className="w-7 h-7 text-rose-505 animate-pulse" />}
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
                                  Student: <span className="text-slate-900 dark:text-white font-bold">{formData.studentName}</span> | Roll: <span className="text-slate-900 dark:text-white font-bold">{formData.rollNumber}</span>
                                </p>
                              </div>
                              
                              <div className="bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Model Confidence</p>
                                  <p className="text-lg font-black text-slate-800 dark:text-white leading-none">{prediction.confidence}%</p>
                                </div>
                                <div className="w-9 h-9 rounded-full border-[3px] border-indigo-155 dark:border-indigo-900/50 flex items-center justify-center relative bg-indigo-50 dark:bg-slate-950">
                                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">HSC</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white/75 dark:bg-slate-955 p-4 rounded-xl border border-white/40 dark:border-slate-900/40 z-10 relative">
                              <div className="flex items-start gap-3">
                                <Info className={cn("w-4.5 h-4.5 shrink-0 mt-0.5", getStatusStyle(prediction.performance).color)} />
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Intervention Strategy</p>
                                  <p className="text-xs text-slate-700 dark:text-slate-350 font-bold leading-relaxed">
                                    {prediction.improvement_tip}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Indian Board Specific Indicators Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* CBSE Admit Card Eligibility */}
                            <div className={cn(
                              "p-5 rounded-2xl border shadow-sm transition-all relative overflow-hidden flex flex-col justify-between min-h-[120px]",
                              formData.attendance >= 75
                                ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40"
                                : "bg-rose-50/30 dark:bg-rose-955/10 border-rose-200 dark:border-rose-900/40"
                            )}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">CBSE ADMIT CARD ELIGIBILITY</p>
                                  <h4 className={cn(
                                    "text-lg font-black tracking-tight mt-1.5",
                                    formData.attendance >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400 animate-pulse"
                                  )}>
                                    {formData.attendance >= 75 ? "ELIGIBILITY SECURED" : "WITHHELD AT BOARD"}
                                  </h4>
                                </div>
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0",
                                  formData.attendance >= 75 
                                    ? "bg-emerald-100/50 dark:bg-emerald-950/40 border-emerald-200/50 text-emerald-600" 
                                    : "bg-rose-100/50 dark:bg-rose-955/40 border-rose-200/50 text-rose-600"
                                )}>
                                  {formData.attendance >= 75 ? <CheckCircle2 className="w-4.5 h-4.5" /> : <ShieldAlert className="w-4.5 h-4.5 animate-bounce" />}
                                </div>
                              </div>
                              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-3">
                                {formData.attendance >= 75 
                                  ? `Attendance is ${formData.attendance}%, meeting the mandatory 75% CBSE Board criteria.` 
                                  : `Attendance is ${formData.attendance}%, falling below the critical 75% Board threshold.`
                                }
                              </p>
                            </div>

                            {/* Competitive Entrance Exam Readiness Forecast */}
                            <div className="bg-indigo-50/30 dark:bg-indigo-955/10 border border-indigo-200/50 dark:border-indigo-900/40 p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                                    {formData.stream === 'pcb' ? 'NEET MEDICAL STANDING' : 'JEE MAIN ENGINEERING STANDING'}
                                  </p>
                                  <h4 className="text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400 mt-1.5 whitespace-nowrap">
                                    {getOfflineEntranceEstimate().split(': ')[1]}
                                  </h4>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-indigo-100/50 dark:bg-indigo-950/40 border border-indigo-200/50 text-indigo-600 flex items-center justify-center shrink-0">
                                  <Award className="w-4.5 h-4.5" />
                                </div>
                              </div>
                              <p className="text-[10px] font-semibold text-slate-555 dark:text-slate-400 mt-3">
                                {formData.stream === 'pcb'
                                  ? "Estimate out of 720 Marks, calculated using PCB scores and study logs."
                                  : "Estimated percentile index, calculated using PCM scores and study logs."
                                }
                              </p>
                            </div>

                          </div>

                          {/* Interactive Multi-Chart Panel */}
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                                ACADEMIC VISUALIZATIONS
                              </h3>
                              
                              {/* Chart Tab Toggles */}
                              <div className="flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850">
                                <ChartTabButton label="Radar Profile" active={chartType === 'radar'} onClick={() => setChartType('radar')} />
                                <ChartTabButton label="Subject Estimator" active={chartType === 'subject'} onClick={() => setChartType('subject')} />
                                <ChartTabButton label="Vs Class Avg" active={chartType === 'comparison'} onClick={() => setChartType('comparison')} />
                              </div>
                            </div>
                            
                            {/* Charts */}
                            <div className="h-[280px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'radar' ? (
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                                    <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 700 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <RechartsTooltip 
                                      contentStyle={{ 
                                        borderRadius: '12px', 
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                                        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', 
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                                      }}
                                    />
                                    <Radar 
                                      name={formData.studentName} 
                                      dataKey="Student" 
                                      stroke="#6366f1" 
                                      fill="#6366f1" 
                                      fillOpacity={0.4} 
                                    />
                                    <Radar 
                                      name="Class Average" 
                                      dataKey="Average" 
                                      stroke="#94a3b8" 
                                      fill="#94a3b8" 
                                      fillOpacity={0.15} 
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                  </RadarChart>
                                ) : chartType === 'subject' ? (
                                  <BarChart data={estimatedSubjectsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800/80" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }} />
                                    <RechartsTooltip 
                                      contentStyle={{ 
                                        borderRadius: '12px', 
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                                        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                                        color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                                      }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                    <Bar name={`Est. ${formData.studentName} Marks`} dataKey="Score" fill={getStatusStyle(prediction.performance).fill} radius={[6, 6, 0, 0]} maxBarSize={30} />
                                    <Bar name="Class Bench Average" dataKey="Average" fill="#cbd5e1" className="dark:fill-slate-700" radius={[6, 6, 0, 0]} maxBarSize={30} />
                                  </BarChart>
                                ) : (
                                  <ComposedChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800/80" vertical={false} />
                                    <XAxis dataKey="category" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }} />
                                    <RechartsTooltip 
                                      contentStyle={{ 
                                        borderRadius: '12px', 
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                                        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                                        color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                                      }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                    <Bar name={`${formData.studentName}`} dataKey="Student" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={35} />
                                    <Line name="Class Benchmark" type="monotone" dataKey="ClassAverage" stroke="#e11d48" strokeWidth={3} activeDot={{ r: 6 }} />
                                  </ComposedChart>
                                )}
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Dynamic SWOT Analysis Panel */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Strengths */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                              <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Academic Strengths
                              </h4>
                              <ul className="space-y-2.5">
                                {(prediction.strengths || ["Consistent conceptual trends."]).map((st, i) => (
                                  <li key={i} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-2.5 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                                    {st}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Vulnerabilities */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                              <h4 className="text-xs font-black text-rose-600 dark:text-rose-455 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 animate-pulse" /> Focus Vulnerabilities
                              </h4>
                              <ul className="space-y-2.5">
                                {(prediction.weaknesses || ["Monitor board assignment deadlines."]).map((wk, i) => (
                                  <li key={i} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-2.5 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                                    {wk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Interactive Goal Settings Simulator */}
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                              <div>
                                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-indigo-500" /> Goal Simulator & Intervention
                                </h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Select target board division to compute necessary slider increments.</p>
                              </div>
                              
                              <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-850 overflow-x-auto">
                                <button 
                                  onClick={() => setTargetGrade('Distinction')}
                                  className={cn("px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap", targetGrade === 'Distinction' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-555 hover:text-slate-800")}
                                >
                                  Distinction
                                </button>
                                <button 
                                  onClick={() => setTargetGrade('First Division')}
                                  className={cn("px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap", targetGrade === 'First Division' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-555 hover:text-slate-800")}
                                >
                                  First Div
                                </button>
                                <button 
                                  onClick={() => setTargetGrade('Second Division')}
                                  className={cn("px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap", targetGrade === 'Second Division' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-555 hover:text-slate-800")}
                                >
                                  Second Div
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left side: Requirements */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Target Division Milestones</h5>
                                  {simulatedRequirement.achievable ? (
                                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-250 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md">Achieved</span>
                                  ) : (
                                    <span className="bg-amber-50 dark:bg-amber-955/40 text-amber-600 dark:text-amber-400 border border-amber-250 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md">Intervention Req.</span>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <SimRequirementRow label="Board Attendance" student={formData.attendance} target={simulatedRequirement.attendance} unit="%" />
                                  <SimRequirementRow label="Study & Entrance Prep" student={formData.study_hours} target={simulatedRequirement.study_hours} unit="h/day" />
                                  <SimRequirementRow label="Lab Journal Score" student={formData.assignment_score} target={simulatedRequirement.assignment_score} unit="/100" />
                                  <SimRequirementRow label="Internal Assessment" student={formData.internal_marks} target={simulatedRequirement.internal_marks} unit="/50" />
                                </div>
                              </div>

                              {/* Right side: Action Plan Checklist */}
                              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-955 p-4.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
                                <h5 className="text-[10px] font-extrabold text-slate-600 dark:text-slate-350 uppercase tracking-wider flex items-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Dynamic Intervention Roadmap
                                </h5>
                                
                                <div className="space-y-2.5">
                                  <SimulatorTaskRow 
                                    text={simulatedRequirement.changes.attendance} 
                                    checked={!!goalCheckedTasks[`${targetGrade}_att`]} 
                                    onClick={() => toggleTask(`${targetGrade}_att`)} 
                                  />
                                  <SimulatorTaskRow 
                                    text={simulatedRequirement.changes.study_hours} 
                                    checked={!!goalCheckedTasks[`${targetGrade}_study`]} 
                                    onClick={() => toggleTask(`${targetGrade}_study`)} 
                                  />
                                  <SimulatorTaskRow 
                                    text={simulatedRequirement.changes.assignment_score} 
                                    checked={!!goalCheckedTasks[`${targetGrade}_assign`]} 
                                    onClick={() => toggleTask(`${targetGrade}_assign`)} 
                                  />
                                  <SimulatorTaskRow 
                                    text={simulatedRequirement.changes.internal_marks} 
                                    checked={!!goalCheckedTasks[`${targetGrade}_internal`]} 
                                    onClick={() => toggleTask(`${targetGrade}_internal`)} 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions Panel */}
                          <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
                            <button 
                              onClick={handlePrint}
                              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <Printer className="w-4 h-4" /> Print Board Report
                            </button>
                            <button 
                              onClick={exportToCSV}
                              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-855 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <FileSpreadsheet className="w-4 h-4" /> Export CSV Report
                            </button>
                            <button 
                              onClick={exportToJSON}
                              className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100/60 dark:hover:bg-indigo-900/30 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <Download className="w-4 h-4" /> Download JSON
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}

            {/* Class View Classroom Roster View */}
            {activeTab === 'classview' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Headers */}
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Classroom Roster Analytics</h1>
                  <p className="text-xs text-slate-555 dark:text-slate-400 mt-1">Review student profiles, Board attendance regulations, and entrance prep standing across the batch.</p>
                </div>

                {/* Class Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ClassStatsCard 
                    title="Active Cohort" 
                    value={`${roster.length} Students`} 
                    sub="Class XII Science Section A" 
                    icon={<Users className="text-indigo-500 w-5 h-5" />} 
                  />
                  <ClassStatsCard 
                    title="Average Attendance" 
                    value={`${classAverages.attendance}%`} 
                    sub="CBSE Mandatory threshold: 75%" 
                    icon={<TrendingUp className="text-emerald-500 w-5 h-5" />} 
                  />
                  <ClassStatsCard 
                    title="Entrance Self-Study Avg" 
                    value={`${classAverages.studyHours}h/day`} 
                    sub="Average study dedication" 
                    icon={<Clock className="text-indigo-500 w-5 h-5" />} 
                  />
                  <ClassStatsCard 
                    title="High Risk Roster" 
                    value={`${classStatusDistribution.high} Students`} 
                    sub="Attendance < 75% or high-risk repeat" 
                    icon={<ShieldAlert className="text-rose-500 w-5 h-5 animate-pulse" />} 
                    highlight={classStatusDistribution.high > 0}
                  />
                </div>

                {/* Class Roster Main Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  
                  {/* Table Toolbar */}
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Search bar */}
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by student name or 8-digit Roll No..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    
                    {/* Filters Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-450">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                      </div>
                      
                      <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
                        <FilterRosterButton label="All" active={riskFilter === 'All'} onClick={() => setRiskFilter('All')} />
                        <FilterRosterButton label="Low Risk" active={riskFilter === 'Low Risk'} onClick={() => setRiskFilter('Low Risk')} />
                        <FilterRosterButton label="Med Risk" active={riskFilter === 'Medium Risk'} onClick={() => setRiskFilter('Medium Risk')} />
                        <FilterRosterButton label="High Risk" active={riskFilter === 'High Risk'} onClick={() => setRiskFilter('High Risk')} />
                      </div>
                    </div>
                  </div>

                  {/* Table content */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4">CBSE Roll Number</th>
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4 text-center">Stream</th>
                          <th className="px-6 py-4 text-center">Attendance</th>
                          <th className="px-6 py-4 text-center">Entrance Study</th>
                          <th className="px-6 py-4 text-center">Lab Journals</th>
                          <th className="px-6 py-4 text-center">Internals</th>
                          <th className="px-6 py-4 text-center">Class 11 Cumulative</th>
                          <th className="px-6 py-4 text-center">Risk Level</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredRoster.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="px-6 py-12 text-center text-slate-450 dark:text-slate-500 font-semibold">
                              No students found matching current search/filters.
                            </td>
                          </tr>
                        ) : (
                          filteredRoster.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-505 font-bold">
                                #{student.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{student.name}</div>
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">
                                {student.stream}
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-xs text-slate-700 dark:text-slate-350">
                                <span className={cn(student.attendance < 75 ? "text-rose-500 animate-pulse font-black" : "text-slate-700 dark:text-slate-350")}>
                                  {student.attendance}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-xs text-slate-700 dark:text-slate-350">
                                {student.study_hours}h/d
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-xs text-slate-700 dark:text-slate-350">
                                {student.assignment_score}/100
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-xs text-slate-700 dark:text-slate-350">
                                {student.internal_marks}/50
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-xs text-slate-700 dark:text-slate-350">
                                {student.previous_sem_score}/100
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border",
                                  student.riskStatus === 'Low Risk' && "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-200 dark:border-emerald-900/50",
                                  student.riskStatus === 'Medium Risk' && "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-200 dark:border-amber-900/50",
                                  student.riskStatus === 'High Risk' && "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border-rose-200 dark:border-rose-900/50"
                                )}>
                                  {student.riskStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => loadStudentFromClass(student)}
                                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-150/20 dark:border-indigo-900/20 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95 animate-pulse"
                                >
                                  Load & Assess <ArrowUpRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Predictions History tab */}
            {activeTab === 'history' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Academic Prediction Archive</h1>
                    <p className="text-xs text-slate-555 dark:text-slate-400 mt-1">Review, delete, or download student reports generated during this session.</p>
                  </div>
                  
                  {history.length > 0 && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={clearAllHistory}
                        className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-955/30 dark:hover:bg-rose-900/30 text-xs font-bold text-rose-600 dark:text-rose-450 border border-rose-200/50 dark:border-rose-900/40 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm animate-pulse"
                      >
                        <Trash2 className="w-4 h-4" /> Clear Local Session Logs
                      </button>
                      <button 
                        onClick={exportToCSV}
                        className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-855 flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <FileSpreadsheet className="w-4 h-4" /> Export CSV Report
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  {history.length === 0 ? (
                    <div className="p-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 mx-auto shadow-inner">
                        <History className="w-8 h-8 text-slate-350 dark:text-slate-650" />
                      </div>
                      <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">Prediction Logs Empty</h3>
                      <p className="text-xs text-slate-555 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">No predictions have been logged yet. Set parameters in Dashboard Analysis and click the Assess button.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Session Log ID</th>
                            <th className="px-6 py-4">Student (Roll No)</th>
                            <th className="px-6 py-4 text-center">Stream</th>
                            <th className="px-6 py-4">Input Parameter Metrics</th>
                            <th className="px-6 py-4">Model Prediction</th>
                            <th className="px-6 py-4 text-center">Confidence</th>
                            <th className="px-6 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {history.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-mono text-[10px] font-bold text-indigo-650 dark:text-indigo-400">#{item.id}</div>
                                <div className="text-[10px] text-slate-450 mt-0.5">{item.timestamp}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-bold text-xs text-slate-900 dark:text-white">{item.studentName}</div>
                                <div className="font-mono text-[10px] text-slate-450 mt-0.5">Roll No: #{item.rollNumber}</div>
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap font-mono text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase">
                                {item.stream}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1.5">
                                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold border border-slate-200/50 dark:border-slate-700/50">Att: {item.inputs.attendance}%</span>
                                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold border border-slate-200/50 dark:border-slate-700/50">Study: {item.inputs.study_hours}h/d</span>
                                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold border border-slate-200/50 dark:border-slate-700/50">Journals: {item.inputs.assignment_score}</span>
                                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold border border-slate-200/50 dark:border-slate-700/50">UT: {item.inputs.internal_marks}</span>
                                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold border border-slate-200/50 dark:border-slate-700/50">Class 11: {item.inputs.previous_sem_score}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={cn("px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border", getStatusStyle(item.result.performance).bg, getStatusStyle(item.result.performance).color, getStatusStyle(item.result.performance).border)}>
                                  {item.result.performance}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center font-black text-xs text-slate-850 dark:text-white">
                                {item.result.confidence}%
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button 
                                    onClick={() => {
                                      setFormData({
                                        studentName: item.studentName || "Aarav Sharma",
                                        rollNumber: item.rollNumber || "26681901",
                                        stream: item.stream || "pcm",
                                        attendance: item.inputs.attendance,
                                        study_hours: item.inputs.study_hours,
                                        assignment_score: item.inputs.assignment_score,
                                        internal_marks: item.inputs.internal_marks,
                                        previous_sem_score: item.inputs.previous_sem_score
                                      });
                                      setPrediction(item.result);
                                      setActiveTab('dashboard');
                                    }}
                                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-150/20 dark:border-indigo-900/20 text-[10px] font-bold flex items-center transition-colors cursor-pointer shadow-sm"
                                    title="Reload parameters to dashboard"
                                  >
                                    Load Data
                                  </button>
                                  <button 
                                    onClick={(e) => deleteHistoryItem(item.id, e)}
                                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Delete prediction"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* System Preferences Tab */}
            {activeTab === 'configuration' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Preferences</h1>
                  <p className="text-xs text-slate-555 dark:text-slate-400 mt-1">Configure evaluation algorithms, grading constraints, and interface controls.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grading Policy preferences */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <h3 className="text-xs font-black tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-500" />
                        MODEL ACCURACY & GRADING POLICIES
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Evaluation Difficulty Curve</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Strict mode caps board divisions and eligibility based on CBSE attendance thresholds.</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-955 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-850 shrink-0">
                          <button 
                            onClick={() => {
                              const newPrefs = { ...preferences, evaluationMode: 'standard' };
                              setPreferences(newPrefs);
                              localStorage.setItem('student_performance_preferences', JSON.stringify(newPrefs));
                            }}
                            className={cn("px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer", preferences.evaluationMode === 'standard' ? "bg-indigo-600 text-white shadow" : "text-slate-555")}
                          >
                            Standard
                          </button>
                          <button 
                            onClick={() => {
                              const newPrefs = { ...preferences, evaluationMode: 'strict' };
                              setPreferences(newPrefs);
                              localStorage.setItem('student_performance_preferences', JSON.stringify(newPrefs));
                            }}
                            className={cn("px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer", preferences.evaluationMode === 'strict' ? "bg-indigo-600 text-white shadow" : "text-slate-555")}
                          >
                            Strict
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Offline Fallback Rule Engine</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Applies high-fidelity heuristics when AWS SageMaker API endpoints are offline.</p>
                        </div>
                        <div 
                          className={cn("w-10 h-5.5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors shrink-0", preferences.localFallback ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-850")}
                          onClick={() => {
                            const newPrefs = { ...preferences, localFallback: !preferences.localFallback };
                            setPreferences(newPrefs);
                            localStorage.setItem('student_performance_preferences', JSON.stringify(newPrefs));
                          }}
                        >
                          <div className={cn("w-4.5 h-4.5 bg-white rounded-full transition-transform shadow-sm", preferences.localFallback ? "translate-x-4.5" : "")}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System information */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <h3 className="text-xs font-black tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-indigo-500" />
                        SYSTEM COMPILATION STATUS
                      </h3>
                    </div>
                    <div className="p-6 space-y-4 flex-1">
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="bg-slate-50 dark:bg-slate-955 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/50">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest">Active Core model</p>
                          <p className="text-slate-850 dark:text-white mt-1">Random Forest</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-955 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/50">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">Session logs</p>
                          <p className="text-slate-850 dark:text-white mt-1">{history.length} logged</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-955 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/50">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">Board Standard</p>
                          <p className="text-slate-850 dark:text-white mt-1">CBSE XII / HSC</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-955 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/50">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">API Server</p>
                          <p className="text-emerald-500 dark:text-emerald-450 mt-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span> Live HTTP
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Documentation Tab */}
            {activeTab === 'documentation' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">HSC & CBSE Board Guidelines</h1>
                  <p className="text-xs text-slate-555 dark:text-slate-400 mt-1">Review weight distributions, board eligibility criteria, and competitive entrance exam calculations.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-8 prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <h3 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                      <BookOpen className="w-5 h-5 text-indigo-500" />
                      Inference Engine Formula & Weights
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Student Performance AI maps classroom metrics onto final Board estimates. Attendance acts as a critical linear coefficient while daily self-study hours act as performance modifiers.
                    </p>
                    
                    <div className="bg-slate-50 dark:bg-slate-955 p-5 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-2">Subject Estimation Formula</h4>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                          <li><span className="font-bold text-slate-800 dark:text-white">Mathematics/CS:</span> 30% Class 11 Cumulative + 40% daily study bonus + 30% Internal assessments.</li>
                          <li><span className="font-bold text-slate-800 dark:text-white">Physics/Chemistry/Bio:</span> 32% Lab Journal file + 30% daily study log + 38% pre-board unit test standing.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-2">Outcome Division Cutoffs</h4>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                          <li><span className="font-bold text-slate-800 dark:text-emerald-450">First Class with Distinction:</span> Evaluated score of &ge; 75%</li>
                          <li><span className="font-bold text-slate-800 dark:text-sky-400">First Division:</span> Evaluated score between 60% and 74%</li>
                          <li><span className="font-bold text-slate-800 dark:text-amber-400">Second Division:</span> Evaluated score between 50% and 59%</li>
                          <li><span className="font-bold text-slate-800 dark:text-orange-400">Third Division / Pass Class:</span> Evaluated score between 35% and 49%</li>
                          <li><span className="font-bold text-slate-800 dark:text-rose-450">Essential Repeat (Fail):</span> Evaluated score below 35%</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                      <GraduationCap className="w-5 h-5 text-indigo-500" />
                      UN SDG 4 Quality Education & CBSE Criteria
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      By predicting student outcomes early, schools can prevent high failure rates and withholding of admit cards. Under **CBSE Rule 14**, students must complete 75% attendance to sit for Board exams; this platform provides educators with pre-emptive alerts to design corrective actions.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}

// Subcomponents helper methods
function SidebarItem({ icon, label, active, collapsed, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-250 font-bold text-xs cursor-pointer",
        active 
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
          : "text-slate-650 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("shrink-0", active ? "text-white" : "text-slate-400 dark:text-slate-500")}>
          {React.cloneElement(icon, { className: "w-4.5 h-4.5" })}
        </div>
        {!collapsed && <span>{label}</span>}
      </div>
      {badge && !collapsed && (
        <span className={cn(
          "py-0.5 px-2 rounded-full text-[9px] font-black tracking-wider",
          active ? "bg-white/20 text-white" : "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}

function MetricInput({ label, name, value, onChange, icon, min, max, suffix }: any) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          {icon} {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input 
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            className="w-16 h-8 px-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-550 w-12 truncate">{suffix}</span>
        </div>
      </div>
      <input 
        type="range" 
        name={name}
        min={min} 
        max={max} 
        value={value} 
        onChange={onChange}
        className="w-full"
      />
    </div>
  );
}

function ChartTabButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-3.5 py-2 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap",
        active 
          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80" 
          : "text-slate-500 dark:text-slate-455 hover:text-slate-850 dark:hover:text-slate-200"
      )}
    >
      {label}
    </button>
  );
}

function FilterRosterButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-3.5 py-2 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer",
        active 
          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80" 
          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
      )}
    >
      {label}
    </button>
  );
}

function SimRequirementRow({ label, student, target, unit }: any) {
  const isMet = student >= target;
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 text-xs font-semibold">
      <span className="text-slate-550 dark:text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-400">Current: {student}{unit}</span>
        <span className="text-slate-400">&rarr;</span>
        <span className={cn("font-bold", isMet ? "text-emerald-500" : "text-amber-500")}>
          Goal: {target}{unit}
        </span>
      </div>
    </div>
  );
}

function SimulatorTaskRow({ text, checked, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/60 cursor-pointer transition-all"
    >
      <div className="shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400">
        {checked ? (
          <div className="w-4 h-4 bg-indigo-600 rounded flex items-center justify-center text-white border border-indigo-600">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
        )}
      </div>
      <span className={cn("text-xs leading-relaxed font-semibold transition-all select-none", checked ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300")}>
        {text}
      </span>
    </div>
  );
}

function ClassStatsCard({ title, value, sub, icon, highlight }: any) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm transition-all relative overflow-hidden",
      highlight 
        ? "border-rose-250 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-955" 
        : "border-slate-200 dark:border-slate-800"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">{title}</p>
          <h4 className="text-2xl font-black tracking-tight text-slate-850 dark:text-white mt-1">{value}</h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-955 flex items-center justify-center border border-slate-200/40 dark:border-slate-800/40 shadow-sm shrink-0">
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-550 mt-2">{sub}</p>
    </div>
  );
}
