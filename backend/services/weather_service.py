import httpx
import os

OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

async def get_weather_data(city: str) -> dict:
    if not OPENWEATHERMAP_API_KEY:
         return {"status": "mock", "temp": 20, "condition": "Sunny", "wind": "10km/h"}

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": OPENWEATHERMAP_API_KEY,
        "units": "metric",
        "lang": "pl"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
             # Fallback or error handling
             return {"error": f"API Error: {response.status_code}"}
        return response.json()
