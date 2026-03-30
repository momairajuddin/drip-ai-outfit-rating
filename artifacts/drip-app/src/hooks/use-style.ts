import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { 
  StyleDnaResponse, 
  StyleReportResponse, 
  SimilarOutfit, 
  UpgradeRecommendation 
} from "@workspace/api-client-react";

export function useStyleDna() {
  return useQuery<StyleDnaResponse>({
    queryKey: ['/api/style-dna'],
    queryFn: () => fetchApi<StyleDnaResponse>('/api/style-dna'),
  });
}

export function useStyleReport() {
  return useQuery<StyleReportResponse>({
    queryKey: ['/api/style-dna/report'],
    queryFn: () => fetchApi<StyleReportResponse>('/api/style-dna/report'),
  });
}

export function useSimilarOutfits(scanId: number | null) {
  return useQuery<SimilarOutfit[]>({
    queryKey: ['/api/similar', scanId],
    queryFn: () => fetchApi<SimilarOutfit[]>(`/api/similar/${scanId}`),
    enabled: !!scanId,
  });
}

export function useRecommendations(scanId: number | null) {
  return useQuery<UpgradeRecommendation[]>({
    queryKey: ['/api/recommendations', scanId],
    queryFn: () => fetchApi<UpgradeRecommendation[]>(`/api/recommendations/${scanId}`),
    enabled: !!scanId,
  });
}
