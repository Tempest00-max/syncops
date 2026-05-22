export interface QACanvasState {
    opacity: number;
    isOverlayVisible: boolean;
    driftX: number;
    driftY: number;
    scale: number;
}

export interface TelemetryPayload {
    timestamp: number;
    metricName: string;
    value: number;
    status: 'nominal' | 'warning' | 'critical';
}

export interface TimezoneLane {
    id: string;
    name: string;
    zoneName: string;
    offset: number;
    role: string;
}