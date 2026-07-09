import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  getRiskLabel,
  getRiskStyle,
  getStudentAvatar,
  symptomOptions,
} from "../../data/students";
import { useStudents } from "../../hooks/useStudents";
import {
  ChevronLeft,
  CheckCircle2,
  Activity,
  HeartPulse,
  UploadCloud,
  Thermometer,
  Calendar,
  AlertTriangle,
} from "lucide-react";

function StudentReportSymptoms() {
  const navigate = useNavigate();
  const { students, updateSymptoms } = useStudents();
  // Using the demo student
  const student = students.find((s) => s.name === "Aarav Sharma") || students[0];

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(3);
  const [temperature, setTemperature] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeline, setTimeline] = useState([]);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto rounded-3xl bg-white/70 backdrop-blur-xl border border-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Student not found</h1>
          <p className="mt-2 text-slate-500">Could not load your profile.</p>
        </div>
      </DashboardLayout>
    );
  }

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateSymptoms(student.id, {
        symptoms: selectedSymptoms,
        severity,
        temperature,
        date,
        notes,
      });
      setTimeline([
        {
          id: 1,
          date,
          title: "Symptom Reported",
          description: `You reported: ${selectedSymptoms.join(", ")}. Severity: ${severity}/10${
            temperature ? `. Temp: ${temperature} F` : ""
          }`,
          type: "warning",
        },
        {
          id: 2,
          date,
          title: "School Nurse Notified",
          description: "Alert sent to the health department.",
          type: "info",
        },
        {
          id: 3,
          date: "Pending",
          title: "Awaiting Doctor Review",
          description: "Your health passport is queued for review.",
          type: "pending",
        },
      ]);
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-100"
          >
            <div className="mx-auto h-20 w-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted</h2>
            <p className="text-slate-500 mb-8">
              Your symptoms have been recorded successfully. Please rest and stay hydrated.
            </p>

            <div className="text-left bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
              <h3 className="font-bold text-slate-800 mb-4">Action Timeline</h3>
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-5">
                {timeline.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.4 }}
                    key={item.id}
                    className="relative pl-6"
                  >
                    <span
                      className={`absolute -left-2 top-1 h-4 w-4 rounded-full border-4 border-slate-50 ${
                        item.type === "warning"
                          ? "bg-amber-500"
                          : item.type === "info"
                            ? "bg-blue-500"
                            : "bg-slate-300"
                      }`}
                    ></span>
                    <div className="font-semibold text-slate-700 text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Report Symptoms</h1>
            <p className="text-slate-500 font-medium">Not feeling well? Let the school nurse know.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Select Symptoms <span className="text-red-500">*</span>
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Multi-select</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {symptomOptions.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30 -translate-y-0.5"
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle size={16} className={severity > 7 ? "text-red-500" : severity > 4 ? "text-amber-500" : "text-emerald-500"} />
                    Severity Level
                  </label>
                  <span className={`text-sm font-bold ${severity > 7 ? "text-red-500" : severity > 4 ? "text-amber-500" : "text-emerald-500"}`}>
                    {severity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(event) => setSeverity(parseInt(event.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Temperature (F)</label>
                  <div className="relative">
                    <Thermometer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(event) => setTemperature(event.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Additional Notes</label>
                <textarea
                  rows="4"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="How are you feeling?"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Photo Attachment</label>
                <div className="flex-1 w-full border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-100 hover:border-blue-300 transition-colors cursor-pointer p-4 text-center">
                  <UploadCloud size={24} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">Upload photo<br />(Optional)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default StudentReportSymptoms;
