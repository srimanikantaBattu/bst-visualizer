# BST Visualizer (VisuAlgo Clone)

An interactive, animated visualization tool for Binary Search Trees (BST) and AVL Trees. This project is inspired by VisuAlgo and designed to help students and developers understand tree data structures through visual feedback and pseudocode execution.

## Features

### 🌳 Tree Support
- **Binary Search Tree (BST)**: Standard unbalanced binary search tree.
- **AVL Tree**: Self-balancing binary search tree that automatically maintains height balance.

### 🎮 Interactive Operations
- **Insert**: Add new nodes to the tree with animation showing the traversal path.
- **Delete**: Remove nodes while maintaining tree properties (handling leaf, single child, and two children cases).
- **Search**: animate the search process for a specific value.
- **Find Min / Find Max**: Quickly locate and highlight the minimum or maximum value in the tree.
- **Generate Random**: Create a random tree with a specified number of nodes to test different scenarios.

### 🔍 Traversals
Visualize how different tree traversal algorithms visit nodes:
- **Inorder**: Left -> Root -> Right
- **Preorder**: Root -> Left -> Right
- **Postorder**: Left -> Right -> Root

### 🕹️ Animation Controls
- **Play/Pause**: Pause the animation to inspect the current state.
- **Step Forward**: Execute the algorithm one step at a time.
- **Speed Control**: Adjust animation speed from 0.5x to 2x.
- **Reset**: Clear the tree and start fresh.

### 📝 Educational Aids
- **Pseudocode Panel**: Shows the actual algorithm code and highlights the line currently being executed in sync with the animation.
- **Status Messages**: Real-time feedback explaining what operation is currently happening (e.g., "Checking if 5 < 10").

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 16 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the client directory:
   ```bash
   cd bst-visualizer/client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

### Building for Production

To build the application for deployment:

```bash
npm run build
```

The output will be in the `dist` folder.

## Usage Guide

1. **Select Tree Type**: Use the toggle in the control panel to switch between **BST** and **AVL**.
2. **Add Nodes**: Enter a number in the input field and click **Insert** (or press Enter).
3. **Control Animation**:
   - Use the slider to change speed.
   - Click **Pause** to stop at a specific step.
   - Click **Step** to move forward one instruction at a time.
4. **Run Traversals**: Click **Inorder**, **Preorder**, or **Postorder** to see the traversal path animated.
5. **View Logic**: Watch the code panel in the bottom right to see exactly which line of code corresponds to the visual action.

## License

This project is for educational purposes.
