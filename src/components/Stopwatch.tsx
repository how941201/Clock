import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    const animate = (timeNow: number) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = timeNow - previousTimeRef.current;
            setTime(prevTime => prevTime + deltaTime);
        }
        previousTimeRef.current = timeNow;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isRunning) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            previousTimeRef.current = undefined;
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isRunning]);

    const handleStartStop = () => setIsRunning(!isRunning);

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
        previousTimeRef.current = undefined;
    };

    const handleLap = () => {
        setLaps(prev => [time, ...prev]);
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 pointer-events-auto">
            <div className="text-white text-7xl md:text-8xl font-bold tracking-wider drop-shadow-2xl tabular-nums leading-none mb-12">
                {formatTime(time)}
            </div>

            <div className="flex gap-6 mb-8 w-full justify-center">
                <button
                    onClick={isRunning ? handleLap : handleReset}
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium transition-all"
                >
                    {isRunning ? <Flag size={24} /> : <RotateCcw size={24} />}
                </button>
                <button
                    onClick={handleStartStop}
                    className={`w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm border font-medium transition-all ${isRunning
                            ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-500'
                            : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-500'
                        }`}
                >
                    {isRunning ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
                </button>
            </div>

            {laps.length > 0 && (
                <div className="w-full max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                    {laps.map((lapTime, index) => (
                        <div key={index} className="flex justify-between py-3 border-b border-white/10 text-white/80 text-lg tabular-nums">
                            <span>Lap {laps.length - index}</span>
                            <span>{formatTime(lapTime)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Stopwatch;
