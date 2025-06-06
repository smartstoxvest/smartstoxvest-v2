# create_tables.py
from db import init_db

if __name__ == "__main__":
    print("Creating tables in Neon...")
    init_db()
    print("✅ Done.")
