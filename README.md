<div align="center">
  <img src="./frontend/public/favicon.svg" alt="VitaLearn Nexus Logo" width="120" height="120" />
  
  # 🌟 VitaLearn Nexus 🌟
  
  **A Next-Generation, Multi-Role School Healthcare Management System**

  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

<div align="center">
  <i>Bridging the gap between education and healthcare by connecting students, parents, teachers, and medical professionals on a single, privacy-first platform.</i>
</div>

---

## 🚀 Overview

**VitaLearn Nexus** is built for the modern educational ecosystem. It eliminates the friction of school health management by providing specialized, real-time dashboards for every stakeholder. From tracking a student's daily vitals and vaccinations to allowing doctors to directly issue prescriptions—everything happens in one secure, unified portal.

Built with a premium **glassmorphism** aesthetic, micro-animations, and responsive design, VitaLearn Nexus proves that healthcare software can be beautiful, intuitive, and incredibly powerful.

---

## ✨ Core Presentation Features

These are the primary features we are showcasing for this hackathon:

### 1. 🏥 Direct Doctor Diagnosis Workflow
- The **Doctor Portal** features a smart "Appointments" queue that automatically prioritizes critical students.
- Doctors can bypass queues and click **"Diagnose"** directly from their dashboard to instantly write clinical notes, issue prescriptions, and provide medical recommendations back to the student.

### 2. 🛡️ Granular Student Privacy & Consent
- Privacy is paramount. When students report symptoms, they use a **Privacy Toggle** to explicitly decide if their report (and the resulting doctor's diagnosis) should be shared with their parents or kept strictly confidential between them and the doctor.
- The backend enforces this privacy check before dispatching any parent notifications.

### 3. 📄 Dynamic Medical Passports
- A centralized, comprehensive health summary for every student.
- Passports contain recent vitals, active symptoms, chronic conditions, and full vaccination histories.
- They can be instantly exported to highly polished **PDFs** for school records.

### 4. 🔔 Targeted Real-Time Notifications
- **Teachers**: Receive instant alerts when a student's health status changes, plus direct responses from doctors when they review classroom observations.
- **Students**: Receive direct medical advice and prescriptions from doctors.
- **Parents**: Stay informed about their child's health timeline (respecting student privacy choices).

### 5. 🔐 5 Distinct Role-Based Portals
The application dynamically routes users to custom-built dashboards based on their role:
- **🎓 Student Portal**: Log daily symptoms, manage privacy, and view doctor reviews.
- **👨‍👩‍👧 Parent Portal**: Monitor child's health timeline and school vaccinations.
- **👩‍🏫 Teacher Portal**: Oversee classroom health and generate student passports.
- **🩺 Doctor Portal**: Diagnose critical cases and manage clinical notes.
- **⚙️ Admin Portal**: Monitor system-wide health analytics and platform adoption.

---

## 🛠️ Tech Stack Architecture

**Frontend:**
- **React 18 & Vite**: Lightning-fast rendering and instantaneous hot-module replacement.
- **Tailwind CSS**: Utility-first styling utilized to create a stunning, responsive, glass-morphism UI.
- **React Router v6**: Complex nested routing and protected role-based guards.
- **Recharts**: For dynamic, interactive health trend visualizations.
- **html2canvas & jsPDF**: For generating pixel-perfect Medical Passport PDFs on the fly.
- **Lucide React**: Clean, modern iconography throughout the application.

**Backend:**
- **Node.js & Express.js**: Robust, RESTful API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database for handling complex, nested health records.
- **JSON Web Tokens (JWT)**: Secure, stateless authentication.
- **Cloudinary**: Cloud-based storage for profile pictures and medical document uploads.
- **Helmet & Rate-Limiting**: Industry-standard security middleware to protect API endpoints.

---

## 🌍 One-Click Unified Deployment

VitaLearn Nexus is configured for an incredibly simple deployment process. The Express backend is pre-configured to statically serve the compiled React frontend, meaning you can deploy the entire platform as a **Single Web Service**.

### Deploying to Render.com (Recommended)
1. Fork or clone this repository and push it to your GitHub account.
2. Go to [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your repository.
4. Set the **Build Command**:
   ```bash
   npm run build
   ```
5. Set the **Start Command**:
   ```bash
   npm start
   ```
6. **(Optional)** Add your MongoDB URI and JWT Secret in the Environment Variables tab. *Note: If omitted, the app will safely fall back to a local Demo Mode suitable for hackathon presentations!*
7. Click **Deploy**. Your frontend and backend will be live on a single URL!

---

## 💻 Local Development Setup

Want to run the project locally? It's easy!

### Prerequisites
- Node.js (v18+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/VitaLearn-Nexus.git
   cd VitaLearn-Nexus
   ```

2. **Install all dependencies** (Frontend & Backend)
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   npm install
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```
   *This command runs both the Node API and the Vite Frontend concurrently.*

   **Frontend**: `http://localhost:5173`  
   **Backend**: `http://localhost:5000`

---

<div align="center">
  <p><i>Developed with ❤️ for the Hackathon</i></p>
</div>
