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
        // In a real app, this would be based on 'helpful' marks
        const helpers = [mockUsers[2], mockUsers[4], mockUsers[5]]; // Alex P, David L, You
        return helpers.sort((a,b) => (b.points || 0) - (a.points || 0)); // simple sort for now
    }, []);


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
        const newMsg: ForumMessage = { id: Date.now(), user: currentUser, text: newMessage.trim(), image: imagePreview || undefined, likes: 0, isLiked: false };
        setMessages(prev => ({ ...prev, [activeChannelId]: [...(prev[activeChannelId] || []), newMsg] }));
        setNewMessage(''); setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };


    // --- Render Methods for Views ---
    const renderDiscussion = () => (
        <div className="w-full flex flex-col md:flex-row gap-6 h-full">
            {/* Sidebar with channels */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col">
                <h3 className="font-bold text-lg mb-4 text-rose-900 dark:text-rose-100">Discussion Channels</h3>
                <div className="space-y-2 overflow-y-auto text-rose-800 dark:text-rose-200">
                    {channels.map(channel => (
                        <button key={channel.id} onClick={() => setActiveChannelId(channel.id)} className={`w-full text-left p-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 ${activeChannelId === channel.id ? 'bg-teal-100 text-teal-900' : 'hover:bg-lime-100 dark:bg-slate-800'}`}>
                            {channel.name}
                        </button>
                    ))}
                </div>
            </div>
            {/* Main chat window */}
            <div className="w-full md:w-2/3 flex flex-col bg-white dark:bg-slate-900 rounded-xl">
                <div className="p-4 border-b border-rose-200">
                    <h3 className="font-bold text-xl text-rose-900 dark:text-rose-100">{activeChannel.name}</h3>
                    <p className="text-sm text-rose-600 dark:text-rose-300">{activeChannel.description}</p>
                </div>
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {(messages[activeChannelId] || []).map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.user.name === 'You' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full ${msg.user.avatarColor} flex-shrink-0`}></div>
                            <div className={`flex flex-col ${msg.user.name === 'You' ? 'items-end' : 'items-start'}`}>
                                <p className="font-semibold text-rose-900 dark:text-rose-100">{msg.user.name}</p>
                                <div className={`p-3 rounded-lg mt-1 group ${msg.user.name === 'You' ? 'bg-rose-400 text-white' : 'bg-lime-100 dark:bg-slate-800'}`}>
                                    {msg.text && <p className={`${msg.user.name === 'You' ? 'text-white' : 'text-rose-900 dark:text-rose-100'}`}>{msg.text}</p>}
                                    {msg.poll && <PollComponent message={msg} onVote={handleVote} />}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => handleLike(msg.id)} className="flex items-center gap-1 hover:opacity-80 transition-opacity"><ThumbsUpIcon active={msg.isLiked} /> {msg.likes}</button>
                                        {activeChannel.allowHelpful && <button onClick={() => handleMarkHelpful(msg.id)} className="flex items-center gap-1 hover:opacity-80 transition-opacity"><HelpfulIcon active={msg.isHelpful} /> Helpful</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-rose-200">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input type="text" placeholder="Share your thoughts..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full bg-lime-100 dark:bg-slate-800 rounded-full py-3 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-rose-400 text-rose-800 dark:text-rose-200 placeholder-rose-400"/>
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-400 hover:bg-rose-50 dark:bg-slate-8000 text-white w-10 h-10 rounded-full flex items-center justify-center" aria-label="Send Message"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
                    </form>
                </div>
            </div>
        </div>
    );

    const renderPipeline = () => {
        const stages: IdeaPipelineStage[] = ['Trending Ideas', 'Under Review', 'Approved & Planned', 'In Progress', 'Completed! 🎉'];
        return (
            <div className="w-full h-full overflow-x-auto">
                 <div className="flex gap-4 min-w-max h-full">
                    {stages.map(stage => (
                        <div key={stage} className="w-72 bg-white dark:bg-slate-900 rounded-xl p-3 flex-shrink-0 flex flex-col">
                            <h3 className="font-bold text-rose-800 dark:text-rose-200 mb-3 px-1">{stage}</h3>
                            <div className="space-y-3 overflow-y-auto flex-grow">
                                {ideaCards.filter(c => c.stage === stage).map(card => <IdeaCard key={card.id} card={card} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderLeaders = () => {
        const rankClasses: { [key: number]: string } = {
            1: 'border-l-4 border-yellow-400 bg-yellow-50',
            2: 'border-l-4 border-gray-400 bg-gray-50',
            3: 'border-l-4 border-orange-400 bg-orange-50'
        };

        return (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
                    <h3 className="font-bold text-xl text-rose-900 dark:text-rose-100 mb-3">Top Ideators</h3>
                    <ul className="space-y-2">
                        {ideatorLeaderboard.map((leader, index) => {
                            const rank = index + 1;
                            const specialClass = rank <= 3 ? rankClasses[rank] : 'bg-lime-50 dark:bg-slate-950';
                            return (
                                <li key={`${leader.name}-ideator`} className={`flex items-center p-3 rounded-lg transition-transform duration-200 hover:scale-[1.02] ${specialClass}`}>
                                    <span className="font-bold text-rose-700 w-8 text-lg">#{rank}</span>
                                    <div className={`w-8 h-8 rounded-full ${leader.avatarColor} mr-3`}></div>
                                    <div className="flex-grow">
                                        <span className="font-semibold text-rose-800 dark:text-rose-200">{leader.name}</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            {leader.badges?.map(badge => <BadgeIcon key={badge} badge={badge} />)}
                                        </div>
                                    </div>
                                    <span className="font-bold text-teal-600">{leader.points} pts</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
                    <h3 className="font-bold text-xl text-rose-900 dark:text-rose-100 mb-3">Top Helpers</h3>
                    <ul className="space-y-2">
                        {topHelpersLeaderboard.map((leader, index) => {
                             const rank = index + 1;
                             const specialClass = rank <= 3 ? rankClasses[rank] : 'bg-lime-50 dark:bg-slate-950';
                             return (
                                <li key={`${leader.name}-helper`} className={`flex items-center p-3 rounded-lg transition-transform duration-200 hover:scale-[1.02] ${specialClass}`}>
                                    <span className="font-bold text-rose-700 w-8 text-lg">#{rank}</span>
                                    <div className={`w-8 h-8 rounded-full ${leader.avatarColor} mr-3`}></div>
                                    <div className="flex-grow">
                                        <span className="font-semibold text-rose-800 dark:text-rose-200">{leader.name}</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            {leader.badges?.map(badge => <BadgeIcon key={badge} badge={badge} />)}
                                        </div>
                                    </div>
                                    <span className="font-bold text-teal-600">{leader.points} pts</span>
                                </li>
                             );
                        })}
                    </ul>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4">
                    <h3 className="font-bold text-xl text-rose-900 dark:text-rose-100 mb-3">How to Earn Badges</h3>
                    <div className="space-y-3 text-sm text-rose-700">
                        <p><strong>💡 Idea Starter:</strong> Make your first suggestion.</p>
                        <p><strong>🔊 Community Voice:</strong> Get 100+ upvotes on a post.</p>
                        <p><strong>✅ Problem Solver:</strong> Get 10+ answers marked as helpful.</p>
                        <p><strong>🗺️ Campus Guide:</strong> Be a top contributor in #general-discussion.</p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Community Hub</h2>
                     <p className="text-lg text-rose-600 dark:text-rose-300 max-w-2xl mx-auto">Share ideas, track campus change, and get recognized for your contributions.</p>
                </div>

                <div className="max-w-6xl mx-auto bg-lime-100 dark:bg-slate-800 rounded-2xl shadow-lg p-6 h-[800px] flex flex-col">
                    <div className="flex-shrink-0 mb-4 bg-white/50 backdrop-blur-sm p-1.5 rounded-xl flex items-center justify-center gap-2">
                        <button onClick={() => setActiveTab('discussion')} className={`flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'discussion' ? 'bg-white dark:bg-slate-900 shadow text-rose-600 dark:text-rose-300' : 'text-rose-500 dark:text-rose-400'}`}><DiscussionIcon /> Discussion</button>
                        <button onClick={() => setActiveTab('pipeline')} className={`flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'pipeline' ? 'bg-white dark:bg-slate-900 shadow text-rose-600 dark:text-rose-300' : 'text-rose-500 dark:text-rose-400'}`}><PipelineIcon /> Idea Pipeline</button>
                        <button onClick={() => setActiveTab('leaders')} className={`flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'leaders' ? 'bg-white dark:bg-slate-900 shadow text-rose-600 dark:text-rose-300' : 'text-rose-500 dark:text-rose-400'}`}><TrophyIcon /> Leaders</button>
                    </div>

                    <div className="flex-grow min-h-0">
                      {activeTab === 'discussion' && renderDiscussion()}
                      {activeTab === 'pipeline' && renderPipeline()}
                      {activeTab === 'leaders' && renderLeaders()}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityForum;