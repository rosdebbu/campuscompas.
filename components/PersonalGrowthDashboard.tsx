
import React, { useMemo } from 'react';
import type { SkillData, ProjectVelocityData, CommunityImpactStats } from '../types';

// --- ICONS ---
const GrowthIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

// --- MOCK DATA ---
const mockSkillData: SkillData[] = [
    { skill: 'Web Dev', level: 5 },
    { skill: 'Python', level: 4 },
    { skill: 'DevOps', level: 3 },
    { skill: 'Data Science', level: 4 },
    { skill: 'UI/UX', level: 2 },
];

const mockProjectVelocity: ProjectVelocityData[] = [
    { month: 'Jul', projects: 2 },
    { month: 'Aug', projects: 1 },
    { month: 'Sep', projects: 3 },
    { month: 'Oct', projects: 2 },
];

const mockCommunityImpact: CommunityImpactStats = {
    mentees: 3,
    doubtsAnswered: 28,
    articleClaps: 412,
};

// --- SUB-COMPONENTS ---
const ContributionHistoryGraph: React.FC = () => {
    const days = useMemo(() => Array.from({ length: 364 }, () => Math.floor(Math.random() * 5)), []); // 52 * 7 = 364
    const colors = ['bg-lime-100 dark:bg-slate-800', 'bg-teal-100', 'bg-teal-200', 'bg-teal-400', 'bg-teal-600'];
    
    return (
        <div className="grid grid-cols-52 grid-rows-7 gap-px p-2 bg-white dark:bg-slate-900 rounded-md border border-lime-200 dark:border-slate-700">
            {days.map((level, i) => (
                <div key={i} className={`w-full aspect-square rounded-sm ${colors[level]}`} />
            ))}
        </div>
    );
};

const RadarChart: React.FC<{ data: SkillData[] }> = ({ data }) => {
    const size = 200;
    const center = size / 2;
    const maxLevel = 5;

    const points = data.map((item, i) => {
        const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
        const radius = (item.level / maxLevel) * (center - 20);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const labels = data.map((item, i) => {
        const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
        const radius = center - 5;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
            <text key={item.skill} x={x} y={y} fill="#4B5563" fontSize="10" textAnchor="middle" dy={y > center ? "1em" : "-0.5em"}>
                {item.skill}
            </text>
        );
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
            {/* Concentric circles */}
            {[...Array(maxLevel)].map((_, i) => (
                <circle key={i} cx={center} cy={center} r={((i + 1) / maxLevel) * (center - 20)} fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
            ))}
            {/* Data Polygon */}
            <polygon points={points} fill="rgba(251, 113, 133, 0.4)" stroke="#FB7185" strokeWidth="1.5" />
            {/* Labels */}
            {labels}
        </svg>
    );
};

const BarChart: React.FC<{ data: ProjectVelocityData[] }> = ({ data }) => {
    const maxProjects = Math.max(...data.map(d => d.projects), 0) || 1;
    return (
        <div className="flex justify-around items-end h-40 bg-lime-50 dark:bg-slate-950 p-4 rounded-lg border border-lime-200 dark:border-slate-700">
            {data.map(item => (
                <div key={item.month} className="flex flex-col items-center h-full justify-end">
                    <div className="w-8 bg-rose-300 rounded-t-md hover:bg-rose-400 transition-colors" style={{ height: `${(item.projects / maxProjects) * 100}%` }} title={`${item.projects} projects`} />
                    <span className="text-xs font-semibold text-rose-700 mt-1">{item.month}</span>
                </div>
            ))}
        </div>
    );
};


const PersonalGrowthDashboard: React.FC = () => {
    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <GrowthIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">My Growth Dashboard</h2>
                    </div>
                    <p className="text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                        Your personal journey, visualized. Track your progress, celebrate your milestones, and discover insights into your habits and growth.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Top Row: Contribution Graph */}
                    <div className="bg-lime-50 dark:bg-slate-950 p-6 rounded-2xl shadow-lg border">
                        <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-4">Coding Consistency</h3>
                        <ContributionHistoryGraph />
                        <p className="text-xs text-rose-500 dark:text-rose-400 mt-2 text-center">Past 12 months of GitHub activity.</p>
                    </div>

                    {/* Bottom Row: Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Skill Diversity */}
                        <div className="bg-lime-50 dark:bg-slate-950 p-6 rounded-2xl shadow-lg border">
                            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-2 text-center">Skill Diversity</h3>
                            <div className="flex justify-center items-center h-48">
                                <RadarChart data={mockSkillData} />
                            </div>
                        </div>

                        {/* Project Velocity */}
                        <div className="bg-lime-50 dark:bg-slate-950 p-6 rounded-2xl shadow-lg border">
                            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-4 text-center">Project Velocity</h3>
                            <BarChart data={mockProjectVelocity} />
                        </div>

                        {/* Community Impact */}
                        <div className="bg-lime-50 dark:bg-slate-950 p-6 rounded-2xl shadow-lg border">
                             <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-4 text-center">Community Impact</h3>
                             <div className="space-y-3">
                                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                                    <p className="text-3xl font-bold text-rose-800 dark:text-rose-200">{mockCommunityImpact.mentees}</p>
                                    <p className="text-sm text-rose-600 dark:text-rose-300">Mentees Guided</p>
                                </div>
                                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                                    <p className="text-3xl font-bold text-rose-800 dark:text-rose-200">{mockCommunityImpact.doubtsAnswered}</p>
                                    <p className="text-sm text-rose-600 dark:text-rose-300">Doubts Answered</p>
                                </div>
                                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                                    <p className="text-3xl font-bold text-rose-800 dark:text-rose-200">{mockCommunityImpact.articleClaps}</p>
                                    <p className="text-sm text-rose-600 dark:text-rose-300">Article Claps Received</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalGrowthDashboard;
