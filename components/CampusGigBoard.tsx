import React, { useState, useMemo } from 'react';
import type { Gig } from '../types';

// MOCK DATA
const initialGigs: Gig[] = [
    { id: 1, title: 'Build a Website for Campus Club', client: 'The Debate Society', description: 'Need a simple, modern website using React to showcase our events and members. Basic design is ready.', skills: ['React', 'CSS', 'Firebase'], budget: 200, postedDate: 'Oct 28, 2024' },
    { id: 2, title: 'Help Debug a Python Script', client: 'Rohan K.', description: 'My final year project script for data analysis is throwing some weird errors. Need an experienced Python dev to help me out.', skills: ['Python', 'Pandas'], budget: 50, postedDate: 'Oct 27, 2024' },
    { id: 3, title: 'Design a Logo for Student Startup', client: 'Team Innovate', description: 'We are a new student startup and need a cool logo for our app. Looking for someone skilled in Canva or Figma.', skills: ['Design', 'Canva', 'Figma'], budget: 75, postedDate: 'Oct 26, 2024' },
    { id: 4, title: 'Content Writer for Tech Blog', client: 'CSE Department Blog', description: 'Looking for students to write 2-3 articles per month on emerging tech trends. Paid per article.', skills: ['Writing'], budget: 100, postedDate: 'Oct 25, 2024' },
    { id: 5, title: 'Video Editor for Event Montage', client: 'Milan Fest Committee', description: 'We have hours of footage from the last cultural fest and need someone to create a 5-minute highlight reel.', skills: ['Video Editing', 'Premiere Pro'], budget: 150, postedDate: 'Oct 24, 2024' },
];

const allSkills = ['All', ...new Set(initialGigs.flatMap(g => g.skills))];

// ICONS
const GigBoardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PostIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;

// --- POST GIG MODAL ---
interface PostGigModalProps {
    onClose: () => void;
    onAddGig: (gig: Omit<Gig, 'id' | 'postedDate'>) => void;
}
const PostGigModal: React.FC<PostGigModalProps> = ({ onClose, onAddGig }) => {
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGig({
            title,
            client,
            description,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            budget: Number(budget),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 dark:text-rose-300"><CloseIcon /></button>
                <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-6 text-center">Post a Gig</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" required className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Your Name / Club Name" required className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Project Description" required className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"></textarea>
                    <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Required Skills (e.g., React, Python)" required className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget (in USD)" required className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Post Gig</button>
                </form>
            </div>
        </div>
    );
};


// --- GIG CARD ---
const GigCard: React.FC<{ gig: Gig }> = ({ gig }) => (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 border border-lime-200 dark:border-slate-700">
        <div className="flex-grow">
            <p className="text-sm text-rose-500 dark:text-rose-400">{gig.client}</p>
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mt-1">{gig.title}</h3>
            <p className="text-sm text-rose-700 mt-2 line-clamp-3">{gig.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
                {gig.skills.map(skill => <span key={skill} className="text-xs font-semibold bg-lime-200 text-lime-800 px-2 py-1 rounded-full">{skill}</span>)}
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-lime-200 dark:border-slate-700 flex justify-between items-center">
            <p className="text-lg font-bold text-teal-600">${gig.budget}</p>
            <button className="px-4 py-2 bg-rose-400 text-white text-sm font-semibold rounded-lg hover:bg-rose-50 dark:bg-slate-8000 transition-colors">View & Apply</button>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const CampusGigBoard: React.FC = () => {
    const [gigs, setGigs] = useState<Gig[]>(initialGigs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSkill, setActiveSkill] = useState('All');

    const filteredGigs = useMemo(() => {
        if (activeSkill === 'All') return gigs;
        return gigs.filter(gig => gig.skills.includes(activeSkill));
    }, [activeSkill, gigs]);

    const handleAddGig = (newGigData: Omit<Gig, 'id' | 'postedDate'>) => {
        const newGig: Gig = {
            ...newGigData,
            id: Date.now(),
            postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        setGigs(prev => [newGig, ...prev]);
    };

    return (
        <section className="py-20 bg-lime-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <GigBoardIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Campus Gig Board</h2>
                    </div>
                    <p className="text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                        Put your skills to work. Find paid projects, collaborate on interesting ideas, and gain real-world experience right here on campus.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 inline-flex items-center text-rose-500 dark:text-rose-400 font-semibold hover:underline"
                    >
                         <PostIcon /> Post a New Gig
                    </button>
                </div>

                <div className="flex justify-center items-center mb-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {allSkills.map(skill => (
                            <button key={skill} onClick={() => setActiveSkill(skill)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${activeSkill === skill ? 'bg-rose-400 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-rose-700 hover:bg-lime-200'}`}>
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGigs.length > 0 ? (
                        filteredGigs.map(gig => <GigCard key={gig.id} gig={gig} />)
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3 text-center text-rose-600 dark:text-rose-300 bg-white dark:bg-slate-900 p-8 rounded-lg">
                            <p>No gigs found for this skill. Try another filter!</p>
                        </div>
                    )}
                </div>

            </div>
            {isModalOpen && <PostGigModal onClose={() => setIsModalOpen(false)} onAddGig={handleAddGig} />}
        </section>
    );
};

export default CampusGigBoard;