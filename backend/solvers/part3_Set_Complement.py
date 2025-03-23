from sympy import Interval, Union, S, Complement, Symbol

# Function to find the complement of a set
def find_complement(universal_set, subset):
    complement = universal_set - subset
    return complement

# Function to convert intervals and unions to string
def interval_to_str(interval):
    if isinstance(interval, Interval):
        left = '(' if interval.left_open else '['
        right = ')' if interval.right_open else ']'
        a = '-oo' if interval.start == S.NegativeInfinity else interval.start
        b = 'oo' if interval.end == S.Infinity else interval.end
        return f"{left}{a}, {b}{right}"
    elif isinstance(interval, Union):
        return " U ".join(interval_to_str(arg) for arg in interval.args)
    else:
        return str(interval)

# Function to find complement in real numbers
def find_complement_real(subset):
    universal_set = S.Reals  # Symbolic representation of ℝ
    complement = Complement(universal_set, subset)
    return complement

# Function to handle symbolic characters and automatically convert to Symbol
def create_set_from_input(input_str):
    # Remove the curly braces and split by commas
    cleaned_input = input_str.strip('{}').replace(' ', '')  # Remove spaces if any
    chars = cleaned_input.split(',')
    
    # Convert the characters into a set of Symbols
    return {Symbol(c) for c in chars}

# Function to sort the set of symbols and replace square brackets with curly braces
def sorted_set(symbol_set):
    sorted_symbols = sorted(symbol_set, key=lambda x: str(x))
    return "{" + ", ".join(str(x) for x in sorted_symbols) + "}"

# Main function to solve the problem
def solve(U, A):
    complement_A = find_complement(U, A)
    
    # Sort the result before printing and replace square brackets with curly braces
    print("Complement of A:", sorted_set(complement_A))

    B = Union(Interval(2, 5), Interval(7, S.Infinity))
    complement_B = Complement(S.Reals, B)

    # Format and print the complement of B
    print("Complement of B:", interval_to_str(complement_B))

# Example Usage: Set with symbolic elements in "{a, b, c, d, e}" format
U = "{a, a, a, a, a}"
A = "{∅}"
U = create_set_from_input(U)  # Universal set with symbolic elements 'a', 'b', 'c', 'd', 'e'
A = create_set_from_input(A)        # Subset with symbolic elements 'a', 'b', 'c'
print(sorted_set(U))
print(sorted_set(A))
solve(U, A)
