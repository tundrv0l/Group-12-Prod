# File: manager_test.py
# Author: Jacob Warren
# Description: test database manager

import sys, os

# ew
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'database'))

from manager import Database

def main():
    filename = "../../logs/diagnostics/diagnostics.db"

    db = Database(filename)

    print(db.get_average_execution(111, False))
    print(db.get_user_count())

    db.close()

if __name__ == "__main__":
    main()
