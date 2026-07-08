import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function GlobalSearch() {
  const navigate = useNavigate();
  const { students, loading } = useStudents();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const reportResults = getRecentActivity(students, 20).filter((item) =>
      [item.studentName, item.title, item.description].some((field) => String(field || "").toLowerCase().includes(term))
    );

    const studentResults = students.filter((student) =>
      [student.name, student.rollNo, student.class, student.parent?.name].some((field) =>
        String(field || "").toLowerCase().includes(term)
      )
    );

    return [
      ...studentResults.slice(0, 5).map((student) => ({
        label: student.name,
        sublabel: `${student.rollNo} • ${student.class}`,
        path: `/teacher/student-profile/${student.id}`,
      })),
      ...reportResults.slice(0, 5).map((item) => ({
        label: item.title,
        sublabel: `${item.studentName} • ${item.description}`,
        path: `/teacher/student-profile/${item.studentId}`,
      })),
    ];
  }, [query, students]);

  return (
    <div className="relative">
      <div className="hidden md:flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 border border-slate-200/60 shadow-sm backdrop-blur-sm">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={loading ? "Loading..." : "Search students, reports, parents..."}
          className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-52 text-slate-700"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} className="text-slate-400">
            <X size={16} />
          </button>
        ) : null}
      </div>

      {open && query ? (
        <div className="absolute right-0 top-14 z-30 w-[28rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Global Search
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length ? results.map((item) => (
              <button
                key={`${item.label}-${item.path}`}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full flex-col rounded-2xl px-4 py-3 text-left hover:bg-slate-50"
              >
                <span className="font-semibold text-slate-800">{item.label}</span>
                <span className="text-sm text-slate-500">{item.sublabel}</span>
              </button>
            )) : (
              <div className="px-4 py-6 text-sm text-slate-500">No results found.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default GlobalSearch;

