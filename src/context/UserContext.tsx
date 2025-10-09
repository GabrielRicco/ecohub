import { useState, type ReactNode } from "react";
import { UserContext } from "./user-context-helpers";
import type { UserContextType } from "./user-context-helpers";
import type { User } from "@/types/User";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);
  const value: UserContextType = { currentUser, login, logout };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
