import { useState, useEffect, useRef } from 'react';
import type { TelemetryPayload } from '../../types';

export const StreamProfiler: React.FC = () => {
    const [data, setData] = useState<TelemetryPayload[]>([]);
    const [isWorkerActive, setIsWorkerActive] = useState<boolean>(true);
    const [fps, setFps] = useState<number>(60);

    const workerRef = useRef<Worker | null>(null);
    const frameCountRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(performance.now());

    useEffect(() => {
        let animationId: number;
        const calculateFps = () => {
            frameCountRef.current += 1;
            const now = performance.now();
            const delta = now - lastTimeRef.current;

            if (delta >= 1000) {
                setFps(Math.round((frameCountRef.current * 1000) / delta));
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }
            animationId = requestAnimationFrame(calculateFps);
        };

        animationId = requestAnimationFrame(calculateFps);
        return () => cancelAnimationFrame(animationId);
    }, []);

    useEffect(() => {
        import('../../workers/telemetry.worker?worker').then((WorkerModule) => {
            const worker = new WorkerModule.default();
            workerRef.current = worker;

            worker.onmessage = (event: MessageEvent<TelemetryPayload[]>) => {
                setData(prev => [...event.data.slice(-8), ...prev].slice(0, 8));
            };
        });

        return () => workerRef.current?.terminate();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isWorkerActive) {
                workerRef.current?.postMessage({ batchSize: 250 });
            } else {
                const metrics = ['cpu_utilization', 'memory_leak_delta', 'network_throughput', 'ledger_db_latency'];
                const statuses: ('nominal' | 'warning' | 'critical')[] = ['nominal', 'warning', 'critical'];

                const localBatch: TelemetryPayload[] = Array.from({ length: 1500 }).map(() => ({
                    timestamp: Date.now(),
                    metricName: metrics[Math.floor(Math.random() * metrics.length)],
                    value: Math.floor(Math.random() * 100),
                    status: statuses[Math.floor(Math.random() * statuses.length)]
                }));

                setData(prev => [...localBatch.slice(-8), ...prev].slice(0, 8));
            }
        }, 150);

        return () => clearInterval(interval);
    }, [isWorkerActive]);

    return (
        <div className="bg-panel border border-gray-800 rounded-xl p-6 w-full max-w-4xl mx-auto my-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${fps > 45 ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`}></span>
                        Module 2: Web Worker Data Stream & Performance Profiler
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Benchmarks application thread latency under high-frequency arrays</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-950 p-1.5 rounded-lg border border-gray-800">
                    <button
                        onClick={() => setIsWorkerActive(true)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${isWorkerActive ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Use Web Worker
                    </button>
                    <button
                        onClick={() => setIsWorkerActive(false)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${!isWorkerActive ? 'bg-rose-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Main Thread (Heavy Lag)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#161722] border border-gray-800/60 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400">Main Thread Frame Velocity:</span>
                    <span className={`font-mono text-xl font-bold ${fps > 50 ? 'text-emerald-400' : 'text-rose-500'}`}>{fps} FPS</span>
                </div>
                <div className="bg-[#161722] border border-gray-800/60 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400">Thread Status Profile:</span>
                    <span className={`font-mono text-xs uppercase px-2.5 py-1 rounded font-bold ${isWorkerActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {isWorkerActive ? 'Isolated Async Thread' : 'UI Thread Concurrency Lag'}
                    </span>
                </div>
            </div>

            <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                <div className="bg-[#14151f] px-4 py-2.5 border-b border-gray-800 grid grid-cols-3 text-left text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    <span>Metric Identifier</span>
                    <span>Engine Value Mapping</span>
                    <span className="text-right">Ingest State</span>
                </div>

                <div className="divide-y divide-gray-900 font-mono text-xs h-64 overflow-y-hidden">
                    {data.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">Awaiting worker socket stream buffer...</div>
                    ) : (
                        data.map((payload, index) => (
                            <div key={index} className="px-4 py-3 grid grid-cols-3 items-center hover:bg-gray-900/30 transition-colors">
                                <span className="text-gray-300 text-xs font-semibold">{payload.metricName}</span>
                                <span className="text-blue-400 font-bold">{payload.value}.000_𝛍s</span>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${payload.status === 'nominal' ? 'bg-emerald-500/10 text-emerald-400' :
                                            payload.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                                        }`}>
                                        {payload.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};