from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/code_executor?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URI)
db = client.code_executor
snippets = db.snippets

async def save_snippet(code: str, language: str, results: dict):
    await snippets.insert_one({
        "code": code,
        "language": language,
        "results": results,
        "created_at": datetime.utcnow()
    })