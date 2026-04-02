
import React, { useState } from 'react';

// --- ICONS ---
const ApiIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const PlayIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BuildIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const DocsIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// --- SHARED COMPONENTS ---
const CodeBlock: React.FC<{ children: React.ReactNode; language: string }> = ({ children, language }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm font-mono overflow-x-auto"><code className={`language-${language}`}>{children}</code></pre>
);

// --- API PLAYGROUND MODULE ---
const ApiPlaygroundModule: React.FC = () => {
    const [api, setApi] = useState('github');
    const [endpoint, setEndpoint] = useState('/users/google/repos');
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiDetails = {
        github: { name: 'GitHub API', base: 'https://api.github.com', example: '/users/{username}/repos' },
        jokes: { name: 'Joke API', base: 'https://official-joke-api.appspot.com', example: '/random_joke' },
    };

    const handleSendRequest = () => {
        setIsLoading(true);
        setResponse(null);
        setTimeout(() => {
            const mockResponse = api === 'github'
                ? [{ id: 1296269, name: 'octocat/Hello-World', full_name: 'octocat/Hello-World', private: false }]
                : { id: 1, type: 'general', setup: 'What do you call a fake noodle?', punchline: 'An Impasta.' };
            setResponse(JSON.stringify(mockResponse, null, 2));
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Make a Request</h3>
                <div className="space-y-4 bg-lime-50 dark:bg-slate-950 p-4 rounded-lg border border-lime-200 dark:border-slate-700">
                    <div>
                        <label className="text-sm font-medium text-rose-700">Select API</label>
                        <select value={api} onChange={e => setApi(e.target.value)} className="w-full mt-1 p-2 rounded bg-white dark:bg-slate-900">
                            <option value="github">GitHub</option>
                            <option value="jokes">Joke API</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-rose-700">Endpoint</label>
                        <div className="flex items-center mt-1">
                            <span className="bg-gray-200 p-2 rounded-l text-sm">{apiDetails[api as keyof typeof apiDetails].base}</span>
                            <input type="text" value={endpoint} onChange={e => setEndpoint(e.target.value)} className="w-full p-2 rounded-r" />
                        </div>
                         <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">Example: <code className="bg-rose-100 p-1 rounded">{apiDetails[api as keyof typeof apiDetails].example}</code></p>
                    </div>
                     <button onClick={handleSendRequest} disabled={isLoading} className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg disabled:bg-rose-200 hover:bg-rose-50 dark:bg-slate-8000 transition-colors">
                        {isLoading ? 'Sending...' : 'Send Request'}
                    </button>
                </div>
            </div>
            <div>
                 <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Response</h3>
                 <div className="h-80">
                    <CodeBlock language="json">{isLoading ? "Loading..." : response || "// Response will appear here"}</CodeBlock>
                </div>
            </div>
        </div>
    );
};

// --- BUILD API MODULE ---
const BuildApiModule: React.FC = () => {
    const [framework, setFramework] = useState('node');
    const nodeCode = `
const express = require('express');
const app = express();
app.use(express.json());

let todos = [{ id: 1, task: 'Learn APIs', completed: true }];

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST a new todo
app.post('/todos', (req, res) => {
  const newTodo = { id: Date.now(), ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
    `.trim();

    return (
        <div>
            <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Build a Simple "To-Do List" API</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <p className="text-rose-700 mb-4">This example shows the basic code for creating a REST API with Express.js. It has two endpoints: one to get all to-do items and one to add a new one.</p>
                     <CodeBlock language="javascript">{nodeCode}</CodeBlock>
                 </div>
                 <div>
                    <h4 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">Test it Out</h4>
                    <p className="text-sm text-rose-600 dark:text-rose-300 mb-2">You can test this API using a tool like Postman or with curl commands in your terminal:</p>
                    <p className="font-semibold text-rose-800 dark:text-rose-200 mt-4">Fetch all items:</p>
                    <CodeBlock language="bash">curl http://localhost:3000/todos</CodeBlock>
                    <p className="font-semibold text-rose-800 dark:text-rose-200 mt-4">Add a new item:</p>
                    <CodeBlock language="bash">
{`curl -X POST http://localhost:3000/todos \\
-H "Content-Type: application/json" \\
-d '{"task": "Build an API", "completed": false}'`}
                    </CodeBlock>
                </div>
             </div>
        </div>
    );
};

// --- DOCS CHALLENGE MODULE ---
const DocsChallengeModule: React.FC = () => {
    const swaggerYaml = `
openapi: 3.0.0
info:
  title: Simple Books API
  version: 1.0.0
paths:
  /books:
    get:
      summary: Returns a list of books.
      responses:
        '200':
          description: A JSON array of books
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    title:
                      type: string
                    author:
                      type: string
    `.trim();

    return (
        <div>
            <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">Documenting an API with OpenAPI (Swagger)</h3>
            <p className="text-rose-700 mb-4">Good documentation is crucial for any API. The OpenAPI Specification is a standard way to describe REST APIs. The YAML code below defines a simple endpoint, and the panel on the right shows how it would be rendered in a tool like Swagger UI.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <CodeBlock language="yaml">{swaggerYaml}</CodeBlock>
                </div>
                <div className="bg-lime-50 dark:bg-slate-950 p-4 rounded-lg border border-lime-200 dark:border-slate-700">
                    <h4 className="text-lg font-bold">Swagger UI Preview</h4>
                    <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded shadow-sm">
                        <div className="p-2 bg-teal-100 rounded flex items-center">
                            <span className="font-bold text-teal-800 text-sm mr-4 bg-teal-200 px-2 py-1 rounded">GET</span>
                            <span className="font-mono text-teal-900">/books</span>
                        </div>
                        <div className="p-2 mt-2">
                             <p className="text-sm text-gray-600 dark:text-gray-400">Returns a list of books.</p>
                             <p className="font-semibold mt-2 text-gray-800 dark:text-gray-200">Responses</p>
                             <div className="flex items-center justify-between mt-1 text-sm bg-gray-100 p-2 rounded">
                                 <span><span className="font-mono text-green-700">200</span> A JSON array of books</span>
                                 <a href="#" className="text-blue-600 hover:underline">Schema</a>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const ApiIntegrationLab: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'playground' | 'build' | 'docs'>('playground');
    
    const modules = [
        { id: 'playground', name: 'API Playground', icon: PlayIcon },
        { id: 'build', name: 'Build Your Own API', icon: BuildIcon },
        { id: 'docs', name: 'Documentation Challenge', icon: DocsIcon },
    ];

    return (
        <section className="py-20 bg-lime-100 dark:bg-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center mb-4">
                        <ApiIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">API & Integration Lab</h2>
                    </div>
                    <p className="text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                        Connect your code to the world. Learn to fetch data, automate tasks, and build powerful applications using APIs.
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
                        {activeModule === 'playground' && <ApiPlaygroundModule />}
                        {activeModule === 'build' && <BuildApiModule />}
                        {activeModule === 'docs' && <DocsChallengeModule />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApiIntegrationLab;
