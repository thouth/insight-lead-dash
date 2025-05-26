
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Lead {
  id?: string;
  date: string;
  company: string;
  org_number: string;
  status: string;
  source: string;
  seller: string;
  contact?: string;
  is_existing_customer?: boolean;
  kwp?: number;
  ppa_price?: number;
  created_at?: string;
  updated_at?: string;
}

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      
      return data as Lead[];
    },
  });
};

export const useLeadMetrics = () => {
  return useQuery({
    queryKey: ['lead-metrics'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');
      
      if (error) {
        console.error('Error fetching leads for metrics:', error);
        throw error;
      }

      const totalLeads = leads?.length || 0;
      const avgKwp = leads?.reduce((sum, lead) => sum + (lead.kwp || 0), 0) / Math.max(totalLeads, 1);
      const avgPpaPrice = leads?.reduce((sum, lead) => sum + (lead.ppa_price || 0), 0) / Math.max(totalLeads, 1);
      const qualifiedLeads = leads?.filter(lead => lead.status === 'Kvalifisert').length || 0;

      return {
        totalLeads,
        avgKwp: avgKwp.toFixed(1),
        avgPpaPrice: avgPpaPrice.toFixed(2),
        qualifiedLeads,
      };
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-metrics'] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    },
  });
};

export const useUpsertLeads = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leads: Lead[]) => {
      const results = [];
      
      for (const lead of leads) {
        try {
          // First try to find existing lead by org_number
          const { data: existingLead } = await supabase
            .from('leads')
            .select('*')
            .eq('org_number', lead.org_number)
            .maybeSingle();

          if (existingLead) {
            // Update existing lead, filling in empty fields
            const updatedLead = { ...existingLead };
            
            // Only update fields that are not empty in the new lead
            Object.keys(lead).forEach(key => {
              if (lead[key as keyof Lead] !== null && lead[key as keyof Lead] !== undefined && lead[key as keyof Lead] !== '') {
                (updatedLead as any)[key] = lead[key as keyof Lead];
              }
            });

            const { data, error } = await supabase
              .from('leads')
              .update(updatedLead)
              .eq('id', existingLead.id)
              .select()
              .single();

            if (error) throw error;
            results.push({ type: 'updated', data });
          } else {
            // Insert new lead
            const { data, error } = await supabase
              .from('leads')
              .insert([lead])
              .select()
              .single();

            if (error) throw error;
            results.push({ type: 'inserted', data });
          }
        } catch (error) {
          console.error('Error processing lead:', lead, error);
          results.push({ type: 'error', error, data: lead });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-metrics'] });
      
      const inserted = results.filter(r => r.type === 'inserted').length;
      const updated = results.filter(r => r.type === 'updated').length;
      const errors = results.filter(r => r.type === 'error').length;
      
      toast({
        title: "Import completed",
        description: `${inserted} new leads, ${updated} updated leads${errors > 0 ? `, ${errors} errors` : ''}`,
      });
    },
    onError: (error: any) => {
      console.error('Error importing leads:', error);
      toast({
        title: "Import failed",
        description: "Failed to import leads",
        variant: "destructive",
      });
    },
  });
};
