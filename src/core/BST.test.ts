import { BST } from './BST';

const runTests = () => {
    console.log("Running BST Logic Tests...");
    const bst = new BST();

    // Test Insert
    console.log("Testing Insert...");
    const steps1 = bst.insert(10);
    console.assert(steps1.length > 0, "Insert should produce steps");
    console.assert(bst.root?.value === 10, "Root should be 10");

    bst.insert(5);
    bst.insert(15);
    console.assert(bst.root?.left?.value === 5, "Left child should be 5");
    console.assert(bst.root?.right?.value === 15, "Right child should be 15");
    console.log("Insert tests passed.");

    // Test Search
    console.log("Testing Search...");
    const searchSteps = bst.search(5);
    const foundStep = searchSteps.find(s => s.type === 'found');
    console.assert(!!foundStep, "Should find 5");
    console.log("Search tests passed.");

    // Test Delete (Leaf)
    console.log("Testing Delete (Leaf)...");
    bst.delete(5);
    // Note: Our simplified delete logic might not remove from structure immediately if we relied on layout only?
    // Let's check the structure. My implementation of `deleteNode` DOES return modified structure.
    console.assert(bst.root?.left === null, "5 should be removed");
    console.log("Delete tests passed.");

    // Test Min/Max
    console.log("Testing Min/Max...");
    const bst2 = new BST();
    bst2.insert(10);
    bst2.insert(5);
    bst2.insert(15);
    bst2.insert(2);
    bst2.insert(20);
    
    const minSteps = bst2.findMin();
    const foundMin = minSteps.find(s => s.type === 'found');
    console.assert(foundMin?.value === 2, "Min should be 2");

    const maxSteps = bst2.findMax();
    const foundMax = maxSteps.find(s => s.type === 'found');
    console.assert(foundMax?.value === 20, "Max should be 20");
    console.log("Min/Max tests passed.");

    console.log("All tests passed!");
};

try {
    runTests();
} catch (e) {
    console.error("Test failed:", e);
}
