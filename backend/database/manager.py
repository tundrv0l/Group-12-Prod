# File: manager.py
# Author: Jacob Warren
# Purpose: manage the diagnostics database

import sqlite3

from datetime import datetime

class Database:
    def __init__(self, name):
        self.connection = sqlite3.connect(name, timeout=5)
        self.cursor = self.connection.cursor()


        # drop existing tables for testing 
        # self.cursor.execute("DROP TABLE IF EXISTS output")
        # self.cursor.execute("DROP TABLE IF EXISTS input")
        # self.cursor.execute("DROP TABLE IF EXISTS solver")
        # self.cursor.execute("DROP TABLE IF EXISTS user")

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS user (
                uid INTEGER PRIMARY KEY,
                user_agent TEXT NOT NULL,
                language TEXT NOT NULL,
                first_connect_time INTEGER NOT NULL,
                last_connect_time INTEGER NOT NULL
            )
        """)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS solver (
                sname TEXT PRIMARY KEY,
                used_count INTEGER NOT NULL DEFAULT 0
            )
        """)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS input (
                uid INTEGER NOT NULL,
                sname TEXT NOT NULL,
                input_text TEXT,
                in_time INTEGER NOT NULL,
                PRIMARY KEY (uid, in_time),
                FOREIGN KEY (uid) REFERENCES user(uid),
                FOREIGN KEY (sname) REFERENCES solver(sname)
            )
        """)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS output (
                uid INTEGER NOT NULL,
                in_time INTEGER NOT NULL,
                success INTEGER NOT NULL,
                execution_time REAL NOT NULL,
                PRIMARY KEY (uid, in_time),
                FOREIGN KEY (uid, in_time) REFERENCES input(uid, in_time),
                FOREIGN KEY (uid) REFERENCES user(uid)
            )
        """)

        self.connection.commit()

    def add_user(self, uid, user_agent, language, in_time):
        self.cursor.execute(
            """
                INSERT INTO user(
                    uid,
                    user_agent,
                    language,
                    first_connect_time,
                    last_connect_time
                )
                VALUES(?, ?, ?, ?, ?)
            """,
            (uid, user_agent, language, in_time, in_time)
        )
        
        self.connection.commit()

    def add_solver(self, sname):
        self.cursor.execute(
            """
                INSERT INTO solver(sname)
                VALUES(?)
            """,
            (sname,)
        )
        
        self.connection.commit()

    def add_input(self, uid, sname, input_text, in_time):
        self.cursor.execute(
            """
                INSERT INTO input(
                    uid,
                    sname,
                    input_text,
                    in_time
                )
                VALUES(?, ?, ?, ?)
            """,
            (uid, sname, input_text, in_time)
        )
        
        self.update_user(uid, in_time)
        self.update_solver(sname)
        
        self.connection.commit()

    def add_output(self, uid, in_time, success, execution_time):
        self.cursor.execute(
            """
                INSERT INTO output(
                    uid,
                    in_time,
                    success,
                    execution_time
                )
                VALUES(?, ?, ?, ?)
            """,
            (uid, in_time, success, execution_time)
        )
        
        self.connection.commit()

    def get_user(self, uid):
        self.cursor.execute(
            """
                SELECT *
                FROM user
                WHERE uid = ?
            """,
            (uid,)
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "uid": row[0],
                "user_agent": row[1],
                "language": row[2],
                "first_connect_time": datetime.fromtimestamp(row[3]).isoformat(),
                "last_connect_time": datetime.fromtimestamp(row[4]).isoformat()
            }

        return result

    def get_solver(self, sname):
        self.cursor.execute(
            """
                SELECT *
                FROM solver
                WHERE sname = ?
            """,
            (sname,)
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "sname": row[0],
                "used_count": row[1]
            }

        return result

    def get_input(self, uid, in_time):
        self.cursor.execute(
            """
                SELECT *
                FROM input
                WHERE uid = ? AND in_time = ?
            """,
            (uid, in_time)
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "uid": row[0],
                "sname": row[1],
                "input_text": row[2],
                "in_time": datetime.fromtimestamp(row[3]).isoformat()
            }

        return result

    def get_output(self, uid, in_time):
        self.cursor.execute(
            """
                SELECT *
                FROM output
                WHERE uid = ? AND in_time = ?
            """,
            (uid, in_time)
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "uid": row[0],
                "in_time": datetime.fromtimestamp(row[1]).isoformat(),
                "success": row[2],
                "execution_time(ms)": row[3]
            }

        return result

    def update_user(self, uid, in_time):
        self.cursor.execute(
            """
                UPDATE user
                SET last_connect_time = ?
                WHERE uid = ?
            """,
            (in_time, uid)
        )

    def update_solver(self, sname):
       self.cursor.execute(
            """
                UPDATE solver
                SET used_count = used_count + 1
                WHERE sname = ?
            """,
            (sname,)
        )

    def close(self):
        self.cursor.close()
        self.connection.close()
    
    # aggregates
    def get_user_count(self):
        self.cursor.execute(
            """
                SELECT COUNT(*) 
                FROM user
            """
        )

        result = {
            "user_count": self.cursor.fetchone()[0]
        }

        return result
    
    def get_user_inputs(self, uid):
        self.cursor.execute(
            """
                SELECT *
                FROM input
                WHERE uid = ?
            """,
            (uid,)
        )
        
        rows = self.cursor.fetchall()
        result = []
        for row in rows:
            result.append({
                "uid": row[0],
                "sname": row[1],
                "input_text": row[2],
                "in_time": datetime.fromtimestamp(row[3]).isoformat()
            })

        return result

    def get_user_outputs(self, uid):
        self.cursor.execute(
            """
                SELECT *
                FROM output
                WHERE uid = ?
            """,
            (uid, )
        )

        rows = self.cursor.fetchall()
        result = []
        for row in rows:
            result.append({
                "uid": row[0],
                "in_time": datetime.fromtimestamp(row[1]).isoformat(),
                "success": row[2],
                "execution_time(ms)": row[3]
            })

        return result

    def get_average_execution(self, sname, success_only):
        query = """
                SELECT AVG(o.execution_time) 
                FROM output o JOIN input i ON o.uid = i.uid AND o.in_time = i.in_time
                WHERE i.sname = ?
        """

        parameters = [sname]
        if success_only:
            query += " AND o.success = 1"

        self.cursor.execute(query, parameters)
        aggregate = self.cursor.fetchone()
        result = None
        if aggregate:
            result = aggregate[0]

        return result
