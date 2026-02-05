export type AnimationStep =
    | { type: 'visit'; nodeId: number; value: number }
    | { type: 'found'; nodeId: number; value: number }
    | { type: 'notFound'; value: number; path: number[] }
    | { type: 'insert'; nodeId: number; value: number; parentId: number | null }
    | { type: 'delete'; nodeId: number; value: number }
    | { type: 'move'; nodeId: number; from: { x: number; y: number }; to: { x: number; y: number } }
    | { type: 'reset' };

export class BSTNode {
    id: number;
    value: number;
    left: BSTNode | null = null;
    right: BSTNode | null = null;
    x: number = 0;
    y: number = 0;

    constructor(value: number, id: number) {
        this.value = value;
        this.id = id;
    }
}

export class BST {
    root: BSTNode | null = null;
    private nextId = 1;

    insert(value: number): AnimationStep[] {
        const steps: AnimationStep[] = [];
        if (!this.root) {
            this.root = new BSTNode(value, this.nextId++);
            steps.push({ type: 'insert', nodeId: this.root.id, value, parentId: null });
            return steps;
        }

        let current = this.root;
        while (true) {
            steps.push({ type: 'visit', nodeId: current.id, value: current.value });
            if (value < current.value) {
                if (!current.left) {
                    current.left = new BSTNode(value, this.nextId++);
                    steps.push({ type: 'insert', nodeId: current.left.id, value, parentId: current.id });
                    break;
                }
                current = current.left;
            } else if (value > current.value) {
                if (!current.right) {
                    current.right = new BSTNode(value, this.nextId++);
                    steps.push({ type: 'insert', nodeId: current.right.id, value, parentId: current.id });
                    break;
                }
                current = current.right;
            } else {
                // value exists
                steps.push({ type: 'found', nodeId: current.id, value });
                break;
            }
        }
        return steps;
    }

    search(value: number): AnimationStep[] {
        const steps: AnimationStep[] = [];
        let current = this.root;
        const path: number[] = [];

        while (current) {
            path.push(current.id);
            steps.push({ type: 'visit', nodeId: current.id, value: current.value });
            if (value === current.value) {
                steps.push({ type: 'found', nodeId: current.id, value });
                return steps;
            }
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        steps.push({ type: 'notFound', value, path });
        return steps;
    }

    delete(value: number): AnimationStep[] {
        // Simplified deletion for now - just tracking the removal
        // A full visual deletion with successor tracking is complex to animate perfectly in one go
        // For this visualizer, we'll implement standard BST deletion and just return a 'delete' step for the removed node
        // or 'reset' step to trigger a full re-render/re-layout
        const steps: AnimationStep[] = [];
        // ... Implementation logic to be filled or handled via simpler Layout recalculation
        // For a nice visualizer, "delete" usually involves:
        // 1. Search (visualized)
        // 2. Swapping with successor (visualized movement)
        // 3. Removing the leaf (visualized disappearance)

        // Changing approach: `delete` will modify the structure and return steps to highlight the node being removed
        // The actual "movement" will be handled by the Layout engine recalculating positions.

        this.root = this.deleteNode(this.root, value, steps);
        return steps;
    }

    private deleteNode(node: BSTNode | null, value: number, steps: AnimationStep[]): BSTNode | null {
        if (!node) return null;

        steps.push({ type: 'visit', nodeId: node.id, value: node.value });

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value, steps);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value, steps);
        } else {
            // Found node to delete
            steps.push({ type: 'found', nodeId: node.id, value });
            steps.push({ type: 'delete', nodeId: node.id, value });

            // Case 1: No children
            if (!node.left && !node.right) {
                return null;
            }
            // Case 2: One child
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // Case 3: Two children
            // Find min in right subtree
            let temp = node.right;
            while (temp.left) temp = temp.left;

            node.value = temp.value; // Copy value
            // We probably want a step here to show the value changing?
            // steps.push({ type: 'replace', nodeId: node.id, val: temp.value });

            node.right = this.deleteNode(node.right, temp.value, steps);
        }
        return node;
    }
    inorder(): AnimationStep[] {
        const steps: AnimationStep[] = [];
        const traverse = (node: BSTNode | null) => {
            if (!node) return;
            steps.push({ type: 'visit', nodeId: node.id, value: node.value }); // Visit (highlight)
            traverse(node.left);
            // Process
            steps.push({ type: 'found', nodeId: node.id, value: node.value });
            traverse(node.right);
        };
        traverse(this.root);
        return steps;
    }

    preorder(): AnimationStep[] {
        const steps: AnimationStep[] = [];
        const traverse = (node: BSTNode | null) => {
            if (!node) return;
            steps.push({ type: 'visit', nodeId: node.id, value: node.value });
            steps.push({ type: 'found', nodeId: node.id, value: node.value }); // Process root first
            traverse(node.left);
            traverse(node.right);
        };
        traverse(this.root);
        return steps;
    }

    postorder(): AnimationStep[] {
        const steps: AnimationStep[] = [];
        const traverse = (node: BSTNode | null) => {
            if (!node) return;
            steps.push({ type: 'visit', nodeId: node.id, value: node.value });
            traverse(node.left);
            traverse(node.right);
            steps.push({ type: 'found', nodeId: node.id, value: node.value }); // Process root last
        };
        traverse(this.root);
        return steps;
    }

    findMin(): AnimationStep[] {
        const steps: AnimationStep[] = [];
        let current = this.root;
        while (current) {
            steps.push({ type: 'visit', nodeId: current.id, value: current.value });
            if (current.left) {
                current = current.left;
            } else {
                steps.push({ type: 'found', nodeId: current.id, value: current.value });
                break;
            }
        }
        return steps;
    }

    findMax(): AnimationStep[] {
        const steps: AnimationStep[] = [];
        let current = this.root;
        while (current) {
            steps.push({ type: 'visit', nodeId: current.id, value: current.value });
            if (current.right) {
                current = current.right;
            } else {
                steps.push({ type: 'found', nodeId: current.id, value: current.value });
                break;
            }
        }
        return steps;
    }
}
