
  
  # VitaLearn-Nexus
  **AI-Powered Digital Student Health Passport & School Health Intelligence Platform**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📖 Overview

**VitaLearn Nexus** is a state-of-the-art Digital Student Health Passport and School Health Intelligence Platform designed to centralize student healthcare management in educational institutions. 

By replacing fragmented paper-based medical records with a secure, intelligent, and scalable digital ecosystem, the platform enables seamless collaboration between **School Administrators, Teachers, Doctors, Parents, and Students**. It promotes preventive healthcare, early intervention, and robust communication between schools and families, all backed by AI-assisted health insights.

> **Important Principle:** AI is designed to *assist* users by summarizing health information, identifying trends, and answering general health questions. AI *never* replaces qualified medical professionals, and all medical decisions remain under the strict supervision of authorized doctors.

---

## ✨ Core Features

- **🔐 Robust Security & Authentication:** Role-Based Access Control (RBAC), JWT Authentication, Password Hashing, and secure API routing.
- **📄 Digital Health Passport:** Comprehensive medical history, growth tracking (BMI, Vitals), vaccination records, and downloadable health reports.
- **🧠 AI-Powered Insights:** Localized AI health summaries, trend analysis, and educational explanations (assisting, not diagnosing).
- **💬 Real-Time Communication:** Secure chat modules connecting Parents ↔ Teachers, Parents ↔ Doctors, and Teachers ↔ Doctors.
- **📊 Role-Specific Dashboards:** Custom-tailored intelligent dashboards for School Admins, Doctors, Teachers, Parents, and Students.
- **🌗 Modern UI/UX:** Glassmorphism, smooth Framer Motion animations, dark/light mode persistency, and fully responsive design.

---

## 👥 User Roles & Capabilities

| Role | Access Level | Key Capabilities |
|------|--------------|------------------|
| **🏫 School Admin** | Super User | Manage all users, link parents/students, assign classes, view global analytics. |
| **👩‍⚕️ Doctor** | Medical Staff | Conduct checkups, record detailed vitals/vaccinations, update medical reports, review AI summaries, manage diagnosis queues. |
| **👨‍🏫 Teacher** | Staff | View assigned classes, record attendance, submit classroom health observations, receive AI alerts. |
| **👨‍👩‍👧 Parent** | Guardian | View child's health passport, submit symptom reports, download medical histories, track vaccinations. |
| **🧑‍🎓 Student** | Viewer | View personal health passport, track AI-generated health summaries, access timelines. |

---

## 🚀 Quick Start (Local Deployment)

VitaLearn Nexus is designed for resilience. It features a **Demo Mode Fallback** which seamlessly provisions the application with a shared dataset of 20 fully-fleshed student profiles if a MongoDB connection is unavailable.

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
- [Git](https://git-scm.com/downloads)

### 1. Clone the Repository
```bash
git clone :https://github.com/dhanushritangavelou2007/VitaLearn-Nexus.git
cd vitalearn-nexus
```

### 2. Environment Variables (Optional)
By default, the application runs perfectly in **Demo Mode** without a database. If you wish to use a live MongoDB instance, create a `.env` file in the `backend/` directory:
```env
PORT=5000
```

### 3. Start the Application

We have provided a convenient Bash script to install dependencies and spin up both the frontend and backend concurrently.

**Using the Bash Script (macOS/Linux/Git Bash on Windows):**
```bash
chmod +x start.sh
./start.sh
```

**Manual Startup (If bash is unavailable):**
```bash
# Terminal 1: Start the Backend
cd backend
npm install
npm run dev

# Terminal 2: Start the Frontend
cd frontend
npm install
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🔑 Demo Accounts

Use the following pre-configured credentials to explore the platform in Demo Mode:

| Role | Email | Password |
|------|-------|----------|
| **Teacher** | `teacher@vitalearn.ai` | `Teacher@123` |
| **Doctor** | `doctor@vitalearn.ai` | `Doctor@123` |
| **Parent** | `parent@vitalearn.ai` | `Parent@123` |
| **Student** | `student@vitalearn.ai` | `Student@123` |
| **Admin** | `admin@vitalearn.ai` | `Admin@123` |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, Glassmorphism elements
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Architecture:** Repository Pattern (Graceful Demo Fallback)
- **Security:** bcryptjs, jsonwebtoken, helmet, express-rate-limit

---

## 🌍 Future Scope

- **Multi-School Architecture:** Support for district-level and multi-tenant scaling.
- **Wearable Integration:** Direct syncing with smartwatches and fitness trackers.
- **Government Health Reporting:** Automated anonymized epidemiology reporting.
- **Mobile Application:** Dedicated iOS and Android apps using React Native.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
