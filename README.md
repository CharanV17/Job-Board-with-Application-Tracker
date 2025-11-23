🚀 Features
🔐 Authentication & RBAC

JWT-based authentication

Two user roles:

Employer (can post jobs & manage applications)

Candidate (can apply & track applications)

Role-based route protection

Employers cannot apply for jobs

Candidates cannot create job posts

🧱 Core Modules
👨‍💼 Employer Features

Post, edit, delete job postings

View applications for each job

Update application status:

Applied → Screening → Interview → Offer → Rejected

Status transition validation

Automatic email to candidate on status update

View all jobs posted by employer

👨‍🎓 Candidate Features

Search jobs with filters (title, location, salary, remote, keyword)

Detailed job view

Apply with resume upload (PDF only)

View all applications

Track status history

Get email when status changes

Withdraw application

📂 Folder Structure

(Complete structure aligned with assignment requirements)

Job-Board-Application-Tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── cloudinary.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── job.controller.ts
│   │   │   └── application.controller.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Job.ts
│   │   │   └── Application.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── job.routes.ts
│   │   │   └── application.routes.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.ts
│   │   │   ├── sendEmail.ts
│   │   │   └── emailTemplates/
│   │   │       ├── applicationReceived.ts
│   │   │       └── applicationStatusUpdate.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── router/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   └── package.json
│
├── postman/
│   └── JobBoardCollection.json
│
└── README.md

🔌 API Endpoints (15/15)
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register as employer/candidate
POST	/api/auth/login	Login + receive JWT
GET	/api/auth/me	Get logged-in user
Jobs (Employer Only)
Method	Endpoint
POST	/api/jobs
GET	/api/jobs/:id
PUT	/api/jobs/:id
DELETE	/api/jobs/:id
GET	/api/employer/jobs
GET	/api/jobs/:id/applications
Jobs (Candidate)
Method	Endpoint
GET	/api/jobs
GET	/api/jobs/:id
Applications
Role	Method	Endpoint
Candidate	POST	/api/applications
Candidate	GET	/api/applications
Candidate	PUT	/api/applications/:id/withdraw
Employer	PUT	/api/applications/:id/status
📦 Installation & Setup
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

🧪 Test Credentials
Employer
email: employer@test.com
password: 123456

Candidate
email: candidate@test.com
password: 123456

🔐 Environment Variables (.env.example)
PORT=4000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

EMAIL_USER=xxxx
EMAIL_PASS=xxxx

🧠 Architecture Overview
Frontend

React + Vite

Axios for API calls

React Router for navigation

Context API for authentication

Clean reusable UI components

Candidate Kanban board (Drag & Drop ready)

Backend

Express server

TypeScript for safety

Mongoose for DB models

Multer for resume upload

Cloudinary/S3 file storage

JWT auth + RBAC middleware

Nodemailer for email notifications

Status validation logic

🔄 Application Status Flow
Applied → Screening → Interview → Offer → Rejected


Invalid transitions are prevented

Every update triggers an email to the candidate

Status history stored

⚠️ Known Limitations

S3/Cloudinary may need production configuration

UI does not yet include drag-and-drop Kanban animations

No admin role implemented

Analytics dashboard not included

📄 License

MIT License
