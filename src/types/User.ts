// Tipos globais de usuário para EcoHub
export type UserType =
  | "citizen"
  | "waste_picker"
  | "artisan"
  | "business"
  | "municipal";

export interface User {
  id?: number;
  full_name: string;
  user_type: UserType;
  points_balance: number;
  total_points_earned: number;
  municipality: string;
  business_name: string;
  phone: string;
  specialties: string[];
  address: string;
  email: string;
}
