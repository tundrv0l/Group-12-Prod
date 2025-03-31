'''----------------- 
# Title: power_set_solver.py
# Author: Michael Lowder
# Date: 3/15/2025
# Description: A solver for finding power sets.
-----------------'''


import re
from itertools import chain, combinations
import json

har_mapping = {
    "\u2205": "∅"
}

def replace_char(match):
    return har_mapping.get(match.group(0), match.group(0))

def power_set(iterable):
    s = list(iterable)
    return list(chain.from_iterable(combinations(s, r) for r in range(len(s) + 1)))

def format_math_set(obj):
    """Recursively format the set/tuple structure into mathematical set notation."""
    if isinstance(obj, frozenset):
        if len(obj) == 0:
            return '∅'
        else:
            return '{' + ', '.join(sorted([format_math_set(elem) for elem in obj], key=lambda x: (x.count('{'), x))) + '}'
    if isinstance(obj, (set, tuple, list)):
        if len(obj) == 0:
            return '∅'
        inner = ", ".join(sorted(format_math_set(item) for item in obj))
        return f"{{{inner}}}"
    else:
        return str(obj)

def parse_set_notation(s):
    s = s.replace(' ', '')  # Remove all whitespace

    def helper(index):
        result = set()
        token = ''
        while index < len(s):
            char = s[index]
            if char == '{':
                if token:
                    result.add(token)
                    token = ''
                inner, index = helper(index + 1)
                result.add(frozenset(inner))
            elif char == '∅':
                if token:
                    result.add(token)
                    token = ''
                result.add(frozenset())
                index += 1
            elif char == ',':
                if token:
                    result.add(token)
                    token = ''
                index += 1
            elif char == '}':
                if token:
                    result.add(token)
                    token = ''
                return result, index + 1
            else:
                token += char  # Collect letters or digits
                index += 1
        return result, index

    if s.startswith('{') and s.endswith('}'):
        parsed_set, _ = helper(1)  # start inside the first `{`
        return parsed_set
    elif s == '∅' or s == '{}':
        # Handle empty set
        return set()
    else:
        raise ValueError("Input must start and end with braces {} or be ∅")


def solve(sets_dict, iterations=1):
    """
    Calculate power sets for multiple sets and return JSON result.
    
    Parameters:
    -----------
    sets_dict : dict
        Dictionary mapping set names to their string representations
        Example: {"A": "{a, b, c}", "B": "{1, 2}"}
    iterations : int
        Number of power set iterations to calculate
        
    Returns:
    --------
    str
        JSON string with the original sets and calculated power sets
    """
    try:
        # Convert iterations to int
        iterations = int(iterations)
        if iterations < 1 or iterations > 3:
            raise ValueError("Iterations must be between 1 and 3")
        
        # Initialize the result structures
        result = {
            "original_sets": {},
            "power_sets": {},
            "iterations": iterations
        }
        
        # Process each set in the dictionary
        for set_name, set_value in sets_dict.items():
            # Apply character replacements
            set_value = re.sub("|".join(map(re.escape, har_mapping.keys())), replace_char, set_value)
            
            # Save original set
            result["original_sets"][set_name] = set_value
            
            # Parse the input set
            try:
                user_set = parse_set_notation(set_value)
                
                if '∅' in user_set:
                    user_set.remove('∅')
                    user_set.add(frozenset())
                
                # Calculate power sets
                current_set = user_set
                for i in range(iterations):
                    # Calculate next power set
                    current_set = power_set(current_set)
                    
                    # Format the power set for output
                    formatted_subsets = []
                    for subset in sorted(current_set, key=lambda x: (len(x), [str(e) for e in x])):
                        formatted_subsets.append(format_math_set(subset))
                    
                    # Add to result with a key that combines iteration and set name
                    power_set_key = f"Iteration {i+1} - Set {set_name}"
                    result["power_sets"][power_set_key] = {
                        "notation": f"𝒫^{i+1}({set_name})",
                        "elements": formatted_subsets,
                        "cardinality": len(formatted_subsets)
                    }
            except Exception as e:
                # If a specific set fails, add error message but continue processing others
                result["power_sets"][f"Error in Set {set_name}"] = str(e)
        
        return json.dumps(result)
    
    except Exception as e:
        error_result = {
            "error": f"Error calculating power sets: {str(e)}"
        }
        return json.dumps(error_result)