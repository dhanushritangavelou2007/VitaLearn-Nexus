
  # VitaLearn Nexus
  **AI-Powered Digital Student Health Passport & School Health Intelligence Platform**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📖 Overview

**VitaLearn Nexus** is a state-of-the-art Digital Student Health Passport and School Health Intelligence Platform designed to centralize student healthcare management in educational institutions. 

By replacing fragmented paper-based medical records with a secure, intelligent, and scalable digital ecosystem, the platform enables seamless collaboration between **School Administrators, Teachers, Doctors, Parents, and Students**. It promotes preventive healthcare, early intervention, and robust communication between schools and families, all backed by AI-assisted health insights.

> **Important Principle:** AI is designed to *assist* users by summarizing health information, identifying trends, and answering general health questions. AI *never* replaces qualified medical professionals, and all medical decisions remain under the strict supervision of authorized doctors.

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

## 🚀 Quick Start (Local Deployment)

VitaLearn Nexus is designed for resilience. It features a **Demo Mode Fallback** which seamlessly provisions the application with a shared dataset of 20 fully-fleshed student profiles if a MongoDB connection is unavailable.

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
- [Git](https://git-scm.com/downloads)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/vitalearn-nexus.git
cd vitalearn-nexus
```

### 2. Environment Variables (Optional)
By default, the application runs perfectly in **Demo Mode** without a database. If you wish to use a live MongoDB instance, create a `.env` file in the `backend/` directory:
```env
PORT=5000
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

DHANUSHRI TANGAVELOU;

ARADHANA.S;

JAYASREE.N.S;

SARUNITHA.E;

B.Tech Electronics and Communication Engineering

Pondicherry Central University, Puducherry 

---

## 📜 License

This project is licensed under the MIT License.

---

Made with ❤️ for healthier schools.
