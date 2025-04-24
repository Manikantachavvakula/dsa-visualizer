# database.py
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Use environment variables for credentials
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/code_executor")

try:
    client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client.code_executor
    snippets = db.snippets
    
    # Test connection
    client.server_info()
    database_enabled = True
except Exception as e:
    print(f"Warning: MongoDB connection failed: {str(e)}")
    print("Database operations will be skipped.")
    database_enabled = False

async def save_snippet(code: str, language: str, results: dict):
    if not database_enabled:
        return
        
    try:
        await snippets.insert_one({
            "code": code,
            "language": language,
            "results": results,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print(f"Error saving to database: {str(e)}")