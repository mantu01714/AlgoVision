import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Search, Edit3 } from 'lucide-react';
import { linearSearch, binarySearch } from '../../algorithms/searching';
import { generateSortedArray } from '../../utils/helpers';

function SearchingVisualization() {
  const [array, setArray] = useState(generateSortedArray(15));
  const [searchKey, setSearchKey] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear');
  const [speed, setSpeed] = useState(50);
  const [result, setResult] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const resetVisualization = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setResult(null);
  }, []);

  const generateNewArray = useCallback(() => {
    const newArray = selectedAlgorithm === 'binary' 
      ? generateSortedArray(15) 
      : generateSortedArray(15).sort(() => Math.random() - 0.5);
    setArray(newArray);
    resetVisualization();
  }, [selectedAlgorithm, resetVisualization]);

  const setCustomArray = useCallback(() => {
    const values = customInput
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v));
    
    if (values.length > 0) {
      const sortedValues = selectedAlgorithm === 'binary' 
        ? [...values].sort((a, b) => a - b)
        : values;
      setArray(sortedValues);
      resetVisualization();
      setShowCustomInput(false);
      setCustomInput('');
    }
  }, [customInput, selectedAlgorithm, resetVisualization]);

  const startSearching = useCallback(() => {
    const searchSteps = selectedAlgorithm === 'linear' 
      ? linearSearch([...array], searchKey)
      : binarySearch([...array], searchKey);
    
    setSteps(searchSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  }, [array, searchKey, selectedAlgorithm]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        if (step.found !== undefined) {
          setResult(step.found ? step.index : -1);
        }
        setCurrentStep(currentStep + 1);
      }, 1100 - speed * 10);

      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, speed]);

  const currentStepData = steps[currentStep] || { comparing: [], left: null, right: null, mid: null };
  const maxValue = Math.max(...array);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Search Algorithms</h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value);
              resetVisualization();
              if (e.target.value === 'binary') {
                setArray(prev => [...prev].sort((a, b) => a - b));
              }
            }}
            className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="linear">Linear Search</option>
            <option value="binary">Binary Search</option>
          </select>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-slate-600" />
            <input
              type="number"
              value={searchKey}
              onChange={(e) => setSearchKey(parseInt(e.target.value) || 0)}
              placeholder="Search for..."
              className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={startSearching}
              disabled={isPlaying}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Search</span>
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
              <span>New Array</span>
            </button>

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Custom Array</span>
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
            className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
          >
            <h4 className="text-lg font-semibold text-indigo-800 mb-2">Create Custom Array</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter numbers separated by commas (e.g., 10, 25, 30, 45, 60, 75)"
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
              {selectedAlgorithm === 'binary' 
                ? 'Array will be automatically sorted for binary search'
                : 'Enter numbers in any order for linear search'
              }
            </p>
          </motion.div>
        )}

        {selectedAlgorithm === 'binary' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Binary search requires a sorted array. The array is automatically sorted.
            </p>
          </div>
        )}

        {/* Bar Visualization */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Bar Representation</h3>
          <div className="flex items-end justify-center space-x-1 h-48 bg-slate-50 rounded-lg p-4">
            {array.map((value, index) => {
              let barColor = '#3b82f6';
              
              if (currentStepData.comparing?.includes(index)) {
                barColor = '#ef4444';
              } else if (selectedAlgorithm === 'binary') {
                if (index === currentStepData.mid) {
                  barColor = '#f97316';
                } else if (index >= (currentStepData.left || 0) && index <= (currentStepData.right || array.length - 1)) {
                  barColor = '#22c55e';
                }
              }

              return (
                <motion.div
                  key={index}
                  animate={{ backgroundColor: barColor }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 max-w-8 rounded-t-md flex items-end justify-center text-white text-xs font-medium"
                  style={{ 
                    height: `${(value / maxValue) * 160}px`,
                    minHeight: '20px'
                  }}
                >
                  <span className="mb-1">{value}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Number Representation */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Array Representation</h3>
          <div className="flex flex-wrap justify-center gap-2 bg-slate-50 rounded-lg p-4">
            {array.map((value, index) => {
              let bgColor = '#e2e8f0';
              let textColor = '#1e293b';
              
              if (currentStepData.comparing?.includes(index)) {
                bgColor = '#ef4444';
                textColor = 'white';
              } else if (selectedAlgorithm === 'binary') {
                if (index === currentStepData.mid) {
                  bgColor = '#f97316';
                  textColor = 'white';
                } else if (index >= (currentStepData.left || 0) && index <= (currentStepData.right || array.length - 1)) {
                  bgColor = '#22c55e';
                  textColor = 'white';
                }
              }

              return (
                <motion.div
                  key={index}
                  animate={{ backgroundColor: bgColor, color: textColor }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-semibold shadow-sm"
                >
                  {value}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Search Result */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-lg ${
              result === -1 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <p className={`text-lg font-semibold ${
              result === -1 ? 'text-red-800' : 'text-green-800'
            }`}>
              {result === -1 
                ? `Value ${searchKey} not found in the array` 
                : `Value ${searchKey} found at index ${result}`}
            </p>
          </motion.div>
        )}

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

export default SearchingVisualization;