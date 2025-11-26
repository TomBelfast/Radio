"""
Database initialization script.
Run this to create all tables in the PostgreSQL database.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from database import DATABASE_URL, Base
from models import UserSettings, PromptPresets, GenerationHistory

async def init_database():
    print("🔄 Connecting to database...")
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        print("🗑️  Dropping existing tables (if any)...")
        await conn.run_sync(Base.metadata.drop_all)
        
        print("✨ Creating new tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("✅ Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(init_database())
