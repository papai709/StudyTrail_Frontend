import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, GraduationCap, Bell, MessageSquare, Camera, Edit2, 
  Image as ImageIcon, Mail, BookOpen, Zap, Flame, Share2, 
  UserPlus, Trophy, Star, Clock, FileText, Activity, Target, 
  CheckCircle2, Users, LogOut, Loader2, MoreVertical, X 
} from 'lucide-react';
import { useTheme } from './ThemeContext';

const Profile = () => {
  const navigate = useNavigate();
  // Ensure we are extracting the values correctly from your ThemeContext
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // NEW: Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // NEW: Connect Button State
  const [isConnected, setIsConnected] = useState(false);
  const [connectionHover, setConnectionHover] = useState(false);

  // Refs for hidden file inputs
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Student",
    email: "",
    bio: "",
    type: "college",
    instituteName: "",
    course: "",
    year: "",
    schoolName: "",
    grade: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=e2e8f0",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    stats: { 
      xp: 12450, 
      streak: 14, 
      resources: 32, 
      //1.Initiallize at 0,ready for backend data//
      connections: 0 
    }, 
    goalProgress: 75 
  });

  // Tab State
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserData = async () => {
      setTimeout(() => {
        const localUserStr = localStorage.getItem("mock_studyTrail_user");
        const user = localUserStr ? JSON.parse(localUserStr) : {
           fullName: "Demo Student",
           email: "demo@example.com",
           bio: "This is a local demo running without a backend.",
           schoolName: "Demo University",
           className: "Computer Science - Year 3",
           //simulating the backend returning the connections count//
           connectionsCount: 142 
        };
        
        setProfileData(prev => ({
          ...prev,
          name: user.fullName || "Student",
          email: user.email || "",
          bio: user.bio || prev.bio,
          avatar: user.profileImage || prev.avatar,
          cover: user.coverImage || prev.cover,
          type: user.className?.includes('-') ? 'college' : 'school',
          instituteName: user.schoolName || "",
          schoolName: user.schoolName || "",
          course: user.className?.includes('-') ? user.className.split(' - ')[0].trim() : "",
          year: user.className?.includes('-') ? user.className.split(' - ')[1].trim() : "",
          grade: !user.className?.includes('-') ? user.className : "",
          stats: {
            ...prev.stats,
            connections: user.connectionsCount || 0
          }
        }));
        setIsLoading(false);
      }, 500);
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileData(prev => ({ ...prev, [type]: url }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsEditing(false);
      setIsSaving(false);
    }, 800);
  };

  const handleLogout = async () => {
    localStorage.removeItem("mock_studyTrail_user");
    navigate("/");
  };

  // NEW: Handle Connect Button Click
  const handleConnectClick = () => {
    setIsConnected(!isConnected);
    // Simulating updating the connection count in state based on backend response
    setProfileData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        connections: isConnected ? prev.stats.connections - 1 : prev.stats.connections + 1
      }
    }));
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
         <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  // --- REUSABLE SIDEBAR WIDGETS ---
  // To avoid duplicating code, we extract the right-column widgets so we can render them in the desktop grid AND the mobile sidebar.
  
const GoalWidget = () => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = profileData.goalProgress;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5 w-full">
      <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Target className="text-indigo-500" size={20} />
        Weekly Goal
      </h3>

      <div className="flex flex-col items-center">

        <div className="relative w-40 h-40 flex items-center justify-center">

          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
            {/* Background */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={isDarkMode ? "#1f2937" : "#e5e7eb"}
              strokeWidth="12"
            />

            {/* Progress */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#6366F1"
              strokeWidth="12"
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference -
                (circumference * progress) / 100
              }
              style={{
                transition: "stroke-dashoffset 1s ease"
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {progress}%
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Completed
            </span>
          </div>

        </div>

        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6 px-4">
          You are almost there! Keep studying to complete your weekly target.
        </p>

      </div>
    </div>
  );
};

  const BadgesWidget = () => (
    <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="text-amber-500" size={20} /> Top Badges
        </h3>
        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-wider">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Trophy size={20} /></div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Top Contributor</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Moon size={20} /></div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Night Owl</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Zap size={20} /></div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Quick Learner</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Users size={20} /></div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Team Player</span>
        </div>
      </div>
    </div>
  );

  const MobileStatsWidget = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-center text-center">
        <Zap className="text-amber-500 mb-2" size={24} />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.stats.xp}</h3>
        <p className="text-xs text-slate-500">Total XP</p>
      </div>
      <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-center text-center">
        <Flame className="text-orange-500 mb-2" size={24} />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.stats.streak}</h3>
        <p className="text-xs text-slate-500">Day Streak</p>
      </div>
      <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-center text-center col-span-2">
        <Share2 className="text-emerald-500 mb-2" size={24} />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.stats.resources} Docs</h3>
        <p className="text-xs text-slate-500">Resources Shared</p>
      </div>
    </div>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 flex flex-col overflow-x-hidden selection:bg-indigo-500/30 relative">
        
        {/* PREMIUM AMBIENT GLOWS */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[100px] pointer-events-none z-0"></div>

        {/* 1. GLASS NAVBAR */}
        <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 dark:bg-[#050505]/90 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 py-3' : 'bg-transparent border-transparent py-3 md:py-5'}`}>
          <div className="max-w-7xl mx-auto px-3 md:px-6 flex flex-wrap items-center justify-between gap-y-3">
            
            {/* Logo */}
            <div className="flex items-center gap-1.5 md:gap-3 order-1 shrink-0">
              <div className="bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 p-1.5 md:p-2 rounded-xl shadow-sm transition-colors">
                <GraduationCap className="text-black dark:text-white w-4 h-4 md:w-6 md:h-6" />
              </div>
              <span className="text-lg md:text-2xl font-bold tracking-tight text-black dark:text-white">StudyTrail</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 md:gap-4 order-2 md:order-3 shrink-0">
              
              {/* FIX: Dark mode toggle - explicitly stop event propagation if necessary, but changing it from a button to div sometimes prevents strange router issues if inside a form. Using a simple onClick */}
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  toggleDarkMode();
                }} 
                className="cursor-pointer p-1.5 md:p-2.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-amber-300 hover:scale-110 active:scale-95 transition-all"
              >
                {isDarkMode ? <Sun size={14} className="md:w-4.5 md:h-4.5 pointer-events-none" /> : <Moon size={14} className="md:w-4.5 md:h-4.5 pointer-events-none" />}
              </div>
              
              <button className="hidden md:block p-1.5 md:p-2.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all relative">
                <Bell size={14} className="md:w-4.5 md:h-4.5" />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full border border-white dark:border-[#0A0A0A]"></span>
              </button>
              
              {/* FIX: Mobile Sidebar Toggle (Only visible on small screens) */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all"
              >
                <MoreVertical size={16} />
              </button>

              <div className="hidden md:block w-6 h-6 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm ml-0.5 md:ml-2 shrink-0">
                <img src={profileData.avatar} alt="Current User" className="w-full h-full object-cover bg-white" />
              </div>

              {/* LOGOUT BUTTON - Desktop Only */}
              <button 
                onClick={handleLogout}
                className="hidden md:flex bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm items-center gap-1 md:gap-2 shrink-0 ml-0.5"
              >
                <LogOut size={12} className="md:w-4 md:h-4" /> <span className="inline">Logout</span>
              </button>
            </div>

            {/* Links */}
            <div className="flex w-full md:w-auto items-center justify-center gap-4 md:gap-8 order-3 md:order-2 text-xs md:text-sm font-medium text-slate-500  md:border-transparent pt-2 md:pt-0">
              <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors">Home</a>
              <Link to="/Working" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Leaderboard
              </Link>
              <Link to="/feed" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Explore
              </Link>
            </div>
          </div>
        </nav>

        {/* --- MOBILE SIDEBAR --- */}
        {/* Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar Panel */}
        <div className={`fixed top-0 right-0 h-full w-[85%] sm:w-80 bg-white dark:bg-[#0A0A0A] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <img src={profileData.avatar} alt="Current User" className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">{profileData.name}</p>
                  <p className="text-xs text-slate-500">Student Dashboard</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-100 dark:bg-[#111] rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Sidebar Content */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Stats</h4>
            <MobileStatsWidget />
            
            <div className="space-y-6 mt-8">
              <GoalWidget />
              <BadgesWidget />
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111] text-slate-700 dark:text-slate-300 transition-colors">
                <Bell size={18} /> Notifications <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors font-semibold">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
        {/* --- END MOBILE SIDEBAR --- */}


        <main className="flex-1 relative z-10 pt-32 md:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* 2. HERO / PROFILE HEADER */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl md:rounded-[40px] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden mb-8">
              
              {/* Cover Photo */}
              <div className="h-56 md:h-72 w-full relative group">
                <img src={profileData.cover} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={(e) => handleImageUpload(e, 'cover')} />
                  <button onClick={() => coverInputRef.current?.click()} className="bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-medium text-sm border border-white/40 flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                    <ImageIcon size={18} /> Update Cover
                  </button>
                </div>
              </div>

              {/* Profile Details (Below Cover) */}
              <div className="px-6 md:px-12 pb-10 flex flex-col md:flex-row gap-6 md:gap-10">
                
                {/* Avatar */}
                <div className="relative -mt-20 md:-mt-24 inline-block group w-32 h-32 md:w-40 md:h-40 shrink-0">
                  <div className="w-full h-full rounded-full border-4 border-white dark:border-[#0A0A0A] bg-slate-100 dark:bg-slate-800 overflow-hidden relative shadow-xl">
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} />
                      <button onClick={() => avatarInputRef.current?.click()}>
                        <Camera className="text-white hover:scale-110 transition-transform" size={32} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 pt-2 md:pt-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between lg:justify-start gap-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{profileData.name}</h1>
                        <button 
                          onClick={() => isEditing ? saveProfile() : setIsEditing(true)} 
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isEditing ? <CheckCircle2 size={16} /> : <Edit2 size={16} />)}
                          {isSaving ? 'Saving...' : (isEditing ? 'Save' : 'Edit Profile')}
                        </button>
                      </div>

                      {/* Bio & Education fields */}
                      {isEditing ? (
                        <div className="space-y-4 animate-in fade-in duration-300 max-w-2xl">
                          <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold" placeholder="Full Name" />
                          <textarea name="bio" value={profileData.bio} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" rows="2" placeholder="Write your bio..." />
                          
                          <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" placeholder="Email address" />
                          
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm">
                              <input type="radio" name="type" value="college" checked={profileData.type === 'college'} onChange={handleInputChange} className="text-indigo-500" /> College
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input type="radio" name="type" value="school" checked={profileData.type === 'school'} onChange={handleInputChange} className="text-indigo-500" /> School
                            </label>
                          </div>

                          {profileData.type === 'college' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" name="instituteName" value={profileData.instituteName} onChange={handleInputChange} className="col-span-2 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" placeholder="College/University Name" />
                              <input type="text" name="course" value={profileData.course} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" placeholder="Course Name" />
                              <select name="year" value={profileData.year} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm">
                                <option value="Year 1">Year 1</option><option value="Year 2">Year 2</option><option value="Year 3">Year 3</option><option value="Year 4">Year 4</option>
                              </select>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" name="schoolName" value={profileData.schoolName} onChange={handleInputChange} className="col-span-2 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" placeholder="School Name" />
                              <select name="grade" value={profileData.grade} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm">
                                {[6,7,8,9,10,11,12].map(g => <option key={g} value={`Grade ${g}`}>Grade {g}</option>)}
                              </select>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in fade-in max-w-2xl">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                            {profileData.bio}
                          </p>
                          
                          <div className="pt-2">
                            <a href="#" className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                              {profileData.stats.connections} connections
                            </a>
                          </div>

                          <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-indigo-500" /> {profileData.email}
                            </div>
                            {profileData.type === 'college' ? (
                              <>
                                <div className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" /> {profileData.instituteName}</div>
                                <div className="flex items-center gap-2"><GraduationCap size={16} className="text-indigo-500" /> {profileData.course} {profileData.year ? `• ${profileData.year}` : ''}</div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" /> {profileData.schoolName || 'School Name Not Set'}</div>
                                <div className="flex items-center gap-2"><GraduationCap size={16} className="text-indigo-500" /> {profileData.grade || 'Grade Not Set'}</div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-black/5 dark:border-white/5">
                      {/* FIX: Improved Connect Button Logic */}
                      <button 
                        onClick={handleConnectClick}
                        onMouseEnter={() => setConnectionHover(true)}
                        onMouseLeave={() => setConnectionHover(false)}
                        className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                          isConnected 
                            ? (connectionHover ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 shadow-none' : 'bg-white dark:bg-[#111] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-none')
                            : 'text-blue-600 bg-linear-to-r from-indigo-600 to-cyan-500 hover:scale-105 active:scale-95 shadow-indigo-500/25'
                        }`}
                      >
                        {isConnected ? (
                          connectionHover ? <><X size={18} /> Disconnect</> : <><CheckCircle2 size={18} className="text-emerald-500" /> Connected</>
                        ) : (
                          <><UserPlus size={18} /> Connect</>
                        )}
                      </button>
                      
                      {/* FIX: Message Button uses Router Link */}
                      <Link 
                        to="/Working"
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 active:scale-95 transition-all border border-black/5 dark:border-white/10"
                      >
                        <MessageSquare size={18} /> Message
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. STATS CARDS (Desktop Only - Mobile handles this in sidebar now, but kept here if desired for tablet) */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5 flex items-center gap-5 hover:-translate-y-1 transition-transform shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Zap className="text-amber-500" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total XP</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData.stats.xp.toLocaleString()}</h3>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5 flex items-center gap-5 hover:-translate-y-1 transition-transform shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Flame className="text-orange-500" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Study Streak</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData.stats.streak} Days</h3>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5 flex items-center gap-5 hover:-translate-y-1 transition-transform shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Share2 className="text-emerald-500" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resources Shared</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData.stats.resources} Docs</h3>
                </div>
              </div>
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Tabs & Feed */}
              <div className="lg:col-span-8 space-y-6">
                {/* Tabs */}
                <div className="bg-white dark:bg-[#0A0A0A] p-2 rounded-2xl border border-black/5 dark:border-white/5 flex overflow-x-auto hide-scrollbar">
                  {['posts', 'achievements', 'activity'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 min-w-30 py-3 px-4 rounded-xl font-semibold text-sm capitalize transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                      {tab === 'posts' && <FileText size={16} />}
                      {tab === 'achievements' && <Trophy size={16} />}
                      {tab === 'activity' && <Activity size={16} />}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content Area */}
                <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl p-6 md:p-8 border border-black/5 dark:border-white/5 min-h-100">
                  {activeTab === 'posts' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="pb-6 border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={profileData.avatar} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10" alt="avatar"/>
                          <div>
                            <h4 className="font-bold text-sm">{profileData.name}</h4>
                            <span className="text-xs text-slate-400">2 hours ago</span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">Just finished creating a comprehensive cheat sheet for Data Structures and Algorithms! It covers Arrays, Trees, Graphs, and Dynamic Programming. Feel free to download and share. Let's ace those finals! 🚀📖</p>
                        <div className="bg-indigo-50 dark:bg-indigo-500/5 rounded-xl p-4 flex items-center justify-between border border-indigo-100 dark:border-indigo-500/10 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-500 text-white p-2 rounded-lg"><FileText size={20}/></div>
                            <div>
                              <p className="font-semibold text-sm text-indigo-900 dark:text-indigo-200">DSA_Complete_Guide.pdf</p>
                              <p className="text-xs text-indigo-500">2.4 MB PDF</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center text-slate-400 py-10">
                        <Activity className="mx-auto mb-3 opacity-50" size={32} />
                        <p className="text-sm">End of posts</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'achievements' && (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-20 animate-in fade-in">
                      <Trophy className="mx-auto mb-4 opacity-50 text-amber-500" size={48} />
                      <p>View all unlocked badges and milestones here.</p>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-20 animate-in fade-in">
                      <Clock className="mx-auto mb-4 opacity-50 text-indigo-500" size={48} />
                      <p>Recent interactions, comments, and study sessions.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Sidebar widgets (Hidden on mobile, shown in sidebar) */}
              <div className="hidden lg:block lg:col-span-4 space-y-6">
                <GoalWidget />
                <BadgesWidget />
              </div>
            </div>
          </div>
        </main>

        {/* 5. FOOTER */}
        <footer className="bg-transparent border-t border-black/5 dark:border-white/5 py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-linear-to-tr from-indigo-600 to-cyan-500 p-2 rounded-lg">
                  <GraduationCap className="text-black dark:text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">StudyTrail</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed font-light">
                Empowering students worldwide by combining community-driven learning with modern productivity tools.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><Link to="/Working" 
                 className="hover:text-slate-900 dark:hover:text-white transition-colors">Leaderboard</Link></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              &copy; 2026 StudyTrail. All rights reserved.
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-all">X</div>
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-all">in</div>
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-all">IG</div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Profile;