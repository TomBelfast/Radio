from fastapi import APIRouter, HTTPException, Response
from schemas import SynthesisRequest
from services import elevenlabs_service

router = APIRouter(prefix="/api", tags=["synthesis"])

@router.post("/synthesis")
async def synthesize_audio(request: SynthesisRequest):
    try:
        audio_content = await elevenlabs_service.synthesize_speech(
            request.text, request.voice_id, request.model_id
        )
        return Response(content=audio_content, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
