
import React, { useState, useMemo } from 'react';
import type { InternshipListing, InsiderReview, TrackedApplication, ApplicationStatus } from '../types';

// --- ICONS ---
const BriefcaseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = true }) => <svg className={`w-5 h-5 ${filled ? 'text-orange-300' : 'text-orange-100'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const CheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

// --- MOCK DATA ---
const mockReviews: InsiderReview[] = [
    { reviewer: 'SRMIST Senior, CSE', year: 2023, rating: 5, review: 'Amazing work culture and great mentorship. You get to work on real products from day one.', interviewTips: 'Focus on Data Structures and Algorithms. The interview process is pretty standard with 2 technical rounds and 1 HR round.' },
    { reviewer: 'SRMIST Alumnus, ECE', year: 2022, rating: 4, review: 'The projects are challenging and you learn a lot. The stipend is also very competitive.', interviewTips: 'Be prepared for system design questions, even for an intern role. They want to see how you think.' },
];
const mockListings: InternshipListing[] = [
    { id: 1, title: 'Software Development Engineer Intern', company: 'Microsoft', logoUrl: 'https://cdn.icon-icons.com/icons2/2429/PNG/512/microsoft_logo_icon_147261.png', location: 'Hyderabad (Hybrid)', stipend: '₹80,000/month', type: 'Internship', description: 'Work on cutting-edge projects with a global team of engineers. Develop, test, and deploy software that empowers every person on the planet.', requirements: ['C++', 'Data Structures', 'Algorithms', 'Problem Solving'], reviews: mockReviews },
    { id: 2, title: 'STEP Intern', company: 'Google', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', location: 'Bangalore', stipend: '₹90,000/month', type: 'Internship', description: 'STEP (Student Training in Engineering Program) is a 12-week internship for first and second-year undergraduate students with a passion for computer science.', requirements: ['Java', 'Python', 'Object-Oriented Programming'], reviews: [] },
    { id: 3, title: 'Frontend Developer Intern', company: 'InnovateX', logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=rose&shade=500', location: 'Chennai (On-site)', stipend: '₹25,000/month', type: 'Internship', description: 'Join our fast-paced startup and take ownership of our user-facing features. You will work directly with the founders.', requirements: ['React', 'TypeScript', 'Tailwind CSS'], reviews: [{ reviewer: 'SRMIST Junior, CSE', year: 2023, rating: 4, review: 'You get a lot of responsibility which is great for learning. The team is small and very supportive.', interviewTips: 'They focus heavily on your projects. Have a solid portfolio and be able to explain your design choices.' }] },
    { id: 4, title: 'Backend Engineering Co-op', company: 'Zomato', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png', location: 'Gurgaon', stipend: '₹50,000/month', type: 'Co-op', description: 'A 6-month co-op program where you will contribute to the services that power one of India\'s largest food delivery platforms.', requirements: ['Go', 'Node.js', 'Microservices', 'Databases'], reviews: [] },
];
const initialApplications: TrackedApplication[] = [
    { id: 1, listing: mockListings[0], status: 'Applied' },
    { id: 2, listing: mockListings[1], status: 'Saved' },
    { id: 3, listing: mockListings[3], status: 'Interviewing' },
];

// --- MODAL ---
const DetailsModal: React.FC<{ listing: InternshipListing, onClose: () => void, onApply: (listingId: number) => void }> = ({ listing, onClose, onApply }) => (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl p-4 sm:p-8 relative max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 dark:text-rose-300"><CloseIcon /></button>
            <div className="flex items-center mb-6">
                <img src={listing.logoUrl} alt={`${listing.company} logo`} className="w-16 h-16 mr-4 object-contain" />
                <div>
                    <h2 className="text-3xl font-bold text-rose-900 dark:text-rose-100">{listing.title}</h2>
                    <p className="text-lg text-rose-600 dark:text-rose-300">{listing.company}</p>
                </div>
            </div>
            <div className="overflow-y-auto pr-4 space-y-6">
                <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-lime-100 dark:bg-slate-800 text-lime-800 px-3 py-1 rounded-full font-semibold">{listing.location}</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">{listing.stipend}</span>
                    <span className="bg-rose-100 text-rose-800 dark:text-rose-200 px-3 py-1 rounded-full font-semibold">{listing.type}</span>
                </div>
                <div>
                    <h3 className="font-bold text-rose-800 dark:text-rose-200 text-lg mb-2">Job Description</h3>
                    <p className="text-rose-700">{listing.description}</p>
                </div>
                <div>
                    <h3 className="font-bold text-rose-800 dark:text-rose-200 text-lg mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-rose-700 space-y-1">
                        {listing.requirements.map(req => <li key={req}>{req}</li>)}
                    </ul>
                </div>
                {listing.reviews.length > 0 && (
                    <div>
                        <h3 className="font-bold text-rose-800 dark:text-rose-200 text-lg mb-2">Insider Reviews</h3>
                        <div className="space-y-4">
                            {listing.reviews.map(review => (
                                <div key={review.year} className="bg-lime-50 dark:bg-slate-950 p-4 rounded-lg border border-lime-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-rose-800 dark:text-rose-200">{review.reviewer} ({review.year})</p>
                                        <div className="flex">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}</div>
                                    </div>
                                    <p className="text-rose-700 mt-2 italic">"{review.review}"</p>
                                    <p className="text-rose-700 mt-2"><strong className="text-rose-800 dark:text-rose-200">Interview Tips:</strong> {review.interviewTips}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto pt-6">
                <button onClick={() => onApply(listing.id)} className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow-md hover:bg-rose-50 dark:bg-slate-8000 transition-colors flex items-center justify-center">
                    <CheckIcon /> One-Click Apply with Portfolio
                </button>
            </div>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const InternshipBoard: React.FC = () => {
    const [view, setView] = useState<'browse' | 'tracker'>('browse');
    const [selectedListing, setSelectedListing] = useState<InternshipListing | null>(null);
    const [applications, setApplications] = useState<TrackedApplication[]>(initialApplications);
    
    const applicationStatuses: ApplicationStatus[] = ['Saved', 'Applied', 'Interviewing', 'Offer'];

    const handleApply = (listingId: number) => {
        const existingApp = applications.find(app => app.listing.id === listingId);
        if (existingApp) {
            setApplications(apps => apps.map(app => app.id === existingApp.id ? { ...app, status: 'Applied' } : app));
        } else {
            const listing = mockListings.find(l => l.id === listingId);
            if(listing) {
                const newApp: TrackedApplication = { id: Date.now(), listing, status: 'Applied' };
                setApplications(apps => [...apps, newApp]);
            }
        }
        alert(`Applied to ${selectedListing?.title}!`);
        setSelectedListing(null);
    };
    
    const BrowseView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockListings.map(listing => (
                <button key={listing.id} onClick={() => setSelectedListing(listing)} className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 text-left transform hover:-translate-y-1 transition-transform duration-300 border border-lime-200 dark:border-slate-700 flex items-start gap-4">
                    <img src={listing.logoUrl} alt={`${listing.company} logo`} className="w-12 h-12 object-contain flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="text-sm text-rose-500 dark:text-rose-400">{listing.company}</p>
                        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100">{listing.title}</h3>
                        <p className="text-sm text-rose-600 dark:text-rose-300 mt-1">{listing.location} • {listing.stipend}</p>
                    </div>
                </button>
            ))}
        </div>
    );
    
    const TrackerView = () => (
        <div className="w-full h-full overflow-x-auto">
            <div className="flex gap-6 min-w-max h-full">
                {applicationStatuses.map(status => (
                    <div key={status} className="w-72 bg-lime-100 dark:bg-slate-800 rounded-xl p-3 flex-shrink-0 flex flex-col">
                        <h3 className="font-bold text-rose-800 dark:text-rose-200 mb-3 px-1">{status}</h3>
                        <div className="space-y-3 overflow-y-auto flex-grow">
                           {applications.filter(app => app.status === status).map(app => (
                               <div key={app.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm">
                                   <p className="font-semibold text-rose-800 dark:text-rose-200">{app.listing.title}</p>
                                   <p className="text-sm text-rose-500 dark:text-rose-400">{app.listing.company}</p>
                               </div>
                           ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section className="py-12 md:py-20 bg-lime-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                     <div className="flex justify-center items-center mb-4">
                        <BriefcaseIcon />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Internship & Co-op Board</h2>
                    </div>
                    <p className="text-base sm:text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                        Your first step into the tech industry. Discover paid internships and co-ops with companies, vetted for students.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 sm:p-6 min-h-[600px] flex flex-col">
                    <div className="flex-shrink-0 mb-4 bg-lime-50/50 p-1.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2">
                         <button onClick={() => setView('browse')} className={`w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors ${view === 'browse' ? 'bg-white dark:bg-slate-900 shadow text-rose-600 dark:text-rose-300' : 'text-rose-500 dark:text-rose-400'}`}>Browse Internships</button>
                         <button onClick={() => setView('tracker')} className={`w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors ${view === 'tracker' ? 'bg-white dark:bg-slate-900 shadow text-rose-600 dark:text-rose-300' : 'text-rose-500 dark:text-rose-400'}`}>My Applications</button>
                    </div>

                    <div className="flex-grow min-h-0">
                      {view === 'browse' ? <BrowseView /> : <TrackerView />}
                    </div>
                </div>
            </div>
            {selectedListing && <DetailsModal listing={selectedListing} onClose={() => setSelectedListing(null)} onApply={handleApply} />}
        </section>
    );
};

export default InternshipBoard;
