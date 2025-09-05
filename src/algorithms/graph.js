export class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }

  addEdge(node1, node2) {
    if (this.adjacencyList.has(node1) && this.adjacencyList.has(node2)) {
      this.adjacencyList.get(node1).push(node2);
      this.adjacencyList.get(node2).push(node1);
    }
  }

  bfs(startNode) {
    const steps = [];
    const visited = new Set();
    const queue = [startNode];
    visited.add(startNode);

    steps.push({ node: startNode, visited: [startNode], edge: null });

    while (queue.length > 0) {
      const currentNode = queue.shift();
      const neighbors = this.adjacencyList.get(currentNode) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          steps.push({ 
            node: neighbor, 
            visited: Array.from(visited),
            edge: `${Math.min(currentNode, neighbor)}-${Math.max(currentNode, neighbor)}`
          });
        }
      }
    }

    return steps;
  }

  dfs(startNode) {
    const steps = [];
    const visited = new Set();

    const dfsHelper = (node, parent = null) => {
      visited.add(node);
      steps.push({ 
        node, 
        visited: Array.from(visited),
        edge: parent !== null ? `${Math.min(parent, node)}-${Math.max(parent, node)}` : null
      });

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor, node);
        }
      }
    };

    dfsHelper(startNode);
    return steps;
  }

  getVisualizationData() {
    const nodes = Array.from(this.adjacencyList.keys()).map(id => ({ id }));
    const edges = [];
    const processedEdges = new Set();

    for (const [node, neighbors] of this.adjacencyList) {
      for (const neighbor of neighbors) {
        const edgeKey = `${Math.min(node, neighbor)}-${Math.max(node, neighbor)}`;
        if (!processedEdges.has(edgeKey)) {
          edges.push({ from: node, to: neighbor });
          processedEdges.add(edgeKey);
        }
      }
    }

    return { nodes, edges };
  }

  clear() {
    this.adjacencyList.clear();
  }
}