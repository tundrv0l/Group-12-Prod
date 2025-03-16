# File: manager_test.py
# Author: Jacob Warren
# Description: test database manager

import sys, os

# ew
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'database'))

from manager import Database

def main():
    filename = "test.db"

    if os.path.exists(filename):
        os.remove(filename)

    db = Database(filename)

    db.add_user(111, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "en-US")
    db.add_solver(111, "WFF")
    db.add_input(111, 111, 111, "A")
    db.add_output(111, 111, 1, 242.353)

    print(db.get_user(111))
    print(db.get_solver(111))
    print(db.get_input(111))
    print(db.get_output(111))
    
    db.close()

if __name__ == "__main__":
    main()
