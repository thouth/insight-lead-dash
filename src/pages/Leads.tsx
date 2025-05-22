
import { LeadTable } from '@/components/leads/LeadTable';
import Layout from '@/components/Layout';

const Leads = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        </div>
        
        <LeadTable />
      </div>
    </Layout>
  );
};

export default Leads;
