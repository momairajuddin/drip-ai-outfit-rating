import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { LeaderboardEntry, AppStats, GetLeaderboardParams } from "@workspace/api-client-react";

export function useLeaderboard(params: GetLeaderboardParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.period) searchParams.append('period', params.period);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  
  const qs = searchParams.toString();
  const url = `/api/leaderboard${qs ? `?${qs}` : ''}`;

  return useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard', params],
    queryFn: () => fetchApi<LeaderboardEntry[]>(url),
  });
}

export function useAppStats() {
  return useQuery<AppStats>({
    queryKey: ['/api/stats'],
    queryFn: () => fetchApi<AppStats>('/api/stats'),
  });
}
