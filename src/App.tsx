import { useBSTAnimation } from './hooks/useBSTAnimation';
import TreeVisualizer from './components/TreeVisualizer';
import Controls from './components/Controls';
import CodePanel from './components/CodePanel';

import { useWindowSize } from './hooks/useWindowSize';

function App() {
  const size = useWindowSize();
  const {
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
    setPlaying,
    stepForward,
    updateLayout,
    treeType,
    setTreeType,
    handleFindMin,
    handleFindMax,
    handleGenerateRandom
  } = useBSTAnimation(size.width, 600);

  // Force layout update when size changes
  // This is a bit of a hack; ideally useBSTAnimation tracks size internally or we pass size to it
  // But for now, let's just ensure TreeVisualizer gets the right props.
  // Actually, 'root' has x,y baked in. We need to tell the hook to re-layout.

  // React.useEffect(() => {
  //   if (root) updateLayout(root); 
  // }, [size.width, size.height]);
  // Wait, useBSTAnimation encapsulates the layout state. 
  // If we change the layout we need to trigger it there.

  // Let's refactor App to pass dimensions to useBSTAnimation? 
  // Or just pass the dimensions to the visualizer and let it re-layout?
  // The layout is computed in the HOOK. So the hook needs the dimensions.

  // Determine current algorithm code based on message/state (Simplified for demo)
  let codeTitle = "Algorithm";
  let codeLines: string[] = [];

  if (animState.message.includes("inorder")) {
    codeTitle = "Inorder Traversal";
    codeLines = [
      "if node is null return",
      "inorder(node.left)",
      "print(node.value)",
      "inorder(node.right)"
    ];
  } else if (animState.message.includes("preorder")) {
    codeTitle = "Preorder Traversal";
    codeLines = [
      "if node is null return",
      "print(node.value)",
      "preorder(node.left)",
      "preorder(node.right)"
    ];
  } else if (animState.message.includes("postorder")) {
    codeTitle = "Postorder Traversal";
    codeLines = [
      "if node is null return",
      "postorder(node.left)",
      "postorder(node.right)",
      "print(node.value)"
    ];
  } else if (animState.message.includes("Insert")) {
    codeTitle = "Insert";
    codeLines = [
      "if (root == null) return new Node(val)",
      "if (val < root.val)",
      "   root.left = insert(root.left, val)",
      "else if (val > root.val)",
      "   root.right = insert(root.right, val)",
      "else return root"
    ];
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Dark Header */}
      <header className="bg-black text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-[#FF8C00] font-bold text-xl tracking-tight">VISUALGO</span>
          <span className="text-sm font-light text-slate-400">/ BST Visualizer</span>
        </div>
        <div className="text-xs text-slate-500">
          BINARY SEARCH TREE
        </div>
      </header>

      {/* Controls Bar - Moved to Top */}
      <div className="w-full bg-white border-b border-slate-200 p-4 shadow-sm z-10">
        <div className="max-w-6xl mx-auto">
          <Controls
            onInsert={handleInsert}
            onDelete={handleDelete}
            onSearch={handleSearch}
            onReset={handleReset}
            onPlayPause={() => setPlaying(!animState.isPlaying)}
            onStepForward={stepForward}
            onTraversal={handleTraversal}
            onFindMin={handleFindMin}
            onFindMax={handleFindMax}
            onGenerateRandom={handleGenerateRandom}
            treeType={treeType}
            setTreeType={setTreeType}
            isPlaying={animState.isPlaying}
            canStep={animState.currentStepIndex < animState.steps.length}
            speed={speed}
            setSpeed={setSpeed}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center relative overflow-hidden bg-[#f7f7f7]">

        {/* Tree Canvas */}
        <div className="w-full flex-1 relative">
          <TreeVisualizer
            root={root}
            highlightedNodeId={highlightedNodeId}
            foundNodeId={foundNodeId}
            visitedNodeIds={visitedNodeIds}
            width={size.width}
            height={600}
          />

          {/* Absolute positioned Code Panel (bottom right like visualgo) */}
          <div className="absolute bottom-4 right-4 shadow-xl">
            <CodePanel title={codeTitle} code={codeLines} currentLine={-1} />
          </div>

          {/* Messages Log */}
          {animState.message && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm shadow-lg border border-white/10">
              {animState.message}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
