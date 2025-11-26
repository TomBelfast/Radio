INSTRUKCJA: Aplikacja - Alert o Ruchu (Głosowe Komunikaty)
1. ARCHITEKTURA SYSTEMU
text
┌─────────────────────────────────────────────────────────────┐
│                     FLOW APLIKACJI                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Scheduler (cron)     Google Maps Routes API                 │
│       ↓                      ↓                               │
│   [Trigger]  ────→  [Pobierz dane o ruchu]                 │
│                            ↓                                 │
│                  [Parsuj korki/wypadki]                     │
│                            ↓                                 │
│              [Generuj tekst komunikatu]                     │
│                            ↓                                 │
│    Kokoro TTS / Google Cloud TTS   ← [Konwertuj na głos]  │
│                            ↓                                 │
│              [Audio.mp3 / Odtwarzanie]                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
2. TECHNOLOGIA I API DO UŻYCIA
API #1: Google Maps Routes API (Dane o ruchu)
Endpoint: https://routes.googleapis.com/directions/v2:computeRoutes

Funkcja: Pobieranie natężenia ruchu, opóźnień, wypadków w REALTIME

Typ: REST API + JSON

Dokumentacja: developers.google.com/maps/documentation/routes/traffic-opt

Dane zwracane:

travelAdvisory.speedReadingIntervals - natężenie ruchu

duration - czas przejazdu

Informacje o incydentach drogowych

API #2: Kokoro TTS (Text-to-Speech - głos)
Opcja 1 (Bezpłatna): Kokoro Open Source (lokalnie)

Model: 82M parametrów

Instalacja: pip install kokoro-tts

Szybkość: 210× real-time (GPU), 3-11× (CPU)

Obsługuje: Angielski, brytyjski akcent

Opcja 2 (Cloud/Płatna): Google Cloud Text-to-Speech API

220+ głosów, 40+ języków

REST API

Alternatywa: Unreal Speech (tańsza)

API #3: Google Cloud Text-to-Speech (Alternatywa)
Endpoint: https://www.googleapis.com/language/translate/v2/detect

Obsługuje: Polski, angielski itp.

3. SETUP - KROK PO KROKU
KROK 1: Konfiguracja Google Cloud
bash
# 1. Przejdź do Google Cloud Console
https://console.cloud.google.com

# 2. Utwórz nowy projekt
Projekt: "Traffic-Alerts-Belfast"

# 3. Aktywuj APIs:
   - ✅ Routes API
   - ✅ Cloud Text-to-Speech API
   
# 4. Utwórz API Key
   Credential Type: "API Key"
   Restrict: HTTP referrers + IP addresses
   
# 5. Kopiuj klucz API
   Zmienna: GOOGLE_MAPS_API_KEY
   Zmienna: GOOGLE_TTS_API_KEY
KROK 2: Instalacja Kokoro TTS (lokalnie)
bash
# Python 3.9-3.12 wymagany
python --version

# Instalacja Kokoro
pip install kokoro-tts

# Lub z repozytorium
pip install git+https://github.com/nazdridoy/kokoro-tts

# Test
kokoro-tts --help
KROK 3: Setup n8n (Workflow Automation)
bash
# Instalacja n8n
npm install -g n8n

# Uruchomienie
n8n start
# Otwórz: http://localhost:5678

# Zainstaluj community nodes:
# Settings → Community Nodes → Search → Instancje wymagane dla:
# - Google Maps (jeśli dostępna)
# - HTTP Request
4. ARCHITEKTURA WORKFLOW - OPCJA A (n8n)
Struktura Workflow w n8n:
text
┌─ [1. Trigger: Cron Job]
│    └─ Uruchamiaj: Codziennie 07:45 (15 min przed 8 AM)
│
├─ [2. HTTP Request - Routes API]
│    ├─ Method: POST
│    ├─ URL: https://routes.googleapis.com/directions/v2:computeRoutes
│    ├─ Headers:
│    │    Content-Type: application/json
│    │    X-Goog-Api-Key: {{ env.GOOGLE_MAPS_API_KEY }}
│    │    X-Goog-FieldMask: routes.duration,routes.legs.travelAdvisory
│    └─ Body (JSON):
│         {
│           "origin": {
│             "location": {"latLng": {"latitude": 54.5973, "longitude": -5.9301}}
│           },
│           "destination": {
│             "location": {"latLng": {"latitude": 54.5973, "longitude": -5.9301}}
│           },
│           "departureTime": "2025-11-26T08:00:00Z",
│           "travelMode": "DRIVE",
│           "routingPreference": "TRAFFIC_AWARE"
│         }
│
├─ [3. Function Node - Parse Traffic Data]
│    └─ JavaScript:
│        return {
│          duration: item.routes[0].duration,
│          incidents: extractIncidents(item.routes[0].legs),
│          message: generateAlert(item.routes[0])
│        }
│
├─ [4. HTTP Request - TTS (Kokoro API)]
│    ├─ Method: POST
│    ├─ URL: https://api.v8.unrealspeech.com/stream
│    │    ALBO: Lokalny endpoint Kokoro
│    ├─ Body:
│         {
│           "text": "{{ $node['3. Function'].json.message }}",
│           "voice": "Adam",
│           "pace": 1.0
│         }
│
└─ [5. Output: Save MP3 / Send Notification]
     ├─ Zapisz audio: /tmp/traffic-alert.mp3
     └─ Opcjonalnie: Wyślij notyfikację, push, email
5. ARCHITEKTURA WORKFLOW - OPCJA B (Python Script)
Jeśli wolisz robić lokalnie bez n8n:

python
# traffic_alerts.py

import requests
import os
import json
from datetime import datetime
from kokoro import KokoroTTS

# Konfiguracja
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
BELFAST_LAT = 54.5973
BELFAST_LON = -5.9301
ALERT_TIME = "08:00:00"

class TrafficAlertSystem:
    def __init__(self):
        self.tts = KokoroTTS()
        self.api_key = GOOGLE_API_KEY
    
    # 1. Pobierz dane o ruchu z Google Routes API
    def fetch_traffic_data(self):
        url = "https://routes.googleapis.com/directions/v2:computeRoutes"
        
        payload = {
            "origin": {
                "location": {"latLng": {
                    "latitude": BELFAST_LAT,
                    "longitude": BELFAST_LON
                }}
            },
            "destination": {
                "location": {"latLng": {
                    "latitude": BELFAST_LAT,
                    "longitude": BELFAST_LON
                }}
            },
            "departureTime": f"{datetime.now().isoformat()}Z",
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE"
        }
        
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.api_key,
            "X-Goog-FieldMask": "routes.duration,routes.legs.travelAdvisory,routes.legs.steps"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
    
    # 2. Parsuj dane o incydentach
    def parse_incidents(self, routes_data):
        alerts = {
            "traffic_level": "unknown",
            "incidents": [],
            "travel_time": "unknown"
        }
        
        try:
            route = routes_data["routes"][0]
            
            # Pobierz czas przejazdu
            duration_str = route.get("duration", "")
            alerts["travel_time"] = duration_str
            
            # Parsuj incydenty z nóg trasy
            for leg in route.get("legs", []):
                travel_advisory = leg.get("travelAdvisory", {})
                
                # Sprawdź natężenie ruchu
                speed_intervals = travel_advisory.get("speedReadingIntervals", [])
                if speed_intervals:
                    for interval in speed_intervals:
                        speed = interval.get("speed", 0)
                        if speed < 20:  # km/h - korek
                            alerts["traffic_level"] = "heavy"
                            alerts["incidents"].append({
                                "type": "traffic_jam",
                                "severity": "high"
                            })
                        elif speed < 40:
                            alerts["traffic_level"] = "moderate"
                
                # Ogólne ostrzeżenia
                if travel_advisory.get("tollInfo"):
                    alerts["incidents"].append({
                        "type": "toll",
                        "info": travel_advisory.get("tollInfo")
                    })
        
        except KeyError as e:
            print(f"Error parsing: {e}")
        
        return alerts
    
    # 3. Generuj wiadomość alert
    def generate_alert_message(self, alerts):
        message = "Traffic Alert for Belfast at 8 AM. "
        
        if alerts["traffic_level"] == "heavy":
            message += "Heavy traffic detected. "
        elif alerts["traffic_level"] == "moderate":
            message += "Moderate traffic expected. "
        else:
            message += "Traffic is normal. "
        
        message += f"Estimated travel time: {alerts['travel_time']}. "
        
        if alerts["incidents"]:
            for incident in alerts["incidents"]:
                if incident["type"] == "traffic_jam":
                    message += "Avoid major routes. "
                elif incident["type"] == "accident":
                    message += "Accident reported on your route. "
        
        return message
    
    # 4. Konwertuj tekst na głos (Kokoro)
    def text_to_speech(self, text):
        output_file = "/tmp/traffic_alert.wav"
        
        # Kokoro lokalnie
        self.tts.tts(text, output_file, voice="Adam", pace=1.0)
        
        print(f"Audio saved: {output_file}")
        return output_file
    
    # 5. Główna funkcja
    def run_alert(self):
        print("[1/5] Fetching traffic data...")
        traffic_data = self.fetch_traffic_data()
        
        print("[2/5] Parsing incidents...")
        alerts = self.parse_incidents(traffic_data)
        
        print("[3/5] Generating message...")
        message = self.generate_alert_message(alerts)
        print(f"Message: {message}")
        
        print("[4/5] Converting to voice...")
        audio_file = self.text_to_speech(message)
        
        print("[5/5] Done!")
        print(f"Alert ready: {audio_file}")
        
        return audio_file


# Uruchomienie
if __name__ == "__main__":
    system = TrafficAlertSystem()
    system.run_alert()
6. KONFIGURACJA SCHEDULERA (Codziennie 7:45 AM)
Opcja A: Cron (Linux/Mac)
bash
# Edytuj crontab
crontab -e

# Dodaj linię (codziennie 7:45 AM)
45 7 * * * cd /path/to/project && python traffic_alerts.py >> /var/log/traffic_alerts.log 2>&1
Opcja B: Windows Task Scheduler
bash
# Utwórz task
taskkill /F /IM traffic_alerts.exe
Opcja C: n8n Trigger
json
{
  "trigger": {
    "type": "cron",
    "time": "07:45",
    "timezone": "Europe/London",
    "recurrence": "daily"
  }
}
7. DANE WEJŚCIOWE - BELFAST 8 AM
Współrzędne:
text
Latitude:  54.5973
Longitude: -5.9301
Location: Belfast City Centre, Northern Ireland
Time: 08:00 GMT
Główne arterie w Belfaście (do monitorowania):
text
- A2 (północ-południe)
- A5 (wschód-zachód)
- M5 (obwodnica)
- Queen Street / Donegall Pass
- Falls Road / Shankill Road
8. ODPOWIEDZI Z API - PRZYKŁAD
Google Routes API Response:
json
{
  "routes": [
    {
      "legs": [
        {
          "duration": "45m 30s",
          "distanceMeters": 8750,
          "travelAdvisory": {
            "speedReadingIntervals": [
              {
                "speed": 25,  // km/h - KOREK
                "percentageOfSegment": 35
              },
              {
                "speed": 45,  // km/h - normalnie
                "percentageOfSegment": 65
              }
            ],
            "tollInfo": {
              "estimatedPrice": {
                "currencyCode": "GBP",
                "units": 3,
                "nanos": 500000000
              }
            }
          },
          "steps": [
            {
              "startLocation": {"latLng": {"latitude": 54.5973, "longitude": -5.9301}},
              "navigationInstruction": {
                "instructions": "Drive north on A2"
              }
            }
          ]
        }
      ]
    }
  ]
}
9. KOMUNIKAT GŁOSOWY - PRZYKŁAD
text
"Good morning. This is your 8 AM traffic alert for Belfast.
Heavy traffic detected in the city center.
Estimated travel time on main routes: 45 minutes.
Avoid the A2 northbound near city center.
Accident reported on Falls Road.
Consider alternative routes or delay departure if possible.
Have a safe commute."
10. KOSZT OPERACYJNY (szacunek)
Komponent	Koszt
Google Maps Routes API	$5-15 CPM (Commercial)
Google Cloud TTS	$4.00 za mln znaków
Kokoro TTS (lokalnie)	$0 (open-source)
Infrastruktura (VPS/Server)	$5-20/miesiąc
RAZEM (n8n cloud)	~$15-30/miesiąc
RAZEM (lokalnie + Kokoro)	~$0-5/miesiąc
11. DEPLOYMENT - OPCJE
Opcja 1: n8n Cloud (najprostsze)
text
- Utwórz workflow w n8n
- Zaplanuj cron
- API keys w zmiennych środowiskowych
- Gotowe! Działa w chmurze
Opcja 2: Python + VPS (kontrola)
bash
# VPS (Linode, Digital Ocean, AWS)
ssh root@your-server

# Zainstaluj Python, Kokoro, setup:
git clone <repo>
cd traffic-alerts
pip install -r requirements.txt
python traffic_alerts.py

# Zaplanuj cron job
crontab -e
Opcja 3: Docker (skalowanie)
text
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY traffic_alerts.py .
CMD ["python", "traffic_alerts.py"]
bash
# Build & Run
docker build -t traffic-alerts .
docker run -e GOOGLE_MAPS_API_KEY=xxx traffic-alerts
12. ZMIENNE ŚRODOWISKOWE (.env)
bash
# .env
GOOGLE_MAPS_API_KEY=AIzaSyD_K7X_xxxxxx
GOOGLE_TTS_API_KEY=AIzaSyD_K7X_xxxxxx
BELFAST_LAT=54.5973
BELFAST_LON=-5.9301
ALERT_TIME=08:00:00
TIMEZONE=Europe/London
OUTPUT_FORMAT=mp3  # lub wav
13. TESTOWANIE
bash
# Test API
curl -X POST https://routes.googleapis.com/directions/v2:computeRoutes \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: YOUR_KEY" \
  -d '{...}'

# Test Kokoro lokalnie
kokoro-tts "Test message" output.wav --voice Adam

# Test workflow n8n
(kliknij "Execute Workflow" w UI)
14. NEXT STEPS
✅ Utwórz projekt w Google Cloud

✅ Pobierz API keys

✅ Zainstaluj Kokoro TTS

✅ Wybierz deployment (n8n lub Python VPS)

✅ Skonfiguruj scheduler (cron/n8n)

✅ Przetestuj workflow

✅ Wdróż na produkcję
