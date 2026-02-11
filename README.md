# HEALTH_CARE_APP

A full‑stack Healthcare application scaffold combining a React (Vite) frontend with a Node.js + Express + MongoDB backend. Designed as a scalable starter for building healthcare‑related features such as authentication, file uploads, OCR, PDF handling, and email notifications.

## Short Description
HEALTH_CARE_APP is intended for developers and teams who need a modern, production‑ready MERN scaffold for rapid prototyping and hackathons. It includes common integrations (authentication, Cloudinary, OCR via Tesseract.js, PDF handling, and email) and a frontend built with Vite, Redux Toolkit, Tailwind CSS, and Ant Design.

## Features
- JWT authentication and password hashing (bcrypt)
- Modular MVC backend structure (routes, controllers, models)
- File and image uploads (Multer + Cloudinary)
- OCR text extraction (Tesseract.js)
- PDF viewing and processing
- Email delivery via Nodemailer
- Global state management with Redux Toolkit and persistence
- Frontend UI with Tailwind CSS and Ant Design
- API client using Axios
- Basic XSS protection using DOMPurify
- Dev-friendly scripts and environment configuration

## Tech Stack
- Frontend: React 18 (Vite), Redux Toolkit, Redux Persist, React Router, Tailwind CSS, Ant Design, Axios
- Backend: Node.js, Express, Mongoose (MongoDB), dotenv, cors
- Storage & Media: Cloudinary, Multer
- Utilities: bcrypt, jsonwebtoken (JWT), Nodemailer, Tesseract.js, PDF.js
- Tools: npm, nodemon (dev), optional concurrently for combined runs

## Folder Structure (high level)
```
HEALTH_CARE_APP/
├─ backend/            # Express API, controllers, models, routes, config
├─ frontend/           # Vite React app (src/, public/, vite.config.js)
├─ .gitignore
└─ README.md
```
Brief notes:
- backend/ contains the server entry (index.js), db connection, routes, controllers, middlewares, templates and utils.
- frontend/ contains the React app source (components, pages, redux store, assets).

## Installation & Setup

1. Clone repository
```bash
git clone <repo-url>
cd HEALTH_CARE_APP
```

2. Backend
```bash
cd backend
npm install
# create .env (see Environment Variables)
npm run dev   # or npm start for production
```

3. Frontend
```bash
cd frontend
npm install
npm run dev   # starts Vite dev server (typically http://localhost:5173)
```

Tip: Use separate terminals for frontend and backend. Optionally add a root script using concurrently to run both.

## Environment Variables
Create a `.env` in backend/ (and frontend/ if needed). Typical variables used by the project:

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret
- EMAIL_USER=your_email_address
- EMAIL_PASS=your_email_password
- (Optional) CLIENT_URL=http://localhost:5173

Adjust names to match code if a .env.example exists.

## Usage / How to Run
- Backend
  - Development: npm run dev (requires nodemon)
  - Production: npm start
- Frontend
  - Development: npm run dev
  - Production build: npm run build

API base: by default the backend runs on http://localhost:5000 — update frontend API base or proxy as needed. Review backend routes under backend/routes for available endpoints.

## Screenshots
(Replace placeholders with actual images/screenshots)
- Frontend Home / Dashboard
- PDF Viewer / OCR result view
- Example API response in Postman

## Future Improvements
- Add authentication flows with refresh tokens and role‑based access control
- Add unit & integration tests (Jest, React Testing Library, supertest)
- Add Docker and docker-compose for local multi‑service development
- Add CI/CD (GitHub Actions) and automatic deployments
- Improve documentation for API endpoints and frontend components

## Author / Credits
Zahim Ahmed Khan  
GitHub: https://github.com/zahimahmedkhan

## License
MIT License — see LICENSE file or include standard MIT header.
