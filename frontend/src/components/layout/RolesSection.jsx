import {
  School,
  GraduationCap,
  Stethoscope,
  User,
  Shield,
} from "lucide-react";

function RolesSection() {
  const roles = [
    {
      icon: <School className="h-12 w-12 text-blue-600" />,
      title: "School Admin",
      description:
        "Manages the school, teachers, doctors, classes and overall system access.",
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-blue-600" />,
      title: "Teacher",
      description:
        "Registers students, monitors classroom health and reports symptoms.",
    },
    {
      icon: <Stethoscope className="h-12 w-12 text-blue-600" />,
      title: "Doctor",
      description:
        "Reviews health records, verifies symptoms and updates medical reports.",
    },
    {
      icon: <User className="h-12 w-12 text-blue-600" />,
      title: "Parent / Student",
      description:
        "View health passport, report symptoms and receive important updates.",
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "AI Assistant",
      description:
        "Generates health summaries to support doctors. Final medical decisions are always made by healthcare professionals.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            One Platform, Five Connected Roles
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Every stakeholder collaborates securely through VitaLearn Nexus.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {roles.map((role, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              {role.icon}

              <h3 className="mt-6 text-2xl font-bold">
                {role.title}
              </h3>

              <p className="mt-4 text-slate-600">
                {role.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default RolesSection;