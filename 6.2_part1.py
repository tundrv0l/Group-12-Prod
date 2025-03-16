#Chapter 6.2 
#Part 1
from collections import deque
import re
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64
def solve (input, choice):

    class Node:
        def __init__(self, value):
            self.value = value
            self.left = None
            self.right = None

    def build_tree_from_input(input_str):
        """Builds a binary tree from level-order user input."""
        # values = input("Enter node values in level order (use 'None' for empty nodes, separated by spaces): ").split(',')
        values = input_str.split() # .split(',')
        # values = [v.strip() for v in values]

        if not values or values[0] == 'None':
            return None
        
        root = Node(values[0])
        queue = deque([root])
        i = 1

        while i < len(values):
            current = queue.popleft()

            # Left child
            if values[i] != 'None':
                current.left = Node(values[i])
                queue.append(current.left)
            i += 1

            # Right child
            if i < len(values) and values[i] != 'None':
                current.right = Node(values[i])
                queue.append(current.right)
            i += 1

        return root

    def add_edges(graph, root, pos, x=0, y=0, level=1):
        """Recursively add edges to the graph."""
        if root:
            pos[root.value] = (x, y)
            if root.left:
                graph.add_edge(root.value, root.left.value)
                add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
            if root.right:
                graph.add_edge(root.value, root.right.value)
                add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)

    def draw_tree(root):
        """Draws a binary tree using networkx and matplotlib."""
        graph = nx.DiGraph()
        pos = {}
        add_edges(graph, root, pos)
        plt.figure(figsize=(6, 4))
        nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
        plt.title("Graph Visualization")
        img_buf = BytesIO()
        plt.savefig(img_buf, format='png')
        img_buf.seek(0)
        img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
        print(img_data)
        plt.close()
        return img_data
        #plt.show()

    # print("Choose Input Method:")
    # print("1. Regular")
    # print("2. Mathematical Expressions")
    
    # choice = int(input("Enter choice (1/2): "))

    # --------------Mathematical Expressions-----------------

    def tokenize(expression):
        """Tokenizes an expression, handling implicit multiplication."""
        expression = expression.replace(" ", "")
        
        # Handle implicit multiplication: 3(x+y) → 3*(x+y)
        expression = re.sub(r'(\d)([a-zA-Z(])', r'\1*\2', expression)
        expression = re.sub(r'(\))(\d|[a-zA-Z])', r'\1*\2', expression)

        # Tokenize: Match numbers, variables, operators, and parentheses
        tokens = re.findall(r'\d+|[a-zA-Z]+|[+\-*/^()]', expression)
        
        print("Tokenized Expression:", tokens)
        return tokens

    def precedence(op):
        """Returns precedence of operators."""
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
                stack.pop()  # Remove '('
            else:  # Operator
                while stack and precedence(stack[-1]) >= precedence(token):
                    output.append(stack.pop())
                stack.append(token)

        while stack:
            output.append(stack.pop())

        #print("Postfix Expression:", output)
        return output

    def build_expression_tree(postfix_tokens):
        """Builds an expression tree from postfix notation."""
        stack = []

        for token in postfix_tokens:
            node = Node(token)

            if token in "+-*/^":  # Operator
                if len(stack) < 2:
                    print(f"Error: Not enough operands for operator '{token}'")
                    return None

                node.right = stack.pop()  # First pop is right child
                node.left = stack.pop()   # Second pop is left child

            stack.append(node)

        if len(stack) != 1:
            print("Error: Invalid postfix expression. Stack:", [n.value for n in stack])
            return None

        print("Expression tree successfully built!")
        return stack[0]


    def print_tree(node, level=0, side="Root"):
        """Recursively prints the tree structure."""
        if node:
            print("  " * level + f"{side}: {node.value}")
            print_tree(node.left, level + 1, "L")
            print_tree(node.right, level + 1, "R")

    def add_edges2(graph, node, pos, node_ids, x=0, y=0, level=1, x_spacing=1.5):
        """Recursively adds edges to the graph and positions nodes uniquely."""
        if node:
            node_id = node_ids[node]  # Get the unique ID for this node
            pos[node_id] = (x, y)  # Assign position
            
            if node.left:
                left_id = node_ids[node.left]
                graph.add_edge(node_id, left_id)
                add_edges2(graph, node.left, pos, node_ids, x - x_spacing / (2 ** level), y - 1, level + 1, x_spacing)

            if node.right:
                right_id = node_ids[node.right]
                graph.add_edge(node_id, right_id)
                add_edges2(graph, node.right, pos, node_ids, x + x_spacing / (2 ** level), y - 1, level + 1, x_spacing)

    def draw_expression_tree(root):
        """Draws the binary expression tree with correct alignment."""
        if not root:
            print("No tree to draw.")
            return

        graph = nx.DiGraph()
        pos = {}

        # Assign unique node identifiers using their object reference
        node_ids = {}
        def assign_ids(node, count=[0]):  # Use a mutable default argument to keep track
            if node:
                node_ids[node] = f"{node.value}_{count[0]}"  # Create a unique ID
                count[0] += 1
                assign_ids(node.left, count)
                assign_ids(node.right, count)

        assign_ids(root)  # Assign unique IDs before drawing

        add_edges2(graph, root, pos, node_ids)

        # Create a mapping for labels, stripping the unique ID from display
        labels = {node_ids[n]: n.value for n in node_ids}

        plt.figure(figsize=(8, 5))
        nx.draw(graph, pos, labels=labels, 
                with_labels=True, node_size=2000, node_color="lightblue", 
                font_size=10, edge_color="gray")

        print("Displaying expression tree...")
        plt.title("Graph Visualization")
        img_buf = BytesIO()
        plt.savefig(img_buf, format='png')
        img_buf.seek(0)
        img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
        print(img_data)
        plt.close()
        return img_data
        #plt.show(block=True)

    if choice == 1:
        expression = ""
        root = build_tree_from_input(input)
        if root:
            draw_tree(root)
        else:
            print("Tree is empty.")
    elif choice == 2:
        tokens = tokenize(input)
        postfix_tokens = to_postfix(tokens)
        root = build_expression_tree(postfix_tokens)

        if root:
            print("\nExpression Tree Structure:")
            #print_tree(root)  # Debugging: Print tree structure
            draw_expression_tree(root)
        else:
            print("Failed to build expression tree.")

input = ("A B C D E None F")
choice = 1
# expression = ""
solve(input, choice)
input = "2+(3+5-7)"
choice = 2
solve(input, choice)


#----------------------NOTES------------------------

#Chapter 6.2 
#Part 1
# from collections import deque
# import networkx as nx
# import matplotlib.pyplot as plt
# def solve (input):

#     # class Node:
#     #     def __init__(self, value):
#     #         self.value = value
#     #         self.left = None
#     #         self.right = None

#     # def add_edges(graph, root, pos, x=0, y=0, level=1):
#     #     """Recursively add edges to the graph."""
#     #     if root:
#     #         pos[root.value] = (x, y)
#     #         if root.left:
#     #             graph.add_edge(root.value, root.left.value)
#     #             add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
#     #         if root.right:
#     #             graph.add_edge(root.value, root.right.value)
#     #             add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)

#     # def draw_tree(root):
#     #     """Draws a binary tree using networkx and matplotlib."""
#     #     graph = nx.DiGraph()
#     #     pos = {}
#     #     add_edges(graph, root, pos)
#     #     plt.figure(figsize=(6, 4))
#     #     nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
#     #     plt.show()

#     # # # Define the tree:
#     # # root = Node(1)
#     # # root.left = Node(2)
#     # # root.right = Node(3)
#     # # root.left.left = Node(4)
#     # # root.left.right = Node(5)
#     # # root.right.right = Node(6)

#     # # # Draw the tree:
#     # # draw_tree(root)

    


#     class Node:
#         def __init__(self, value):
#             self.value = value
#             self.left = None
#             self.right = None

#     def build_tree_from_input(input_str):
#         """Builds a binary tree from level-order user input."""
#         # values = input("Enter node values in level order (use 'None' for empty nodes, separated by commas): ").split(',')
#         values = input_str.split(',')
#         values = [v.strip() for v in values]

#         if not values or values[0] == 'None':
#             return None
        
#         root = Node(values[0])
#         queue = deque([root])
#         i = 1

#         while i < len(values):
#             current = queue.popleft()

#             # Left child
#             if values[i] != 'None':
#                 current.left = Node(values[i])
#                 queue.append(current.left)
#             i += 1

#             # Right child
#             if i < len(values) and values[i] != 'None':
#                 current.right = Node(values[i])
#                 queue.append(current.right)
#             i += 1

#         return root

#     def add_edges(graph, root, pos, x=0, y=0, level=1):
#         """Recursively add edges to the graph."""
#         if root:
#             pos[root.value] = (x, y)
#             if root.left:
#                 graph.add_edge(root.value, root.left.value)
#                 add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
#             if root.right:
#                 graph.add_edge(root.value, root.right.value)
#                 add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)

#     def draw_tree(root):
#         """Draws a binary tree using networkx and matplotlib."""
#         graph = nx.DiGraph()
#         pos = {}
#         add_edges(graph, root, pos)
#         plt.figure(figsize=(6, 4))
#         nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
#         plt.show()

#     # Example Usage:
#     root = build_tree_from_input(input)
#     if root:
#         draw_tree(root)
#     else:
#         print("Tree is empty.")

# input = ("A, B, C, D, E, None, F")
# solve(input)