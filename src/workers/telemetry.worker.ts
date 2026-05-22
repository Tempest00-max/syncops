// src/workers/telemetry.worker.ts
import type { TelemetryPayload } from '../types';

// Listen for incoming control messages from the main React UI thread
self.onmessage = (event: MessageEvent<{ batchSize: number }>) => {
    const { batchSize } = event.data;
    const metrics = ['cpu_utilization', 'memory_leak_delta', 'network_throughput', 'ledger_db_latency'];
    const statuses: ('nominal' | 'warning' | 'critical')[] = ['nominal', 'warning', 'critical'];

    // Generate a high-volume batch of mock server telemetry logs
    const batch: TelemetryPayload[] = Array.from({ length: batchSize }).map(() => {
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return {
            timestamp: Date.now(),
            metricName: randomMetric,
            value: Math.floor(Math.random() * 100),
            status: randomStatus
        };
    });

    // Post the processed chunk back to the main UI thread safely
    self.postMessage(batch);
};