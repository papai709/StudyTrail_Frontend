import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
=======
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
import '../Feed.css';
import { useTheme } from './ThemeContext';
import {
  Home, BookOpen, Trophy, Compass, MessageSquare, Search,
  Image as ImageIcon, FileText, Send, Heart, Share2, X, Check,
  Download, Flame, Clock, TrendingUp, Sparkles, CheckCircle2,
  Sun, Moon, Eye, GraduationCap, Loader2
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home', targetRoute: '/feed' },
  { id: 'explore', label: 'Explore', icon: 'Compass', targetRoute: '/explore' },
  { id: 'resources', label: 'Resources', icon: 'BookOpen', targetRoute: '/resources' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy', targetRoute: '/leaderboard' }
];

export const POST_FILTERS = ['All', 'Recent', 'Most Liked', 'My Batch'];





const REACTION_OPTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '💡', label: 'Insight' },
  { emoji: '❤️', label: 'Love' }
];

export default function Feed() {
<<<<<<< HEAD
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // Backend States
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI States
=======
  // 1. Hook up the global Theme Context
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [posts, setPosts] = useState(INITIAL_POSTS);
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Local UI-only states (for visual interactions)
  const [comments, setComments] = useState({});
  const [newCommentTexts, setNewCommentTexts] = useState({});
  const [commentsOpen, setCommentsOpen] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [imageLightbox, setImageLightbox] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('/feed');
  const [reactionPickerPostId, setReactionPickerPostId] = useState(null);


  const mediaInputRef = useRef(null);
  const docInputRef = useRef(null);
  const reactionHoldTimerRef = useRef(null);
  const suppressClickRef = useRef(false);

  // --- 1. Fetch Real Data on Mount ---
  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      try {
        const userRes = await fetch("http://localhost:8090/api/v1/user/current-user", { credentials: "include" });
        if (!userRes.ok) {
          navigate("/log");
          return;
        }
        const userData = await userRes.json();
        setCurrentUser(userData.data);

        const postsRes = await fetch("http://localhost:8090/api/v1/post", { credentials: "include" });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          // Initialize local likes count for the UI to work
          const mappedPosts = postsData.data.map(p => ({
            ...p,
            likesCount: Math.floor(Math.random() * 10), // Mock likes for now until you build the backend for it
            commentsCount: 0,
            isLikedByMe: false
          }));
          setPosts(mappedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDataAndPosts();
  }, [navigate]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message) => setToastMessage(message);

  const handleNavigation = (route) => {
    setCurrentRoute(route);
    if (route === '/explore' || route === '/feed') {
      setCurrentFilter('All');
      setSearchQuery('');
<<<<<<< HEAD
=======
      showToast(route === '/explore' ? 'Redirected to Explore Feed!' : 'Navigated to Home Feed');
    } else {
      showToast(`Mapsd to ${route} (Simulated Route Change)`);
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
    }
  };


  const extractHashtag = (text) => {
    if(!text) return '#GeneralStudy';
    const match = text.match(/#\w+/);
    return match ? match[0] : '#GeneralStudy';
  };

  // --- 2. Filter Real Posts ---
  const filteredPosts = posts.filter(post => {
    const tag = extractHashtag(post.content);
    const content = post.content || '';
    const authorName = post.owner?.fullName || '';
    
    const matchesSearch = 
      content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (currentFilter === 'All') return matchesSearch;
    if (currentFilter === 'Recent') return matchesSearch;
    if (currentFilter === 'Most Liked') return matchesSearch && post.likesCount > 5;
    
    return matchesSearch;
  });

  const sortedAndFilteredPosts = [...filteredPosts].sort((a, b) => {
    if (currentFilter === 'Most Liked') return b.likesCount - a.likesCount;
    return 0; // Keep newest first (already sorted by backend)
  });

  const handleLikeToggle = (postId, reaction = null) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post._id !== postId) return post;
        if (reaction) {
          return {
            ...post,
            isLikedByMe: true,
            likesCount: post.isLikedByMe ? post.likesCount : post.likesCount + 1,
            reactionEmoji: reaction.emoji
          };
        }
        const isLiked = !post.isLikedByMe;
        return {
          ...post,
          isLikedByMe: isLiked,
          likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          reactionEmoji: isLiked ? post.reactionEmoji : ''
        };
      })
    );
  };

  const startReactionHold = (postId) => {
    if (reactionHoldTimerRef.current) clearTimeout(reactionHoldTimerRef.current);
    suppressClickRef.current = false;
    reactionHoldTimerRef.current = setTimeout(() => {
      setReactionPickerPostId(postId);
      suppressClickRef.current = true;
    }, 400);
  };

  const cancelReactionHold = () => {
    if (reactionHoldTimerRef.current) clearTimeout(reactionHoldTimerRef.current);
    suppressClickRef.current = false;
  };

  const handleLikeButtonClick = (postId, event) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }
    cancelReactionHold();
    handleLikeToggle(postId);
  };

  const handleReactionSelect = (postId, reaction) => {
    setReactionPickerPostId(null);
    cancelReactionHold();
    handleLikeToggle(postId, reaction);
  };

  const triggerMediaUpload = () => mediaInputRef.current?.click();
  const triggerDocUpload = () => docInputRef.current?.click();

  const handleFileChange = (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    let fileType = 'document';

    if (category === 'media') {
      if (file.type.startsWith('image/')) fileType = 'image';
      else if (file.type.startsWith('video/')) fileType = 'video';
    }

    const previewUrl = fileType === 'image' || fileType === 'video' ? URL.createObjectURL(file) : undefined;

    setSelectedFile({
      fileObj: file,
      name: file.name,
      type: fileType,
      previewUrl,
      size: sizeStr
    });
    showToast(`File Selected: ${file.name}`);
  };

  const removeAttachment = () => {
    if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
    setSelectedFile(null);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
    if (docInputRef.current) docInputRef.current.value = '';
  };

  // --- 3. Handle Real Post Submission ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedFile) {
      showToast('Error: Post update cannot be empty!');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", newPostText);
      
      if (selectedFile) {
        formData.append("attachments", selectedFile.fileObj);
      }

      const response = await fetch("http://localhost:8090/api/v1/post", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        // Seed the new post with UI fields
        const newPost = {
          ...result.data,
          likesCount: 0,
          commentsCount: 0,
          isLikedByMe: false
        };
        setPosts([newPost, ...posts]);
        setNewPostText('');
        setSelectedFile(null);
        showToast('Success: Study update posted!');
      }
    } catch (error) {
      console.error(error);
      showToast('Error: Failed to post update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = (postId) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentUser?.fullName,
      avatar: currentUser?.profileImage,
      text: text.trim(),
      time: 'Just now'
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post._id === postId) return { ...post, commentsCount: post.commentsCount + 1 };
        return post;
      })
    );

    setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
  };

  const toggleComments = (postId) => {
    setCommentsOpen(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShare = (post) => {
    const mockUrl = `${window.location.origin}/studytrail/post/${post._id}`;
    navigator.clipboard.writeText(mockUrl)
      .then(() => showToast('Copied post link to clipboard'))
      .catch(() => showToast('Error: Failed to copy'));
  };


  const renderNavIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return <Home className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

<<<<<<< HEAD
  if (isLoading || !currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-[#0B0914]' : 'bg-slate-50'}`}>
         <Loader2 className="animate-spin text-violet-500" size={48} />
      </div>
    );
  }
=======
  // 2. Wrapper function to fire the global toggle and the local toast notification
  const handleToggleDarkMode = () => {
    toggleDarkMode();
    showToast(isDarkMode ? 'Light mode enabled' : 'Dark mode enabled');
  };
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa

  return (
    <div className={`h-screen w-screen flex overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0B0914] text-white selection:bg-violet-600/30 selection:text-violet-200' 
        : 'bg-slate-50 text-slate-900 selection:bg-violet-600/10 selection:text-violet-900'
    }`}>
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <linearGradient id="likeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* SIDEBAR */}
      <aside id="studytrail-left-sidebar" className={`hidden md:flex flex-col w-64 shrink-0 justify-between p-6 h-full border-r transition-colors duration-300 ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="space-y-6">
          <Link to="/profile" className="flex items-center gap-3 mb-10 px-2 group">
            <div className={`p-2 rounded-xl border shadow-sm transition-colors ${
              isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-200 border-slate-300 text-black'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
<<<<<<< HEAD
              <h1 className="text-xl font-bold tracking-tight text-white">StudyTrail</h1>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-300 group-hover:text-violet-300 transition-colors">Your study circle</span>
            </div>
=======
  <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
    StudyTrail
  </h1>
  <span className={`text-[5.2px] font-semibold uppercase tracking-[0.24em] transition-colors ${
    isDarkMode ? 'text-gray-400 group-hover:text-violet-300' : 'text-slate-500 group-hover:text-violet-600'
  }`}>
    Empowering Students Worldwide
  </span>
</div>
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
          </Link>
          
          <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase px-2 block mb-3">NAVIGATION</span>
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.targetRoute)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 text-left cursor-pointer ${
                  currentRoute === item.targetRoute
                    ? isDarkMode 
                      ? 'bg-violet-600/10 text-violet-400 font-semibold border-l-2 border-violet-500'
                      : 'bg-violet-50 text-violet-600 font-semibold border-l-2 border-violet-500'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {renderNavIcon(item.icon)}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={`rounded-2xl border p-4 space-y-4 transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase block">STUDY PROGRESS</span>
            <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className={`p-2 rounded-lg shrink-0 ${isDarkMode ? 'bg-violet-950 text-violet-400 border border-violet-800/30' : 'bg-violet-50 text-violet-600'}`}>
                <Flame className="w-5 h-5 fill-violet-400/20" />
              </div>
              <div className="min-w-0">
                <h5 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12-Day Streak</h5>
                <p className="text-[10px] text-gray-400 truncate">Target matches goals!</p>
              </div>
            </div>
<<<<<<< HEAD
=======

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Weekly Target</span>
                <span className="text-violet-500 font-bold font-mono">78%</span>
              </div>
              <div className={`w-full rounded-full h-1.5 overflow-hidden border transition-colors duration-300 ${
                isDarkMode ? 'bg-[#0b0914] border-white/5' : 'bg-slate-200 border-slate-300'
              }`}>
                <div className="bg-linear-to-r from-violet-600 to-fuchsia-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
          </div>
        </div>

        {/* Real Authenticated User Sidebar Card */}
        <div className={`p-4 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <img
              src={currentUser.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser.fullName}</p>
              <p className="text-xs text-gray-400 truncate font-mono">@{currentUser.username}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
<<<<<<< HEAD
        {/* TOPBAR */}
        <header className={`h-16 border-b flex items-center justify-between px-8 flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'}`}>
=======
        <header className={`h-16 border-b flex items-center justify-between px-8 shrink-0 transition-colors duration-300 ${
          isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
        }`}>
          
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study updates, topics..."
                className={`w-full border rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500'}`}
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-gray-400 hover:text-slate-900">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
<<<<<<< HEAD
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors relative cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
=======
            
            {/* 3. Changed onClick to point to the wrapper function */}
            <button
              onClick={handleToggleDarkMode}
              className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-violet-500/50 cursor-pointer flex items-center justify-center hover:ring-violet-400 transition ml-2">
                <img src={currentUser.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="User" className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>
        </header>

<<<<<<< HEAD
        {/* POST FILTERS */}
        <div className={`px-8 py-4 flex gap-2 overflow-x-auto border-b flex-shrink-0 scrollbar-none transition-colors duration-300 ${isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-slate-50'}`}>
          {POST_FILTERS.map(filter => (
            <span
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${currentFilter === filter ? 'bg-violet-600 text-white' : isDarkMode ? 'bg-[#151125] text-gray-400 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'}`}
            >
              {filter}
            </span>
          ))}
=======
        <div className={`px-8 py-4 flex gap-2 overflow-x-auto border-b shrink-0 scrollbar-none transition-colors duration-300 ${
          isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-slate-50'
        }`}>
          {POST_FILTERS.map(filter => {
            const isActive = currentFilter === filter;
            return (
              <span
                key={filter}
                onClick={() => {
                  setCurrentFilter(filter);
                  showToast(`Filter: ${filter}`);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : isDarkMode 
                      ? 'bg-[#151125] text-gray-400 hover:text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                }`}
              >
                {filter === 'All' ? 'All Posts' : filter}
              </span>
            );
          })}
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
        </div>

        {/* MAIN FEED CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 pt-6">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 items-start">
            
            <div className="flex-1 w-full max-w-2xl space-y-6">
              
              {/* POST CREATOR */}
              <div className={`border rounded-3xl p-5 shadow-xl relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600" />
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={currentUser.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                      alt="Current User"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder="What are you studying right now?"
<<<<<<< HEAD
                        className={`w-full bg-transparent border-none focus:ring-0 resize-none min-h-[60px] text-sm focus:outline-none ${isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-slate-800 placeholder-slate-400'}`}
=======
                        className={`w-full bg-transparent border-none focus:ring-0 resize-none min-h-15 text-sm focus:outline-none ${
                          isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-slate-800 placeholder-slate-400'
                        }`}
>>>>>>> d5246cdc34da1210b991ed49a704d0299a08d6aa
                      />
                    </div>
                  </div>

                  <input type="file" ref={mediaInputRef} onChange={(e) => handleFileChange(e, 'media')} accept="image/*,video/*" className="hidden" />
                  <input type="file" ref={docInputRef} onChange={(e) => handleFileChange(e, 'doc')} accept=".pdf,.docx,.txt" className="hidden" />

                  {selectedFile && (
                    <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {selectedFile.type === 'image' && <ImageIcon className="w-4 h-4 text-violet-400 shrink-0" />}
                        {selectedFile.type === 'video' && <Eye className="w-4 h-4 text-violet-400 shrink-0" />}
                        {selectedFile.type === 'document' && <FileText className="w-4 h-4 text-emerald-500 shrink-0" />}
                        <div className="truncate">
                          <p className={`text-xs truncate font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedFile.name}</p>
                        </div>
                      </div>
                      <button type="button" onClick={removeAttachment} className={`p-1 rounded-full transition ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className={`flex justify-between items-center pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex gap-2">
                      <button type="button" onClick={triggerMediaUpload} className={`flex items-center gap-2 text-xs transition-colors px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-violet-400 hover:bg-white/5' : 'text-slate-500 hover:text-violet-600 hover:bg-slate-100'}`}>
                        <ImageIcon className="w-4 h-4 text-violet-500" /> <span>Media</span>
                      </button>
                      <button type="button" onClick={triggerDocUpload} className={`flex items-center gap-2 text-xs transition-colors px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-violet-400 hover:bg-white/5' : 'text-slate-500 hover:text-violet-600 hover:bg-slate-100'}`}>
                        <FileText className="w-4 h-4 text-emerald-500" /> <span>Doc</span>
                      </button>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg text-white disabled:opacity-50 flex items-center gap-2">
                      {isSubmitting && <Loader2 size={16} className="animate-spin"/>} Post Update
                    </button>
                  </div>
                </form>
              </div>

              {/* FEED STREAM */}
              <div className="space-y-6">
                {sortedAndFilteredPosts.length === 0 ? (
                  <div className={`border rounded-3xl p-8 text-center space-y-3 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
                    <Search className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-medium">No updates found.</p>
                  </div>
                ) : (
                  sortedAndFilteredPosts.map(post => {
                    const isCommentsOpen = !!commentsOpen[post._id];
                    const postComments = comments[post._id] || [];
                    const tag = extractHashtag(post.content);

                    return (
                      <div key={post._id} className={`border rounded-3xl p-5 shadow-xl space-y-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <img src={post.owner?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/10 shrink-0" alt="Avatar"/>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{post.owner?.fullName || "User"}</h4>
                                <span className="text-violet-500 font-semibold text-xs font-mono">{tag}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">
                                @{post.owner?.username} • {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {post.content && <p className={`text-sm leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{post.content}</p>}

                        {/* Rendering DB Attachments */}
                        {post.attachments && post.attachments.length > 0 && (
                          <div className={`mt-2 overflow-hidden rounded-2xl border ${isDarkMode ? 'border-white/5 bg-black/40' : 'border-slate-100 bg-slate-50'}`}>
                            {post.attachments.map((file, idx) => (
                               <div key={idx}>
                                {file.fileType === 'image' || file.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                  <img src={file.url} onClick={() => setImageLightbox(file.url)} className="w-full max-h-[550px] object-contain cursor-zoom-in" alt="Attachment" />
                                ) : file.fileType === 'video' || file.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                  <video controls src={file.url} className="w-full max-h-[550px]" />
                                ) : (
                                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 hover:bg-black/5 transition">
                                    <FileText className="w-6 h-6 text-emerald-500" />
                                    <span className="font-semibold text-sm">View Attached Document</span>
                                  </a>
                                )}
                               </div>
                            ))}
                          </div>
                        )}

                        <div className={`flex items-center gap-6 mt-5 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                          <div className="relative">
                            <button
                              onMouseDown={() => startReactionHold(post._id)}
                              onMouseUp={cancelReactionHold}
                              onMouseLeave={cancelReactionHold}
                              onClick={(e) => handleLikeButtonClick(post._id, e)}
                              className={`flex items-center gap-2 text-xs font-semibold rounded-full px-2 py-1 ${post.isLikedByMe ? 'bg-red-500/10 text-red-500' : isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                              {post.reactionEmoji ? <span>{post.reactionEmoji}</span> : <Heart className="w-5 h-5" fill={post.isLikedByMe ? 'currentColor' : 'none'} />}
                              <span>{post.likesCount}</span>
                            </button>
                            {reactionPickerPostId === post._id && (
                              <div className="absolute bottom-10 left-0 mb-2 flex items-center gap-2 rounded-full bg-white/95 px-2 py-2 shadow-2xl z-20">
                                {REACTION_OPTIONS.map(reaction => (
                                  <button key={reaction.emoji} onClick={() => handleReactionSelect(post._id, reaction)} className="text-lg hover:scale-110">{reaction.emoji}</button>
                                ))}
                              </div>
                            )}
                          </div>

                          <button onClick={() => toggleComments(post._id)} className={`flex items-center gap-2 text-xs font-semibold ${isCommentsOpen ? 'text-violet-500' : 'text-gray-400'}`}>
                            <MessageSquare className="w-5 h-5" /> <span>{post.commentsCount} Comments</span>
                          </button>

                          <button onClick={() => handleShare(post)} className="flex items-center gap-2 text-xs text-gray-400 hover:text-slate-900 font-semibold ml-auto">
                            <Share2 className="w-5 h-5" /> <span>Share</span>
                          </button>
                        </div>

                        {isCommentsOpen && (
                          <div className={`border-t pt-4 space-y-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                              <img src={currentUser.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} className="w-8 h-8 rounded-full object-cover shrink-0" alt="Avatar"/>
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={newCommentTexts[post._id] || ''}
                                  onChange={(e) => setNewCommentTexts({ ...newCommentTexts, [post._id]: e.target.value })}
                                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                                  placeholder="Write a comment..."
                                  className={`w-full border rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:border-violet-600 ${isDarkMode ? 'bg-[#0B0914] text-white border-white/5' : 'bg-slate-100 text-slate-900 border-slate-200'}`}
                                />
                                <button onClick={() => handleCommentSubmit(post._id)} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-violet-500">
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {postComments.map(comment => (
                              <div key={comment.id} className={`flex gap-2.5 items-start text-xs rounded-xl p-2.5 border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <img src={comment.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="Avatar"/>
                                <div className="flex-1">
                                  <span className="font-bold mr-2">{comment.author}</span><span className="text-[9px] text-gray-400">{comment.time}</span>
                                  <p className="mt-0.5">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
          </div>
        </div>
      </main>

      {/* TOAST / LIGHTBOX */}
      {imageLightbox && (
        <div onClick={() => setImageLightbox(null)} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out">
          <img src={imageLightbox} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Lightbox" />
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-violet-600 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" /> <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}