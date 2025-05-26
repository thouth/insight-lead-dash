
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLeadChartData = () => {
  return useQuery({
    queryKey: ['lead-chart-data'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');
      
      if (error) {
        console.error('Error fetching leads for charts:', error);
        throw error;
      }

      // Process data for source chart
      const sourceGroups = leads?.reduce((acc: any, lead) => {
        const source = lead.source || 'Unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {}) || {};

      const sourceData = Object.entries(sourceGroups).map(([name, value], index) => ({
        name,
        value: value as number,
        color: ['#4263eb', '#20c997', '#f59f00', '#da77f2', '#fa5252'][index % 5]
      }));

      // Process data for status chart
      const statusGroups = leads?.reduce((acc: any, lead) => {
        const status = lead.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}) || {};

      const statusData = Object.entries(statusGroups).map(([name, value], index) => ({
        name,
        value: value as number,
        color: ['#4263eb', '#f59f00', '#9775fa', '#da77f2', '#20c997'][index % 5]
      }));

      // Process data for kWp per status chart
      const kwpByStatus = leads?.reduce((acc: any, lead) => {
        const status = lead.status || 'Unknown';
        if (lead.kwp) {
          if (!acc[status]) {
            acc[status] = { total: 0, count: 0 };
          }
          acc[status].total += Number(lead.kwp);
          acc[status].count += 1;
        }
        return acc;
      }, {}) || {};

      const kwpData = Object.entries(kwpByStatus).map(([name, data]: [string, any], index) => ({
        name,
        avgKwp: Number((data.total / data.count).toFixed(1)),
        color: ['#4263eb', '#f59f00', '#9775fa', '#da77f2', '#20c997'][index % 5]
      }));

      // Process data for PPA prices line chart
      const ppaData = leads?.filter(lead => lead.ppa_price)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(lead => ({
          date: new Date(lead.date).toLocaleDateString('nb-NO'),
          price: Number(lead.ppa_price),
          company: lead.company
        })) || [];

      return {
        sourceData,
        statusData,
        kwpData,
        ppaData
      };
    },
  });
};
