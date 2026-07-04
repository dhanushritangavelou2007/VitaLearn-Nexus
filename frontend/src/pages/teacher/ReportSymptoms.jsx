import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ReportSymptoms() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Report Symptoms
      </h1>

      <p className="mt-2 text-slate-500">
        Teachers can report symptoms observed at school.
      </p>
    </DashboardLayout>
  );
}

export default ReportSymptoms;