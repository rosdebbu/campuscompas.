
import React, { useState } from 'react';

// --- ICONS ---
const PipelineIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const LintIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-10 w-10"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const TestIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-10 w-10"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const BuildIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-10 w-10"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7v10l8 4" /></svg>;
const DeployIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-10 w-10"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

// --- DATA ---
const missions = {
    linter: {
        id: 'linter',
        title: 'The Linter',
        icon: LintIcon,
        description: 'Create a workflow that automatically runs a linter to ensure code quality on every `push`.',
        yaml: `name: Code Linter

on:
  push:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run ESLint
        run: npm run lint`,
        logs: `Run actions/checkout@v3
Run actions/setup-node@v3
Run npm install
Run npm run lint
> my-app@1.0.0 lint /home/runner/work/my-app/my-app
> eslint .
Linting complete. No errors found.
✅ Linter check passed!`
    },
    tester: {
        id: 'tester',
        title: 'The Tester',
        icon: TestIcon,
        description: 'Write a pipeline that runs tests on every Pull Request to prevent bugs from being merged.',
        yaml: `name: Run Tests

on:
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test`,
        logs: `Run actions/checkout@v3
Run actions/setup-node@v3
Run npm install
Run npm test
> my-app@1.0.0 test /home/runner/work/my-app/my-app
> jest
PASS  ./src/App.test.js
✓ renders learn react link (28ms)
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.246s
✅ All tests passed!`
    },
    builder: {
        id: 'builder',
        title: 'The Builder',
        icon: BuildIcon,
        description: 'Build a workflow that compiles your code and packages the build artifacts for deployment.',
        yaml: `name: Build React App

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build`,
        logs: `Run actions/checkout@v3
...
Run npm run build
> my-app@1.0.0 build
> react-scripts build
Creating an optimized production build...
Compiled successfully.
...
Run actions/upload-artifact@v3
Artifact "build-files" has been successfully uploaded!
✅ Build successful.`
    },
    deployer: {
        id: 'deployer',
        title: 'The Deployer',
        icon: DeployIcon,
        description: 'Deploy a static website to GitHub Pages every time you merge to the `main` branch.',
        yaml: `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build`,
        logs: `Run peaceiris/actions-gh-pages@v3
...
git push --force "https://...github.com/user/repo.git" ...
Deployment successful!
✅ Your site is live at: https://user.github.io/repo/`
    }
};

// --- SUB-COMPONENTS ---
const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-lg text-sm font-mono overflow-x-auto h-full"><code className="language-yaml">{children}</code></pre>
);

const Terminal: React.FC<{ logs: string }> = ({ logs }) => (
    <div className="bg-gray-900 text-white p-4 rounded-lg h-full font-mono text-xs overflow-y-auto"><pre><code>{logs}</code></pre></div>
);

// --- MAIN COMPONENT ---
const CICDPipelineBuilder: React.FC = () => {
    const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

    const activeMission = activeMissionId ? missions[activeMissionId as keyof typeof missions] : null;

    const handleCompleteMission = () => {
        if (activeMissionId) {
            setCompletedMissions(prev => new Set(prev).add(activeMissionId));
            setActiveMissionId(null);
        }
    };
    
    const MissionSelectionView = () => (
        <>
            <div className="text-center mb-12">
                <div className="flex justify-center items-center mb-4">
                    <PipelineIcon />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">CI/CD Pipeline Builder</h2>
                </div>
                <p className="text-lg text-rose-600 dark:text-rose-300 max-w-3xl mx-auto">
                    Automate your workflow from testing to deployment. Learn the power of GitHub Actions and build pipelines like a pro.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.values(missions).map(mission => (
                    <div key={mission.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-lime-200 dark:border-slate-700 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="relative">
                            <mission.icon className="h-12 w-12 text-rose-400" />
                            {completedMissions.has(mission.id) && <CheckCircleIcon className="absolute -top-1 -right-1 h-6 w-6 text-teal-500 bg-white dark:bg-slate-900 rounded-full" />}
                        </div>
                        <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 mt-4">{mission.title}</h3>
                        <p className="text-sm text-rose-600 dark:text-rose-300 mt-2 flex-grow">{mission.description}</p>
                        <button onClick={() => setActiveMissionId(mission.id)} className="mt-6 w-full py-2 bg-rose-400 text-white font-semibold rounded-full hover:bg-rose-50 dark:bg-slate-8000 transition-colors">
                            Start Mission
                        </button>
                    </div>
                ))}
            </div>
        </>
    );

    const MissionDetailView = () => {
        if (!activeMission) return null;
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-lime-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-rose-900 dark:text-rose-100">{activeMission.title}</h2>
                        <p className="text-rose-600 dark:text-rose-300 max-w-2xl">{activeMission.description}</p>
                    </div>
                    <button onClick={() => setActiveMissionId(null)} className="text-rose-500 dark:text-rose-400 font-semibold hover:underline flex-shrink-0 ml-4">&larr; Back to Missions</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                    <div>
                        <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">Workflow File: <code className="bg-lime-200 text-lime-800 p-1 rounded-sm text-xs">.github/workflows/main.yml</code></h3>
                        <CodeBlock>{activeMission.yaml}</CodeBlock>
                    </div>
                    <div>
                        <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">Simulated Log Output</h3>
                        <Terminal logs={activeMission.logs} />
                    </div>
                </div>
                 <div className="mt-6 text-center">
                    <button onClick={handleCompleteMission} className="px-8 py-3 bg-teal-400 text-white font-semibold rounded-full shadow hover:bg-teal-500 transition-colors">
                        Mark as Complete
                    </button>
                </div>
            </div>
        )
    };
    
    return (
        <section className="py-20 bg-lime-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                {activeMission ? <MissionDetailView /> : <MissionSelectionView />}
            </div>
        </section>
    );
};

export default CICDPipelineBuilder;
