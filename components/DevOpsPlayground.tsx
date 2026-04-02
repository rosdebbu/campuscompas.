import React, { useState, useMemo, useEffect } from 'react';
import type { PipelineStage } from '../types';

// --- ICONS ---
const DevOpsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
const DockerIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7v10l8 4" /></svg>;
const GitIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PipelineIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const CheckCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- SHARED COMPONENTS ---
const CodeBlock: React.FC<{ children: React.ReactNode; language: string }> = ({ children, language }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm font-mono overflow-x-auto">
        <code className={`language-${language}`}>{children}</code>
    </pre>
);

const Terminal: React.FC<{ logs: string[] }> = ({ logs }) => (
    <div className="bg-gray-900 text-white p-4 rounded-lg h-64 font-mono text-xs overflow-y-auto">
        {logs.map((log, i) => <p key={i} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: log }} />)}
    </div>
);


// --- DOCKER MODULE ---
const DockerModule: React.FC = () => {
    const [logs, setLogs] = useState<string[]>(['$ Welcome to the Docker simulation!']);
    const [status, setStatus] = useState<'idle' | 'building' | 'built' | 'running'>('idle');

    const handleBuild = () => {
        setStatus('building');
        let newLogs = ['$ <span class="text-teal-400">docker build -t my-app .</span>'];
        setLogs(prev => [...prev, ...newLogs]);

        setTimeout(() => setLogs(prev => [...prev, 'Sending build context to Docker daemon...']), 500);
        setTimeout(() => setLogs(prev => [...prev, 'Step 1/4 : FROM node:18-alpine']), 1000);
        setTimeout(() => setLogs(prev => [...prev, 'Step 2/4 : WORKDIR /app']), 1500);
        setTimeout(() => setLogs(prev => [...prev, 'Step 3/4 : COPY package*.json ./']), 2000);
        setTimeout(() => setLogs(prev => [...prev, 'Step 4/4 : RUN npm install']), 2500);
        setTimeout(() => {
            setLogs(prev => [...prev, 'Successfully built my-app:latest']);
            setStatus('built');
        }, 3500);
    };

    const handleRun = () => {
        setStatus('running');
        let newLogs = ['$ <span class="text-teal-400">docker run -p 3000:3000 my-app</span>'];
        setLogs(prev => [...prev, ...newLogs]);
        setTimeout(() => setLogs(prev => [...prev, '> my-app@1.0.0 start\n> node index.js\n\nServer running at http://localhost:3000/']), 1000);
    };

    const dockerfile = `
# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD [ "npm", "start" ]
    `.trim();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Dockerfile</h3>
                <CodeBlock language="dockerfile">{dockerfile}</CodeBlock>
                <div className="flex gap-4 mt-4">
                    <button onClick={handleBuild} disabled={status !== 'idle'} className="flex-1 py-2 px-4 bg-rose-400 text-white font-semibold rounded-lg disabled:bg-rose-200 hover:bg-rose-50 dark:bg-slate-8000 transition-colors">1. Build Image</button>
                    <button onClick={handleRun} disabled={status !== 'built' && status !== 'running'} className="flex-1 py-2 px-4 bg-teal-400 text-white font-semibold rounded-lg disabled:bg-teal-200 hover:bg-teal-500 transition-colors">2. Run Container</button>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Simulated Terminal</h3>
                <Terminal logs={logs} />
            </div>
        </div>
    );
};

// --- GIT MODULE ---
const GitModule: React.FC = () => {
     const [logs, setLogs] = useState<string[]>(['$ git log --oneline --graph']);
     const [branches, setBranches] = useState({ main: 'c2', dev: 'c3' });
     const [head, setHead] = useState('dev');

    const handleCommit = () => {
        setLogs(prev => [...prev, '$ <span class="text-teal-400">git commit -m "New feature"</span>', '[dev c4] New feature']);
    };
    const handleMerge = () => {
        setLogs(prev => [...prev, '$ <span class="text-teal-400">git checkout main</span>', '$ <span class="text-teal-400">git merge dev</span>', 'Merge made by the \'recursive\' strategy.']);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Git Repository Visualization</h3>
                <div className="bg-lime-50 dark:bg-slate-950 p-4 rounded-lg h-64 border border-lime-200 dark:border-slate-700 font-mono text-sm relative">
                    {/* Simplified static visualization for demo */}
                    <p>* <span className="text-yellow-500">c4 (HEAD -> dev)</span> New feature</p>
                    <p>| * <span className="text-green-500">c3</span> Another commit</p>
                    <p>|/ </p>
                    <p>* <span className="text-blue-500">c2 (main)</span> Update README</p>
                    <p>* <span className="text-gray-500 dark:text-gray-400">c1</span> Initial commit</p>
                </div>
                <div className="flex gap-4 mt-4">
                    <button onClick={handleCommit} className="flex-1 py-2 px-4 bg-rose-400 text-white font-semibold rounded-lg hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Commit to `dev`</button>
                    <button onClick={handleMerge} className="flex-1 py-2 px-4 bg-teal-400 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors">Merge `dev` to `main`</button>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Simulated Terminal</h3>
                <Terminal logs={logs} />
            </div>
        </div>
    );
};

// --- CI/CD MODULE ---
const CiCdModule: React.FC = () => {
    const initialStages: PipelineStage[] = [
        { id: 'build', name: 'Build Application', status: 'pending', log: '' },
        { id: 'test', name: 'Run Unit Tests', status: 'pending', log: '' },
        { id: 'deploy', name: 'Deploy to Staging', status: 'pending', log: '' },
    ];
    const [stages, setStages] = useState<PipelineStage[]>(initialStages);
    const [isRunning, setIsRunning] = useState(false);

    const runPipeline = async () => {
        setIsRunning(true);
        setStages(initialStages);

        for (let i = 0; i < stages.length; i++) {
            const stageId = stages[i].id;
            
            // Set to running
            setStages(prev => prev.map(s => s.id === stageId ? { ...s, status: 'running', log: 'Starting...' } : s));
            await new Promise(res => setTimeout(res, 500));

            // Simulate logs
            let log = `Running ${stages[i].name}...\n`;
            await new Promise(res => setTimeout(res, 1000));
            log += `Task completed successfully.\n`;
            setStages(prev => prev.map(s => s.id === stageId ? { ...s, log } : s));
            
            // Set to success/failure
            const isSuccess = Math.random() > 0.1; // 90% success rate
            setStages(prev => prev.map(s => s.id === stageId ? { ...s, status: isSuccess ? 'success' : 'failure', log: s.log + (isSuccess ? 'Status: OK' : 'Status: FAILED') } : s));
            
            if (!isSuccess) break; // Stop pipeline on failure
            await new Promise(res => setTimeout(res, 500));
        }
        setIsRunning(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200">CI/CD Pipeline Simulation</h3>
                 <button onClick={runPipeline} disabled={isRunning} className="py-2 px-4 bg-rose-400 text-white font-semibold rounded-lg disabled:bg-rose-200 hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Run Pipeline</button>
            </div>
            <div className="space-y-4">
                {stages.map(stage => (
                    <div key={stage.id} className="bg-lime-50 dark:bg-slate-950 p-4 rounded-lg border border-lime-200 dark:border-slate-700">
                        <div className="flex items-center">
                            {stage.status === 'success' && <CheckCircleIcon />}
                            {stage.status === 'failure' && <XCircleIcon />}
                            {stage.status === 'running' && <div className="h-6 w-6 flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-400"></div></div>}
                            {stage.status === 'pending' && <div className="h-6 w-6"><div className="h-4 w-4 mt-1 ml-1 rounded-full bg-gray-300"></div></div>}
                            <h4 className="ml-3 font-semibold text-rose-900 dark:text-rose-100">{stage.name}</h4>
                        </div>
                        {stage.log && (
                             <pre className="mt-2 bg-gray-800 text-white p-2 rounded text-xs font-mono overflow-x-auto">
                                <code>{stage.log}</code>
                            </pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const DevOpsPlayground: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'docker' | 'git' | 'cicd'>('docker');
    
    const modules = [
        { id: 'docker', name: 'Docker 101', icon: DockerIcon },
        { id: 'git', name: 'Git Branching', icon: GitIcon },
        { id: 'cicd', name: 'CI/CD Pipeline', icon: PipelineIcon },
    ];

    return (
        <section className="py-20 bg-lime-100 dark:bg-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center mb-4">
                        <DevOpsIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">DevOps Playground</h2>
                    </div>
                    <p className="text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                        Go beyond just writing code. Learn how to package, deploy, and manage your applications like a professional engineer.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg border overflow-hidden">
                    <div className="flex border-b border-lime-200 dark:border-slate-700">
                        {modules.map(mod => (
                            <button 
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id as any)}
                                className={`flex-1 py-4 px-2 text-center font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${activeModule === mod.id ? 'border-b-4 border-rose-400 text-rose-600 dark:text-rose-300' : 'text-rose-500 dark:text-rose-400 hover:bg-lime-50 dark:bg-slate-950'}`}
                            >
                                <mod.icon className="h-5 w-5" />
                                {mod.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-6 sm:p-8">
                        {activeModule === 'docker' && <DockerModule />}
                        {activeModule === 'git' && <GitModule />}
                        {activeModule === 'cicd' && <CiCdModule />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DevOpsPlayground;
