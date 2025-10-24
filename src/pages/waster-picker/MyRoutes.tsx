import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Route,
  Clock,
  Fuel,
  Target,
  CheckCircle,
} from "lucide-react";


type Deposit = {
  id: number;
  material_type: string;
  created_date: string;
  quantity: number;
  collection_point_id: number;
  notes?: string;
  verified: boolean;
};

type CollectionPoint = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity_level: number;
};

type RouteStop = {
  point: CollectionPoint;
  deposits: Deposit[];
  totalItems: number;
  materialTypes: string[];
};

export default function MyRoutes() {
  const [loading, setLoading] = useState(true);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteStop[]>([]);

  const generateOptimizedRoute = (deposits: Deposit[], points: CollectionPoint[]) => {
    // Group deposits by collection point

    const depositsByPoint: Record<number, Deposit[]> = {};
    deposits.forEach(deposit => {
      if (!depositsByPoint[deposit.collection_point_id]) {
        depositsByPoint[deposit.collection_point_id] = [];
      }
      depositsByPoint[deposit.collection_point_id].push(deposit);
    });

    // Create route with collection points that have deposits
    const routePoints: RouteStop[] = Object.keys(depositsByPoint).map(pointIdStr => {
      const pointId = Number(pointIdStr);
      const point = points.find(p => p.id === pointId)!;
      const pointDeposits = depositsByPoint[pointId];
      return {
        point,
        deposits: pointDeposits,
        totalItems: pointDeposits.reduce((sum, d) => sum + d.quantity, 0),
        materialTypes: [...new Set(pointDeposits.map(d => d.material_type))]
      };
    }).filter(route => !!route.point);

    // Simple optimization: sort by capacity level and distance (mock)
    const optimized = routePoints.sort((a, b) => {
      // Prioritize points with higher capacity levels (more urgent)
      const capacityDiff = (b.point.capacity_level || 0) - (a.point.capacity_level || 0);
      if (capacityDiff !== 0) return capacityDiff;
      // Then by number of items
      return b.totalItems - a.totalItems;
    });
    setOptimizedRoute(optimized);
  };

  const loadData = useCallback(() => {
    // MOCK: pontos de coleta
    const mockPoints = [
      {
        id: 1,
        name: "Eco Ponto Central",
        address: "Av. Central, 1000, Pipa, RN",
        latitude: -6.235,
        longitude: -35.045,
        capacity_level: 90
      },
      {
        id: 2,
        name: "Mercado Verde",
        address: "Rua das Flores, 123, Pipa, RN",
        latitude: -6.237,
        longitude: -35.048,
        capacity_level: 60
      },
      {
        id: 3,
        name: "Praça do Sol",
        address: "Praça do Sol, Pipa, RN",
        latitude: -6.239,
        longitude: -35.050,
        capacity_level: 40
      }
    ];

    // MOCK: depósitos disponíveis
    const mockDeposits = [
      {
        id: 101,
        material_type: "plástico",
        created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        quantity: 3,
        collection_point_id: 1,
        notes: "Garrafas PET limpas",
        verified: false
      },
      {
        id: 102,
        material_type: "vidro",
        created_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        quantity: 2,
        collection_point_id: 2,
        notes: "Vidros inteiros",
        verified: false
      },
      {
        id: 103,
        material_type: "eletrônicos",
        created_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        quantity: 5,
        collection_point_id: 3,
        notes: "Caixas desmontadas",
        verified: false
      },
      {
        id: 104,
        material_type: "metal",
        created_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        quantity: 1,
        collection_point_id: 1,
        notes: "Lata de alumínio",
        verified: false
      }
    ];

    generateOptimizedRoute(mockDeposits, mockPoints);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openRouteInMaps = () => {
    if (optimizedRoute.length === 0) return;
    const waypoints = optimizedRoute.map(route => 
      `${route.point.latitude},${route.point.longitude}`
    ).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const openPointInMaps = (point: CollectionPoint) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
    window.open(url, '_blank');
  };

  const calculateRouteStats = () => {
    const totalPoints = optimizedRoute.length;
    const totalItems = optimizedRoute.reduce((sum, route) => sum + route.totalItems, 0);
    const estimatedTime = totalPoints * 15; // 15 minutes per point
    const estimatedDistance = totalPoints * 2.5; // 2.5 km between points average
    return { totalPoints, totalItems, estimatedTime, estimatedDistance };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Calculando rota otimizada...</p>
        </div>
      </div>
    );
  }

  const stats = calculateRouteStats();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Minhas Rotas Otimizadas
          </h1>
          <p className="text-gray-600">
            Rota inteligente para maximizar sua eficiência de coleta
          </p>
        </div>

        {optimizedRoute.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma rota disponível
              </h3>
              <p className="text-gray-600">
                Não há materiais para coleta no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Route Statistics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
                  <p className="text-sm text-gray-600">Pontos de Coleta</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                  <p className="text-sm text-gray-600">Itens para Coletar</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(stats.estimatedTime / 60)}h {stats.estimatedTime % 60}m</p>
                  <p className="text-sm text-gray-600">Tempo Estimado</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Fuel className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.estimatedDistance.toFixed(1)} km</p>
                  <p className="text-sm text-gray-600">Distância Total</p>
                </CardContent>
              </Card>
            </div>

            {/* Route Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Rota do Dia - {new Date().toLocaleDateString('pt-BR')}
                    </h3>
                    <p className="text-gray-600">
                      Rota otimizada baseada na urgência e localização dos pontos
                    </p>
                  </div>
                  <Button
                    onClick={openRouteInMaps}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Abrir Rota no Maps
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Route Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  Sequência da Rota
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {optimizedRoute.map((routeStop, index) => (
                  <div key={routeStop.point.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      {index < optimizedRoute.length - 1 && (
                        <div className="w-px h-16 bg-gray-300 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {routeStop.point.name}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {routeStop.point.address}
                          </p>
                        </div>
                        <Badge 
                          variant={routeStop.point.capacity_level > 80 ? "destructive" : "secondary"}
                        >
                          {routeStop.point.capacity_level}% cheio
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>{routeStop.totalItems}</strong> itens • 
                            <strong> {routeStop.materialTypes.length}</strong> tipos de material
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            {routeStop.materialTypes.map(material => (
                              <Badge key={material} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPointInMaps(routeStop.point)}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Navegar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Route Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas para Otimizar sua Coleta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-600">
                        Comece pelos pontos com maior capacidade (mais urgentes)
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-600">
                        Leve recipientes separados para cada tipo de material
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-600">
                        Confirme a coleta no app para atualizar o sistema
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-600">
                        Verifique os horários de funcionamento de cada ponto
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}