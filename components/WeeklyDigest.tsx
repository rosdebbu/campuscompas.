import React from 'react';

// --- ICONS ---
const DigestIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const CalendarIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LightbulbIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const MegaphoneIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.136A1.76 1.76 0 015.882 11H11m0-5.118A2 2 0 0113 3h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-4-1.882l-2.147-6.136A1.76 1.76 0 015.882 3h2.236a2 2 0 011.789 1.118l.562 1.684m-4.254 0H11" /></svg>;
const BookOpenIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const MailIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


// --- MOCK DATA ---
const mySchedule = [
    { id: 'tech-1', title: 'AI & Machine Learning Conference', date: 'Nov 10', time: '5:00 PM', location: 'TP Ganesan Auditorium' },
    { id: 'workshop-1', title: 'React Hooks Workshop', date: 'Nov 12', time: '10:00 AM', location: 'Tech Park, Lab 404' },
];

const recommendations = [
    { id: 'tech-2', title: 'HackSRM 6.0 Kick-off', reason: 'Based on your interest in Tech' },
    { id: 'talk-1', title: 'Entrepreneurship in the Digital Age', reason: 'You attended a similar talk last month' },
];

const clubUpdates = [
    { id: 'club-1', club: 'SRM Coding Club', update: 'Recruitment for junior positions is now open! Apply by Nov 15th.' },
];

const deadlines = [
    { id: 'exam1', title: 'Calculus II Mid-Term', date: 'Nov 15', course: 'Calculus II' },
];

// --- SUB-COMPONENTS ---
interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-lime-200 h-full flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-rose-900 ml-3">{title}</h3>
        </div>
        <div className="flex-grow space-y-4 text-sm text-rose-700">
            {children}
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const WeeklyDigest: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <DigestIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Your Weekly Digest</h2>
                    </div>
                    <p className="text-lg text-rose-600 max-w-3xl mx-auto">
                        Your personalized preview of the week ahead. Never miss an event you'd love.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <InfoCard icon={<CalendarIcon />} title="My Schedule">
                            {mySchedule.map(item => (
                                <div key={item.id} className="bg-rose-50 p-3 rounded-lg">
                                    <p className="font-semibold text-rose-800">{item.title}</p>
                                    <p>{item.date} @ {item.time}</p>
                                    <p className="text-xs text-rose-500">{item.location}</p>
                                </div>
                            ))}
                        </InfoCard>

                        <InfoCard icon={<LightbulbIcon />} title="You Might Like">
                             {recommendations.map(item => (
                                <div key={item.id} className="bg-orange-50 p-3 rounded-lg">
                                    <p className="font-semibold text-orange-800">{item.title}</p>
                                    <p className="text-xs italic text-orange-600">{item.reason}</p>
                                </div>
                            ))}
                        </InfoCard>

                        <InfoCard icon={<MegaphoneIcon />} title="Club Updates">
                             {clubUpdates.map(item => (
                                <div key={item.id} className="bg-teal-50 p-3 rounded-lg">
                                    <p className="font-semibold text-teal-800">{item.club}</p>
                                    <p>{item.update}</p>
                                </div>
                            ))}
                        </InfoCard>
                        
                        <InfoCard icon={<BookOpenIcon />} title="Deadlines">
                            {deadlines.map(item => (
                                <div key={item.id} className="bg-red-50 p-3 rounded-lg">
                                    <p className="font-semibold text-red-800">{item.title}</p>
                                    <p>{item.date} - {item.course}</p>
                                </div>
                            ))}
                        </InfoCard>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-lime-100 rounded-xl shadow-sm p-6 border border-lime-300 text-center sticky top-24">
                            <h3 className="text-2xl font-bold text-rose-900">Stay in the Loop!</h3>
                            <p className="text-rose-700 mt-2 mb-6">Get your personalized digest delivered to your inbox every Monday morning.</p>
                            <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); alert('Subscribed!'); }}>
                                <input type="email" placeholder="you@srmist.edu.in" required className="w-full py-3 px-4 rounded-lg text-rose-800 placeholder-rose-400 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 border border-transparent focus:border-rose-300" />
                                <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow-md hover:bg-rose-500 transition-colors">
                                    <div className="flex items-center justify-center">
                                        <MailIcon />
                                        <span>Subscribe Now</span>
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WeeklyDigest;
