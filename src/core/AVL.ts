import { BSTNode } from './BST';
import type { AnimationStep } from './BST';

export class AVL {
    root: BSTNode | null = null;
    private nextId: number = 0; // Shared ID counter? We probably need to manage IDs carefully if rebuilding.

    constructor(initialId: number = 0) {
        this.nextId = initialId;
    }

    // Helper to get height
    private getHeight(node: BSTNode | null): number {
        if (!node) return 0;
        return (node as any).height || 1;
    }

    // Helper to update height
    private updateHeight(node: BSTNode) {
        (node as any).height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    // Get balance factor
    private getBalance(node: BSTNode | null): number {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    private rightRotate(y: BSTNode, steps: AnimationStep[]): BSTNode {
        const x = y.left!;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        steps.push({ type: 'visit', nodeId: x.id, value: x.value }); // Visualize rotation?
        // Actually, structurally the tree changes here. 
        // We might want a specific 'rotate' step type later, but for now 'visit' highlights the pivot.

        return x;
    }

    private leftRotate(x: BSTNode, steps: AnimationStep[]): BSTNode {
        const y = x.right!;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        steps.push({ type: 'visit', nodeId: y.id, value: y.value });

        return y;
    }

    insert(value: number): AnimationStep[] {
        const steps: AnimationStep[] = [];
        this.root = this.insertNode(this.root, value, steps);
        return steps;
    }

    private insertNode(node: BSTNode | null, value: number, steps: AnimationStep[]): BSTNode {
        // 1. Perform normal BST insert
        if (!node) {
            const newNode = new BSTNode(value, this.nextId++);
            (newNode as any).height = 1;
            steps.push({ type: 'insert', nodeId: newNode.id, value, parentId: null });
            return newNode;
        }

        steps.push({ type: 'visit', nodeId: node.id, value: node.value });

        if (value < node.value) {
            node.left = this.insertNode(node.left, value, steps);
        } else if (value > node.value) {
            node.right = this.insertNode(node.right, value, steps);
        } else {
            // Duplicate keys not allowed
            steps.push({ type: 'found', nodeId: node.id, value });
            return node;
        }

        // 2. Update height of this ancestor node
        this.updateHeight(node);

        // 3. Get the balance factor of this ancestor node to check whether this node became unbalanced
        const balance = this.getBalance(node);

        // If this node becomes unbalanced, then there are 4 cases

        // Left Left Case
        if (balance > 1 && value < node.left!.value) {
            return this.rightRotate(node, steps);
        }

        // Right Right Case
        if (balance < -1 && value > node.right!.value) {
            return this.leftRotate(node, steps);
        }

        // Left Right Case
        if (balance > 1 && value > node.left!.value) {
            node.left = this.leftRotate(node.left!, steps);
            return this.rightRotate(node, steps);
        }

        // Right Left Case
        if (balance < -1 && value < node.right!.value) {
            node.right = this.rightRotate(node.right!, steps);
            return this.leftRotate(node, steps);
        }

        return node;
    }

    // Implement search/delete similarly if needed, or re-use BST logic for search
    search(value: number): AnimationStep[] {
        // Search is same as BST
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

    // Traversals are also same as BST, we can copy or inherit? 
    // Composition is safer here since AVL logic is strictly adding to BST insert.

    inorder(): AnimationStep[] {
        const steps: AnimationStep[] = [];
        const traverse = (node: BSTNode | null) => {
            if (!node) return;
            steps.push({ type: 'visit', nodeId: node.id, value: node.value });
            traverse(node.left);
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
            steps.push({ type: 'found', nodeId: node.id, value: node.value });
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
            steps.push({ type: 'found', nodeId: node.id, value: node.value });
        };
        traverse(this.root);
        return steps;
    }

    // Delete is complex in AVL (needs rebalancing). 
    // For MVP "Visualize same BST in AVL", we can assume just Insert for now?
    // User asked "Visualize same BST in AVL", likely implying seeing how insertions differ.
    // If delete is needed, I'll add standard AVL delete + rebalance. 
    // Let's implement a basic Delete with rebalancing to be complete.

    delete(value: number): AnimationStep[] {
        const steps: AnimationStep[] = [];
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
            steps.push({ type: 'found', nodeId: node.id, value });
            steps.push({ type: 'delete', nodeId: node.id, value });

            if (!node.left || !node.right) {
                let temp = node.left ? node.left : node.right;
                if (!temp) {
                    node = null;
                } else {
                    node = temp;
                }
            } else {
                let temp = this.minValueNode(node.right);
                node.value = temp.value;
                node.right = this.deleteNode(node.right, temp.value, steps);
            }
        }

        if (!node) return null;

        this.updateHeight(node);
        const balance = this.getBalance(node);

        // Balance Step (same as insert but check balance factor of children)
        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rightRotate(node, steps);
        }
        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.leftRotate(node.left!, steps);
            return this.rightRotate(node, steps);
        }
        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.leftRotate(node, steps);
        }
        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rightRotate(node.right!, steps);
            return this.leftRotate(node, steps);
        }

        return node;
    }

    private minValueNode(node: BSTNode): BSTNode {
        let current = node;
        while (current.left) current = current.left;
        return current;
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
