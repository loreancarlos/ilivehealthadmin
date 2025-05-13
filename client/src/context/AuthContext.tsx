import { createContext, useState, useContext, ReactNode } from "react";
import { Professional, Clinic, User } from "@/types";
import { useLocation } from "wouter";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample validation
      if (email === "admin@ilivehealth.com" && password === "password") {
        // Mock admin user
        const mockProfessional: Professional = {
          id: "1",
          name: "Dra. Ana Silva",
          specialty: "Dermatologista",
          email: "ana.silva@ilivehealth.com",
          profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
        };
        
        const mockClinic: Clinic = {
          id: "1",
          name: "Clínica Bem Estar",
          address: {
            street: "Av. Paulista",
            number: "1000",
            city: "São Paulo",
            state: "SP",
            zipCode: "01310-100"
          }
        };
        
        setUser({
          id: "1",
          name: "Dra. Ana Silva",
          email: email,
          role: "professional",
          professional: mockProfessional,
          clinic: mockClinic
        });
        
        setLocation("/dashboard");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setLocation("/login");
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
