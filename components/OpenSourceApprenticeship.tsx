
import React, { useState } from 'react';
import type { ApprenticeshipIssue, ApprenticeshipTask } from '../types';

// --- ICONS ---
const ApprenticeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const OverviewIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IssuesIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM19.707 18.293l-4-4M4.293 6.293l4 4" /></svg>;
const WikiIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const BadgeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 012 2v1.332l.53.265a1 1 0 01.53 1.585l-1 1.732a1 1 0 01-1.414.213l-.53-.265A1 1 0 019 7.828V4a2 2 0 012-2zm0 14a2 2 0 01-2-2v-1.332l-.53-.265a1 1 0 01-.53-1.585l1-1.732a1 1 0 011.414-.213l.53.265A1 1 0 0111 12.172V14a2 2 0 01-2 2zm-6.07-5.07a1 1 0 010-1.414l1-1.732a1 1 0 011.365-.365l1.732.999a1 1 0 01.366 1.366l-1 1.732a1 1 0 01-1.414 0l-1.018-.586a1 1 0 00-1.018.586zm12.14 0a1 1 0 010 1.414l-1 1.732a1 1 0 01-1.365.365l-1.732-.999a1 1 0 01-.366-1.366l1-1.732a1 1 0 011.414 0l1.018.586a1 1 0 001.018-.586z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


// --- MOCK DATA ---
const journeyStages: ApprenticeshipTask[] = [
    { stage: 'Onboarding', title: 'Claim Your First Issue', description: 'Go to the "Issues" tab and claim the task related to documentation.' },
    { stage: 'Bug Squashing', title: 'Choose a Bug to Squash', description: 'Select one of the available bugs from the "Issues" tab to work on.' },
    { stage: 'Feature Implementation', title: 'Pick a Feature to Build', description: 'Claim a feature request from the "Issues" tab and get to work.' },
    { stage: 'Graduation', title: 'Graduate the Program', description: 'Congratulations on completing the apprenticeship!' }
];

const mockIssues: ApprenticeshipIssue[] = [
    { id: 1, title: 'Fix typo in README.md', labels: [{ name: 'documentation', color: 'bg-blue-200 text-blue-800' }, { name: 'good first issue', color: 'bg-teal-200 text-teal-800' }] },
    { id: 2, title: 'Button component not rendering correctly on mobile', labels: [{ name: 'bug', color: 'bg-red-200 text-red-800' }] },
    { id: 4, title: 'User profile pictures appear stretched on Firefox', labels: [{ name: 'bug', color: 'bg-red-200 text-red-800' }, { name: 'ui', color: 'bg-pink-200 text-pink-800' }] },
    { id: 3, title: 'Add a dark mode toggle to the settings page', labels: [{ name: 'feature', color: 'bg-purple-200 text-purple-800' }] },
];

const readmeContent = `# Simulated Project: Campus Compass Core

This is a simulated project to help you learn open source contribution workflows.

## Features
- Interactive Map
- Event Calendar
- Community Hub
`;
const contributingContent = `# Contribution Guidelines

Welcome, apprentice! We're excited to have you.

## How to Contribute
1.  **Fork & Clone:** Fork this repo and clone it locally.
2.  **Create a Branch:** Make a new branch for your changes.
3.  **Commit Your Work:** Write clear commit messages.
4.  **Open a Pull Request:** Push to your fork and open a PR.
`;

// --- MODAL FOR SUGGESTING FEATURES ---
interface SuggestFeatureModalProps {
    onClose: () => void;
    onSuggest: (title: string, description: string) => void;
}
const SuggestFeatureModal: React.FC<SuggestFeatureModalProps> = ({ onClose, onSuggest }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSuggest(title, description);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600"><CloseIcon /></button>
                <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">Suggest a New Feature</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Feature Title" required className="w-full p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your feature idea..." className="w-full p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400"></textarea>
                    <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-500 transition-colors">Submit Suggestion</button>
                </form>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const OpenSourceApprenticeship: React.FC = () => {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'wiki'>('overview');
    const [claimedIssueId, setClaimedIssueId] = useState<number | null>(null);
    const [completedIssues, setCompletedIssues] = useState<ApprenticeshipIssue[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [issues, setIssues] = useState<ApprenticeshipIssue[]>(mockIssues);
    const [readme, setReadme] = useState<string>(readmeContent);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

    const handleClaimIssue = (issueId: number) => {
        setClaimedIssueId(issueId);
        setActiveTab('overview'); // Go back to the main view to see the task
    };

    const handlePullRequestSubmit = () => {
        if (!claimedIssueId) return;
        setIsSubmitting(true);
        const issue = issues.find(i => i.id === claimedIssueId);
        if (issue) {
            setTimeout(() => {
                setCompletedIssues(prev => [...prev, issue]);
                setClaimedIssueId(null);
                if (currentStageIndex < journeyStages.length - 1) {
                    setCurrentStageIndex(prev => prev + 1);
                }
                setIsSubmitting(false);
            }, 1500);
        }
    };

    const handleSuggestFeature = (title: string, description: string) => {
        const newIssue: ApprenticeshipIssue = {
            id: Date.now(),
            title: title,
            labels: [{ name: 'feature', color: 'bg-purple-200 text-purple-800' }, { name: 'user-suggested', color: 'bg-yellow-200 text-yellow-800' }]
        };
        setIssues(prev => [...prev, newIssue]);
        setIsSuggestModalOpen(false);
        setActiveTab('issues');
    };

    const currentTask = journeyStages[currentStageIndex];
    const claimedIssue = issues.find(i => i.id === claimedIssueId);

    const stageToLabelMap: { [key: number]: string } = {
        0: 'documentation',
        1: 'bug',
        2: 'feature'
    };
    const currentStageLabel = stageToLabelMap[currentStageIndex];
    const availableIssues = issues.filter(issue =>
        issue.labels.some(label => label.name.includes(currentStageLabel))
    );

    return (
        <section className="py-20 bg-lime-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <ApprenticeIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Open Source Apprenticeship</h2>
                    </div>
                    <p className="text-lg text-rose-600 max-w-3xl mx-auto">
                        Go from writing code to building software. Join our simulated open-source team, tackle real-world tasks, and learn to navigate a large codebase.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border p-6 sm:p-8 space-y-8">
                    {/* Journey Tracker */}
                    <div>
                        <h3 className="text-xl font-bold text-rose-900 mb-4">Your Journey</h3>
                        <div className="flex items-center">
                            {journeyStages.map((stage, index) => (
                                <React.Fragment key={stage.stage}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${index <= currentStageIndex ? 'bg-rose-400 border-rose-500 text-white' : 'bg-lime-100 border-lime-300 text-rose-500'}`}>
                                            <CheckCircleIcon className="w-8 h-8" />
                                        </div>
                                        <p className={`text-xs font-semibold mt-2 text-center ${index <= currentStageIndex ? 'text-rose-800' : 'text-rose-500'}`}>{stage.stage}</p>
                                    </div>
                                    {index < journeyStages.length - 1 && (
                                        <div className={`flex-grow h-1 mx-2 rounded-full ${index < currentStageIndex ? 'bg-rose-400' : 'bg-lime-200'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {currentStageIndex === journeyStages.length - 1 ? (
                        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                            <BadgeIcon />
                            <h3 className="text-2xl font-bold text-yellow-800 mt-2">Congratulations, Graduate!</h3>
                            <p className="text-yellow-700 mt-2">You've completed the apprenticeship and earned the "Open Source Contributor" badge for your profile!</p>
                            <div className="mt-6 text-left max-w-md mx-auto">
                                <h4 className="font-bold text-yellow-800 text-center mb-2">Your Contributions:</h4>
                                <ul className="space-y-2">
                                    {completedIssues.map(issue => (
                                        <li key={issue.id} className="bg-white/50 p-2 rounded-md text-sm text-yellow-900 flex items-center">
                                            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                                            <span>{issue.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Project Dashboard */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-rose-900">Project: Campus Compass Core</h3>
                                    <button onClick={() => setIsSuggestModalOpen(true)} className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full hover:bg-yellow-200">+ Suggest a Feature</button>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6 h-[400px]">
                                    <div className="md:w-1/4 flex flex-col gap-2">
                                        <button onClick={() => setActiveTab('overview')} className={`flex items-center p-3 rounded-lg font-semibold transition-colors ${activeTab === 'overview' ? 'bg-lime-100 text-rose-800' : 'hover:bg-lime-50'}`}><OverviewIcon /> Overview</button>
                                        <button onClick={() => setActiveTab('issues')} className={`flex items-center p-3 rounded-lg font-semibold transition-colors ${activeTab === 'issues' ? 'bg-lime-100 text-rose-800' : 'hover:bg-lime-50'}`}><IssuesIcon /> Issues</button>
                                        <button onClick={() => setActiveTab('wiki')} className={`flex items-center p-3 rounded-lg font-semibold transition-colors ${activeTab === 'wiki' ? 'bg-lime-100 text-rose-800' : 'hover:bg-lime-50'}`}><WikiIcon /> Wiki</button>
                                    </div>
                                    <div className="md:w-3/4 bg-lime-50 rounded-lg p-4 border border-lime-200 overflow-y-auto">
                                        {activeTab === 'overview' && (
                                            <div>
                                                <textarea value={readme} onChange={(e) => setReadme(e.target.value)} className="w-full h-72 font-mono text-sm whitespace-pre-wrap bg-white p-2 rounded-md" />
                                                <button onClick={() => alert('Changes committed!')} className="mt-2 px-4 py-2 bg-rose-400 text-white text-sm font-semibold rounded-lg hover:bg-rose-500">Commit Changes</button>
                                            </div>
                                        )}
                                        {activeTab === 'wiki' && <pre className="font-mono text-sm whitespace-pre-wrap">{contributingContent}</pre>}
                                        {activeTab === 'issues' && (
                                            <div className="space-y-3">
                                                {availableIssues.length > 0 ? availableIssues.map(issue => (
                                                    <div key={issue.id} className="p-3 bg-white rounded-md border flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-rose-800">{issue.title}</p>
                                                            <div className="flex gap-2 mt-1">
                                                                {issue.labels.map(label => <span key={label.name} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${label.color}`}>{label.name}</span>)}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleClaimIssue(issue.id)}
                                                            disabled={claimedIssueId !== null}
                                                            className="ml-4 px-4 py-2 bg-teal-100 text-teal-800 text-sm font-semibold rounded-full hover:bg-teal-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                        >
                                                            {claimedIssueId === null ? 'Claim' : 'Task Active'}
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <p className="text-center text-rose-500 p-4">No available issues for this stage.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Current Task */}
                            <div className="bg-rose-50 p-6 rounded-lg border-2 border-rose-200">
                                {claimedIssue ? (
                                    <>
                                        <h3 className="text-xl font-bold text-rose-900">Your Current Task: {claimedIssue.title}</h3>
                                        <p className="text-rose-700 mt-2">You've claimed this issue. Once you've (simulated) fixing it, submit your pull request to complete this stage.</p>
                                        <button
                                            onClick={handlePullRequestSubmit}
                                            disabled={isSubmitting}
                                            className="mt-4 px-6 py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-500 transition-colors disabled:bg-rose-200"
                                        >
                                            {isSubmitting ? 'Merging Pull Request...' : 'Submit Pull Request'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold text-rose-900">{currentTask.title}</h3>
                                        <p className="text-rose-700 mt-2">{currentTask.description}</p>
                                        <button
                                            onClick={() => setActiveTab('issues')}
                                            className="mt-4 px-6 py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-500 transition-colors"
                                        >
                                            Go to Issues Tab
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isSuggestModalOpen && <SuggestFeatureModal onClose={() => setIsSuggestModalOpen(false)} onSuggest={handleSuggestFeature} />}
        </section>
    );
};

export default OpenSourceApprenticeship;
