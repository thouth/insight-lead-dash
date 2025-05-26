
import { Users, BarChart2, PieChart } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { useLeadMetrics } from '@/hooks/useLeads';

export function LeadMetrics() {
  const { data: metrics, isLoading } = useLeadMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total antal leads"
        value={metrics?.totalLeads.toLocaleString() || "0"}
        change="Basert på databasedata"
        changeType="positive"
        icon={<Users className="h-5 w-5" />}
      />
      <MetricCard
        title="Gjennomsnittlig kWp"
        value={metrics?.avgKwp || "0"}
        change="Basert på databasedata"
        changeType="positive"
        icon={<BarChart2 className="h-5 w-5" />}
      />
      <MetricCard
        title="Gjennomsnittlig PPA pris"
        value={metrics?.avgPpaPrice || "0"}
        change="Basert på databasedata"
        changeType="positive"
        icon={<BarChart2 className="h-5 w-5" />}
      />
      <MetricCard
        title="Kvalifiserte leads"
        value={metrics?.qualifiedLeads.toLocaleString() || "0"}
        change="Basert på databasedata"
        changeType="positive"
        icon={<PieChart className="h-5 w-5" />}
      />
    </div>
  );
}
