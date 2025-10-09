import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Gift, 
  Award, 
  Coffee, 
  Utensils, 
  ShoppingBag,
  Ticket,
  Star,
  Search,
  Check,
  Clock
} from "lucide-react";

import { useUser } from "@/context/user-context-helpers";
// Mock rewards data - in a real app this would come from a database
const AVAILABLE_REWARDS = [
  {
    id: "1",
    title: "Café Grátis",
    description: "Um café expresso em qualquer cafeteria parceira",
    points_cost: 50,
    category: "food",
    icon: Coffee,
    business_name: "Café do Pipa",
    validity_days: 30,
    available: true,
    color: "bg-amber-500"
  },
  {
    id: "2", 
    title: "Desconto 10% Restaurante",
    description: "10% de desconto em restaurantes locais parceiros",
    points_cost: 100,
    category: "food",
    icon: Utensils,
    business_name: "Restaurantes Parceiros",
    validity_days: 15,
    available: true,
    color: "bg-orange-500"
  },
  {
    id: "3",
    title: "Eco Bag Exclusiva",
    description: "Bolsa reutilizável oficial do EcoHub",
    points_cost: 200,
    category: "product",
    icon: ShoppingBag,
    business_name: "EcoHub Store",
    validity_days: 60,
    available: true,
    color: "bg-green-500"
  },
  {
    id: "4",
    title: "Ingresso Passeio Ecológico",
    description: "Tour guiado pelas belezas naturais de Pipa",
    points_cost: 300,
    category: "experience",
    icon: Ticket,
    business_name: "Pipa EcoTours",
    validity_days: 90,
    available: true,
    color: "bg-blue-500"
  },
  {
    id: "5",
    title: "Desconto 20% Hospedagem",
    description: "20% off em pousadas e hotéis participantes",
    points_cost: 500,
    category: "travel",
    icon: Star,
    business_name: "Rede Hospedagem Pipa",
    validity_days: 45,
    available: false,
    color: "bg-purple-500"
  }
];

const CATEGORIES = [
  { id: "", label: "Todas", icon: Gift },
  { id: "food", label: "Alimentação", icon: Coffee },
  { id: "product", label: "Produtos", icon: ShoppingBag },
  { id: "experience", label: "Experiências", icon: Ticket },
  { id: "travel", label: "Hospedagem", icon: Star }
];

type Redemption = {
  id: number;
  reward_description: string;
  redemption_code: string;
  points_used: number;
  status: "completed" | "pending";
};

export default function Rewards() {
  const { currentUser, login } = useUser()
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      // MOCK: Redemptions
      const mockRedemptions: Redemption[] = [
        {
          id: 1,
          reward_description: "Café Grátis",
          redemption_code: "ECO-123456",
          points_used: 50,
          status: "completed"
        },
        {
          id: 2,
          reward_description: "Eco Bag Exclusiva",
          redemption_code: "ECO-654321",
          points_used: 200,
          status: "pending"
        }
      ];
      setRedemptions(mockRedemptions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Simula resgate local
  const handleRedeem = (reward: typeof AVAILABLE_REWARDS[number]) => {
    if (!currentUser || currentUser.points_balance < reward.points_cost) return;
    setRedeeming(reward.id);
    setTimeout(() => {
      // Atualiza pontos do usuário
      login({
        ...currentUser,
        points_balance: currentUser.points_balance - reward.points_cost,
      });
      // Adiciona novo resgate
      setRedemptions((prev) => [
        {
          id: Date.now(),
          reward_description: reward.title,
          redemption_code: `ECO-${Date.now().toString().slice(-6)}`,
          points_used: reward.points_cost,
          status: "pending"
        },
        ...prev
      ]);
      setRedeeming(null);
    }, 1200);
  };

  const filteredRewards = AVAILABLE_REWARDS.filter(reward => {
    const matchesCategory = !selectedCategory || reward.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando recompensas...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-gray-600">Faça login para ver as recompensas</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Recompensas EcoHub
          </h1>
          <p className="text-gray-600">
            Troque seus pontos por recompensas incríveis com empresas parceiras
          </p>
        </div>

        {/* User Points Banner */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Seus Pontos Disponíveis</h2>
                <p className="text-3xl font-bold">{currentUser.points_balance || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100">Total ganho</p>
                <p className="text-xl font-semibold">{currentUser.total_points_earned || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar recompensas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-sm"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Rewards Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRewards.map((reward) => {
                const Icon = reward.icon;
                const canAfford = currentUser.points_balance >= reward.points_cost;
                const isRedeeming = redeeming === reward.id;
                
                return (
                  <Card 
                    key={reward.id}
                    className={`transition-all duration-200 hover:shadow-lg ${
                      !reward.available ? 'opacity-60' : 
                      !canAfford ? 'opacity-75' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${reward.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge 
                          variant={reward.available ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {reward.available ? "Disponível" : "Esgotado"}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {reward.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {reward.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {reward.business_name}
                        </Badge>
                        <Badge variant="outline">
                          {reward.validity_days} dias
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-lg">
                            {reward.points_cost} pts
                          </span>
                        </div>
                        
                        <Button
                          onClick={() => handleRedeem(reward)}
                          disabled={!canAfford || !reward.available || isRedeeming}
                          className={`${
                            canAfford && reward.available 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gray-300'
                          }`}
                        >
                          {isRedeeming ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : !reward.available ? (
                            "Esgotado"
                          ) : !canAfford ? (
                            "Pontos insuficientes"
                          ) : (
                            "Resgatar"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Redemptions */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Resgates Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {redemptions.length === 0 ? (
                  <div className="text-center py-6">
                    <Gift className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      Você ainda não resgatou nenhuma recompensa
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {redemptions.map((redemption) => (
                      <div key={redemption.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {redemption.reward_description}
                            </p>
                            <p className="text-xs text-gray-600">
                              Código: {redemption.redemption_code}
                            </p>
                          </div>
                          <Badge 
                            variant={redemption.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {redemption.status === 'completed' ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Usado
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pendente
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          -{redemption.points_used} pontos
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}