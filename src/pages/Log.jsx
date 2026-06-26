import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sun, Moon, GraduationCap, Mail, Lock, User, ArrowRight, ArrowLeft
} from "lucide-react";

export default function Log() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const initialMode = location.state?.mode || "login";

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [authMode, setAuthMode] = useState(initialMode);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatarFile: null,
  });

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (location.state?.mode) {
      setAuthMode(location.state.mode);
      setErrors({});
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        avatarFile: e.target.files[0],
      });
      if (errors.avatar) setErrors({ ...errors, avatar: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (authMode === "register") {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.username?.trim()) newErrors.username = "Username is required";
      if (!formData.avatarFile) newErrors.avatar = "Avatar image is required";
    }
    
    if (!formData.email) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (authMode === "register") {
          // --- Phase 2: Registration ---
          const formDataPayload = new FormData();
          formDataPayload.append("fullName", formData.name);
          formDataPayload.append("email", formData.email);
          formDataPayload.append("username", formData.username); 
          formDataPayload.append("password", formData.password);
          formDataPayload.append("avatar", formData.avatarFile); 

          const response = await fetch("http://localhost:8080/api/v1/user/register", {
            method: "POST",
            body: formDataPayload, 
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Registration failed on backend");
          }

          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setAuthMode("login"); 
            setFormData({ name: "", username: "", email: "", password: "", avatarFile: null });
          }, 1000); 

        } else {
          // --- Phase 3: Login ---
          const response = await fetch("http://localhost:8080/api/v1/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
            credentials: "include" // CRITICAL: This allows the browser to save your JWT cookies
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Invalid email or password");
          }

          // const loggedInUser = data.data.user;
          // const isProfileComplete = loggedInUser.bio && loggedInUser.schoolName;

          // Login Success
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setFormData({ name: "", username: "", email: "", password: "", avatarFile: null });
            navigate("/Signed"); // Redirect to Dashboard
          }, 1000); 
        }

      } catch (error) {
        setErrors({ email: error.message });
        console.error("API Error:", error);
      }
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] transition-colors duration-500 flex items-center justify-center p-6 selection:bg-indigo-500/30 overflow-hidden relative">

        {/* Floating Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-1000 group ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun size={20} className="group-hover:rotate-45 transition-transform duration-500 text-amber-300" />
          ) : (
            <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500 text-indigo-500" />
          )}
        </button>

        {/* Smooth Fade-in Wrapper */}
        <div className={`w-full max-w-5xl overflow-hidden rounded-4xl bg-white dark:bg-[#0A0A0A] shadow-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row relative z-10 min-h-150 transition-all duration-1000 ease-out transform-gpu ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'}`}>

          {/* Left Panel */}
          <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-10 -right-10 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                <GraduationCap size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">StudyTrail</h1>
            </div>

            <div className={`flex justify-center items-center flex-1 relative z-10 my-8 transition-all duration-1000 delay-300 ease-out transform-gpu ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <svg viewBox="0 0 400 400" className="w-full max-w-70 drop-shadow-2xl hover:scale-105 transition-transform duration-700">
                <circle cx="200" cy="180" r="120" fill="url(#glow)" opacity="0.8" />
                <defs>
                  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g className="origin-[200px_180px] animate-[spin_20s_linear_infinite]">
                  <circle cx="200" cy="180" r="110" stroke="white" strokeWidth="1" strokeDasharray="5 5" opacity="0.4" />
                  <circle cx="200" cy="180" r="130" stroke="white" strokeWidth="1" strokeDasharray="2 8" opacity="0.2" />
                </g>
                <g transform="translate(112, 95) scale(7)">
                  <path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.1a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 3.698a2 2 0 0 0 1.66 0z" fill="white" />
                  <path d="M22 10v6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </g>
                <text x="200" y="340" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" letterSpacing="-0.5">Empowering Students</text>
                <text x="200" y="370" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontWeight="500" letterSpacing="4" className="uppercase">Worldwide</text>
              </svg>
            </div>

            <p className="text-white/80 text-sm font-light relative z-10">
              Join the academic network built for collaboration and excellence.
            </p>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-7/12 p-8 md:p-14 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 uppercase tracking-widest">
                <ArrowLeft size={14} /> Back to Home
              </Link>

              <div className="md:hidden flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2 rounded-xl">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <span className="font-bold text-2xl dark:text-white">StudyTrail</span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {authMode === "login" ? "Welcome back." : "Create account."}
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 font-light">
                {authMode === "login" ? "Sign in to continue your journey." : "Join thousands of students globally."}
              </p>

              <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1.5 mb-8 border border-black/5 dark:border-white/5 relative">
                <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-black/5 dark:border-white/10 transition-transform duration-500 ease-out ${authMode === 'register' ? 'translate-x-[calc(50%+0.1px)]' : 'translate-x-0'}`}></div>
                <button onClick={() => { setAuthMode("login"); setErrors({}); }} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300 relative z-10 ${authMode === "login" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Log In</button>
                <button onClick={() => { setAuthMode("register"); setErrors({}); }} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300 relative z-10 ${authMode === "register" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Register</button>
              </div>

              <div className="relative min-h-62.5">
                
                {/* Register Form */}
                <form onSubmit={handleSubmit} className={`space-y-5 transition-all duration-500 absolute w-full ${authMode === 'register' ? 'opacity-100 translate-x-0 relative pointer-events-auto' : 'opacity-0 translate-x-8 absolute pointer-events-none'}`}>
                  
                  <div>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white ${errors.name ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.name}</p>}
                  </div>

                  <div>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white ${errors.username ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.username && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.username}</p>}
                  </div>

                  <div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white ${errors.password ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>}
                  </div>

                  <div>
                    <div className="relative group">
                      <input type="file" name="avatar" onChange={handleFileChange} accept="image/*" className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 ${errors.avatar ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.avatar && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.avatar}</p>}
                  </div>

                  <button type="submit" className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2">
                    Create Account <ArrowRight size={18} />
                  </button>
                </form>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className={`space-y-5 transition-all duration-500 absolute w-full ${authMode === 'login' ? 'opacity-100 translate-x-0 relative pointer-events-auto' : 'opacity-0 -translate-x-8 absolute pointer-events-none'}`}>
                  <div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#111] border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-slate-900 dark:text-white ${errors.password ? 'border-red-500' : 'border-black/10 dark:border-white/10'}`} />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>}
                  </div>

                  <button type="submit" className="w-full py-3.5 mt-2 rounded-xl font-bold text-black dark:text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2">
                    Sign In <ArrowRight size={18} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* Success State */}
        <div className={`fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`w-72 h-72 rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 shadow-[0_0_80px_rgba(99,102,241,0.6)] flex flex-col items-center justify-center text-white border-4 border-white/10 text-center p-6 transition-all duration-700 transform-gpu ${showSuccess ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <GraduationCap size={64} className="mb-2" />
            <h2 className="text-xl font-bold tracking-tight">
              {authMode === 'login' ? 'Welcome Back!' : 'Account Created!'}
            </h2>
            <p className="text-white/80 tracking-widest uppercase text-xs mt-2 font-medium">
              {authMode === 'login' ? 'Logging you in...' : 'Redirecting...'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}