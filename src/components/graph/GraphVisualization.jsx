import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Network, Edit3 } from 'lucide-react';
import { Graph } from '../../algorithms/graph';
import { generateRandomGraph } from '../../utils/helpers';

function GraphVisualization() {
  const [graph] = useState(new Graph());
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [traversalSteps, setTraversalSteps] = useState([]);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [visitedEdges, setVisitedEdges] = useState(new Set());
  const [customNodes, setCustomNodes] = useState('');
  const [customEdges, setCustomEdges] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const updateGraph = useCallback(() => {
    setGraphData(graph.getVisualizationData());
  }, [graph]);

  const generateNewGraph = useCallback(() => {
    const { nodes, edges } = generateRandomGraph(8);
    graph.clear();
    
    nodes.forEach(node => graph.addNode(node.id));
    edges.forEach(edge => graph.addEdge(edge.from, edge.to));
    
    updateGraph();
    resetVisualization();
  }, [graph, updateGraph]);

  const resetVisualization = useCallback(() => {
    setIsTraversing(false);
    setCurrentStep(0);
    setTraversalSteps([]);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
  }, []);

  const setCustomGraph = useCallback(() => {
    const nodeValues = customNodes
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v));
    
    const edgeValues = customEdges
      .split(',')
      .map(edge => {
        const [from, to] = edge.split('-').map(v => parseInt(v.trim()));
        return { from, to };
      })
      .filter(edge => !isNaN(edge.from) && !isNaN(edge.to) && edge.from !== edge.to);
    
    if (nodeValues.length > 0) {
      graph.clear();
      nodeValues.forEach(node => graph.addNode(node));
      edgeValues.forEach(edge => {
        if (nodeValues.includes(edge.from) && nodeValues.includes(edge.to)) {
          graph.addEdge(edge.from, edge.to);
        }
      });
      updateGraph();
      resetVisualization();
      setShowCustomInput(false);
      setCustomNodes('');
      setCustomEdges('');
    }
  }, [customNodes, customEdges, graph, updateGraph, resetVisualization]);

  const startTraversal = useCallback(() => {
    if (graphData.nodes.length === 0) return;
    
    const steps = algorithm === 'bfs' 
      ? graph.bfs(startNode)
      : graph.dfs(startNode);
    
    setTraversalSteps(steps);
    setCurrentStep(0);
    setIsTraversing(true);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
  }, [graph, graphData.nodes.length, algorithm, startNode]);

  useEffect(() => {
    if (isTraversing && currentStep < traversalSteps.length) {
      const timer = setTimeout(() => {
        const step = traversalSteps[currentStep];
        setVisitedNodes(new Set(step.visited));
        if (step.edge) {
          setVisitedEdges(prev => new Set([...prev, step.edge]));
        }
        setCurrentStep(currentStep + 1);
      }, 1100 - speed * 10);

      return () => clearTimeout(timer);
    } else if (currentStep >= traversalSteps.length) {
      setIsTraversing(false);
    }
  }, [isTraversing, currentStep, traversalSteps, speed]);

  useEffect(() => {
    generateNewGraph();
  }, [generateNewGraph]);

  const getNodePosition = (index, total) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = Math.min(150, total * 15);
    const centerX = 250;
    const centerY = 200;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Graph Traversal</h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.target.value);
              resetVisualization();
            }}
            className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Start Node:</span>
            <input
              type="number"
              value={startNode}
              onChange={(e) => setStartNode(parseInt(e.target.value) || 0)}
              min="0"
              max={graphData.nodes.length - 1}
              className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={startTraversal}
              disabled={isTraversing || graphData.nodes.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Start</span>
            </button>

            <button
              onClick={resetVisualization}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={generateNewGraph}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>New Graph</span>
            </button>

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Custom Graph</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Speed:</span>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        {/* Custom Input */}
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg space-y-4"
          >
            <h4 className="text-lg font-semibold text-indigo-800">Create Custom Graph</h4>
            
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Nodes (comma-separated numbers):
              </label>
              <input
                type="text"
                value={customNodes}
                onChange={(e) => setCustomNodes(e.target.value)}
                placeholder="0, 1, 2, 3, 4, 5"
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Edges (format: from-to, comma-separated):
              </label>
              <input
                type="text"
                value={customEdges}
                onChange={(e) => setCustomEdges(e.target.value)}
                placeholder="0-1, 1-2, 2-3, 0-3, 1-4"
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={setCustomGraph}
                disabled={!customNodes.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Build Graph
              </button>
            </div>
            
            <p className="text-sm text-indigo-600">
              Create nodes first, then define edges between them. Only edges connecting existing nodes will be added.
            </p>
          </motion.div>
        )}

        {/* Graph Visualization */}
        <div className="bg-slate-50 rounded-lg p-4">
          {graphData.nodes.length > 0 ? (
            <svg width="100%" height="400" viewBox="0 0 500 400">
              {/* Edges */}
              {graphData.edges.map((edge, index) => {
                const fromPos = getNodePosition(edge.from, graphData.nodes.length);
                const toPos = getNodePosition(edge.to, graphData.nodes.length);
                const edgeKey = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
                const isVisited = visitedEdges.has(edgeKey);
                
                return (
                  <motion.line
                    key={`edge-${index}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={isVisited ? '#f97316' : '#cbd5e1'}
                    strokeWidth={isVisited ? '3' : '2'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                );
              })}
              
              {/* Nodes */}
              {graphData.nodes.map((node, index) => {
                const position = getNodePosition(index, graphData.nodes.length);
                const isVisited = visitedNodes.has(node.id);
                const isStartNode = node.id === startNode;
                
                return (
                  <g key={`node-${node.id}`}>
                    <motion.circle
                      cx={position.x}
                      cy={position.y}
                      r="25"
                      fill={isStartNode ? '#10b981' : isVisited ? '#f97316' : '#3b82f6'}
                      stroke="white"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="drop-shadow-md"
                    />
                    <motion.text
                      x={position.x}
                      y={position.y + 5}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {node.id}
                    </motion.text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-96 text-slate-500">
              <div className="text-center">
                <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No graph to display</p>
                <p className="text-sm">Generate a graph to start</p>
              </div>
            </div>
          )}
        </div>

        {/* Traversal Information */}
        {traversalSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">
                {algorithm.toUpperCase()} Traversal Path:
              </h4>
              <div className="flex flex-wrap gap-2">
                {traversalSteps.slice(0, currentStep).map((step, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium"
                  >
                    {step.node}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-600">
                Step {currentStep} of {traversalSteps.length}
              </p>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">Start Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-slate-600">Visited Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">Unvisited Node</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default GraphVisualization;