import { useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const WorldMap: React.FC = () => {
    const [geographies, setGeographies] = useState<any[]>([]);
    const [now, setNow] = useState(new Date());
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    // Fetch user location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.longitude, position.coords.latitude]);
                },
                (error) => console.error("Error getting location:", error)
            );
        }
    }, []);

    // Fetch world map data
    useEffect(() => {
        d3.json('https://unpkg.com/world-atlas@2/countries-110m.json').then((data: any) => {
            const countries = topojson.feature(data, data.objects.countries) as any;
            setGeographies(countries.features);
        });
    }, []);

    // Update time for the terminator
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // every minute
        return () => clearInterval(timer);
    }, []);

    // Setup D3 Projection
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Use Equirectangular projection
    const projection = useMemo(() => {
        // Equirectangular maps 360deg to 2*PI*R. We want to fit it to the screen.
        // If we want it to cover the screen entirely:
        const scale = Math.max(width / (2 * Math.PI), height / Math.PI);
        return d3.geoEquirectangular()
            .scale(scale * 1.1) // Slightly zoomed in
            .translate([width / 2, height / 2]);
    }, [width, height]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Calculate Night Polygon (Terminator line)
    const nightPolygon = useMemo(() => {
        // Calculate subsolar point coordinates
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

        // Declination of the sun
        const declination = 23.45 * Math.sin((360 / 365.25) * (dayOfYear - 81) * Math.PI / 180);

        // Calculate longitude of the subsolar point
        // Using UTC time to find where the sun is at solar noon
        const utcH = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;

        // Every hour the sun moves 15 degrees.
        // At 12:00 UTC, the subsolar point is near 0° longitude.
        // Subtract equation of time if needed, but this is a good approximation.
        const subsolarLon = (12 - utcH) * 15;

        // The antipode is exactly opposite to the subsolar point
        const antipodeLat = -declination;
        const antipodeLon = subsolarLon > 0 ? subsolarLon - 180 : subsolarLon + 180;

        // Use d3.geoCircle to create a polygon covering 90 degrees from the antipode (the night hemisphere)
        const circle = d3.geoCircle()
            .center([antipodeLon, antipodeLat])
            .radius(90);

        return pathGenerator(circle() as any);
    }, [now, pathGenerator]);

    // City dots placeholder (optional, for aesthetics)
    // Let's add some major global cities as glowing dots
    const cities = [
        { name: 'New York', coordinates: [-74.006, 40.7128] },
        { name: 'London', coordinates: [-0.1276, 51.5074] },
        { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
        { name: 'Paris', coordinates: [2.3522, 48.8566] },
        { name: 'Sydney', coordinates: [151.2093, -33.8688] },
        { name: 'São Paulo', coordinates: [-46.6333, -23.5505] },
        { name: 'Dubai', coordinates: [55.2708, 25.2048] },
        { name: 'Singapore', coordinates: [103.8198, 1.3521] },
        { name: 'Mumbai', coordinates: [72.8777, 19.0760] },
        { name: 'Moscow', coordinates: [37.6173, 55.7558] },
        { name: 'Los Angeles', coordinates: [-118.2437, 34.0522] },
        { name: 'Hong Kong', coordinates: [114.1694, 22.3193] },
    ];

    return (
        <svg width={width} height={height} className="w-full h-full bg-[#0a1122]">
            {/* Graticule (Map grid lines) */}
            <path
                d={pathGenerator(d3.geoGraticule()() as any) || ''}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.5}
            />

            {/* Landmasses */}
            <g>
                {geographies.map((d, i) => (
                    <path
                        key={`path-${i}`}
                        d={pathGenerator(d) || ''}
                        fill="#1e293b" /* Lighter dark-blue for land */
                        stroke="#334155" /* Subtle edge */
                        strokeWidth={0.5}
                    />
                ))}
            </g>

            {/* Day / Night Terminator Overlay dims the land and ocean! */}
            {nightPolygon && (
                <path
                    d={nightPolygon}
                    fill="#000000" /* Pure black with opacity, not mixBlendMode! */
                    opacity={0.55}
                    pointerEvents="none"
                />
            )}

            {/* City Lights rendered on top of the shadow, so they glow strongly at night! */}
            <g>
                {cities.map((city, i) => {
                    const [cx, cy] = projection(city.coordinates as [number, number]) || [0, 0];
                    return (
                        <circle
                            key={`city-${i}`}
                            cx={cx}
                            cy={cy}
                            r={2}
                            fill="#fbbf24" /* Golden glow */
                            opacity={0.9}
                            filter="blur(0.5px)"
                        />
                    );
                })}
            </g>

            {/* User Location */}
            {userLocation && (() => {
                const projected = projection(userLocation);
                if (!projected) return null;
                const [cx, cy] = projected;
                return (
                    <g>
                        {/* Pulsing ring */}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={8}
                            fill="#38bdf8"
                            className="animate-ping"
                            style={{ transformOrigin: `${cx}px ${cy}px` }}
                            opacity={0.6}
                        />
                        {/* Solid core dot */}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={3}
                            fill="#0ea5e9"
                            stroke="#ffffff"
                            strokeWidth={1}
                        />
                    </g>
                );
            })()}
        </svg>
    );
};

export default WorldMap;
