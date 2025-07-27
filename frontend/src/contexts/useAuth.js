import { useContext } from "react";
import { AuthContext } from "./AuthContextStore";

const useAuth = () => useContext(AuthContext);

export default useAuth;
