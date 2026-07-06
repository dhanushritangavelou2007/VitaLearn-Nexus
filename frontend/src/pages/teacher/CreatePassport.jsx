import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";

import StudentInfoForm from "../../components/passport/StudentInfoForm";
import ParentInfoForm from "../../components/passport/ParentInfoForm";
import EmergencyInfoForm from "../../components/passport/EmergencyInfoForm";
import HealthInfoForm from "../../components/passport/HealthInfoForm";

function CreatePassport() {
  return (
    <DashboardLayout>

      <PageHeader
        title="Create Digital Health Passport"
        subtitle="Register a student and generate their Digital Health Passport."
      />

      {/* Progress Indicator */}
      <div className="mb-8 flex flex-wrap gap-4">

        <div className="rounded-full bg-blue-600 px-5 py-2 text-white shadow">
          1. Student
        </div>

        <div className="rounded-full bg-emerald-600 px-5 py-2 text-white shadow">
          2. Parent
        </div>

        <div className="rounded-full bg-amber-500 px-5 py-2 text-white shadow">
          3. Emergency
        </div>

        <div className="rounded-full bg-purple-600 px-5 py-2 text-white shadow">
          4. Health
        </div>

      </div>

      <div className="space-y-8">

        <StudentInfoForm />

        <ParentInfoForm />

        <EmergencyInfoForm />

        <HealthInfoForm />

      </div>

      <div className="mt-10 flex justify-end gap-4">

        <PrimaryButton>
          Save Draft
        </PrimaryButton>

        <PrimaryButton>
          Create Passport
        </PrimaryButton>

      </div>

    </DashboardLayout>
  );
}

export default CreatePassport;