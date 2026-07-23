<div align="center">
  <img src="frontend/public/favicon.svg" alt="VitaLearn Nexus Logo" width="120" />
  <h1>VitaLearn Nexus</h1>
  <p><strong>A Modern Multi-Role School Healthcare Management System</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## 🌟 Overview

**VitaLearn Nexus** is a comprehensive, privacy-first healthcare management dashboard designed for schools. It connects **Students, Parents, Teachers, Doctors, and Administrators** on a unified platform to monitor health vitals, track symptoms, and manage clinical diagnoses securely.

Built for a Hackathon, VitaLearn Nexus prioritizes a premium user experience, immediate actionable insights, and granular data privacy.

## ✨ Features

- 🏥 **Direct Clinical Workflow**: Students report symptoms; Doctors diagnose and issue prescriptions instantly from a dedicated dashboard.
- 🔒 **Granular Privacy Controls**: Students can choose whether to share specific health reports and doctor diagnoses with their parents.
- 📊 **Dynamic Medical Passports**: Auto-generated comprehensive health timelines and vaccination records for every student.
- 🔔 **Real-Time Notifications**: Role-based alert systems keep teachers, parents, and students informed of critical updates without unnecessary noise.
- 🎨 **Premium UI/UX**: Built with a sleek, responsive, glass-morphism aesthetic featuring dark mode support and micro-animations.

## 👥 Role-Based Access

| Role | Key Capabilities |
|------|-----------------|
| **Student** | Report symptoms, view personal health passport, manage privacy settings, track vaccinations. |
| **Parent** | Monitor child's health timeline, view shared doctor diagnoses, track school-wide health alerts. |
| **Teacher** | Monitor classroom health trends, create student passports, receive alerts for critical conditions. |
| **Doctor** | Review pending reports, issue clinical notes & prescriptions directly from the appointments tab. |
| **Admin** | Oversee system-wide analytics, manage user roles, track platform adoption. |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Deployment**: Configured for unified single-link deployment (Frontend static files served via Express)

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/VitaLearn-Nexus.git
   cd VitaLearn-Nexus
   ```

2. **Install dependencies**
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```

4. **Run the Application**
   ```bash
   # Starts both backend and frontend concurrently
   npm run dev
   ```

## 🌍 One-Click Deployment (Render / Heroku)

VitaLearn Nexus is configured to be deployed as a **single application** (the Node server automatically builds and serves the optimized React frontend). 

To deploy to a platform like **Render.com**:
1. Connect your GitHub repository to Render as a **Web Service**.
2. Set the Environment to `Node`.
3. Set the Build Command:
   ```bash
   npm run build
   ```
4. Set the Start Command:
   ```bash
   npm start
   ```
5. Add your `.env` variables in the Render dashboard.
6. **Deploy!** Your entire app will be live on a single URL.

---
<div align="center">
  <i>Built with ❤️ for the Hackathon</i>
</div>
