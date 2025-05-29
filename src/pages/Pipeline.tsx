
import Layout from '@/components/Layout';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';

const Pipeline = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
        </div>
        
        <PipelineBoard />
      </div>
    </Layout>
  );
};

export default Pipeline;
