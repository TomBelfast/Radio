CZĘŚĆ 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)
Nazwa Projektu: Radio Traffic & Weather Generator (RTWG) Wersja: 2.0 (Architecture Ready) Data: 26.11.2025

1. Wprowadzenie
Aplikacja webowa typu SaaS (Internal Tool) dla stacji radiowych. Umożliwia prezenterom generowanie plików audio (MP3) z raportami drogowymi i pogodowymi przy użyciu AI. System łączy dane czasu rzeczywistego (Google Maps, OpenWeatherMap), przetwarza je przez LLM (OpenAI) w celu nadania radiowego stylu, a następnie syntezuje mowę (ElevenLabs).

2. Stos Technologiczny (Tech Stack)
2.1 Frontend (Klient)
Framework: Next.js 14+ (App Router, TypeScript).

Styling: Tailwind CSS + shadcn/ui (Komponenty).

Ikony: Lucide React.

State Management: React Hooks / Zustand.

HTTP Client: Axios lub Fetch.

Auth: Clerk (Komponenty React).

2.2 Backend (API)
Framework: FastAPI (Python 3.10+).

Walidacja: Pydantic V2.

Database ORM: SQLAlchemy (Async).

Auth Verification: pyjwt (weryfikacja tokenów Clerk).

HTTP Client: httpx (Async).

2.3 Infrastruktura i Dane
Baza Danych: Neon (Serverless PostgreSQL).

Zmienne środowiskowe: .env (zarządzane przez pydantic-settings na backendzie).

3. Schemat Bazy Danych (PostgreSQL)
W bazie Neon utworzymy 3 główne tabele:

Tabela: user_settings (Preferencje użytkownika)

id (PK, int)

clerk_user_id (String, Unique, Index) – ID z Clerk.

default_city (String, nullable) – np. "Belfast".

default_voice_id (String, nullable) – ID głosu ElevenLabs.

default_language (String) – "pl" lub "en".

Tabela: prompt_presets (Style AI Director)

id (PK, int)

user_id (FK -> user_settings.clerk_user_id)

name (String) – np. "Poranek - Szybki".

system_prompt (Text) – Treść instrukcji dla OpenAI.

type (Enum: "traffic", "weather", "manual").

Tabela: generation_history (Logi)

id (PK, int)

user_id (FK)

created_at (DateTime)

type (Enum: "traffic", "weather", "manual")

input_data (JSON) – Jakie miasto/tekst wpisano.

generated_text (Text) – Co wygenerowało OpenAI.

audio_url (String, nullable) – Link do pliku (jeśli przechowujemy).

4. Architektura Funkcjonalna i API
4.1. Endpointy Backend (FastAPI)
Wszystkie endpointy (poza /health) wymagają nagłówka Authorization: Bearer <clerk_token>.

GET /api/health – Status serwisu.

POST /api/generate/traffic

Input: { city: str, prompt_style: str (opcjonalny custom prompt) }

Proces: Google Routes API -> OpenAI (Redakcja) -> Zwraca tekst (JSON).

POST /api/generate/weather

Input: { city: str, timeframe: str ("current", "today"), prompt_style: str }

Proces: OpenWeatherMap -> OpenAI (Redakcja) -> Zwraca tekst (JSON).

POST /api/synthesis

Input: { text: str, voice_id: str, model_id: str }

Proces: ElevenLabs API -> Zwraca strumień audio (bytes).

GET /api/user/settings – Pobiera ustawienia z Neon DB.

PUT /api/user/settings – Zapisuje ustawienia.

5. Design System (UI Reference)
Interfejs ma odwzorowywać styl "Dark Mode SaaS" z dostarczonych zrzutów ekranu.

Tło: #09090b (Zinc-950).

Kontenery (Karty): #18181b (Zinc-900) z delikatnym borderem #27272a.

Inputy: Ciemne tło, szary border, biały tekst.

Layout:

Navbar: Logo po lewej, UserButton (Clerk) po prawej.

Main Container: Wycentrowany, szerokość max 1000px.

Tabs: Przełącznik na górze kontenera: [Traffic | Weather | Manual].

Sekcje: Każda grupa ustawień (Location, AI Style, Voice) w osobnej karcie (Card) z tytułem.
