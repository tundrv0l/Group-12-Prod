'''----------------- 
# Title: array_to_tree_solver.py
# Author: Michael Lowder
# Date: 3/15/2025
# Description: A solver for generating array representations to binary trees
-----------------'''

import networkx as nx
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import json

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def build_tree_from_table(input_data):
    """Builds a binary tree from left-child right-child table."""
    node_map = {}  
    edges = []  
    root_value = None  

    for line in input_data:
        parts = line.split()
        
        # Must have 3 parts: node, left_child, right_child
        if len(parts) != 3:
            continue
            
        node, left, right = parts
        
        if node not in node_map:
            node_map[node] = Node(node)
        if root_value is None:
            root_value = node  

        if left != '0':
            if left not in node_map:
                node_map[left] = Node(left)
            node_map[node].left = node_map[left]
            edges.append((node, left))

        if right != '0':
            if right not in node_map:
                node_map[right] = Node(right)
            node_map[node].right = node_map[right]
            edges.append((node, right))
    
    if root_value is None or root_value not in node_map:
        return None, []
        
    return node_map[root_value], edges

def add_edges(graph, root, pos, x=0, y=0, level=1):
    """Recursively add edges to the graph for visualization."""
    if root:
        pos[root.value] = (x, y)
        if root.left:
            graph.add_edge(root.value, root.left.value)
            add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
        if root.right:
            graph.add_edge(root.value, root.right.value)
            add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)

def draw_tree(root):
    """Draws the binary tree using networkx and matplotlib."""
    graph = nx.DiGraph()
    pos = {}
    add_edges(graph, root, pos)
    
    plt.figure(figsize=(8, 6))
    nx.draw(
        graph, 
        pos, 
        with_labels=True, 
        node_size=2000, 
        node_color="lightblue", 
        font_size=12, 
        font_weight='bold',
        edge_color="gray",
        arrows=True
    )
    
    # Save to base64 string
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png', dpi=120, bbox_inches='tight')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_data

def get_node_list(root):
    """Returns a list of all nodes in the tree using breadth-first traversal."""
    if not root:
        return []
        
    result = []
    queue = [root]
    
    while queue:
        node = queue.pop(0)
        result.append(node.value)
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
            
    return result

def get_table_representation(root):
    """Generates the table representation of the tree for display."""
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        node = queue.pop(0)
        
        # Add current node with its children
        left_val = node.left.value if node.left else "0"
        right_val = node.right.value if node.right else "0"
        result.append({
            "node": node.value,
            "leftChild": left_val,
            "rightChild": right_val
        })
        
        # Add children to the queue
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
            
    return result

def solve(input_data):
    """
    Convert an array representation of a binary tree to a tree structure
    
    Parameters:
    -----------
    input_data : str
        A string containing the table representation of the tree
    
    Returns:
    --------
    json : str
        JSON string containing the tree visualization and details
    """
    try:
        # Parse the input data
        tree_data = input_data.strip().split('\n')
        
        # Build tree and visualize
        root, edges = build_tree_from_table(tree_data)
        
        if root:
            # Generate tree visualization
            image_data = draw_tree(root)
            
            # Get table representation for display
            table_data = get_table_representation(root)
            
            # Return success with visualization
            result = {
                "success": True,
                "image": image_data,
                "nodes": get_node_list(root),
                "edges": edges,
                "table": table_data
            }
        else:
            result = {
                "success": False,
                "error": "Failed to build a valid tree. Check your input format."
            }
            
    except Exception as e:
        result = {
            "success": False,
            "error": f"An error occurred: {str(e)}"
        }
    
    return json.dumps(result)