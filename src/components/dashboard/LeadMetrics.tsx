
import { Users, BarChart2, PieChart } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';

export function LeadMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total antal leads"
        value="3,568"
        change="+12.5% fra forrige måned"
        changeType="positive"
        icon={<Users className="h-5 w-5" />}
      />
      <MetricCard
        title="Gjennomsnittlig kWp"
        value="85.2"
        change="+3.1% fra forrige måned"
        changeType="positive"
        icon={<BarChart2 className="h-5 w-5" />}
      />
      <MetricCard
        title="Gjennomsnittlig PPA pris"
        value="1.24"
        change="-2.3% fra forrige måned"
        changeType="negative"
        icon={<BarChart2 className="h-5 w-5" />}
      />
      <MetricCard
        title="Kvalifiserte leads"
        value="852"
        change="+14.2% fra forrige måned"
        changeType="positive"
        icon={<PieChart className="h-5 w-5" />}
      />
    </div>
  );
}
