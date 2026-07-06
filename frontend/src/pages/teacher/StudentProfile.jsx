import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";

import StudentHeader from "../../components/profile/StudentHeader";
import HealthOverview from "../../components/profile/HealthOverview";
import VaccinationCard from "../../components/profile/VaccinationCard";
import HealthTimeline from "../../components/profile/HealthTimeline";
import AISummary from "../../components/profile/AISummary";
import EmergencyContact from "../../components/profile/EmergencyContact";
import RecentReports from "../../components/profile/RecentReports";
import { useParams } from "react-router-dom";
import students from "../../data/students";
function StudentProfile() {
    const { id } = useParams();

const student = students.find(
  (s) => s.id === Number(id)
);

if (!student) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">
        Student not found
      </h1>
    </DashboardLayout>
  );
}
  return (
    <DashboardLayout>

      <PageHeader
        title="Student Health Profile"
        subtitle="Complete health history and digital health passport."
      />

      <div className="space-y-8">

        <StudentHeader student={student} />

        <HealthOverview student={student} />

        <HealthTimeline student={student} />
        <VaccinationCard student={student} />

<AISummary student={student} />
<div className="grid gap-8 lg:grid-cols-2">
 <EmergencyContact student={student} />
  <RecentReports student={student} />
</div>
      </div>

    </DashboardLayout>
  );
}

export default StudentProfile;