
import React, { useState } from 'react';
import type { BenchmarkResult } from '../types';

// --- ICONS ---
const LabIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 01.547-1.806z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.28 14.28a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L.95 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 01.547-1.806z" /></svg>;

// --- MOCK DATA & CONTENT ---
const bruteForceSolution = `
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}
`.trim();

const optimizedSolution = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
`.trim();

// --- SUB-COMPONENTS ---
const CodeEditor: React.FC<{ value: string; readOnly?: boolean }> = ({ value, readOnly = true }) => (
    <textarea
        value={value}
        readOnly={readOnly}
        className="w-full h-64 p-4 font-mono text-sm bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
    />
);

const LineChart: React.FC<{ results: BenchmarkResult[] }> = ({ results }) => {
    const dataA = results.map(r => r.solutionA.time === 'Timed Out' ? null : r.solutionA.time).filter(t => t !== null) as number[];
    const dataB = results.map(r => r.solutionB.time);
    
    // Simple scaling logic
    const maxY = Math.max(...dataA, ...dataB, 1);
    const pointToPath = (points: number[], color: string) => {
        const path = points.map((p, i) => {
            const x = (i / (results.length - 1)) * 100;
            const y = 100 - (p / maxY) * 100;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
        return <path d={path} stroke={color} strokeWidth="2" fill="none" />;
    };

    return (
        <div className="bg-lime-50 dark:bg-slate-950 p-4 rounded-lg border border-lime-200 dark:border-slate-700">
            <svg viewBox="0 0 100 100" className="w-full h-64">
                {/* Axes */}
                <line x1="0" y1="100" x2="100" y2="100" stroke="#d1d5db" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="#d1d5db" strokeWidth="0.5" />
                {/* Data paths */}
                {pointToPath(dataA, '#f87171')}
                {pointToPath(dataB, '#34d399')}
            </svg>
            <div className="flex justify-center gap-6 mt-2 text-sm">
                <div className="flex items-center"><div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>Solution A (O(n²))</div>
                <div className="flex items-center"><div className="w-3 h-3 bg-teal-400 rounded-full mr-2"></div>Solution B (O(n))</div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const AlgorithmPerformanceLab: React.FC = () => {
    const [benchmarkStatus, setBenchmarkStatus] = useState<'idle' | 'running' | 'finished'>('idle');
    const [results, setResults] = useState<BenchmarkResult[]>([]);

    const handleRunBenchmark = () => {
        setBenchmarkStatus('running');
        setResults([]);
        
        const mockResults: BenchmarkResult[] = [
            { datasetSize: '1,000 items', solutionA: { time: 2, memory: '1.2 MB' }, solutionB: { time: 1, memory: '1.5 MB' } },
            { datasetSize: '100,000 items', solutionA: { time: 250, memory: '1.2 MB' }, solutionB: { time: 10, memory: '3.5 MB' } },
            { datasetSize: '1,000,000 items', solutionA: { time: 'Timed Out', memory: 'N/A' }, solutionB: { time: 105, memory: '20.1 MB' } },
        ];

        // Simulate benchmark running
        setTimeout(() => setResults([mockResults[0]]), 1000);
        setTimeout(() => setResults([mockResults[0], mockResults[1]]), 2000);
        setTimeout(() => {
            setResults(mockResults);
            setBenchmarkStatus('finished');
        }, 3000);
    };

    return (
        <section className="py-20 bg-lime-100 dark:bg-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <LabIcon />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Algorithm Performance Lab</h2>
                    </div>
                    <p className="text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                        Correctness is just the beginning. Pit your algorithms against massive datasets and learn to write code that performs under pressure.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg border p-6 sm:p-8 space-y-8">
                    {/* Challenge Description */}
                    <div>
                        <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100">Challenge: Two Sum</h3>
                        <p className="text-rose-700 mt-2">Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.</p>
                    </div>

                    {/* Code Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">Solution A (Brute-Force)</h4>
                            <CodeEditor value={bruteForceSolution} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">Solution B (Optimized)</h4>
                            <CodeEditor value={optimizedSolution} />
                        </div>
                    </div>

                    {/* Benchmark Control */}
                    <div className="text-center">
                        <button onClick={handleRunBenchmark} disabled={benchmarkStatus === 'running'} className="px-8 py-4 bg-rose-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-rose-50 dark:bg-slate-8000 transition-all transform hover:scale-105 active:scale-95 duration-300 disabled:bg-rose-200 disabled:scale-100">
                           {benchmarkStatus === 'running' ? 'Running Benchmark...' : 'Run Benchmark'}
                        </button>
                    </div>

                    {/* Results Section */}
                    {benchmarkStatus !== 'idle' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100 text-center">Performance Report</h3>
                            
                            {/* Chart */}
                            {benchmarkStatus === 'finished' && <LineChart results={results} />}

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-rose-800 dark:text-rose-200">
                                    <thead className="text-xs text-rose-700 uppercase bg-lime-100 dark:bg-slate-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 rounded-l-lg">Dataset Size</th>
                                            <th scope="col" className="px-6 py-3">Solution A Time (ms)</th>
                                            <th scope="col" className="px-6 py-3">Solution B Time (ms)</th>
                                            <th scope="col" className="px-6 py-3">Solution A Memory</th>
                                            <th scope="col" className="px-6 py-3 rounded-r-lg">Solution B Memory</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map(res => (
                                            <tr key={res.datasetSize} className="bg-white dark:bg-slate-900 border-b border-lime-200 dark:border-slate-700">
                                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{res.datasetSize}</th>
                                                <td className={`px-6 py-4 ${res.solutionA.time === 'Timed Out' ? 'text-red-500 font-bold' : ''}`}>{res.solutionA.time}</td>
                                                <td className="px-6 py-4">{res.solutionB.time}</td>
                                                <td className="px-6 py-4">{res.solutionA.memory}</td>
                                                <td className="px-6 py-4">{res.solutionB.memory}</td>
                                            </tr>
                                        ))}
                                        {benchmarkStatus === 'running' && (
                                            <tr><td colSpan={5} className="text-center p-4">Generating report...</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Analysis */}
                             {benchmarkStatus === 'finished' && (
                                <div className="bg-teal-50 text-teal-800 p-4 rounded-lg border border-teal-200">
                                    <h4 className="font-bold">Analysis</h4>
                                    <p className="mt-1">Solution A (Brute-Force) timed out on the 1,000,000 item dataset, demonstrating O(n²) time complexity. As the input size grew, the execution time exploded. Solution B (Optimized) completed in just 105ms, showcasing the power of an O(n) solution that uses a hash map for near-instant lookups.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AlgorithmPerformanceLab;
