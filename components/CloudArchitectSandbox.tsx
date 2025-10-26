import React, { useState, useEffect } from 'react';
import type { VirtualMachine, CloudDatabase, ServerlessFunction } from '../types';

// --- ICONS ---
const CloudIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const ServerIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" transform="rotate(90 12 12)" /></svg>;
const DatabaseIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>;
const LambdaIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const CheckCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SpinnerIcon: React.FC = () => <svg className="animate-spin h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- SHARED COMPONENTS ---
const CodeBlock: React.FC<{ children: React.ReactNode; language: string }> = ({ children, language }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm font-mono overflow-x-auto"><code className={`language-${language}`}>{children}</code></pre>
);

const Terminal: React.FC<{ logs: string[] }> = ({ logs }) => (
    <div className="bg-gray-900 text-white p-4 rounded-lg h-48 font-mono text-xs overflow-y-auto"><p>{logs.join('\n')}</p></div>
);


// --- WEB SERVER MODULE ---
const WebServerModule: React.FC = () => {
    const [vm, setVm] = useState<VirtualMachine>({ id: 'vm-1', name: 'web-server-01', type: 't2.micro', os: 'Ubuntu', status: 'off', ipAddress: null });
    const [logs, setLogs] = useState<string[]>(['Welcome to the VM launch simulator.']);

    const handleLaunch = () => {
        setVm(prev => ({ ...prev, status: 'pending', ipAddress: null }));
        setLogs(['[0.00s] Requesting instance...']);
        
        setTimeout(() => {
            setLogs(prev => [...prev, '[2.50s] Provisioning resources...']);
        }, 1000);
        setTimeout(() => {
            setLogs(prev => [...prev, '[5.80s] Configuring network...']);
            const ip = `172.31.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
            setVm(prev => ({ ...prev, ipAddress: ip }));
            setLogs(prev => [...prev, `[8.20s] Assigned public IP: ${ip}`]);
        }, 2500);
        setTimeout(() => {
            setLogs(prev => [...prev, '[12.50s] Starting operating system...']);
        }, 4000);
        setTimeout(() => {
            setLogs(prev => [...prev, '[15.00s] Instance is now running.']);
            setVm(prev => ({ ...prev, status: 'running' }));
        }, 5500);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-2">Instance Configuration</h3>
                <div className="space-y-3 bg-lime-50 p-4 rounded-lg border border-lime-200">
                    <div><label className="text-sm font-medium text-rose-700">Instance Name</label><input type="text" value={vm.name} readOnly className="w-full mt-1 p-2 rounded bg-white" /></div>
                    <div><label className="text-sm font-medium text-rose-700">Instance Type</label><input type="text" value={vm.type} readOnly className="w-full mt-1 p-2 rounded bg-white" /></div>
                    <div><label className="text-sm font-medium text-rose-700">Operating System</label><input type="text" value={vm.os} readOnly className="w-full mt-1 p-2 rounded bg-white" /></div>
                </div>
                <button onClick={handleLaunch} disabled={vm.status === 'pending' || vm.status === 'running'} className="w-full mt-4 py-3 bg-rose-400 text-white font-semibold rounded-lg disabled:bg-rose-200 hover:bg-rose-500 transition-colors">Launch Instance</button>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-2">Status & Logs</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-lime-50 p-3 rounded-lg border border-lime-200">
                        <span className="font-semibold text-rose-800">Status</span>
                        <div className="flex items-center gap-2">
                           {vm.status === 'running' && <CheckCircleIcon />}
                           {vm.status === 'pending' && <SpinnerIcon />}
                           <span className="capitalize">{vm.status}</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center bg-lime-50 p-3 rounded-lg border border-lime-200">
                        <span className="font-semibold text-rose-800">Public IP</span>
                        <span>{vm.ipAddress || 'N/A'}</span>
                    </div>
                    <Terminal logs={logs} />
                </div>
            </div>
        </div>
    );
};

// --- DATABASE MODULE ---
const DatabaseModule: React.FC = () => {
    const [db, setDb] = useState<CloudDatabase>({ id: 'db-1', name: 'production-db', engine: 'MySQL', status: 'off', endpoint: null });
    const [logs, setLogs] = useState<string[]>(['Welcome to the database provisioning simulator.']);

    const handleProvision = () => {
        setDb(prev => ({...prev, status: 'provisioning', endpoint: null}));
        setLogs(['[0.00s] Starting database provisioning...']);
        setTimeout(() => setLogs(prev => [...prev, '[4.20s] Allocating storage...']), 1500);
        setTimeout(() => setLogs(prev => [...prev, '[9.80s] Configuring database engine...']), 3500);
        setTimeout(() => {
            const endpoint = `${db.name}.c1randomstr.us-east-1.rds.amazonaws.com`;
            setDb(prev => ({ ...prev, endpoint }));
            setLogs(prev => [...prev, `[14.50s] Database is available. Endpoint: ${endpoint}`]);
        }, 5500);
         setTimeout(() => {
            setDb(prev => ({ ...prev, status: 'available' }));
        }, 6000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-2">Database Configuration</h3>
                <div className="space-y-3 bg-lime-50 p-4 rounded-lg border border-lime-200">
                     <div><label className="text-sm font-medium text-rose-700">DB Name</label><input type="text" value={db.name} readOnly className="w-full mt-1 p-2 rounded bg-white" /></div>
                     <div><label className="text-sm font-medium text-rose-700">Engine</label><input type="text" value={db.engine} readOnly className="w-full mt-1 p-2 rounded bg-white" /></div>
                </div>
                <button onClick={handleProvision} disabled={db.status !== 'off'} className="w-full mt-4 py-3 bg-rose-400 text-white font-semibold rounded-lg disabled:bg-rose-200 hover:bg-rose-500 transition-colors">Provision Database</button>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-2">Status & Logs</h3>
                <div className="space-y-3">
                     <div className="flex justify-between items-center bg-lime-50 p-3 rounded-lg border border-lime-200">
                        <span className="font-semibold text-rose-800">Status</span>
                         <div className="flex items-center gap-2">
                           {db.status === 'available' && <CheckCircleIcon />}
                           {db.status === 'provisioning' && <SpinnerIcon />}
                           <span className="capitalize">{db.status}</span>
                        </div>
                    </div>
                     <div className="bg-lime-50 p-3 rounded-lg border border-lime-200">
                        <p className="font-semibold text-rose-800">Endpoint</p>
                        <p className="text-xs break-all">{db.endpoint || 'N/A'}</p>
                    </div>
                    <Terminal logs={logs} />
                </div>
            </div>
        </div>
    );
};


// --- SERVERLESS MODULE ---
const ServerlessModule: React.FC = () => {
    const initialCode = `import json

def lambda_handler(event, context):
    # TODO implement
    name = event.get('name', 'World')
    return {
        'statusCode': 200,
        'body': json.dumps(f'Hello from Lambda, {name}!')
    }`;
    const [func, setFunc] = useState<ServerlessFunction>({ id: 'fn-1', name: 'hello-world', runtime: 'Python 3.9', code: initialCode, status: 'off', lastLog: null });
    
    const handleDeploy = () => {
        setFunc(prev => ({...prev, status: 'deploying', lastLog: 'Starting deployment...'}));
        setTimeout(() => setFunc(prev => ({...prev, status: 'deploying', lastLog: 'Packaging source code...'})), 1000);
        setTimeout(() => setFunc(prev => ({...prev, status: 'deploying', lastLog: 'Uploading to cloud...'})), 2000);
        setTimeout(() => setFunc(prev => ({...prev, status: 'deployed', lastLog: 'Deployment successful!'})), 3500);
    };

    const handleTrigger = () => {
        setFunc(prev => ({...prev, lastLog: 'Invoking function...'}));
        setTimeout(() => {
            // Simulate execution
            const response = { statusCode: 200, body: '"Hello from Lambda, CampusCompass!"' };
            setFunc(prev => ({...prev, lastLog: `Execution result:\n${JSON.stringify(response, null, 2)}`}));
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-2">Function Code ({func.runtime})</h3>
                <CodeBlock language="python">{func.code}</CodeBlock>
                 <div className="flex gap-4 mt-4">
                    <button onClick={handleDeploy} disabled={func.status === 'deploying'} className="flex-1 py-2 px-4 bg-rose-400 text-white font-semibold rounded-lg disabled:bg-rose-200 hover:bg-rose-500 transition-colors">Deploy</button>
                    <button onClick={handleTrigger} disabled={func.status !== 'deployed'} className="flex-1 py-2 px-4 bg-teal-400 text-white font-semibold rounded-lg disabled:bg-teal-200 hover:bg-teal-500 transition-colors">Trigger</button>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-rose-800 mb-2">Status & Output</h3>
                <div className="space-y-3">
                     <div className="flex justify-between items-center bg-lime-50 p-3 rounded-lg border border-lime-200">
                        <span className="font-semibold text-rose-800">Status</span>
                         <div className="flex items-center gap-2">
                           {func.status === 'deployed' && <CheckCircleIcon />}
                           {func.status === 'deploying' && <SpinnerIcon />}
                           <span className="capitalize">{func.status}</span>
                        </div>
                    </div>
                    <div className="bg-gray-900 text-white p-4 rounded-lg h-48 font-mono text-xs overflow-y-auto">
                        <p className="font-semibold mb-2">Last Log:</p>
                        <pre><code>{func.lastLog || 'No activity yet.'}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CloudArchitectSandbox: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'server' | 'database' | 'serverless'>('server');
    
    const modules = [
        { id: 'server', name: 'Web Server', icon: ServerIcon },
        { id: 'database', name: 'Database', icon: DatabaseIcon },
        { id: 'serverless', name: 'Serverless', icon: LambdaIcon },
    ];

    return (
        <section className="py-20 bg-lime-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center mb-4">
                        <CloudIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Cloud Architect Sandbox</h2>
                    </div>
                    <p className="text-lg text-rose-600 max-w-3xl mx-auto">
                        Learn the cloud without the cost. Provision virtual servers, databases, and serverless functions in our realistic cloud simulator.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border overflow-hidden">
                    <div className="flex border-b border-lime-200">
                        {modules.map(mod => (
                            <button 
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id as any)}
                                className={`flex-1 py-4 px-2 text-center font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${activeModule === mod.id ? 'border-b-4 border-rose-400 text-rose-600' : 'text-rose-500 hover:bg-lime-50'}`}
                            >
                                <mod.icon className="h-5 w-5" />
                                {mod.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-6 sm:p-8">
                        {activeModule === 'server' && <WebServerModule />}
                        {activeModule === 'database' && <DatabaseModule />}
                        {activeModule === 'serverless' && <ServerlessModule />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CloudArchitectSandbox;