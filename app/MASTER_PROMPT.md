# Original Master Prompt (Product Requirements)

This is the original brief that defines the full scope of the VitaLearn
Nexus production-readiness effort. See HANDOFF_INSTRUCTIONS.md for what has
been done so far and what to do next.

---

# MASTER PROMPT – VITALEARN NEXUS (MARKET READY VERSION)

## ROLE

You are a **Senior Full Stack Software Architect, UI/UX Designer, Product Manager, Security Engineer, and QA Engineer**.

Your task is **NOT** to patch bugs individually.

Your task is to transform the existing VitaLearn Nexus application into a **fully functional, production-ready, professional school healthcare management platform**.

Before modifying anything:

* Analyze the complete project.
* Understand the architecture.
* Find missing workflows.
* Identify broken features.
* Fix inconsistencies.
* Improve UI.
* Improve logic.
* Maintain scalability.
* Preserve all existing working functionality.

Never remove working functionality unless explicitly instructed.

The final app should look like it was built by an experienced software company.

---

# PRIMARY GOAL

Convert the current project into a professional healthcare ecosystem where Student, Parent, Teacher, Doctor, and Admin all communicate correctly with secure role-based workflows. No broken buttons. No dummy features. No incomplete workflows. Everything should work logically.

---

# GENERAL REQUIREMENTS

Perform a complete project audit. Fix UI, Backend, API, State management, Authentication, Routing, Database models, Notifications, Dashboard logic, Download functionality, Reports, Health Passport, and the Communication workflow. If any feature exists but is incomplete, finish it. If any feature is missing but required logically, build it.

---

# DASHBOARD WORKFLOW

## 1 STUDENT DASHBOARD
View: Health Passport, Medical History, Reports, Notifications, Doctor Reviews, Diagnosis, Vaccination, Appointments, Health Score, Download Reports.
Cannot: Edit medical records, delete reports, modify diagnosis.
Receives notifications from Teacher, Doctor, Admin, via a notification bell with counter, dropdown panel, mark-as-read, clear, and history. Dashboard auto-refreshes on new notifications.

## 2 PARENT DASHBOARD
Receives: Doctor Reports, Doctor Diagnosis, Doctor Prescription, Observation Updates, Appointments, Vaccination Alerts, Health Score Updates, Teacher Communication.
Cannot see: Teacher internal comments, Doctor internal notes, Admin confidential information.
Can: Download Reports, view Child Passport / Health History / Doctor Diagnosis / Allergies / Medical Conditions, receive Notifications (same system as Student).

## 3 TEACHER DASHBOARD
Can: Add/Update Student, Edit Passport, View Health Passport, Send Observation, Send Health Reports, Receive Doctor Response/Observation, Receive Parent Response, Receive Notifications, Download Reports.
Never receives parent-only information.
Receives Doctor Feedback, Observation Status, Student Review Status, Appointment Updates — via Notification Bell with unread counter, history, mark-read, search, filter, sorting.
Teacher's existing Edit Passport interface should be reused for the doctor dashboard.

## 4 DOCTOR DASHBOARD
Redesigned professionally. Can search student, open passport, edit Medical Condition, Allergies, Doctor Review, Diagnosis, Prescription, Recommendations.
Must NOT have an "Add Report ENV" section — remove it completely. Instead: Doctor opens student → Health Passport → Edit Passport → modify Medical Condition/Allergy/Diagnosis/Doctor Review/Health Score Recommendation → Save.
Should include Review History, Diagnosis Timeline, Medical History Timeline, Report Downloads, Appointment Review, Notification Center.
Responses: Parent Report → ONLY Parent; Teacher Observation Response → ONLY Teacher. Privacy must be enforced.

## 5 ADMIN DASHBOARD
Manage Teachers/Doctors/Students/Parents, Approve Users, Reset Passwords, Manage School, Dashboard Statistics, System Analytics, Recent Activity, Notification Broadcast, Role Management, Audit Logs.

---

# REPORT WORKFLOW

Current issue: Teacher sends report → Doctor responds → Teacher cannot view response. Fix this completely.

Correct workflow: Teacher → Send Observation → Doctor receives notification → Doctor reviews → Doctor sends response → Teacher receives response → Parent receives medical summary → Student receives notification. Everything updates automatically.

---

# PRIVACY

Parent Report → ONLY Parent. Teacher Response → ONLY Teacher. Student → only student data. Doctor → all medical information. Teacher → only education-related health observations. Admin → everything. Strict Role Based Access Control.

---

# HEALTH PASSPORT

Teacher can edit; Doctor must also be able to edit using an identical interface. Doctor can modify Medical Conditions, Allergies, Diagnosis, Doctor Review, Recommendations. Teacher cannot modify Diagnosis, Prescription, Doctor Review.

Health Passport should contain: Personal Details, Medical Conditions, Allergies, Vaccinations, BMI, Height, Weight, Vision, Blood Group, Emergency Contact, Health Score, Doctor Review, Diagnosis, Recommendations, Medical Timeline.

---

# NOTIFICATION SYSTEM

Real notification system per dashboard: Bell, Unread Badge, Dropdown, Timestamp, Read Status, History, Real-time Updates. Each role receives only relevant notifications.

---

# DOWNLOAD FEATURES

Every download button must work. PDF generation with professional formatting: School Logo, Student Photo, Doctor Signature, Teacher Signature, Timestamp, QR Verification.

---

# SEARCH

Global Search, Student/Doctor/Parent/Teacher Search, Filter, Sort, Pagination — on every dashboard.

---

# UI IMPROVEMENTS

Increase font size for Student Details, Sender Name, Report Header, Diagnosis, Passport Information. Improve Timeline, Cards, Spacing, Icons, Professional Colors, Responsive Design, Loading Skeletons, Empty States, Animations.

---

# HEALTH SCORE

Improve algorithm: Healthy / Observation / Needs Review / Critical, automatic calculation, history graph, trend, improvement suggestions.

---

# SECURITY

Role Authentication, Authorization, Protected Routes, JWT Validation, Permission Middleware, Data Validation, Input Sanitization.

---

# DATABASE

Review every model, normalize data, remove duplicates, improve relationships: Student, Teacher, Doctor, Parent, Reports, Notifications, Appointments, Passport, Health Score, Diagnosis, Vaccinations.

---

# BUG FIXES

Find and fix every Broken Button, Broken API, Broken Navigation, Broken Download, Broken Notification, Broken Report, Broken Dashboard, Broken Authentication, Broken State Update, Broken Refresh, Broken UI.

---

# FINAL QA

Before finishing, check every button, page, API, route, dashboard, role, notification, download, edit, delete, search, filter, report, and authentication flow.

---

# FINAL DELIVERABLE

Do not stop after fixing one issue. Work through the entire application until it is consistent and production-ready. At the end, provide: (1) Project audit report, (2) List of new features added, (3) Files modified, (4) Database/schema changes, (5) API endpoints added/updated, (6) Security improvements, (7) Remaining optional enhancements for future versions.

**Important constraints:** Preserve the existing UI style and branding. Do not remove working features. Ensure all new functionality is fully integrated and tested across every dashboard. Produce clean, maintainable, well-documented code suitable for production deployment.

