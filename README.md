# 🧑‍💼 Job Board with Application Tracker

A full-stack job portal where employers can post jobs and candidates can apply, upload resumes, and track application status. Employers can manage applications, update status, and receive notifications. Built using **React.js**, **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

### 🔐 **Authentication & Roles**
- JWT-based login and signup  
- Two user roles:
  - **Employer** – can post jobs and manage applications  
  - **Candidate** – can browse jobs and apply  
- Route protection based on role  

---

## 🧱 **Core Modules**

### 👨‍💼 Employer
- Create, update, and delete job posts  
- View all applications for their jobs  
- Update application status:
  - *Applied → Shortlisted → Interview → Offer → Rejected*
- Sends email notification to candidates on status update  
- Status history stored for audit  

### 👨‍🎓 Candidate
- Browse & search jobs  
- Apply to any job with a resume  
- View all applications they submitted  
- Track status updates in real time  
- Receive email when employer updates status  

---

## 📂 File Uploads
- Resume upload (PDF only)  
- Validates file size (max 5 MB)  
- Configured for S3 / Cloudinary (your team member implementing)  

---

## 🔎 Search & Filters
- Search by job title / description  
- Filter by location, salary, and job type  
- MongoDB text search enabled  

---

## 🛠 Tech Stack

### **Frontend**
- React.js (Vite)
- Axios for API calls
- React Router
- Tailwind / CSS

### **Backend**
- Node.js  
- Express  
- MongoDB + Mongoose  
- Multer for file upload  
- Nodemailer for email templates  

---

## 📦 Folder Structure

