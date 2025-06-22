# Speech-to-Text PWA (Vite + React + TypeScript)

## Development

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173 in your browser (Chrome on Android recommended).

## Configuration

Create a `.env` file in the `app/` directory (this file is gitignored) containing:

```bash
VITE_OPENAI_API_KEY=<your OpenAI API key>
```

## Production Build & Preview

```bash
npm run build
npm run preview
```

## Usage

- Click the microphone button to start recording.
- Click again to stop recording.
- Make sure your OpenAI API key is set in `.env` (see "Configuration").
- Transcript appears once fully transcribed (Whisper-1 does not support streaming).