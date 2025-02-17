'''----------------- 
# Title: wff_solver.py
# Author: Mathias Buchanan
# Date: 2/15/2025
# Description: Solver code to convert WFF to Truth Tables.
-----------------'''

#---Imports---#
import json
import itertools

class Letter:
    """
    Class to represent a letter in a propositional logic formula.
    It can be a variable (like 'A', 'B', etc.) or a negation of a variable (like '¬A').

    - Members:
        - letter: The letter representing a variable.
        - is_Not: Boolean indicating if the letter is negated.
    """

    def __init__(self, letter, is_Not=False):
        self.letter = letter
        self.is_Not = is_Not

    def __eq__(self, value):
        """
        Check equality with another Letter or a string.
        If the other value is a Letter, compare their letters.
        If it's a string, compare the letter of this instance with the string.

        - Parameters:
            - value: The value to compare with.
        
        - Returns:
            - True if equal, False otherwise.
        """

        if isinstance(value, Letter):
            return self.letter == value.letter
        return self.letter == value

    def __str__(self):
        """
        String representation of the Letter object.
        If it's negated, it returns "¬" followed by the letter.

        - Returns:
            - A string representation of the letter.
        """

        return f"¬{self.letter}" if self.is_Not else self.letter

    def checkTrue(self, truthTable):
        """
        Check the truth value of the letter based on the provided truth table.
        If the letter is negated, return the negation of its truth value.

        - Parameters:
            - truthTable: A dictionary representing the truth values of variables.
        
        - Returns:
            - True if the letter's truth value is True, False otherwise.
        """
        return not truthTable[self.letter] if self.is_Not else truthTable[self.letter]

class AND:
    """
    Class to represent the AND operation in propositional logic.
    It takes two letters and can be negated.

    - Members:
        - letter1: The first letter in the AND operation.
        - letter2: The second letter in the AND operation.
        - is_Not: Boolean indicating if the AND operation is negated.
    """

    def __init__(self, letter1, letter2, is_Not=False):
        self.letter1 = letter1
        self.letter2 = letter2
        self.is_Not = is_Not

    def __str__(self):
        """
        String representation of the AND operation.
        If negated, it returns "¬" followed by the AND operation.

        - Returns:
            - A string representation of the AND operation.
        """

        base_str = f"({self.letter1} ∧ {self.letter2})"
        return f"¬{base_str}" if self.is_Not else base_str

    def checkTrue(self, truthTable):
        """
        Check the truth value of the AND operation based on the provided truth table.
        If the AND operation is negated, return the negation of its truth value.

        - Parameters:
            - truthTable: A dictionary representing the truth values of variables.

        - Returns:
            - True if the AND operation's truth value is True, False otherwise.
        """

        result = self.letter1.checkTrue(truthTable) and self.letter2.checkTrue(truthTable)
        return not result if self.is_Not else result

class OR:
    """
    Class to represent the OR operation in propositional logic.
    It takes two letters and can be negated.

    - Members:
        - letter1: The first letter in the OR operation.
        - letter2: The second letter in the OR operation.
        - is_Not: Boolean indicating if the OR operation is negated.
    """

    def __init__(self, letter1, letter2, is_Not=False):
        self.letter1 = letter1
        self.letter2 = letter2
        self.is_Not = is_Not

    def __str__(self):
        """
        String representation of the OR operation.
        If negated, it returns "¬" followed by the OR operation.

        - Returns:
            - A string representation of the OR operation.
        """

        base_str = f"({self.letter1} ∨ {self.letter2})"
        return f"¬{base_str}" if self.is_Not else base_str

    def checkTrue(self, truthTable):
        """
        Check the truth value of the OR operation based on the provided truth table.
        If the OR operation is negated, return the negation of its truth value.

        - Returns:
            - True if the OR operation's truth value is True, False otherwise.
        """

        result = self.letter1.checkTrue(truthTable) or self.letter2.checkTrue(truthTable)
        return not result if self.is_Not else result

class IMPLIES:
    """
    Class to represent the IMPLIES operation in propositional logic.
    It takes two letters and can be negated.

    - Members:
        - letter1: The first letter in the IMPLIES operation.
        - letter2: The second letter in the IMPLIES operation.
        - is_Not: Boolean indicating if the IMPLIES operation is negated.
    """

    def __init__(self, letter1, letter2, is_Not=False):
        self.letter1 = letter1
        self.letter2 = letter2
        self.is_Not = is_Not

    def __str__(self):
        """
        String representation of the IMPLIES operation.
        If negated, it returns "¬" followed by the IMPLIES operation.

        - Returns:
            - A string representation of the IMPLIES operation.
        """

        base_str = f"({self.letter1} → {self.letter2})"
        return f"¬{base_str}" if self.is_Not else base_str

    def checkTrue(self, truthTable):
        """
        Check the truth value of the IMPLIES operation based on the provided truth table.
        If the IMPLIES operation is negated, return the negation of its truth value.

        - Parameters:
            - truthTable: A dictionary representing the truth values of variables.
        
        - Returns:
            - True if the IMPLIES operation's truth value is True, False otherwise.
        """

        result = not self.letter1.checkTrue(truthTable) or self.letter2.checkTrue(truthTable)
        return not result if self.is_Not else result

class DIMPLIES:
    """
    Class to represent the DIMPLIES (IFF) operation in propositional logic.
    It takes two letters and can be negated.

    - Members:
        - letter1: The first letter in the DIMPLIES operation.
        - letter2: The second letter in the DIMPLIES operation.
        - is_Not: Boolean indicating if the DIMPLIES operation is negated.
    """

    def __init__(self, letter1, letter2, is_Not=False):
        self.letter1 = letter1
        self.letter2 = letter2
        self.is_Not = is_Not

    def __str__(self):
        """
        String representation of the DIMPLIES operation.
        If negated, it returns "¬" followed by the DIMPLIES operation.

        - Returns:
            - A string representation of the DIMPLIES operation.
        """

        base_str = f"({self.letter1} ↔ {self.letter2})"
        return f"¬{base_str}" if self.is_Not else base_str

    def checkTrue(self, truthTable):
        """
        Check the truth value of the DIMPLIES operation based on the provided truth table.
        If the DIMPLIES operation is negated, return the negation of its truth value.

        - Parameters:
            - truthTable: A dictionary representing the truth values of variables.

        - Returns:
            - True if the DIMPLIES operation's truth value is True, False otherwise.
        """

        result = self.letter1.checkTrue(truthTable) == self.letter2.checkTrue(truthTable)
        return not result if self.is_Not else result

def parse_formula(formula):
    """
    Driver function to parse a WFF and return a corresponding object.

    - Parameters:
        - formula: A string representing the WFF to be parsed.
    
    - Returns:
        - An object representing the parsed WFF.
    """

    # Remove spaces and initialize a stack for parentheses
    formula = formula.replace(" ", "")
    stack = []
    i = 0

    # Iterate through the formula to handle grouping by parentheses
    while i < len(formula):

        # At the start of grouping, add the index to the stack
        if formula[i] == '(':
            stack.append(i)

        # If we encounter a closing parenthesis, finish grouping, pop from the stack
        elif formula[i] == ')':

            start = stack.pop()

            # If the stack is empty, we have a complete sub-formula
            if not stack:
                # Parse the sub-formula between the parentheses
                sub_formula = formula[start + 1:i]

                # Recursively parse the sub-formula and replace it in the original formula
                parsed_sub_formula = parse_formula(sub_formula)
                formula = formula[:start] + str(parsed_sub_formula) + formula[i + 1:]

                # Adjust the index to continue parsing after the replaced sub-formula
                i = start + len(str(parsed_sub_formula)) - 1

        # Increment the index to continue parsing
        i += 1

    # Series of controls to check for the type of operation in the formula

    # Check for implication (->)
    if "->" in formula:

        # Split the formula at the first occurrence of '->'
        parts = formula.split("->")

        # Parse the left and right parts of the implication
        return IMPLIES(parse_formula(parts[0]), parse_formula(parts[1]))

    # Check for disjunction/or (v or V)
    elif "v" in formula or "V" in formula:

        # Split the formula at the first occurrence of 'v' or 'V'
        parts = formula.split("v") if "v" in formula else formula.split("V")

        # Parse the left and right parts of the disjunction
        return OR(parse_formula(parts[0]), parse_formula(parts[1]))

    # Check for conjunction/and (^)
    elif "^" in formula:

        # Split the formula at the first occurrence of '^'
        parts = formula.split("^")

        # Parse the left and right parts of the conjunction
        return AND(parse_formula(parts[0]), parse_formula(parts[1]))

    # Check for iff/biconditional (<->)
    elif "<>" in formula:

        # Split the formula at the first occurrence of '<>'
        parts = formula.split("<>")

        # Parse the left and right parts of the biconditional
        return DIMPLIES(parse_formula(parts[0]), parse_formula(parts[1]))

    # Check for negation (not, ¬, ')
    elif formula.startswith("not"):

        # Remove the "not" prefix and parse the rest of the formula
        return Letter(formula[3:].strip(), is_Not=True)
    elif formula.startswith("¬"):

        # Remove the "¬" prefix and parse the rest of the formula
        return Letter(formula[1:].strip(), is_Not=True)
    elif formula.endswith("'"):

        # Remove the "'" suffix and parse the rest of the formula
        return Letter(formula[:-1].strip(), is_Not=True)
    else:

        # If none of the above, it's a simple variable (like 'A', 'B', etc.)
        return Letter(formula.strip())

def solve(data):
    """
    Driver function solve a WFF and return a truth table.

    - Parameters:
        - data: A dictionary containing the WFF to be solved.
    
    - Returns:
        - A JSON string representing the truth table of the WFF.
    """

    # Parse the formula from the input data
    formula = parse_formula(data)

    # Extract variables from the formula and sort them
    variables = sorted(_extract_variables(formula))

    # Define the headers/row for the truth table
    headers = variables + [str(formula)]
    rows = []

    # Generate all combinations of truth values for the variables
    for values in itertools.product([False, True], repeat=len(variables)):

        # Create a truth table for the current combination of values
        truthTable = dict(zip(variables, values))

        # Evaluate the formula for the current truth table
        row = ["T" if truthTable[var] else "F" for var in variables]

        # Append the result of the formula evaluation
        row.append("T" if formula.checkTrue(truthTable) else "F")

        # Append the row to the result
        rows.append(row)

    # Convert the result to JSON format
    result = {
        "headers": headers,
        "rows": rows
    }

    return json.dumps(result)

def _extract_variables(formula):
    """
    Recursively extract variables from a formula.

    - Parameters:
        - formula: The formula object to extract variables from.
    
    - Returns:
        - A set of variables present in the formula.
    """

    # Base case: if the formula is a letter, return its variable
    if isinstance(formula, Letter):
        return {formula.letter}

    # Recursive case: if the formula is a compound statement, extract variables from its components
    elif isinstance(formula, (AND, OR, IMPLIES, DIMPLIES)):
        return _extract_variables(formula.letter1) | _extract_variables(formula.letter2)

    # If the formula is not recognized, return an empty set
    return set()
