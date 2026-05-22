import { useState } from 'react';
import type { QACanvasState } from '../../types';

export const QACanvas: React.FC = () => {
    const [state, setState] = useState<QACanvasState>({
        opacity: 50,
        isOverlayVisible: true,
        driftX: 0,
        driftY: 0,
        scale: 100,
    });

    const resetDrift = () => setState(prev => ({ ...prev, driftX: 0, driftY: 0 }));

    return (
        <div className="bg-panel border border-gray-800 rounded-xl p-6 w-full max-w-4xl mx-auto my-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Module 1: Design Drift & Visual QA Workbench
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Detect visual layout regressions against Figma source images</p>
                </div>
                <button
                    onClick={resetDrift}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-medium rounded-lg text-gray-200 transition-colors cursor-pointer"
                >
                    Reset Drift Coordinates
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#161722] p-4 rounded-lg mb-6 border border-gray-800/50">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 flex justify-between">
                        <span>Figma Overlay Opacity:</span>
                        <span className="text-blue-400 font-mono">{state.opacity}%</span>
                    </label>
                    <input
                        type="range" min="0" max="100"
                        value={state.opacity}
                        onChange={(e) => setState(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 flex justify-between">
                        <span>Fine-Tune Alignment (X Drift):</span>
                        <span className="text-amber-400 font-mono">{state.driftX}px</span>
                    </label>
                    <div className="flex gap-2">
                        <button onClick={() => setState(p => ({ ...p, driftX: p.driftX - 1 }))} className="bg-gray-800 hover:bg-gray-700 px-2.5 py-0.5 text-xs font-mono rounded cursor-pointer">-1px</button>
                        <button onClick={() => setState(p => ({ ...p, driftX: p.driftX + 1 }))} className="bg-gray-800 hover:bg-gray-700 px-2.5 py-0.5 text-xs font-mono rounded cursor-pointer">+1px</button>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 flex justify-between">
                        <span>Fine-Tune Alignment (Y Drift):</span>
                        <span className="text-amber-400 font-mono">{state.driftY}px</span>
                    </label>
                    <div className="flex gap-2">
                        <button onClick={() => setState(p => ({ ...p, driftY: p.driftY - 1 }))} className="bg-gray-800 hover:bg-gray-700 px-2.5 py-0.5 text-xs font-mono rounded cursor-pointer">-1px</button>
                        <button onClick={() => setState(p => ({ ...p, driftY: p.driftY + 1 }))} className="bg-gray-800 hover:bg-gray-700 px-2.5 py-0.5 text-xs font-mono rounded cursor-pointer">+1px</button>
                    </div>
                </div>
            </div>

            <div className="relative border border-dashed border-gray-700 rounded-lg h-80 w-full overflow-hidden bg-gray-950 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                    <div className="bg-gray-900 border border-blue-500/30 p-6 rounded-xl w-72 text-center shadow-lg">
                        <div className="h-10 w-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center mx-auto mb-3 font-bold">∑</div>
                        <h3 className="text-sm font-semibold text-gray-100">Coded Live Component</h3>
                        <p className="text-xs text-gray-400 mt-1">Testing Tailwind spacing ratios against design</p>
                        <div className="mt-4 py-1.5 px-3 bg-blue-600 text-xs font-medium rounded-md text-white">Execution Active</div>
                    </div>
                </div>

                {state.isOverlayVisible && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                            opacity: state.opacity / 100,
                            transform: `translate(${state.driftX}px, ${state.driftY}px)`,
                            transition: 'opacity 0.05s linear'
                        }}
                    >
                        <div className="border border-red-500 bg-red-500/10 p-6 rounded-xl w-72 h-[156px] flex flex-col justify-between text-center shadow-none">
                            <div className="text-[10px] text-red-400 font-mono text-left font-bold uppercase tracking-wider">[Figma Spec Outline]</div>
                            <div className="text-[10px] text-red-400 font-mono text-right mt-auto">Drift Offset Check</div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
            </div>
        </div>
    );
};