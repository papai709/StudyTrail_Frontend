import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  Sun, Moon, ArrowRight, BookOpen, Users, Target, 
  Award, Sparkles, GraduationCap, Globe, LogOut, Loader2, AlertCircle,
  Camera, Edit2, Image as ImageIcon, X, Check, UploadCloud
} from 'lucide-react';
import { useTheme } from './ThemeContext';

const Signed = () => {
  const navigate = useNavigate();
  const handleContinue = (e) => {
    e.preventDefault();
    console.log("Saving data...");
    navigate("/Profile"); 
  };
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Auth States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Profile Setup States
  const [educationLevel, setEducationLevel] = useState('school'); 
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  
  // Create a reference for our hidden file input
  const coverInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    schoolName: '',
    grade: '',
    instituteName: '',
    course: '',
    year: '',
    bio: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop'
  });

  // Mock Databases for Selection
  const avatarOptions = [1, 2, 3, 4, 5, 6, 7, 8].map(i => `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}&backgroundColor=e2e8f0`);
  
  // Beautiful preset cover options
  const coverOptions = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop', 
  ];

  const collegeCourses = [
    { name: "B.Tech (Bachelor of Technology)", duration: 4 },
    { name: "B.E. (Bachelor of Engineering)", duration: 4 },
    { name: "B.A. Hons (Bachelor of Arts)", duration: 3 },
    { name: "B.Sc (Bachelor of Science)", duration: 3 },
    { name: "B.Com (Bachelor of Commerce)", duration: 3 },
    { name: "BBA (Bachelor of Business Admin)", duration: 3 },
    { name: "BCA (Bachelor of Computer Apps)", duration: 3 },
    { name: "MBBS (Medicine & Surgery)", duration: 5 },
    { name: "B.Arch (Bachelor of Architecture)", duration: 5 },
    { name: "LLB (Bachelor of Laws)", duration: 3 },
    { name: "M.Tech (Master of Technology)", duration: 2 },
    { name: "MBA (Master of Business Admin)", duration: 2 },
    { name: "M.Sc (Master of Science)", duration: 2 },
    { name: "MCA (Master of Computer Application)", duration: 2 },
  ];

  const selectedCourseObj = collegeCourses.find(c => c.name === profileData.course);
  const maxYears = selectedCourseObj ? selectedCourseObj.duration : 0;
  const yearOptions = Array.from({ length: maxYears }, (_, i) => i + 1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try{
      setUser(null);
      navigate("/");
    }catch(error){
      setError("Failed to log out. Please try again.");
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle local file upload (from Mobile OR PC)
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, cover: imageUrl });
      setShowCoverModal(false); // Close modal after successful upload
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Profile Data:", profileData);
  };

  const features = [
    {
      icon: <Users className="text-violet-500" size={24} />,
      title: "Collaborative Social Feed",
      description: "Connect with peers, ask questions, and share your 'aha!' moments in a dedicated academic timeline."
    },
    {
      icon: <BookOpen className="text-cyan-500" size={24} />,
      title: "Resource Sharing",
      description: "Upload notes, flashcards, and study guides. Build your repository while helping others succeed."
    },
    {
      icon: <Target className="text-emerald-500" size={24} />,
      title: "Weekly Goal Tracking",
      description: "Set personalized study targets and watch your progress ring close as you complete tasks."
    },
    {
      icon: <Award className="text-amber-500" size={24} />,
      title: "Gamified Achievements",
      description: "Earn XP, maintain study streaks, and unlock exclusive badges like 'Top Contributor' and 'Night Owl'."
    }
  ];

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'dark bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
        <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl flex flex-col items-center border border-red-200 dark:border-red-500/20 text-center">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Something went wrong</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 flex flex-col overflow-x-hidden selection:bg-indigo-500/30 relative">
        
        {/* PREMIUM AMBIENT GLOWS */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[100px] pointer-events-none z-0"></div>

        {/* 1. GLASS NAVBAR */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 dark:bg-[#050505]/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 py-3' : 'bg-transparent border-transparent py-5'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 p-2 rounded-xl shadow-sm transition-colors">
                <GraduationCap className="text-black dark:text-white" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black dark:text-white">StudyTrail</span>
            </div>
            
            <div className="hidden md:flex gap-8 text-slate-500 dark:text-slate-400 font-medium text-sm">
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">Stories</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-amber-300 hover:scale-110 active:scale-95 transition-all"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="hidden sm:flex items-center gap-3 pr-2">
                <img src={profileData.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-white/10 bg-white" />
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Hi, {user?.fullName || "Student"}
                </span>
              </div>

              <button 
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 relative z-10 pt-32">
          
          {/* 2. PROFILE SETUP SECTION */}
          <section className="px-6 pb-24 max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
                <Sparkles size={14} /> Step 1 of 2
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-4">
                Welcome, Student. <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500">
                  Let's set up your profile.
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Define your academic identity to get tailored resources, connect with classmates, and track your specific goals.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl md:rounded-[40px] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden">
              
              {/* Cover Photo */}
              <div className="h-48 md:h-64 w-full relative group">
                <img src={profileData.cover} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  
                  {/* Button opens the modal instead of input directly */}
                  <button 
                    onClick={() => setShowCoverModal(true)} 
                    className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium text-sm border border-white/40 flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
                  >
                    <ImageIcon size={16} /> Edit Cover
                  </button>

                </div>
              </div>

              <div className="px-6 md:px-12 pb-12 relative">
                {/* Avatar */}
                <div className="relative -mt-16 md:-mt-20 mb-8 inline-block group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#0A0A0A] bg-slate-100 dark:bg-slate-800 overflow-hidden relative shadow-lg">
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                      <Camera className="text-white" size={32} />
                    </div>
                  </div>
                  <button onClick={() => setShowAvatarModal(true)} className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-500 rounded-full text-white flex items-center justify-center border-4 border-white dark:border-[#0A0A0A] hover:bg-indigo-600 transition-colors shadow-md">
                    <Edit2 size={16} />
                  </button>
                </div>

                {/* Form Type Toggle Slider */}
                <div className="bg-slate-100 dark:bg-[#111] p-1.5 rounded-2xl flex relative mb-10 border border-black/5 dark:border-white/5">
                  <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-black/5 dark:border-white/10 transition-transform duration-500 ease-out ${educationLevel === 'college' ? 'translate-x-[calc(50%+0.1px)]' : 'translate-x-0'}`}></div>
                  
                  <button 
                    onClick={() => setEducationLevel('school')} 
                    className={`flex-1 relative z-10 py-4 flex flex-col items-center justify-center transition-colors duration-300 ${educationLevel === 'school' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <span className="font-bold text-base md:text-lg">School Student</span>
                    <span className="text-xs font-medium opacity-70 mt-1">Primary/Secondary Education</span>
                  </button>
                  
                  <button 
                    onClick={() => setEducationLevel('college')} 
                    className={`flex-1 relative z-10 py-4 flex flex-col items-center justify-center transition-colors duration-300 ${educationLevel === 'college' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <span className="font-bold text-base md:text-lg">College / University</span>
                    <span className="text-xs font-medium opacity-70 mt-1">Higher Education Institutions</span>
                  </button>
                </div>

                {/* Form Input Section */}
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  
                  {/* SCHOOL FORM */}
                  {educationLevel === 'school' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">School Name <span className="text-red-500">*</span></label>
                        <input type="text" name="schoolName" required value={profileData.schoolName} onChange={handleProfileChange} placeholder="e.g. Lincoln High School" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Class / Grade <span className="text-red-500">*</span></label>
                        <select name="grade" required value={profileData.grade} onChange={handleProfileChange} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white appearance-none">
                          <option value="" disabled>Select your grade</option>
                          {[6, 7, 8, 9, 10, 11, 12].map(g => (
                            <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* COLLEGE FORM */}
                  {educationLevel === 'college' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Institute / University Name <span className="text-red-500">*</span></label>
                        <input type="text" name="instituteName" required value={profileData.instituteName} onChange={handleProfileChange} placeholder="e.g. Stanford University" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Course Name <span className="text-red-500">*</span></label>
                        <select name="course" required value={profileData.course} onChange={(e) => { handleProfileChange(e); setProfileData(prev => ({...prev, course: e.target.value, year: ''})); }} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white appearance-none">
                          <option value="" disabled>Select your course</option>
                          {collegeCourses.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Current Year <span className="text-red-500">*</span></label>
                        <select name="year" required value={profileData.year} onChange={handleProfileChange} disabled={!profileData.course} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
                          <option value="" disabled>{profileData.course ? 'Select current year' : 'Select a course first'}</option>
                          {yearOptions.map(y => (
                            <option key={y} value={`Year ${y}`}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* BIO (Shared) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">Bio (Optional)</label>
                    <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} placeholder="Tell your peers a bit about yourself, your goals, or your study habits..." rows="3" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white resize-none"></textarea>
                  </div>

                  <div className="pt-6">
                   <button 
                  type="button" 
                  onClick={handleContinue}
                  className="w-full md:w-auto px-10 py-4 rounded-xl font-bold text-black dark:text-white bg-linear-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2 ml-auto">
                  Continue to Profile <ArrowRight size={18} />
                  </button>
                  </div>
                </form>

              </div>
            </div>
          </section>

          {/* 3. FEATURES GRID */}
          <section id="features" className="py-32 border-y border-black/5 dark:border-white/5 backdrop-blur-3xl relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20 max-w-2xl mx-auto">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter mb-6">Your Active Tools</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Everything you need to track progress and study effectively.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#0A0A0A] p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group relative overflow-hidden cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-light">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>

        {/* 4. FOOTER */}
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

        {/* MODALS */}
        
        {/* Avatar Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111] w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl border border-black/5 dark:border-white/10 animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowAvatarModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Choose Avatar</h3>
              <div className="grid grid-cols-4 gap-4">
                {avatarOptions.map((opt, i) => (
                  <div key={i} onClick={() => { setProfileData({...profileData, avatar: opt}); setShowAvatarModal(false); }} className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 ${profileData.avatar === opt ? 'border-indigo-500' : 'border-transparent'}`}>
                    <img src={opt} alt="Avatar option" className="w-full h-auto bg-slate-100 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cover Photo Modal */}
        {showCoverModal && (
          <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111] w-full max-w-2xl rounded-3xl p-6 md:p-8 relative shadow-2xl border border-black/5 dark:border-white/10 animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowCoverModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white z-10 bg-black/5 dark:bg-white/5 rounded-full p-2 transition-colors">
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Update Cover Photo</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Upload your own image or choose a theme.</p>

              {/* Upload Button */}
              <div className="mb-8">
                 {/* Hidden input moved here */}
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   ref={coverInputRef} 
                   onChange={handleCoverUpload} 
                 />
                 <button 
                   onClick={() => coverInputRef.current?.click()} 
                   className="w-full py-8 border-2 border-dashed border-indigo-500/50 hover:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors group"
                 >
                    <div className="w-12 h-12 bg-white dark:bg-black/20 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <span className="font-bold text-lg">Upload from Device</span>
                    <span className="text-xs font-medium opacity-70 mt-1">Supports JPG, PNG (Max 5MB)</span>
                 </button>
              </div>

              {/* Inbuilt Presets */}
              <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Or choose a preset</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {coverOptions.map((opt, i) => (
                      <div key={i} onClick={() => { setProfileData({...profileData, cover: opt}); setShowCoverModal(false); }} className={`cursor-pointer h-24 md:h-32 rounded-xl overflow-hidden border-4 relative transition-all hover:scale-105 ${profileData.cover === opt ? 'border-indigo-500' : 'border-transparent'}`}>
                        <img src={opt} alt="Cover option" className="w-full h-full object-cover" />
                        {profileData.cover === opt && (
                          <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1.5 text-white shadow-md">
                            <Check size={14} strokeWidth={3} />
                          </div>
                          
                        )}
                      </div>
                    ))}
                  </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Signed;