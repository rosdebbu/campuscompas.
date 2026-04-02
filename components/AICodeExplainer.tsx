import React from 'react';

const CodeExplainerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const AICodeExplainer: React.FC = () => {
    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="bg-lime-50 dark:bg-slate-950 rounded-2xl shadow-lg p-8 text-center border border-lime-200 dark:border-slate-700 max-w-4xl mx-auto">
                    <div className="flex justify-center items-center mb-4">
                        <CodeExplainerIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">AI Code Explainer</h2>
                    </div>
                    <p className="text-lg text-rose-600 dark:text-rose-300 max-w-2xl mx-auto">
                        Stuck on a complex piece of code? Paste it here to get a line-by-line explanation of what it does and how it works.
                    </p>
                    <a
                        href="https://rosdebbu.github.io/Self-Explaining-Code-Notebook/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-block px-8 py-4 bg-rose-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-rose-50 dark:bg-slate-8000 transition-all transform hover:scale-105 active:scale-95 duration-300"
                    >
                        Launch Code Explainer
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AICodeExplainer;