import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Функция для инициализации начального состояния
const initializeAuth = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Инициализируем состояние с помощью функции
  const [isAuthenticated, setIsAuthenticated] = useState(initializeAuth);

  useEffect(() => {
    // Дополнительно можно обновить состояние при изменении localStorage в других вкладках
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("token") ? true : false);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
