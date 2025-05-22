
import { LeadMetrics } from '@/components/dashboard/LeadMetrics';
import { RecentLeads } from '@/components/dashboard/RecentLeads';
import { LeadCharts } from '@/components/dashboard/LeadCharts';
import Layout from '@/components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <LeadMetrics />
        
        <div className="mt-6">
          <RecentLeads />
        </div>
        
        <LeadCharts />
      </div>
    </Layout>
  );
};

export default Dashboard;
