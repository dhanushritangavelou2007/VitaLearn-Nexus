<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" alt="VitaLearn Nexus Logo" width="120" height="120" />
  
  # 🏥 VitaLearn Nexus

  <h3 align="center">
    AI-Powered Digital Healthcare Ecosystem for Schools
  </h3>

  <p align="center">
    Transforming school healthcare management through AI, automation, and connected digital health records.
  </p>

  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
</div>

---

# 🌟 Overview

**VitaLearn Nexus** is an intelligent school healthcare management platform designed to bridge the gap between students, parents, teachers, and doctors through a centralized digital ecosystem.

The platform enables schools to maintain secure digital health passports, monitor student wellness, provide AI-assisted health insights, and improve communication between healthcare stakeholders.

Instead of fragmented paper records and delayed communication, VitaLearn Nexus creates a **real-time, data-driven healthcare environment for educational institutions.**

---

# 🎯 Problem Statement

Millions of students still rely on:
- ❌ Paper-based medical records
- ❌ Delayed parent-doctor communication
- ❌ Lack of preventive health monitoring
- ❌ Poor tracking of vaccinations and medical history
- ❌ No centralized student wellness analytics

Schools need a scalable healthcare solution that can:
- Store student medical information digitally
- Enable quick access during emergencies
- Predict health risks early
- Improve collaboration between parents, teachers, and doctors

---

# 💡 Our Solution

VitaLearn Nexus provides:
✅ Digital Health Passport  
✅ AI-powered health insights  
✅ Doctor-parent communication system  
✅ Direct clinical intervention & diagnosis  
✅ Student wellness tracking with privacy controls  
✅ Automated medical report generation  
✅ Health analytics dashboard  
✅ Smart notification system  
✅ 5 Distinct Role-based healthcare portals  

---

# 🚀 Key Features

## 👨‍🏫 Teacher Dashboard
- Add and manage students
- Maintain student health profiles and generate passports
- Upload health observations directly to the doctor
- View AI-generated insights
- Track class wellness statistics

## 👨‍⚕️ Doctor Dashboard
- Review prioritized queue of critical student medical history
- Analyze health reports and issue clinical notes
- Add medical recommendations and prescriptions instantly
- Edit AI-generated summaries
- Monitor critical health cases and consultation records

## 👨‍👩‍👧 Parent Dashboard
- View child's digital health passport
- Track vaccinations and monitor wellness activities
- Submit symptoms on behalf of child
- Receive approved doctor updates and healthcare notifications

## 👨‍🎓 Student Dashboard
- Access personal health records
- Track daily wellness activities and monitor hydration/sleep patterns
- **Privacy Controls**: Decide whether to share sensitive symptom reports with parents
- View health recommendations and maintain healthy habits

---

# 🤖 Artificial Intelligence Features

VitaLearn Nexus integrates AI to enhance healthcare accessibility.

### AI Health Report Generator
Generates simplified health summaries from complex medical information.

### AI Health Insights
Provides:
- Risk indicators
- Wellness suggestions
- Preventive recommendations

### AI Health Assistant
A non-diagnostic chatbot that helps users understand:
- General health information
- Preventive care
- Healthy lifestyle practices

> **Note:** AI suggestions are supportive and do not replace professional medical diagnosis.

---

# 🔔 Smart Notification System

The platform provides automated notifications for:
- Upcoming vaccinations
- Medical checkups
- Doctor responses to symptom reports
- Health alerts for teachers
- Privacy-respected parent communication updates

---

# 🏗️ System Architecture

```text
                Users

 ┌──────────┐
 │ Student  │
 └────┬─────┘
      │
 ┌────▼─────┐
 │ Parent   │
 └────┬─────┘
      │
 ┌────▼─────┐
 │ Teacher  │
 └────┬─────┘
      │
 ┌────▼─────┐
 │ Doctor   │
 └────┬─────┘

          ↓

     React Frontend

          ↓

     Node.js + Express API

          ↓

       MongoDB Database

          ↓

       AI Services
```

---

# 🛠️ Technology Stack

## Frontend
- React.js 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Framer Motion & Recharts
- html2canvas & jsPDF

## Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt

## AI & Cloud
- Gemini AI API
- OCR Processing
- Cloudinary (Cloud Storage Integration)

---

# 📂 Project Structure

```text
VitaLearn-Nexus
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── dashboard
│   │   └── services
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
└── package.json (Root Deployment Config)
```

---

# ⚙️ Installation & Setup

VitaLearn Nexus is configured for a **Unified Single-Link Deployment**. The Express backend automatically serves the compiled static React frontend.

## Local Development

**1. Clone Repository**
```bash
git clone https://github.com/yourusername/VitaLearn-Nexus.git
cd VitaLearn-Nexus
```

**2. Install Dependencies** (Root, Frontend, Backend)
```bash
npm install --prefix backend
npm install --prefix frontend
npm install
```

**3. Environment Variables**
Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_ai_key
CLOUDINARY_URL=your_cloudinary_url
```

**4. Run Application (Concurrently)**
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`, Backend runs on `http://localhost:5000`*

## 🌍 One-Click Cloud Deployment (Render.com)

To host your project live on the web as a single application:
1. Connect this repository to Render.com as a **Web Service**.
2. Set the **Build Command**: `npm run build`
3. Set the **Start Command**: `npm start`
4. *Render will automatically install dependencies, compile the React app, and serve it via Express on a single live URL.*

---

# 🔑 Demo Accounts

You can test the role-based portals using these mock credentials:

- **Teacher**: `teacher@test.com` / `password123`
- **Doctor**: `doctor@test.com` / `password123`
- **Parent**: `parent@test.com` / `password123`
- **Student**: `student@test.com` / `password123`
- **Admin**: `admin@test.com` / `password123`

---

# 📊 Future Scope

## Healthcare Expansion
- Wearable device integration
- Real-time health monitoring
- Emergency health alerts

## AI Advancement
- Predictive health analytics
- Personalized wellness plans based on historic passport data
- Medical document intelligence

## Platform Growth
- Native mobile application
- Multi-school deployment
- Government healthcare integration

---

# 🌍 Impact

VitaLearn Nexus aims to create:
- **Safer Schools**: Quick access to student medical passports during emergencies.
- **Healthier Students**: Early detection and preventive healthcare.
- **Better Communication**: Connecting parents, doctors, teachers, and students.
- **Digital Transformation**: Replacing traditional paper-based healthcare management.

---

# 🏆 Hackathon Highlights

✔ AI-powered healthcare ecosystem  
✔ Multi-role dashboard architecture  
✔ Real-world clinical workflow (Direct doctor diagnoses)  
✔ Granular student privacy consent system  
✔ Modern, responsive UI with unified deployment  
✔ Scalable SaaS model  

---

<div align="center">
  <p><b>Team Name:</b> VitaLearn Nexus</p>
  <p><i>Developed with ❤️ for transforming student healthcare.</i></p>
  <p>This project is developed for educational and innovation purposes.</p>
</div>
