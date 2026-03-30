import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { ScanResult, ScanHistoryResponse, GetScanHistoryParams } from "@workspace/api-client-react";

export function useCreateScan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, isDemo }: { file: File, isDemo?: boolean }) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const headers: HeadersInit = {};
      if (isDemo) {
        headers['x-demo-mode'] = 'true';
      }

      return fetchApi<ScanResult>('/api/scan', {
        method: 'POST',
        body: formData,
        headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scan/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/style-dna'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useScanHistory(params: GetScanHistoryParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.sort) searchParams.append('sort', params.sort);
  
  const qs = searchParams.toString();
  const url = `/api/scan/history${qs ? `?${qs}` : ''}`;

  return useQuery<ScanHistoryResponse>({
    queryKey: ['/api/scan/history', params],
    queryFn: () => fetchApi<ScanHistoryResponse>(url),
  });
}

export function useScanById(id: number | null) {
  return useQuery<ScanResult>({
    queryKey: ['/api/scan', id],
    queryFn: () => fetchApi<ScanResult>(`/api/scan/${id}`),
    enabled: !!id,
  });
}
