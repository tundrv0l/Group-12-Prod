'''----------------- 
# Title: cartesian_product_solver.py
# Author: Michael Lowder
# Date: 3/14/2025
# Description: A solver for cartesian products and set operations.
-----------------'''

# -*- coding: utf-8 -*-
import math
import re
from fractions import Fraction
import cmath
import json

# empty_set = set()
# print(empty_set)


# "\u2205" = ∅ SAVE!!!!
#print("\u2205")  # Prints: ∅
char_mapping = {
    "a": "1",
    "b": "2",
    "c": "3",
    "d": "4",
    "e": "5",
    "f": "6",
    "g": "7",
    "h": "8",
    "i": "9",
    "j": "10",
    "k": "11",
    "l": "12",
    "m": "13",
    "n": "14",
    "o": "15",
    "p": "16",
    "q": "17",
    "r": "18",
    "s": "19",
    "t": "20",
    "u": "21",
    "v": "22",
    "w": "23",
    "x": "24",
    "y": "25",
    "z": "26",
    "\u2205": "∅" # "∅"
    # Add more mappings as needed
}
def replace_char(match):
    return char_mapping.get(match.group(0), match.group(0))  # Default to the same char if not found in mapping

# Mapping for numbers to characters (can be expanded as needed)
number_mapping = {
    "1": "a",
    "2": "b",
    "3": "c",
    "4": "d",
    "5": "e",
    "6": "f",
    "7": "g",
    "8": "h",
    "9": "i",
    "10": "j",
    "11": "k",
    "12": "l",
    "13": "m",
    "14": "n",
    "15": "o",
    "16": "p",
    "17": "q",
    "18": "r",
    "19": "s",
    "20": "t",
    "21": "u",
    "22": "v",
    "23": "w",
    "24": "x",
    "25": "y",
    "26": "z"
    # Add more mappings as needed
}

# Function to replace numbers with characters
def replace_numbers_with_chars(input_str):
    def replace_number(match):
        return number_mapping.get(match.group(0), match.group(0))  # Default to the same number if not found in mapping
    
    # Use regex to replace numbers based on the dictionary
    return re.sub(r'\d', replace_number, input_str)

# def format_set_output(generated_set, max_display=6):
#     """Formats the set output to include '...' for large sets."""
#     sorted_set = sorted(generated_set, key=lambda x: (x.real, x.imag) if isinstance(x, complex) else float(x))
    
#     if len(sorted_set) > max_display:
#         return f"{{{', '.join(map(str, sorted_set[:max_display//2]))}, ..., {', '.join(map(str, sorted_set[-max_display//2:]))}}}"
#     return f"{{{', '.join(map(str, sorted_set))}}}"

# Check if any element in B is close enough to sqrt(3)
# is_in_B = any(abs(sqrt_3 - x) < tolerance for x in B)

# print(f"Is sqrt(3) in B? {is_in_B}")

#print(1 < math.sqrt(3) < 50)

# Function to check if a number is a whole number (W)
# W = {1, 2, 3, 4, 5, ...} (Non-negative integers, including 0)
def is_whole_number(n):
    return isinstance(n, int) and n >= 0

# Function to check if a number is a natural number (N)
# N or ℕ = {1, 2, 3, ...} (Positive integers, counting numbers)
def is_natural_number(n):
    return isinstance(n, int) and n > 0

# Function to check if a number is an integer (Z)
# Z or ℤ = {..., -3, -2, -1, 0, 1, 2, 3, ...} (Includes negative and positive whole numbers)
def is_integer(n):
    return isinstance(n, int)

# Function to check if a number is a rational number (Q)
# Q or ℚ = {x | x = a/b, a, b ∈ Z and b ≠ 0} (Numbers that can be expressed as a fraction a/b)
def is_rational_number(n):
    if isinstance(n, int):
        return True  # All integers are rational numbers
    if isinstance(n, float):
        # Check if a float can be expressed as a fraction (rational)
        return not math.isnan(n) and math.isfinite(n)
    return False

# Function to check if a number is an irrational number (P)
# P or ℙ = {x | x ∉ Q} (Numbers that cannot be expressed as a fraction, e.g., π, e)
def is_irrational_number(n):
    # Known irrational numbers
    known_irrationals = {math.pi, math.e}
    
    # Check if the number is known to be irrational
    if n in known_irrationals:
        return True
    
    # If it's a float and not a rational number, we assume it's irrational
    if isinstance(n, float):
        return math.isfinite(n) and not is_rational_number(n)
    
    return False

# Function to check if a number is a real number (R)
# R or ℝ = {x | -∞ < x < ∞} (Includes all rational and irrational numbers)
def is_real_number(n):
    return isinstance(n, (int, float)) and not math.isnan(n)

# Function to check if a number is a complex number (C)
# C or ℂ = {z | z = a + bi, a, b ∈ R} (A combination of a real part and an imaginary part)
def is_complex_number(n):
    return isinstance(n, complex)

def parse_input(input_str):
    """Parses the input string to extract the domain and condition."""
    match = re.match(r"\{x\s*\|\s*x\s*∈\s*(\w+)\s+and\s+(.+)\}", input_str.strip())
    if match:
        domain, condition = match.groups()
        return domain, condition
    else:
        print("Invalid input format. Please use {x | x ∈ Domain and condition}.")
        return None, None

def preprocess_condition(condition):
    """Preprocesses the condition to replace '^' with '**' for correct Python syntax."""
    return condition.replace("^", "**")

def generate_set_from_builder(input_str, lower_bound=-100, upper_bound=100):
    domain, condition = parse_input(input_str)

    if domain is None or condition is None:
        return "{}"

    # Preprocess condition to replace '^' with '**'
    condition = preprocess_condition(condition)

    # Define the domain and range for generating numbers
    if domain == "N":  # Natural numbers
        numbers = range(1, upper_bound + 1)
    elif domain == "Z":  # Integers
        numbers = range(lower_bound, upper_bound + 1)
    elif domain == "Q":  # Rational numbers (fractions)
        # Generate rational numbers (fractions) between -100 and 100
        numbers = {Fraction(a, b) for a in range(lower_bound, upper_bound + 1) 
                           for b in range(1, upper_bound + 1) 
                           if lower_bound <= a / b <= upper_bound}
    elif domain == "R":  # Real numbers (simulated with floats)
        numbers = {x / 100.0 for x in range(lower_bound * 100, upper_bound * 100)}  # Higher precision
        print(numbers)
    elif domain == "C":  # Complex numbers (limited grid of points)
        numbers = {complex(a / 10, b / 10) for a in range(-10, 11) for b in range(-10, 11)}
    else:
        print(f"Unsupported domain: {domain}")
        return "{}"

    # Filter numbers based on the extracted condition
    try:
        # Evaluate the condition dynamically for each number
        generated_set = {x for x in numbers if eval(condition, {"x": x, "cmath": cmath, "math": math, "sqrt": math.sqrt, "abs": abs, "pow": pow})}
    except Exception as e:
        print(f"Error evaluating condition: {e}")
        return "{}"
    
    # frozen_generated_set = frozenset(generated_set)
    return frozenset(generated_set)

def replace_nested_sets(input_str):
    pattern = r"\{\{(.*?)\}\}"
    while re.search(pattern, input_str):
        input_str = re.sub(pattern, r"frozenset({\1})", input_str)
    return input_str

def parse_set(input_str):
    try:
        if not isinstance(input_str, str):
            raise ValueError("Input must be a string")
        if input_str is None:
            raise ValueError("Input cannot be None")

        input_str = input_str.strip()

        # Handle ∅ explicitly
        if input_str == "∅":
            return frozenset()

        # Replace ∅ inside expressions
        input_str = input_str.replace("∅", "frozenset()")

        # Don't quote keywords like frozenset, math, sqrt
        reserved_keywords = {"frozenset", "math", "sqrt", "pi"}

        def quote_var(match):
            word = match.group(0)
            return f"'{word}'" if word not in reserved_keywords else word

        # Quote any standalone word that isn't a reserved keyword
        input_str = re.sub(r'\b[a-zA-Z]+\b', quote_var, input_str)

        # Handle nested frozensets
        input_str = replace_nested_sets(input_str)
        input_str = input_str.replace("{", "frozenset({").replace("}", "})")

        parsed = eval(input_str, {"__builtins__": None, "frozenset": frozenset, "math": math, "sqrt": math.sqrt})

        if isinstance(parsed, set):
            parsed = frozenset(parsed)

        return parsed
    except Exception as e:
        print(f"Error parsing set: {e}")
        return frozenset()


def check_subset(A, B):
    # if A.isdigit():
    #     return False
    return A.issubset(B)

def check_proper_subset(A, B):
    return A < B

def check_element(x, A):
    return x in A

def check_equality(A, B):
    return A == B

def check_union(A, B):
    if isinstance(A, frozenset) and len(A) == 0:  # If A is empty
        return B
    if isinstance(B, frozenset) and len(B) == 0:  # If B is empty
        return A
    return A | B  # Regular union operation

def check_intersection(A, B):
    if isinstance(A, frozenset) and len(A) == 0:  # If A is empty
        return frozenset()
    if isinstance(B, frozenset) and len(B) == 0:  # If B is empty
        return frozenset()
    return A & B  # Regular intersection operation

def check_difference(A, B):
    if isinstance(A, frozenset) and len(A) == 0:  # If A is empty
        return frozenset()
    if isinstance(B, frozenset) and len(B) == 0:  # If B is empty
        return A  # A - ∅ should return A
    return A - B  # Regular difference operation


def check_cartesian_product(A, B):
    return frozenset((a, b) for a in A for b in B)



# Convert characters to numbers in frozensets
# sets = {
#     key: frozenset(char_mapping.get(x, x) for x in value)
#     for key, value in sets.items()
# }
# Define the universal set as the union of all sets

# Define operator precedence
PRECEDENCE = {
    "'": 4,  # Complement
    "×": 3,
    "∩": 2,
    "-": 2,
    "∪": 1,
    "=": 0
}

def convert_numbers_to_chars(frozenset_obj):
    # Apply the replace_char function to each number in the frozenset
    return frozenset(
        replace_char(re.match(r"\d+", str(x))) if isinstance(x, int) else x for x in frozenset_obj
    )

def tokenize(expression):
    tokens = re.findall(r"[A-Z]|\∪|\∩|-|×|=|'|\(|\)|∅", expression)
    return tokens

def infix_to_postfix(tokens):
    output = []
    operator_stack = []

    for i, token in enumerate(tokens):
        if token in sets or token == "∅":
            output.append(token)
        elif token == "(":
            operator_stack.append(token)
        elif token == ")":
            while operator_stack and operator_stack[-1] != "(":
                output.append(operator_stack.pop())
            operator_stack.pop()
        elif token == "'":
            # Postfix operator – immediately apply to previous operand
            output.append(token)
        else:  # Regular infix operators
            while (operator_stack and operator_stack[-1] != "(" and
                   PRECEDENCE[operator_stack[-1]] >= PRECEDENCE[token]):
                output.append(operator_stack.pop())
            operator_stack.append(token)

    while operator_stack:
        output.append(operator_stack.pop())

    return output


def evaluate_postfix(postfix_tokens):
    stack = []

    for token in postfix_tokens:
        if token in sets:
            stack.append(sets[token])
        elif token == "∅":
            stack.append(frozenset())
        elif token == "'":  # Complement
            a = stack.pop()
            result = universal_set - a
            stack.append(result)
        else:  # Binary operators
            b = stack.pop()
            a = stack.pop() if stack else None

            if token == "∪":
                result = a.union(b)
            elif token == "∩":
                result = a.intersection(b)
            elif token == "-":
                result = a.difference(b)
            elif token == "×":
                result = {(x, y) for x in a for y in b}
            elif token == "=":
                result = a == b

            stack.append(result)

    final_result = stack[0] if stack else None

    if isinstance(final_result, frozenset):
        return frozenset(
            replace_char(re.match(r"\d+", str(x))) if isinstance(x, int) else x
            for x in final_result
        )

    return final_result


def format_element(elem):
    if isinstance(elem, frozenset):
        return format_frozenset(elem)
    elif isinstance(elem, str):
        return elem
    elif isinstance(elem, float):
        # Format π nicely if close to math.pi
        return "π" if abs(elem - math.pi) < 1e-10 else str(elem)
    else:
        return str(elem)

def format_frozenset(fs):
    if not fs:
        return "∅"
    formatted_elements = sorted(format_element(e) for e in fs)
    return "{" + ", ".join(formatted_elements) + "}"

def solve(predefined_sets, predefined_statements):
    global sets
    global universal_set
    sets = {}

    # Handle predefined sets
    for name, set_input, set_format in predefined_sets:
        if name in sets:
            print(f"Set '{name}' already exists. Skipping duplicate.")
            continue

        if set_format == "1":
            sets[name] = parse_set(set_input)
        elif set_format == "2":
            sets[name] = generate_set_from_builder(set_input)
        else:
            print(f"Unknown set format '{set_format}' for set {name}. Skipping.")

    # Define universal set
    universal_set = frozenset().union(*sets.values())

    print("\nDefined Sets:")
    for name, value in sets.items():
        print(f"{name} = {format_frozenset(value)}")

    print(f"\nUniversal Set (U) = {format_frozenset(universal_set)}")

    # Evaluate predefined statements
    statements = []
    for expr in predefined_statements:
        try:
            tokens = tokenize(expr)
            postfix = infix_to_postfix(tokens)
            result = evaluate_postfix(postfix)
            statements.append((expr, result))
        except Exception as e:
            print(f"Error evaluating statement '{expr}': {e}")

    
    # Create a dictionary to store results
    results = {}
    for statement, result in statements:
        results.update({statement: result})
    
    return json.dumps(results)


sets_input = [
    ("A", "{a, b, c, d, e}", "1"),
    ("B", "{a, b, c}", "1"),
    ("C", "{a, b, c, d, e, f, g, h, i, j}", "1")
]

statements_input = [
    "A ∩ (B' ∩ C)'"
]

solve(sets_input, statements_input)
