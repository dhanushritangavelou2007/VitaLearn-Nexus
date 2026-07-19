# VitaLearn Nexus — Handoff Instructions for the Next Agent

The original ask (see `MASTER_PROMPT.md` in this folder) is to turn VitaLearn Nexus
into a fully production-ready school healthcare platform across five roles
(Student, Parent, Teacher, Doctor, Admin). That is a multi-week rebuild, not a
single-session task. This document tells you exactly what has been verified,
fixed, and what to do next so you don't have to re-audit the whole app from
scratch.

## 0. Setup

```bash
# Backend
cd backend
npm install
npm run dev          # boots on :5000, runs in Demo Mode (no MONGODB_URI set)

# Frontend (separate terminal)
cd frontend
npm install
npm run dev           # Vite dev server, default :5173
```

Demo login accounts (see `backend/utils/constants.js` / `frontend/src/services/authService.js`):
| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Teacher | teacher@vitalearn.ai   | Teacher@123   |
| Doctor  | doctor@vitalearn.ai    | Doctor@123    |
| Parent  | parent@vitalearn.ai    | Parent@123    |
| Student | student@vitalearn.ai   | Student@123   |
| Admin   | admin@vitalearn.ai     | Admin@123     |

## ⚠️ 0.5 IMPORTANT — read before trusting "verified" claims below

This session's sandbox had **no network access**, so `npm install` failed
(403 from the npm registry) and neither `frontend/node_modules` nor
`backend/node_modules` exist in this archive. That means none of section 2.1's
work below could be verified by actually running `npm run build`, `npm run dev`,
or the curl/manual checks from section 3 — the standard verification loop this
document normally requires.

**What was done instead, as a substitute (not a replacement) for real
verification:**
- Every backend file touched was checked with `node --check` (catches syntax
  errors, not logic errors).
- Every frontend file touched (plus the full `frontend/src` tree, 91 files) was
  checked with `tsc --noEmit --jsx react-jsx --allowJs --checkJs false`, which
  parses JSX/JS syntax without needing `node_modules` installed. Zero syntax
  errors.
- Every new/changed `import { x, y } from "..."` was cross-checked by grepping
  the target file's `export` statements to confirm the names actually exist
  (no typos, no stale references to removed exports).
- The full teacher → doctor → teacher data flow was traced by hand, line by
  line, through both the frontend and backend code (see 2.1 below for the
  trace) to catch shape/field-name mismatches that syntax checking can't.

**What this does NOT catch:** runtime-only bugs — a wrong Mongoose query
operator, an off-by-one in demo-repository logic, a React hook dependency
issue that only manifests when the component actually renders, CORS
misconfiguration, etc. **The very first thing the next agent (or the user) should
do is `npm install` in both folders and run the full section 3 verification
loop for real.** Treat everything below as "should work based on careful
static review," not "confirmed working."

## 1. What was fixed in Session 1 (verified working, before the network
   restriction — this was confirmed with a real running server)

1. **Teacher never saw doctor responses (the flagship bug in the master
   prompt).** Root cause: `NotificationCenter.jsx` hard-excluded teachers from
   real notifications, and there was no teacher notifications page at all.
   - Added `frontend/src/pages/teacher/Notifications.jsx`
   - Added route `/teacher/notifications` in `frontend/src/App.jsx`
   - Added sidebar link in `frontend/src/components/dashboard/Sidebar.jsx`
   - Fixed `frontend/src/components/dashboard/NotificationCenter.jsx` so
     teachers receive real doctor-response notifications and the bell's
     "view all" link routes correctly
   - Added a "Doctor Responses" widget to `frontend/src/pages/teacher/Dashboard.jsx`
   - Verified: `npm run build` in `frontend/` completes with no errors.

2. **Backend `errorHandler` swallowed all status codes.**
   `backend/middleware/errorMiddleware.js` always returned 500 regardless of
   the error's real status, breaking RBAC (401/403) and 404 handling
   app-wide. Fixed to respect `err.statusCode`. Verified via curl:
   `GET /reports` (no token) → `401`, `GET /does-not-exist` → `404`.
   **Re-confirmed present and correct this session** (re-read the file; logic
   unchanged).

3. **Backend crashed on boot (double `app.listen()`).**
   `backend/server.js` called `app.listen()` immediately at module load
   (before routes/middleware were even registered) *and again* inside
   `start()`, which threw `EADDRINUSE` every time. Removed the premature
   call. **Re-confirmed present and correct this session** (re-read the file;
   only one `app.listen()` call, inside `start()`).

## 2. What was done in Session 2 (this session) — item 2.1 from the prior
   priority list

### 2.1 Frontend↔backend wiring for reports/notifications — DONE (statically
    verified only, see 0.5 above; needs a real `npm install` + run to confirm)

**Decision made:** option (b) from the prior handoff — wire the frontend to
the real Express backend, replacing the `localStorage`-only implementation.
This is the interpretation the master prompt's "production-ready" language
calls for, and it's what the prior handoff already recommended.

**Design constraint that shaped the implementation:** all 9 components/pages
that consume `useMedicalReports()` call the getter functions
(`getReportsForDoctor`, `getReportsForSender`, `getNotificationsForUser`)
**synchronously during render** — they expect an array back immediately, not
a Promise. And the mutation functions (`submitReport`, `sendObservation`,
`markNotificationRead`) are called without `await` or `.then()` at every call
site. Rewriting the context to just return Promises from these functions
would have required touching all 9 files, which the prior handoff explicitly
said to avoid.

**Solution:** `MedicalReportsContext.jsx` now keeps an in-memory React-state
cache of `reports` and `notifications`. That cache is:
- hydrated on login (`useEffect` keyed off `isAuthenticated` from `useAuth()`)
- refreshed on a 12-second poll while logged in (stopped/cleared on logout)
- updated **optimistically** the instant a mutation function is called (so
  the UI still feels synchronous/instant), with the real API call firing in
  the background and rolling back the optimistic change if it fails.

  The getter functions (`getReportsForDoctor`, etc.) now just filter/read
  this cache — still 100% synchronous, zero changes needed in any of the 9
  consuming files.

**Files changed/added:**
- `backend/models/Report.js` — added `senderId`, `senderRole`, `senderName`,
  `symptoms`, `severity`, `temperature`, `notes`, `status`, `observation`,
  `observationSentAt`, `reviewedBy`. Kept the legacy symptom-report fields
  (`student`, `createdBy`, `type`, `extraNotes`, `risk`) — both the new
  observation pipeline (this work) and the older `/symptoms` endpoint
  (`symptomsController.js`, untouched) write to the same `Report` collection
  with different field subsets; nothing in either path was made `required`
  so both continue to work.
- `backend/services/reportService.js` — added `listReportsForUser(user)`
  (role-scoped: doctor/admin see all reports, everyone else sees only
  reports where `senderId` matches their own id — this is the server-side
  privacy enforcement item 2.3 flagged as missing), `createReport(payload, user)`,
  `addObservation(reportId, doctorUser, text)` (sets status to `"reviewed"`,
  stamps `observationSentAt`, and creates a notification for **only** the
  original sender — enforces the "Teacher Observation Response → ONLY
  Teacher" / "Parent Report → ONLY Parent" privacy rule from the master
  prompt). Kept the original `listReports` (paginated/admin-style) as-is,
  now exposed via a separate route (see below) rather than replaced.
- `backend/services/notificationService.js` — added
  `createNotification`, `listNotificationsForUser` (scoped to one
  recipient — previously `GET /notifications` returned the first 20
  notifications **system-wide** with no recipient filtering at all, which
  was a privacy leak), `markRead`, `markAllRead`.
- `backend/controllers/reportController.js` — `getReports` now calls
  `listReportsForUser` (was previously unscoped `listReports`); added
  `browseReports` (the old paginated behavior, moved to `GET /reports/browse`,
  doctor/admin only, for a future admin bulk-browse UI); added
  `respondToReport` (`POST /reports/:id/observation`).
- `backend/controllers/notificationController.js` — `getNotifications` now
  scoped to `req.user`; added `markNotificationRead`
  (`PATCH /notifications/:id/read`) and `markAllNotificationsRead`
  (`PATCH /notifications/read-all`).
- `backend/routes/reportRoutes.js` — added `GET /browse` (before `/:id` so
  it isn't swallowed by the param route) and `POST /:id/observation`
  (`restrictTo("doctor")`).
- `backend/routes/notificationRoutes.js` — added the two `PATCH` routes
  above.
- `backend/routes/teacherRoutes.js` — was a placeholder
  (`res.json({message: "Teacher route placeholder"})`); wired to the
  existing `studentController`/`dashboardController` (`GET /teachers/dashboard`,
  `GET /teachers/students`, `GET /teachers/students/:id`, all
  `restrictTo("teacher", "admin")`). **Low priority / cosmetic** — grepped
  the whole frontend and confirmed nothing currently calls `/teachers/*`
  (the teacher dashboard already gets everything it needs from `/students`
  and `/dashboard`), so this didn't block anything, but it's no longer a
  dead stub either.
- `backend/repositories/index.js` — the demo-mode seed report
  (`demo-report-1`) didn't have `senderId`/`senderRole`/`senderName`, so it
  would have rendered with a blank sender name/badge in the doctor's report
  list. Gave it realistic values (submitted by the demo teacher account) so
  the demo data is coherent with the new pipeline.
- `frontend/src/services/medicalReportsService.js` (**new**) — thin API
  wrapper (`fetchReports`, `submitReportRequest`, `sendObservationRequest`,
  `fetchNotifications`, `markNotificationReadRequest`) that also normalizes
  backend documents (`_id` → `id`, `createdAt` → `submittedAt`,
  `metadata.senderRole` → `recipientRole`, etc.) back into the exact shape
  `MedicalReportsContext` always produced from `localStorage`.
- `frontend/src/context/MedicalReportsContext.jsx` — rewritten per the
  design above. **All 6 exported function names/signatures are unchanged**
  (`submitReport`, `sendObservation`, `markNotificationRead`,
  `getReportsForDoctor`, `getReportsForSender`, `getNotificationsForUser`),
  as are `allReports`/`allNotifications`. No other file needed to change.

**Manual trace performed (in lieu of a running server — do this again for
real once `npm install` works):**
1. Teacher submits an observation → `submitReport()` optimistically adds a
   temp report to local state, POSTs to `/reports` → backend creates it with
   `senderId = teacher's demo-user-0 id`, `status: "pending"`.
2. Doctor's `GET /reports` → `listReportsForUser` sees `role === "doctor"` →
   returns *every* report, including the teacher's.
3. Doctor calls `sendObservation(reportId, text)` → optimistic local update
   → `POST /reports/:id/observation` → `addObservation` sets
   `status: "reviewed"`, creates a `Notification` with
   `recipient: report.senderId` (the teacher) and
   `metadata: { reportId, senderRole: "teacher" }`.
4. Teacher's next poll tick (≤12s) → `GET /notifications` scoped to their id
   → sees the new notification. `NotificationCenter` bell badges it;
   `/teacher/notifications` page matches `notif.reportId` back to the report
   in `myReports` and displays the doctor's observation.
5. Privacy check: a parent's `GET /reports` only returns reports where
   `senderId` is their own id, so they never see the teacher's report or
   vice versa — this is now enforced **server-side**, not just by the
   frontend filtering shown data it already fetched (which was the old
   `localStorage` model's only line of defense).

This trace is internally consistent field-by-field (verified by grepping
every place `report.senderId`, `report.senderRole`, `notif.reportId`, etc.
are read on the frontend and confirming the backend produces exactly those
field names) — but it has not been exercised against a real running server.

## 3. What to do next, in priority order

**3.0 — Do this first, before anything else:** `npm install` in both
`backend/` and `frontend/`, then run the full verification loop in section 4
below for real. Fix whatever it surfaces before starting 2.2 — there is a
non-trivial chance something in 2.1 above needs a small correction once
actually executed (most likely candidates: an axios error-shape mismatch in
`medicalReportsService.js`, or a `BaseDemoRepository.find()` edge case).

### 3.1 Doctor dashboard rework
Master prompt explicitly says: remove the "Add Report ENV section" from the
doctor dashboard and route all edits through the same Health-Passport-edit
interface teacher already uses (`frontend/src/pages/teacher/CreatePassport.jsx`
looks like the closest existing pattern — check `frontend/src/pages/doctor/Dashboard.jsx`
around lines 260–470 where `sendObservation` is currently called from
inline UI). Doctor needs edit rights on: medical conditions, allergies,
diagnosis, doctor review, health-score recommendation. Teacher must NOT be
able to edit diagnosis/prescription/doctor review — enforce this in
whatever shared passport-edit component you build (prop like
`editableFields` per role, or split into `TeacherEditablePassportFields` /
`DoctorEditablePassportFields`).

### 3.2 Privacy/RBAC audit (partially done as a side effect of 2.1)
`backend/middleware/authMiddleware.js` has `protect` and `restrictTo` — use
these consistently on every new route. As of this session:
- ✅ Parent/Teacher/Student reports are now server-side scoped to their own
  `senderId` in `listReportsForUser` — no longer relying on frontend-only
  filtering.
- ✅ Notifications are now server-side scoped to `req.user` in
  `listNotificationsForUser` — previously `GET /notifications` leaked every
  role's notifications to every other role.
- ⬜ Still needs a pass: confirm `restrictTo` is applied consistently across
  *all* routes (not just reports/notifications) — `studentRoutes.js`,
  `appointmentRoutes.js`, `adminRoutes.js`, `doctorRoutes.js`,
  `parentRoutes.js` weren't touched this session and weren't re-audited.
- ⬜ Student can view but not edit/delete anything medical — not yet
  verified against actual route restrictions.

### 3.3 Admin dashboard
Per master prompt: user approval, password reset, role management, audit
logs, notification broadcast, system analytics. Check
`frontend/src/pages/admin/Dashboard.jsx` and `backend/controllers/adminController.js`
for what already exists vs. stubbed. Note: `GET /reports/browse` (paginated,
admin/doctor only) now exists from this session's 2.1 work and could back an
admin reports-browsing view if useful here.

### 3.4 Reports/PDF downloads
Master prompt wants every download button working, with school logo,
student photo, doctor/teacher signature, timestamp, QR verification. Check
`frontend/src/utils/exportHelpers.js` (`exportJsonAsPdf`, `exportJsonAsExcel`,
`printElement` — referenced in `pages/teacher/Reports.jsx`) for current
state; this looked functional for tabular exports but likely doesn't yet
produce the "professional PDF with logo/signature/QR" version.

### 3.5 Health Score algorithm, notification real-time updates, search/filter
consistency across all five dashboards, loading skeletons/empty states —
none of these were audited this session. Treat as backlog items per the
master prompt's own "Remaining optional enhancements" section. Note: the
12-second poll added in 2.1 is a reasonable interim "real-time" solution;
true real-time (WebSockets/SSE) is still a backlog item if the poll interval
proves too slow in practice.

## 4. How to verify your work as you go

- **First, `npm install` in both `backend/` and `frontend/`** — this session's
  sandbox had no network access so this has not been done since the project
  was zipped.
- Frontend: `cd frontend && npm run build` must complete with zero errors
  after every change (catches import/syntax issues fast).
- Backend: `cd backend && npm run dev`, then:
  - `curl http://localhost:5000/health` → `{"success":true,...}`
  - `curl -w "%{http_code}" http://localhost:5000/reports` (no auth header)
    → should be `401`, not `500`
  - `curl -w "%{http_code}" http://localhost:5000/reports/browse` (no auth
    header) → should be `401`
- Manually walk the teacher → doctor → teacher loop: log in as teacher,
  submit an observation via "Report Symptoms", log in as doctor, respond to
  it from the doctor dashboard, log back in as teacher, confirm the
  response shows up under the notification bell and at `/teacher/notifications`
  within ~12 seconds (the poll interval) without a manual page refresh.
- Also spot-check privacy: log in as parent, submit a report, confirm it
  does NOT show up when logged in as teacher (and vice versa), and that the
  doctor sees both.

## 5. Files touched this session (Session 2, for diff reference)

- `backend/models/Report.js`
- `backend/services/reportService.js`
- `backend/services/notificationService.js`
- `backend/controllers/reportController.js`
- `backend/controllers/notificationController.js`
- `backend/routes/reportRoutes.js`
- `backend/routes/notificationRoutes.js`
- `backend/routes/teacherRoutes.js`
- `backend/repositories/index.js`
- `frontend/src/services/medicalReportsService.js` (new)
- `frontend/src/context/MedicalReportsContext.jsx`

Session 1 files (prior handoff, untouched this session, re-confirmed
present and correct):
- `frontend/src/App.jsx`
- `frontend/src/components/dashboard/Sidebar.jsx`
- `frontend/src/components/dashboard/NotificationCenter.jsx`
- `frontend/src/pages/teacher/Dashboard.jsx`
- `frontend/src/pages/teacher/Notifications.jsx`
- `backend/middleware/errorMiddleware.js`
- `backend/server.js`
