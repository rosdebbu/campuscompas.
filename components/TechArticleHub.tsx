import React, { useState } from 'react';
import type { TechArticle } from '../types';

// ICONS
const ArticleHubIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ClapIcon: React.FC<{ clapped?: boolean }> = ({ clapped }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-200 ${clapped ? 'text-rose-500' : 'text-rose-300 hover:text-rose-400'}`} fill={clapped ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>;
const WriteIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-4 h-4"}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>;

// MOCK DATA
const initialArticles: TechArticle[] = [
    { id: 1, title: 'Getting Started with React Hooks', author: { name: 'Priya Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=priya' }, date: 'Oct 28, 2024', content: 'React Hooks have revolutionized how we write components. This tutorial covers the basics of useState and useEffect...', tags: ['React', 'JavaScript'], claps: 128, repoUrl: 'https://github.com/debjitttdasss/campus-navigator-app', imageUrl: 'https://picsum.photos/seed/article1/600/400' },
    { id: 2, title: 'A Deep Dive into Python\'s asyncio', author: { name: 'Rajesh Kumar', avatarUrl: 'https://i.pravatar.cc/150?u=rajesh' }, date: 'Oct 26, 2024', content: 'Asynchronous programming in Python can be tricky. Here, we explore the asyncio library to build concurrent applications...', tags: ['Python', 'Async'], claps: 95, imageUrl: 'https://picsum.photos/seed/article2/600/400' },
    { id: 3, title: 'How to Structure a Node.js Project', author: { name: 'Anjali Singh', avatarUrl: 'https://i.pravatar.cc/150?u=anjali' }, date: 'Oct 25, 2024', content: 'A well-structured project is easier to maintain. Let\'s look at some best practices for organizing your Express.js applications.', tags: ['Node.js', 'Express'], claps: 210, repoUrl: 'https://github.com/debjitttdasss/dotfiles', imageUrl: 'https://picsum.photos/seed/article3/600/400' },
];

const currentUser = { name: 'Debjit Das', avatarUrl: 'https://i.pravatar.cc/150?u=debjit' };

// MODALS
const BaseModal: React.FC<{ children: React.ReactNode, onClose: () => void }> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600"><CloseIcon /></button>
            {children}
        </div>
    </div>
);

const WriteArticleModal: React.FC<{ onClose: () => void; onPublish: (article: Omit<TechArticle, 'id' | 'author' | 'date' | 'claps'>) => void; }> = ({ onClose, onPublish }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [repoUrl, setRepoUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPublish({ title, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean), repoUrl, imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400` });
        onClose();
    };

    return (
        <BaseModal onClose={onClose}>
            <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">Write New Article</h2>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Article Title" required className="w-full p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} placeholder="Write your content here... (Markdown is supported)" required className="w-full p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400"></textarea>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated, e.g., React, Python)" className="w-full p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                <input type="url" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="Optional: GitHub Repo URL" className="w-full p-3 rounded-lg bg-lime-100 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-500 transition-colors">Publish Article</button>
            </form>
        </BaseModal>
    );
};

const ReadArticleModal: React.FC<{ article: TechArticle; onClose: () => void; }> = ({ article, onClose }) => (
    <BaseModal onClose={onClose}>
        <div className="overflow-y-auto pr-4">
            <h2 className="text-3xl font-bold text-rose-900">{article.title}</h2>
            <div className="flex items-center my-4">
                <img src={article.author.avatarUrl} alt={article.author.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <p className="font-semibold text-rose-800">{article.author.name}</p>
                    <p className="text-sm text-rose-500">{article.date}</p>
                </div>
            </div>
            {article.repoUrl && (
                 <a href={article.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-full hover:bg-gray-900 transition-colors mb-4">
                    <GitHubIcon className="w-4 h-4" /> View Project on GitHub
                </a>
            )}
            <div className="prose max-w-none text-rose-800">
                {article.content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
        </div>
    </BaseModal>
);

// ARTICLE CARD
const ArticleCard: React.FC<{ article: TechArticle; onReadMore: () => void; onClap: () => void; }> = ({ article, onReadMore, onClap }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col border border-lime-200">
        <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-rose-900">{article.title}</h3>
                <div className="flex items-center my-3">
                    <img src={article.author.avatarUrl} alt={article.author.name} className="w-8 h-8 rounded-full mr-2" />
                    <p className="text-sm text-rose-600">{article.author.name} • {article.date}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => <span key={tag} className="text-xs font-semibold bg-lime-200 text-lime-800 px-2 py-1 rounded-full">{tag}</span>)}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-lime-200 flex justify-between items-center">
                <button onClick={onClap} className="flex items-center gap-2 text-rose-600 font-semibold">
                    <ClapIcon /> {article.claps}
                </button>
                <button onClick={onReadMore} className="font-semibold text-rose-500 hover:text-rose-700 transition-colors">Read More &rarr;</button>
            </div>
        </div>
    </div>
);


// MAIN COMPONENT
const TechArticleHub: React.FC = () => {
    const [articles, setArticles] = useState<TechArticle[]>(initialArticles);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<TechArticle | null>(null);

    const handlePublish = (newArticleData: Omit<TechArticle, 'id' | 'author' | 'date' | 'claps'>) => {
        const newArticle: TechArticle = {
            ...newArticleData,
            id: Date.now(),
            author: currentUser,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            claps: 0,
        };
        setArticles(prev => [newArticle, ...prev]);
    };

    const handleClap = (articleId: number) => {
        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, claps: a.claps + 1 } : a));
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <ArticleHubIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Tech Article Hub</h2>
                    </div>
                    <p className="text-lg text-rose-600 max-w-3xl mx-auto">
                        Solidify your knowledge by teaching others. Write articles, share your projects, and build your online presence.
                    </p>
                    <button onClick={() => setIsWriteModalOpen(true)} className="mt-6 inline-flex items-center px-6 py-3 bg-rose-400 text-white font-semibold rounded-full shadow-lg hover:bg-rose-500 transition-colors transform hover:scale-105">
                        <WriteIcon /> Write New Article
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(article => (
                        <ArticleCard 
                            key={article.id} 
                            article={article} 
                            onReadMore={() => setSelectedArticle(article)} 
                            onClap={() => handleClap(article.id)}
                        />
                    ))}
                </div>
            </div>
            
            {isWriteModalOpen && <WriteArticleModal onClose={() => setIsWriteModalOpen(false)} onPublish={handlePublish} />}
            {selectedArticle && <ReadArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
        </section>
    );
};

export default TechArticleHub;