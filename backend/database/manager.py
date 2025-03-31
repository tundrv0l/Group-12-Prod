# File: manager.py
# Author: Jacob Warren
# Purpose: manage the diagnostics database

import sqlite3
import time

from datetime import datetime


class Database:
    def __init__(self, name):
        self.connection = sqlite3.connect(name)
        self.cursor = self.connection.cursor()
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
                sid INTEGER PRIMARY KEY,
                sname TEXT NOT NULL,
                used_count INTEGER NOT NULL DEFAULT 0
            )
        """)
        
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS input (
                iid INTEGER PRIMARY KEY,
                uid INTEGER NOT NULL,
                sid INTEGER NOT NULL,
                input_text TEXT,
                in_time INTEGER NOT NULL,
                FOREIGN KEY (uid) REFERENCES user(uid),
                FOREIGN KEY (sid) REFERENCES solver(sid)
            )
        """)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS output (
                oid INTEGER PRIMARY KEY,
                iid INTEGER NOT NULL,
                success INTEGER NOT NULL,
                execution_time REAL NOT NULL,
                out_time INTEGER NOT NULL,
                FOREIGN KEY (iid) references input(iid)
            )
        """)

        self.connection.commit()

    def add_user(self, uid, user_agent, language):
        current_time = int(time.time())
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
            (uid, user_agent, language, current_time, current_time)
        )
        
        self.connection.commit()

    def add_solver(self, sid, sname):
        self.cursor.execute(
            """
                INSERT INTO solver(sid, sname)
                VALUES(?, ?)
            """,
            (sid, sname)
        )
        
        self.connection.commit()

    def add_input(self, iid, uid, sid, input_text):
        current_time = int(time.time())
        self.cursor.execute(
            """
                INSERT INTO input(
                    iid,
                    uid,
                    sid,
                    input_text,
                    in_time
                )
                VALUES(?, ?, ?, ?, ?)
            """,
            (iid, uid, sid, input_text, current_time)
        )
        
        self.update_user(uid)
        self.update_solver(sid)
        
        self.connection.commit()

    def add_output(self, oid, iid, success, execution_time):
        current_time = int(time.time())
        self.cursor.execute(
            """
                INSERT INTO output(
                    oid,
                    iid,
                    success,
                    execution_time,
                    out_time
                )
                VALUES(?, ?, ?, ?, ?)
            """,
            (oid, iid, success, execution_time, current_time)
        )
        
        self.connection.commit()

    def get_user(self, uid):
        self.cursor.execute(
            """
                SELECT *
                FROM user
                WHERE uid = ?
            """,
            (uid, )
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

    def get_solver(self, sid):
        self.cursor.execute(
            """
                SELECT *
                FROM solver
                WHERE sid = ?
            """,
            (sid, )
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "sid": row[0],
                "sname": row[1],
                "used_count": row[2]
            }

        return result

    def get_input(self, iid):
        self.cursor.execute(
            """
                SELECT *
                FROM input
                WHERE iid = ?
            """,
            (iid, )
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "iid": row[0],
                "uid": row[1],
                "sid": row[2],
                "input_text": row[3],
                "in_time": datetime.fromtimestamp(row[4]).isoformat()
            }

        return result

    def get_output(self, oid):
        self.cursor.execute(
            """
                SELECT *
                FROM output
                WHERE oid = ?
            """,
            (oid, )
        )
        
        row = self.cursor.fetchone()
        result = None
        if row:
            result = {
                "oid": row[0],
                "iid": row[1],
                "success": row[2],
                "execution_time": row[3],
                "out_time": datetime.fromtimestamp(row[4]).isoformat()
            }

        return result

    def update_user(self, uid):
        current_time = int(time.time())
        self.cursor.execute(
            """
                UPDATE user
                SET last_connect_time = ?
                WHERE uid = ?
            """,
            (current_time, uid)
        )

    def update_solver(self, sid):
       self.cursor.execute(
            """
                UPDATE solver
                SET used_count = used_count + 1
                WHERE sid = ?
            """,
            (sid, )
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
            (uid, )
        )
        
        rows = self.cursor.fetchall()
        result = []
        for row in rows:
            result.append({
                "iid": row[0],
                "uid": row[1],
                "sid": row[2],
                "input_text": row[3],
                "in_time": datetime.fromtimestamp(row[4]).isoformat()
            })

        return result

    def get_user_outputs(self, uid):
        self.cursor.execute(
            """
                SELECT o.oid, o.iid, o.success, o.execution_time, o.out_time
                FROM output o JOIN input i ON o.iid = i.iid
                WHERE i.uid = ?
            """,
            (uid, )
        )

        rows = self.cursor.fetchall()
        result = []
        for row in rows:
            result.append({
                "oid": row[0],
                "iid": row[1],
                "success": row[2],
                "execution_time": row[3],
                "out_time": datetime.fromtimestamp(row[4]).isoformat()
            })

        return result

    def get_average_execution(self, sid, success_only):
        query = """
                SELECT AVG(o.execution_time) 
                FROM output o JOIN input i ON o.iid = i.iid
                WHERE i.sid = ?
        """
        
        parameters = [sid]
        if success_only:
            query += " AND o.success = 1"

        self.cursor.execute(query, parameters)
        aggregate = self.cursor.fetchone()
        result = None
        if aggregate:
            result = aggregate[0]
        
        return result
