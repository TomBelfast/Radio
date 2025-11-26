from fastapi import APIRouter, Depends, HTTPException
from schemas import UserSettingsResponse, UserSettingsCreate
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
        for key, value in settings_update.dict(exclude_unset=True).items():
            setattr(settings, key, value)
            
    await db.commit()
    await db.refresh(settings)
    return settings
