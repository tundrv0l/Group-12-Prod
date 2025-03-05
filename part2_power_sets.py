from itertools import chain, combinations
import string

def power_set(iterable):
    """Generate the power set of a given iterable."""
    s = list(iterable)  # Convert to list to handle indexing
    return list(chain.from_iterable(combinations(s, r) for r in range(len(s) + 1)))

# User input for the set
user_input = input(f"Enter characters and/or numbers separated by spaces.") #  including '∅' for the empty set: 

# Allow characters a to z, digits 0 to 9, and the empty set symbol '∅'
valid_characters_and_numbers = set(string.ascii_lowercase + string.digits) #  + {'\u2205'}

# Filter input to only allow valid characters and digits
user_set = set(c for c in user_input.split() if c in valid_characters_and_numbers)

# Handle the '∅' symbol as the empty set
# if '∅' in user_set:
#     user_set.remove('∅')
#     user_set.add(frozenset())  # Represent the empty set as a frozenset

# User input for how many power sets they want to generate
num_power_sets = int(input("How many power sets do you want to generate (e.g., 1 for power set, 2 for power set of power set, etc.)? "))

# Generate the power set iteratively based on the number of times requested
current_set = user_set

for i in range(num_power_sets):
    current_set = power_set(current_set)
    print(f"\nPower Set {i+1}:")
    for subset in current_set:
        print(set(subset))  # Convert tuples to sets for better readability
