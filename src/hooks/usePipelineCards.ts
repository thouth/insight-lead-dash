
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type PipelineCard = {
  id: string;
  user_id: string;
  name: string;
  stage: 'not_started' | 'mapping' | 'quote_phase' | 'negotiation' | 'parked' | 'closed';
  priority: 'H' | 'M' | 'L';
  assigned_to: string | null;
  notes: string | null;
  date_created: string;
  date_updated: string;
  created_at: string;
  updated_at: string;
};

export type CreatePipelineCard = {
  name: string;
  stage: PipelineCard['stage'];
  priority: PipelineCard['priority'];
  assigned_to?: string;
  notes?: string;
  date_created?: string;
};

export type UpdatePipelineCard = Partial<CreatePipelineCard> & {
  id: string;
};

export const usePipelineCards = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pipeline-cards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('pipeline_cards')
        .select('*')
        .order('date_created', { ascending: true });
      
      if (error) throw error;
      return data as PipelineCard[];
    },
    enabled: !!user,
  });
};

export const useCreatePipelineCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardData: CreatePipelineCard) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('pipeline_cards')
        .insert({
          ...cardData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards'] });
      toast({
        title: "Success",
        description: "Card created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create card",
        variant: "destructive",
      });
      console.error('Error creating card:', error);
    },
  });
};

export const useUpdatePipelineCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdatePipelineCard) => {
      const { data, error } = await supabase
        .from('pipeline_cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update card",
        variant: "destructive",
      });
      console.error('Error updating card:', error);
    },
  });
};

export const useDeletePipelineCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pipeline_cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards'] });
      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      });
      console.error('Error deleting card:', error);
    },
  });
};
