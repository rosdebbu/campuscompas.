import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { StudyBlock, Course, Exam, StudyGoal } from '../types';

// --- ICONS ---
const PlannerIcon = () => <svg className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const TrashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ChevronLeftIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

// --- MOCK DATA & HELPERS ---
const mockCourses: Course[] = [
    { id: 'cs101', name: 'Intro to Python', color: { background: 'bg-rose-100', text: 'text-rose-800 dark:text-rose-200', border: 'border-rose-300' } },
    { id: 'ma202', name: 'Calculus II', color: { background: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' } },
    { id: 'ph150', name: 'Modern Physics', color: { background: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' } },
    { id: 'en101', name: 'English Composition', color: { background: 'bg-lime-100 dark:bg-slate-800', text: 'text-lime-800', border: 'border-lime-300' } },
];

const mockExams: Exam[] = [
    { id: 'exam1', courseId: 'ma202', title: 'Calculus II Mid-Term', date: '2024-11-15' },
    { id: 'exam2', courseId: 'ph150', title: 'Physics Final Exam', date: '2024-12-10' },
];

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Saturday
    return { start, end };
};

// --- SUB-COMPONENTS ---

interface AddBlockModalProps {
    onClose: () => void;
    onAdd: (block: Omit<StudyBlock, 'id'>) => void;
    courses: Course[];
    initialDate: string;
}

const AddBlockModal: React.FC<AddBlockModalProps> = ({ onClose, onAdd, courses, initialDate }) => {
    const [courseId, setCourseId] = useState(courses[0]?.id || '');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(initialDate);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('11:00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !courseId) return;
        onAdd({ courseId, title, date, startTime, endTime });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-4 sm:p-8 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 dark:text-rose-300"><CloseIcon /></button>
                <h2 className="text-xl sm:text-2xl font-bold text-rose-900 dark:text-rose-100 mb-6 text-center">Add Study Block</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="course" className="text-sm font-medium text-rose-800 dark:text-rose-200">Course</label>
                        <select id="course" value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400">
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="topic" className="text-sm font-medium text-rose-800 dark:text-rose-200">Topic / Task</label>
                        <input id="topic" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Chapter 3 Problems" required className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="sm:col-span-1">
                            <label htmlFor="date" className="text-sm font-medium text-rose-800 dark:text-rose-200">Date</label>
                            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="startTime" className="text-sm font-medium text-rose-800 dark:text-rose-200">Start Time</label>
                            <input id="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="endTime" className="text-sm font-medium text-rose-800 dark:text-rose-200">End Time</label>
                            <input id="endTime" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Add Block</button>
                </form>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const PersonalizedStudyPlanner: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>(() => {
        const saved = localStorage.getItem('studyBlocks');
        return saved ? JSON.parse(saved) : [];
    });
    const [weeklyGoal, setWeeklyGoal] = useState<StudyGoal>({ type: 'weeklyHours', target: 15 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState(formatDate(new Date()));

    useEffect(() => {
        localStorage.setItem('studyBlocks', JSON.stringify(studyBlocks));
    }, [studyBlocks]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid day issues
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const handleMonthSelect = (monthIndex: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), monthIndex, 1));
    };

    const handleYearSelect = (year: number) => {
        setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    }, [currentDate]);

    const blocksByDate = useMemo(() => {
        return studyBlocks.reduce((acc, block) => {
            (acc[block.date] = acc[block.date] || []).push(block);
            return acc;
        }, {} as Record<string, StudyBlock[]>);
    }, [studyBlocks]);
    
     const weeklyProgress = useMemo(() => {
        const { start, end } = getWeekRange(new Date());
        const totalMinutes = studyBlocks
            .filter(b => {
                const blockDate = new Date(b.date);
                return blockDate >= start && blockDate <= end;
            })
            .reduce((total, block) => {
                const [startH, startM] = block.startTime.split(':').map(Number);
                const [endH, endM] = block.endTime.split(':').map(Number);
                return total + ((endH * 60 + endM) - (startH * 60 + startM));
            }, 0);
        return totalMinutes / 60;
    }, [studyBlocks]);

    const handleDayClick = (day: Date) => {
        setModalDate(formatDate(day));
        setIsModalOpen(true);
    };

    const handleAddBlock = (block: Omit<StudyBlock, 'id'>) => {
        const newBlock = { ...block, id: `block-${Date.now()}` };
        setStudyBlocks(prev => [...prev, newBlock]);
    };

    const handleDeleteBlock = (id: string) => {
        setStudyBlocks(prev => prev.filter(b => b.id !== id));
    };
    
    // NOTE: In a real app, templates would be more dynamic
    const applyExamPrepTemplate = () => {
        const exam = mockExams[1]; // Physics Final Exam
        const examDate = new Date(exam.date);
        const newBlocks: StudyBlock[] = [];
        // Add 3 sessions in the 2 weeks before the exam
        for(let i=1; i<=3; i++){
            const studyDate = new Date(examDate);
            studyDate.setDate(examDate.getDate() - (i*4));
             newBlocks.push({
                id: `template-exam-${i}`,
                courseId: exam.courseId,
                title: `Finals Prep Session ${i}`,
                date: formatDate(studyDate),
                startTime: '14:00',
                endTime: '16:00',
            });
        }
        setStudyBlocks(prev => [...prev, ...newBlocks]);
        alert('Exam Prep template applied!');
    };

    const currentYear = new Date().getFullYear();
    const years = useMemo(() => Array.from({ length: 13 }, (_, i) => currentYear - 2 + i), [currentYear]); // Show current year -2 to +10
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })), []);

    return (
        <section className="py-12 md:py-20 bg-lime-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <PlannerIcon />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Personalized Study Planner</h2>
                    </div>
                    <p className="text-base sm:text-lg text-rose-600 dark:text-rose-300 max-w-2xl mx-auto">Organize your study schedule, track your progress, and conquer your goals.</p>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Calendar */}
                    <div className="lg:w-2/3 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-lime-100 dark:bg-slate-800"><ChevronLeftIcon /></button>
                            <div className="flex items-center gap-2">
                                <select 
                                    value={currentDate.getMonth()}
                                    onChange={(e) => handleMonthSelect(parseInt(e.target.value, 10))}
                                    className="appearance-none text-xl font-bold text-rose-900 dark:text-rose-100 bg-white dark:bg-slate-900 hover:bg-lime-50 dark:bg-slate-950 rounded-md p-2 border-0 focus:ring-2 focus:ring-rose-300 transition-colors cursor-pointer"
                                    aria-label="Select month"
                                >
                                    {months.map((month, index) => (
                                        <option key={month} value={index}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={currentDate.getFullYear()}
                                    onChange={(e) => handleYearSelect(parseInt(e.target.value, 10))}
                                    className="appearance-none text-xl font-bold text-rose-900 dark:text-rose-100 bg-white dark:bg-slate-900 hover:bg-lime-50 dark:bg-slate-950 rounded-md p-2 border-0 focus:ring-2 focus:ring-rose-300 transition-colors cursor-pointer"
                                    aria-label="Select year"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-lime-100 dark:bg-slate-800"><ChevronRightIcon /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-rose-700 mb-2 text-xs sm:text-base">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {calendarGrid.map((day, i) => (
                                <div key={i} onClick={() => day && handleDayClick(day)} className={`h-24 sm:h-32 p-1 sm:p-2 border rounded-lg overflow-hidden ${day ? 'cursor-pointer bg-white dark:bg-slate-900 hover:bg-lime-50 dark:bg-slate-950' : 'bg-lime-100 dark:bg-slate-800'} ${day && formatDate(day) === formatDate(new Date()) ? 'border-2 border-rose-400' : 'border-lime-200 dark:border-slate-700'}`}>
                                    {day && <span className="font-semibold text-rose-800 dark:text-rose-200 text-xs sm:text-sm">{day.getDate()}</span>}
                                    <div className="space-y-1 mt-1 overflow-y-auto h-full max-h-[calc(100%-1.25rem)]">
                                        {(day && blocksByDate[formatDate(day)] || []).map(block => {
                                            const course = mockCourses.find(c => c.id === block.courseId);
                                            return (
                                                <div key={block.id} className={`p-1 rounded text-xs ${course?.color.background} ${course?.color.text} relative group`}>
                                                    <p className="font-semibold truncate">{course?.name}</p>
                                                    <p className="truncate">{block.title}</p>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id);}} className="absolute top-0.5 right-0.5 bg-white/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100"><TrashIcon /></button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border flex flex-col space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-2">Weekly Progress</h3>
                            <p className="text-sm text-rose-600 dark:text-rose-300">You've studied {weeklyProgress.toFixed(1)} out of {weeklyGoal.target} hours this week.</p>
                            <div className="w-full bg-lime-200 rounded-full h-4 mt-2">
                                <div className="bg-rose-400 h-4 rounded-full" style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal.target) * 100)}%` }}></div>
                            </div>
                        </div>
                         <div>
                             <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Add Study Block</button>
                             <button onClick={applyExamPrepTemplate} className="w-full mt-3 py-3 bg-red-300 text-white font-semibold rounded-lg shadow hover:bg-red-400 transition-colors">Use "Exam Prep" Template</button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-2">Upcoming Deadlines</h3>
                            <div className="space-y-3">
                                {mockExams.map(exam => {
                                    const course = mockCourses.find(c => c.id === exam.courseId);
                                    return (
                                        <div key={exam.id} className={`p-3 rounded-lg border-l-4 ${course?.color.background} ${course?.color.border}`}>
                                            <p className={`font-semibold ${course?.color.text}`}>{exam.title}</p>
                                            <p className={`text-sm ${course?.color.text}`}>{new Date(exam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && <AddBlockModal onClose={() => setIsModalOpen(false)} onAdd={handleAddBlock} courses={mockCourses} initialDate={modalDate} />}
        </section>
    );
};

export default PersonalizedStudyPlanner;
