import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import GlassCard from "../../components/ui/GlassCard";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, HeartPulse, ShieldCheck, Syringe, FileText } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function ParentDashboard() {
  const location = useLocation();
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const child = students.find(s => s.name === "Aarav Sharma") || students[0];
  const stats = calculateDashboardStats();
  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];
  const distributionData = [
    { name: "Healthy", value: stats.riskDistribution?.Healthy || stats.riskDistribution?.healthy || 0 },
    { name: "Observation", value: (stats.riskDistribution?.Moderate || stats.riskDistribution?.moderate || 0) + (stats.riskDistribution?.["High Risk"] || stats.riskDistribution?.high || 0) },
    { name: "Critical", value: stats.critical || 0 },
  ];

  const isTimeline = location.pathname.includes("timeline");
  const isNotifications = location.pathname.includes("notifications");
  const isVaccination = location.pathname.includes("vaccination");
  const isMainDashboard = !isTimeline && !isNotifications && !isVaccination;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-bold">Unable to load parent dashboard</h1>
          <p className="mt-2">{error}</p>
          <button onClick={refreshStudents} className="mt-6 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!child) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-700">
          <h1 className="text-2xl font-bold">No student records found</h1>
          <p className="mt-2">We couldn't find any student records linked to your account.</p>
        </div>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div className="rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Hello, {child.parent?.name || "Parent"}</h1>
          <p className="mt-2 text-blue-100">Your child’s health updates are now visible in one secure place.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Health Score" value={`${child.healthScore || 90}/100`} subtitle="Overall wellness" icon={HeartPulse} color="text-emerald-600" bg="bg-emerald-500" />
          <DashboardCard title="BMI" value={child.vitals?.bmi || "N/A"} subtitle="Body Mass Index" icon={ShieldCheck} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="Heart Rate" value={child.vitals?.heartRate || "N/A"} subtitle="bpm" icon={HeartPulse} color="text-amber-600" bg="bg-amber-500" />
          <DashboardCard title="Temperature" value={`${child.vitals?.temperature || "N/A"}°F`} subtitle="Current temp" icon={Bell} color="text-slate-700" bg="bg-slate-700" />
        </div>

        {isMainDashboard && (
          <>
            <div id="passport" className="grid gap-6 xl:grid-cols-12">
              <GlassCard className="xl:col-span-7 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">AI Health Summary</h2>
                    <p className="text-sm text-slate-500">Latest wellness summary for {child.name}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {child.aiSummary || `${child.name} is maintaining a good health record. Ensure they drink plenty of water and get enough rest.`}
                </div>
                
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Medical History" value={child.medicalConditions?.join(", ") || "None"} accent="blue" />
                  <InfoCard label="Allergies" value={child.allergies?.join(", ") || "None"} accent="amber" />
                </div>
              </GlassCard>

              <GlassCard className="xl:col-span-5 p-6 flex flex-col justify-center items-center text-center">
                 <h2 className="text-lg font-bold text-slate-800 mb-6">Vaccination Progress</h2>
                 <div className="h-48 w-48 rounded-full border-8 border-indigo-100 border-t-indigo-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-700">{child.vaccinations?.length || 0}/4</span>
                 </div>
                 <p className="mt-4 text-sm text-slate-500">Core vaccinations recorded</p>
              </GlassCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Pediatrician Notes</h2>
                <div className="space-y-3">
                  {child.reports && child.reports.length > 0 ? (
                    child.reports.map((r, i) => (
                      <div key={i} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 border border-slate-100">
                        <span className="font-semibold block">{r.date} - {r.type}</span>
                        {r.status}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No recent notes.</p>
                  )}
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Symptom History</h2>
                <div className="space-y-3">
                  {child.symptoms?.length > 0 && child.symptoms[0] !== "None" ? (
                    child.symptoms.map((s, i) => (
                      <div key={i} className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700 border border-amber-100">
                        {s}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No symptoms reported recently.</p>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h2>
                <div className="space-y-3">
                   <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 border border-blue-100">
                      <span className="font-semibold block">Next Checkup</span>
                      Schedule pending. Please book an appointment if symptoms persist.
                   </div>
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {isNotifications && (
          <GlassCard id="notifications" className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
                <p className="text-sm text-slate-500">Recent updates from school</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <NotificationItem title="Symptom note added" description="Observed mild cough during the day." />
              <NotificationItem title="Vaccination reminder" description="Upcoming immunization due next week." />
            </div>
          </GlassCard>
        )}

        {isVaccination && (
          <div id="vaccination" className="grid gap-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-slate-800">Vaccination Records</h2>
              <div className="mt-6 space-y-3">
                {child.vaccinations?.map((vac) => (
                  <div key={vac} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="font-semibold text-emerald-800">{vac}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {isTimeline && (
          <div id="timeline" className="grid gap-6 lg:grid-cols-2">
            <HealthTrendChart 
              data={[
                { day: "Jan", height: Math.max(0, parseFloat(child.vitals?.height || 140) - 3), weight: Math.max(0, parseFloat(child.vitals?.weight || 35) - 2) },
                { day: "Mar", height: Math.max(0, parseFloat(child.vitals?.height || 140) - 2), weight: Math.max(0, parseFloat(child.vitals?.weight || 35) - 1) },
                { day: "May", height: Math.max(0, parseFloat(child.vitals?.height || 140) - 1), weight: Math.max(0, parseFloat(child.vitals?.weight || 35) - 0.5) },
                { day: "Jul", height: parseFloat(child.vitals?.height || 140), weight: parseFloat(child.vitals?.weight || 35) },
              ]} 
              title="Child Growth (Height & Weight)" 
              dataKey="height"
            />
            <HealthAreaChart 
              data={[
                { day: "Week 1", value: 85 },
                { day: "Week 2", value: 88 },
                { day: "Week 3", value: 87 },
                { day: "Week 4", value: parseFloat(child.healthScore || 90) },
              ]} 
              title="Health Score Trend" 
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ label, value, accent }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${styles[accent]}`}>{value}</p>
    </div>
  );
}

function NotificationItem({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default ParentDashboard;
