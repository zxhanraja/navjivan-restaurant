import React, { useState } from 'react';

interface PieChartProps {
    data: {
        labels: string[];
        values: number[];
    };
}

const COLORS = ['#6F4E37', '#D4AF37', '#8E6C52', '#C09A58', '#543C2B', '#a98c76', '#e0d6c3'];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { labels, values } = data;
    const total = values.reduce((acc, val) => acc + val, 0);

    if (total === 0) {
        return <p className="text-center text-gray-500 py-8">No data available to display.</p>;
    }

    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = values.map((value, index) => {
        const percent = value / total;
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        
        const pathData = [
            `M ${startX} ${startY}`, // Move
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            `L 0 0`, // Line to center
        ].join(' ');
        
        return { pathData, color: COLORS[index % COLORS.length] };
    });

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
            <div className="relative w-48 h-48">
                 <style>{`
                    .pie-slice {
                        transition: opacity 0.2s;
                        transform-origin: center center;
                        animation: fadeInSlice 0.5s ease-out forwards;
                        opacity: 0;
                    }
                     @keyframes fadeInSlice {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}</style>
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90">
                    {slices.map((slice, index) => (
                        <path
                            key={index}
                            d={slice.pathData}
                            fill={slice.color}
                            className="pie-slice"
                            style={{
                                opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.5 : 1,
                                animationDelay: `${index * 50}ms`
                            }}
                        />
                    ))}
                </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-md">
                {labels.map((label, index) => (
                    <div 
                        key={label} 
                        className="flex items-center space-x-2 text-sm cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className={`font-medium transition-colors ${hoveredIndex === index ? 'text-coffee-dark' : 'text-gray-600'}`}>
                            {label} ({values[index]})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;