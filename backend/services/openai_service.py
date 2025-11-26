from openai import AsyncOpenAI
import os
import json

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_traffic_report(city: str, traffic_data: dict, style: str = None) -> str:
    system_prompt = "Jesteś doświadczonym prezenterem radiowym. Twoim zadaniem jest zredagowanie raportu drogowego na podstawie dostarczonych danych. Raport ma być krótki, dynamiczny i naturalny. Mów do słuchaczy."
    if style:
        system_prompt += f" Styl: {style}"
    
    user_prompt = f"Miasto: {city}. Dane o korkach: {json.dumps(traffic_data, ensure_ascii=False)}. Przygotuj wejście antenowe."

    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content

async def generate_weather_report(city: str, weather_data: dict, style: str = None) -> str:
    system_prompt = "Jesteś charyzmatycznym prezenterem pogody. Przygotuj prognozę dla słuchaczy. Bądź konkretny ale lekki w formie."
    if style:
        system_prompt += f" Styl: {style}"

    user_prompt = f"Miasto: {city}. Dane pogodowe: {json.dumps(weather_data, ensure_ascii=False)}. Przygotuj prognozę."

    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content
