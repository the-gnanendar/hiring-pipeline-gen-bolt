
import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { HiringPipeline } from "@/components/dashboard/HiringPipeline";
import { Calendar, FileText, FolderPlus, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <Layout title="Dashboard">
      <div className="grid gap-6">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Candidates"
            value="1,482"
            change="+12% from last month"
            trend="up"
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Open Positions"
            value="42"
            change="5 new this week"
            trend="neutral"
            icon={<FolderPlus className="h-5 w-5" />}
          />
          <StatsCard
            title="Applications Today"
            value="36"
            change="+8% from yesterday"
            trend="up"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatsCard
            title="Interviews Scheduled"
            value="15"
            change="3 for today"
            trend="neutral"
            icon={<Calendar className="h-5 w-5" />}
          />
        </section>
        
        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <RecentActivity />
          <div className="space-y-6 xl:col-span-1">
            <RecentApplications />
          </div>
        </section>
        
        <section>
          <HiringPipeline />
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
