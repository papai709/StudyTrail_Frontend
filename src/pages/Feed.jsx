import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import '../Feed.css';
import {
  Home, BookOpen, Trophy, Compass, MessageSquare, Search,
  Image as ImageIcon, FileText, Send, Heart, Share2, X, Check,
  Download, Flame, Sparkles, GraduationCap, Edit3, Upload, 
  MoreVertical, Menu, Sun, Moon, Bell, Users, UserPlus, Clock, 
  Lock, Globe, ChevronDown, ChevronUp,
  GlobeLock, Target,
  Smile, PlaySquare
} from 'lucide-react';

// ==========================================
// BACKEND INTEGRATION READY:
// Uncomment the line below when your Node.js backend is running
// import axios from 'axios'; 
// ==========================================


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
    id: 'post_123',
    author: {
      name: 'Sarah Chen',
      handle: '@sarah_codes',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
    },
    timestamp: '2 hours ago',
    studyTopicTag: '#MachineLearning',
    contentText: 'Finished drafting my visual cheat sheet for neural network backpropagation!\n\nLet me know if you want the PDF. The formulas are color-coded to match forward vs backward weight changes. 🧠📝',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    likesCount: 24,
    commentsCount: 5,
    userReaction: null,
    comments: [
      { id: 'c1', author: { name: 'Michael Torres', handle: '@mike_bio', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }, text: 'This is incredibly helpful! Thanks for sharing.', likes: 2, isLiked: false }
    ]
  },
  {
    id: 'post_124',
    author: {
      name: 'Michael Torres',
      handle: '@mike_bio',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
    },
    timestamp: '4 hours ago',
    studyTopicTag: '#HumanAnatomy',
    contentText: 'Sharing my handwritten summary sheet of the cardiovascular pathway structure for our upcoming biology midterm.\n\nHighly detailed, includes diagrams of heart chambers and valve actions. Good luck everyone! 🫀',
    mediaType: 'document',
    fileName: 'Cardiology_Handout_Review.pdf',
    fileSize: '1.8 MB',
    likesCount: 18,
    commentsCount: 3,
    userReaction: 'love',
    comments: []
  }
];

const SUGGESTED_SCHOLARS = [
  { id: 1, name: 'Dr. Alan Watts', handle: '@alan_physics', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 2, name: 'Maria Garcia', handle: '@maria_designs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
  { id: 3, name: 'Prof. Sarah Jen', handle: '@sarah_math', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 4, name: 'James Clear', handle: '@james_habits', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 5, name: 'Dr. Andrew H.', handle: '@andrew_neuro', avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?w=100&h=100&fit=crop' },
  { id: 6, name: 'Er. Ankandip Biswas', handle: '@Ankan_ui/ux', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop' },
  { id: 16, name: 'Er. Papai Debnath', handle: '@Papai_backend', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop' },
  { id: 7, name: 'Auth. Anuj Majumder', handle: '@Anuj_author', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { id: 8, name: 'Swarup Bhowmik', handle: '@Swarup_broker', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' },
  { id: 9, name: 'Mrinmoy Nandi', handle: '@Mrinmoy_player', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { id: 10, name: 'Ernold Mocks', handle: '@Ernnold_M', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop' },
  { id: 11, name: 'Shepard Butcher', handle: '@Butcher_Sheep', avatar: 'https://images.unsplash.com/photo-1583341612074-ccea5cd64f6a?w=100&h=100&fit=crop' },
];

const STORY_DATA_STATIC = [
  { id: 's2', name: 'Maria Garcia', username: '@Maria_maria', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', streak: 45 },
  { id: 's3', name: 'James Clear', username: '@James_Cl', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', streak: 21 },
  { id: 's4', name: 'Sarah Jen', username: '@Sarah_Jen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', streak: 14 },
  { id: 's5', name: 'Alan Watts', username: '@Alan_W', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', streak: 7 },
  { id: 's6', name: 'Ankandip B.', username: '@Ankan_ui/ux', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop', streak: 100 },
  { id: 's7', name: 'Papai Deb', username: '@Papai_backend', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop', streak: 2 },
  { id: 's8', name: 'Anuj Majumder', username: '@Anuj_author', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', streak: 30 },
  { id: 's9', name: 'Swarup Bhowmik', username: '@Swarup_broker', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', streak: 15 },
  { id: 's10', name: 'Mrinmoy Nandi', username: '@Mrinmoy_player', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', streak: 8 },
  { id: 's11', name: 'Ernold Mocks', username: '@Ernold_M', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', streak: 5 },
  { 
   id: 's-community', 
    name: 'Community', 
    username: 'Explore', 
    isCommunity: true,
    streak: 0 
  }
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

const QUICK_EMOJIS = ['👍', '🔥', '📚', '🧠', '✨', '💻', '💡', '🚀'];

const DUMMY_GIFS = [
  'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif', 
  'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', 
  'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' 
];

const renderCommentText = (text) => {
  if (!text) return null;
  const parts = text.split(/(@[\w_]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return <span key={i} className="text-violet-500 font-semibold">{part}</span>;
    }
    return part;
  });
};

export default function Feed() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [isFriendRequestsOpen, setIsFriendRequestsOpen] = useState(false);

const friendRequests = [
  {
    id: 1,
    name: "Sarah Chen",
    handle: "@sarah_codes",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
  {
    id: 2,
    name: "Michael Torres",
    handle: "@mike_bio",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
];
  
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLightbox, setImageLightbox] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('/home');
  
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileScholarsOpen, setIsMobileScholarsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [isBottomSearchOpen, setIsBottomSearchOpen] = useState(false);

  const [activeReactionPostId, setActiveReactionPostId] = useState(null);
  const pressTimer = useRef(null);
  
  const scholarsSectionRef = useRef(null);
  const storyScrollRef = useRef(null);
  const mediaInputRef = useRef(null);
  const docInputRef = useRef(null);
  const postTextareaRef = useRef(null);

  const [userStreak, setUserStreak] = useState(12);

  const storyData = [
    { id: 's1', name: 'Your StudyStreak', username: LOGGED_IN_USER.handle, avatar: LOGGED_IN_USER.avatarUrl, streak: userStreak, isSelf: true },
    ...STORY_DATA_STATIC
  ];

  const [goalForm, setGoalForm] = useState({ title: '', subject: '', deadline: '', isPublic: false });
  const [isGoalSubmitting, setIsGoalSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('studytrail_goals');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn('Failed to load saved goals', error);
    }
    return [];
  });

  const [commentsByPost, setCommentsByPost] = useState(() => Object.fromEntries(INITIAL_POSTS.map(post => [post.id, post.comments || []])));
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentMedia, setCommentMedia] = useState({}); 
  const [activeEmojiPicker, setActiveEmojiPicker] = useState({}); 
  const [activeGifPicker, setActiveGifPicker] = useState({});      

  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [phIndex, setPhIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isComposerActive, setIsComposerActive] = useState(false);
  
  const shouldShowComposerActions = isComposerActive || Boolean(newPostText.trim()) || Boolean(selectedFile) || isUploadExpanded;

  useEffect(() => {
    try {
      localStorage.setItem('studytrail_goals', JSON.stringify(goals));
    } catch (error) {
      console.warn('Failed to save goals', error);
    }
  }, [goals]);

  useEffect(() => {
    if (postTextareaRef.current) {
      postTextareaRef.current.style.height = 'auto';
      postTextareaRef.current.style.height = Math.max(postTextareaRef.current.scrollHeight, 40) + 'px';
    }
  }, [newPostText]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000); 
    return () => clearInterval(interval);
  }, []);

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

  const handleMouseDown = (e) => {
    const slider = storyScrollRef.current;
    if (!slider) return;
    let isDown = true;
    let startX = e.pageX - slider.offsetLeft;
    let scrollLeft = slider.scrollLeft;

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; 
      slider.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      isDown = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleCommunityClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(true);
      setIsMobileScholarsOpen(true);
      setTimeout(() => {
        const el = document.getElementById('mobile-scholars-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else {
      scholarsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scholarsSectionRef.current?.classList.add('ring-2', 'ring-violet-500');
      setTimeout(() => scholarsSectionRef.current?.classList.remove('ring-2', 'ring-violet-500'), 2000);
    }
  };

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

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalForm.title.trim() || !goalForm.subject.trim() || !goalForm.deadline) return;

    setIsGoalSubmitting(true);
    
    setTimeout(() => {
      const newGoal = {
        id: `goal-${Date.now()}`,
        title: goalForm.title.trim(),
        subject: goalForm.subject.trim(),
        deadline: goalForm.deadline, 
        isPublic: goalForm.isPublic,
        createdAt: Date.now(),
        completed: false
      };
      
      setGoals(prev => [newGoal, ...prev]);
      setGoalForm({ title: '', subject: '', deadline: '', isPublic: false });
      setIsGoalSubmitting(false);
    }, 2000);
  };

  const handleCompleteGoal = (goalId, createdAt) => {
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const isCompletable = currentTime >= (createdAt + threeHoursInMs);
    if (!isCompletable) return;
    
    setGoals(prev => prev.map(item => item.id === goalId ? { ...item, completed: !item.completed } : item));
    setUserStreak(prev => prev + 1); 
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return post.contentText.toLowerCase().includes(query) ||
      post.studyTopicTag.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query);
  });

  const handleLikeToggle = async (postId) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;
    
    const previousReaction = targetPost.userReaction; 
    const previousCount = targetPost.likesCount;
    const isRemoving = previousReaction !== null;
    const newReaction = isRemoving ? null : 'love'; 

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          userReaction: newReaction,
          likesCount: isRemoving ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
        };
      })
    );
  };

  const handleSelectReaction = async (postId, reactionId) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const previousReaction = targetPost.userReaction;
    const isRemoving = previousReaction === reactionId; 
    const newReaction = isRemoving ? null : reactionId;

    let newCount = targetPost.likesCount;
    if (!previousReaction && newReaction) newCount += 1;
    else if (previousReaction && !newReaction) newCount = Math.max(0, targetPost.likesCount - 1);

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        return { ...post, userReaction: newReaction, likesCount: newCount };
      })
    );
    setActiveReactionPostId(null);
  };

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
    if (activeReactionPostId === postId) return;
    handleLikeToggle(postId);
  };

  const handleInteractionCancel = () => { 
    if (pressTimer.current) { 
      clearTimeout(pressTimer.current); 
      pressTimer.current = null; 
    } 
  };

  const toggleCommentLike = (postId, commentId) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].map(c => 
        c.id === commentId 
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    }));
  };

  const handleCommentFileChange = (e, postId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCommentMedia(prev => ({ ...prev, [postId]: { file, previewUrl } }));
    setActiveEmojiPicker(prev => ({ ...prev, [postId]: false }));
    setActiveGifPicker(prev => ({ ...prev, [postId]: false }));
  };

  const removeCommentMedia = (postId) => {
    setCommentMedia(prev => {
      const newState = { ...prev };
      delete newState[postId];
      return newState;
    });
  };

  const insertEmoji = (postId, emoji) => {
    setCommentDrafts(prev => ({ ...prev, [postId]: (prev[postId] || '') + emoji }));
    setActiveEmojiPicker(prev => ({ ...prev, [postId]: false }));
  };

  const insertGif = (postId, gifUrl) => {
    setCommentMedia(prev => ({ ...prev, [postId]: { file: null, previewUrl: gifUrl, isGif: true } }));
    setActiveGifPicker(prev => ({ ...prev, [postId]: false }));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const trimmedComment = (commentDrafts[postId] || '').trim();
    const attachedMedia = commentMedia[postId];
    
    if (!trimmedComment && !attachedMedia) return;

    setCommentsByPost(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { 
        id: `comment-${Date.now()}`, 
        author: { name: LOGGED_IN_USER.name, handle: LOGGED_IN_USER.handle, avatarUrl: LOGGED_IN_USER.avatarUrl }, 
        text: trimmedComment,
        mediaUrl: attachedMedia?.previewUrl,
        likes: 0,
        isLiked: false
      }]
    }));

    setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, commentsCount: (post.commentsCount || 0) + 1 } : post));
    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
    removeCommentMedia(postId); 
  };

  const handleReplyClick = (postId, userHandle) => {
    setCommentDrafts(prev => {
      const currentText = prev[postId] || '';
      const mention = `${userHandle} `;
      if (currentText.includes(mention)) return prev;
      return { ...prev, [postId]: currentText ? `${currentText} ${mention}` : mention };
    });

    setTimeout(() => {
      const input = document.getElementById(`comment-input-${postId}`);
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    }, 50);
  };

  const triggerMediaUpload = () => {
    setActiveEmojiPicker({});
    setActiveGifPicker({});
    mediaInputRef.current?.click();
  };
  const triggerDocUpload = () => {
    setActiveEmojiPicker({});
    setActiveGifPicker({});
    docInputRef.current?.click();
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
    setSelectedFile({ fileObj: file, name: file.name, type: fileType, previewUrl, size: sizeStr });
    setIsUploadExpanded(false);
  };

  const removeAttachment = () => {
    if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
    setSelectedFile(null);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handlePostSubmit = async (e) => {
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
      userReaction: null, 
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

  const todayGoals = goals.filter(g => new Date(g.createdAt).toDateString() === new Date().toDateString());
  const canAddMoreGoals = todayGoals.length < 2;

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
                        ? 'text-gray-400 hover:text-white hover:bg-white/10 border-l-4 border-transparent hover:translate-x-1'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent hover:translate-x-1'
                  }`}
                >
                  {renderNavIcon(item.icon, "w-5 h-5")}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`rounded-3xl border p-5 space-y-4 shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-md mt-auto ${
            isDarkMode ? 'bg-white/5 border-white/5 shadow-white/5' : 'bg-slate-100 border-slate-200 shadow-slate-200'
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
                <h5 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userStreak}-Day Streak</h5>
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
            <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              &copy; 2026 StudyTrail
            </div>
            <div className="flex gap-2 text-[10px]">
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
                    <h5 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userStreak}-Day Streak</h5>
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

              <div id="mobile-scholars-section" className={`border rounded-3xl p-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#151125] border-white/5' : 'bg-white border-slate-200'}`}>
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setIsMobileScholarsOpen(!isMobileScholarsOpen)}
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-violet-500" />
                    <h4 className="font-bold text-sm">Suggested Scholars</h4>
                  </div>
                  {isMobileScholarsOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-violet-500 transition-colors" />}
                </div>
                
                {isMobileScholarsOpen && (
                  <div className="space-y-4 mt-5 max-h-[40vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
                    {SUGGESTED_SCHOLARS.map((user) => (
                      <div key={user.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                          <div>
                            <h5 className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h5>
                            <p className="text-[10px] text-gray-500">{user.handle}</p>
                          </div>
                        </div>
                        <button className="text-[10px] font-bold text-violet-600 bg-violet-500/10 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-xl transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsGoalModalOpen(true); }} 
                className="w-full py-4 rounded-2xl font-bold text-white shadow-md bg-violet-600 hover:bg-violet-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Set Goal
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
                      <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>X</a>
                      <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>in</a>
                      <a href="#" className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 text-slate-500 hover:text-slate-900'}`}>IG</a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-16 lg:pb-0">
        
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

            {/* Friend Requests */}
<div className="relative">
  <button
    onClick={() =>
      setIsFriendRequestsOpen(!isFriendRequestsOpen)
    }
    className={`p-2 rounded-full transition-colors relative ${
      isDarkMode
        ? "hover:bg-white/10 text-gray-300"
        : "hover:bg-slate-200 text-slate-600"
    }`}
  >
    <UserPlus className="w-5 h-5" />

    {friendRequests.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
        {friendRequests.length}
      </span>
    )}
  </button>

  {isFriendRequestsOpen && (
    <div
      className={`absolute right-0 mt- w-75 rounded-2xl border shadow-xl overflow-hidden z-50 ${
        isDarkMode
          ? "bg-[#151125] border-white/10"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm">
          Friend Requests
        </h3>

        <button
          onClick={() => setIsFriendRequestsOpen(false)}
          className="text-gray-400 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {friendRequests.map((user) => (
          <div
            key={user.id}
            className={`flex items-center justify-between px-4 py-3 ${
              isDarkMode
                ? "hover:bg-white/5"
                : "hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-medium text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.handle}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700">
                Accept
              </button>

              <button
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  isDarkMode
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              >
                Ignore
              </button>
            </div>
          </div>
        ))}

        {friendRequests.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No pending requests
          </div>
        )}
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
          
          {/* Center Aligned Study Streak Section with full names and dynamic gradient borders */}
          <div className="w-full flex justify-center">
             <div 
              ref={storyScrollRef}
              onMouseDown={handleMouseDown}
              className="story-container flex gap-4 py-3 items-start w-full max-w-4xl no-scrollbar pb-2 select-none cursor-grab active:cursor-grabbing">
              {storyData.map((story) => (
                <div 
                  key={story.id} 
                  onClick={() => { if (story.isCommunity) handleCommunityClick(); }}
                  className={`flex flex-col items-center justify-start gap-1.5 shrink-0 ${story.isCommunity ? 'cursor-pointer' : 'cursor-default'} group snap-start`}
                >
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                      story.isCommunity
                        ? isDarkMode ? 'bg-[#151125] border-2 border-white/10' : 'bg-white border-2 border-slate-200'
                        : story.streak > 0 
                          ? `bg-gradient-to-tr ${story.isSelf ? (isDarkMode ? 'from-gray-600 to-gray-700' : 'from-gray-300 to-gray-400') : 'from-orange-500 via-pink-500 to-violet-500'}`
                          : (isDarkMode ? 'bg-transparent border-2 border-white/10' : 'bg-transparent border-2 border-slate-200')
                    }`}>
                      {story.isCommunity ? (
                        <Users className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
                      ) : (
                        <img src={story.avatar} alt={story.name} className={`w-full h-full rounded-full object-cover pointer-events-none border-2 ${isDarkMode ? 'border-[#0B0914]' : 'border-white'}`} />
                      )}
                    </div>
                    
                    {!story.isCommunity && story.streak > 0 && (
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0B0914] rounded-full p-0.5 transition-colors duration-300">
                        <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/30">
                          <Flame className="w-2.5 h-2.5 fill-orange-500" />
                          <span className="text-[10px] font-bold">{story.streak}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-medium w-20 wrap-break-word text-center transition-colors duration-300 leading-tight ${
                    story.isCommunity 
                      ? (isDarkMode ? 'text-white' : 'text-slate-900') 
                      : (isDarkMode ? 'text-gray-300' : 'text-slate-700')
                  }`}>
                    {story.isCommunity ? 'More Streaks?' :(story.isSelf ? 'You' : story.username)
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

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
                  className={`w-full bg-transparent resize-none outline-none text-sm leading-relaxed py-1.5 transition-all duration-300 whitespace-pre-wrap ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                  rows="1"
                />
                
                {/* Visual Attachment Preview Canvas */}
                {selectedFile && (
                  <div className="relative mt-3 mb-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-w-full bg-slate-100 dark:bg-white/5">
                    {selectedFile.type === 'image' && (
                      <div className="relative">
                        <img 
                          src={selectedFile.previewUrl} 
                          alt="Upload preview" 
                          className="w-full max-h-64 object-cover" 
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium">
                          {selectedFile.size}
                        </div>
                      </div>
                    )}
                    {selectedFile.type === 'video' && (
                      <div className="relative">
                        <video 
                          src={selectedFile.previewUrl} 
                          controls 
                          className="w-full max-h-64 object-cover" 
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium">
                          {selectedFile.size}
                        </div>
                      </div>
                    )}
                    {selectedFile.type === 'document' && (
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate pr-2">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{selectedFile.size}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeAttachment(); }} 
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition shadow-md"
                    >
                      <X className="w-4 h-4" />
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
                        setActiveEmojiPicker({});
                        setActiveGifPicker({});
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{post.contentText}</p>
                    </div>

                    {post.mediaType === 'image' && post.mediaUrl && (
                      <div className="mb-4 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 cursor-zoom-in" onClick={() => setImageLightbox(post.mediaUrl)}>
                        <img src={post.mediaUrl} alt="Post material" className="w-full h-auto max-h-96 object-cover hover:scale-[1.02] transition duration-500" />
                      </div>
                    )}

                    {post.mediaType === 'video' && post.mediaUrl && (
                      <div className="mb-4 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-black">
                        <video src={post.mediaUrl} controls className="w-full h-auto max-h-96 object-contain" />
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
                      <div 
                        className="relative flex items-center"
                        onMouseLeave={() => setActiveReactionPostId(null)}
                      >
                        {activeReactionPostId === post.id && (
                          <div 
                            className={`absolute -top-12 left-0 flex items-center gap-2 px-3 py-2 rounded-full shadow-xl animate-fade-in reaction-picker z-50 ${
                              isDarkMode ? 'bg-[#151125] border border-white/10 shadow-black/50' : 'bg-white border border-slate-200 shadow-slate-200'
                            }`}
                            onTouchMove={(e) => {
                              const touch = e.touches[0];
                              const element = document.elementFromPoint(touch.clientX, touch.clientY);
                              document.querySelectorAll('.reaction-emoji').forEach(el => el.classList.remove('scale-125', '-translate-y-1'));
                              if (element && element.classList.contains('reaction-emoji')) {
                                element.classList.add('scale-125', '-translate-y-1');
                              }
                            }}
                            onTouchEnd={(e) => {
                              const touch = e.changedTouches[0];
                              const element = document.elementFromPoint(touch.clientX, touch.clientY);
                              if (element && element.dataset.reactionId) {
                                handleSelectReaction(post.id, element.dataset.reactionId);
                              } else {
                                setActiveReactionPostId(null);
                              }
                            }}
                          >
                            {REACTIONS.map(reaction => (
                              <button
                                key={reaction.id}
                                data-reaction-id={reaction.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectReaction(post.id, reaction.id);
                                }}
                                className="reaction-emoji text-2xl p-1 hover:scale-125 hover:-translate-y-1 transition-all duration-200 origin-bottom cursor-pointer"
                                title={reaction.label}
                              >
                                {reaction.emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        <button 
                          onMouseDown={() => handleInteractionStart(post.id)}
                          onMouseUp={() => handleInteractionEnd(post.id)}
                          onMouseLeave={handleInteractionCancel}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            handleInteractionStart(post.id);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            handleInteractionEnd(post.id);
                          }}
                          onTouchCancel={(e) => {
                            e.preventDefault();
                            handleInteractionCancel();
                          }}
                          onClick={(e) => e.preventDefault()}
                          className={`flex items-center gap-1.5 text-xs font-medium transition select-none touch-none ${
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

                    {/* COMMENTS SECTION */}
                    {isCommentsOpen && (
                      <div className={`mt-4 rounded-2xl border p-3 space-y-3 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">Comments</p>
                          <span className="text-xs text-gray-500">{postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}</span>
                        </div>

                        <div className="space-y-3">
                          {postComments.length > 0 ? (
                            postComments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2">
                                <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
                                <div className="flex-1 min-w-0 flex flex-col items-start">
                                  <div className={`inline-block max-w-[95%] rounded-2xl px-3 py-2 ${isDarkMode ? 'bg-[#0B0914] text-gray-200' : 'bg-white text-slate-700 shadow-sm border border-slate-100'} w-fit`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold">{comment.author.name}</span>
                                      <span className="text-[10px] text-gray-500">{comment.author.handle}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                                      {renderCommentText(comment.text)}
                                    </p>
                                    {comment.mediaUrl && (
                                   <div
                                    className="mt-2 cursor-zoom-in" onClick={() => setImageLightbox(comment.mediaUrl)}>
                                  <img src={comment.mediaUrl}
                                    alt="Comment Attachment"className="rounded-lg max-h-32 object-contain hover:scale-[1.02] transition"/>
                                  </div>
                                  )}
                                  </div>
                                  <div className="flex items-center gap-3 px-2 mt-1">
                                    <button 
                                      onClick={() => toggleCommentLike(post.id, comment.id)}
                                      className={`text-[10px] font-semibold transition-colors flex items-center gap-1 ${comment.isLiked ? 'text-pink-500' : (isDarkMode ? 'text-gray-400 hover:text-pink-400' : 'text-gray-500 hover:text-pink-500')}`}
                                    >
                                      <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-pink-500' : ''}`} />
                                      {comment.likes > 0 ? comment.likes : 'Like'}
                                    </button>
                                    <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                                    <button 
                                      onClick={() => handleReplyClick(post.id, comment.author.handle)}
                                      className={`text-[10px] font-semibold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-violet-400' : 'text-gray-500 hover:text-violet-500'}`}
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No comments yet — start the conversation.</p>
                          )}
                        </div>

                        {commentMedia[post.id] && (
                          <div className="relative mt-2 p-2 rounded-lg inline-block bg-slate-200 dark:bg-white/10 border dark:border-white/20">
                            <img src={commentMedia[post.id].previewUrl} alt="To attach" className="h-16 rounded" />
                            <button onClick={() => removeCommentMedia(post.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full"><X className="w-3 h-3" /></button>
                          </div>
                        )}

                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className={`comment-form-container mt-2 flex flex-col gap-2 rounded-2xl border px-2 py-1.5 transition ${isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-white border-slate-200'}`}>
                          <div className="flex w-full items-center">
                            <input
                              id={`comment-input-${post.id}`}
                              type="text"
                              value={commentDrafts[post.id] || ''}
                              onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Write a comment..."
                              className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder-gray-500 w-full"
                            />
                            <button type="submit" disabled={!(commentDrafts[post.id] || '').trim() && !commentMedia[post.id]} className="ml-1 rounded-full bg-violet-600 p-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50">
                              <Send className="w-4 h-4 ml-0.5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1.5 px-1 relative">
                            <input 
                              type="file" 
                              id={`comment-file-${post.id}`} 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleCommentFileChange(e, post.id)} 
                            />
                            <button 
                              type="button" 
                              onClick={() => document.getElementById(`comment-file-${post.id}`).click()} 
                              className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-slate-100'}`} 
                              title="Attach Photo"
                            >
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                            </button>

                            <div className="relative">
                              <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); setActiveGifPicker(activeGifPicker[post.id] ? {} : { [post.id]: true }); setActiveEmojiPicker({}); }}
                                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-slate-100'}`} 
                                title="GIF"
                              >
                                <PlaySquare className="w-4 h-4 text-emerald-500" />
                              </button>
                              
                              {activeGifPicker[post.id] && (
                                <div className={`absolute bottom-[110%] left-0 z-9999 w-48 p-2 rounded-xl border shadow-xl flex gap-2 ${isDarkMode ? 'bg-[#151125] border-white/10' : 'bg-white border-slate-200'}`} onClick={(e) => e.stopPropagation()}>
                                  {DUMMY_GIFS.map((gif, i) => (
                                    <img 
                                      key={i} 
                                      src={gif} 
                                      alt="gif" 
                                      className="w-14 h-14 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
                                      onClick={() => insertGif(post.id, gif)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); setActiveEmojiPicker(activeEmojiPicker[post.id] ? {} : { [post.id]: true }); setActiveGifPicker({}); }}
                                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-slate-100'}`} 
                                title="Emoji"
                              >
                                <Smile className="w-4 h-4 text-orange-500" />
                              </button>
                              
                              {activeEmojiPicker[post.id] && (
                                <div 
                                  className={`absolute bottom-[110%] left-0 z-9999 w-65 p-2 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-[#151125] border-white/10' : 'bg-white border-slate-200'}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {QUICK_EMOJIS.map(emoji => (
                                      <button 
                                        key={emoji} 
                                        type="button" 
                                        onClick={() => insertEmoji(post.id, emoji)}
                                        className="text-lg hover:scale-150 transition-transform flex items-center justify-center p-1"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
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

      {/* RIGHT SIDEBAR */}
      <aside className={`hidden lg:flex flex-col w-88 shrink-0 h-full border-l overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'border-white/5 bg-[#0B0914]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          
          <div className="shrink-0 space-y-4">
            <button 
              onClick={() => setIsGoalModalOpen(true)}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-3xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              <span>Set Weekly Goal</span>
            </button>

            <div className={`flex justify-between items-center p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              isDarkMode ? 'bg-white/5 border-white/10 shadow-white/5' : 'bg-slate-50 border-slate-200 shadow-slate-200'
            }`}>
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

          <div
              ref={scholarsSectionRef} 
              className={`border rounded-3xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md shrink min-h-0 overflow-hidden ${
             isDarkMode ? 'bg-[#151125] border-white/5 shadow-white/5' : 'bg-white border-slate-200 shadow-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 mb-4 shrink-0">
              <Users className="w-4 h-4 text-violet-500" />
              <h4 className="font-bold text-sm">Suggested Scholars</h4>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 flex-1 no-scrollbar h-full">
              {SUGGESTED_SCHOLARS.map((user) => (
                <div key={user.id} className="flex items-center justify-between group cursor-pointer">
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
        </div>
      </aside>

      {/* GOAL MODAL OVERLAY */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsGoalModalOpen(false)} />
          <div className={`relative w-full max-w-md p-6 rounded-3xl shadow-2xl z-10 ${isDarkMode ? 'bg-[#151125] text-white border border-white/10' : 'bg-white text-slate-900 border border-slate-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-xl">Set Goal</h2>
                <p className="text-xs text-violet-500 uppercase font-mono tracking-widest mt-1">Complete goals to earn EXP</p>
              </div>
              <button onClick={() => setIsGoalModalOpen(false)} className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              
              {canAddMoreGoals ? (
                <form onSubmit={handleGoalSubmit} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B0914] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Goal Title (e.g., Read Chapter 4)"
                      value={goalForm.title}
                      onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                        isDarkMode ? 'bg-[#151125] border-white/10 text-white placeholder-gray-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Subject"
                      value={goalForm.subject}
                      onChange={(e) => setGoalForm({ ...goalForm, subject: e.target.value })}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                        isDarkMode ? 'bg-[#151125] border-white/10 text-white placeholder-gray-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      required
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="date"
                        value={goalForm.deadline}
                        onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                          isDarkMode ? 'bg-[#151125] border-white/10 text-white placeholder-gray-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={goalForm.isPublic} 
                            onChange={(e) => setGoalForm({ ...goalForm, isPublic: e.target.checked })} 
                          />
                          <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${goalForm.isPublic ? 'bg-violet-600' : isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${goalForm.isPublic ? 'translate-x-2' : ''}`}></div>
                        </div>
                        <div className="ml-3 flex items-center gap-1.5 text-sm font-medium">
                          {goalForm.isPublic ? <Globe  className="w-4 h-4 text-violet-500" /> : <GlobeLock className="w-4 h-4 text-gray-500" />}
                          {goalForm.isPublic ? 'Public' : 'Private'}
                        </div>
                      </label>
                      
                      <button 
                        type="submit" 
                        disabled={isGoalSubmitting || !goalForm.title.trim() || !goalForm.subject.trim() || !goalForm.deadline}
                        className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-violet-700 disabled:opacity-50 transition min-w-25"
                      >
                        {isGoalSubmitting ? 'Loading...' : 'Add'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-[#0B0914] border-white/10 text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <p className="text-sm font-semibold">Daily Goal Limit Reached (2/2)</p>
                  <p className="text-xs mt-1">Come back tomorrow to set more goals!</p>
                </div>
              )}

              <div className="max-h-[35vh] overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {goals.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-4">No goals added yet.</p>
                ) : (
                  goals.map(goal => {
                    const threeHoursInMs = 3 * 60 * 60 * 1000;
                    const isCompletable = currentTime >= (goal.createdAt + threeHoursInMs);
                    
                    return (
                      <div key={goal.id} className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-[#0B0914] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <button
                          type="button"
                          onClick={() => handleCompleteGoal(goal.id, goal.createdAt)}
                          disabled={!isCompletable || goal.completed}
                          className={`w-6 h-6 mt-1 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                            goal.completed 
                              ? 'bg-violet-600 border-violet-500 text-white' 
                              : !isCompletable
                                ? 'border-gray-500/30 text-transparent opacity-50 cursor-not-allowed'
                                : isDarkMode 
                                  ? 'border-white/20 text-transparent hover:border-violet-500 cursor-pointer' 
                                  : 'border-slate-300 text-transparent hover:border-violet-500 cursor-pointer'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-semibold text-sm truncate ${goal.completed ? 'text-gray-500 line-through' : ''}`}>
                              {goal.title}
                            </p>
                            {goal.isPublic ? <Globe className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" /> : <GlobeLock className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-0.5">
                            {goal.subject} • Deadline: {formatDate(goal.deadline)} • Set: {new Date(goal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          
                          {!goal.completed && !isCompletable && (
                            <div className="mt-2 inline-flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                              <Clock className="w-3 h-3" />
                              Unlocks in 3 hrs
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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