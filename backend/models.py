from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class GenerationType(str, enum.Enum):
    traffic = "traffic"
    weather = "weather"
    manual = "manual"

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    default_city = Column(String, nullable=True)
    default_voice_id = Column(String, nullable=True)
    default_language = Column(String, default="pl")

    prompt_presets = relationship("PromptPresets", back_populates="user")
    history = relationship("GenerationHistory", back_populates="user")

class PromptPresets(Base):
    __tablename__ = "prompt_presets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user_settings.user_id"))
    name = Column(String, nullable=False)
    system_prompt = Column(Text, nullable=False)
    type = Column(Enum(GenerationType), nullable=False)

    user = relationship("UserSettings", back_populates="prompt_presets")

class GenerationHistory(Base):
    __tablename__ = "generation_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user_settings.user_id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    type = Column(Enum(GenerationType), nullable=False)
    input_data = Column(JSON, nullable=False)
    generated_text = Column(Text, nullable=False)
    audio_url = Column(String, nullable=True)

    user = relationship("UserSettings", back_populates="history")
