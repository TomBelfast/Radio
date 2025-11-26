from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum
from datetime import datetime

class GenerationType(str, Enum):
    traffic = "traffic"
    weather = "weather"
    manual = "manual"

class TrafficRequest(BaseModel):
    city: str
    prompt_style: Optional[str] = None

class WeatherRequest(BaseModel):
    city: str
    timeframe: str = "current" # current, today
    prompt_style: Optional[str] = None

class SynthesisRequest(BaseModel):
    text: str
    voice_id: str
    model_id: str = "eleven_multilingual_v2"

class UserSettingsBase(BaseModel):
    default_city: Optional[str] = None
    default_voice_id: Optional[str] = None
    default_language: str = "pl"

class UserSettingsCreate(UserSettingsBase):
    user_id: str

class UserSettingsResponse(UserSettingsBase):
    id: int
    user_id: str

    class Config:
        from_attributes = True

class GenerationHistoryResponse(BaseModel):
    id: int
    created_at: datetime
    type: GenerationType
    input_data: Dict[str, Any]
    generated_text: str
    audio_url: Optional[str] = None

    class Config:
        from_attributes = True
