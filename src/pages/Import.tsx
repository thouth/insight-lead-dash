
import { ImportForm } from '@/components/import/ImportForm';
import Layout from '@/components/Layout';

const Import = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">Upload files, connect to email, or integrate with external APIs</p>
        </div>
        
        <ImportForm />
      </div>
    </Layout>
  );
};

export default Import;
