from fastapi import APIRouter, Depends, HTTPException
from schemas import WeatherRequest
from services import weather_service, openai_service
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from models import GenerationHistory, GenerationType
import json

router = APIRouter(prefix="/api/generate", tags=["weather"])

@router.post("/weather")
async def generate_weather(request: WeatherRequest, db: AsyncSession = Depends(get_db)):
    # 1. Get Weather Data
    weather_data = await weather_service.get_weather_data(request.city)
    
    # 2. Generate Text
    generated_text = await openai_service.generate_weather_report(
        request.city, weather_data, request.prompt_style
    )
    
    # 3. Save to History
    user_id = "user_placeholder"
    
    history_entry = GenerationHistory(
        user_id=user_id,
        type=GenerationType.weather,
        input_data={"city": request.city, "timeframe": request.timeframe},
        generated_text=generated_text
    )
    db.add(history_entry)
    await db.commit()
    await db.refresh(history_entry)
    
    return {"text": generated_text, "data": weather_data, "history_id": history_entry.id}
