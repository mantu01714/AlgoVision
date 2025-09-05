class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    this.root = this._insertNode(this.root, value);
  }

  _insertNode(node, value) {
    if (node === null) {
      return new TreeNode(value);
    }

    if (value < node.value) {
      node.left = this._insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._insertNode(node.right, value);
    }

    return node;
  }

  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }

  _deleteNode(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.value) {
      node.left = this._deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      node.value = this._findMinValue(node.right);
      node.right = this._deleteNode(node.right, node.value);
    }

    return node;
  }

  _findMinValue(node) {
    let minValue = node.value;
    while (node.left !== null) {
      minValue = node.left.value;
      node = node.left;
    }
    return minValue;
  }

  traverse(type) {
    const path = [];
    
    switch (type) {
      case 'inorder':
        this._inorderTraversal(this.root, path);
        break;
      case 'preorder':
        this._preorderTraversal(this.root, path);
        break;
      case 'postorder':
        this._postorderTraversal(this.root, path);
        break;
    }
    
    return path;
  }

  _inorderTraversal(node, path) {
    if (node !== null) {
      this._inorderTraversal(node.left, path);
      path.push(node.value);
      this._inorderTraversal(node.right, path);
    }
  }

  _preorderTraversal(node, path) {
    if (node !== null) {
      path.push(node.value);
      this._preorderTraversal(node.left, path);
      this._preorderTraversal(node.right, path);
    }
  }

  _postorderTraversal(node, path) {
    if (node !== null) {
      this._postorderTraversal(node.left, path);
      this._postorderTraversal(node.right, path);
      path.push(node.value);
    }
  }

  getVisualizationData() {
    return this.root;
  }

  clear() {
    this.root = null;
  }
}