import React, { useState } from 'react';
import Navigation from './components/Navigation';
import SortingVisualization from './components/sorting/SortingVisualization';
import SearchingVisualization from './components/searching/SearchingVisualization';
import TreeVisualization from './components/tree/TreeVisualization';
import GraphVisualization from './components/graph/GraphVisualization';
import Footer from "./components/Footer";

function App() {
  const [activeTab, setActiveTab] = useState('sorting');

  const renderActiveVisualization = () => {
    switch (activeTab) {
      case 'sorting':
        return <SortingVisualization />;
      case 'searching':
        return <SearchingVisualization />;
      case 'tree':
        return <TreeVisualization />;
      case 'graph':
        return <GraphVisualization />;
      default:
        return <SortingVisualization />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-4 flex-1">
        {renderActiveVisualization()}
      </main>
      <Footer />
    </div>
  );
}

export default App;