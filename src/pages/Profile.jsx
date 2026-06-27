import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, GraduationCap, Bell, MessageSquare, Camera, Edit2, 
  Image as ImageIcon, UploadCloud, Mail, BookOpen, Zap, 
  Flame, Share2, UserPlus, Trophy, Star, Clock, FileText,
  Activity, Target, CheckCircle2, Users, LogOut
} from 'lucide-react';
import { useTheme } from './ThemeContext';

const Profile = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  
  // Refs for hidden file inputs
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Student",
    email: "Guest12345@example.com",
    bio: "Passionate about computer science and building tools for students. Always up for a late-night coding session!",
    type: "college", // 'school' or 'college'
    instituteName: "Stanford University",
    course: "MCA (Masters of Computer Applications)",
    year: "Year 2",
    schoolName: "",
    grade: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=e2e8f0",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    stats: { xp: 12450, streak: 14, resources: 32 },
    goalProgress: 75 // percentage
  });

  // Tab State
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers for image uploads (Triggered from PC or Mobile)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, [type]: url }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    // In a real app, API call to save would go here
    console.log("Profile Saved:", profileData);
  };

  const handleLogout = () => {
    // Add any global state/auth clearing logic here if needed
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 flex flex-col overflow-x-hidden selection:bg-indigo-500/30 relative">
        
        {/* PREMIUM AMBIENT GLOWS */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[100px] pointer-events-none z-0"></div>

        {/* 1. GLASS NAVBAR */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 dark:bg-[#050505]/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 py-3' : 'bg-transparent border-transparent py-5'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 p-2 rounded-xl shadow-sm transition-colors">
                <GraduationCap className="text-black dark:text-white" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black dark:text-white hidden sm:block">StudyTrail</span>
            </div>
            
            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8 text-slate-500 dark:text-slate-400 font-medium text-sm">
              <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors">Home</a>
              <a href="#leaderboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Leaderboard</a>
              <a href="#explore" className="hover:text-slate-900 dark:hover:text-white transition-colors">Explore</a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-amber-300 hover:scale-110 active:scale-95 transition-all">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button className="p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0A0A0A]"></span>
              </button>
              
              <button className="p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all">
                <MessageSquare size={18} />
              </button>

              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm ml-2">
                <img src={profileData.avatar} alt="Current User" className="w-full h-full object-cover bg-white" />
              </div>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-2 sm:px-4 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2 ml-1"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 relative z-10 pt-24 pb-20">
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
                      {/* Name & Edit Toggle */}
                      <div className="flex items-center justify-between lg:justify-start gap-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{profileData.name}</h1>
                        <button onClick={() => isEditing ? saveProfile() : setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                          {isEditing ? <><CheckCircle2 size={16} /> Save</> : <><Edit2 size={16} /> Edit Profile</>}
                        </button>
                      </div>

                      {/* Bio & Education fields */}
                      {isEditing ? (
                        <div className="space-y-4 animate-in fade-in duration-300 max-w-2xl">
                          <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold" placeholder="Full Name" />
                          <textarea name="bio" value={profileData.bio} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" rows="2" placeholder="Write your bio..." />
                          
                          <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/50 text-sm" placeholder="Email address" />
                          
                          {/* Education Toggle inside Edit */}
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
                          <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-indigo-500" /> {profileData.email}
                            </div>
                            {profileData.type === 'college' ? (
                              <>
                                <div className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" /> {profileData.instituteName}</div>
                                <div className="flex items-center gap-2"><GraduationCap size={16} className="text-indigo-500" /> {profileData.course} &bull; {profileData.year}</div>
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
                      <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-black dark:text-white bg-linear-to-r from-indigo-600 to-cyan-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/25">
                        <UserPlus size={18} /> Connect
                      </button>
                      <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 active:scale-95 transition-all border border-black/5 dark:border-white/10">
                        <MessageSquare size={18} /> Message
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* 3. STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

              {/* RIGHT COLUMN: Sidebar widgets */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Goal Progress Widget */}
                <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Target className="text-indigo-500" size={20} /> Weekly Goal
                  </h3>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
                        {/* Circle Circumference = 2 * PI * r = 2 * 3.1415 * 70 = 439.8 */}
                        <circle 
                          cx="80" cy="80" r="70" 
                          fill="transparent" 
                          stroke="url(#gradient)" 
                          strokeWidth="12" 
                          strokeLinecap="round"
                          strokeDasharray="439.8" 
                          strokeDashoffset={439.8 - (439.8 * profileData.goalProgress) / 100} 
                          className="transition-all duration-1000 ease-out drop-shadow-md" 
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{profileData.goalProgress}%</span>
                        <span className="text-xs font-medium text-slate-500">Completed</span>
                      </div>
                    </div>
                    <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6 px-4">
                      You are almost there! Keep studying to complete your weekly target.
                    </p>
                  </div>
                </div>

                {/* Achievements Highlights Widget */}
                <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-black/5 dark:border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Star className="text-amber-500" size={20} /> Top Badges
                    </h3>
                    <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-wider">View All</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Trophy size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Top Contributor</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Moon size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Night Owl</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Zap size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Quick Learner</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#111] p-4 rounded-2xl flex flex-col items-center text-center border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Users size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Team Player</span>
                    </div>
                  </div>
                </div>

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
                  <GraduationCap className="text-white" size={20} />
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
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Leaderboard</a></li>
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