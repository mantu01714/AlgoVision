import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Play, RotateCcw, GitBranch, Edit3 } from 'lucide-react';
import { BinarySearchTree } from '../../algorithms/tree';

function TreeVisualization() {
  const [bst] = useState(new BinarySearchTree());
  const [treeData, setTreeData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalType, setTraversalType] = useState('inorder');
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [traversalPath, setTraversalPath] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const updateTree = useCallback(() => {
    setTreeData(bst.getVisualizationData());
  }, [bst]);

  const insertNode = useCallback(() => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      bst.insert(value);
      updateTree();
      setInputValue('');
    }
  }, [inputValue, bst, updateTree]);

  const deleteNode = useCallback(() => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      bst.delete(value);
      updateTree();
      setInputValue('');
    }
  }, [inputValue, bst, updateTree]);

  const startTraversal = useCallback(async () => {
    setIsTraversing(true);
    setHighlightedNodes(new Set());
    const path = bst.traverse(traversalType);
    setTraversalPath(path);
    
    for (let i = 0; i < path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setHighlightedNodes(new Set(path.slice(0, i + 1)));
    }
    
    setIsTraversing(false);
  }, [bst, traversalType]);

  const resetTree = useCallback(() => {
    bst.clear();
    setTreeData(null);
    setHighlightedNodes(new Set());
    setTraversalPath([]);
  }, [bst]);

  const generateSampleTree = useCallback(() => {
    resetTree();
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 65];
    values.forEach(value => bst.insert(value));
    updateTree();
  }, [bst, updateTree, resetTree]);

  const setCustomTree = useCallback(() => {
    const values = customInput
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v));
    
    if (values.length > 0) {
      bst.clear();
      values.forEach(value => bst.insert(value));
      updateTree();
      setShowCustomInput(false);
      setCustomInput('');
      resetTree();
    }
  }, [customInput, bst, updateTree, resetTree]);

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null;

    const spacing = Math.max(120 - level * 20, 40);
    const leftX = x - spacing;
    const rightX = x + spacing;
    const childY = y + 80;

    const isHighlighted = highlightedNodes.has(node.value);

    return (
      <g key={node.value}>
        {/* Edges */}
        {node.left && (
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            x1={x}
            y1={y}
            x2={leftX}
            y2={childY}
            stroke="#64748b"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            x1={x}
            y1={y}
            x2={rightX}
            y2={childY}
            stroke="#64748b"
            strokeWidth="2"
          />
        )}
        
        {/* Node */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            fill: isHighlighted ? '#f97316' : '#3b82f6'
          }}
          transition={{ duration: 0.3 }}
          cx={x}
          cy={y}
          r="20"
          className="drop-shadow-md"
        />
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="text-sm font-bold fill-white"
        >
          {node.value}
        </motion.text>

        {/* Recursive rendering for children */}
        {node.left && renderNode(node.left, leftX, childY, level + 1)}
        {node.right && renderNode(node.right, rightX, childY, level + 1)}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Binary Search Tree</h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
            />
            <button
              onClick={insertNode}
              disabled={!inputValue || isTraversing}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Insert</span>
            </button>
            <button
              onClick={deleteNode}
              disabled={!inputValue || isTraversing}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Minus className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>

          <select
            value={traversalType}
            onChange={(e) => setTraversalType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="inorder">Inorder</option>
            <option value="preorder">Preorder</option>
            <option value="postorder">Postorder</option>
          </select>

          <button
            onClick={startTraversal}
            disabled={!treeData || isTraversing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Traverse</span>
          </button>

          <button
            onClick={resetTree}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Clear</span>
          </button>

          <button
            onClick={generateSampleTree}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span>Sample Tree</span>
          </button>

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Custom Tree</span>
          </button>
        </div>

        {/* Custom Input */}
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
          >
            <h4 className="text-lg font-semibold text-indigo-800 mb-2">Create Custom Tree</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter numbers separated by commas (e.g., 50, 30, 70, 20, 40, 60, 80)"
                className="flex-1 px-3 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={setCustomTree}
                disabled={!customInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Build Tree
              </button>
            </div>
            <p className="text-sm text-indigo-600 mt-2">
              Enter numbers to build a binary search tree. Duplicates will be ignored.
            </p>
          </motion.div>
        )}

        {/* Tree Visualization */}
        <div className="bg-slate-50 rounded-lg p-4 min-h-96">
          {treeData ? (
            <svg width="100%" height="400" className="overflow-visible">
              {renderNode(treeData, 400, 50)}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-96 text-slate-500">
              <div className="text-center">
                <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No tree to display</p>
                <p className="text-sm">Insert values to build the tree</p>
              </div>
            </div>
          )}
        </div>

        {/* Traversal Path */}
        {traversalPath.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg"
          >
            <h4 className="text-lg font-semibold text-purple-800 mb-2">
              {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal:
            </h4>
            <div className="flex flex-wrap gap-2">
              {traversalPath.map((value, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm font-medium"
                >
                  {value}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default TreeVisualization;