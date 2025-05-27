
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  return useQuery({
    queryKey: ['import-history'],
    queryFn: async () => {
      // For now, return mock data since we don't have an import_history table yet
      // This will be replaced when we create the actual table
      const mockHistory: ImportHistory[] = [
        {
          id: '1',
          fileName: 'leads-q4-2023.xlsx',
          totalRows: 238,
          validRows: 235,
          errorRows: 3,
          skippedRows: 0,
          status: 'completed',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          fileName: 'conference-leads.xlsx',
          totalRows: 156,
          validRows: 148,
          errorRows: 5,
          skippedRows: 3,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      return mockHistory;
    },
  });
};

export const useCreateImportRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (importData: Omit<ImportHistory, 'id' | 'createdAt'>) => {
      // For now, just log the import - we'll implement actual storage later
      console.log('Import record created:', importData);
      return { id: Date.now().toString(), ...importData, createdAt: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-history'] });
    },
  });
};
