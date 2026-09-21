# Runbook

## Prerequisites

- Node.js 20+
- npm
- A working shell with access to the repo root
- Optional: Firebase project access for Firestore persistence

## Environment setup

```powershell
cd "C:\Users\HP\Desktop\Workspace\VIT MODULE 5\EDI\verirag (8)"
npm install
Copy-Item .env.example .env
# Edit .env and provide Firebase values when Firestore persistence is required.
```

## Frontend and backend startup

```powershell
cd "C:\Users\HP\Desktop\Workspace\VIT MODULE 5\EDI\verirag (8)"
npm run dev
```

The app runs at `http://localhost:3000`.

## Production build

```powershell
cd "C:\Users\HP\Desktop\Workspace\VIT MODULE 5\EDI\verirag (8)"
npm run build
npm start
```

## Type checks

```powershell
cd "C:\Users\HP\Desktop\Workspace\VIT MODULE 5\EDI\verirag (8)"
npm run lint
```

## Python training setup

```powershell
cd "C:\Users\HP\Desktop\Workspace\VIT MODULE 5\EDI\verirag (8)\training"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train.py
python evaluate.py
```

## Troubleshooting

- If model downloads stall, check internet connectivity and the `.cache/transformers` folder.
- If Firestore reads fail, confirm project configuration and permissions.
- If uploads fail, check the browser devtools network request and the server logs.
- If the app does not start, run `npm install` and `npm run lint`.

## Shutdown

```powershell
Stop-Process -Name node
```

## Required environment variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_FIRESTORE_DATABASE_ID` (use `(default)` for the default database)
- `FIREBASE_AUTH_MODE=anonymous`
- `MODEL_CACHE_DIR` (optional)

Without these values, the application runs with in-memory document state and skips Firestore persistence. Do not commit secrets to source control.

Before starting a Firebase-backed deployment, enable **Authentication > Sign-in method > Anonymous** in the Firebase console. The server refuses to access Firestore when Firebase is configured without an authentication mode.

If startup reports `auth/admin-restricted-operation`, Anonymous Authentication is disabled for the configured Firebase project. Enable it in the console and restart `npm run dev`; do not loosen Firestore rules to bypass this error.
