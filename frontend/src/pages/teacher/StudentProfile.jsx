import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";

import StudentHeader from "../../components/profile/StudentHeader";
import HealthOverview from "../../components/profile/HealthOverview";
import VaccinationCard from "../../components/profile/VaccinationCard";
import HealthTimeline from "../../components/profile/HealthTimeline";
import AISummary from "../../components/profile/AISummary";
import EmergencyContact from "../../components/profile/EmergencyContact";
import RecentReports from "../../components/profile/RecentReports";
function StudentProfile() {
  return (
    <DashboardLayout>

      <PageHeader
        title="Student Health Profile"
        subtitle="Complete health history and digital health passport."
      />

      <div className="space-y-8">

        <StudentHeader />

        <HealthOverview />

        <HealthTimeline />
        <VaccinationCard />

<AISummary />
<div className="grid gap-8 lg:grid-cols-2">
  <EmergencyContact />
  <RecentReports />
</div>
      </div>

    </DashboardLayout>
  );
}

export default StudentProfile;