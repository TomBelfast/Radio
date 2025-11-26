from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import traffic, weather, synthesis, settings

app = FastAPI(title="Radio Traffic & Weather Generator API", version="2.0")

# CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(traffic.router)
app.include_router(weather.router)
app.include_router(synthesis.router)
app.include_router(settings.router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Radio Traffic & Weather Generator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
