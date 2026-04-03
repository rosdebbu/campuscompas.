import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    return (
        <section className="relative bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-lime-50 to-transparent dark:from-slate-900 dark:to-transparent opacity-50 z-0 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-200 dark:bg-rose-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime-200 dark:bg-lime-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
            
            <div className="container relative mx-auto px-4 py-10 sm:py-16 md:py-24 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text and Search */}
                    <motion.div 
                        className="text-center lg:text-left"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                    >
                        <motion.span 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300 text-sm font-semibold mb-4 tracking-wide border border-rose-200 dark:border-rose-800 backdrop-blur-md"
                        >
                            Next-Gen Campus Experience
                        </motion.span>
                        <motion.h1 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-900 to-rose-600 dark:from-white dark:to-slate-300 leading-tight tracking-tight"
                        >
                            Your Campus <br/><span className="text-teal-500 dark:text-teal-400">Compass</span>
                        </motion.h1>
                        <motion.p 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                            Navigate SRMIST Potheri with AI-powered assistance, real-time events, and personalized insights.
                        </motion.p>
                        <motion.div 
                            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                            className="mt-8 w-full max-w-lg mx-auto lg:mx-0 relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-teal-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <input
                                type="text"
                                placeholder="Search campus facilities, events..."
                                className="w-full relative py-4 pl-6 pr-16 rounded-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 border border-slate-200 dark:border-slate-700 transition duration-300 shadow-xl"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition duration-300 shadow-lg transform hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </motion.div>
                        <motion.div 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400"
                        >
                            <span>Popular:</span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Tech Park', 'Java Canteen', 'Library'].map(tag => (
                                    <span key={tag} className="px-3 py-1 text-xs sm:text-sm rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-lime-100 dark:hover:bg-lime-900 cursor-pointer transition-colors border border-transparent hover:border-lime-200 dark:hover:border-lime-800 text-rose-700 dark:text-rose-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                    {/* Right Column: Image */}
                    <div className="hidden lg:block relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-teal-400 rounded-3xl transform rotate-3 scale-105 opacity-20 dark:opacity-30 blur-lg"></div>
                        <motion.img 
                            initial={{ y: 0 }}
                            animate={{ y: [-15, 15, -15] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            src="/images/hero_tech_park.jpg" 
                            alt="SRMIST KTR campus - Tech Park" 
                            className="relative rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white/40 dark:border-slate-800/40 glass"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;