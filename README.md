# VitaLearn Nexus

<p align="center">
  <img src="./assets/logo.png" width="180" alt="VitaLearn Nexus Logo">
</p>

<h3 align="center">
AI-Powered Digital Student Health Passport & School Health Intelligence Platform
</h3>

<p align="center">
A centralized healthcare ecosystem connecting Students, Parents, Teachers, Doctors, and School Administrators through secure digital health records and AI-assisted analytics.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License">
</p>

---

## 📖 About

VitaLearn Nexus is an AI-assisted Digital Student Health Passport developed to modernize healthcare management inside schools.

Instead of maintaining paper medical records, every student receives a secure digital health passport containing:

- Medical History
- Vaccination Records
- BMI & Vital Monitoring
- AI Health Summary
- Risk Classification
- Doctor Diagnosis
- Parent Health Reports
- Teacher Observations

The platform enables collaboration between Teachers, Doctors, Parents, Students, and School Administrators while maintaining secure role-based access control.

---

## 🎯 Problem Statement

Schools often maintain fragmented paper health records that are:

- Difficult to access
- Easy to lose
- Hard to update
- Impossible to analyze

Current systems make it difficult for:

- Teachers to identify health risks quickly
- Parents to monitor school health updates
- Doctors to access centralized medical history
- Administrators to analyze school-wide health trends

---

## 💡 Solution

VitaLearn Nexus provides:

- Digital Student Health Passport
- AI Health Summary
- Student Risk Classification
- School Health Analytics
- Vaccination Tracking
- Medical Report Management
- Role-Based Dashboards
- Secure Authentication

---

## 👥 User Roles

### 👨‍🏫 Teacher

- View assigned students
- Record symptoms
- Generate health passports
- Download PDF reports
- Export Excel reports
- View risk indicators
- Receive AI alerts

### 👩‍⚕️ Doctor

- Review all students
- View critical cases
- Manage diagnosis queue
- Edit diagnoses
- Approve AI reports
- Review vaccinations
- Manage appointments

### 👨‍👩‍👧 Parent

- View child's health passport
- View health reports
- Submit symptom reports
- Download reports
- View vaccination history

### 🧑‍🎓 Student

- View personal health passport
- AI-generated health summary
- Health timeline
- Vaccination records
- Wellness dashboard

### 🏫 Admin

- School analytics
- User management
- Student management
- Teacher management
- Doctor management
- Pending reports
- Overall statistics

---

## 🧠 AI Features

The AI system assists users by:

- Generating health summaries
- Identifying health trends
- Highlighting risk categories
- Providing educational explanations
- Suggesting follow-up observations

> AI never replaces a qualified medical professional.
>
> Final diagnosis always remains under doctor supervision.

---

## 📊 Dashboard Analytics

The platform provides:

- Student Health Distribution
- Risk Classification
- Attendance Statistics
- BMI Analysis
- Health Timeline
- Vaccination Coverage
- Critical Student Count
- Pending Reports

---

## 🔐 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Access Control
- Secure REST APIs

---

## 🛠 Technology Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

---

## 📂 Project Structure

```text
VitaLearn-Nexus/
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## 🚀 Features

- Digital Health Passport
- AI Health Summary
- Risk Detection
- Medical Reports
- Vaccination Tracking
- School Analytics
- Multi-role Dashboards
- PDF Export
- Excel Export
- Demo Mode
- MongoDB Support
- Responsive Design
- Dark Mode

---

## 💻 Installation

Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/VitaLearn-Nexus.git
```

Navigate to the project.

```bash
cd VitaLearn-Nexus
```

### 🚀 Quick Start (Single Command)

We have provided a convenient Bash script to install all dependencies and start both the frontend and backend servers concurrently.

**macOS / Linux / Git Bash (Windows):**
```bash
chmod +x start.sh
./start.sh
```

### 🛠 Manual Startup (Alternative)

If you prefer to start them manually, open two terminal windows.

**Terminal 1 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm install
npm run dev
```

---

## ⚙ Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 🌐 Local URLs

Frontend

<http://localhost:5173>

Backend

<http://localhost:5000>

---

## 🎮 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| Teacher | <teacher@vitalearn.ai> | Teacher@123 |
| Doctor | <doctor@vitalearn.ai> | Doctor@123 |
| Parent | <parent@vitalearn.ai> | Parent@123 |
| Student | <student@vitalearn.ai> | Student@123 |
| Admin | <admin@vitalearn.ai> | Admin@123 |

---

## 📈 Future Enhancements

- Mobile Application
- Wearable Device Integration
- AI Predictive Health Analysis
- Multi-School Deployment
- Government Health Portal Integration
- Emergency SOS Alerts
- Real-time Notifications
- Cloud Storage
- OCR Medical Report Upload
- AI Chat Assistant

---

## 📸 Screenshots

Add screenshots after deployment.

```text
screenshots/
├── teacher-dashboard.png
├── doctor-dashboard.png
├── parent-dashboard.png
├── student-dashboard.png
└── admin-dashboard.png
```

---

## 🤝 Contributors

**Developed by**

Dhanushri Tangavelou

B.Tech Electronics and Communication Engineering

Pondicherry University

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, don't forget to **star this repository**.

Made with ❤️ for healthier schools.
