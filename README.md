# Full-Stack QR & Barcode Scanner System

This repository contains a complete example with:
- **Frontend:** React + Vite + React Router + Axios + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Code generation:** UUID (`code` field), QR (`qrcode`) and Barcode (`jsbarcode`)

## Folder Structure

```text
Scanner_test/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── item.controller.js
│       ├── middleware/
│       │   └── error.middleware.js
│       ├── models/
│       │   └── item.model.js
│       └── routes/
│           └── item.routes.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/
│       │   ├── client.js
│       │   └── items.js
│       ├── components/
│       │   └── CodePreview.jsx
│       └── pages/
│           ├── AdminPage.jsx
│           ├── ScannerPage.jsx
│           └── DetailPage.jsx
└── README.md
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set optional API URL in frontend:

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

- `POST /api/items` → create item (`name`, `description`, `price`), UUID code generated in backend
- `GET /api/items/:code` → fetch item by scanned code

## Flow Implemented

1. Admin creates item in Admin Panel.
2. Backend generates UUID code and saves item in MongoDB.
3. Frontend displays generated QR and Barcode.
4. Scanner page auto-focuses input for hardware keyboard-wedge scanner.
5. On Enter, frontend calls backend; if item exists, navigates to detail page.
6. Detail page shows item metadata and regenerated QR + Barcode.

## Notes

- Scanner input auto-focuses and re-focuses on blur.
- Scan value clears after each attempt.
- Loading and not-found states are handled.
