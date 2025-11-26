from fastapi import APIRouter, Depends, HTTPException
from schemas import UserSettingsResponse, UserSettingsCreate
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import UserSettings

router = APIRouter(prefix="/api/user", tags=["settings"])

@router.get("/settings", response_model=UserSettingsResponse)
async def get_settings(clerk_user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSettings).where(UserSettings.clerk_user_id == clerk_user_id))
    settings = result.scalars().first()
    if not settings:
        # Create default settings if not exists
        settings = UserSettings(clerk_user_id=clerk_user_id)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return settings

@router.put("/settings", response_model=UserSettingsResponse)
async def update_settings(settings_update: UserSettingsCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSettings).where(UserSettings.clerk_user_id == settings_update.clerk_user_id))
    settings = result.scalars().first()
    
    if not settings:
        settings = UserSettings(**settings_update.dict())
        db.add(settings)
    else:
        for key, value in settings_update.dict(exclude_unset=True).items():
            setattr(settings, key, value)
            
    await db.commit()
    await db.refresh(settings)
    return settings
