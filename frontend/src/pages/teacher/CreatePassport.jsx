import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { CheckCircle2, ChevronRight, User, Phone, AlertTriangle } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function CreatePassport() {
  const navigate = useNavigate();
  const { addStudent } = useStudents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    className: "",
    section: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    parentName: "",
    relationship: "",
    parentPhone: "",
    parentEmail: "",
    emergencyContact: "",
    allergies: "",
    medicalConditions: "",
  });

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newStudentPayload = {
      name: formData.name,
      rollNo: formData.rollNo,
      class: [formData.className, formData.section].filter(Boolean).join("-"),
      dob: formData.dob,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      parent: {
        name: formData.parentName,
        contact: formData.parentPhone,
        email: formData.parentEmail,
      },
      emergencyContact: formData.emergencyContact,
      allergies: formData.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      medicalConditions: formData.medicalConditions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      vaccinations: ["BCG", "OPV", "COVID-19"],
      symptoms: ["None"],
      reports: [],
      risk: "healthy",
      attendance: "100%",
      lastUpdate: "Just created",
      passportStatus: "Completed",
    };

    setTimeout(() => {
      addStudent(newStudentPayload);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowCard(true);
      }, 2500);
    }, 1500);
  };

  const studentClass = [formData.className, formData.section].filter(Boolean).join("-");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <button onClick={() => navigate("/teacher/students")} className="hover:text-blue-600 transition-colors">Students</button>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Create Passport</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create Digital Health Passport</h1>
          <p className="text-slate-500">Register a new student and generate their Digital Health Passport.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info */}
          <section className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><User size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Student Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput label="Student Name" placeholder="e.g. Arjun Verma" value={formData.name} onChange={(value) => updateField("name", value)} required />
              <FormInput label="Roll Number" placeholder="8A21" value={formData.rollNo} onChange={(value) => updateField("rollNo", value)} required />
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Class" options={["VI", "VII", "VIII", "IX", "X"]} value={formData.className} onChange={(value) => updateField("className", value)} required />
                <FormSelect label="Section" options={["A", "B", "C"]} value={formData.section} onChange={(value) => updateField("section", value)} required />
              </div>
              <FormInput label="Date of Birth" type="date" value={formData.dob} onChange={(value) => updateField("dob", value)} required />
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Gender" options={["Male", "Female", "Other"]} value={formData.gender} onChange={(value) => updateField("gender", value)} required />
                <FormSelect label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={formData.bloodGroup} onChange={(value) => updateField("bloodGroup", value)} required />
              </div>
            </div>
          </section>

          {/* Parent Info */}
          <section className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Phone size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Parent Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput label="Parent Name" placeholder="Full Name" value={formData.parentName} onChange={(value) => updateField("parentName", value)} required />
              <FormSelect label="Relationship" options={["Father", "Mother", "Guardian"]} value={formData.relationship} onChange={(value) => updateField("relationship", value)} required />
              <FormInput label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.parentPhone} onChange={(value) => updateField("parentPhone", value)} required />
              <FormInput label="Email Address" type="email" placeholder="email@example.com" value={formData.parentEmail} onChange={(value) => updateField("parentEmail", value)} />
            </div>
          </section>

          {/* Emergency Profile */}
          <section className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Emergency Profile</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput label="Emergency Contact" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.emergencyContact} onChange={(value) => updateField("emergencyContact", value)} required />
              <FormInput label="Allergies" placeholder="e.g. Peanuts, Dust (comma separated)" value={formData.allergies} onChange={(value) => updateField("allergies", value)} />
              <FormInput label="Existing Medical Conditions" placeholder="e.g. Asthma" value={formData.medicalConditions} onChange={(value) => updateField("medicalConditions", value)} className="sm:col-span-2" />
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              Save Draft
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2">
              {isSubmitting ? "Processing..." : "Create Passport"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Dialog & Passport Card Modal */}
      <AnimatePresence>
        {(showSuccess || showCard) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-transparent w-full max-w-md my-auto"
            >
              {showSuccess && !showCard && (
                <div className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-auto">
                  <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Success!</h3>
                  <p className="text-slate-500 font-medium">Digital Health Passport has been created successfully.</p>
                </div>
              )}

              {showCard && (
                <div className="flex flex-col items-center">
                  {/* Printable Passport Card inside Modal */}
                  <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative">
                    <div className="bg-linear-to-br from-blue-600 to-emerald-600 p-6 text-white text-center relative overflow-hidden">
                      <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-white opacity-10 blur-2xl"></div>
                      <h3 className="font-bold text-xl tracking-tight relative z-10">VitaLearn Nexus</h3>
                      <p className="text-white/80 text-xs uppercase tracking-widest mt-1 relative z-10">Digital Health Passport</p>
                      
                      <div className="mt-6 flex justify-center relative z-10">
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg rotate-3 transition-transform hover:rotate-0">
                          <img src={`https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&h=150&fit=crop&auto=format`} alt={formData.name} className="h-full w-full rounded-xl object-cover" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8 pb-10 bg-slate-50 relative">
                      <div className="absolute right-6 top-6 h-16 w-16 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
                        {/* QR Placeholder */}
                        <div className="w-full h-full border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center">
                            <span className="text-[10px] text-slate-400 font-bold leading-none">QR</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
                        <p className="text-slate-500 text-sm font-medium">Roll Number: {formData.rollNo}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Class</p>
                          <p className="font-semibold text-slate-700 text-base">{studentClass}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Blood Group</p>
                          <p className="font-semibold text-red-600 text-base">{formData.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Parent</p>
                          <p className="font-semibold text-emerald-600 flex items-center gap-1.5 text-base bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> {formData.parentName}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Emergency</p>
                          <p className="font-semibold text-slate-700 text-base">{formData.emergencyContact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex w-full gap-4">
                    <button onClick={() => { setShowCard(false); navigate("/teacher/students"); }} className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                      Done
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors">
                      Print Card
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}

// Reusable Form Components specifically for this page to keep it self-contained
function FormInput({ label, type = "text", placeholder, value, onChange, required, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm placeholder:text-slate-400 text-sm font-medium"
      />
    </div>
  );
}

function FormSelect({ label, options, value, onChange, required, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <select 
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm font-medium appearance-none"
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

export default CreatePassport;
