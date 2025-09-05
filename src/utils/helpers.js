export function generateRandomArray(size, min = 5, max = 100) {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

export function generateSortedArray(size, min = 5, max = 100) {
  const array = generateRandomArray(size, min, max);
  return array.sort((a, b) => a - b);
}

export function generateRandomGraph(nodeCount) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({ id: i }));
  const edges = [];
  
  // Ensure connectivity by creating a spanning tree
  for (let i = 1; i < nodeCount; i++) {
    const target = Math.floor(Math.random() * i);
    edges.push({ from: target, to: i });
  }
  
  // Add additional random edges
  const additionalEdges = Math.floor(Math.random() * nodeCount);
  for (let i = 0; i < additionalEdges; i++) {
    const from = Math.floor(Math.random() * nodeCount);
    const to = Math.floor(Math.random() * nodeCount);
    
    if (from !== to && !edges.some(e => 
      (e.from === from && e.to === to) || (e.from === to && e.to === from)
    )) {
      edges.push({ from, to });
    }
  }

  return { nodes, edges };
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}