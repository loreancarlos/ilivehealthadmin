import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Professional, Clinic, User } from "../types";
import { useLocation } from "wouter";
import { apiRequest } from "../lib/queryClient";

interface AuthResponse {
  user: User;
  professional: Professional | null;
  clinic: Clinic | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check auth
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest<AuthResponse>("/auth/login");
        if (response) {
          const userData = {
            ...response.user,
            professional: response.professional,
            clinic: response.clinic,
          };
          setUser(userData);
        }
      } catch (err) {
        // Not authenticated, that's ok
        console.log(err);
        console.log("User not authenticated yet");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function that calls the API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const userData = {
          ...response.user,
          professional: response.professional,
          clinic: response.clinic,
        };

        setUser(userData);
        setLocation("/dashboard");
      } else {
        throw new Error("Falha ao fazer login");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message+" LALA");
      } else {
        setError("Credenciais inválidas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setLocation("/login");
    // Add API call to logout if needed
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
