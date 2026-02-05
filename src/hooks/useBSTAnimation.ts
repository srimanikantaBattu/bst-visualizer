import { useState, useEffect, useRef, useCallback } from 'react';
import { BST, BSTNode } from '../core/BST';
import type { AnimationStep } from '../core/BST';
import { calculateTreePositions } from '../core/TreeLayout';
import { AVL } from '../core/AVL';

interface AnimationState {
    currentStepIndex: number;
    steps: AnimationStep[];
    isPlaying: boolean;
    message: string;
}

export function useBSTAnimation(width: number, height: number) {
    const [treeType, setTreeType] = useState<'BST' | 'AVL'>('BST');
    const [bst] = useState(() => new BST());
    const [avl] = useState(() => new AVL()); // Persistent AVL instance

    // We need to keep track of inserted values to "save state" when switching
    // Actually, maintaining two separate trees (Active: BST or AVL) and applying operations to BOTH
    // or just applying to the active one and rebuilding when switching?
    // "Visualize the SAME BST in AVL" -> Implies keeping them in sync.
    // Easiest way: Store abstract history of values [10, 20, 5, ...]
    // When switching, clear target tree and re-insert all.
    const [history, setHistory] = useState<number[]>([]);

    const [_, setTick] = useState(0);
    useEffect(() => {
        console.log(setTick)
    }, [history]);
    const [root, setRoot] = useState<BSTNode | null>(null);

    // Visual state
    const [highlightedNodeId, setHighlightedNodeId] = useState<number | null>(null);
    const [foundNodeId, setFoundNodeId] = useState<number | null>(null);
    const [visitedNodeIds, setVisitedNodeIds] = useState<number[]>([]);

    const [animState, setAnimState] = useState<AnimationState>({
        currentStepIndex: 0,
        steps: [],
        isPlaying: false,
        message: ''
    });

    const [speed, setSpeed] = useState(3);
    const timerRef = useRef<number | null>(null);

    const activeTree = treeType === 'BST' ? bst : avl;

    const updateLayout = useCallback((node: BSTNode | null) => {
        calculateTreePositions(node, width, height);
        // Force refresh
        setRoot(node ? { ...node } : null);
    }, [width, height]);

    // Re-calculate layout when dimensions change or tree type changes
    useEffect(() => {
        updateLayout(activeTree.root);
    }, [width, height, treeType, activeTree, updateLayout]);

    // When toggling, we need to ensure the new tree has the same data
    const handleSetTreeType = (type: 'BST' | 'AVL') => {
        if (type === treeType) return;

        // Stop any current animation
        if (timerRef.current) clearTimeout(timerRef.current);
        setAnimState(prev => ({ ...prev, isPlaying: false, steps: [], currentStepIndex: 0, message: `Switched to ${type}` }));
        resetVisuals();

        const newTree = type === 'BST' ? bst : avl;
        newTree.root = null; // Clear target tree
        // Rebuild from history
        // Note: For AVL, the structure will be different, checking IDs might be tricky if we rely on IDs for React keys?
        // BSTNode uses a simple counter. If we rebuild, IDs will change.
        // React keys in TreeVisualizer depend on ID. This is fine, new IDs = new rendering.

        // IMPORTANT: We need accurate consistent IDs if we want animations to make sense?
        // Actually, just rebuilding statically is fine for the "Switch" action.

        // We probably need to reset the ID counter in the class? 
        // We didn't expose a reset method for ID, but it's simpler to just create a NEW instance?
        // Or just let IDs increment. It's fine.

        history.forEach(val => {
            if (type === 'BST') bst.insert(val);
            else avl.insert(val);
        });

        setTreeType(type);
    };

    const resetVisuals = () => {
        setHighlightedNodeId(null);
        setFoundNodeId(null);
        setVisitedNodeIds([]);
    };

    const processStep = useCallback((step: AnimationStep) => {
        switch (step.type) {
            case 'visit':
                setHighlightedNodeId(step.nodeId);
                setVisitedNodeIds(prev => [...prev, step.nodeId]);
                setAnimState(prev => ({ ...prev, message: `Visiting node ${step.value}` }));
                break;
            case 'found':
                setHighlightedNodeId(null);
                setFoundNodeId(step.nodeId);
                setAnimState(prev => ({ ...prev, message: `Found node ${step.value}!` }));
                break;
            case 'notFound':
                setAnimState(prev => ({ ...prev, message: `Node ${step.value} not found.` }));
                break;
            case 'insert':
                updateLayout(activeTree.root);
                setHighlightedNodeId(step.nodeId);
                setAnimState(prev => ({ ...prev, message: `Inserted ${step.value}` }));
                break;
            case 'delete':
                setAnimState(prev => ({ ...prev, message: `Deleted ${step.value}` }));
                updateLayout(activeTree.root);
                break;
            case 'reset':
                resetVisuals();
                break;
        }
    }, [activeTree, updateLayout]);

    const stepForward = useCallback(() => {
        setAnimState(prev => {
            if (prev.currentStepIndex >= prev.steps.length) {
                return { ...prev, isPlaying: false, message: 'Finished' };
            }
            const step = prev.steps[prev.currentStepIndex];
            processStep(step);
            return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
        });
    }, [processStep]);

    useEffect(() => {
        if (animState.isPlaying) {
            timerRef.current = window.setTimeout(() => {
                stepForward();
            }, 1000 / speed);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [animState.isPlaying, animState.currentStepIndex, speed, stepForward]);

    const startAnimation = (steps: AnimationStep[]) => {
        resetVisuals();
        setAnimState({
            steps,
            currentStepIndex: 0,
            isPlaying: true, // Auto-play
            message: 'Starting...'
        });
    };

    const handleInsert = (val: number) => {
        if (animState.isPlaying) return;

        // Add to history if unique (BST doesn't allow dups currently in our logic)
        if (!history.includes(val)) {
            setHistory(prev => [...prev, val]);
        }

        const steps = activeTree.insert(val);
        startAnimation(steps);
    };

    const handleSearch = (val: number) => {
        if (animState.isPlaying) return;
        const steps = activeTree.search(val);
        startAnimation(steps);
    };

    const handleDelete = (val: number) => {
        if (animState.isPlaying) return;

        if (history.includes(val)) {
            setHistory(prev => prev.filter(v => v !== val));
        }

        const steps = activeTree.delete(val);
        startAnimation(steps);
    };

    const handleReset = () => {
        activeTree.root = null;
        setHistory([]); // Clear history
        updateLayout(null);
        resetVisuals();
        setAnimState({
            steps: [],
            currentStepIndex: 0,
            isPlaying: false,
            message: 'Tree cleared'
        });
    };

    const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
        if (animState.isPlaying) return;
        let steps: AnimationStep[] = [];
        // Both BST and AVL have same traversal methods signature
        switch (type) {
            case 'inorder': steps = activeTree.inorder(); break;
            case 'preorder': steps = activeTree.preorder(); break;
            case 'postorder': steps = activeTree.postorder(); break;
        }
        startAnimation(steps);
        setAnimState(prev => ({ ...prev, message: `Starting ${type} traversal...`, steps }));
    };

    const handleFindMin = () => {
        if (animState.isPlaying) return;
        const steps = activeTree.findMin();
        startAnimation(steps);
        setAnimState(prev => ({ ...prev, message: 'Finding Minimum...', steps }));
    };

    const handleFindMax = () => {
        if (animState.isPlaying) return;
        const steps = activeTree.findMax();
        startAnimation(steps);
        setAnimState(prev => ({ ...prev, message: 'Finding Maximum...', steps }));
    };

    const handleGenerateRandom = () => {
        if (animState.isPlaying) return;
        handleReset();
        const count = Math.floor(Math.random() * 4) + 7; // 7 to 10
        const newValues: number[] = [];
        while (newValues.length < count) {
            const val = Math.floor(Math.random() * 99) + 1;
            if (!newValues.includes(val)) newValues.push(val);
        }
        
        setHistory(newValues);
        newValues.forEach(v => activeTree.insert(v));
        updateLayout(activeTree.root);
        setAnimState(prev => ({ ...prev, message: `Generated Random Tree with ${count} nodes` }));
    };

    return {
        root,
        highlightedNodeId,
        foundNodeId,
        visitedNodeIds,
        animState,
        speed,
        setSpeed,
        handleInsert,
        handleDelete,
        handleSearch,
        handleReset,
        handleTraversal,
        setPlaying: (isPlaying: boolean) => setAnimState(prev => ({ ...prev, isPlaying })),
        stepForward,
        updateLayout,
        treeType,
        setTreeType: handleSetTreeType,
        handleFindMin,
        handleFindMax,
        handleGenerateRandom
    };
}
