import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import '../Feed.css';
import {
  Home,
  BookOpen,
  Trophy,
  Compass,
  MessageSquare,
  Search,
  Image as ImageIcon,
  FileText,
  Send,
  Heart,
  Share2,
  X,
  Check,
  Download,
  Flame,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Edit3,
  Upload,
  MoreVertical,
  Menu,
  Sun,
  Moon,
  Bell
} from 'lucide-react';
// import axios from 'axios'; // Uncomment this when ready to use your real backend

export const LOGGED_IN_USER = {
  id: 'user-101',
  name: 'Anuj Majumder',
  handle: '@anuj_studies',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6GQPuT9G2O8DX58cFVWI_LiXKFgMBJA4LQnDlImQrrg&s=100'
};

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home', targetRoute: '/home' },
  { id: 'messages', label: 'Messages', icon: 'MessageSquare', targetRoute: '/working' },
  { id: 'resources', label: 'Resources', icon: 'BookOpen', targetRoute: '/working' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy', targetRoute: '/working' }
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'Sarah Chen',
      handle: '@sarah_codes',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
    },
    timestamp: '2 hours ago',
    studyTopicTag: '#MachineLearning',
    contentText: 'Finished drafting my visual cheat sheet for neural network backpropagation! Let me know if you want the PDF. The formulas are color-coded to match forward vs backward weight changes. 🧠📝',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    likesCount: 24,
    commentsCount: 5,
    isLikedByMe: false
  },
  {
    id: 'post-2',
    author: {
      name: 'Michael Torres',
      handle: '@mike_bio',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
    },
    timestamp: '4 hours ago',
    studyTopicTag: '#HumanAnatomy',
    contentText: 'Sharing my handwritten summary sheet of the cardiovascular pathway structure for our upcoming biology midterm. Highly detailed, includes diagrams of heart chambers and valve actions.',
    mediaType: 'document',
    fileName: 'Cardiology_Handout_Review.pdf',
    fileSize: '1.8 MB',
    likesCount: 18,
    commentsCount: 3,
    isLikedByMe: true
  },
  {
    id: 'post-3',
    author: {
      name: 'Emily Watson',
      handle: '@em_physics',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
    },
    timestamp: 'Yesterday',
    studyTopicTag: '#QuantumMechanics',
    contentText: 'Recorded a short 45-second concept breakdown of the double-slit experiment interference patterns. Explaining it out loud helped solidify my understanding. Hopefully it helps some of you too!',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-computer-34254-large.mp4',
    likesCount: 42,
    commentsCount: 11,
    isLikedByMe: false
  }
];

const TRENDING_TOPICS = [
  { tag: '#MachineLearning', count: 124 },
  { tag: '#HumanAnatomy', count: 86 },
  { tag: '#QuantumMechanics', count: 54 },
  { tag: '#FigmaDesign', count: 42 },
  { tag: '#React19', count: 38 }
];

const TYPEWRITER_PLACEHOLDERS = [
  "What's on your mind?",
  "Want to share your studies?",
  "Share a study update...",
  "Got any notes to share?",
  "Ask a question to the community..."
];

export default function Feed() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLightbox, setImageLightbox] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('/home');
  
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // Typewriter states
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [phIndex, setPhIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('studytrail_tasks');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn('Failed to load saved tasks', error);
    }
    return [
      { id: 'task-1', text: 'Revise Machine Learning neural backprop notes', done: true, xp: 15 },
      { id: 'task-2', text: 'Complete Anatomy heart labels', done: true, xp: 15 },
      { id: 'task-3', text: 'Solve quantum physics double-slit worksheet', done: false, xp: 15 }
    ];
  });

  const mediaInputRef = useRef(null);
  const docInputRef = useRef(null);
  const postTextareaRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('studytrail_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks', error);
    }
  }, [tasks]);

  useEffect(() => {
    if (postTextareaRef.current) {
      postTextareaRef.current.style.height = 'auto';
      postTextareaRef.current.style.height = Math.max(postTextareaRef.current.scrollHeight, 72) + 'px';
    }
  }, [newPostText]);

  // Typewriter Effect logic
  useEffect(() => {
    if (isTextareaFocused) return; 

    const targetString = TYPEWRITER_PLACEHOLDERS[phIndex];
    let typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && currentPlaceholder === targetString) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    } 
    
    if (isDeleting && currentPlaceholder === '') {
      setIsDeleting(false);
      setPhIndex((prev) => (prev + 1) % TYPEWRITER_PLACEHOLDERS.length);
      const timeout = setTimeout(() => {}, 500);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPlaceholder(
        targetString.substring(0, currentPlaceholder.length + (isDeleting ? -1 : 1))
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isDeleting, phIndex, isTextareaFocused]);

  const handleNavigation = (route) => {
    if (route === '/home' || route === '/') {
      window.location.reload();
    } else {
      setCurrentRoute(route);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
      navigate(route);
    }
  };

  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const saveTaskEdit = (id) => {
    const trimmed = editingTaskText.trim();
    if (!trimmed) return;
    setTasks(prev => prev.map(item => item.id === id ? { ...item, text: trimmed } : item));
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const handleAddTask = () => {
    const trimmed = newTaskText.trim();
    if (!trimmed) return;
    setTasks(prev => [
      { id: `task-${Date.now()}`, text: trimmed, done: false, xp: 15 },
      ...prev
    ]);
    setNewTaskText('');
  };

  const handleSaveTasksToProfile = () => {
    try {
      const savedUser = localStorage.getItem('mock_studyTrail_user');
      const profile = savedUser ? JSON.parse(savedUser) : {};
      localStorage.setItem('mock_studyTrail_user', JSON.stringify({ ...profile, tasks }));
    } catch (error) {
      console.error('Failed to save tasks', error);
    }
    setIsTaskModalOpen(false);
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    return post.contentText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.studyTopicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // --- OPTIMISTIC UI: LIKE TOGGLE ---
  const handleLikeToggle = async (postId) => {
    // Find the specific post to cache its current state
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    // 1. Cache the current state just in case we need to roll back
    const previousIsLiked = targetPost.isLikedByMe;
    const previousCount = targetPost.likesCount;

    // 2. Optimistic Update (Instant UI change)
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        const newIsLiked = !previousIsLiked;
        return {
          ...post,
          isLikedByMe: newIsLiked,
          likesCount: newIsLiked ? previousCount + 1 : Math.max(0, previousCount - 1),
        };
      })
    );

    try {
      // 3. Call your backend silently
      // Replace this mock Promise with your real axios call: 
      // await axios.post(`/api/v1/like/toggle/post-id/${postId}`);
      
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulated 10% chance of backend failure for testing the rollback
          if (Math.random() > 0.9) reject(new Error("Simulated backend/network error"));
          else resolve();
        }, 500);
      });

    } catch (error) {
      // 4. Rollback if the API fails
      console.error("Backend error:", error);
      
      // Optional: Show a quick toast notification
      alert("Connection failed. Couldn't update your like.");
      
      // Roll the React state back to exactly what it was before
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id !== postId) return post;
          return {
            ...post,
            isLikedByMe: previousIsLiked,
            likesCount: previousCount,
          };
        })
      );
    }
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
    
    setIsUploadExpanded(false);
  };

  const removeAttachment = () => {
    if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
    setSelectedFile(null);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedFile) return;
    
    const parsedTag = newPostText.match(/#\w+/) ? newPostText.match(/#\w+/)[0] : '#GeneralStudy';
    const newPost = {
      id: `custom-post-${Date.now()}`,
      author: { name: LOGGED_IN_USER.name, handle: LOGGED_IN_USER.handle, avatarUrl: LOGGED_IN_USER.avatarUrl },
      timestamp: 'Just now',
      studyTopicTag: parsedTag,
      contentText: newPostText,
      mediaType: selectedFile ? selectedFile.type : 'none',
      mediaUrl: selectedFile?.previewUrl,
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      likesCount: 0,
      commentsCount: 0,
      isLikedByMe: false
    };

    setIsUploading(true);
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setSelectedFile(null);
    setIsUploadExpanded(false);
    setTimeout(() => setIsUploading(false), 800);
  };

  const renderNavIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return <Home className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0B0914] text-white selection:bg-violet-600/30 selection:text-violet-200' 
        : 'bg-slate-50 text-slate-900 selection:bg-violet-600/10 selection:text-violet-900'
    }`}>
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className={`hidden lg:flex flex-col w-65 shrink-0 h-full border-r overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex flex-col h-full p-4 space-y-5">
          
          <button onClick={() => window.location.reload()} className="flex items-center gap-3 mb-2 px-2 group cursor-pointer text-left">
            <div className={`p-2 rounded-xl border shadow-sm transition-colors ${
              isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-200 border-slate-300 text-black'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>StudyTrail</h1>
              <span className={`text-[5px] font-semibold uppercase tracking-[0.24em] transition-colors ${
                isDarkMode ? 'text-gray-400 group-hover:text-violet-300' : 'text-slate-500 group-hover:text-violet-600'
              }`}>
                Empowering Students Worldwide
              </span>
            </div>
          </button>
          
          <div className="space-y-1 shrink-0">
            <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase px-2 block mb-2"></span>
            {NAV_ITEMS.map(item => {
              const isActive = currentRoute === item.targetRoute;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.targetRoute)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 text-left cursor-pointer ${
                    isActive
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
              );
            })}
          </div>

          <div className={`rounded-2xl border p-3 space-y-3 shrink-0 transition-colors duration-300 ${
            isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase block">STUDY PROGRESS</span>
            <div className={`flex items-center gap-2 p-2 rounded-xl border transition-colors duration-300 ${
              isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-white border-slate-200'
            }`}>
              <div className={`p-1.5 rounded-lg shrink-0 ${
                isDarkMode ? 'bg-violet-950 text-violet-400 border border-violet-800/30' : 'bg-violet-50 text-violet-600'
              }`}>
                <Flame className="w-4 h-4 fill-violet-400/20" />
              </div>
              <div className="min-w-0">
                <h5 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12-Day Streak</h5>
                <p className="text-[9px] text-gray-400 truncate">Target matches goals!</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <footer className={`pt-4 border-t shrink-0 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
              <div className="space-y-4">
                
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                    <GraduationCap className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                  </div>
                  <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    StudyTrail
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className={`font-semibold text-[11px] mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Platform</h4>
                    <ul className={`space-y-1 text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <li><a href="#" className="hover:text-violet-500 transition-colors">Features</a></li>
                      <li><a href="#" className="hover:text-violet-500 transition-colors">Leaderboard</a></li>
                      <li><a href="#" className="hover:text-violet-500 transition-colors">Pricing</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className={`font-semibold text-[11px] mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
                    <ul className={`space-y-1 text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <li><a href="#" className="hover:text-violet-500 transition-colors">About Us</a></li>
                      <li><a href="#" className="hover:text-violet-500 transition-colors">Privacy</a></li>
                      <li><a href="#" className="hover:text-violet-500 transition-colors">Terms</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className={`pt-3 border-t flex items-center justify-between gap-1 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                  <div className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    &copy; 2026 StudyTrail
                  </div>
                  <div className="flex gap-1.5 text-[9px]">
                    <a href="#" className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>X</a>
                    <a href="#" className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>in</a>
                    <a href="#" className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>IG</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </aside>

      {/* MOBILE MENU MODAL (Three dots menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`relative w-80 h-full p-6 shadow-2xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${isDarkMode ? 'bg-[#0B0914] text-white' : 'bg-white text-slate-900'}`}>
            
            <div className="flex items-center justify-between mb-8 mt-2">
              <h2 className="font-bold text-xl">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 rounded-full transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6 flex-1">
              
              {/* Study Progress */}
              <div className={`rounded-2xl border p-4 space-y-3 shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase block">STUDY PROGRESS</span>
                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-white border-slate-200'}`}>
                  <div className={`p-2 rounded-lg shrink-0 ${isDarkMode ? 'bg-violet-950 text-violet-400 border border-violet-800/30' : 'bg-violet-50 text-violet-600'}`}>
                    <Flame className="w-5 h-5 fill-violet-400/20" />
                  </div>
                  <div className="min-w-0">
                    <h5 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12-Day Streak</h5>
                    <p className="text-[10px] text-gray-400 truncate">Target matches goals!</p>
                  </div>
                </div>
              </div>

              {/* Weekly Avg Rank & Classroom Level */}
              <div className={`flex justify-between items-center p-4 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono block">Weekly Avg Rank</span>
                  <span className="font-bold text-sm flex items-center gap-1 mt-0.5">
                    <Trophy className="w-4 h-4 text-yellow-500" /> Top 5%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block">Classroom Level</span>
                  <span className="font-bold text-sm text-violet-500 font-mono">Lvl 14</span>
                </div>
              </div>

              {/* Trending Topics */}
              <div className={`border rounded-3xl p-5 space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-violet-500" />
                  <h4 className="font-bold text-sm">Trending Topics</h4>
                </div>
                <div className="space-y-2">
                  {TRENDING_TOPICS.map(topic => (
                    <div 
                      key={topic.tag} 
                      onClick={() => { 
                        setSearchQuery(topic.tag); 
                        setIsMobileMenuOpen(false); 
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition duration-150 cursor-pointer group ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'}`}
                    >
                      <span className="text-xs text-gray-400 group-hover:text-violet-500 transition font-mono">{topic.tag}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{topic.count} studies</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsTaskModalOpen(true); }} 
                className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg transition-transform hover:scale-[1.02]"
              >
                My Tasks
              </button>
            </div>

            {/* Premium Footer Section */}
            <div className="mt-8">
              <footer className={`pt-6 border-t shrink-0 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <GraduationCap className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      StudyTrail
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-semibold text-[11px] mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Platform</h4>
                      <ul className={`space-y-1.5 text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <li><a href="#" className="hover:text-violet-500 transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-violet-500 transition-colors">Leaderboard</a></li>
                        <li><a href="#" className="hover:text-violet-500 transition-colors">Pricing</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-[11px] mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
                      <ul className={`space-y-1.5 text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <li><a href="#" className="hover:text-violet-500 transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-violet-500 transition-colors">Privacy</a></li>
                        <li><a href="#" className="hover:text-violet-500 transition-colors">Terms</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className={`pt-4 border-t flex items-center justify-between gap-1 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                    <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      &copy; 2026 StudyTrail
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>X</a>
                      <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>in</a>
                      <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>IG</a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT FEED */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-16 lg:pb-0">
        
        {/* TOP NAVBAR (Search, Dark Mode, Profile) */}
        <header className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-[#0B0914]/80 border-white/10' : 'bg-white/80 border-slate-200'
        }`}>
          {/* Mobile Logo */}
          <button onClick={() => window.location.reload()} className="lg:hidden flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-500" />
            <h1 className="font-bold text-lg">StudyTrail</h1>
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className={`w-full flex items-center px-4 py-2 rounded-full border transition-colors ${
              isDarkMode ? 'bg-[#151125] border-white/10 focus-within:border-violet-500' : 'bg-slate-100 border-transparent focus-within:bg-white focus-within:border-violet-500'
            }`}>
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, topics, or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm ml-3 text-inherit placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition">
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3 lg:gap-4 ml-auto sm:ml-0">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-slate-200 text-slate-600'}`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className={`p-2 rounded-full transition-colors relative ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-slate-200 text-slate-600'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white dark:border-[#0B0914] transition-colors"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className={`absolute top-full right-0 mt-2 w-72 rounded-2xl border shadow-xl p-4 z-50 animate-fade-in ${
                  isDarkMode ? 'bg-[#151125] border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm">Recent Notifications</h3>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0"><Heart className="w-4 h-4" /></div>
                      <div>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sarah Chen</span> liked your backprop notes.
                        </p>
                        <span className="text-[10px] text-gray-400">10 mins ago</span>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0"><MessageSquare className="w-4 h-4" /></div>
                      <div>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Michael Torres</span> commented on your post.
                        </p>
                        <span className="text-[10px] text-gray-400">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/profile" className="cursor-pointer hidden sm:block">
              <img src={LOGGED_IN_USER.avatarUrl} alt="Profile" className={`w-8 h-8 rounded-full object-cover border transition ${isDarkMode ? 'border-white/10' : 'border-slate-200'} hover:opacity-80`} />
            </Link>
            
            <button onClick={() => setIsMobileMenuOpen(true)} className={`lg:hidden p-2 rounded-full transition ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-slate-200 text-slate-600'}`}>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto w-full p-4 lg:p-8 space-y-6 flex-1">
          {/* Post Creation Box */}
          <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'
          }`}>
            <div className="flex gap-3">
              <img src={LOGGED_IN_USER.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
              <div className="flex-1 space-y-3">
                <textarea
                  ref={postTextareaRef}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  onFocus={() => setIsTextareaFocused(true)}
                  onBlur={() => setIsTextareaFocused(false)}
                  placeholder={isTextareaFocused ? "Write your post..." : currentPlaceholder}
                  className={`w-full bg-transparent resize-none outline-none text-sm leading-relaxed transition-all duration-300 ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                  rows="2"
                />
                
                {selectedFile && (
                  <div className={`relative p-3 rounded-xl border inline-flex items-center gap-3 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-xs truncate max-w-50">{selectedFile.name}</span>
                    <button onClick={removeAttachment} className="p-1 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Hidden File Inputs */}
                <input type="file" ref={mediaInputRef} onChange={(e) => handleFileChange(e, 'media')} accept="image/*,video/*" className="hidden" />
                <input type="file" ref={docInputRef} onChange={(e) => handleFileChange(e, 'doc')} accept=".pdf,.doc,.docx,.txt" className="hidden" />

                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => setIsUploadExpanded(!isUploadExpanded)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                  <button
                    onClick={handlePostSubmit}
                    disabled={(!newPostText.trim() && !selectedFile) || isUploading}
                    className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                  >
                    Post
                  </button>
                </div>

                {/* Upload Expandable Accordion */}
                {isUploadExpanded && (
                  <div className={`mt-4 p-4 rounded-2xl border animate-fade-in ${isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className="text-sm font-bold mb-1">Upload Content</h3>
                    <p className="text-xs text-slate-500 mb-4">Add to your post</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={triggerMediaUpload} className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed transition hover:border-violet-500 hover:bg-violet-500/5 ${isDarkMode ? 'border-white/20' : 'border-slate-300'}`}>
                        <ImageIcon className="w-6 h-6 mb-2 text-violet-500" />
                        <span className="text-xs font-semibold">Photo/Video</span>
                        <span className="text-[10px] text-gray-500 mt-1">Add images or videos</span>
                      </button>
                      <button onClick={triggerDocUpload} className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed transition hover:border-violet-500 hover:bg-violet-500/5 ${isDarkMode ? 'border-white/20' : 'border-slate-300'}`}>
                        <FileText className="w-6 h-6 mb-2 text-blue-500" />
                        <span className="text-xs font-semibold">Document</span>
                        <span className="text-[10px] text-gray-500 mt-1">PDF, DOCX, TXT files</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Results / Header Indicator */}
          {searchQuery && (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-gray-500">Showing results for "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="text-xs text-violet-500 hover:underline">Clear search</button>
            </div>
          )}

          {/* Post Feed */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post.id} className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img src={post.author.avatarUrl} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-sm font-semibold">{post.author.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.author.handle}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span 
                      onClick={() => setSearchQuery(post.studyTopicTag)}
                      className="inline-block px-2 py-1 rounded-md bg-violet-500/10 text-violet-500 text-xs font-semibold mb-2 cursor-pointer hover:bg-violet-500/20 transition"
                    >
                      {post.studyTopicTag}
                    </span>
                    <p className="text-sm leading-relaxed">{post.contentText}</p>
                  </div>

                  {post.mediaType === 'image' && post.mediaUrl && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 cursor-zoom-in" onClick={() => setImageLightbox(post.mediaUrl)}>
                      <img src={post.mediaUrl} alt="Post material" className="w-full h-auto max-h-96 object-cover hover:scale-[1.02] transition duration-500" />
                    </div>
                  )}

                  {post.mediaType === 'document' && (
                    <div className={`mb-4 p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-semibold truncate max-w-50">{post.fileName}</p>
                          <p className="text-xs text-gray-500">{post.fileSize}</p>
                        </div>
                      </div>
                      <button className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                        <Download className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  )}

                  <div className={`flex flex-wrap items-center gap-4 pt-3 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <button onClick={() => handleLikeToggle(post.id)} className={`flex items-center gap-1.5 text-xs font-medium transition ${post.isLikedByMe ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}>
                      <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-pink-500' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-violet-500 transition">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-500 transition ml-auto">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>No posts found for "{searchQuery}".</p>
                <button onClick={() => setSearchQuery('')} className="mt-3 text-violet-500 hover:underline">Clear search</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION (Instagram Style) */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around px-2 py-3 border-t backdrop-blur-xl transition-colors ${
        isDarkMode ? 'bg-[#0B0914]/90 border-white/10' : 'bg-white/90 border-slate-200'
      }`}>
        {NAV_ITEMS.map(item => {
          const isActive = currentRoute === item.targetRoute;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.targetRoute)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? isDarkMode ? 'text-violet-400' : 'text-violet-600'
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {renderNavIcon(item.icon)}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => handleNavigation('/profile')}
          className="flex flex-col items-center justify-center p-2 rounded-lg"
        >
          <img 
            src={LOGGED_IN_USER.avatarUrl} 
            alt="Profile" 
            className={`w-6 h-6 rounded-full object-cover border-2 ${currentRoute === '/profile' ? 'border-violet-500' : 'border-transparent'}`} 
          />
          <span className={`text-[10px] font-medium mt-1 ${currentRoute === '/profile' ? (isDarkMode ? 'text-violet-400' : 'text-violet-600') : (isDarkMode ? 'text-gray-400' : 'text-slate-500')}`}>
            Profile
          </span>
        </button>
      </nav>

      {/* RIGHT SIDEBAR (Fixed Desktop UI for Tasks/Trending) */}
      <aside className={`hidden lg:flex flex-col w-80 shrink-0 p-6 h-full border-l overflow-y-auto sticky top-0 transition-colors duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="space-y-8">
          
          <div className="space-y-4">
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold shadow-lg transition-transform hover:scale-[1.02]"
            >
              My Tasks
            </button>

            <div className={`flex justify-between items-center p-4 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Weekly Avg Rank</span>
                <span className="font-bold text-sm flex items-center gap-1 mt-0.5">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Top 5%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-mono block">Classroom Level</span>
                <span className="font-bold text-sm text-violet-500 font-mono">Lvl 14</span>
              </div>
            </div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-4 shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h4 className="font-bold text-sm">Trending Topics</h4>
            </div>
            <div className="space-y-2">
              {TRENDING_TOPICS.map(topic => (
                <div 
                  key={topic.tag} 
                  onClick={() => setSearchQuery(topic.tag)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition duration-150 cursor-pointer group ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'}`}
                >
                  <span className="text-xs text-gray-400 group-hover:text-violet-500 transition font-mono">{topic.tag}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{topic.count} studies</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* TASK MODAL OVERLAY */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsTaskModalOpen(false)} />
          <div className={`relative w-full max-w-md p-6 rounded-3xl shadow-2xl z-10 ${isDarkMode ? 'bg-[#151125] text-white border border-white/10' : 'bg-white text-slate-900 border border-slate-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-xl">My Tasks</h2>
                <p className="text-xs text-violet-500 uppercase font-mono tracking-widest mt-1">Complete tasks to earn EXP</p>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add a new task"
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                    isDarkMode ? 'bg-[#0B0914] border-white/10 text-white placeholder-gray-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
                />
                <button type="button" onClick={handleAddTask} className="rounded-2xl bg-violet-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-violet-700 transition">
                  Add
                </button>
              </div>

              <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {tasks.map(item => (
                  <div key={item.id} className="flex items-start gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(item.id)}
                      className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        item.done ? 'bg-violet-600 border-violet-500 text-white' : isDarkMode ? 'border-white/20 text-transparent hover:border-violet-500' : 'border-slate-300 text-transparent hover:border-violet-500'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <div className="flex-1 min-w-0">
                      {editingTaskId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveTaskEdit(item.id);
                              if (e.key === 'Escape') cancelEditTask();
                            }}
                            className={`flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-white border-slate-200'}`}
                          />
                          <button onClick={() => saveTaskEdit(item.id)} className="p-2 text-violet-500 hover:bg-violet-500/10 rounded-full"><Check className="w-4 h-4" /></button>
                          <button onClick={cancelEditTask} className="p-2 text-gray-500 hover:bg-gray-500/10 rounded-full"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className={`leading-relaxed ${item.done ? 'text-gray-500 line-through' : ''}`}>
                              {item.text}
                            </p>
                            <span className="text-[10px] font-bold text-violet-500">{item.xp} EXP</span>
                          </div>
                          <button onClick={() => startEditTask(item)} className="p-1.5 text-slate-400 hover:text-violet-500 transition">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={handleSaveTasksToProfile} className={`w-full rounded-2xl px-4 py-4 text-xs font-bold uppercase tracking-widest text-white transition mt-4 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-900 hover:bg-slate-800'}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {imageLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in" onClick={() => setImageLightbox(null)}>
          <button onClick={() => setImageLightbox(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
          <img src={imageLightbox} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}