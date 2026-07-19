import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Bell, Lock, MoonStar, UserCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

function Settings() {
  const { user, role } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Settings</h1>
          <p className="mt-2 text-slate-500">
            Manage your profile, security, and communication preferences.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
                <UserCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Profile</h2>
                <p className="text-sm text-slate-500">Keep your school account details updated.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full Name" value={user?.name || "Not available"} />
              <Field label="Role" value={role ? role.charAt(0).toUpperCase() + role.slice(1) : "Not available"} />
              <Field label="Email" value={user?.email || "Not available"} />
              <Field label="Department" value="Student Wellness" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">Security Status</h3>
                  <p className="text-sm text-slate-500">Your account is protected with multi-factor authentication.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Secure
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
                  <p className="text-sm text-slate-500">Choose how you receive school health updates.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleRow
                  label="Health alerts"
                  description="Receive urgent reports for high-risk students"
                  enabled={true}
                />
                <ToggleRow
                  label="Weekly digest"
                  description="Get a summary of student wellness activity"
                  enabled={true}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                  <MoonStar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Preferences</h2>
                  <p className="text-sm text-slate-500">Adjust the interface to suit your workflow.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleRow
                  label="Dark mode"
                  description="Use a darker interface for low-light viewing"
                  enabled={isDarkMode}
                  onToggle={toggleTheme}
                />
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-slate-500" />
                    <div>
                      <h3 className="font-semibold text-slate-800">Reset password</h3>
                      <p className="text-sm text-slate-500">Update your account password securely.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function ToggleRow({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div>
        <h3 className="font-semibold text-slate-800">{label}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export default Settings;
