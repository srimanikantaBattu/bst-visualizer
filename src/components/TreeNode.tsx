import React from 'react';

interface TreeNodeProps {
    x: number;
    y: number;
    value: number;
    type: 'normal' | 'current' | 'found' | 'new' | 'delete' | 'visited';
    labelTop?: string;
    labelBottom?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ x, y, value, type, labelTop, labelBottom }) => {
    // Visualgo style: Orange nodes, white text
    let circleColor = 'fill-[#FF8C00] stroke-[#FF8C00]'; // Default Orange
    let textColor = 'fill-white font-medium';

    if (type === 'current') {
        // Highlight being visited - usually a different color or glow
        circleColor = 'fill-[#FFD700] stroke-[#FF8C00] stroke-4'; // Lighter/Yellowish for highlight
        textColor = 'fill-slate-900 font-bold';
    } else if (type === 'found') {
        circleColor = 'fill-green-500 stroke-green-600';
        textColor = 'fill-white font-bold';
    } else if (type === 'new') {
        circleColor = 'fill-blue-500 stroke-blue-600';
        textColor = 'fill-white';
    } else if (type === 'delete') {
        circleColor = 'fill-red-500 stroke-red-600';
        textColor = 'fill-white';
    } else if (type === 'visited') {
        // Maybe keep orange but dimmed? Or sticking to orange is fine as "processed"
        circleColor = 'fill-[#FF8C00] stroke-[#FF8C00] opacity-80';
        textColor = 'fill-white';
    }

    return (
        <g
            className="transition-all duration-500 ease-in-out"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            {/* Top Label (e.g. N=16) */}
            {labelTop && (
                <text
                    textAnchor="middle"
                    dy="-25"
                    className="text-xs fill-black font-sans"
                >
                    {labelTop}
                </text>
            )}

            <circle
                r="20"
                className={`transition-colors duration-300 ${circleColor}`}
                strokeWidth="2"
            />
            <text
                textAnchor="middle"
                dy=".3em"
                className={`text-sm select-none transition-colors duration-300 ${textColor}`}
            >
                {value}
            </text>

            {/* Bottom Label (e.g. root/leaf) */}
            {labelBottom && (
                <text
                    textAnchor="middle"
                    dy="35"
                    className="text-xs fill-red-600 font-bold font-sans"
                >
                    {labelBottom}
                </text>
            )}
        </g>
    );
};

export default TreeNode;
