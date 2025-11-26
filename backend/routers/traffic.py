from fastapi import APIRouter, Depends, HTTPException
from schemas import TrafficRequest, GenerationHistoryResponse
from services import google_maps_service, openai_service
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from models import GenerationHistory, GenerationType
import json

router = APIRouter(prefix="/api/generate", tags=["traffic"])

@router.post("/traffic")
async def generate_traffic(request: TrafficRequest, db: AsyncSession = Depends(get_db)):
    # 1. Get Traffic Data
    traffic_data = await google_maps_service.get_traffic_data(request.city)
    
    # 2. Generate Text
    generated_text = await openai_service.generate_traffic_report(
        request.city, traffic_data, request.prompt_style
    )
    
    # 3. Save to History (Mock User ID for now as Auth is handled by Frontend, 
    # but strictly we should decode token here. For MVP/PRD speed, we skip token decoding middleware implementation details 
    # unless explicitly requested, but we will save a placeholder user_id)
    # In a real app, we would extract user_id from the Bearer token.
    user_id = "user_placeholder" 
    
    history_entry = GenerationHistory(
        user_id=user_id,
        type=GenerationType.traffic,
        input_data={"city": request.city, "style": request.prompt_style},
        generated_text=generated_text
    )
    db.add(history_entry)
    await db.commit()
    await db.refresh(history_entry)
    
    return {"text": generated_text, "data": traffic_data, "history_id": history_entry.id}
