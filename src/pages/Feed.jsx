import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Feed.css';
import {
  Home,
  BookOpen,
  Trophy,
  Compass,
  MessageSquare,
  Bell,
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
  Clock,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  Eye,
  GraduationCap
} from 'lucide-react';

export const LOGGED_IN_USER = {
  id: 'user-101',
  name: 'Anuj Majumder',
  handle: '@anuj_studies',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6GQPuT9G2O8DX58cFVWI_LiXKFgMBJA4LQnDlImQrrg&s=100'
};

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home', targetRoute: '/home' },
  { id: 'explore', label: 'Explore', icon: 'Compass', targetRoute: '/explore' },
  { id: 'resources', label: 'Resources', icon: 'BookOpen', targetRoute: '/resources' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy', targetRoute: '/leaderboard' }
];

export const POST_FILTERS = ['All', 'Recent', 'Most Liked', 'My Batch'];

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

const NOTIFICATION_LIST = [
  { id: 'notif-1', sender: 'Sarah Chen', action: 'shared a new cheat sheet', target: 'MachineLearning', read: false, time: '10m ago' },
  { id: 'notif-2', sender: 'Michael Torres', action: 'liked your study update', target: 'Deep Learning notes', read: false, time: '1h ago' },
  { id: 'notif-3', sender: 'Admin', action: 'announced: StudyTrail Weekly Marathon starting tomorrow!', target: '', read: true, time: '1d ago' }
];

const TRENDING_TOPICS = [
  { tag: '#MachineLearning', count: 124 },
  { tag: '#HumanAnatomy', count: 86 },
  { tag: '#QuantumMechanics', count: 54 },
  { tag: '#FigmaDesign', count: 42 },
  { tag: '#React19', count: 38 }
];

const INITIAL_COMMENTS = {
  'post-1': [
    { id: 'c1', author: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', text: 'This visual guide is incredibly helpful! Can you upload the PDF?', time: '1h ago' },
    { id: 'c2', author: 'Emily Watson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80', text: 'Love the color coding approach Sarah!', time: '45m ago' }
  ],
  'post-2': [
    { id: 'c3', author: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', text: 'Downloading this immediately. You saved my life!', time: '3h ago' }
  ],
  'post-3': [
    { id: 'c4', author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', text: 'The wave function explanation was super clear, thank you!', time: '12h ago' }
  ]
};

const REACTION_OPTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '💡', label: 'Insight' },
  { emoji: '❤️', label: 'Love' }
];

export default function Feed() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);

  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newCommentTexts, setNewCommentTexts] = useState({});
  const [commentsOpen, setCommentsOpen] = useState({});

  const [notificationCount, setNotificationCount] = useState(2);
  const [notifications, setNotifications] = useState(NOTIFICATION_LIST);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [imageLightbox, setImageLightbox] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('/home');
  const [reactionPickerPostId, setReactionPickerPostId] = useState(null);

  const [checklist, setChecklist] = useState([
    { id: 'check-1', text: 'Revise Machine Learning neural backprop notes', done: true },
    { id: 'check-2', text: 'Complete Anatomy heart labels', done: true },
    { id: 'check-3', text: 'Solve quantum physics double-slit worksheet', done: false }
  ]);

  const mediaInputRef = useRef(null);
  const docInputRef = useRef(null);
  const reactionHoldTimerRef = useRef(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      if (reactionHoldTimerRef.current) {
        clearTimeout(reactionHoldTimerRef.current);
      }
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleNavigation = (route) => {
    setCurrentRoute(route);
    if (route === '/explore' || route === '/home') {
      setCurrentFilter('All');
      setSearchQuery('');
      showToast(route === '/explore' ? 'Redirected to Explore Feed!' : 'Navigated to Home Feed');
    } else {
      showToast(`Navigated to ${route} (Simulated Route Change)`);
    }
  };

  const handleToggleCheck = (id) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.done;
        showToast(nextState ? 'Task completed!' : 'Task incomplete');
        return { ...item, done: nextState };
      }
      return item;
    }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.contentText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.studyTopicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.fileName && post.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentFilter === 'All') return matchesSearch;
    if (currentFilter === 'Recent') return matchesSearch;
    if (currentFilter === 'Most Liked') return matchesSearch && post.likesCount > 20;
    if (currentFilter === 'My Batch') return matchesSearch && (post.studyTopicTag === '#MachineLearning' || post.studyTopicTag === '#QuantumMechanics');
    
    return matchesSearch;
  });

  const sortedAndFilteredPosts = [...filteredPosts].sort((a, b) => {
    if (currentFilter === 'Most Liked') {
      return b.likesCount - a.likesCount;
    }
    return 0;
  });

  const handleLikeToggle = (postId, reaction = null) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;

        if (reaction) {
          const alreadyReactedWithSameEmoji = post.isLikedByMe && post.reactionEmoji === reaction.emoji;
          if (alreadyReactedWithSameEmoji) {
            return post;
          }

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

    const actionText = reaction ? `Reacted with ${reaction.label}` : 'Post liked';
    showToast(actionText);
  };

  const startReactionHold = (postId) => {
    if (reactionHoldTimerRef.current) {
      clearTimeout(reactionHoldTimerRef.current);
    }
    suppressClickRef.current = false;
    reactionHoldTimerRef.current = setTimeout(() => {
      setReactionPickerPostId(postId);
      suppressClickRef.current = true;
    }, 400);
  };

  const cancelReactionHold = () => {
    if (reactionHoldTimerRef.current) {
      clearTimeout(reactionHoldTimerRef.current);
      reactionHoldTimerRef.current = null;
    }
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

  const triggerMediaUpload = () => {
    mediaInputRef.current?.click();
  };

  const triggerDocUpload = () => {
    docInputRef.current?.click();
  };

  const handleFileChange = (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    let fileType = 'document';

    if (category === 'media') {
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      }
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
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const extractHashtag = (text) => {
    const match = text.match(/#\w+/);
    return match ? match[0] : '#GeneralStudy';
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedFile) {
      showToast('Error: Post update cannot be empty!');
      return;
    }

    const parsedTag = extractHashtag(newPostText);

    const newPost = {
      id: `custom-post-${Date.now()}`,
      author: {
        name: LOGGED_IN_USER.name,
        handle: LOGGED_IN_USER.handle,
        avatarUrl: LOGGED_IN_USER.avatarUrl
      },
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

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setSelectedFile(null);
    showToast('Success: Study update posted!');
  };

  const handleCommentSubmit = (postId) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: LOGGED_IN_USER.name,
      avatar: LOGGED_IN_USER.avatarUrl,
      text: text.trim(),
      time: 'Just now'
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return { ...post, commentsCount: post.commentsCount + 1 };
        }
        return post;
      })
    );

    setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
    showToast('Comment posted successfully');
  };

  const toggleComments = (postId) => {
    setCommentsOpen(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleShare = (post) => {
    const mockUrl = `${window.location.origin}/studytrail/post/${post.id}`;
    navigator.clipboard.writeText(mockUrl)
      .then(() => {
        showToast(`Copied post link to clipboard: ${post.studyTopicTag}`);
      })
      .catch(() => {
        showToast('Error: Failed to copy to clipboard');
      });
  };

  const handleDownload = (post) => {
    let downloadUrl = post.mediaUrl;
    
    if (!downloadUrl || (!downloadUrl.startsWith('blob:') && !downloadUrl.startsWith('http'))) {
      const textBlobContent = `StudyTrail Shared Material\n============================\nTopic: ${post.studyTopicTag}\nAuthor: ${post.author.name} (${post.author.handle})\nDate: ${post.timestamp}\n\nNotes:\n${post.contentText}\n\n---\nThank you for learning with StudyTrail!`;
      const blob = new Blob([textBlobContent], { type: 'text/plain' });
      downloadUrl = URL.createObjectURL(blob);
    }

    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    tempLink.download = post.fileName || `${post.studyTopicTag.replace('#', '')}_review_guide.txt`;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    showToast(`Downloading study document: "${post.fileName || 'notes.txt'}"`);
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
    showToast('All notifications marked as read');
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0B0914] text-white selection:bg-violet-600/30 selection:text-violet-200' 
        : 'bg-slate-50 text-slate-900 selection:bg-violet-600/10 selection:text-violet-900'
    }`}>
      {/* Global SVG gradients for reuse */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <linearGradient id="likeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      
      <aside id="studytrail-left-sidebar" className={`hidden md:flex flex-col w-64 shrink-0 justify-between p-6 h-full border-r transition-colors duration-300 ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="space-y-6">
          
          <Link to="/profile" className="flex items-center gap-3 mb-10 px-2 group">
            <div className={`p-2 rounded-xl border shadow-sm transition-colors ${
              isDarkMode 
                ? 'bg-white/10 border-white/10 text-white' 
                : 'bg-slate-200 border-slate-300 text-black'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-white">
                StudyTrail
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-300 group-hover:text-violet-300 transition-colors">
                Your study circle
              </span>
            </div>
          </Link>
          
          <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase px-2 block mb-3">NAVIGATION</span>
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = currentRoute === item.targetRoute;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.targetRoute)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 text-left cursor-pointer ${
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
          </nav>

          <div className={`rounded-2xl border p-4 space-y-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono uppercase block">STUDY PROGRESS</span>
            
            <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-300 ${
              isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-white border-slate-200'
            }`}>
              <div className={`p-2 rounded-lg shrink-0 ${
                isDarkMode ? 'bg-violet-950 text-violet-400 border border-violet-800/30' : 'bg-violet-50 text-violet-600'
              }`}>
                <Flame className="w-5 h-5 fill-violet-400/20" />
              </div>
              <div className="min-w-0">
                <h5 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12-Day Streak</h5>
                <p className="text-[10px] text-gray-400 truncate">Target matches goals!</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Weekly Target</span>
                <span className="text-violet-500 font-bold font-mono">78%</span>
              </div>
              <div className={`w-full rounded-full h-1.5 overflow-hidden border transition-colors duration-300 ${
                isDarkMode ? 'bg-[#0b0914] border-white/5' : 'bg-slate-200 border-slate-300'
              }`}>
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-colors duration-300 ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={LOGGED_IN_USER.avatarUrl}
              alt={LOGGED_IN_USER.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{LOGGED_IN_USER.name}</p>
              <p className="text-xs text-gray-400 truncate font-mono">{LOGGED_IN_USER.handle}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        <header className={`h-16 border-b flex items-center justify-between px-8 flex-shrink-0 transition-colors duration-300 ${
          isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
        }`}>
          
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study updates, topics..."
                className={`w-full border rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-[#151125] border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50' 
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500'
                }`}
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => showToast('Chat channel updates are currently idle')}
              className={`p-2 transition-colors relative cursor-pointer ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 transition-colors relative cursor-pointer ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-600 border-2 border-[#0B0914] rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                    {notificationCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div id="notifications-dropdown" className={`absolute right-0 mt-3 w-80 border rounded-2xl shadow-2xl p-4 z-50 transition-colors duration-300 ${
                  isDarkMode ? 'bg-[#151125] border-white/10' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-100">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    {notificationCount > 0 && (
                      <button onClick={markNotificationsRead} className="text-xs text-violet-500 hover:text-violet-600 transition font-semibold">
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-2 rounded-xl transition ${notif.read ? 'bg-transparent' : isDarkMode ? 'bg-white/5 border-l-2 border-violet-500' : 'bg-slate-50 border-l-2 border-violet-500'}`}>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{notif.sender}</span> {notif.action}{' '}
                          {notif.target && <span className="text-violet-500 font-mono">#{notif.target}</span>}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-1">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Link
                to="/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-violet-500/50 cursor-pointer flex items-center justify-center hover:ring-violet-400 transition"
                title="View Profile"
              >
                <img
                  src={LOGGED_IN_USER.avatarUrl}
                  alt={LOGGED_IN_USER.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-3 w-64 border rounded-2xl shadow-2xl p-4 z-50 transition-colors duration-300 ${
                  isDarkMode ? 'bg-[#151125] border-white/10' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center gap-3 border-b pb-3 mb-3 border-slate-100">
                    <img
                      src={LOGGED_IN_USER.avatarUrl}
                      alt={LOGGED_IN_USER.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{LOGGED_IN_USER.name}</h4>
                      <span className="text-xs text-gray-400 block font-mono">{LOGGED_IN_USER.handle}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between text-xs p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-slate-50 text-slate-600'}`}>
                      <span className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        Streak
                      </span>
                      <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12 Days</span>
                    </div>
                    <div className={`flex items-center justify-between text-xs p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-slate-50 text-slate-600'}`}>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-500" />
                        Studied
                      </span>
                      <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>24.5 hrs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className={`px-8 py-4 flex gap-2 overflow-x-auto border-b flex-shrink-0 scrollbar-none transition-colors duration-300 ${
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
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-6 pt-6">
          <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
            
            <div className="flex-1 w-full max-w-2xl space-y-6">
              
              <div className={`border rounded-3xl p-5 shadow-xl relative overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-100'
              }`}>
                <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600" />
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={LOGGED_IN_USER.avatarUrl}
                      alt={LOGGED_IN_USER.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder="What are you studying right now?"
                        className={`w-full bg-transparent border-none focus:ring-0 resize-none min-h-[60px] text-sm focus:outline-none ${
                          isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-slate-800 placeholder-slate-400'
                        }`}
                      />
                      <span className="text-[10px] text-gray-400 font-mono block mt-2">
                        Add hashtags like #MachineLearning to automatically tag your post.
                      </span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={mediaInputRef}
                    onChange={(e) => handleFileChange(e, 'media')}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={(e) => handleFileChange(e, 'doc')}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                      isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {selectedFile.type === 'image' && <ImageIcon className="w-4 h-4 text-violet-400 shrink-0" />}
                        {selectedFile.type === 'video' && <Eye className="w-4 h-4 text-violet-400 shrink-0" />}
                        {selectedFile.type === 'document' && <FileText className="w-4 h-4 text-emerald-500 shrink-0" />}
                        
                        <div className="truncate">
                          <p className={`text-xs truncate font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedFile.name}</p>
                          <span className="text-[10px] text-gray-400 font-mono block">{selectedFile.size} • {selectedFile.type.toUpperCase()}</span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className={`p-1 rounded-full transition ${
                          isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className={`flex justify-between items-center pt-4 border-t ${
                    isDarkMode ? 'border-white/5' : 'border-slate-100'
                  }`}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={triggerMediaUpload}
                        className={`flex items-center gap-2 text-xs transition-colors px-3 py-2 rounded-lg cursor-pointer ${
                          isDarkMode ? 'text-gray-400 hover:text-violet-400 hover:bg-white/5' : 'text-slate-500 hover:text-violet-600 hover:bg-slate-100'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 text-violet-500" />
                        <span>Media</span>
                      </button>
                      <button
                        type="button"
                        onClick={triggerDocUpload}
                        className={`flex items-center gap-2 text-xs transition-colors px-3 py-2 rounded-lg cursor-pointer ${
                          isDarkMode ? 'text-gray-400 hover:text-violet-400 hover:bg-white/5' : 'text-slate-500 hover:text-violet-600 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span>Doc</span>
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-900/20 text-white cursor-pointer"
                    >
                      Post Update
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                {sortedAndFilteredPosts.length === 0 ? (
                  <div className={`border rounded-3xl p-8 text-center space-y-3 ${
                    isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'
                  }`}>
                    <Search className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-medium">No study updates found matching "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentFilter('All');
                      }}
                      className="text-xs text-violet-500 font-semibold hover:underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  sortedAndFilteredPosts.map(post => {
                    const isCommentsOpen = !!commentsOpen[post.id];
                    const postComments = comments[post.id] || [];

                    return (
                      <div
                        key={post.id}
                        className={`border rounded-3xl p-5 shadow-xl space-y-4 transition-colors duration-300 ${
                          isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.author.avatarUrl}
                              alt={post.author.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/10 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{post.author.name}</h4>
                                <span className="text-violet-500 font-semibold text-xs font-mono">{post.studyTopicTag}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">{post.timestamp}</p>
                            </div>
                          </div>
                        </div>

                        <p className={`text-sm leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                          {post.contentText}
                        </p>

                        {post.mediaType !== 'none' && (
                          <div className={`mt-2 overflow-hidden rounded-2xl border bg-black/40 ${
                            isDarkMode ? 'border-white/5' : 'border-slate-100'
                          }`}>
                            {post.mediaType === 'image' && post.mediaUrl && (
                              <div className="relative group cursor-zoom-in">
                                <img
                                  src={post.mediaUrl}
                                  alt="Study Document Material"
                                  referrerPolicy="no-referrer"
                                  onClick={() => setImageLightbox(post.mediaUrl || null)}
                                  className="w-full max-h-[550px] object-contain block mx-auto"
                                />
                              </div>
                            )}

                            {post.mediaType === 'video' && post.mediaUrl && (
                              <video
                                controls
                                preload="metadata"
                                className="w-full max-h-[550px] object-contain focus:outline-none block mx-auto"
                                src={post.mediaUrl}
                              />
                            )}

                            {post.mediaType === 'document' && (
                              <div className={`flex items-center justify-between border p-4 rounded-2xl ${
                                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                              }`}>
                                <div className="flex items-center gap-4 overflow-hidden">
                                  <div className="w-10 h-12 bg-red-500/10 flex items-center justify-center rounded border border-red-500/20 shrink-0">
                                    <span className="text-red-500 font-bold text-xs uppercase font-mono">PDF</span>
                                  </div>
                                  <div className="truncate">
                                    <p className={`text-sm font-medium truncate font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{post.fileName || 'study-trail-materials.pdf'}</p>
                                    <p className="text-xs text-gray-400 font-mono">{post.fileSize || '2.0 MB'}</p>
                                  </div>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => handleDownload(post)}
                                  className="p-2.5 hover:bg-violet-50 rounded-full text-violet-500 transition-colors cursor-pointer"
                                  title="Download material"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`flex items-center gap-6 mt-5 pt-4 border-t ${
                          isDarkMode ? 'border-white/5' : 'border-slate-100'
                        }`}>
                          <div className="relative">
                            <button
                              type="button"
                              onMouseDown={() => startReactionHold(post.id)}
                              onMouseUp={cancelReactionHold}
                              onMouseLeave={cancelReactionHold}
                              onTouchStart={() => startReactionHold(post.id)}
                              onTouchEnd={cancelReactionHold}
                              onTouchCancel={cancelReactionHold}
                              onClick={(event) => handleLikeButtonClick(post.id, event)}
                              className={`flex items-center gap-2 text-xs font-semibold transition cursor-pointer rounded-full px-2 py-1 ${
                                post.isLikedByMe
                                  ? 'bg-red-500/10 text-red-500 shadow-sm shadow-red-500/10'
                                  : isDarkMode
                                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              {post.reactionEmoji ? (
                                <span className="text-base leading-none">{post.reactionEmoji}</span>
                              ) : (
                                <Heart
                                  key={post.isLikedByMe ? 'liked' : 'unliked'}
                                  className={`w-5 h-5 ${post.isLikedByMe ? 'animate-pop' : ''}`}
                                  fill={post.isLikedByMe ? 'url(#likeGradient)' : 'none'}
                                  stroke={post.isLikedByMe ? 'url(#likeGradient)' : 'currentColor'}
                                />
                              )}
                              <span className={`font-mono font-bold ${post.isLikedByMe ? 'text-red-500' : ''}`}>
                                {post.likesCount}
                              </span>
                            </button>

                            {reactionPickerPostId === post.id && (
                              <div className="reaction-picker absolute bottom-10 left-0 mb-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-xl z-20">
                                {REACTION_OPTIONS.map((reaction, index) => (
                                  <button
                                    key={reaction.emoji}
                                    type="button"
                                    onClick={() => handleReactionSelect(post.id, reaction)}
                                    className="reaction-option flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm transition-transform hover:scale-110"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                    title={reaction.label}
                                  >
                                    {reaction.emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className={`flex items-center gap-2 text-xs font-semibold transition cursor-pointer ${
                              isCommentsOpen ? 'text-violet-500' : 'text-gray-400'
                            }`}
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-mono">{post.commentsCount} Comments</span>
                          </button>

                          <button
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-slate-900 font-semibold transition ml-auto cursor-pointer"
                          >
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                          </button>
                        </div>

                        {isCommentsOpen && (
                          <div className={`border-t pt-4 space-y-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                              <img
                                src={LOGGED_IN_USER.avatarUrl}
                                alt={LOGGED_IN_USER.name}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-violet-500/25 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={newCommentTexts[post.id] || ''}
                                  onChange={(e) => setNewCommentTexts({ ...newCommentTexts, [post.id]: e.target.value })}
                                  placeholder="Write a comment..."
                                  className={`w-full border rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:border-violet-600 ${
                                    isDarkMode 
                                      ? 'bg-[#0B0914] text-white border-white/5 placeholder-gray-500' 
                                      : 'bg-slate-100 text-slate-900 border-slate-200 placeholder-slate-400'
                                  }`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCommentSubmit(post.id);
                                  }}
                                />
                                <button
                                  onClick={() => handleCommentSubmit(post.id)}
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-violet-500 hover:text-violet-600 transition"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {postComments.length > 0 && (
                              <div className="space-y-3 pl-2 max-h-48 overflow-y-auto pr-1">
                                {postComments.map(comment => (
                                  <div key={comment.id} className={`flex gap-2.5 items-start text-xs rounded-xl p-2.5 border ${
                                    isDarkMode ? 'bg-white/2 border-white/5' : 'bg-slate-50 border-slate-100'
                                  }`}>
                                    <img
                                      src={comment.avatar}
                                      alt={comment.author}
                                      className="w-7 h-7 rounded-full object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{comment.author}</span>
                                        <span className="text-[9px] text-gray-400 font-mono">{comment.time}</span>
                                      </div>
                                      <p className={`leading-relaxed text-xs mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{comment.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>

            <aside id="studytrail-right-sidebar" className="hidden lg:flex flex-col w-80 shrink-0 space-y-6">
              
              <div className={`border rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">Student HUD</h4>
                  <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                </div>

                <div className="space-y-3.5 relative">
                  <div className={`p-3.5 rounded-2xl space-y-2 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <span className="text-[10px] font-bold text-violet-500 font-mono uppercase tracking-wider block">DAILY STUDY TASKLIST</span>
                    
                    {checklist.map(item => (
                      <div key={item.id} className="flex items-start gap-2.5 text-xs py-1">
                        <button
                          type="button"
                          onClick={() => handleToggleCheck(item.id)}
                          className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            item.done
                              ? 'bg-violet-600 border-violet-500 text-white'
                              : isDarkMode 
                                ? 'border-white/10 text-transparent hover:border-violet-500' 
                                : 'border-slate-300 text-transparent hover:border-violet-500'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <span className={`leading-relaxed ${item.done ? 'text-gray-400 line-through' : isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={`flex justify-between items-center p-3 rounded-xl border transition-colors duration-300 ${
                    isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
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
              </div>

              <div className={`border rounded-3xl p-5 space-y-4 shadow-xl transition-colors duration-300 ${
                isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'
              }`}>
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
                        showToast(`Filtering posts for tag: ${topic.tag}`);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition duration-150 cursor-pointer group ${
                        isDarkMode ? 'bg-white/2 hover:bg-white/5 border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                      }`}
                    >
                      <span className="text-xs text-gray-400 group-hover:text-violet-500 transition font-mono">{topic.tag}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{topic.count} studies</span>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </div>

      </main>

      <footer id="studytrail-mobile-navigation" className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t py-2.5 px-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#151125]/95 backdrop-blur-lg border-white/5' : 'bg-white/95 backdrop-blur-lg border-slate-200'
      }`}>
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(item => {
            const isActive = currentRoute === item.targetRoute;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.targetRoute)}
                className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                  isActive ? 'text-violet-500 font-semibold' : 'text-gray-400 hover:text-violet-500'
                }`}
              >
                {renderNavIcon(item.icon)}
                <span className="text-[9px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {imageLightbox && (
        <div
          id="lightbox-backdrop"
          onClick={() => setImageLightbox(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <button
            onClick={() => setImageLightbox(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imageLightbox}
            alt="Full Preview Lightbox"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-violet-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-violet-500/50 text-xs font-semibold animate-slide-up"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
