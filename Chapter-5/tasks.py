# File: tasks.py
# Author: Jacob Warren
# Description: 5.2 stuff

import methods
import copy

def table_to_relation(relation, table_input):
    i = 0

    if table_input.strip():
        tuples = table_input.split("),")
        
        for tuple_ in tuples:
            i = i + 1
            tuple_ = tuple_.strip()

            if tuple_.endswith(")"):
                tuple_ = tuple_[:-1]
            if tuple_.startswith("("):
                tuple_ = tuple_[1:]

            prereqs = [p.strip() for p in tuple_.split(",")]

            try:
                for p in prereqs:
                    relation.add((int(p),i))
            except ValueError:
                print(f"Invalid tuple: {tuple_}")
                return -1

    return i

def topological_sort(elements, relation):
    total_relation = []
    temp = copy.deepcopy(elements)

    while temp != set():
        for m in methods.minimal_elements(temp, relation):
            temp = temp - set(m)
            total_relation.append(m)
            break

    relation = set()

    for i in range(len(total_relation)):
        for j in range(i, len(total_relation)):
            relation.add((total_relation[i], total_relation[j]))
    
def timed_table():
    table_input = input("Enter a task table as a comma-separated list of prerequisite tasks as tuples: ")
    relation = set()
    i = table_to_relation(relation, table_input)
    if i == -1:
        return

    methods.transitive_closure(relation)
    
    topological_sort(set([i for i in range(1, i + 1)]), relation)
    
    time_input = input("Enter the task times in order and comma-separated: ")
    times = []

    if time_input.strip():
        time_strings = time_input.split(",")
        
        try:
            times = [float(t) for t in time_strings]
        except ValueError:
            print("Enter numbers.")
            return

    if i != len(times):
        print("Table length doesn't match number of times.")
        return

    print("Topological sort: ", relation)

def untimed_table():
    table_input = input("Enter a task table: ")
    relation = set()
    i = table_to_relation(relation, table_input)
    if i == -1:
        return
    
    methods.transitive_closure(relation)

    topological_sort(set([i for i in range(1, i + 1)]), relation)

    print("Topological sort: ", relation)

def main():
    # Timed or not
    while True:
        timed_input = input("Are your tasks timed? (Y/N)")
        timed = timed_input.strip()

        if timed in "yY":
            timed_table()
            break
        elif timed in "nN":
            untimed_table()
            break

if __name__ == "__main__":
    main()