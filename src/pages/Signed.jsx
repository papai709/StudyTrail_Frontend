import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  Sun, Moon, ArrowRight, BookOpen, Users, Target, 
  Award, Sparkles, GraduationCap, Globe, LogOut, Loader2, AlertCircle
} from 'lucide-react';

const Signed = () => {
  const navigate = useNavigate();
  
  // Auth States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- PHASE 4: SESSION MANAGEMENT ---
  useEffect(() => {
    const checkSession = async () => {
      try {
        // const response = await fetch("http://localhost:8080/api/v1/user/current-user", {
        //   method: "GET",
        //   credentials: "include" // CRITICAL: Sends the JWT cookies to your verifyJWT middleware
        // });

        // if (response.ok) {
        //   const result = await response.json();
        //   setUser(result.data); // Set the MongoDB user object to state
        // } else {
        //   // If the token is invalid or expired, kick them back to login
        //   navigate("/log"); 
        // }
      } catch (error) {
        // console.error("Session check failed:", error);
        // navigate("/log");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  // --- PHASE 5: SECURE LOGOUT ---
  const handleLogout = async () => {
    try {
      // const response = await fetch("http://localhost:8080/api/v1/user/logout", {
      //   method: "POST",
      //   credentials: "include" // Identifies which user is logging out
      // });

      // if (response.ok) {
      //   setUser(null);
      //   navigate("/"); // Redirects to Home
      // } else {
      //   setError("Failed to log out. Please try again.");
      // }
    } catch (error) {
      // console.error("Logout failed:", error);
      // setError("Failed to log out. Please try again.");
    }
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

  // UI: Error State
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

  // UI: Loading State
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

        {/* 1. GLASS NAVBAR WITH DARK MODE AND USER INFO */}
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
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-amber-300 hover:scale-110 active:scale-95 transition-all"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Updated: Pulling fullName from your backend */}
              <div className="hidden sm:flex items-center gap-3 pr-2">
                {user?.avatar && (
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-white/10" />
                )}
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Hi, {user?.fullName || "Student"}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        {/* 2. HERO SECTION */}
        <main className="flex-1 relative z-10 pt-32">
          <section className="relative pb-24 px-6 lg:pb-32 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center mt-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md">
                <Sparkles size={14} /> You're Logged In
              </div>
              <h1 className="text-6xl lg:text-[80px] font-extrabold text-slate-900 dark:text-white tracking-tighter mb-8 leading-[1.05]">
                Welcome back, <br className="hidden sm:block" />
                {/* Updated: Pulling fullName from your backend */}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500">
                  {user?.fullName || "Student"}
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Ready to crush your goals today? Connect with peers, share resources, and track your study progress.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full text-base font-semibold hover:scale-105 transition-all duration-300 shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2">
                  Go to Dashboard <ArrowRight size={18} />
                </button>
                <button className="bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 px-8 py-4 rounded-full text-base font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2">
                  <Globe size={20} /> Explore Community
                </button>
              </div>
            </div>
          </section>

          {/* 3. MOCKUP SECTION */}
          <section className="px-6 pb-32 max-w-6xl mx-auto relative perspective-1000">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-[100px] -z-10 rounded-full"></div>
            
            <div className="rounded-2xl md:rounded-4xl p-px bg-gradient-to-b from-black/10 to-transparent dark:from-white/20 dark:to-white/5 shadow-2xl shadow-indigo-500/10 transform-gpu rotate-x-2 hover:rotate-x-0 transition-transform duration-700 relative overflow-hidden">
                <div className="bg-[#FDFDFD] dark:bg-[#0A0A0A] rounded-[23px] md:rounded-[31px] aspect-video sm:aspect-[21/9] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-14 border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-2 bg-white/50 dark:bg-black/50 backdrop-blur-md z-20">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>
                
                <GraduationCap className="text-black dark:text-white opacity-20 mb-4 mt-10" size={64} />
                <p className="font-semibold text-lg max-w-md z-10">
                  "This section displays your active courses, grades, and upcoming assignments."
                </p>
              </div>
            </div>
          </section>

          {/* 4. FEATURES GRID */}
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

      </div>
    </div>
  );
};

export default Signed;