import React, { useMemo } from 'react';
import { BSTNode } from '../core/BST';
import TreeNode from './TreeNode';

interface TreeVisualizerProps {
    root: BSTNode | null;
    highlightedNodeId: number | null;
    foundNodeId: number | null;
    visitedNodeIds: number[];
    width?: number;
    height?: number;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
    root,
    highlightedNodeId,
    foundNodeId,
    visitedNodeIds,
    width = 800,
    height = 500
}) => {

    // Recursively collect edges
    const renderEdges = (node: BSTNode | null): React.ReactNode[] => {
        if (!node) return [];

        const edges: React.ReactNode[] = [];
        if (node.left) {
            edges.push(
                <line
                    key={`edge-${node.id}-${node.left.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={node.left.x}
                    y2={node.left.y}
                    className="stroke-[#FF8C00] stroke-2 transition-all duration-500 ease-in-out"
                />
            );
            edges.push(...renderEdges(node.left));
        }
        if (node.right) {
            edges.push(
                <line
                    key={`edge-${node.id}-${node.right.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={node.right.x}
                    y2={node.right.y}
                    className="stroke-[#FF8C00] stroke-2 transition-all duration-500 ease-in-out"
                />
            );
            edges.push(...renderEdges(node.right));
        }
        return edges;
    };

    const renderNodes = (node: BSTNode | null, isRoot: boolean = false): React.ReactNode[] => {
        if (!node) return [];

        let type: 'normal' | 'current' | 'found' | 'visited' = 'normal';
        if (foundNodeId === node.id) type = 'found';
        else if (highlightedNodeId === node.id) type = 'current';
        else if (visitedNodeIds.includes(node.id)) type = 'visited';

        const labelBottom = isRoot ? "root" : undefined;

        // We can add logic to calculate height/size for labelTop here if we want "N=.., h=.."
        // For now, let's just do 'root'

        const nodes: React.ReactNode[] = [
            <TreeNode
                key={node.id}
                x={node.x}
                y={node.y}
                value={node.value}
                type={type}
                labelBottom={labelBottom}
            />
        ];

        nodes.push(...renderNodes(node.left));
        nodes.push(...renderNodes(node.right));
        return nodes;
    };

    const edges = useMemo(() => renderEdges(root), [root]);
    const nodes = useMemo(() => renderNodes(root, true), [root, highlightedNodeId, foundNodeId, visitedNodeIds]);

    return (
        <div className="w-full h-full border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <g>
                    {edges}
                    {nodes}
                </g>
            </svg>
        </div>
    );
};

export default TreeVisualizer;
