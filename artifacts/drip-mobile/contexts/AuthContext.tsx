import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AuthState {
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  isAuthenticated: false,
  setToken: async () => {},
  logout: async () => {},
});

const TOKEN_KEY = "drip_auth_token";

let _currentToken: string | null = null;

setAuthTokenGetter(() => _currentToken);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, isLoading: true });
  const queryClient = useQueryClient();

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (token) {
        _currentToken = token;
      }
      setState({ token, isLoading: false });
    });
  }, []);

  const setToken = useCallback(async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    _currentToken = token;
    setState({ token, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    _currentToken = null;
    setState({ token: null, isLoading: false });
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
