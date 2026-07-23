import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Search, Filter, CheckCircle2, Clock, AlertCircle, Eye, FilePlus, Activity, Trash2 } from "lucide-react";
import { getRiskLabel, getRiskStyle, getStudentAvatar } from "../../data/students";
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../hooks/useAuth";

const statusIcons = {
  healthy: CheckCircle2,
  observation: Clock,
  review: Clock,
  critical: AlertCircle,
};

function Students({ selectionMode = "manage" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role } = useAuth();
  const { students, loading, error, refreshStudents, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState(searchParams.get("filter") || "All");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (searchParams.get("filter")) {
      setFilterRisk(searchParams.get("filter"));
    }
  }, [searchParams]);

  const canDeleteStudents = role === "teacher";

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return students
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(normalizedSearch) ||
          String(student.id).includes(normalizedSearch) ||
          student.rollNo.toLowerCase().includes(normalizedSearch) ||
          String(student.class || "").toLowerCase().includes(normalizedSearch);
        const matchesRisk = filterRisk === "All" || student.risk === filterRisk;
        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "risk") return a.risk.localeCompare(b.risk);
        if (sortBy === "attendance") return Number(String(b.attendance).replace("%", "")) - Number(String(a.attendance).replace("%", ""));
        return Number(b.id) - Number(a.id);
      });
  }, [students, searchTerm, filterRisk, sortBy]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Remove this student from the class? This will delete the student record from the current class list.")) {
      return;
    }

    try {
      await deleteStudent(studentId);
      await refreshStudents();
    } catch (deleteError) {
      alert(deleteError?.message || "Unable to delete this student right now.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200/70" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-bold">Unable to load students</h1>
          <p className="mt-2">{error}</p>
          <button onClick={refreshStudents} className="mt-6 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Student Management
            </h1>
            <p className="text-slate-500 font-medium">
              View and manage student health profiles
            </p>
          </div>
          <button 
              onClick={() => navigate("/teacher/create-passport")}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-all"
            >
              <FilePlus size={18} />
              Create Passport
            </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-50/50 border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full sm:w-48 rounded-xl bg-slate-50/50 border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none"
            >
              <option value="All">All Health Risks</option>
              <option value="healthy">Healthy</option>
              <option value="observation">Observation</option>
              <option value="review">Needs Review</option>
              <option value="critical">Doctor Attention</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Activity size={18} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-44 rounded-xl bg-slate-50/50 border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none"
            >
              <option value="latest">Latest</option>
              <option value="name">Name</option>
              <option value="risk">Risk</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">ID & Class</th>
                  <th className="px-6 py-4 font-semibold">Health Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredStudents.map((student) => {
                  const StatusIcon = statusIcons[student.risk] || Clock;
                  const status = getRiskLabel(student.risk);
                  const style = getRiskStyle(student.risk);

                  return (
                  <tr key={student.id} className="hover:bg-white/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={getStudentAvatar(student)} alt={student.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.gender}, {student.bloodGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{student.rollNo}</div>
                      <div className="text-xs text-slate-500">Class {student.class}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${style.pill}`}>
                        <StatusIcon size={14} /> {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/passport/${student.id}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                          <Eye size={18} />
                        </button>
                        {canDeleteStudents && (
                          <button onClick={() => void handleDelete(student.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Student">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-sm text-slate-500">
            <div>Showing 1 to {filteredStudents.length} of {students.length} entries</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Students;
