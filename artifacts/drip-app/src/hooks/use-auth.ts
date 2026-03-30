import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { UserProfile, RegisterBody, LoginBody, AuthResponse } from "@workspace/api-client-react";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['/api/auth/me'],
    queryFn: () => fetchApi<UserProfile>('/api/auth/me'),
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginBody) => fetchApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      localStorage.setItem('drip_token', data.token);
      queryClient.setQueryData(['/api/auth/me'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterBody) => fetchApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      localStorage.setItem('drip_token', data.token);
      queryClient.setQueryData(['/api/auth/me'], data.user);
    },
  });

  const logout = () => {
    localStorage.removeItem('drip_token');
    queryClient.setQueryData(['/api/auth/me'], null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
