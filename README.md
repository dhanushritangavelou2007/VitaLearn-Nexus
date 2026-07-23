# 🏥 VitaLearn Nexus

<p align="center">

<img src="./frontend/src/assets/logo.png" width="150" />

</p>

<h3 align="center">
AI-Powered Digital Healthcare Ecosystem for Schools
</h3>

<p align="center">
Transforming school healthcare management through AI, automation, and connected digital health records.
</p>


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
✅ Student wellness tracking  
✅ Medical report generation  
✅ Health analytics dashboard  
✅ Smart notification system  
✅ Role-based healthcare management  


---

# 🚀 Key Features


## 👨‍🏫 Teacher Dashboard

Teachers can:

- Add and manage students
- Maintain student health profiles
- Upload health observations
- View AI-generated insights
- Track class wellness statistics
- Download student health reports


---

## 👨‍⚕️ Doctor Dashboard

Doctors can:

- Review student medical history
- Analyze health reports
- Add medical recommendations
- Edit AI-generated summaries
- Monitor critical health cases
- Maintain consultation records


---

## 👨‍👩‍👧 Parent Dashboard

Parents can:

- View child's digital health passport
- Receive doctor updates
- Submit symptoms
- Track vaccinations
- Monitor wellness activities
- Receive healthcare notifications


---

## 👨‍🎓 Student Dashboard

Students can:

- Access personal health records
- Track daily wellness activities
- View health recommendations
- Monitor hydration and sleep patterns
- Maintain healthy habits


---

# 🤖 Artificial Intelligence Features

VitaLearn Nexus integrates AI to enhance healthcare accessibility.

### AI Health Report Generator

Generates simplified health summaries from medical information.

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


> Note: AI suggestions are supportive and do not replace professional medical diagnosis.


---

# 🔔 Smart Notification System

The platform provides automated notifications for:

- Upcoming vaccinations
- Medical checkups
- Doctor responses
- Health alerts
- Parent communication updates


---

# 🏗️ System Architecture


```
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

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion


## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt


## AI & Cloud

- Gemini AI API
- OCR Processing
- Cloud Storage Integration


---

# 📂 Project Structure


```
VitaLearn-Nexus

│
├── frontend
│
│   ├── src
│   │
│   ├── components
│   ├── pages
│   ├── dashboard
│   └── services
│
│
├── backend
│
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
│
└── README.md

```


---

# ⚙️ Installation & Setup


## Clone Repository


```bash
git clone https://github.com/yourusername/VitaLearn-Nexus.git
```


Move into project directory:

```bash
cd VitaLearn-Nexus
```


---

# Frontend Setup


```bash
cd frontend

npm install

npm run dev
```


Frontend runs on:

```
http://localhost:5173
```


---

# Backend Setup


```bash
cd backend

npm install

npm run dev
```


Backend runs on:

```
http://localhost:5000
```


---

# 🔐 Environment Variables


Create `.env` file inside backend:


```
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_ai_key

CLOUDINARY_URL=your_cloudinary_url

```


---

# 🔑 Demo Accounts


## Teacher

```
Email:
teacher@test.com

Password:
password123
```


## Doctor

```
Email:
doctor@test.com

Password:
password123
```


## Parent

```
Email:
parent@test.com

Password:
password123
```


## Student

```
Email:
student@test.com

Password:
password123
```


---

# 📊 Future Scope


## Healthcare Expansion

- Wearable device integration
- Real-time health monitoring
- Emergency health alerts


## AI Advancement

- Predictive health analytics
- Personalized wellness plans
- Medical document intelligence


## Platform Growth

- Mobile application
- Multi-school deployment
- Government healthcare integration


---

# 🌍 Impact


VitaLearn Nexus aims to create:

### Safer Schools

Quick access to student medical information during emergencies.


### Healthier Students

Early detection and preventive healthcare.


### Better Communication

Connecting parents, doctors, teachers, and students.


### Digital Healthcare Transformation

Replacing traditional paper-based healthcare management.


---

# 🏆 Hackathon Highlights


✔ AI-powered healthcare ecosystem  
✔ Multi-role dashboard architecture  
✔ Real-world social impact  
✔ Scalable SaaS model  
✔ Modern full-stack implementation  


---

# 👥 Team


**Team Name:** VitaLearn Nexus


Developed with ❤️ for transforming student healthcare.


---

# 📜 License

This project is developed for educational and innovation purposes.
