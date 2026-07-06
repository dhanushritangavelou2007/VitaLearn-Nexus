import { ShieldCheck, Brain, FileText, Activity } from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-blue-600" />,
      title: "Digital Health Passport",
      description:
        "Maintain a secure, centralized health record for every student.",
    },
    {
      icon: <Brain className="h-10 w-10 text-blue-600" />,
      title: "AI Health Summary",
      description:
        "Generate quick AI-assisted summaries to help doctors review cases faster.",
    },
    {
      icon: <Activity className="h-10 w-10 text-blue-600" />,
      title: "Symptom Tracking",
      description:
        "Teachers, parents, and students can report symptoms for medical review.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-blue-600" />,
      title: "Secure Role Access",
      description:
        "Each user only accesses the information they're authorized to see.",
    },
  ];

  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Powerful Features
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Everything schools need to manage student healthcare efficiently.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-2 hover:shadow-xl"
            >
              {feature.icon}

              <h3 className="mt-6 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;