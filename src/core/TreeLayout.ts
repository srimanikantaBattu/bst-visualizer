import { BSTNode } from './BST';

export function calculateTreePositions(root: BSTNode | null, width: number, height: number) {
    if (!root) return;

    // Simple level-based layout
    // Assign x, y coordinates
    // Root at top center
    // Children partition the width

    // A better approach for BST is using In-Order traversal for X coordinate
    // This guarantees the BST property (left < root < right) is visually respected
    // i.e., nodes are strictly ordered left-to-right by value.

    const levels: BSTNode[][] = [];
    const traverseDepth = (node: BSTNode | null, depth: number) => {
        if (!node) return;
        if (!levels[depth]) levels[depth] = [];
        levels[depth].push(node);
        traverseDepth(node.left, depth + 1);
        traverseDepth(node.right, depth + 1);
    };
    traverseDepth(root, 0);

    // In-order traversal to assign logic X index
    let xOrder = 0;
    const traverseInOrder = (node: BSTNode | null, depth: number) => {
        if (!node) return;
        traverseInOrder(node.left, depth + 1);

        // Assign coords
        // spacing based on depth? or just uniform?
        // uniform in-order spacing is best for "bst" visualization
        node.x = xOrder;
        node.y = depth;
        xOrder++;

        traverseInOrder(node.right, depth + 1);
    };
    traverseInOrder(root, 0);

    // Normalize coordinates to canvas size
    // width per node = width / totalNodes (or max width)
    // height per node = height / totalLevels

    const totalNodesX = xOrder;
    const totalLevels = levels.length;

    const PADDING = 40;
    const availableWidth = width - PADDING * 2;
    const availableHeight = height - PADDING * 2;

    // Dynamic scaling with constraints
    // Don't let nodes get too spread out or too squished
    const MIN_X_STEP = 40;
    const MAX_X_STEP = 150; // Don't spread too wide on large screens

    let xStep = totalNodesX > 1 ? availableWidth / (totalNodesX - 1) : availableWidth / 2;
    xStep = Math.max(MIN_X_STEP, Math.min(xStep, MAX_X_STEP));

    const yStep = 60; // Fixed vertical spacing is usually better for trees than dynamic

    // Calculate actual occupied width by the tree
    const treeWidth = totalNodesX > 1 ? (totalNodesX - 1) * xStep : 0;

    // Center the tree in the available canvas
    const startX = (width - treeWidth) / 2;

    const mapNode = (node: BSTNode | null) => {
        if (!node) return;

        // node.x is its in-order index (0 to totalNodesX-1)
        node.x = startX + node.x * xStep;
        node.y = PADDING + node.y * yStep + 40;

        mapNode(node.left);
        mapNode(node.right);
    };

    mapNode(root);
}
