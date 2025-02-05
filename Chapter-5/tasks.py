# File: tasks.py
# Author: Jacob Warren
# Description: 5.2 stuff

import methods
import copy

def table_to_relation(relation, table_input):
    i = 0

    if table_input.strip():
        tuples = table_input.split("),")
        i = 0

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
                    if p != "":
                        relation.add((int(p),i))
            except ValueError:
                print(f"Invalid tuple: {tuple_}")
                return -1

    return i

def topological_sort(elements, relation):
    total_relation = []
    temp = copy.deepcopy(elements)

    for i in range(0, len(elements)):
        for m in methods.minimal_elements(temp, relation):
            temp.remove(m)
            total_relation.append(m)
            break

    return total_relation

def critical_path(relation, times):
    num_tasks = len(times)
    latest_finish = {task: 0 for task in range(1, num_tasks + 1)}

    sorted_tasks = topological_sort(set(range(1, num_tasks + 1)), relation)

    for task in sorted_tasks:
        for prereq in relation:
            if prereq[1] == task:
                latest_finish[task] = max(latest_finish[task], latest_finish[prereq[0]] + times[task - 1])

    critical_path_array = [num_tasks]
    time = latest_finish[num_tasks]
    task = num_tasks

    while time > 0:
        for prereq in relation:
            if prereq[1] == task and latest_finish[task] - times[task - 1] == latest_finish[prereq[0]]:
                critical_path_array.append(prereq[0])
                time = time - times[task - 1]
                task = prereq[0]
                break

    return list(reversed(critical_path_array))
    
def timed_table():
    table_input = input("Enter a task table as a comma-separated list of prerequisite tasks as tuples: ")
    relation = set()
    i = table_to_relation(relation, table_input)
    if i == -1:
        return

    elements = set([j for j in range(1, i + 1)])

    # make it a partial order
    relation |= methods.transitive_closure(relation)
    relation |= methods.reflexive_closure(elements, relation)
    
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

    critical_path_set = critical_path(relation, times)

    print("Critical Path: ", critical_path_set)

def untimed_table():
    table_input = input("Enter a task table: ")
    relation = set()
    i = table_to_relation(relation, table_input)
    if i == -1:
        return

    elements = set([j for j in range(1, i + 1)])
    
    # make it a partial order
    relation |= methods.transitive_closure(relation)
    relation |= methods.reflexive_closure(elements, relation)

    relation = topological_sort(elements, relation)

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