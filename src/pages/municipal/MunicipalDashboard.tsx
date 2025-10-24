import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Recycle, MapPin, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type User = {
  id: number;
  full_name: string;
  user_type: string;
};

type Deposit = {
  id: number;
  material_type: string;
  quantity: number;
};

type CollectionPoint = {
  id: number;
  name: string;
  address: string;
  status: string;
  capacity_level: number;
};

type Stats = {
  totalUsers: number;
  totalDeposits: number;
  totalWeight: number;
  depositsByMaterial: { name: string; quantidade: number }[];
  usersByType: { name: string; value: number }[];
  pointsNeedingAttention: CollectionPoint[];
};

export default function MunicipalDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWeight: 0,
    depositsByMaterial: [],
    usersByType: [],
    pointsNeedingAttention: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK: Usuários
    const mockUsers: User[] = [
      { id: 1, full_name: "João Silva", user_type: "coletor" },
      { id: 2, full_name: "Maria Souza", user_type: "artesão" },
      { id: 3, full_name: "Carlos Lima", user_type: "empresa" },
      { id: 4, full_name: "Ana Paula", user_type: "coletor" },
      { id: 5, full_name: "Lucas Rocha", user_type: "artesão" }
    ];

    // MOCK: Depósitos
    const mockDeposits: Deposit[] = [
      { id: 101, material_type: "plástico", quantity: 12.5 },
      { id: 102, material_type: "vidro", quantity: 8.2 },
      { id: 103, material_type: "eletrônicos", quantity: 15.7 },
      { id: 104, material_type: "metal", quantity: 4.1 },
      { id: 105, material_type: "plástico", quantity: 7.3 },
      { id: 106, material_type: "vidro", quantity: 5.6 }
    ];

    // MOCK: Pontos de coleta
    const mockPoints: CollectionPoint[] = [
      { id: 1, name: "Eco Ponto Central", address: "Av. Central, 1000", status: "full", capacity_level: 95 },
      { id: 2, name: "Mercado Verde", address: "Rua das Flores, 123", status: "active", capacity_level: 60 },
      { id: 3, name: "Praça do Sol", address: "Praça do Sol", status: "maintenance", capacity_level: 100 },
      { id: 4, name: "Ponto Leste", address: "Rua Leste, 45", status: "active", capacity_level: 40 }
    ];

    const totalUsers = mockUsers.length;
    const totalDeposits = mockDeposits.length;
    const totalWeight = mockDeposits.reduce((sum, d) => sum + d.quantity, 0);

    // Agrupar usuários por tipo
    const byUserType = mockUsers.reduce((acc: Record<string, number>, u) => {
      const type = u.user_type || 'undefined';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const usersByType = Object.entries(byUserType).map(([name, value]) => ({ name, value }));

    // Agrupar depósitos por material
    const byMaterial = mockDeposits.reduce((acc: Record<string, number>, d) => {
      acc[d.material_type] = (acc[d.material_type] || 0) + d.quantity;
      return acc;
    }, {});
    const depositsByMaterial = Object.entries(byMaterial).map(([name, value]) => ({ name, quantidade: value }));

    const pointsNeedingAttention = mockPoints.filter(p => p.status === 'full' || p.status === 'maintenance' || p.capacity_level > 90);

    setStats({
      totalUsers,
      totalDeposits,
      totalWeight,
      depositsByMaterial,
      usersByType,
      pointsNeedingAttention
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando painel municipal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Painel de Gestão Municipal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral do ecossistema EcoHub em sua cidade.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Depósitos Totais</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeposits}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Total (kg)</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWeight.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos de Coleta</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pointsNeedingAttention.length}</div>
              <p className="text-xs text-muted-foreground">precisando de atenção</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Materiais Coletados (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.depositsByMaterial}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.usersByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Usuários" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Pontos de Coleta que Exigem Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {stats.pointsNeedingAttention.length > 0 ? stats.pointsNeedingAttention.map(point => (
                        <div key={point.id} className="p-3 border rounded-lg flex justify-between items-center dark:border-gray-700">
                            <div>
                                <p className="font-semibold">{point.name}</p>
                                <p className="text-sm text-gray-500">{point.address}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={point.status === 'full' ? "destructive" : "secondary"}>{
                             point.status === 'maintenance' ? 'Manutenção' : 'Inativo'}</Badge>
                                <Badge variant="outline">Capacidade: {point.capacity_level}%</Badge>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-4">Nenhum ponto de coleta precisa de atenção no momento.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}