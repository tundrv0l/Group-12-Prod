'''----------------- 
# Title: binary_tree_notation_solver.py
# Author: Michael Lowder (Reorganized)
# Date: 3/15/2025
# Description: A solver for binary tree notations and representations
-----------------'''

import re
import networkx as nx
import matplotlib.pyplot as plt
from collections import deque
from io import BytesIO
import base64
import json


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def build_tree_from_level_order(input_str):
    """Builds a binary tree from level-order user input."""
    values = input_str.split()
    
    if not values or values[0] == 'None':
        return None, {}

    root = Node(values[0])
    queue = deque([root])
    i = 1
    nodes = {values[0]: root}  # Map values to nodes

    while i < len(values):
        current = queue.popleft()

        # Left child
        if i < len(values):
            if values[i] != 'None':
                current.left = Node(values[i])
                nodes[values[i]] = current.left
                queue.append(current.left)
            i += 1

        # Right child
        if i < len(values):
            if values[i] != 'None':
                current.right = Node(values[i])
                nodes[values[i]] = current.right
                queue.append(current.right)
            i += 1

    return root, nodes

def build_tree_from_table(input_data):
    """Builds a binary tree from left-child right-child table."""
    node_map = {}  
    edges = []  
    root_value = None  

    lines = input_data.strip().split('\n')
    for line in lines:
        try:
            node, left, right = line.split()
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
        except Exception as e:
            print(f"Error processing input line '{line}': {e}")
            continue

    if not root_value or root_value not in node_map:
        return None, {}
        
    return node_map[root_value], node_map

def build_tree_from_pre_in(preorder, inorder):
    """Builds a binary tree from preorder and inorder traversals."""
    if not preorder or not inorder:
        return None

    # Convert to mutable lists if they're not already
    if isinstance(preorder, str):
        preorder = preorder.split()
    if isinstance(inorder, str):
        inorder = inorder.split()
        
    preorder_values = preorder.copy()  # Create copies to avoid modifying originals
    inorder_values = inorder.copy()
    
    def build_tree(pre, ino):
        if not pre or not ino:
            return None

        root_value = pre.pop(0)
        root = Node(root_value)
        
        try:
            index = ino.index(root_value)
            
            # Recursively build left and right subtrees
            root.left = build_tree(pre, ino[:index])
            root.right = build_tree(pre, ino[index+1:])
        except ValueError:
            # Handle case where value isn't found in inorder traversal
            return root
            
        return root
    
    root = build_tree(preorder_values, inorder_values)
    
    # Build the nodes dictionary
    nodes = {}
    def collect_nodes(node):
        if node:
            nodes[node.value] = node
            collect_nodes(node.left)
            collect_nodes(node.right)
    
    collect_nodes(root)
    return root, nodes

def build_tree_from_post_in(postorder, inorder):
    """Builds a binary tree from postorder and inorder traversals."""
    if not postorder or not inorder:
        return None

    # Convert to mutable lists if they're not already
    if isinstance(postorder, str):
        postorder = postorder.split()
    if isinstance(inorder, str):
        inorder = inorder.split()
        
    postorder_values = postorder.copy()
    inorder_values = inorder.copy()
    
    def build_tree(post, ino):
        if not post or not ino:
            return None

        root_value = post.pop()
        root = Node(root_value)
        
        try:
            index = ino.index(root_value)
            
            # Note the order: right subtree first when using postorder
            root.right = build_tree(post, ino[index+1:])
            root.left = build_tree(post, ino[:index])
        except ValueError:
            # Handle case where value isn't found in inorder traversal
            return root
            
        return root
    
    root = build_tree(postorder_values, inorder_values)
    
    # Build the nodes dictionary
    nodes = {}
    def collect_nodes(node):
        if node:
            nodes[node.value] = node
            collect_nodes(node.left)
            collect_nodes(node.right)
    
    collect_nodes(root)
    return root, nodes

def tokenize(expression):
    """Tokenizes a mathematical expression, handling implicit multiplication."""
    expression = expression.replace(" ", "")
    
    # Handle implicit multiplication: 3(x+y) → 3*(x+y)
    expression = re.sub(r'(\d)([a-zA-Z(])', r'\1*\2', expression)
    expression = re.sub(r'(\))(\d|[a-zA-Z])', r'\1*\2', expression)

    # Tokenize: Match numbers, variables, operators, and parentheses
    tokens = re.findall(r'\d+|[a-zA-Z]+|[+\-*/^()]', expression)
    
    return tokens

def precedence(op):
    """Returns the precedence value of operators."""
    return {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}.get(op, 0)

def to_postfix(tokens):
    """Converts infix expression to postfix notation (Reverse Polish Notation)."""
    output = []
    stack = []

    for token in tokens:
        if token.isalnum():  # Operand (number or variable)
            output.append(token)
        elif token == '(':
            stack.append(token)
        elif token == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            if stack:  # Remove '('
                stack.pop()  
        else:  # Operator
            while stack and stack[-1] != '(' and precedence(stack[-1]) >= precedence(token):
                output.append(stack.pop())
            stack.append(token)

    while stack:
        output.append(stack.pop())

    return output

def build_expression_tree(postfix_tokens):
    """Builds an expression tree from postfix notation."""
    stack = []
    nodes = {}

    for token in postfix_tokens:
        node = Node(token)
        
        if token in "+-*/^":  # Operator
            if len(stack) < 2:
                return None, {}
                
            node.right = stack.pop()  # First pop is right child
            node.left = stack.pop()   # Second pop is left child
            
        nodes[token] = node
        stack.append(node)

    if len(stack) != 1:
        return None, {}

    # Complete the nodes dictionary to include all nodes in the tree
    complete_nodes = {}
    def traverse_and_collect(node):
        if node:
            complete_nodes[node.value] = node
            traverse_and_collect(node.left)
            traverse_and_collect(node.right)
    
    traverse_and_collect(stack[0])
    
    return stack[0], complete_nodes


def preorder_traversal(root):
    """Returns the preorder traversal of the tree."""
    return [root.value] + preorder_traversal(root.left) + preorder_traversal(root.right) if root else []

def inorder_traversal(root):
    """Returns the inorder traversal of the tree."""
    return inorder_traversal(root.left) + [root.value] + inorder_traversal(root.right) if root else []

def postorder_traversal(root):
    """Returns the postorder traversal of the tree."""
    return postorder_traversal(root.left) + postorder_traversal(root.right) + [root.value] if root else []

def level_order_traversal(root):
    """Returns the level-order traversal of the tree."""
    if not root:
        return []
        
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.value)
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
            
    return result

#------------------
# VISUALIZATION METHODS
#------------------

def add_edges(graph, root, pos, x=0, y=0, level=1):
    """Recursively adds edges to the graph for visualization."""
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
    if not root:
        return None
        
    graph = nx.DiGraph()
    pos = {}
    add_edges(graph, root, pos)
    plt.figure(figsize=(6, 4))
    nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
    plt.title("Binary Tree Visualization")
    
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_data

def add_edges_for_expression_tree(graph, node, pos, node_ids, x=0, y=0, level=1, x_spacing=1.5):
    """Recursively adds edges to the graph for expression tree visualization."""
    if node:
        node_id = node_ids[node]
        pos[node_id] = (x, y)
        
        if node.left:
            left_id = node_ids[node.left]
            graph.add_edge(node_id, left_id)
            add_edges_for_expression_tree(graph, node.left, pos, node_ids, x - x_spacing / (2 ** level), y - 1, level + 1, x_spacing)
        
        if node.right:
            right_id = node_ids[node.right]
            graph.add_edge(node_id, right_id)
            add_edges_for_expression_tree(graph, node.right, pos, node_ids, x + x_spacing / (2 ** level), y - 1, level + 1, x_spacing)

def draw_expression_tree(root):
    """Draws the binary expression tree with correct alignment."""
    if not root:
        return None
    
    graph = nx.DiGraph()
    pos = {}
    
    # Assign unique node identifiers
    node_ids = {}
    def assign_ids(node, count=[0]):
        if node:
            node_ids[node] = f"{node.value}_{count[0]}"
            count[0] += 1
            assign_ids(node.left, count)
            assign_ids(node.right, count)
    
    assign_ids(root)
    
    add_edges_for_expression_tree(graph, root, pos, node_ids)
    
    # Create label mapping
    labels = {node_ids[n]: n.value for n in node_ids}
    
    plt.figure(figsize=(8, 5))
    nx.draw(graph, pos, labels=labels, 
            with_labels=True, node_size=2000, node_color="lightblue", 
            font_size=10, edge_color="gray")
    
    plt.title("Expression Tree Visualization")
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_data

def generate_child_array(nodes):
    """Generates the left child-right child representation."""
    sorted_keys = sorted(nodes.keys())
    child_array = []

    for key in sorted_keys:
        node = nodes[key]
        left = node.left.value if node.left else 0  # 0 represents NULL
        right = node.right.value if node.right else 0
        child_array.append((key, left, right))

    return child_array


def build_tree_from_input(input_str, input_format):
    """
    Build a tree from a given input format.
    
    Parameters:
    -----------
    input_str : str
        The input string representing the tree
    input_format : str
        The format of the input, one of:
        - 'level': Level-order traversal (e.g., "A B C D None E F")
        - 'table': Left-child right-child table (e.g., "A B C\nB D E\n...")
        - 'math': Mathematical expression (e.g., "3*(x+4)")
        
    Returns:
    --------
    tuple
        (root, nodes, tree_type) - The root node, the node dictionary, and the tree type
    """
    root = None
    nodes = {}
    tree_type = "regular_tree"
    
    try:
        if input_format == 'level':
            root, nodes = build_tree_from_level_order(input_str)
            
        elif input_format == 'table':
            root, nodes = build_tree_from_table(input_str)
            
        elif input_format == 'math':
            tokens = tokenize(input_str)
            postfix_tokens = to_postfix(tokens)
            root, nodes = build_expression_tree(postfix_tokens)
            tree_type = "expression_tree"
            
        else:
            raise ValueError(f"Unknown input format: {input_format}")
            
        return root, nodes, tree_type
        
    except Exception as e:
        print(f"Error building tree: {e}")
        return None, {}, tree_type

def reconstruct_tree_from_traversals(traversal1, traversal2, traversal_types):
    """
    Reconstruct a tree from a pair of traversals.
    
    Parameters:
    -----------
    traversal1 : str
        The first traversal string
    traversal2 : str
        The second traversal string (should be inorder)
    traversal_types : str
        The combination of traversals, one of:
        - 'preorder_inorder': First traversal is preorder, second is inorder
        - 'postorder_inorder': First traversal is postorder, second is inorder
        
    Returns:
    --------
    tuple
        (root, nodes, tree_type) - The root node, the node dictionary, and the tree type
    """
    root = None
    nodes = {}
    tree_type = "regular_tree"
    
    try:
        if traversal_types == 'preorder_inorder':
            root, nodes = build_tree_from_pre_in(traversal1, traversal2)
            
        elif traversal_types == 'postorder_inorder':
            root, nodes = build_tree_from_post_in(traversal1, traversal2)
            
        else:
            raise ValueError(f"Unknown traversal type combination: {traversal_types}")
            
        return root, nodes, tree_type
        
    except Exception as e:
        print(f"Error reconstructing tree: {e}")
        return None, {}, tree_type

def process_tree_result(root, nodes, tree_type):
    """
    Process a tree to generate standard output format.
    
    Parameters:
    -----------
    root : Node
        The root node of the tree
    nodes : dict
        Dictionary of all nodes in the tree
    tree_type : str
        The type of tree ('regular_tree' or 'expression_tree')
        
    Returns:
    --------
    dict
        Results dictionary with success, image, traversals, and array representation
    """
    if not root:
        return {
            "success": False,
            "error": "Failed to build or reconstruct tree. Check your input."
        }
    
    # Visualize tree
    image_data = draw_expression_tree(root) if tree_type == "expression_tree" else draw_tree(root)
    
    # Get traversals
    traversals = {
        "preorder": preorder_traversal(root),
        "inorder": inorder_traversal(root),
        "postorder": postorder_traversal(root),
        "levelOrder": level_order_traversal(root)
    }
    
    # Generate array representation
    array_repr = []
    if nodes:
        child_array = generate_child_array(nodes)
        array_repr = [{"node": node, "leftChild": left, "rightChild": right} 
                     for node, left, right in child_array]
    
    return {
        "success": True,
        "type": tree_type,
        "image": image_data,
        "traversals": traversals,
        "arrayRepresentation": array_repr
    }

def solve(input1, input2, operation):
    """
    Unified solver function for all tree operations.
    
    Parameters:
    -----------
    input1 : str
        Primary input string
    input2 : str
        Secondary input string (may be empty depending on operation)
    operation : str
        The operation to perform, one of:
        - 'build_from_level': Build tree from level-order input
        - 'build_from_table': Build tree from left-child right-child table
        - 'build_from_math': Build tree from mathematical expression
        - 'reconstruct_from_preorder': Reconstruct tree from preorder+inorder
        - 'reconstruct_from_postorder': Reconstruct tree from postorder+inorder
        
    Returns:
    --------
    str
        JSON string containing the operation results
    """
    try:
        # Determine which operation to perform
        if operation == 'build_from_level':
            root, nodes, tree_type = build_tree_from_input(input1, 'level')
            
        elif operation == 'build_from_table':
            root, nodes, tree_type = build_tree_from_input(input1, 'table')
            
        elif operation == 'build_from_math':
            root, nodes, tree_type = build_tree_from_input(input1, 'math')
            
        elif operation == 'reconstruct_from_preorder':
            root, nodes, tree_type = reconstruct_tree_from_traversals(input1, input2, 'preorder_inorder')
            
        elif operation == 'reconstruct_from_postorder':
            root, nodes, tree_type = reconstruct_tree_from_traversals(input1, input2, 'postorder_inorder')
            
        else:
            return json.dumps({
                "success": False,
                "error": f"Unknown operation: {operation}"
            })
        
        # Process results
        result = process_tree_result(root, nodes, tree_type)
        return json.dumps(result)
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": f"An error occurred: {str(e)}"
        })

# Legacy interface for backwards compatibility
def solve_legacy(input1, input2, choice):
    """Legacy solver function to maintain backwards compatibility."""
    try:
        # Map numeric choice to string operation
        operation_map = {
            1: 'build_from_level',
            2: 'build_from_table',
            3: 'reconstruct_from_preorder',
            4: 'reconstruct_from_postorder',
            5: 'build_from_math'
        }
        
        operation = operation_map.get(choice, None)
        if operation is None:
            return json.dumps({
                "success": False,
                "error": f"Invalid choice. Must be between 1 and 5."
            })
            
        return solve(input1, input2, operation)
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": f"An error occurred: {str(e)}"
        })