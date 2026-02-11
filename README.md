# HEALTH_CARE_APP

A full-stack healthcare application template built with React (Vite) + Redux Toolkit on the frontend and Node.js + Express + MongoDB on the backend. Designed for rapid prototyping and hackathons, this project includes authentication, file uploads, OCR support, PDF handling, email services, and modern UI tooling.

---

## Project Snapshot

- Frontend: Vite + React 18, Redux Toolkit, Tailwind CSS, Ant Design
- Backend: Node.js, Express, MongoDB (Mongoose)
- Features include JWT authentication, file uploads (Multer + Cloudinary), OCR (Tesseract.js), PDF handling, and email via Nodemailer.

---

## Features

- Secure authentication (JWT + bcrypt)
- Modular MVC-style backend
- File & image uploads (Multer + Cloudinary)
- OCR text extraction using Tesseract.js
- PDF viewing/processing support
- Email notifications via Nodemailer
- Global state with Redux Toolkit + Redux Persist
- Modern UI with Tailwind CSS and Ant Design
- Client-server API communication with Axios
- XSS protection using DOMPurify
- Environment config with dotenv

---

## Tech Stack

- Frontend: React 18 (Vite), Redux Toolkit, Redux Persist, React Router, Tailwind CSS, Ant Design, Axios, React Toastify, DOMPurify, PDF.js, Tesseract.js
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary, Nodemailer, dotenv, cors, fs-extra
- Tools: npm, nodemon (dev), VS Code, Git

---

## Folder Structure

HEALTH_CARE_APP/
- backend/ — Express API, models, controllers, routes, middlewares, config and env
- frontend/ — Vite React app (src/, public/, components/, pages/, redux/)
- .gitignore, README.md

(See each folder for more details; structure may vary slightly.)

---

## Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/zahimahmedkhan/HEALTH_CARE_APP.git
   cd HEALTH_CARE_APP
   ```

2. Backend
   ```bash
   cd backend
   npm install
   # create .env (see Environment Variables)
   npm run dev    # or npm start for production
   ```

3. Frontend
   ```bash
   cd ../frontend
   npm install
   npm run dev
   # npm run build to produce production bundle
   ```

Tip: Run backend on PORT 5000 and frontend on PORT 3000 by default; adjust env and proxy settings as needed.

---

## Environment Variables

Create a `.env` file in the backend directory. Typical variables:

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- EMAIL_USER=your_email_address
- EMAIL_PASS=your_email_password

Frontend may also use a `.env` (e.g., VITE_API_URL) depending on configuration.

---

## Usage / How to Run

- Development
  - Backend: cd backend && npm run dev
  - Frontend: cd frontend && npm run dev
- Production
  - Build frontend: cd frontend && npm run build
  - Serve static build and run backend server (configure as needed)

API base paths typically live under `/api/*` — check backend routes for exact endpoints. Update frontend API base URL to match backend (e.g., http://localhost:5000).

---

## Screenshots

(Replace with actual images/screenshots in the repo)

- Frontend Home / Dashboard — ![placeholder](./frontend/public/screenshot-1.png)
- Sample OCR Output — ![placeholder](./frontend/public/screenshot-2.png)
- Backend API Response (Postman) — ![placeholder](./frontend/public/screenshot-3.png)

---

## Future Improvements

- Add authentication flows and example protected routes (if not already present)
- Add automated tests (Jest, React Testing Library, supertest)
- Add Docker / Docker Compose for local development
- CI/CD workflow (GitHub Actions)
- Improved error handling and logging
- Example deployment configs (Heroku, Vercel, or Docker)

---

## Author / Credits

Zahim Ahmed Khan  
GitHub: https://github.com/zahimahmedkhan

---

## License

MIT License — see LICENSE file or add standard MIT header.

---

If you find this project useful, please give it a ⭐ on GitHub.
