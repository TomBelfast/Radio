import httpx
import os

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

async def synthesize_speech(text: str, voice_id: str, model_id: str = "eleven_multilingual_v2") -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    data = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, headers=headers, timeout=60.0)
        response.raise_for_status()
        return response.content
