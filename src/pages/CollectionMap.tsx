import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Recycle, 
  Search,
} from "lucide-react";

type CollectionPoint = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  accepted_materials: string[];
  status: 'active' | 'full' | 'maintenance' | 'inactive';
  capacity_level?: number;
  operating_hours?: string;
};

type UserLocation = {
  lat: number;
  lng: number;
};

export const MATERIAL_COLORS = {
  plástico: "bg-blue-100 text-blue-700",
  vidro: "bg-green-100 text-green-700", 
  metal: "bg-gray-100 text-gray-700",
  orgânico: "bg-orange-100 text-orange-700",
  eletrônicos: "bg-purple-100 text-purple-700",
  têxteis: "bg-pink-100 text-pink-700"
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  full: "bg-red-100 text-red-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  inactive: "bg-gray-100 text-gray-700"
};

export default function CollectionMap() {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<CollectionPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);


  // MOCK: Pontos de coleta
  const mockPoints = useMemo<CollectionPoint[]>(() => [
    {
      id: 1,
      name: "Eco Ponto Central",
      address: "Rua das Flores, 123, Centro",
      latitude: -23.55052,
      longitude: -46.633308,
      accepted_materials: ["plástico", "vidro"],
      status: "active",
      capacity_level: 45,
      operating_hours: "08:00 - 18:00",
    },
    {
      id: 2,
      name: "Ponto Recicla Norte",
      address: "Av. Brasil, 456, Norte",
      latitude: -23.54052,
      longitude: -46.623308,
      accepted_materials: ["metal", "eletrônicos", "têxteis"],
      status: "full",
      capacity_level: 98,
      operating_hours: "09:00 - 17:00",
    },
    {
      id: 3,
      name: "Coleta Verde Sul",
      address: "Rua Verde, 789, Sul",
      latitude: -23.56052,
      longitude: -46.643308,
      accepted_materials: ["orgânico", "vidro", "plástico"],
      status: "maintenance",
      capacity_level: 60,
      operating_hours: "07:00 - 19:00",
    },
  ], []);

  const loadCollectionPoints = useCallback(async () => {
    // Simula carregamento de dados mockados
    setCollectionPoints(mockPoints);
    setLoading(false);
  }, [mockPoints]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  };

  const filterPoints = useCallback(() => {
    let filtered = collectionPoints;

    if (searchTerm) {
      filtered = filtered.filter((point) =>
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMaterial) {
      filtered = filtered.filter((point) =>
        point.accepted_materials?.includes(filterMaterial)
      );
    }

    setFilteredPoints(filtered);
  }, [collectionPoints, searchTerm, filterMaterial]);

  useEffect(() => {
    loadCollectionPoints();
    getUserLocation();
  }, [loadCollectionPoints]);

  useEffect(() => {
    filterPoints();
  }, [filterPoints]);

  const calculateDistance = (point: CollectionPoint) => {
    if (!userLocation) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (point.latitude - userLocation.lat) * Math.PI / 180;
    const dLon = (point.longitude - userLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(point.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const openInMaps = (point: CollectionPoint) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando pontos de coleta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Pontos de Coleta
          </h1>
          <p className="text-gray-600">
            Encontre o ponto de coleta mais próximo e descarte seus resíduos corretamente
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["", "plástico", "vidro", "metal", "eletrônicos", "têxteis"].map((material) => (
                <Button
                  key={material}
                  variant={filterMaterial === material ? "default" : "outline"}
                  onClick={() => setFilterMaterial(material)}
                  className="text-sm"
                >
                  {material === "" ? "Todos" : material}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Points List */}
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {filteredPoints.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum ponto encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar seus filtros ou criar um novo ponto de coleta
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPoints.map((point) => {
                  const distance = calculateDistance(point);
                  return (
                    <Card 
                      key={point.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPoint?.id === point.id ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => setSelectedPoint(point)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {point.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {point.address}
                            </p>
                            {distance && (
                              <p className="text-sm text-green-600 mt-1">
                                📍 {distance.toFixed(1)} km de distância
                              </p>
                            )}
                          </div>
                          <Badge className={STATUS_COLORS[point.status] || STATUS_COLORS.active}>
                            {point.status === 'active' ? 'Ativo' :
                             point.status === 'full' ? 'Lotado' :
                             point.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Materiais aceitos:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {point.accepted_materials?.map((material, index) => (
                              <Badge 
                                key={index}
                                variant="secondary"
                                className={
                                  MATERIAL_COLORS[material as keyof typeof MATERIAL_COLORS] || "bg-gray-100 text-gray-700"
                                }
                              >
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {point.capacity_level !== undefined && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Capacidade</span>
                              <span>{point.capacity_level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  point.capacity_level < 70 ? 'bg-green-500' :
                                  point.capacity_level < 90 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${point.capacity_level}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {point.operating_hours && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {point.operating_hours}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openInMaps(point);
                            }}
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Ir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Point Details */}
          <div>
            {selectedPoint ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Detalhes do Ponto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedPoint.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedPoint.address}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 mb-2">
                      Materiais aceitos:
                    </p>
                    <div className="space-y-1">
                      {selectedPoint.accepted_materials?.map((material, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Recycle className="w-4 h-4 text-green-500" />
                          <span className="text-sm capitalize">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedPoint.operating_hours && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Horário:</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedPoint.operating_hours}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => openInMaps(selectedPoint)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Abrir no Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Selecione um Ponto
                  </h3>
                  <p className="text-gray-600">
                    Clique em um ponto de coleta para ver mais detalhes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}