'''----------------- 
# Title: wff_solver.py
# Author: Mathias Buchanan
# Date: 2/18/2025
# Description: A solver for well-formed formulas (WFF) to generate truth tables.
-----------------'''

#---Imports---#
import itertools
import re
import json

def implies (p, q):
    '''
        Function to evaluate logical implication

        Parameters
        ----------
        p (int): 
            The antecedent of the implication
        q (int):
            The consequent of the implication

        Returns
        ----------
        return: bool
            True if p implies q, False otherwise.
    '''
    return not p or q


def _parse_formula(formula):
    '''
        Function to parse a logical formula and replace logical operators 
            with Python equivalents. Does this by converting to Python syntax and evaluating the formula.

        Parameters
        ----------
        formula (str): 
            The logical formula to parse

        Returns
        ----------
        return: str
            The parsed formula with Python equivalents of logical operators.
    '''

    # Replace unicode characters with ASCII equivalents
    formula = formula.replace('¬', 'not ')
    formula = formula.replace('∧', ' and ')
    formula = formula.replace('∨', ' or ')
    formula = formula.replace('→', ' <= ')
    formula = formula.replace('↔', ' == ')

    # Replace logical operators with Python equivalents
    formula = formula.replace('v', ' or ')
    formula = formula.replace('^', ' and ')
    formula = formula.replace('<>', ' == ')
    formula = formula.replace('->', ' <= ')
    formula = re.sub(r"([A-Z])'", r'not \1', formula)

    # Replace parentheses with brackets for easier parsing
    formula = formula.replace('[', '(').replace(']', ')')

    # Handle implies operator by adding parentheses around the expressions
    # Python is really picky about order of operations, so just parse it out
    # and add parentheses around the expressions
    parts = formula.split('<=')
    if len(parts) == 2:
        left = parts[0].strip()
        right = parts[1].strip()
        if not left.startswith('('):
            left = f'({left})'
        if not right.startswith('('):
            right = f'({right})'
        formula = f'{left} <= {right}'

    return formula

def _extract_intermediate_expressions(formula):
    '''
        Function to extract intermediate expressions from a logical formula.
            E.g. (A and B) or (C and D) would return ['A and B', 'C and D']

        Parameters
        ----------
        formula (str): 
            The logical formula to extract intermediate expressions from

        Returns
        ----------
        return: list
            A list of intermediate expressions extracted from the formula.
    '''
    # Extract intermediate expressions from the formula
    intermediate_expressions = re.findall(r'\(([^()]+)\)', formula)
    return intermediate_expressions

def _extract_variables(formula):
    '''
        Function to extract unique variables (letters) from a logical formula.

        Parameters
        ----------
        formula (str): 
            The logical formula to extract variables from

        Returns
        ----------
        return: list
            A sorted list of unique variables extracted from the formula.
    '''
    # Extract unique variables from the formula using a regular expression
    return sorted(set(re.findall(r'\b[A-Z]\b', formula)))

def solve(formula):
    '''
        Function to solve a logical formula and generate a truth table.

        Parameters
        ----------
        formula (str): 
            The logical formula to solve

        Returns
        ----------
        return: json
            A JSON object representing the truth table to return to the client.
    '''

    # Extract unique variables from the formula
    variables = _extract_variables(formula)

    # Extract intermediate expressions from the formula
    intermediate_expressions = _extract_intermediate_expressions(formula)

    # Generate all possible combinations of truth values for the variables
    truth_values = list(itertools.product([False, True], repeat=len(variables)))

    # Parse the formula to replace logical operators with Python equivalents
    parsed_formula = _parse_formula(formula)

    # Evaluate the formula for each combination of truth values
    results = []
    for values in truth_values:

        # Create a dictionary to map variables to their truth values
        env = dict(zip(variables, values))

        # Add the implies function to the environment
        env['implies'] = implies

        # Create a row for the truth table
        row = list(values)

        # Evaluate intermediate expressions and the main formula
        for expr in intermediate_expressions:

            # Parse the intermediate expression to replace logical operators w/ Python equivalents
            parsed_expr = _parse_formula(expr)

            # Evaluate the intermediate expression via Python's eval function
            row.append(eval(parsed_expr, {}, env))
        
        # Evaluate the main formula and append it to results
        row.append(eval(parsed_formula, {}, env))
        results.append(row)

    # Generate the headers for the truth table
    headers = variables + intermediate_expressions + [formula]

    # Prepare the truth table as a JSON object
    truth_table = {
        "headers": headers,
        "rows": []
    }

    # Add the rows to the truth table
    for row in results:
        truth_table["rows"].append(row)

    return json.dumps(truth_table)
