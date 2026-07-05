import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import '../Feed.css';
import {
  Home, BookOpen, Trophy, Compass, MessageSquare, Search,
  Image as ImageIcon, FileText, Send, Heart, Share2, X, Check,
  Download, Flame, TrendingUp, Sparkles, GraduationCap, Edit3,
  Upload, MoreVertical, Menu, Sun, Moon, Bell, Users,
  Calendar, Clock
} from 'lucide-react';
//import axios from 'axios';// uncomment this when ready to integrate with backend
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
    userReaction: null // Changed from isLikedByMe
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
    userReaction: 'love' // Changed from isLikedByMe: true
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
    userReaction: null // Changed from isLikedByMe
  }
];

const TRENDING_TOPICS = [
  { tag: '#MachineLearning', count: 124 },
  { tag: '#HumanAnatomy', count: 86 },
  { tag: '#QuantumMechanics', count: 54 },
  { tag: '#React19', count: 38 }
];

const TYPEWRITER_PLACEHOLDERS = [
  "What's on your mind?",
  "Want to share your studies?",
  "Share a study update...",
  "Got any notes to share?",
  "Ask a question to the community..."
];

const REACTIONS = [
  { id: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
  { id: 'love', emoji: '❤️', label: 'Love', color: 'text-pink-500' },
  { id: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { id: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-600' }
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
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [isBottomSearchOpen, setIsBottomSearchOpen] = useState(false);

  const [activeReactionPostId, setActiveReactionPostId] = useState(null);
  const pressTimer = useRef(null);

  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [phIndex, setPhIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isComposerActive, setIsComposerActive] = useState(false);
  
  const shouldShowComposerActions = isComposerActive || Boolean(newPostText.trim()) || Boolean(selectedFile) || isUploadExpanded;

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
  
  const [commentsByPost, setCommentsByPost] = useState(() => Object.fromEntries(INITIAL_POSTS.map(post => [post.id, post.comments || []])));
  const [commentDrafts, setCommentDrafts] = useState({});

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
      postTextareaRef.current.style.height = Math.max(postTextareaRef.current.scrollHeight, 40) + 'px';
    }
  }, [newPostText]);

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
    const query = searchQuery.toLowerCase();
    return post.contentText.toLowerCase().includes(query) ||
      post.studyTopicTag.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query);
  });

  // Handles standard click (toggles default 'like' or removes reaction)
  const handleLikeToggle = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const isRemoving = post.userReaction !== null;
        const newReaction = isRemoving ? null : 'like'; // Default to 'like' on simple click
        
        return {
          ...post,
          userReaction: newReaction,
          likesCount: isRemoving ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
        };
      })
    );
  };

  // Interaction Handlers for Long Press
  const handleInteractionStart = (postId) => {
    pressTimer.current = setTimeout(() => {
      setActiveReactionPostId(postId);
    }, 500);
  };

  const handleInteractionEnd = (postId) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    // If the timer didn't finish (popup didn't open), treat it as a standard click
    if (activeReactionPostId !== postId) {
      handleLikeToggle(postId);
    }
  };

  const handleInteractionCancel = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Handles selecting a specific emoji from the popup
  const handleSelectReaction = (postId, reactionId) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        const previousReaction = post.userReaction;
        const isRemoving = previousReaction === reactionId; // Clicked the same emoji they already had
        const newReaction = isRemoving ? null : reactionId;
        
        let newCount = post.likesCount;
        if (!previousReaction && newReaction) newCount += 1; // Was empty, now reacted
        else if (previousReaction && !newReaction) newCount = Math.max(0, post.likesCount - 1); // Was reacted, now empty
        
        return {
          ...post,
          userReaction: newReaction,
          likesCount: newCount,
        };
      })
    );
    setActiveReactionPostId(null);
  };

  const triggerMediaUpload = () => mediaInputRef.current?.click();
  const triggerDocUpload = () => docInputRef.current?.click();

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const trimmedComment = (commentDrafts[postId] || '').trim();
    if (!trimmedComment) return;

    setCommentsByPost(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        {
          id: `comment-${Date.now()}`,
          author: {
            name: LOGGED_IN_USER.name,
            handle: LOGGED_IN_USER.handle,
            avatarUrl: LOGGED_IN_USER.avatarUrl
          },
          text: trimmedComment
        }
      ]
    }));

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, commentsCount: (post.commentsCount || 0) + 1 } : post
      )
    );

    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
  };

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
    
    const matchedTag = newPostText.match(/#\w+/);
    const parsedTag = matchedTag ? matchedTag[0] : '#GeneralStudy';
    
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
      userReaction: null, // Initialize with no reaction
      comments: []
    };

    setIsUploading(true);
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCommentsByPost(prev => ({ ...prev, [newPost.id]: [] }));
    setNewPostText('');
    setSelectedFile(null);
    setIsUploadExpanded(false);
    setTimeout(() => setIsUploading(false), 800);
  };

  const renderNavIcon = (iconName, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Home': return <Home className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0B0914] text-white selection:bg-violet-600/30 selection:text-violet-200' 
        : 'bg-slate-50 text-slate-900 selection:bg-violet-600/10 selection:text-violet-900'
    }`}>
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className={`hidden lg:flex flex-col w-[18rem] shrink-0 h-full border-r overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex-1 flex flex-col p-6 space-y-8 overflow-hidden">
          <button onClick={() => window.location.reload()} className="flex items-center gap-3 mb-2 px-2 group cursor-pointer text-left">
            <div className={`p-2.5 rounded-2xl border shadow-sm transition-colors ${
              isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-200 border-slate-300 text-black'
            }`}>
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>StudyTrail</h1>
              <span className={`text-[6px] font-semibold uppercase tracking-[0.24em] transition-colors mt-0.5 ${
                isDarkMode ? 'text-gray-400 group-hover:text-violet-300' : 'text-slate-500 group-hover:text-violet-600'
              }`}>
                Empowering Students Worldwide
              </span>
            </div>
          </button>
          
          <div className="space-y-2 shrink-0 mt-4">
            {NAV_ITEMS.map(item => {
              const isActive = currentRoute === item.targetRoute;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.targetRoute)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm font-medium transition duration-200 text-left cursor-pointer ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-violet-600/10 text-violet-400 font-semibold border-l-4 border-violet-500'
                        : 'bg-violet-50 text-violet-600 font-semibold border-l-4 border-violet-500'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent'
                  }`}
                >
                  {renderNavIcon(item.icon, "w-5 h-5")}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`rounded-3xl border p-5 space-y-4 shrink-0 transition-colors duration-300 mt-auto ${
            isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-xs font-bold text-gray-500 tracking-widest font-mono uppercase block">STUDY PROGRESS</span>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-300 ${
              isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-white border-slate-200'
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 ${
                isDarkMode ? 'bg-violet-950 text-violet-400 border border-violet-800/30' : 'bg-violet-50 text-violet-600'
              }`}>
                <Flame className="w-6 h-6 fill-violet-400/20" />
              </div>
              <div className="min-w-0">
                <h5 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12-Day Streak</h5>
                <p className="text-xs text-gray-400 truncate mt-0.5">Target matches goals!</p>
              </div>
            </div>
          </div>
        </div>

        <footer className={`p-5 border-t flex flex-col shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
              <GraduationCap className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
            </div>
            <span className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              StudyTrail
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <h4 className={`font-semibold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Platform</h4>
              <ul className={`space-y-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
              <ul className={`space-y-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <li><a href="#" className="hover:text-violet-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-violet-500 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`pt-4 border-t flex items-center justify-between gap-1 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              &copy; 2026 StudyTrail
            </div>
            <div className="flex gap-2 text-[11px]">
              <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>X</a>
              <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>in</a>
              <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>IG</a>
            </div>
          </div>
        </footer>
      </aside>

      {/* MOBILE MENU MODAL */}
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
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-16 lg:pb-0">
        
        {/* TOP NAVBAR */}
        <header className={`sticky top-0 z-30 flex items-center px-4 py-3 border-b backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-[#0B0914]/80 border-white/10' : 'bg-white/80 border-slate-200'
        }`}>
          <button onClick={() => window.location.reload()} className="lg:hidden flex items-center gap-2 shrink-0">
            <GraduationCap className="w-6 h-6 text-violet-500" />
            <h1 className="font-bold text-lg">StudyTrail</h1>
          </button>

          <div className="hidden sm:flex flex-1 justify-center pl-8">
            <div className={`w-full max-w-xl flex items-center px-4 py-2 rounded-full border transition-colors ${
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

          <div className="flex items-center gap-3 lg:gap-4 ml-auto sm:ml-0">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-slate-200 text-slate-600'}`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
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

        <div className="w-full max-w-4xl mx-auto p-4 lg:px-6 lg:py-6 space-y-6 flex-1">
          
          {/* POST CREATION BOX */}
          <div className={`w-full p-3 sm:px-4 sm:py-3 rounded-2xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'
          }`}>
            <div 
              className="flex items-start gap-3" 
              onClick={() => { postTextareaRef.current?.focus(); setIsComposerActive(true); }}
            >
              <img src={LOGGED_IN_USER.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 flex flex-col">
                <textarea
                  ref={postTextareaRef}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  onFocus={() => { setIsTextareaFocused(true); setIsComposerActive(true); }}
                  onBlur={() => {
                    setIsTextareaFocused(false);
                    setTimeout(() => {
                      if (!newPostText.trim() && !selectedFile && !isUploadExpanded) {
                        setIsComposerActive(false);
                      }
                    }, 150);
                  }}
                  placeholder={isTextareaFocused ? "Write your post..." : currentPlaceholder}
                  className={`w-full bg-transparent resize-none outline-none text-sm leading-relaxed py-1.5 transition-all duration-300 ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                  rows="1"
                />
                
                {selectedFile && (
                  <div className={`relative mt-2 p-3 rounded-xl border inline-flex items-center gap-3 w-fit ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-xs truncate max-w-50">{selectedFile.name}</span>
                    <button onClick={removeAttachment} className="p-1 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <input type="file" ref={mediaInputRef} onChange={(e) => handleFileChange(e, 'media')} accept="image/*,video/*" className="hidden" />
                <input type="file" ref={docInputRef} onChange={(e) => handleFileChange(e, 'doc')} accept=".pdf,.doc,.docx,.txt" className="hidden" />

                {shouldShowComposerActions && (
                  <div className={`flex items-center justify-between pt-2 mt-2 border-t animate-fade-in ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <button 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setIsTextareaFocused(true);
                        setIsComposerActive(true);
                        setIsUploadExpanded(!isUploadExpanded);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handlePostSubmit}
                      disabled={(!newPostText.trim() && !selectedFile) || isUploading}
                      className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-1.5 rounded-full text-xs font-semibold transition"
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isUploadExpanded && (
              <div className={`mt-3 p-3 rounded-2xl border animate-fade-in ${isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold">Upload Content</h3>
                    <p className="text-[11px] text-slate-500">Add to your post</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={triggerMediaUpload} className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed transition hover:border-violet-500 hover:bg-violet-500/5 ${isDarkMode ? 'border-white/20' : 'border-slate-300'}`}>
                    <ImageIcon className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-semibold">Photo/Video</span>
                  </button>
                  <button onClick={triggerDocUpload} className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed transition hover:border-violet-500 hover:bg-violet-500/5 ${isDarkMode ? 'border-white/20' : 'border-slate-300'}`}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold">Document</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {searchQuery && (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-gray-500">Showing results for "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="text-xs text-violet-500 hover:underline">Clear search</button>
            </div>
          )}

          {/* Post Feed */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const postComments = commentsByPost[post.id] || [];
                const isCommentsOpen = activeCommentPostId === post.id;
                
                // Find the active reaction object for this post
                const activeReaction = REACTIONS.find(r => r.id === post.userReaction);

                return (
                  <div key={post.id} className={`w-full p-4 sm:p-5 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
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
                      
                      {/* Reaction Button Wrapper */}
                      <div className="relative flex items-center">
                        
                        {/* The Popup Menu */}
                        {activeReactionPostId === post.id && (
                          <div 
                            className={`absolute -top-12 left-0 flex items-center gap-2 px-3 py-2 rounded-full shadow-xl animate-fade-in z-50 ${
                              isDarkMode ? 'bg-[#151125] border border-white/10 shadow-black/50' : 'bg-white border border-slate-200 shadow-slate-200'
                            }`}
                            onMouseLeave={() => setActiveReactionPostId(null)}
                          >
                            {REACTIONS.map(reaction => (
                              <button
                                key={reaction.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectReaction(post.id, reaction.id);
                                }}
                                className="text-2xl hover:scale-125 hover:-translate-y-1 transition-all duration-200 origin-bottom cursor-pointer"
                                title={reaction.label}
                              >
                                {reaction.emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* The Rendered Reaction Button */}
                        <button 
                          onMouseDown={() => handleInteractionStart(post.id)}
                          onMouseUp={() => handleInteractionEnd(post.id)}
                          onMouseLeave={handleInteractionCancel}
                          onTouchStart={() => handleInteractionStart(post.id)}
                          onTouchEnd={() => handleInteractionEnd(post.id)}
                          onTouchCancel={handleInteractionCancel}
                          onClick={(e) => e.preventDefault()}
                          className={`flex items-center gap-1.5 text-xs font-medium transition select-none ${
                            activeReaction ? activeReaction.color : 'text-gray-500 hover:text-pink-500'
                          }`}
                        >
                          {activeReaction ? (
                            <span className="text-[16px] leading-none transform scale-110">
                              {activeReaction.emoji}
                            </span>
                          ) : (
                            <Heart className="w-4 h-4 transition-transform" />
                          )}
                          <span className={activeReaction ? 'font-bold' : ''}>{post.likesCount}</span>
                        </button>
                      </div>

                      <button onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post.id)} className={`flex items-center gap-1.5 text-xs font-medium transition ${isCommentsOpen ? 'text-violet-500' : 'text-gray-500 hover:text-violet-500'}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-500 transition ml-auto">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>

                    {isCommentsOpen && (
                      <div className={`mt-4 rounded-2xl border p-3 space-y-3 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">Comments</p>
                          <span className="text-xs text-gray-500">{postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}</span>
                        </div>

                        <div className="space-y-2">
                          {postComments.length > 0 ? (
                            postComments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2">
                                <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                <div className={`flex-1 rounded-2xl px-3 py-2 ${isDarkMode ? 'bg-[#0B0914] text-gray-200' : 'bg-white text-slate-700'}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold">{comment.author.name}</span>
                                    <span className="text-[10px] text-gray-500">{comment.author.handle}</span>
                                  </div>
                                  <p className="text-sm leading-relaxed">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No comments yet — start the conversation.</p>
                          )}
                        </div>

                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={commentDrafts[post.id] || ''}
                            onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a comment..."
                            className={`flex-1 rounded-full border px-3 py-2 text-sm outline-none transition ${isDarkMode ? 'bg-[#0B0914] border-white/10 text-white placeholder-gray-500' : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'}`}
                          />
                          <button type="submit" className="rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                            Send
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>No posts found for "{searchQuery}".</p>
                <button onClick={() => setSearchQuery('')} className="mt-3 text-violet-500 hover:underline">Clear search</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden flex flex-col px-2 py-2 pb-3 border-t backdrop-blur-xl transition-colors ${
        isDarkMode ? 'bg-[#0B0914]/90 border-white/10' : 'bg-white/90 border-slate-200'
      }`}>
        {isBottomSearchOpen && (
          <div className={`mb-2 rounded-2xl border px-3 py-2 ${isDarkMode ? 'bg-[#151125] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center px-3 py-2 rounded-full border transition-colors ${
              isDarkMode ? 'bg-[#0B0914] border-white/10 focus-within:border-violet-500' : 'bg-white border-slate-200 focus-within:border-violet-500'
            }`}>
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, topics..."
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
        )}
        <div className="flex items-center justify-around">
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
              {renderNavIcon(item.icon, "w-5 h-5")}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setIsBottomSearchOpen((prev) => !prev)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Search</span>
        </button>
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
        </div>
      </nav>

      {/* RIGHT SIDEBAR (Fixed Desktop UI - Now strict non-scrollable) */}
      <aside className={`hidden lg:flex flex-col w-88 shrink-0 h-full border-l overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
          
          <div className="space-y-4 shrink-0">
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-3xl font-bold shadow-lg transition-transform hover:scale-[1.02]"
            >
              My Tasks
            </button>

            <div className={`flex justify-between items-center p-5 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <span className="text-[11px] text-gray-400 font-mono block mb-1">Weekly Avg Rank</span>
                <span className="font-bold text-sm flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Top 5%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-400 font-mono block mb-1">Classroom Level</span>
                <span className="font-bold text-sm text-violet-500 font-mono">Lvl 14</span>
              </div>
            </div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-4 shadow-sm shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h4 className="font-bold text-sm">Trending Topics</h4>
            </div>
            <div className="space-y-2">
              {TRENDING_TOPICS.slice(0, 4).map(topic => (
                <div 
                  key={topic.tag} 
                  onClick={() => setSearchQuery(topic.tag)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition duration-150 cursor-pointer group ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'}`}
                >
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-violet-500 transition">{topic.tag}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{topic.count} studies</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-5 shadow-sm shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-violet-500" />
              <h4 className="font-bold text-sm">Suggested Scholars</h4>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Dr. Alan Watts', handle: '@alan_physics', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
                { name: 'Maria Garcia', handle: '@maria_designs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h5 className={`text-xs font-bold group-hover:text-violet-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h5>
                      <p className="text-[10px] text-gray-500">{user.handle}</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-violet-600 bg-violet-500/10 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-xl transition-colors">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-4 shadow-sm transition-colors duration-300 mt-auto shrink-0 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-pink-500" />
                <h4 className="font-bold text-sm">Upcoming</h4>
              </div>
              <span className="text-[10px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-md">2 Due</span>
            </div>
            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 cursor-pointer'}`}>
                 <div className="p-2 bg-pink-500/10 text-pink-500 rounded-xl shrink-0 mt-0.5">
                   <Clock className="w-4 h-4" />
                 </div>
                 <div>
                   <h5 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Physics Midterm</h5>
                   <p className="text-[10px] text-gray-500 mt-0.5">Tomorrow, 10:00 AM</p>
                 </div>
              </div>
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