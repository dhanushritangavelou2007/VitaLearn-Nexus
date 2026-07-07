import api from "./api";

const STORAGE_KEY = "vitalearn.auth.session";

export const demoAccounts = [
  {
    role: "teacher",
    email: "teacher@vitalearn.ai",
    password: "Teacher@123",
    name: "Ms. Priya Sharma",
    label: "Teacher",
    dashboardPath: "/teacher/dashboard",
  },
  {
    role: "doctor",
    email: "doctor@vitalearn.ai",
    password: "Doctor@123",
    name: "Dr. Ananya Rao",
    label: "Doctor",
    dashboardPath: "/doctor/dashboard",
  },
  {
    role: "parent",
    email: "parent@vitalearn.ai",
    password: "Parent@123",
    name: "Mr. Rajesh Sharma",
    label: "Parent",
    dashboardPath: "/parent/dashboard",
  },
  {
    role: "student",
    email: "student@vitalearn.ai",
    password: "Student@123",
    name: "Aarav Sharma",
    label: "Student",
    dashboardPath: "/student/dashboard",
  },
  {
    role: "admin",
    email: "admin@vitalearn.ai",
    password: "Admin@123",
    name: "School Admin",
    label: "Admin",
    dashboardPath: "/admin/dashboard",
  },
];

export function getStoredSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function authenticate(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  const user = data.user || data.data?.user;
  const token = data.token || data.data?.token;
  if (!user || !token) {
    throw new Error("Invalid login response from server.");
  }
  return {
    user,
    token,
    dashboardPath: getRoleHome(user.role),
    rememberMe: true,
  };
}

export function getRoleHome(role) {
  const account = demoAccounts.find((item) => item.role === role);
  return account?.dashboardPath || "/teacher/dashboard";
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user || data.data?.user || null;
}

export async function logoutRequest() {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore logout failures; local session will still clear
  }
}
