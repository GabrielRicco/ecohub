import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, Users, Star } from "lucide-react";

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

type Redemption = {
  id: number;
  user_id: number;
  reward_description: string;
  points_used: number;
  redemption_code: string;
  created_date: string;
  status: 'pending' | 'completed' | 'cancelled';
};

type Stats = {
  totalRedemptions: number;
  totalPoints: number;
  uniqueCustomers: number;
  redemptionsByTime: { name: string; resgates: number }[];
  redemptionsByReward: { name: string; value: number }[];
};

export default function BusinessStats() {
  const [stats, setStats] = useState<Stats>({
    totalRedemptions: 0,
    totalPoints: 0,
    uniqueCustomers: 0,
    redemptionsByTime: [],
    redemptionsByReward: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK: resgates concluídos
    const mockRedemptions: Redemption[] = [
      {
        id: 1,
        user_id: 1,
        reward_description: "Desconto 10% na loja",
        points_used: 100,
        redemption_code: "ABC123",
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      },
      {
        id: 2,
        user_id: 2,
        reward_description: "Brinde sustentável",
        points_used: 200,
        redemption_code: "XYZ789",
        created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      },
      {
        id: 3,
        user_id: 1,
        reward_description: "Desconto 10% na loja",
        points_used: 100,
        redemption_code: "DEF456",
        created_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      },
      {
        id: 4,
        user_id: 3,
        reward_description: "Café grátis",
        points_used: 50,
        redemption_code: "QWE456",
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      }
    ];

    const totalRedemptions = mockRedemptions.length;
    const totalPoints = mockRedemptions.reduce((sum, r) => sum + r.points_used, 0);
    const uniqueCustomers = new Set(mockRedemptions.map(r => r.user_id)).size;

    // Agrupar por recompensa
    const byReward = mockRedemptions.reduce((acc: Record<string, number>, r) => {
      acc[r.reward_description] = (acc[r.reward_description] || 0) + 1;
      return acc;
    }, {});
    const redemptionsByReward = Object.entries(byReward)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Agrupar por mês
    const byTime = mockRedemptions.reduce((acc: Record<string, number>, r) => {
      const month = new Date(r.created_date).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const redemptionsByTime = Object.entries(byTime)
      .map(([name, value]) => ({ name, resgates: value }))
      .reverse();

    setStats({
      totalRedemptions,
      totalPoints,
      uniqueCustomers,
      redemptionsByTime,
      redemptionsByReward,
    });
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Estatísticas do Negócio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analise o impacto da sua participação no EcoHub.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Resgates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRedemptions}</div>
              <p className="text-xs text-muted-foreground">Recompensas entregues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Engajados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
              <p className="text-xs text-muted-foreground">Clientes únicos que resgataram</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recompensa Mais Popular</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{stats.redemptionsByReward[0]?.name || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Com {stats.redemptionsByReward[0]?.value || 0} resgates</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resgates ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.redemptionsByTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="resgates" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Recompensas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.redemptionsByReward}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  >
                    {stats.redemptionsByReward.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}