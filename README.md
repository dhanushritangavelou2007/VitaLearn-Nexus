<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" alt="VitaLearn Nexus Logo" width="120" height="120" />
  
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

## ✨ Key Features

### 🔐 5 Distinct Role-Based Portals
The application dynamically routes users to custom-built dashboards based on their role:
- **🎓 Student Portal**: Log daily symptoms, track personal health scores, manage privacy, and view clinical recommendations.
- **👨‍👩‍👧 Parent Portal**: Monitor your child's health timeline, view shared doctor diagnoses, and track pending school vaccinations.
- **👩‍🏫 Teacher Portal**: Oversee classroom health trends, generate student medical passports, and receive instant alerts for critical student conditions.
- **🩺 Doctor Portal**: Review a prioritized queue of pending student health reports, issue direct clinical notes, and manage prescriptions.
- **⚙️ Admin Portal**: Monitor system-wide health analytics, oversee platform adoption, and manage user roles.

### 🏥 Direct Clinical Workflow
- Students and Teachers can submit detailed health observations.
- Doctors receive these observations in a streamlined "Appointments" queue.
- With a single click, Doctors can **diagnose**, write clinical notes, and issue prescriptions directly back to the student.

### 🛡️ Granular Privacy Controls
- Privacy is paramount. Students have explicit control over their medical data.
- When reporting symptoms, students can use a **Privacy Toggle** to decide if the report and the resulting doctor's diagnosis should be shared with their parents or kept strictly confidential.

### 📄 Dynamic Medical Passports
- Teachers and Doctors can auto-generate comprehensive **Medical Passports** for any student.
- Passports contain full vaccination histories, recent vitals, and chronic conditions.
- Passports can be exported to highly polished **PDFs** instantly.

### 📈 Automated Health Analytics
- The system automatically aggregates reported symptoms and vitals to calculate real-time **Health Scores**.
- Interactive charts (powered by Recharts) visualize health trends over time.

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
