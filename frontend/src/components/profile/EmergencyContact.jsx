import GlassCard from "../ui/GlassCard";
import { Phone, User, Stethoscope } from "lucide-react";

const contacts = [
  {
    role: "Father",
    name: "Rajesh Sharma",
    phone: "+91 98765 43210",
    icon: User,
  },
  {
    role: "Mother",
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    icon: User,
  },
  {
    role: "Family Doctor",
    name: "Dr. Meera Nair",
    phone: "+91 98765 43212",
    icon: Stethoscope,
  },
];

function EmergencyContact() {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Emergency Contacts
      </h2>

      <div className="space-y-4">
        {contacts.map((contact) => {
          const Icon = contact.icon;

          return (
            <div
              key={contact.phone}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Icon className="text-blue-600" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {contact.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {contact.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-600">
                <Phone size={18} />
                {contact.phone}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

export default EmergencyContact;