import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Calendar, 
  Clock,
  CheckCircle,
  X,
  Edit
} from "lucide-react";
import { format } from "date-fns";

const STATUS_COLORS = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
};

const STATUS_LABELS = {
  open: "Aberto",
  in_progress: "Em Andamento", 
  completed: "Concluído",
  cancelled: "Cancelado"
};


type MaterialRequestType = {
  id: number;
  material_type: string;
  quantity_needed: number;
  purpose: string;
  contact_info: string;
  deadline?: string;
  created_date: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
};

export default function MyRequests() {
  const [requests, setRequests] = useState<MaterialRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    // Mock: Pedidos do usuário
    const mockRequests: MaterialRequestType[] = [
      {
        id: 1,
        material_type: "plastic",
        quantity_needed: 10,
        purpose: "Fazer vasos reciclados para feira",
        contact_info: "meuemail@email.com",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "open"
      },
      {
        id: 2,
        material_type: "glass",
        quantity_needed: 5,
        purpose: "Criar luminárias artesanais",
        contact_info: "meuemail@email.com",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "in_progress"
      },
      {
        id: 3,
        material_type: "cardboard",
        quantity_needed: 20,
        purpose: "Montar embalagens personalizadas",
        contact_info: "meuemail@email.com",
        deadline: undefined,
        created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      }
    ];
    setRequests(mockRequests);
    setLoading(false);
  }, []);

  const updateRequestStatus = (requestId: number, newStatus: MaterialRequestType['status']) => {
    setUpdating(requestId);
    setTimeout(() => {
      setRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      setUpdating(null);
    }, 800);
  };

  const getRequestStats = () => {
    const stats = {
      total: requests.length,
      open: requests.filter(r => r.status === 'open').length,
      in_progress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  const stats = getRequestStats();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Meus Pedidos de Material
          </h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos de materiais recicláveis
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total de Pedidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              <p className="text-sm text-gray-600">Abertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
              <p className="text-sm text-gray-600">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum pedido ainda
                </h3>
                <p className="text-gray-600 mb-4">
                  Você ainda não fez nenhum pedido de material
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Fazer Primeiro Pedido
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="p-6 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={STATUS_COLORS[request.status]}>
                            {STATUS_LABELS[request.status]}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {request.material_type}
                          </Badge>
                          <Badge variant="outline">
                            {request.quantity_needed} unidades
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          {request.purpose}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Criado em {format(new Date(request.created_date), "dd/MM/yyyy")}
                          </span>
                          {request.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Prazo: {format(new Date(request.deadline), "dd/MM/yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {request.status === 'open' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'in_progress')}
                              disabled={updating === request.id}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Marcar em Andamento
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'cancelled')}
                              disabled={updating === request.id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        
                        {request.status === 'in_progress' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'completed')}
                              disabled={updating === request.id}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Marcar como Concluído
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'cancelled')}
                              disabled={updating === request.id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {request.contact_info && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Contato:</strong> {request.contact_info}
                        </p>
                      </div>
                    )}

                    {updating === request.id && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
                        Atualizando status...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dicas para Gerenciar seus Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Mantenha seus pedidos atualizados para ajudar a comunidade
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Seja específico sobre como vai usar os materiais
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Defina prazos realistas para facilitar o atendimento
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Cancele pedidos que não precisar mais
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}