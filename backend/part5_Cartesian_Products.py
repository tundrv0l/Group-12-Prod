# Cartesian Products

# -*- coding: utf-8 -*-
import math
import re
from fractions import Fraction
import cmath

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
        # Ensure input is a string
        if not isinstance(input_str, str):
            raise ValueError("Input must be a string")

        # Ensure input_str is not None
        if input_str is None:
            raise ValueError("Input cannot be None")
        input_str = input_str.replace("π", "pi").replace("pi", "math.pi")
        # # Remove any unexpected non-ASCII characters (optional safety measure)
        # input_str = re.sub(r'[^\x00-\x7F]+', '', input_str)
        # Replace characters using the mapping dictionary
        
        
        # Use regex to replace characters based on the dictionary
        
        input_str = re.sub(r'[a-zA-Z]', replace_char, input_str)
        # Replace ∅ safely before Python tries to parse it
        input_str = input_str.replace("\u2205", "frozenset()")
        # Print the input string after replacements (for debugging)
        print(f"After replacements: {input_str}")
        # Remove any unexpected non-ASCII characters (optional safety measure)
        input_str = re.sub(r'[^a-zA-Z0-9\+\-\*/\(\)\[\]\{\}\.\^=,]', '', input_str)
        input_str = replace_nested_sets(input_str)
        input_str = input_str.replace("{", "frozenset({").replace("}", "})")
        parsed = eval(input_str, {"__builtins__": None, "math": math, "frozenset": frozenset, "sqrt": math.sqrt, "pi": math.pi})
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

# Choose input format
original_sets = {}  # To keep track of original inputs
sets = {}
while True:
    
    name = input("Enter a name for the set (or type 'done' to stop adding sets): ").strip()
    if not name:
        print("Set name cannot be empty.")
        continue
    if name.lower() == "done":
        break
    if name in sets:
        print(f"Set '{name}' already exists.")
        continue
    set_format = input("Choose input format (1 for regular set, 2 for set builder): ").strip()
    if set_format == "1":
        set_input = input(f"Enter elements for {name} (e.g., {{1, 2, 3}} or {{ {1, 3, 'pi'}, 1 }})): ").strip()
        if not set_input:
            print("Set cannot be empty.")
            continue
        sets[name] = parse_set(set_input)
    elif set_format == "2":
        set_input = input(f"Enter elements for {name} in set builder format (e.g., {{x | x ∈ Z and x^2 > 625}}): ").strip()
        if not set_input:
            print("Set cannot be empty.")
            continue
        sets[name] = generate_set_from_builder(set_input)

original_sets = {k: v.copy() for k, v in sets.items()}  # Save original state

# Convert characters to numbers in frozensets
sets = {
    key: frozenset(char_mapping.get(x, x) for x in value)
    for key, value in sets.items()
}
# Define the universal set as the union of all sets
universal_set = frozenset().union(*sets.values())

print("\nDefined Sets:")
for name, value in sets.items():
    print(f"{name} = {value}")

print(f"\nUniversal Set (U) = {universal_set}")

# Define operator precedence
PRECEDENCE = {
    "∪": 1,   # Union
    "∩": 2,   # Intersection
    "-": 2,   # Difference
    "×": 3,   # Cartesian product
    "=": 0    # Equality (lowest precedence)
}

def convert_numbers_to_chars(frozenset_obj):
    # Apply the replace_char function to each number in the frozenset
    return frozenset(
        replace_char(re.match(r"\d+", str(x))) if isinstance(x, int) else x for x in frozenset_obj
    )

def tokenize(expression):
    """
    Tokenizes the input expression into sets, operators, and parentheses.
    """
    tokens = re.findall(r"[A-Z]|\∪|\∩|-|×|=|\(|\)|∅", expression)
    return tokens

def infix_to_postfix(tokens):
    """
    Converts an infix expression (tokens) to postfix using the Shunting-Yard algorithm.
    """
    output = []
    operator_stack = []

    for token in tokens:
        if token in sets or token == "∅":  # Set names or empty set
            output.append(token)
        elif token == "(":
            operator_stack.append(token)
        elif token == ")":
            while operator_stack and operator_stack[-1] != "(":
                output.append(operator_stack.pop())
            operator_stack.pop()  # Remove the "("
        else:  # Operators
            while (operator_stack and operator_stack[-1] != "(" and
                   PRECEDENCE[operator_stack[-1]] >= PRECEDENCE[token]):
                output.append(operator_stack.pop())
            operator_stack.append(token)

    while operator_stack:
        output.append(operator_stack.pop())

    return output

def evaluate_postfix(postfix_tokens):
    """
    Evaluates a postfix expression and selectively converts numbers back into characters.
    """
    stack = []

    for token in postfix_tokens:
        if token in sets:
            stack.append(sets[token])
        elif token == "∅":
            stack.append(frozenset())
        else:  # Operators
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
                result = a == b  # Boolean comparison

            stack.append(result)

    final_result = stack[0] if stack else None

    # Convert back only if it was originally a character
    if isinstance(final_result, frozenset):
        converted_result = frozenset(
            replace_char(re.match(r"\d+", str(x))) if isinstance(x, int) else x for x in final_result
        )
        return converted_result

    return final_result

statements = []

while True:
    expr = input("\nEnter a statement to check or type 'done' to finish: ").strip()
    if expr.lower() == "done":
        break

    try:
        tokens = tokenize(expr)
        postfix = infix_to_postfix(tokens)
        result = evaluate_postfix(postfix)
        statements.append((expr, result))
    except Exception as e:
        print(f"Error evaluating statement: {e}")

print("\nResults:")
for statement, result in statements:
    print(f"{statement}: {result}")