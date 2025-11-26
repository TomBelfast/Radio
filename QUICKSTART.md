# Quick Start Guide

## 🚀 Szybki Start

### 1. Backend Setup

```bash
cd backend

# Utwórz środowisko wirtualne
python -m venv venv

# Aktywuj środowisko
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Zainstaluj zależności
pip install -r requirements.txt

# Skopiuj i uzupełnij plik .env
copy .env.example .env  # Windows
# lub
cp .env.example .env    # Linux/Mac

# Edytuj .env i wypełnij wymagane klucze API
```

### 2. Konfiguracja Bazy Danych

Utwórz bazę danych w Neon (https://neon.tech):
1. Zarejestruj się i utwórz nowy projekt
2. Skopiuj connection string
3. Wklej do `backend/.env` jako `DATABASE_URL=postgresql+asyncpg://...`

Zainicjalizuj tabele:
```bash
cd backend
python init_db.py
```

### 3. Klucze API

Uzyskaj klucze API:
- **OpenAI**: https://platform.openai.com/api-keys
- **ElevenLabs**: https://elevenlabs.io/app/settings/api-keys
- **Google Maps**: https://console.cloud.google.com/apis/credentials
- **OpenWeatherMap**: https://home.openweathermap.org/api_keys
- **Clerk**: https://dashboard.clerk.com

### 4. Frontend Setup

```bash
cd frontend

# Zainstaluj zależności
npm install

# Skopiuj i uzupełnij .env.local
copy env.example .env.local  # Windows
# lub
cp env.example .env.local    # Linux/Mac

# Wklej klucze Clerk do .env.local
```

### 5. Uruchomienie

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```
Backend: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend: http://localhost:3000

### 6. Pierwsze Logowanie

1. Otwórz http://localhost:3000
2. Kliknij "Sign In"
3. Zarejestruj się przez Clerk
4. Przejdź do zakładki "Settings"
5. Uzupełnij:
   - Default City (np. "Belfast")
   - ElevenLabs Voice ID (znajdziesz w ElevenLabs dashboard)

### 7. Generowanie Reportu

1. Przejdź do zakładki "Traffic" lub "Weather"
2. Wpisz nazwę miasta
3. Kliknij "Generate"
4. Poczekaj na wygenerowanie tekstu i audio
5. Odtwórz lub pobierz plik MP3

## 🔧 Troubleshooting

**Problem:** `DATABASE_URL not set`  
**Rozwiązanie:** Upewnij się, że `.env` istnieje w folderze `backend/` i zawiera poprawny connection string.

**Problem:** `401 Unauthorized` z OpenAI  
**Rozwiązanie:** Sprawdź czy `OPENAI_API_KEY` w `.env` jest poprawny i aktywny.

**Problem:** Frontend nie łączy się z backendem  
**Rozwiązanie:** Sprawdź czy backend działa na porcie 8000 i czy CORS jest poprawnie skonfigurowany.

**Problem:** Clerk nie działa  
**Rozwiązanie:** Sprawdź czy klucze `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` i `CLERK_SECRET_KEY` są poprawne.

## 📝 Testowanie

Test backendu:
```bash
curl http://localhost:8000/api/health
# Powinno zwrócić: {"status":"ok","service":"Radio Traffic & Weather Generator API"}
```

## 🎯 Struktura Projektu

```
Radio/
├── backend/           # FastAPI backend
│   ├── routers/      # API endpoints
│   ├── services/     # External API integrations
│   ├── models.py     # Database models
│   ├── schemas.py    # Pydantic schemas
│   ├── database.py   # DB configuration
│   └── main.py       # Entry point
├── frontend/         # Next.js frontend
│   ├── app/          # Pages & layouts
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── store/        # State management
└── README.md
```
