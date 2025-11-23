🚀 Job Board with Application Tracker

A full-stack MERN application that enables employers to post jobs and candidates to apply, track applications, and manage their profile.
Includes role-based authentication (Employer / Candidate), analytics dashboards, and resume upload support.

📌 Features :

👨‍💼 Employer

Register/Login as Employer
Post new jobs
View & manage job listings
Review job applications with candidate info & resume
Update application status (Accepted / Rejected / Pending)
Employer dashboard

👨‍💻 Candidate

Register/Login as Candidate
Explore / search / filter jobs
Apply with resume + custom cover letter
Track application progress
View applied jobs history
Candidate dashboard

🔐 Auth & Security

JWT based authentication
Role-based access control
Password hashing with bcrypt

🛠️ Project Architecture Overview


```
Job-Board-with-Application-Tracker/
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/               # DB, auth, environment setup
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # JWT auth, validation
│   │   ├── models/               # Mongoose schemas
│   │   ├── routes/               # API routes (auth, jobs, applications)
│   │   ├── utils/                # Helpers (file upload, etc.)
│   └── uploads/                  # Stored resumes (local)
│
└── frontend/                     # React + TypeScript client
    ├── src/
    │   ├── pages/                # UI pages by role
    │   ├── components/           # Reusable UI components
    │   ├── context/              # Auth & global state
    │   ├── routes/               # Protected routing
    │   ├── api/                  # Axios service layer
    └── public/
```


🔧 Setup Instructions:

1️⃣Backend Setup
cd backend
npm install

Create .env in /backend:
PORT=4000
MONGO_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=yourSecretKey
CLIENT_URL=http://localhost:5173

Run backend:
npm run dev

2️⃣ Frontend Setup
cd frontend
npm install


Create .env in /frontend:

VITE_API_URL=http://localhost:4000/api

Run frontend:
npm run dev

📝 API Overview (Quick Summary)
Module	Routes
Auth	/api/auth/register, /api/auth/login
Jobs	/api/jobs, /api/jobs/:id
Applications	/api/applications, /api/applications/:id/status
Users	/api/users/me

⚠️ Known Limitations
1. Limited dashboard analytics
2. Email alerts not implemented
3. Basic keyword search; no AI matching or recommendations




