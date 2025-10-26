import React, { useState, useMemo } from 'react';
import type { OpenSourceIssue } from '../types';

// --- ICONS ---
const CodeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const BookIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 011.056 0l4 2a1 1 0 010 1.84l-4 2a.999.999 0 01-1.056 0L3 12.14a1 1 0 000 1.84l7 3a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-1.856-.928a.999.999 0 01-1.056 0l-4-2a1 1 0 010-1.84l4-2a.999.999 0 011.056 0L17 7.86a1 1 0 000-1.84l-7-3zM3 9.36l4 2v3.28l-4-2V9.36zm14.146-2.828L17 6.64v3.28l-1.856.928a.999.999 0 01-1.056 0l-4-2a1 1 0 010-1.84l4-2a.999.999 0 011.056 0z" /></svg>;
const ExternalLinkIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 opacity-60 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- MOCK DATA ---
const mockIssues: OpenSourceIssue[] = [
    { id: 1, repoName: 'awesome-for-beginners/awesome-for-beginners', repoUrl: 'https://github.com/awesome-for-beginners/awesome-for-beginners', title: 'Add a new project to the Python list', url: 'https://github.com/awesome-for-beginners/awesome-for-beginners/issues/1', language: 'Python', labels: [{ name: 'good first issue', color: 'bg-teal-200 text-teal-800' }, { name: 'help wanted', color: 'bg-rose-200 text-rose-800' }] },
    { id: 2, repoName: 'facebook/react', repoUrl: 'https://github.com/facebook/react', title: 'Improve documentation for custom hooks', url: 'https://github.com/facebook/react/issues/2', language: 'JavaScript', labels: [{ name: 'good first issue', color: 'bg-teal-200 text-teal-800' }, { name: 'documentation', color: 'bg-blue-200 text-blue-800' }] },
    { id: 3, repoName: 'microsoft/vscode', repoUrl: 'https://github.com/microsoft/vscode', title: 'Fix typo in settings description', url: 'https://github.com/microsoft/vscode/issues/3', language: 'TypeScript', labels: [{ name: 'good first issue', color: 'bg-teal-200 text-teal-800' }] },
    { id: 4, repoName: 'golang/go', repoUrl: 'https://github.com/golang/go', title: 'Add example for strings.Builder', url: 'https://github.com/golang/go/issues/4', language: 'Go', labels: [{ name: 'documentation', color: 'bg-blue-200 text-blue-800' }, { name: 'help wanted', color: 'bg-rose-200 text-rose-800' }] },
    { id: 5, repoName: 'rust-lang/rust', repoUrl: 'https://github.com/rust-lang/rust', title: 'Clarify error message for lifetime mismatch', url: 'https://github.com/rust-lang/rust/issues/5', language: 'Rust', labels: [{ name: 'good first issue', color: 'bg-teal-200 text-teal-800' }] },
    { id: 6, repoName: 'denoland/deno', repoUrl: 'https://github.com/denoland/deno', title: 'Update dependencies in `std` module', url: 'https://github.com/denoland/deno/issues/6', language: 'TypeScript', labels: [{ name: 'help wanted', color: 'bg-rose-200 text-rose-800' }] },
];

const languages = ['All', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust'];

// --- SUB-COMPONENTS ---
const IssueCard: React.FC<{ issue: OpenSourceIssue }> = ({ issue }) => (
    <div className="bg-white p-4 rounded-lg border border-lime-200 hover:shadow-md hover:border-rose-300 transition-all duration-300">
        <a href={issue.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-600 hover:text-rose-800 group inline-flex items-center">
            {issue.repoName} <ExternalLinkIcon />
        </a>
        <h3 className="font-bold text-rose-900 mt-1">
            <a href={issue.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{issue.title}</a>
        </h3>
        <div className="flex items-center flex-wrap gap-2 mt-3">
            <span className="text-xs font-semibold bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{issue.language}</span>
            {issue.labels.map(label => (
                <span key={label.name} className={`text-xs font-semibold px-2 py-1 rounded-full ${label.color}`}>
                    {label.name}
                </span>
            ))}
        </div>
        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 w-full text-center py-2 bg-rose-400 text-white font-semibold rounded-lg hover:bg-rose-500 transition-colors">
            Contribute
        </a>
    </div>
);

const ContributionGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const steps = [
        { title: '1. Fork the Repository', content: "Click the 'Fork' button on the top right of the project's GitHub page. This creates a copy of the project in your own GitHub account." },
        { title: '2. Clone Your Fork', content: "On your fork's page, click 'Code' and copy the URL. In your terminal, run <code class='bg-lime-200 text-lime-900 p-1 rounded'>git clone COPIED_URL</code> to download it to your computer." },
        { title: '3. Create a New Branch', content: "Navigate into the project directory (<code class='bg-lime-200 text-lime-900 p-1 rounded'>cd repo-name</code>) and create a branch for your changes: <code class='bg-lime-200 text-lime-900 p-1 rounded'>git checkout -b your-branch-name</code>." },
        { title: '4. Make Your Changes', content: "Open the project in your code editor and make the necessary changes to fix the issue. Save your files." },
        { title: '5. Commit and Push', content: "Add your changes with <code class='bg-lime-200 text-lime-900 p-1 rounded'>git add .</code>, then commit them with <code class='bg-lime-200 text-lime-900 p-1 rounded'>git commit -m 'Your commit message'</code>. Push them to your fork: <code class='bg-lime-200 text-lime-900 p-1 rounded'>git push origin your-branch-name</code>." },
        { title: '6. Create a Pull Request', content: "Go back to your fork on GitHub. You'll see a button to 'Compare & pull request'. Click it, write a clear description of your changes, and submit the pull request!" },
    ];
    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600"><CloseIcon /></button>
                <h2 className="text-2xl font-bold text-rose-900 mb-4 text-center">How to Contribute to Open Source</h2>
                <div className="overflow-y-auto pr-4 space-y-4">
                    {steps.map(step => (
                        <div key={step.title} className="bg-lime-50 p-4 rounded-lg border border-lime-200">
                            <h3 className="font-bold text-rose-800">{step.title}</h3>
                            <p className="text-rose-700 mt-1" dangerouslySetInnerHTML={{ __html: step.content }}></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const OpenSourceExplorer: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const filteredIssues = useMemo(() => {
        if (selectedLanguage === 'All') return mockIssues;
        return mockIssues.filter(issue => issue.language === selectedLanguage);
    }, [selectedLanguage]);

    return (
        <section className="py-20 bg-lime-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <CodeIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Open Source Explorer</h2>
                    </div>
                    <p className="text-lg text-rose-600 max-w-2xl mx-auto">Find beginner-friendly issues and make your first contribution to open source projects.</p>
                    <button onClick={() => setIsGuideOpen(true)} className="mt-4 inline-flex items-center text-rose-500 font-semibold hover:underline">
                        <BookIcon /> How to Contribute Guide
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
                    {languages.map(lang => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${selectedLanguage === lang ? 'bg-rose-400 text-white shadow-md' : 'bg-white text-rose-700 hover:bg-lime-200'}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.length > 0 ? (
                        filteredIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3 text-center text-rose-600 bg-white p-8 rounded-lg">
                            <p>No issues found for this language. Try another filter!</p>
                        </div>
                    )}
                </div>
            </div>
            {isGuideOpen && <ContributionGuideModal onClose={() => setIsGuideOpen(false)} />}
        </section>
    );
};

export default OpenSourceExplorer;