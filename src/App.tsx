import { useState } from 'react';
import { Clock as ClockIcon, Timer as TimerIcon, Hourglass } from 'lucide-react';
import Clock from './components/Clock';
import WorldMap from './components/WorldMap';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';

type ViewMode = 'clock' | 'stopwatch' | 'timer';

function App() {
    const [is24Hour, setIs24Hour] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('clock');

    return (
        <div className="relative w-full h-full bg-[#0a1122] overflow-hidden flex flex-col items-center justify-center">
            {/* Background Map layer */}
            <div className="absolute inset-0 z-0">
                <WorldMap />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex items-center justify-center">
                {viewMode === 'clock' && (
                    <Clock
                        is24Hour={is24Hour}
                        onToggleFormat={() => setIs24Hour(!is24Hour)}
                    />
                )}
                {viewMode === 'stopwatch' && <Stopwatch />}
                {viewMode === 'timer' && <Timer />}
            </div>

            {/* Bottom Navigation */}
            <div className="z-20 mb-8 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex gap-2 pointer-events-auto">
                <button
                    onClick={() => setViewMode('clock')}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${viewMode === 'clock' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <ClockIcon size={18} />
                    <span className="font-medium text-sm hidden sm:block">Clock</span>
                </button>
                <button
                    onClick={() => setViewMode('stopwatch')}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${viewMode === 'stopwatch' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <TimerIcon size={18} />
                    <span className="font-medium text-sm hidden sm:block">Stopwatch</span>
                </button>
                <button
                    onClick={() => setViewMode('timer')}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${viewMode === 'timer' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Hourglass size={18} />
                    <span className="font-medium text-sm hidden sm:block">Timer</span>
                </button>
            </div>
        </div>
    );
}

export default App;
