
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ImportHistory {
  id: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  skippedRows: number;
  status: 'completed' | 'failed' | 'processing';
  errorMessage?: string;
  createdAt: string;
}

export const useImportHistory = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['import-history'],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('import_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching import history:', error);
        throw error;
      }

      // Map database fields to interface
      const mappedData: ImportHistory[] = (data || []).map((item) => ({
        id: item.id,
        fileName: item.file_name,
        totalRows: item.total_rows,
        validRows: item.valid_rows,
        errorRows: item.error_rows,
        skippedRows: item.skipped_rows,
        status: item.status as 'completed' | 'failed' | 'processing',
        errorMessage: item.error_message,
        createdAt: item.created_at,
      }));

      return mappedData;
    },
    enabled: !!user,
  });
};

export const useCreateImportRecord = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (importData: Omit<ImportHistory, 'id' | 'createdAt'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('import_history')
        .insert({
          user_id: user.id,
          file_name: importData.fileName,
          total_rows: importData.totalRows,
          valid_rows: importData.validRows,
          error_rows: importData.errorRows,
          skipped_rows: importData.skippedRows,
          status: importData.status,
          error_message: importData.errorMessage,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating import record:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-history'] });
    },
  });
};
