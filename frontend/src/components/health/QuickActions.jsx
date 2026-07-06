import {
  PlusCircle,
  Stethoscope,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Passport",
      description: "Register a new student health passport",
      icon: PlusCircle,
      path: "/teacher/create-passport",
    },
    {
      title: "Report Symptoms",
      description: "Record health observations",
      icon: Stethoscope,
      path: "/teacher/report-symptoms",
    },
    {
      title: "View Students",
      description: "Manage classroom health records",
      icon: Users,
      path: "/teacher/students",
    },
    {
      title: "Health Reports",
      description: "View reports and summaries",
      icon: FileText,
      path: "/teacher/reports",
    },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete the most common teacher workflows in one click.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <GlassCard
            key={action.title}
            onClick={() => navigate(action.path)}
            className="group cursor-pointer p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_-35px_rgba(37,99,235,0.45)]"
          >
            <div className="rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 p-3 text-white shadow-lg">
              <action.icon size={24} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {action.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
              Open
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;