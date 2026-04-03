import React, { useState, useRef, useMemo } from 'react';

// --- TYPES ---
type Badge = 'Idea Starter' | 'Community Voice' | 'Problem Solver' | 'Campus Guide';

interface CommunityUser {
    name: string;
    avatarColor: string;
    points?: number;
    badges?: Badge[];
}

interface PollOption {
    text: string;
    votes: number;
}

interface Poll {
    question: string;
    options: PollOption[];
}

interface ForumMessage {
    id: number;
    user: CommunityUser;
    text: string;
    image?: string;
    likes: number;
    isLiked: boolean;
    isHelpful?: boolean;
    poll?: Poll;
    votedOption?: number; // index of the voted option
}

interface Channel {
    id: string;
    name: string;
    description: string;
    allowHelpful?: boolean; // New property
}

type IdeaPipelineStage = 'Trending Ideas' | 'Under Review' | 'Approved & Planned' | 'In Progress' | 'Completed! 🎉';

interface IdeaCardData {
    id: number;
    messageId: number;
    title: string;
    submitter: CommunityUser;
    upvotes: number;
    stage: IdeaPipelineStage;
    reviewBy?: string;
    timeline?: string;
}


// --- MOCK DATA ---
const currentUser: CommunityUser = { name: 'You', avatarColor: 'bg-orange-200', points: 150, badges: ['Idea Starter', 'Problem Solver'] };

const mockUsers: CommunityUser[] = [
    { name: 'Sarah J.', avatarColor: 'bg-red-300', points: 250, badges: ['Community Voice'] },
    { name: 'Mike R.', avatarColor: 'bg-teal-300', points: 300, badges: ['Community Voice', 'Idea Starter'] },
    { name: 'Alex P.', avatarColor: 'bg-blue-300', points: 120, badges: ['Problem Solver'] },
    { name: 'Chloe T.', avatarColor: 'bg-purple-300', points: 80 },
    { name: 'David L.', avatarColor: 'bg-yellow-300', points: 180, badges: ['Problem Solver', 'Campus Guide'] },
    currentUser,
];

const channels: Channel[] = [
    { id: 'campus-feedback', name: '# campus-feedback', description: 'Post suggestions and upvote ideas you like!' },
    { id: 'event-ideas', name: '# event-ideas', description: 'Brainstorm and plan upcoming campus events.' },
    { id: 'study-groups', name: '# study-groups', description: 'Find partners for your courses.', allowHelpful: true },
    { id: 'lost-and-found', name: '# lost-and-found', description: 'Lost an item? Post here to find it.', allowHelpful: true },
    { id: 'general-discussion', name: '# general-discussion', description: 'Chat about anything campus-related.' },
];

const initialMessages: Record<string, ForumMessage[]> = {
    'campus-feedback': [
        { id: 1, user: mockUsers[0], text: 'Could we get more water coolers in the Tech Park building? It gets really busy during the day.', likes: 12, isLiked: false },
        { id: 2, user: mockUsers[1], text: "I'd love to see a 24/7 cafe open during exam season. Would be a lifesaver for late-night study sessions.", likes: 105, isLiked: true },
        { id: 3, user: currentUser, text: 'Great idea about the cafe, Mike! I completely agree.', likes: 26, isLiked: true },
    ],
    'event-ideas': [
        { id: 4, user: mockUsers[3], text: 'Movie night poll!', likes: 15, isLiked: false, poll: {
            question: "What kind of workshop should the Coding Club host next?",
            options: [{ text: "Intro to Docker", votes: 22 }, { text: "Advanced Git & GitHub", votes: 15 }, { text: "REST API with Node.js", votes: 30 }]
        }},
    ],
    'study-groups': [
         { id: 5, user: mockUsers[2], text: 'Anyone in CS101 wanna form a study group for the final exam?', likes: 5, isLiked: false, isHelpful: true },
    ],
    'lost-and-found': [],
    'general-discussion': [
        {
            id: 6, user: mockUsers[0], text: "Let's settle this once and for all!", likes: 42, isLiked: false, poll: {
                question: "Best biryani spot near campus?",
                options: [{ text: "SRM Hotel", votes: 18 }, { text: "Charcoal Eats", votes: 25 }, { text: "Real Ambur", votes: 12 }]
            }
        }
    ],
};

const staticIdeaCards: IdeaCardData[] = [
    { id: 101, messageId: 2, title: "24/7 cafe during exam season", submitter: mockUsers[1], upvotes: 105, stage: 'Under Review', reviewBy: 'Student Council' },
    { id: 102, messageId: -1, title: "More outdoor seating near library", submitter: mockUsers[0], upvotes: 88, stage: 'Approved & Planned', timeline: 'Next Semester' },
    { id: 103, messageId: -1, title: "Bike repair station installation", submitter: mockUsers[2], upvotes: 75, stage: 'In Progress' },
    { id: 104, messageId: -1, title: "Updated gym equipment", submitter: mockUsers[3], upvotes: 120, stage: 'Completed! 🎉' },
];


// --- ICONS ---
const ThumbsUpIcon: React.FC<{ active?: boolean }> = ({ active }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-white' : 'text-rose-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.22l-1.396-4.887A1 1 0 0012.382 11H9V6.5a1.5 1.5 0 00-3 0v3.833z" /></svg>;
const PaperClipIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const CloseIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const HelpfulIcon: React.FC<{ active?: boolean }> = ({ active }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-teal-500' : 'text-rose-300'}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const TrophyIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
const PipelineIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const DiscussionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>;

// --- SUB-COMPONENTS ---
const PollComponent: React.FC<{ message: ForumMessage, onVote: (pollId: number, optionIndex: number) => void }> = ({ message, onVote }) => {
    if (!message.poll) return null;
    const totalVotes = message.poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;

    return (
        <div className="mt-2 space-y-2">
            <p className="font-semibold">{message.poll.question}</p>
            {message.poll.options.map((option, index) => (
                <button key={index} onClick={() => onVote(message.id, index)} disabled={message.votedOption !== undefined} className="w-full text-left">
                    <div className="relative border border-rose-200 rounded-lg p-2 text-sm">
                        <div className="absolute top-0 left-0 h-full bg-rose-200 rounded-lg" style={{ width: `${(option.votes / totalVotes) * 100}%` }}></div>
                        <div className="relative flex justify-between">
                            <span>{option.text}</span>
                            <span>{option.votes}</span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

const IdeaCard: React.FC<{card: IdeaCardData}> = ({ card }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-lime-300">
        <p className="font-bold text-rose-800 dark:text-rose-200">{card.title}</p>
        <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">Submitted by {card.submitter.name} • {card.upvotes} upvotes</p>
        {card.reviewBy && <p className="text-xs mt-2"><strong>Reviewer:</strong> {card.reviewBy}</p>}
        {card.timeline && <p className="text-xs mt-1"><strong>Timeline:</strong> {card.timeline}</p>}
    </div>
);

const BadgeIcon: React.FC<{ badge: Badge }> = ({ badge }) => {
    const badgeStyles = {
        'Idea Starter': { icon: '💡', color: 'bg-yellow-200 text-yellow-800' },
        'Community Voice': { icon: '🔊', color: 'bg-blue-200 text-blue-800' },
        'Problem Solver': { icon: '✅', color: 'bg-teal-200 text-teal-800' },
        'Campus Guide': { icon: '🗺️', color: 'bg-green-200 text-green-800' },
    };
    return (
        <span title={badge} className={`text-xs px-1.5 py-0.5 rounded-full ${badgeStyles[badge].color} flex items-center`}>
            {badgeStyles[badge].icon}
        </span>
    );
};


const CommunityForum: React.FC = () => {
    type Tab = 'discussion' | 'pipeline' | 'leaders';
    const [activeTab, setActiveTab] = useState<Tab>('discussion');
    const [activeChannelId, setActiveChannelId] = useState<string>('campus-feedback');
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loggedInUser, setLoggedInUser] = useState<CommunityUser>(currentUser);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(currentUser.name);

    const activeChannel = channels.find(c => c.id === activeChannelId)!;
    
    // --- Data processing for new views ---
    const ideaCards = useMemo(() => {
        const trendingFromMessages: IdeaCardData[] = (messages['campus-feedback'] || [])
            .filter(msg => msg.likes > 25)
            .map(msg => ({
                id: msg.id,
                messageId: msg.id,
                title: msg.text,
                submitter: msg.user,
                upvotes: msg.likes,
                stage: 'Trending Ideas',
            }));
        
        const combined = [...staticIdeaCards, ...trendingFromMessages];
        const uniqueIds = new Set();
        return combined.filter(card => {
            if (uniqueIds.has(card.messageId)) return false;
            uniqueIds.add(card.messageId);
            return true;
        });
    }, [messages]);

    const ideatorLeaderboard = useMemo(() => [...mockUsers].sort((a, b) => (b.points || 0) - (a.points || 0)), []);
    const topHelpersLeaderboard = useMemo(() => {
        const helpers = [mockUsers[2], mockUsers[4], loggedInUser];
        return helpers.sort((a,b) => (b.points || 0) - (a.points || 0));
    }, [loggedInUser]);

    // --- Handlers ---
    const handleLike = (messageId: number) => {
        setMessages(prev => ({
            ...prev,
            [activeChannelId]: prev[activeChannelId].map(msg => msg.id === messageId ? { ...msg, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1, isLiked: !msg.isLiked } : msg),
        }));
    };

    const handleVote = (messageId: number, optionIndex: number) => {
        setMessages(prev => ({
            ...prev,
            [activeChannelId]: prev[activeChannelId].map(msg => {
                if (msg.id === messageId && msg.poll && msg.votedOption === undefined) {
                    const newOptions = [...msg.poll.options];
                    newOptions[optionIndex] = { ...newOptions[optionIndex], votes: newOptions[optionIndex].votes + 1 };
                    return { ...msg, poll: { ...msg.poll, options: newOptions }, votedOption: optionIndex };
                }
                return msg;
            }),
        }));
    };

    const handleMarkHelpful = (messageId: number) => {
        setMessages(prev => ({
             ...prev,
            [activeChannelId]: prev[activeChannelId].map(msg => msg.id === messageId ? {...msg, isHelpful: !msg.isHelpful} : msg)
        }));
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' && !imagePreview) return;
        const newMsg: ForumMessage = { id: Date.now(), user: loggedInUser, text: newMessage.trim(), image: imagePreview || undefined, likes: 0, isLiked: false };
        setMessages(prev => ({ ...prev, [activeChannelId]: [...(prev[activeChannelId] || []), newMsg] }));
        setNewMessage(''); setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const saveName = () => {
        if(tempName.trim()){
            setLoggedInUser({...loggedInUser, name: tempName.trim()});
        }
        setIsEditingName(false);
    };

    // --- Render Methods for Views ---
    const renderDiscussion = () => (
        <div className="w-full flex flex-col md:flex-row gap-6 h-full">
            {/* Sidebar with channels & profile */}
            <div className="w-full md:w-1/3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
                
                {/* User Profile Section */}
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-3">Your Profile</p>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${loggedInUser.avatarColor} flex items-center justify-center font-bold text-white shadow-inner`}>
                            {loggedInUser.name.charAt(0)}
                        </div>
                        {isEditingName ? (
                            <div className="flex-1 flex gap-2">
                                <input autoFocus type="text" value={tempName} onChange={(e)=>setTempName(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter') saveName()}} className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-blue-400 rounded focus:outline-none" />
                                <button onClick={saveName} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-between group">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{loggedInUser.name}</h4>
                                <button onClick={() => setIsEditingName(true)} className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Channels</h3>
                <div className="space-y-2 overflow-y-auto custom-scrollbar flex-grow pr-1">
                    {channels.map(channel => (
                        <button key={channel.id} onClick={() => setActiveChannelId(channel.id)} className={`w-full text-left px-4 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 ${activeChannelId === channel.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800/50' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}>
                            {channel.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main chat window */}
            <div className="w-full md:w-2/3 flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-t-2xl">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{activeChannel.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{activeChannel.description}</p>
                </div>
                <div className="flex-grow p-5 space-y-6 overflow-y-auto custom-scrollbar">
                    {(messages[activeChannelId] || []).map(msg => {
                        const isMe = msg.user.name === loggedInUser.name;
                        return (
                        <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full ${msg.user.avatarColor} flex items-center justify-center font-bold text-white shadow flex-shrink-0 text-sm`}>{msg.user.name.charAt(0)}</div>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 px-1">{msg.user.name}</p>
                                <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-slate-700'}`}>
                                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                                    {msg.image && <img src={msg.image} alt="Attachment" className="mt-3 rounded-lg max-h-60 object-cover shadow-sm border border-white/20" />}
                                    {msg.poll && <PollComponent message={msg} onVote={handleVote} />}
                                    
                                    <div className={`flex items-center gap-3 mt-3 pt-3 border-t ${isMe ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <button onClick={() => handleLike(msg.id)} className={`flex items-center gap-1.5 text-sm transition-opacity ${isMe ? 'hover:text-cyan-100' : 'hover:text-blue-500'}`}>
                                            <ThumbsUpIcon active={msg.isLiked} /> 
                                            <span className="font-medium">{msg.likes}</span>
                                        </button>
                                        {activeChannel.allowHelpful && (
                                            <button onClick={() => handleMarkHelpful(msg.id)} className={`flex items-center gap-1.5 text-sm transition-opacity ${isMe ? 'hover:text-teal-200' : 'hover:text-teal-500'}`}>
                                                <HelpfulIcon active={msg.isHelpful} /> 
                                                <span className="font-medium">Helpful</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl relative">
                    {imagePreview && (
                        <div className="absolute bottom-[105%] left-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl flex items-start gap-2 z-10 animate-fade-in-scale">
                            <img src={imagePreview} className="h-24 rounded-lg object-cover" alt="Preview"/>
                            <button onClick={() => {setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = "";}} className="bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 dark:bg-slate-700 rounded-full p-1.5 transition-colors">
                                <CloseIcon className="w-4 h-4 text-slate-600 dark:text-slate-300"/>
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="relative flex items-center bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 p-1.5">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 ml-1 text-slate-400 hover:text-blue-500 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Attach Image">
                            <PaperClipIcon />
                        </button>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setImagePreview(URL.createObjectURL(file));
                        }} />
                        
                        <input type="text" placeholder={`Message ${activeChannel.name}...`} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full bg-transparent py-2.5 px-3 focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"/>
                        
                        <button type="submit" disabled={!newMessage.trim() && !imagePreview} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md mr-1 shrink-0" aria-label="Send Message">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    const renderPipeline = () => {
        const stages: IdeaPipelineStage[] = ['Trending Ideas', 'Under Review', 'Approved & Planned', 'In Progress', 'Completed! 🎉'];
        return (
            <div className="w-full h-full overflow-x-auto custom-scrollbar pb-4">
                 <div className="flex gap-6 min-w-max h-full">
                    {stages.map(stage => (
                        <div key={stage} className="w-80 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex-shrink-0 flex flex-col shadow-sm">
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">{stage}</h3>
                                <span className="ml-auto text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">{ideaCards.filter(c => c.stage === stage).length}</span>
                            </div>
                            <div className="space-y-4 overflow-y-auto flex-grow custom-scrollbar pr-1">
                                {ideaCards.filter(c => c.stage === stage).map(card => (
                                    <div key={card.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
                                        <p className="font-bold text-slate-800 dark:text-slate-100 mb-2 leading-snug">{card.title}</p>
                                        <div className="flex items-center justify-between mt-3 text-xs">
                                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                                                <div className={`w-5 h-5 rounded-full ${card.submitter.avatarColor} flex items-center justify-center text-[10px] text-white`}>{card.submitter.name.charAt(0)}</div>
                                                {card.submitter.name}
                                            </span>
                                            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.22l-1.396-4.887A1 1 0 0012.382 11H9V6.5a1.5 1.5 0 00-3 0v3.833z" /></svg>
                                                {card.upvotes}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderLeaders = () => {
        const rankClasses: { [key: number]: string } = {
            1: 'border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500',
            2: 'border-l-4 border-slate-300 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-400',
            3: 'border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-500'
        };

        return (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar p-2">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🔥</span> Top Ideators
                    </h3>
                    <ul className="space-y-3">
                        {ideatorLeaderboard.map((leader, index) => {
                            const rank = index + 1;
                            const specialClass = rank <= 3 ? rankClasses[rank] : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50';
                            return (
                                <li key={`${leader.name}-ideator`} className={`flex items-center p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm ${specialClass}`}>
                                    <span className={`font-bold w-6 text-center ${rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-500' : 'text-slate-400'}`}>#{rank}</span>
                                    <div className={`w-10 h-10 rounded-full ${leader.avatarColor} mx-3 flex items-center justify-center text-white font-bold`}>{leader.name.charAt(0)}</div>
                                    <div className="flex-grow">
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">{leader.name}</span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {leader.badges?.map(badge => <BadgeIcon key={badge} badge={badge} />)}
                                        </div>
                                    </div>
                                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-sm">{leader.points} pts</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🤝</span> Top Helpers
                    </h3>
                    <ul className="space-y-3">
                        {topHelpersLeaderboard.map((leader, index) => {
                             const rank = index + 1;
                             const specialClass = rank <= 3 ? rankClasses[rank] : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50';
                             return (
                                <li key={`${leader.name}-helper`} className={`flex items-center p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm ${specialClass}`}>
                                    <span className={`font-bold w-6 text-center ${rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-500' : 'text-slate-400'}`}>#{rank}</span>
                                    <div className={`w-10 h-10 rounded-full ${leader.avatarColor} mx-3 flex items-center justify-center text-white font-bold`}>{leader.name.charAt(0)}</div>
                                    <div className="flex-grow">
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">{leader.name}</span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {leader.badges?.map(badge => <BadgeIcon key={badge} badge={badge} />)}
                                        </div>
                                    </div>
                                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-sm">{leader.points} pts</span>
                                </li>
                             );
                        })}
                    </ul>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-lg border border-blue-400/20 p-6 text-white h-fit">
                    <h3 className="font-bold text-2xl mb-6">How to Earn Badges</h3>
                    <div className="space-y-5 text-blue-50">
                        <div className="flex items-start gap-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                            <span className="text-2xl mt-0.5">💡</span>
                            <div>
                                <h4 className="font-bold text-white mb-1">Idea Starter</h4>
                                <p className="text-sm opacity-90">Make your first valuable campus suggestion in the hub.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                            <span className="text-2xl mt-0.5">🔊</span>
                            <div>
                                <h4 className="font-bold text-white mb-1">Community Voice</h4>
                                <p className="text-sm opacity-90">Get 100+ upvotes on a single post or idea.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                            <span className="text-2xl mt-0.5">✅</span>
                            <div>
                                <h4 className="font-bold text-white mb-1">Problem Solver</h4>
                                <p className="text-sm opacity-90">Get 10+ of your answers or messages marked as helpful.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                     <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-semibold mb-4 tracking-wide border border-blue-200 dark:border-blue-800">
                        Campus Connect
                    </span>
                     <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 dark:from-white dark:to-slate-300 mb-6 font-space">
                        Community Hub
                     </h2>
                     <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Share ideas, track campus change, and get recognized for your contributions.
                     </p>
                </div>

                <div className="w-full bg-slate-200/50 dark:bg-slate-800/30 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 md:p-8 h-[600px] md:h-[850px] flex flex-col">
                    {/* Tabs */}
                    <div className="flex-shrink-0 mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border border-slate-100 dark:border-slate-800/50 shadow-sm mx-auto w-full max-w-3xl">
                        <button onClick={() => setActiveTab('discussion')} className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${activeTab === 'discussion' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md text-white scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <DiscussionIcon /> Discussion
                        </button>
                        <button onClick={() => setActiveTab('pipeline')} className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${activeTab === 'pipeline' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md text-white scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <PipelineIcon /> Idea Pipeline
                        </button>
                        <button onClick={() => setActiveTab('leaders')} className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${activeTab === 'leaders' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md text-white scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <TrophyIcon /> Leaders
                        </button>
                    </div>

                    <div className="flex-grow min-h-0">
                      {activeTab === 'discussion' && renderDiscussion()}
                      {activeTab === 'pipeline' && renderPipeline()}
                      {activeTab === 'leaders' && renderLeaders()}
                    </div>
                </div>
            </div>
             <style>{`
                .animate-fade-in-scale {
                    animation: fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.3);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(75, 85, 99, 0.5);
                }
            `}</style>
        </section>
    );
};

export default CommunityForum;