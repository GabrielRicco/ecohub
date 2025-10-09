import { useNavigate } from "react-router-dom";
import type { User } from "@/types/User";
import { useUser } from "@/context/user-context-helpers";

const mockUsers: User[] = [
  {
    id: 1,
    full_name: "Gabriel Ricco",
    user_type: "citizen",
    points_balance: 120,
    total_points_earned: 450,
    municipality: "Pipa, RN",
    business_name: "",
    phone: "(84) 99999-9999",
    specialties: [],
    address: "Rua das Flores, 123, Pipa, RN",
    email: "gabriel@example.com"
  },
  {
    id: 2,
    full_name: "Maria Coletora",
    user_type: "waste_picker",
    points_balance: 200,
    total_points_earned: 800,
    municipality: "Pipa, RN",
    business_name: "",
    phone: "(84) 98888-8888",
    specialties: ["Plástico", "Vidro"],
    address: "Rua do Sol, 456, Pipa, RN",
    email: "maria@example.com"
  },
  {
    id: 3,
    full_name: "João Artesão",
    user_type: "artisan",
    points_balance: 90,
    total_points_earned: 300,
    municipality: "Pipa, RN",
    business_name: "",
    phone: "(84) 97777-7777",
    specialties: ["Vidro", "Plástico"],
    address: "Rua das Artes, 789, Pipa, RN",
    email: "joao@example.com",
  },
  {
    id: 4,
    full_name: "Empresa Verde",
    user_type: "business",
    points_balance: 500,
    total_points_earned: 2000,
    municipality: "Pipa, RN",
    business_name: "Empresa Verde Ltda.",
    phone: "(84) 96666-6666",
    specialties: ["Restaurante"],
    address: "Av. Central, 1000, Pipa, RN",
    email: "empresa@example.com",
  },
  {
    id: 5,
    full_name: "Prefeitura Local",
    user_type: "municipal",
    points_balance: 0,
    total_points_earned: 0,
    municipality: "Pipa, RN",
    business_name: "Prefeitura de Pipa",
    phone: "(84) 95555-5555",
    specialties: [],
    address: "Praça Central, 1, Pipa, RN",
    email: "prefeitura@example.com",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = (user: User) => {
    login(user);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Escolha um Usuário</h1>
        <div className="space-y-4">
          {mockUsers.map((user) => (
            <button
              key={user.user_type}
              onClick={() => handleLogin(user)}
              className="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-green-50 transition"
            >
              <span className="font-medium">{user.full_name}</span>
              <span className="text-xs text-gray-500 capitalize">{user.user_type.replace("_", " ")}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
