import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const Timer = () => {
    const [initialSeconds, setInitialSeconds] = useState(15 * 60); // Default 15 mins
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Could add a sound here
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleStartStop = () => {
        if (timeLeft === 0 && !isRunning) {
            setTimeLeft(initialSeconds);
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(initialSeconds);
    };

    const adjustTime = (amount: number) => {
        if (isRunning) return;
        const newTime = Math.max(0, initialSeconds + amount);
        setInitialSeconds(newTime);
        setTimeLeft(newTime);
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate circumference for progress ring
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = initialSeconds > 0
        ? circumference - (timeLeft / initialSeconds) * circumference
        : 0;

    return (
        <div className="z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 pointer-events-auto">

            <div className="relative flex items-center justify-center mb-12">
                <svg className="-rotate-90 w-80 h-80 drop-shadow-lg">
                    {/* Background ring */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress ring */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke={timeLeft === 0 ? "#ef4444" : "#f97316"}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <div className="text-white text-6xl font-bold tracking-wider tabular-nums leading-none mb-4">
                        {formatTime(timeLeft)}
                    </div>

                    {!isRunning && (
                        <div className="flex gap-4">
                            <button onClick={() => adjustTime(-60)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                <Minus size={16} />
                            </button>
                            <button onClick={() => adjustTime(60)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-6 justify-center">
                <button
                    onClick={handleReset}
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium transition-all"
                >
                    <RotateCcw size={24} />
                </button>
                <button
                    onClick={handleStartStop}
                    className={`w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm border font-medium transition-all ${isRunning
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30 text-orange-500'
                        : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-500'
                        }`}
                >
                    {isRunning ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
                </button>
            </div>
        </div>
    );
};

export default Timer;
