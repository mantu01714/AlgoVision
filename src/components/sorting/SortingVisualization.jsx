import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Zap, Edit3 } from 'lucide-react';
import { bubbleSort, mergeSort, quickSort, insertionSort } from '../../algorithms/sorting';
import { generateRandomArray } from '../../utils/helpers';

const algorithms = [
  { id: 'bubble', name: 'Bubble Sort', func: bubbleSort },
  { id: 'merge', name: 'Merge Sort', func: mergeSort },
  { id: 'quick', name: 'Quick Sort', func: quickSort },
  { id: 'insertion', name: 'Insertion Sort', func: insertionSort },
];

function SortingVisualization() {
  const [array, setArray] = useState(generateRandomArray(20));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(20);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const resetVisualization = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
  }, []);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    resetVisualization();
  }, [arraySize, resetVisualization]);

  const setCustomArray = useCallback(() => {
    const values = customInput
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v) && v > 0);
    
    if (values.length > 0) {
      setArray(values);
      setArraySize(values.length);
      resetVisualization();
      setShowCustomInput(false);
      setCustomInput('');
    }
  }, [customInput, resetVisualization]);

  const startSorting = useCallback(() => {
    if (steps.length === 0) {
      const algorithm = algorithms.find(alg => alg.id === selectedAlgorithm);
      const sortingSteps = algorithm.func([...array]);
      setSteps(sortingSteps);
    }
    setIsPlaying(true);
  }, [array, selectedAlgorithm, steps.length]);

  const pauseSorting = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setArray(steps[currentStep].array);
        setCurrentStep(currentStep + 1);
      }, 1000 - speed * 9);

      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, speed]);

  const currentStepData = steps[currentStep] || { comparing: [], swapping: [] };
  const maxValue = Math.max(...array);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Sorting Algorithms</h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value);
              resetVisualization();
            }}
            className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {algorithms.map(alg => (
              <option key={alg.id} value={alg.id}>{alg.name}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <button
              onClick={isPlaying ? pauseSorting : startSorting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={resetVisualization}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={generateNewArray}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>Randomize</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-slate-600" />
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

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Size:</span>
            <input
              type="range"
              min="5"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-slate-500">{arraySize}</span>
          </div>

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Custom Array</span>
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
            <h4 className="text-lg font-semibold text-indigo-800 mb-2">Create Custom Array</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter numbers separated by commas (e.g., 64, 34, 25, 12, 22, 11, 90)"
                className="flex-1 px-3 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={setCustomArray}
                disabled={!customInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Apply
              </button>
            </div>
            <p className="text-sm text-indigo-600 mt-2">
              Enter positive numbers separated by commas to create your own array
            </p>
          </motion.div>
        )}

        {/* Bar Visualization */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Bar Representation</h3>
          <div className="flex items-end justify-center space-x-1 h-64 bg-slate-50 rounded-lg p-4">
            <AnimatePresence>
              {array.map((value, index) => (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    backgroundColor: currentStepData.comparing?.includes(index) 
                      ? '#ef4444' 
                      : currentStepData.swapping?.includes(index)
                      ? '#f97316'
                      : '#3b82f6'
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 max-w-8 rounded-t-md flex items-end justify-center text-white text-xs font-medium"
                  style={{ 
                    height: `${(value / maxValue) * 200}px`,
                    minHeight: '20px'
                  }}
                >
                  <span className="mb-1">{value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Number Representation */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Array Representation</h3>
          <div className="flex flex-wrap justify-center gap-2 bg-slate-50 rounded-lg p-4">
            <AnimatePresence>
              {array.map((value, index) => (
                <motion.div
                  key={`num-${index}-${value}`}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1,
                    opacity: 1,
                    backgroundColor: currentStepData.comparing?.includes(index) 
                      ? '#ef4444' 
                      : currentStepData.swapping?.includes(index)
                      ? '#f97316'
                      : '#e2e8f0'
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-semibold text-slate-800 shadow-sm"
                >
                  {value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SortingVisualization;