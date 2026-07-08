import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, GraduationCap, Stethoscope, Users, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { demoAccounts } from "../../services/authService";

const roleCards = [
  { role: "teacher", title: "Teacher", icon: GraduationCap, accent: "from-blue-600 to-cyan-500" },
  { role: "doctor", title: "Doctor", icon: Stethoscope, accent: "from-rose-600 to-orange-500" },
  { role: "parent", title: "Parent", icon: Users, accent: "from-emerald-600 to-teal-500" },
  { role: "student", title: "Student", icon: Sparkles, accent: "from-indigo-600 to-violet-500" },
  { role: "admin", title: "Admin", icon: ShieldCheck, accent: "from-slate-700 to-slate-900" },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();
  const [email, setEmail] = useState("teacher@vitalearn.ai");
  const [password, setPassword] = useState("Teacher@123");
  const [selectedRole, setSelectedRole] = useState("teacher");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname;

  const activeDemo = useMemo(() => demoAccounts.find((account) => account.role === selectedRole), [selectedRole]);

  if (isAuthenticated) {
    return <Navigate to={from || `/`} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const session = await login(email, password, rememberMe);
      navigate(from || session.dashboardPath, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Login failed.");
    }
  };

  const useDemoAccount = (account) => {
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_25%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_35%)]" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl lg:p-10">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100">
              <Sparkles size={16} className="text-cyan-300" />
              VitaLearn Nexus School Health Intelligence
            </div>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              Secure health passports for every role in one platform.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Enterprise-grade login for teachers, doctors, parents, students, and administrators with role-aware dashboards and persistent sessions.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {roleCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => useDemoAccount(demoAccounts.find((account) => account.role === card.role))}
                  className={`rounded-3xl border border-white/10 bg-white/10 p-5 text-left transition-all hover:-translate-y-1 hover:bg-white/15 ${selectedRole === card.role ? "ring-2 ring-cyan-300/70" : ""}`}
                >
                  <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white ${card.accent}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-lg font-semibold text-white">{card.title}</div>
                  <div className="mt-1 text-sm text-slate-300">{demoAccounts.find((account) => account.role === card.role)?.email}</div>
                </button>
              );
            })}
          </div>

          {activeDemo ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5 text-sm text-slate-200">
              <div className="font-semibold text-white">Selected demo account</div>
              <div className="mt-2">{activeDemo.email}</div>
              <div className="text-slate-300">{activeDemo.role} access to {activeDemo.dashboardPath}</div>
            </div>
          ) : null}
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-white/20 bg-white/90 p-6 text-slate-900 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Sign In</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Use your school role to continue to the correct dashboard.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500">
                  <Mail size={18} className="text-slate-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="you@vitalearn.ai" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700">
                Sign In <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8">
              <div className="mb-4 text-sm font-semibold text-slate-700">Demo Login</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => useDemoAccount(account)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selectedRole === account.role ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  >
                    <div className="font-semibold text-slate-900">{account.label}</div>
                    <div className="text-slate-500">{account.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
