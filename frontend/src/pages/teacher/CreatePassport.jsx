import DashboardLayout from "../../components/dashboard/DashboardLayout";

function CreatePassport() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Create Digital Health Passport
      </h1>

      <p className="mt-2 text-slate-500">
        This page will contain the student health passport form.
      </p>
    </DashboardLayout>
  );
}

export default CreatePassport;