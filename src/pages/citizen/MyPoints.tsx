import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  TrendingUp, 
  Calendar, 
  Recycle,
  Trophy,
  Target,
  Star,
  Gift
} from "lucide-react";
import { format } from "date-fns";
import type { User } from "@/types/User";
import { useUser } from "@/context/user-context-helpers";
import { MATERIAL_COLORS } from "../CollectionMap";

const POINT_VALUES = {
  plástico: 10,
  vidro: 15,
  metal: 20,
  orgânico: 5,
  eletrônicos: 25,
  têxteis: 12
};

type Deposit = {
  id: number;
  material_type: keyof typeof MATERIAL_COLORS;
  created_date: string;
  points_earned: number;
  quantity: number;
};

export default function MyPoints() {
  const { currentUser } = useUser();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPoints: 0,
    thisMonth: 0,
    totalDeposits: 0,
    favoriteType: "" as keyof typeof MATERIAL_COLORS | ""
  });

  const calculateStats = (deposits: Deposit[], user: User) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthDeposits = deposits.filter((deposit) => {
      const depositDate = new Date(deposit.created_date);
      return depositDate.getMonth() === currentMonth &&
        depositDate.getFullYear() === currentYear;
    });

    const materialCounts: Record<keyof typeof MATERIAL_COLORS, number> = {
      plástico: 0,
      vidro: 0,
      metal: 0,
      orgânico: 0,
      eletrônicos: 0,
      têxteis: 0
    };
    deposits.forEach((deposit) => {
      materialCounts[deposit.material_type] = (materialCounts[deposit.material_type] || 0) + 1;
    });

    let maxCount = 0;
    let favoriteType: keyof typeof MATERIAL_COLORS | "" = "";
    (Object.keys(materialCounts) as (keyof typeof MATERIAL_COLORS)[]).forEach((type) => {
      if (materialCounts[type] > maxCount) {
        favoriteType = type;
        maxCount = materialCounts[type];
      }
    });

    setStats({
      totalPoints: user.total_points_earned || 0,
      thisMonth: thisMonthDeposits.reduce((sum, deposit) => sum + (deposit.points_earned || 0), 0),
      totalDeposits: deposits.length,
      favoriteType
    });
  };

  const loadData = useCallback(async () => {
    try {
      // MOCK: depósitos do usuário
      const userDeposits: Deposit[] = [
        {
          id: 1,
          material_type: "plástico",
          created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 10,
          quantity: 2
        },
        {
          id: 2,
          material_type: "vidro",
          created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 15,
          quantity: 1
        },
        {
          id: 3,
          material_type: "metal",
          created_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 20,
          quantity: 3
        },
        {
          id: 4,
          material_type: "plástico",
          created_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 10,
          quantity: 1
        },
        {
          id: 5,
          material_type: "vidro",
          created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 15,
          quantity: 2
        }
      ];
      setDeposits(userDeposits);
      if (currentUser) calculateStats(userDeposits, currentUser);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]); 

  const getNextMilestone = () => {
    const milestones = [100, 250, 500, 1000, 2500, 5000, 10000];
    const currentPoints = currentUser?.total_points_earned || 0;
    
    const nextMilestone = milestones.find(milestone => milestone > currentPoints);
    const pointsToNext = nextMilestone ? nextMilestone - currentPoints : 0;
    
    return { nextMilestone, pointsToNext };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando seus pontos...</p>
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
            <p className="text-gray-600">Faça login para ver seus pontos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { nextMilestone, pointsToNext } = getNextMilestone();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Meus Pontos EcoHub
          </h1>
          <p className="text-gray-600">
            Acompanhe seu progresso e impacto ambiental
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Pontos Disponíveis</p>
                  <p className="text-3xl font-bold">{currentUser.points_balance || 0}</p>
                </div>
                <Award className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Ganho</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalPoints}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Depósitos</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalDeposits}</p>
                </div>
                <Recycle className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="w-5 h-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deposits.length === 0 ? (
                  <div className="text-center py-8">
                    <Recycle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum depósito ainda
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comece a descartar seus resíduos e ganha pontos!
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Encontrar Pontos de Coleta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {deposits.map((deposit) => (
                      <div key={deposit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Recycle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {deposit.material_type}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(deposit.created_date), "dd/MM/yyyy 'às' HH:mm")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{deposit.points_earned || POINT_VALUES[deposit.material_type] || 10} pts
                          </p>
                          <p className="text-sm text-gray-600">
                            {deposit.quantity} {deposit.quantity === 1 ? 'unidade' : 'unidades'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress & Achievements */}
          <div className="space-y-6">
            {/* Next Milestone */}
            {nextMilestone && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Próxima Meta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {nextMilestone} Pontos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Faltam apenas {pointsToNext} pontos!
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${((stats.totalPoints / nextMilestone) * 100).toFixed(2)}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Favorite Material */}
            {stats.favoriteType && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Material Favorito
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge 
                      className={`${MATERIAL_COLORS[stats.favoriteType as keyof typeof MATERIAL_COLORS] || ''} text-lg px-4 py-2 mb-3`}
                    >
                      {stats.favoriteType}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Você mais recicla este tipo de material
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Seu Impacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Materiais reciclados</span>
                    <span className="font-semibold">{stats.totalDeposits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CO² economizado</span>
                    <span className="font-semibold text-green-600">~{(stats.totalDeposits * 0.5).toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ranking mensal</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Top 10%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}