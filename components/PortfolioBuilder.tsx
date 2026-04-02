import React, { useState, useMemo } from 'react';
import type { GitHubRepo, PortfolioProject, GitHubStats } from '../types';

// --- ICONS ---
const PortfolioIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const GitHubIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-6 h-6"}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>;
const PinIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.068l4.243 4.243a1 1 0 01-1.414 1.414L10 11.414l-3.828 3.828a1 1 0 01-1.414-1.414L8 9.068V4a1 1 0 011-1z" clipRule="evenodd" /><path d="M10 2a2 2 0 012 2v5.068l4.95 4.95a2 2 0 01-2.828 2.828L10 12.828l-4.121 4.122a2 2 0 01-2.828-2.828L8 9.068V4a2 2 0 012-2z" /></svg>;
const EditIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const UnpinIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- MOCK DATA ---
const mockUser = { username: 'debjitttdasss' };
const mockAllRepos: GitHubRepo[] = [
    { id: 1, name: 'campus-navigator-app', description: 'AI-powered campus guide for SRMIST.', url: `https://github.com/${mockUser.username}/campus-navigator-app` },
    { id: 2, name: 'ml-research-papers', description: 'Summaries and implementations of popular ML papers.', url: `https://github.com/${mockUser.username}/ml-research-papers` },
    { id: 3, name: 'dotfiles', description: 'My personal development configuration for VSCode, zsh, etc.', url: `https://github.com/${mockUser.username}/dotfiles` },
    { id: 4, name: 'competitive-programming-templates', description: 'Templates for common CP problems.', url: `https://github.com/${mockUser.username}/competitive-programming-templates` },
    { id: 5, name: 'portfolio-website-v2', description: 'The source code for my personal portfolio website built with Next.js.', url: `https://github.com/${mockUser.username}/portfolio-website-v2` },
];
const mockStats: GitHubStats = { totalContributions: 1248, longestStreak: 128, mostUsedLanguage: 'TypeScript' };


// --- EDIT MODAL ---
interface EditModalProps {
    project: PortfolioProject;
    onClose: () => void;
    onSave: (updatedProject: PortfolioProject) => void;
}
const EditModal: React.FC<EditModalProps> = ({ project, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        whatILearned: project.whatILearned || '',
        challenges: project.challenges || '',
        course: project.course || '',
        techStack: project.techStack?.join(', ') || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...project,
            ...formData,
            techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl p-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 dark:text-rose-300"><CloseIcon /></button>
                <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-1">Add Context to</h2>
                <p className="text-teal-600 font-semibold text-lg mb-6">{project.name}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea name="whatILearned" value={formData.whatILearned} onChange={handleChange} placeholder="What I Learned..." rows={3} className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <textarea name="challenges" value={formData.challenges} onChange={handleChange} placeholder="Challenges Faced..." rows={3} className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <input name="course" type="text" value={formData.course} onChange={handleChange} placeholder="Related Course (e.g., CS101)" className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <input name="techStack" type="text" value={formData.techStack} onChange={handleChange} placeholder="Tech Stack (e.g., React, Node.js, Firebase)" className="w-full p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const PortfolioBuilder: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [pinnedProjects, setPinnedProjects] = useState<PortfolioProject[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

    const availableRepos = useMemo(() => {
        const pinnedIds = new Set(pinnedProjects.map(p => p.id));
        return mockAllRepos.filter(repo => !pinnedIds.has(repo.id));
    }, [pinnedProjects]);

    const handlePinRepo = (repo: GitHubRepo) => {
        setPinnedProjects(prev => [...prev, { ...repo, techStack: [] }]);
    };

    const handleUnpinProject = (projectId: number) => {
        setPinnedProjects(prev => prev.filter(p => p.id !== projectId));
    };
    
    const handleOpenEditModal = (project: PortfolioProject) => {
        setEditingProject(project);
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = (updatedProject: PortfolioProject) => {
        setPinnedProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setIsEditModalOpen(false);
        setEditingProject(null);
    };
    
    const DisconnectedState = () => (
         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center border">
            <div className="flex justify-center items-center mb-4">
                <PortfolioIcon />
                <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Portfolio Builder</h2>
            </div>
            <p className="text-lg text-rose-600 dark:text-rose-300 max-w-2xl mx-auto">Connect your GitHub account to automatically curate and showcase your best projects.</p>
            <button 
                onClick={() => setIsConnected(true)}
                className="mt-8 inline-flex items-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 transition-all transform hover:scale-105 duration-300"
            >
                <GitHubIcon className="mr-3" /> Connect to GitHub
            </button>
        </div>
    );

    const ConnectedState = () => (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                     <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">Your Developer Portfolio</h2>
                     <p className="text-rose-600 dark:text-rose-300">Share this link with recruiters: 
                         <a href="#" onClick={e=>e.preventDefault()} className="font-semibold text-teal-600 hover:underline ml-1">campasscompass.com/portfolio/{mockUser.username}</a>
                     </p>
                </div>
                 <button onClick={() => setIsConnected(false)} className="text-sm text-rose-500 dark:text-rose-400 hover:underline">Disconnect GitHub</button>
            </div>

            <div className="bg-lime-50 dark:bg-slate-950 rounded-lg p-4 flex flex-wrap justify-around items-center border border-lime-200 dark:border-slate-700">
                <div className="text-center p-2">
                    <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{mockStats.totalContributions}</p>
                    <p className="text-sm text-rose-600 dark:text-rose-300">Total Contributions</p>
                </div>
                <div className="text-center p-2">
                    <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{mockStats.longestStreak} days</p>
                    <p className="text-sm text-rose-600 dark:text-rose-300">Longest Streak</p>
                </div>
                <div className="text-center p-2">
                    <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{mockStats.mostUsedLanguage}</p>
                    <p className="text-sm text-rose-600 dark:text-rose-300">Most Used Language</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Repos */}
                <div>
                    <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-3">Available Repositories</h3>
                    <div className="space-y-3 p-4 bg-lime-50 dark:bg-slate-950 rounded-lg border border-lime-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                        {availableRepos.map(repo => (
                            <div key={repo.id} className="bg-white dark:bg-slate-900 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-rose-800 dark:text-rose-200">{repo.name}</p>
                                    <p className="text-sm text-rose-500 dark:text-rose-400 line-clamp-1">{repo.description}</p>
                                </div>
                                <button onClick={() => handlePinRepo(repo)} className="flex-shrink-0 ml-4 px-3 py-1 bg-teal-100 text-teal-800 text-sm font-semibold rounded-full hover:bg-teal-200 flex items-center">
                                    <PinIcon /> Pin
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Pinned Projects */}
                <div>
                    <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-3">Pinned Projects</h3>
                    <div className="space-y-3 p-4 bg-lime-50 dark:bg-slate-950 rounded-lg border border-lime-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                         {pinnedProjects.length > 0 ? pinnedProjects.map(project => (
                             <div key={project.id} className="bg-white dark:bg-slate-900 p-3 rounded-md">
                                 <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-semibold text-rose-800 dark:text-rose-200">{project.name}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {project.techStack?.map(tech => <span key={tech} className="text-xs bg-rose-100 text-rose-800 dark:text-rose-200 px-1.5 py-0.5 rounded">{tech}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <button onClick={() => handleOpenEditModal(project)} className="p-1.5 bg-lime-200 text-lime-800 rounded-full hover:bg-lime-300"><EditIcon /></button>
                                        <button onClick={() => handleUnpinProject(project.id)} className="p-1.5 bg-red-100 text-red-800 rounded-full hover:bg-red-200"><UnpinIcon /></button>
                                    </div>
                                 </div>
                             </div>
                         )) : <p className="text-center text-rose-500 dark:text-rose-400 p-4">Pin projects from the left to build your portfolio!</p>}
                    </div>
                </div>
            </div>

        </div>
    );

    return (
        <section className="py-20 bg-lime-100 dark:bg-slate-800">
            <div className="container mx-auto px-4">
                {isConnected ? <ConnectedState /> : <DisconnectedState />}
            </div>
            {isEditModalOpen && editingProject && (
                <EditModal 
                    project={editingProject} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveChanges} 
                />
            )}
        </section>
    );
};

export default PortfolioBuilder;