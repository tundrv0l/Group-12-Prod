# File: tasks.py
# Author: Jacob Warren
# Description: 5.2 stuff

import methods

# Function: table_to_relation
# Input: a table represented by a dictionary
#        with task names as the key and tuples
#        containing the prereqs and time to complete
#        as the data (no prereqs = set(), no time given = 0)
# Output: a relation representing that table with
#         tuples of the form (prereq, task)
# Purpose: facilitate topological sorting and
#          solve problems like 3 and 4
def table_to_relation(table):
    relation = set()

    for task in table:
        for prereq in table[task][0]:
            relation.add((prereq, task))

    return relation
    
# Function: topological_sort
# Input: a table represented by a dictionary
#        with task names as the key and tuples
#        containing the prereqs and time to complete
#        as the data (no prereqs = set(), no time given = 0)
# Output: a list representing a total order
# Purpose: solve problems like 9-14 and facilitate
#          problems like 5 and 6
def topological_sort(table):
    elements = set(table.keys())
    relation = table_to_relation(table)
    total_relation = []

    relation |= methods.transitive_closure(relation)
    relation |= methods.reflexive_closure(set(table.keys()), relation)
    
    for i in range(0, len(elements)):
        for m in methods.minimal_elements(elements - set(total_relation), relation):
            total_relation.append(m)
            break
    
    return total_relation

# Function: analyze_table
# Input: a table represented by a dictionary
#        with task names as the key and tuples
#        containing the prereqs and time to complete
#        as the data (no prereqs = set(), no time given = 0)
# Output: the critical path and the time to complete it
# Purpose: solve problems like 5 and 6
def analyze_table(table):
    if not table:
        return [[], 0]

    latest_finish = {}

    sorted_tasks = topological_sort(table)

    for task in sorted_tasks:
        latest_finish[task] = table[task][1]

        for prereq in table[task][0]:
            latest_finish[task] = max(latest_finish[prereq] + table[task][1], latest_finish[task])
    
    task = sorted_tasks[-1]
    critical_path = [task]
    time = latest_finish[task] - table[task][1]

    while time > 0:
        for prereq in table[task][0]:
            if latest_finish[task] - table[task][1] == latest_finish[prereq]:
                critical_path.append(prereq)
                time -= table[prereq][1]
                task = prereq
                break

    return [list(reversed(critical_path)), latest_finish[sorted_tasks[-1]]]

def main():
    tables = [
        { # 3/5/11
            "A": ({"E"}, 3),
            "B": ({"C", "D"}, 5),
            "C": ({"A"}, 2),
            "D": ({"A"}, 6),
            "E": (set(), 2),
            "F": ({"A", "G"}, 4),
            "G": ({"E"}, 4),
            "H": ({"B", "F"}, 1)
        },
        { # 4/6/12
            1: ({2}, 4),
            2: ({3}, 2),
            3: ({8}, 5),
            4: ({3}, 2),
            5: ({4, 7}, 2),
            6: ({5}, 1),
            7: ({3}, 3),
            8: (set(), 5)
        },
        {}, # edge case
        { # 9
            "A": ({"F"}, 0),
            "B": ({"A", "C"}, 0),
            "C": ({"F"}, 0),
            "D": ({"F"}, 0),
            "E": ({"D"}, 0),
            "F": ({"G", "H"}, 0),
            "G": (set(), 0),
            "H": (set(), 0)
        },
        { # 10
            "A": (set(), 0),
            "B": ({"A"}, 0),
            "C": ({"A"}, 0),
            "D": ({"B", "E"}, 0),
            "E": ({"C"}, 0),
            "F": ({"C"}, 0),
            "G": ({"F"}, 0)
        },
        { # 13
            1: ({9}, 0),
            2: ({11}, 0),
            3: ({11}, 0),
            4: ({10}, 0),
            5: ({2, 3}, 0),
            6: (set(), 0),
            7: ({9}, 0),
            8: ({9}, 0),
            9: ({6}, 0),
            10: ({1, 7, 8, 11}, 0),
            11: (set(), 0)
        },
        { # 14
            1: ({2, 3, 7}, 0),
            2: (set(), 0),
            3: (set(), 0),
            4: ({1, 3, 9}, 0),
            5: (set(), 0),
            6: ({2, 3, 7}, 0),
            7: (set(), 0),
            8: ({1, 4, 6}, 0),
            9: ({5}, 0)
        }
    ]

    for i in range (0, 3):
        print(f"Critical path {i}: ", analyze_table(tables[i]))

    for i in range (0, len(tables)):
        print(f"Total order {i}: ", topological_sort(tables[i]))

    for i in range (0, len(tables)):
        print(f"PERT arrows {i}: ", table_to_relation(tables[i]))

if __name__ == "__main__":
    main()
