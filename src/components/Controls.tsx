import React, { useState } from 'react';
import { Play, Pause, StepForward, RotateCcw } from 'lucide-react';

interface ControlsProps {
    onInsert: (vals: number) => void;
    onDelete: (val: number) => void;
    onSearch: (val: number) => void;
    onReset: () => void;
    onPlayPause: () => void;
    onStepForward: () => void;
    onTraversal: (type: 'inorder' | 'preorder' | 'postorder') => void;
    onFindMin: () => void;
    onFindMax: () => void;
    onGenerateRandom: () => void;
    treeType: 'BST' | 'AVL';
    setTreeType: (type: 'BST' | 'AVL') => void;
    isPlaying: boolean;
    canStep: boolean;
    speed: number;
    setSpeed: (val: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
    onInsert,
    onDelete,
    onSearch,
    onReset,
    onPlayPause,
    onStepForward,
    onTraversal,
    onFindMin,
    onFindMax,
    onGenerateRandom,
    treeType,
    setTreeType,
    isPlaying,
    canStep,
    speed,
    setSpeed
}) => {
    const [val, setVal] = useState('');

    const handleAction = (action: (n: number) => void) => {
        const num = parseInt(val);
        if (!isNaN(num)) {
            action(num);
            setVal('');
        }
    };

    return (
        <div className="flex flex-col gap-2">

            {/* Input Group & Playback Controls */}
            <div className="flex gap-2 flex-wrap items-center">

                {/* Tree Type Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setTreeType('BST')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${treeType === 'BST' ? 'bg-[#FF8C00] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                        disabled={isPlaying}
                    >
                        BST
                    </button>
                    <button
                        onClick={() => setTreeType('AVL')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${treeType === 'AVL' ? 'bg-[#FF8C00] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                        disabled={isPlaying}
                    >
                        AVL
                    </button>
                </div>

                <div className="w-px h-8 bg-slate-200 mx-1"></div>

                <input
                    type="number"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder="Value..."
                    className="bg-slate-100 text-slate-800 border border-slate-200 rounded px-3 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all shadow-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAction(onInsert);
                    }}
                />
                <div className="flex gap-1">
                    <button
                        onClick={() => handleAction(onInsert)}
                        className="px-4 py-1.5 bg-[#FF8C00] hover:bg-[#e67e00] text-white rounded shadow-sm transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isPlaying || !val}
                    >
                        Insert
                    </button>
                    <button
                        onClick={() => handleAction(onSearch)}
                        className="px-4 py-1.5 bg-[#FF8C00] hover:bg-[#e67e00] text-white rounded shadow-sm transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isPlaying || !val}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => handleAction(onDelete)}
                        className="px-4 py-1.5 bg-[#FF8C00] hover:bg-[#e67e00] text-white rounded shadow-sm transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isPlaying || !val}
                    >
                        Delete
                    </button>
                </div>

                <div className="w-px h-8 bg-slate-200 mx-3"></div>

                <div className="flex gap-1">
                    <button
                        onClick={() => onTraversal('inorder')}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded shadow-sm transition text-sm font-medium disabled:opacity-50"
                        disabled={isPlaying}
                    >
                        Inorder
                    </button>
                    <button
                        onClick={() => onTraversal('preorder')}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded shadow-sm transition text-sm font-medium disabled:opacity-50"
                        disabled={isPlaying}
                    >
                        Preorder
                    </button>
                    <button
                        onClick={() => onTraversal('postorder')}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded shadow-sm transition text-sm font-medium disabled:opacity-50"
                        disabled={isPlaying}
                    >
                        Postorder
                    </button>
                </div>

                <div className="w-px h-8 bg-slate-200 mx-3"></div>

                <div className="flex gap-1">
                    <button
                        onClick={onGenerateRandom}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded shadow-sm transition text-sm font-medium disabled:opacity-50"
                        disabled={isPlaying}
                    >
                        Random
                    </button>
                    <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                         <button
                            onClick={onFindMin}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded text-sm font-medium disabled:opacity-50"
                            disabled={isPlaying}
                            title="Find Min"
                        >
                            Min
                        </button>
                        <div className="w-px bg-slate-300 my-1"></div>
                        <button
                            onClick={onFindMax}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded text-sm font-medium disabled:opacity-50"
                            disabled={isPlaying}
                            title="Find Max"
                        >
                            Max
                        </button>
                    </div>
                </div>

                <div className="w-px h-8 bg-slate-200 mx-3"></div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onReset}
                        className="p-2 text-slate-500 hover:text-[#FF8C00] hover:bg-orange-50 rounded transition"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={onPlayPause}
                        className="p-2 text-slate-500 hover:text-[#FF8C00] hover:bg-orange-50 rounded transition"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button
                        onClick={onStepForward}
                        disabled={isPlaying || !canStep}
                        className="p-2 text-slate-500 hover:text-[#FF8C00] hover:bg-orange-50 rounded transition disabled:opacity-50"
                        title="Step"
                    >
                        <StepForward size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2 ml-auto bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Speed</span>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-20 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
                    />
                </div>
            </div>

        </div>
    );
};

export default Controls;
