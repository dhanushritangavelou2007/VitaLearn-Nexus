import GlassCard from "../ui/GlassCard";
import { Syringe, CircleCheck, Clock3 } from "lucide-react";

const vaccines = [
  {
    name: "Polio",
    status: "Completed",
    completed: true,
  },
  {
    name: "Hepatitis B",
    status: "Completed",
    completed: true,
  },
  {
    name: "MMR Booster",
    status: "Completed",
    completed: true,
  },
  {
    name: "COVID Booster",
    status: "Due Next Month",
    completed: false,
  },
];

function VaccinationCard() {
  return (
    <GlassCard className="p-8">

      <div className="flex items-center gap-3 mb-6">

        <div className="rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 p-3 text-white">

          <Syringe size={24} />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Vaccination Record
          </h2>

          <p className="text-slate-500">
            Student Immunization History
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {vaccines.map((vaccine) => (

          <div
            key={vaccine.name}
            className="flex items-center justify-between rounded-2xl border border-slate-200 p-5"
          >

            <div>

              <h3 className="font-semibold text-slate-800">
                {vaccine.name}
              </h3>

            </div>

            {vaccine.completed ? (

              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">

                <CircleCheck size={18} />

                {vaccine.status}

              </div>

            ) : (

              <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-700">

                <Clock3 size={18} />

                {vaccine.status}

              </div>

            )}

          </div>

        ))}

      </div>

    </GlassCard>
  );
}

export default VaccinationCard;