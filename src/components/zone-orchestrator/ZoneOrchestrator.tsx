import { useState } from 'react';
import type { TimezoneLane } from '../../types';

export const ZoneOrchestrator = () => {
    const [team] = useState<TimezoneLane[]>([
        { id: '1', name: 'New York', zoneName: 'EST', offset: -5, role: 'Product Lead' },
        { id: '2', name: 'London', zoneName: 'BST', offset: 1, role: 'UI/UX Design' },
        { id: '3', name: 'Lagos', zoneName: 'WAT', offset: 1, role: 'Core Backend' },
        { id: '4', name: 'New Delhi', zoneName: 'IST', offset: 5.5, role: 'QA Engine' },
    ]);

    const [baseHour, setBaseHour] = useState<number>(12);
    const isOverlapOptimal = (hour: number): boolean => hour >= 9 && hour <= 17;

    return (
        <div className="bg-panel border border-gray-800 rounded-xl p-6 w-full max-w-4xl mx-auto my-4 shadow-2xl">
            <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Module 3: Cross-Border Timezone Overlap Orchestrator
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Simulates global synchronization bounds for distributed asynchronous teams</p>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800/60 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-400">Master Control Reference Frame:</span>
                    <span className="text-indigo-400 font-mono text-sm font-bold">
                        {baseHour.toString().padStart(2, '0')}:00 (WAT Reference Layer)
                    </span>
                </div>
                <input
                    type="range" min="0" max="23" value={baseHour}
                    onChange={(e) => setBaseHour(Number(e.target.value))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            <div className="flex flex-col gap-3">
                {team.map((member) => {
                    const rawTotalHours = baseHour + (member.offset - 1);
                    const localHour = (Math.floor(rawTotalHours) + 24) % 24;
                    const minuteFraction = rawTotalHours % 1;
                    const localMinutes = minuteFraction !== 0 ? Math.round(Math.abs(minuteFraction) * 60) : 0;
                    const activeOverlap = isOverlapOptimal(localHour);

                    return (
                        <div
                            key={member.id}
                            className={`p-4 rounded-xl border transition-all duration-150 grid grid-cols-1 md:grid-cols-3 items-center gap-4 ${activeOverlap
                                ? 'bg-indigo-950/20 border-indigo-500/30 shadow-sm'
                                : 'bg-[#14151f] border-gray-800/80 opacity-70'
                                }`}
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-200">{member.name}</span>
                                    <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                                        {member.zoneName}
                                    </span>
                                </div>
                                <div className="text-[11px] text-gray-400 mt-0.5">{member.role}</div>
                            </div>

                            <div className="font-mono text-lg font-extrabold text-gray-100 md:text-center">
                                {localHour.toString().padStart(2, '0')}:{localMinutes.toString().padStart(2, '0')}
                            </div>

                            <div className="md:text-right">
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${activeOverlap
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/5 text-amber-500/60 border border-amber-500/10'
                                    }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${activeOverlap ? 'bg-emerald-400' : 'bg-amber-500/40'}`}></span>
                                    {activeOverlap ? 'Available Window' : 'Asynchronous Bounds'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};