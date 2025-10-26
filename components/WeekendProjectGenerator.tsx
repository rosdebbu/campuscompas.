
import React, { useState, useMemo } from 'react';
import type { WeekendProject } from '../types';

// --- ICONS ---
const GeneratorIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const MissionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const RequirementsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const TechStackIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const StretchGoalIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;

// --- MOCK DATA ---
const projectIdeas: WeekendProject[] = [
    {
        id: 'p1',
        mission: 'Build a "GitHub Profile README Generator"',
        requirements: [
            'A web form for name, bio, and social media links.',
            'A button to generate formatted Markdown.',
            'A "Copy to Clipboard" button for the generated Markdown.',
        ],
        techStack: ['HTML', 'CSS', 'JavaScript'],
        stretchGoal: 'Use the GitHub API to fetch and display the user\'s top languages or pinned repositories.',
    },
    {
        id: 'p2',
        mission: 'Create a Pomodoro Timer App',
        requirements: [
            'A timer that counts down from 25 minutes.',
            'Ability to start, pause, and reset the timer.',
            'Audible alarm when a session ends.',
            'Automatically switch between work (25 min) and break (5 min) sessions.',
        ],
        techStack: ['React', 'TypeScript', 'Tailwind CSS'],
        stretchGoal: 'Add a task list where users can track what they accomplish during each Pomodoro session.',
    },
    {
        id: 'p3',
        mission: 'Develop a Personal Weather Dashboard',
        requirements: [
            'An input field for a city name.',
            'Display current temperature, humidity, and wind speed.',
            'Show an icon representing the current weather (e.g., sunny, cloudy).',
            'Use a free weather API (like OpenWeatherMap).',
        ],
        techStack: ['JavaScript', 'API', 'HTML', 'CSS'],
        stretchGoal: 'Add a 5-day forecast view and save the user\'s last searched city in local storage.',
    },
    {
        id: 'p4',
        mission: 'Build a Simple Markdown Blog',
        requirements: [
            'A textarea to write content using Markdown.',
            'A live preview pane that renders the Markdown as HTML.',
            'Ability to "publish" (e.g., save to local storage).',
            'A main page that lists all published posts.',
        ],
        techStack: ['React', 'marked.js', 'Local Storage'],
        stretchGoal: 'Use a simple backend (like Node.js with Express) to save the posts to a file or a simple database.',
    }
];

// --- MAIN COMPONENT ---
const WeekendProjectGenerator: React.FC = () => {
    const [currentProject, setCurrentProject] = useState<WeekendProject | null>(null);
    const [lastProjectId, setLastProjectId] = useState<string | null>(null);

    const handleGenerateProject = () => {
        const availableProjects = projectIdeas.filter(p => p.id !== lastProjectId);
        const randomIndex = Math.floor(Math.random() * availableProjects.length);
        const newProject = availableProjects[randomIndex];
        setCurrentProject(newProject);
        setLastProjectId(newProject.id);
    };

    return (
        <section className="py-20 bg-lime-100">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center items-center mb-4">
                        <GeneratorIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Weekend Project Generator</h2>
                    </div>
                    <p className="text-lg text-rose-600">
                        Stop watching, start building. Get a fun, achievable project idea to build this weekend and put your new skills to the test.
                    </p>
                    <button
                        onClick={handleGenerateProject}
                        className="mt-8 px-8 py-4 bg-rose-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-rose-500 transition-all transform hover:scale-105 active:scale-95 duration-300"
                    >
                        Generate New Project
                    </button>
                </div>

                {currentProject && (
                    <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-lime-200 transform transition-all duration-500 ease-out scale-95 opacity-0 animate-fade-in-scale" style={{ animationFillMode: 'forwards' }}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-rose-900 flex items-center"><MissionIcon /> Your Mission</h3>
                                <p className="text-2xl text-rose-700 mt-1">{currentProject.mission}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-rose-800 flex items-center mb-2"><RequirementsIcon /> Core Requirements</h4>
                                    <ul className="list-disc list-inside text-rose-600 space-y-1">
                                        {currentProject.requirements.map((req, i) => <li key={i}>{req}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-rose-800 flex items-center mb-2"><TechStackIcon /> Suggested Tech Stack</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {currentProject.techStack.map(tech => (
                                            <span key={tech} className="text-sm font-semibold bg-lime-200 text-lime-800 px-2 py-1 rounded-full">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-rose-800 flex items-center mb-2"><StretchGoalIcon /> Stretch Goal</h4>
                                <p className="text-rose-600">{currentProject.stretchGoal}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-lime-200 text-center">
                             <button className="px-6 py-3 bg-teal-400 text-white font-semibold rounded-full hover:bg-teal-500 transition-colors">
                                Add to Portfolio Builder
                            </button>
                        </div>
                         <style>{`
                            @keyframes fade-in-scale {
                                from { transform: scale(0.95); opacity: 0; }
                                to { transform: scale(1); opacity: 1; }
                            }
                            .animate-fade-in-scale { animation: fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                        `}</style>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WeekendProjectGenerator;
