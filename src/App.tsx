import { QACanvas } from './components/qa-canvas/QACanvas';
import { StreamProfiler } from './components/stream-profiler/StreamProfiler';
import { ZoneOrchestrator } from './components/zone-orchestrator/ZoneOrchestrator';

function App() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center justify-start">
      <header className="mb-6 text-center max-w-xl">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          SyncOps Workstation
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Async Engineering Control Suite for Distributed Software Development Teams
        </p>
      </header>

      <main className="w-full flex flex-col gap-2">
        <QACanvas />
        <StreamProfiler />
        <ZoneOrchestrator />
      </main>
    </div>
  );
}

export default App;