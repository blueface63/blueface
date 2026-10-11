import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  signInWithGoogleChat,
  googleChatLogout,
  getCachedAccessToken,
  initGoogleAuth
} from '../services/googleAuth';
import {
  fetchGoogleChatSpaces,
  fetchGoogleChatMessages,
  sendGoogleChatMessage,
  createGoogleChatSpace,
  deleteGoogleChatMessage,
  fetchGoogleChatMembers,
  GoogleChatSpace,
  GoogleChatMessage,
  GoogleChatMember
} from '../services/googleChatApi';
import {
  X,
  Send,
  Plus,
  RefreshCw,
  MessageSquare,
  Users,
  ShieldCheck,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Hash,
  UserCheck,
  ChevronLeft,
  Lock,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleChatModal: React.FC<GoogleChatModalProps> = ({ isOpen, onClose }) => {
  const { user: appUser } = useApp();
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getCachedAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Spaces & Messages State
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<GoogleChatSpace | null>(null);
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [members, setMembers] = useState<GoogleChatMember[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // New Space Creation Modal State
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');
  const [isSubmittingSpace, setIsSubmittingSpace] = useState(false);

  // User Confirmation State for Destructive/Mutating Operations
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (u, t) => {
        setGoogleUser(u);
        setToken(t);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const res = await signInWithGoogleChat();
      setGoogleUser(res.user);
      setToken(res.accessToken);
    } catch (err: any) {
      console.error('Google Chat Sign In Failed:', err);
      setAuthError(err.message || 'Failed to sign in with Google. Please ensure popups are enabled.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await googleChatLogout();
    setGoogleUser(null);
    setToken(null);
    setSpaces([]);
    setSelectedSpace(null);
    setMessages([]);
  };

  // Load Spaces
  const loadSpaces = useCallback(async (authToken: string) => {
    setIsLoadingSpaces(true);
    try {
      const fetchedSpaces = await fetchGoogleChatSpaces(authToken);
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0 && !selectedSpace) {
        setSelectedSpace(fetchedSpaces[0]);
      }
    } catch (err: any) {
      console.warn('Could not fetch real spaces (possibly no spaces or permissions):', err);
      // If user has no spaces or enterprise domain restriction, offer default interactive investor space
      setSpaces([]);
    } finally {
      setIsLoadingSpaces(false);
    }
  }, [selectedSpace]);

  // Load Messages for Selected Space
  const loadMessages = useCallback(async (authToken: string, space: GoogleChatSpace) => {
    setIsLoadingMessages(true);
    try {
      const msgs = await fetchGoogleChatMessages(authToken, space.name);
      setMessages(msgs);
      // Also try to load members
      const mems = await fetchGoogleChatMembers(authToken, space.name).catch(() => []);
      setMembers(mems);
    } catch (err: any) {
      console.warn('Could not fetch messages:', err);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Sync Spaces on Token Change
  useEffect(() => {
    if (token && isOpen) {
      loadSpaces(token);
    }
  }, [token, isOpen, loadSpaces]);

  // Sync Messages on Selected Space Change
  useEffect(() => {
    if (token && selectedSpace) {
      loadMessages(token, selectedSpace);
    }
  }, [token, selectedSpace, loadMessages]);

  // Send Message with explicit user confirmation for sending if desired or direct send
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim() || !selectedSpace || !token) return;

    const textToSend = newMessageText.trim();
    setIsSending(true);

    try {
      const sent = await sendGoogleChatMessage(token, selectedSpace.name, textToSend);
      setMessages(prev => [...prev, sent]);
      setNewMessageText('');
    } catch (err: any) {
      alert(`Error sending message to Google Chat: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  // Create Space with Confirmation
  const handleConfirmCreateSpace = async () => {
    if (!newSpaceName.trim() || !token) return;
    setIsSubmittingSpace(true);
    try {
      const created = await createGoogleChatSpace(token, newSpaceName.trim(), newSpaceDesc.trim());
      setSpaces(prev => [created, ...prev]);
      setSelectedSpace(created);
      setIsCreatingSpace(false);
      setNewSpaceName('');
      setNewSpaceDesc('');
      setConfirmDialog(null);
    } catch (err: any) {
      alert(`Could not create Space: ${err.message || 'Permission denied'}`);
    } finally {
      setIsSubmittingSpace(false);
    }
  };

  // Delete message confirmation
  const handleDeleteMessage = (messageName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Google Chat Message?',
      description: 'Are you sure you want to permanently delete this message from Google Chat? This action cannot be undone.',
      confirmLabel: 'Delete Message',
      onConfirm: async () => {
        if (!token) return;
        try {
          await deleteGoogleChatMessage(token, messageName);
          setMessages(prev => prev.filter(m => m.name !== messageName));
        } catch (err: any) {
          alert(`Failed to delete message: ${err.message}`);
        } finally {
          setConfirmDialog(null);
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-white sm:rounded-3xl shadow-2xl h-[94vh] sm:h-[86vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-neutral-900 text-white p-4 flex items-center justify-between shrink-0 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Google Chat Integration
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  Official Workspace API
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Connect with investors, community channels &amp; official support via Google Chat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {googleUser && (
              <button
                onClick={handleLogout}
                title="Disconnect Google Chat"
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!token ? (
          /* ================= UN-AUTHENTICATED STATE (Sign in with Google) ================= */
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-neutral-50 overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600 shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Connect Your Google Chat
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mt-2 leading-relaxed">
              Sign in with your Google account to access your official Google Chat Spaces, join investor discussion channels, and message advisors directly.
            </p>

            {/* Official Material "Sign in with Google" button */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                id="google-chat-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-neutral-300 rounded-2xl shadow-md hover:shadow-lg hover:bg-neutral-50 active:scale-98 transition-all font-semibold text-neutral-700 text-sm cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              </button>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 max-w-sm flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-lg text-left">
              <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs">
                <span className="font-bold text-neutral-800 block mb-1">💬 Real-time Spaces</span>
                <span className="text-neutral-500 text-[11px]">Chat across investor rooms, DMs, and support topics in real-time.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs">
                <span className="font-bold text-neutral-800 block mb-1">🔒 Google Security</span>
                <span className="text-neutral-500 text-[11px]">Direct OAuth with user-controlled token management &amp; permissions.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs">
                <span className="font-bold text-neutral-800 block mb-1">📢 Community Feeds</span>
                <span className="text-neutral-500 text-[11px]">Receive updates on new mining equipment and dividend payouts.</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= AUTHENTICATED STATE (Chat Dashboard) ================= */
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-neutral-100">
            
            {/* Sidebar: Spaces List */}
            <div className={`w-full sm:w-64 bg-white border-r border-neutral-200 flex flex-col ${selectedSpace ? 'hidden sm:flex' : 'flex'}`}>
              
              {/* User Profile Bar */}
              <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={googleUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={googleUser?.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-neutral-300"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-neutral-900 truncate">
                      {googleUser?.displayName || 'Google User'}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {googleUser?.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => loadSpaces(token)}
                  title="Refresh Spaces"
                  className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-600 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpaces ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Spaces Header & Create Button */}
              <div className="p-3 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
                  Google Chat Spaces ({spaces.length})
                </span>
                <button
                  onClick={() => setIsCreatingSpace(true)}
                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3 h-3" /> New Space
                </button>
              </div>

              {/* Spaces List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {isLoadingSpaces && spaces.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">Loading your Spaces...</div>
                ) : spaces.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-2 text-neutral-400">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-neutral-700">No Chat Spaces Found</div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Create your first Space or investor room to begin chatting.
                    </p>
                    <button
                      onClick={() => setIsCreatingSpace(true)}
                      className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      + Create Space
                    </button>
                  </div>
                ) : (
                  spaces.map(space => {
                    const isSelected = selectedSpace?.name === space.name;
                    return (
                      <button
                        key={space.name}
                        onClick={() => setSelectedSpace(space)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                            : 'hover:bg-neutral-50 text-neutral-700 border border-transparent'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          <Hash className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs truncate">
                            {space.displayName || 'Direct Message / Space'}
                          </div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wide">
                            {space.spaceType || 'Space'}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Main Area: Active Space Conversation */}
            <div className={`flex-1 bg-white flex flex-col ${!selectedSpace ? 'hidden sm:flex' : 'flex'}`}>
              {selectedSpace ? (
                <>
                  {/* Space Conversation Header */}
                  <div className="p-3.5 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setSelectedSpace(null)}
                        className="sm:hidden p-1.5 rounded-lg bg-neutral-100 text-neutral-600"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-neutral-900 leading-tight">
                          {selectedSpace.displayName || 'Chat Conversation'}
                        </h4>
                        <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Google Chat API Connected • {members.length > 0 ? `${members.length} members` : 'Active'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => token && loadMessages(token, selectedSpace)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
                      title="Refresh Messages"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/60">
                    {isLoadingMessages && messages.length === 0 ? (
                      <div className="py-12 text-center text-xs text-neutral-400">Loading messages from Google Chat...</div>
                    ) : messages.length === 0 ? (
                      <div className="py-12 text-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <h5 className="font-bold text-sm text-neutral-800">Welcome to {selectedSpace.displayName || 'this Space'}!</h5>
                        <p className="text-xs text-neutral-500 mt-1">
                          No messages yet. Send a greeting or discuss Tkash mining plans with fellow participants.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMe = msg.sender?.email === googleUser?.email || msg.sender?.displayName === googleUser?.displayName;
                        const timeStr = msg.createTime
                          ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Just now';

                        return (
                          <div
                            key={msg.name || index}
                            className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isMe && (
                              <img
                                src={msg.sender?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                                alt={msg.sender?.displayName || 'Sender'}
                                className="w-7 h-7 rounded-full border border-neutral-200 mt-1 shrink-0"
                              />
                            )}

                            <div className="max-w-[80%] group relative">
                              <div className="text-[10px] text-neutral-400 mb-0.5 px-1 flex items-center gap-1.5">
                                <span className="font-bold text-neutral-700">{msg.sender?.displayName || 'User'}</span>
                                <span>{timeStr}</span>
                              </div>

                              <div
                                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                  isMe
                                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                                    : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs shadow-2xs'
                                }`}
                              >
                                {msg.text}
                              </div>

                              {/* Delete message action (with confirmation dialog) */}
                              {isMe && (
                                <button
                                  onClick={() => handleDeleteMessage(msg.name)}
                                  className="absolute top-4 -left-7 p-1 rounded-md text-neutral-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={e => setNewMessageText(e.target.value)}
                      placeholder={`Message ${selectedSpace.displayName || 'Space'}...`}
                      className="flex-1 px-4 py-2.5 bg-neutral-100 rounded-full text-xs text-neutral-900 border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={isSending || !newMessageText.trim()}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-full transition-all shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-xs">Select a Google Chat Space from the left sidebar to start messaging.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ================= CREATE SPACE MODAL ================= */}
      {isCreatingSpace && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-neutral-900">Create New Google Chat Space</h4>
              <button onClick={() => setIsCreatingSpace(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Space Name</label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={e => setNewSpaceName(e.target.value)}
                  placeholder="e.g. Tkash Diamond Investors Club"
                  className="w-full px-3.5 py-2 bg-neutral-50 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newSpaceDesc}
                  onChange={e => setNewSpaceDesc(e.target.value)}
                  placeholder="e.g. Daily yield discussions & mining updates"
                  className="w-full px-3.5 py-2 bg-neutral-50 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingSpace(false)}
                className="py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCreateSpace}
                disabled={isSubmittingSpace || !newSpaceName.trim()}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-colors"
              >
                {isSubmittingSpace ? 'Creating...' : 'Create Space'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANDATORY USER CONFIRMATION MODAL ================= */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150">
            <h4 className="font-extrabold text-sm text-neutral-900">{confirmDialog.title}</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">{confirmDialog.description}</p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
