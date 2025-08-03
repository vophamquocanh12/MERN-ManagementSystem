  import { useEffect, useState } from "react";
  import api from "@/services/api";
  import { AuthContext } from "./AuthContextStore";

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        api
          .get("/auth/me")
          .then((res) => setUser(res.data.user)) // cần res.data.user
          .catch((err) => {
            console.error(
              "Auth check failed:",
              err?.response?.data || err.message
            );
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            setUser(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const login = (userData, token) => {
      // localStorage.setItem("token", token);
      // api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // setUser(userData);

        if (token) {
          localStorage.setItem("token", token);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        setUser(userData || null);
    };

    const logout = () => {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    };

    return (
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
