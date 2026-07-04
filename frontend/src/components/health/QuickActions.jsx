import { PlusCircle, Stethoscope, Users, FileText, ArrowRight } from "lucide-react";

const actions = [
  {
    title: "Create Passport",
    description: "Register a new student health passport",
    icon: PlusCircle,
  },
  {
    title: "Report Symptoms",
    description: "Record health observations",
    icon: Stethoscope,
  },
  {
    title: "View Students",
    description: "Manage classroom health records",
    icon: Users,
  },
  {
    title: "Health Reports",
    description: "View reports and summaries",
    icon: FileText,
  },
];

function QuickActions() {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-slate-800">
        Quick Actions
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <div
            key={action.title}
            className="group cursor-pointer rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <action.icon
              size={36}
              className="mb-4 text-blue-600"
            />

            <h3 className="text-lg font-semibold">
              {action.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {action.description}
            </p>

            <ArrowRight
              className="mt-6 text-blue-600 transition-transform group-hover:translate-x-2"
              size={20}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;