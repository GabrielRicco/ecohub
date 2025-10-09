import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";
import { format } from "date-fns";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
};

const STATUS_LABELS = {
  pending: "Pendente",
  completed: "Concluído",
  cancelled: "Cancelado"
};


type Redemption = {
  id: number;
  user_id: number;
  reward_description: string;
  points_used: number;
  redemption_code: string;
  created_date: string;
  status: 'pending' | 'completed' | 'cancelled';
};

type User = {
  id: number;
  full_name: string;
  email: string;
};

export default function Redemptions() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState<'pending' | 'completed' | 'all'>("pending");

  // MOCK DATA
  useEffect(() => {
    // Usuários mockados
    const mockUsers: User[] = [
      { id: 1, full_name: "João Silva", email: "joao@email.com" },
      { id: 2, full_name: "Maria Souza", email: "maria@email.com" },
      { id: 3, full_name: "Carlos Lima", email: "carlos@email.com" }
    ];
    const userMap: Record<number, User> = {};
    mockUsers.forEach(u => { userMap[u.id] = u; });
    setUsers(userMap);

    // Resgates mockados
    const mockRedemptions: Redemption[] = [
      {
        id: 101,
        user_id: 1,
        reward_description: "Desconto 10% na loja",
        points_used: 100,
        redemption_code: "ABC123",
        created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: 102,
        user_id: 2,
        reward_description: "Brinde sustentável",
        points_used: 200,
        redemption_code: "XYZ789",
        created_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      },
      {
        id: 103,
        user_id: 3,
        reward_description: "Café grátis",
        points_used: 50,
        redemption_code: "QWE456",
        created_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      }
    ];
    setRedemptions(mockRedemptions);
    setLoading(false);
  }, []);

  const handleUpdateStatus = (redemption: Redemption, newStatus: Redemption['status']) => {
    setUpdating(redemption.id);
    setTimeout(() => {
      setRedemptions(prev => prev.map(r =>
        r.id === redemption.id ? { ...r, status: newStatus } : r
      ));
      setUpdating(null);
    }, 800);
  };

  const filteredRedemptions = redemptions.filter(r => filter === "all" || r.status === filter);

  const stats = {
    pending: redemptions.filter(r => r.status === 'pending').length,
    completed: redemptions.filter(r => r.status === 'completed').length,
    totalPoints: redemptions.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.points_used, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resgates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Resgates
          </h1>
          <p className="text-gray-600">
            Visualize e confirme os resgates de pontos dos clientes em seu estabelecimento.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resgates Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resgates Concluídos</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <p className="text-xs text-muted-foreground">Total de resgates confirmados</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Pontos</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPoints}</div>
                    <p className="text-xs text-muted-foreground">Pontos resgatados no seu negócio</p>
                </CardContent>
            </Card>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pendentes</Button>
          <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>Concluídos</Button>
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Todos</Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {filteredRedemptions.length > 0 ? filteredRedemptions.map(redemption => {
                const user = users[redemption.user_id];
                return (
                  <div key={redemption.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={STATUS_COLORS[redemption.status]}>{STATUS_LABELS[redemption.status]}</Badge>
                          <Badge variant="outline">{redemption.reward_description}</Badge>
                        </div>
                        <p className="font-semibold text-gray-800">{user?.full_name || 'Usuário desconhecido'}</p>
                        <p className="text-sm text-gray-500">Email: {user?.email}</p>
                        <p className="text-sm text-gray-500">Código: <span className="font-mono bg-gray-100 px-1 rounded">{redemption.redemption_code}</span></p>
                        <p className="text-sm text-gray-500">Data: {format(new Date(redemption.created_date), "dd/MM/yyyy HH:mm")}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                         <div className="text-right">
                            <p className="text-xl font-bold text-green-600">-{redemption.points_used}</p>
                            <p className="text-sm text-muted-foreground">pontos</p>
                        </div>
                        {redemption.status === 'pending' && (
                          <Button
                            onClick={() => handleUpdateStatus(redemption, 'completed')}
                            disabled={updating === redemption.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">Nenhum resgate encontrado para este filtro.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}