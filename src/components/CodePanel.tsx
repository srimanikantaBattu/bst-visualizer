import React from 'react';

interface CodePanelProps {
    title?: string;
    code?: string[];
    currentLine?: number;
}

const CodePanel: React.FC<CodePanelProps> = ({ title = "Algorithm", code = [], currentLine = -1 }) => {
    if (code.length === 0) return null;

    return (
        <div className="bg-[#40c057] p-0 font-mono text-sm shadow-lg max-w-sm rounded overflow-hidden">
            <div className="bg-[#8ce99a] p-2 text-black font-bold">
                {title}
            </div>
            <div className="p-4 bg-[#40c057] text-white space-y-1">
                {code.map((line, idx) => (
                    <div
                        key={idx}
                        className={`${currentLine === idx ? 'bg-black/80' : ''} px-1 whitespace-pre`}
                    >
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CodePanel;
