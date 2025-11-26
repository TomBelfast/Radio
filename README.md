# Radio Traffic & Weather Generator v2.0

AI-powered traffic and weather report generator for radio stations.

## Tech Stack

**Backend:**
- FastAPI (Python 3.11+)
- PostgreSQL (Neon)
- SQLAlchemy (Async)
- OpenAI API
- ElevenLabs API
- Google Maps API
- OpenWeatherMap API

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Stack Auth (Neon)

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database (Neon recommended)
- API keys for: OpenAI, ElevenLabs, Google Maps, OpenWeatherMap
- Stack Auth (Neon) Project ID and Keys

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in `backend` directory (see `.env.example`):
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
GOOGLE_MAPS_API_KEY=...
OPENWEATHERMAP_API_KEY=...
```

5. Run database migrations (create tables):
```bash
python -c "from database import engine, Base; from models import *; import asyncio; asyncio.run(Base.metadata.create_all(bind=engine._connection_creator.sync_engine))"
```

6. Start the server:
```bash
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (see `env.example`):
```env
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. Sign in using Stack Auth authentication
2. Go to Settings tab and configure:
   - Default city
   - ElevenLabs voice ID
3. Use Traffic or Weather tabs to generate reports
4. Click "Generate" to create AI-written content
5. Audio will be automatically synthesized if voice ID is configured
6. Download generated audio files

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/generate/traffic` - Generate traffic report
- `POST /api/generate/weather` - Generate weather report
- `POST /api/synthesis` - Synthesize text to speech
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

## License

Proprietary - Internal Tool
