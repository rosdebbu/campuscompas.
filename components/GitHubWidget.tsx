import React, { useState, useMemo, useEffect } from 'react';
import type { GitHubRepo, ProjectTask, GitHubUser } from '../types';

// --- ICONS ---
const GitHubIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
);
const LinkIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const CheckCircleIcon: React.FC<{completed: boolean}> = ({ completed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${completed ? 'text-teal-400' : 'text-rose-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={completed ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"} />
    </svg>
);

// MOCK DATA for tasks (repos will be fetched)
const initialTasks: ProjectTask[] = [
    { id: 1, text: 'Implement floor plan view in map component', completed: true },
    { id: 2, text: 'Connect backend for Lost & Found reports', completed: false },
    { id: 3, text: 'Refactor CSS for the Events section', completed: false },
];

const ContributionGraph: React.FC = () => {
    const days = useMemo(() => {
        const grid = [];
        for (let i = 0; i < 119; i++) { // 7 * 17 grid
            const level = Math.floor(Math.random() * 5);
            grid.push(level);
        }
        return grid;
    }, []);

    const colors = ['bg-lime-100', 'bg-teal-100', 'bg-teal-200', 'bg-teal-400', 'bg-teal-600'];

    return (
        <div className="grid grid-cols-17 grid-rows-7 gap-1 p-2 bg-white rounded-md border border-lime-200">
            {days.map((level, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${colors[level]}`} title={`Contribution level ${level}`}></div>
            ))}
        </div>
    );
};


// --- SUB-COMPONENTS ---

// Disconnected State Component
const DisconnectedState: React.FC<{ onConnect: (username: string) => void }> = ({ onConnect }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onConnect(inputValue.trim());
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border">
            <div className="flex justify-center items-center mb-4">
                <GitHubIcon className="h-8 w-8 text-rose-400 mr-2" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">GitHub Project Tracker</h2>
            </div>
            <p className="text-lg text-rose-600 max-w-2xl mx-auto">Connect your GitHub account to see your activity, repositories, and project tasks right here.</p>
            <form onSubmit={handleSubmit} className="mt-8 max-w-sm mx-auto flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your GitHub username"
                    className="flex-grow w-full px-4 py-3 rounded-full text-rose-800 placeholder-rose-400 bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400 border border-transparent"
                    aria-label="GitHub username"
                />
                <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-full shadow-md hover:bg-gray-900 transition-colors"
                >
                    <GitHubIcon className="mr-2 h-5 w-5" /> Connect
                </button>
            </form>
        </div>
    );
};

// Connected State Component
const ConnectedState: React.FC<{ username: string; onDisconnect: () => void }> = ({ username, onDisconnect }) => {
    const [userData, setUserData] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
    const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [userRes, reposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`),
                    fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=3&type=owner`)
                ]);

                if (!userRes.ok) {
                    throw new Error(`Could not find GitHub user: ${username}`);
                }
                if (!reposRes.ok) {
                     throw new Error(`Could not fetch repositories for ${username}`);
                }

                const userData = await userRes.json();
                const reposData = await reposRes.json();

                setUserData(userData);
                // Map API response to our GitHubRepo type
                setRepos(reposData.map((repo: any) => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                })));

            } catch (err: any) {
                setError(err.message);
                // Disconnect on error after a delay
                setTimeout(() => {
                    onDisconnect();
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, onDisconnect]);

    const handleToggleTask = (taskId: number) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border p-8 text-center flex items-center justify-center h-96">
                <svg className="animate-spin h-10 w-10 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-4 text-lg text-rose-600">Connecting to GitHub...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border p-8 text-center h-96 flex flex-col justify-center items-center">
                <p className="text-red-500 font-semibold text-lg">{error}</p>
                <p className="text-rose-600 mt-2">Please check the username and try again. Disconnecting...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-rose-900">GitHub Activity</h2>
                        <a href={userData?.html_url} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-teal-600 transition-colors">@{userData?.login}</a>
                    </div>
                     <div className="flex items-center gap-4">
                        <a href={userData?.html_url} target="_blank" rel="noopener noreferrer">
                            <img src={userData?.avatar_url} alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-lime-200 hover:border-teal-400 transition-colors"/>
                        </a>
                        <button onClick={onDisconnect} className="text-sm text-rose-500 hover:underline">Disconnect</button>
                    </div>
                </div>
            </div>
            
            <div className="px-6 pb-6">
                <h3 className="font-semibold text-rose-800 mb-2">Contribution Graph (simulation)</h3>
                <a href={userData?.html_url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                    <ContributionGraph />
                </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-lime-200">
                {/* Recent Repos */}
                <div className="bg-white p-6">
                    <h3 className="font-semibold text-rose-800 mb-3">Recent Repositories</h3>
                    <ul className="space-y-3">
                        {repos && repos.map(repo => (
                            <li key={repo.id}>
                                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="group flex justify-between items-start hover:bg-lime-50 p-2 rounded-md -m-2 transition-colors">
                                    <div>
                                        <p className="font-semibold text-rose-800 group-hover:text-teal-600">{repo.name}</p>
                                        <p className="text-sm text-rose-500 line-clamp-1">{repo.description || "No description provided."}</p>
                                    </div>
                                    <LinkIcon />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Project Tasks */}
                <div className="bg-white p-6">
                     <h3 className="font-semibold text-rose-800 mb-3">Local Project Tasks</h3>
                    <ul className="space-y-2">
                        {tasks.map(task => (
                            <li key={task.id} className="flex items-center cursor-pointer group" onClick={() => handleToggleTask(task.id)}>
                                <CheckCircleIcon completed={task.completed} />
                                <span className={`ml-2 text-rose-700 ${task.completed ? 'line-through text-rose-400' : ''}`}>{task.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const GitHubWidget: React.FC = () => {
    const [username, setUsername] = useState<string | null>(() => {
        return localStorage.getItem('githubUsername');
    });

    const handleConnect = (name: string) => {
        localStorage.setItem('githubUsername', name);
        setUsername(name);
    };

    const handleDisconnect = () => {
        localStorage.removeItem('githubUsername');
        setUsername(null);
    };
    
    return (
        <section className="py-20 bg-lime-50">
            <div className="container mx-auto px-4">
                {username ? (
                    <ConnectedState username={username} onDisconnect={handleDisconnect} />
                ) : (
                    <DisconnectedState onConnect={handleConnect} />
                )}
            </div>
        </section>
    );
};

export default GitHubWidget;
