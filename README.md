#  HEALTH_CARE_APP

A full-stack **Healthcare Application** built with **React (Vite) + Redux Toolkit** on the frontend and **Node.js + Express + MongoDB** on the backend.  
The project is designed with a scalable architecture to support authentication, file uploads, OCR, PDFs, email services, and modern UI components.

---
#Live Link :[HEALTH-CARE-APP](https://health-care-app-nu-virid.vercel.app)



##  Key Features

-  Secure Authentication (JWT + bcrypt)
-  Modular MVC backend architecture
-  PDF viewing & processing
-  OCR text extraction using **Tesseract.js**
-  Email services via **Nodemailer**
-  Image & file uploads using **Cloudinary**
-  Secure uploads using **Multer**
-  Global state management with **Redux Toolkit**
-  Persistent state using **Redux Persist**
-  Modern UI with **Tailwind CSS** & **Ant Design**
-  Toast notifications
-  XSS protection using **DOMPurify**
-  API communication via **Axios**

---

##  Tech Stack

###  Frontend
- React 18 (Vite)
- Redux Toolkit
- Redux Persist
- React Router DOM
- Tailwind CSS
- Ant Design
- Axios
- React Toastify
- DOMPurify
- PDF.js
- Tesseract.js (OCR)

###  Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (Password Hashing)
- Cloudinary (Media Storage)
- Multer (File Uploads)
- Nodemailer (Email Services)
- Google Generative AI
- dotenv
- cors
- fs-extra
- PDF.js

---

##  Project Structure
```
HEALTH_CARE_APP/
│
├── backend/
│ ├── config/ # App & service configurations
│ ├── controllers/ # Business logic
│ ├── db/ # Database connection
│ ├── middlewares/ # Auth & error handling
│ ├── models/ # Mongoose schemas
│ ├── public/ # Static files
│ ├── routes/ # API routes
│ ├── templates/ # Email / HTML templates
│ ├── utils/ # Helper functions
│ │
│ ├── .env
│ ├── index.js # Backend entry point
│ ├── package.json
│ ├── vercel.json # Deployment config
│ └── node_modules/
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/ # Images & static assets
│ │ ├── components/ # Reusable UI components
│ │ ├── layouts/ # Layout wrappers
│ │ ├── pages/ # Route-based pages
│ │ ├── redux/ # Store & slices
│ │ ├── utils/ # Helper utilities
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.css
│ │ └── main.jsx
│ │
│ ├── .env
│ ├── index.html
│ ├── vite.config.js
│ ├── package.json
│ └── node_modules/
│
├── .gitignore
└── README.md
```

---

##  Installation & Setup

###  Clone Repository
```bash
git clone https://github.com/zahimahmedkhan/HEALTH_CARE_APP.git
cd HEALTH_CARE_APP
```
 Backend Setup
```bash
cd backend
npm install
```
---
Create a .env file:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
Run backend:
```
npm run dev

```
---
 Frontend Setup
--
```
cd frontend
npm install
npm run dev
```
---

 Application Flow
---
Frontend communicates with backend using Axios

Authentication handled using JWT

Protected routes secured via middleware

Global state managed with Redux Toolkit

 Author
---
Zahim Ahmed Khan<br>
GitHub: [Zahim Ahmed Khan](https://github.com/zahimahmedkhan)

 License
---
This project is licensed under the MIT License.


 Support
---
If you find this project helpful, please give it a ⭐ on GitHub!
