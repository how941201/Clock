import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock as ClockIcon } from 'lucide-react';

interface ClockProps {
    is24Hour: boolean;
    onToggleFormat: () => void;
}

const Clock: React.FC<ClockProps> = ({ is24Hour, onToggleFormat }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeFormat = is24Hour ? 'HH:mm:ss' : 'hh:mm:ss a';

    return (
        <div className="z-10 flex flex-col items-center justify-center pointer-events-none gap-2">
            <div className="text-white text-8xl md:text-9xl font-bold tracking-wider drop-shadow-2xl tabular-nums leading-none">
                {format(time, timeFormat)}
            </div>
            <div className="text-white/80 text-xl md:text-3xl font-medium tracking-wide drop-shadow-lg tabular-nums">
                {format(time, 'EEEE, MMMM d, yyyy')}
            </div>
            <button
                onClick={onToggleFormat}
                className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium flex items-center gap-2 transition-all pointer-events-auto"
            >
                <ClockIcon size={18} />
                {is24Hour ? 'Switch to 12-hour' : 'Switch to 24-hour'}
            </button>
        </div>
    );
};

export default Clock;
