import { createContext, useContext } from "react";
import type { User } from "@/types/User";

export type UserContextType = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}