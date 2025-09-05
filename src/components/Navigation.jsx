import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, GitBranch, Network } from 'lucide-react';

const tabs = [
  { id: 'sorting', label: 'Sorting', icon: BarChart3 },
  { id: 'searching', label: 'Searching', icon: Search },
  { id: 'tree', label: 'Tree', icon: GitBranch },
  { id: 'graph', label: 'Graph', icon: Network },
];

function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">AlogVision</h1>
          </div>
          
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;