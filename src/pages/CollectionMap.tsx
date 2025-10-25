import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Recycle, 
  Search,
  Plus,
  PackagePlus,
} from "lucide-react";
import { useUser } from "@/context/user-context-helpers";
import { useToast } from "@/hooks/use-toast";

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

// eslint-disable-next-line react-refresh/only-export-components
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
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<CollectionPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  
  // Estados para criar novo ponto
  const [showCreatePoint, setShowCreatePoint] = useState(false);
  const [newPoint, setNewPoint] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    accepted_materials: [] as string[],
    operating_hours: "",
  });
  
  // Estados para registrar depósito
  const [showRegisterDeposit, setShowRegisterDeposit] = useState(false);
  const [depositPoint, setDepositPoint] = useState<CollectionPoint | null>(null);
  const [newDeposit, setNewDeposit] = useState({
    material_type: "",
    quantity: "",
    notes: "",
  });


  // MOCK: Pontos de coleta
  const mockPoints = useMemo<CollectionPoint[]>(() => [
    {
      id: 1,
      name: "Eco Ponto Baía dos Golfinhos",
      address: "Av. Baía dos Golfinhos, 267-211, Tibau do Sul - RN",
      latitude: -6.2280921138207495,
      longitude: -35.053824694447954,
      accepted_materials: ["plástico", "vidro"],
      status: "active",
      capacity_level: 45,
      operating_hours: "08:00 - 18:00",
    },
    {
      id: 2,
      name: "Ponto Largo São Sebastião",
      address: "Largo São Sebastião, Tibau do Sul - RN",
      latitude: -6.2218329954689215,
      longitude: -35.04904547797494,
      accepted_materials: ["metal", "eletrônicos", "têxteis"],
      status: "full",
      capacity_level: 98,
      operating_hours: "09:00 - 17:00",
    },
    {
      id: 3,
      name: "Coleta Pipa",
      address: "Pipa, Tibau do Sul - RN",
      latitude: -6.222157888687409,
      longitude: -35.04782047798112,
      accepted_materials: ["orgânico", "vidro", "plástico"],
      status: "maintenance",
      capacity_level: 60,
      operating_hours: "07:00 - 19:00",
    },
    {
      id: 4,
      name: "Ponto de Coleta Dose Certa",
      address: "Farmácia Dose certa, Galeria Maramor - Av. Baía dos Golfinhos, 2007, Tibau do Sul - RN",
      latitude: -6.225099741646465,
      longitude: -35.046607123391944,
      accepted_materials: ["orgânico", "vidro", "plástico"],
      status: "inactive",
      capacity_level: 0,
      operating_hours: "-",
    },
    {
      id: 5,
      name: "Ponto do Anel Viário",
      address: "R. do Anel Viário, 14-308, Tibau do Sul - RN",
      latitude: -6.233780964761548,
      longitude: -35.04831521818166, 
      accepted_materials: ["orgânico", "vidro", "plástico"],
      status: "active",
      capacity_level: 50,
      operating_hours: "08:00 - 18:00",
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

  const handleCreatePoint = () => {
    if (!newPoint.name || !newPoint.address || !newPoint.latitude || !newPoint.longitude) {
      toast({
        title: "Campos obrigatórios faltando",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "error",
      });
      return;
    }

    const point: CollectionPoint = {
      id: Date.now(),
      name: newPoint.name,
      address: newPoint.address,
      latitude: parseFloat(newPoint.latitude),
      longitude: parseFloat(newPoint.longitude),
      accepted_materials: newPoint.accepted_materials,
      status: "active",
      capacity_level: 0,
      operating_hours: newPoint.operating_hours || undefined,
    };

    setCollectionPoints(prev => [...prev, point]);
    setShowCreatePoint(false);
    setNewPoint({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      accepted_materials: [],
      operating_hours: "",
    });
    toast({
      title: "Sucesso!",
      description: "Ponto de coleta criado com sucesso!",
      variant: "success",
    });
  };

  const handleRegisterDeposit = () => {
    if (!depositPoint || !newDeposit.material_type || !newDeposit.quantity) {
      toast({
        title: "Campos obrigatórios faltando",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "error",
      });
      return;
    }

    // Simula registro do depósito
    console.log("Depósito registrado:", {
      point_id: depositPoint.id,
      user_id: currentUser?.id,
      material_type: newDeposit.material_type,
      quantity: parseFloat(newDeposit.quantity),
      notes: newDeposit.notes,
      created_date: new Date().toISOString(),
    });

    setShowRegisterDeposit(false);
    setDepositPoint(null);
    setNewDeposit({
      material_type: "",
      quantity: "",
      notes: "",
    });
    toast({
      title: "Depósito registrado!",
      description: "Você ganhou pontos pelo seu depósito.",
      variant: "success",
    });
  };

  const toggleMaterial = (material: string) => {
    setNewPoint(prev => ({
      ...prev,
      accepted_materials: prev.accepted_materials.includes(material)
        ? prev.accepted_materials.filter(m => m !== material)
        : [...prev.accepted_materials, material]
    }));
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pontos de Coleta
            </h1>
            <p className="text-gray-600">
              Encontre o ponto de coleta mais próximo e descarte seus resíduos corretamente
            </p>
          </div>
          <div className="flex gap-2">
            {(currentUser?.user_type === 'municipal' || currentUser?.user_type === 'citizen' || currentUser?.user_type === 'business') && (
              <Dialog open={showCreatePoint} onOpenChange={setShowCreatePoint}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Ponto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Ponto de Coleta</DialogTitle>
                    <DialogDescription>
                      Adicione um novo ponto de coleta ao sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Ponto *</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Eco Ponto Central"
                        value={newPoint.name}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço *</Label>
                      <Input
                        id="address"
                        placeholder="Ex: Rua das Flores, 123"
                        value={newPoint.address}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          placeholder="-23.5505"
                          value={newPoint.latitude}
                          onChange={(e) => setNewPoint(prev => ({ ...prev, latitude: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          placeholder="-46.6333"
                          value={newPoint.longitude}
                          onChange={(e) => setNewPoint(prev => ({ ...prev, longitude: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Horário de Funcionamento</Label>
                      <Input
                        id="hours"
                        placeholder="Ex: 08:00 - 18:00"
                        value={newPoint.operating_hours}
                        onChange={(e) => setNewPoint(prev => ({ ...prev, operating_hours: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Materiais Aceitos *</Label>
                      <div className="flex flex-wrap gap-2">
                        {["plástico", "vidro", "papelão", "metal", "orgânico", "eletrônicos", "têxteis"].map((material) => (
                          <Badge
                            key={material}
                            variant={newPoint.accepted_materials.includes(material) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleMaterial(material)}
                          >
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowCreatePoint(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button onClick={handleCreatePoint} className="flex-1 bg-green-500 hover:bg-green-600">
                        Criar Ponto
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDepositPoint(point);
                                setShowRegisterDeposit(true);
                              }}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <PackagePlus className="w-3 h-3 mr-1" />
                              Depositar
                            </Button>
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
                      onClick={() => {
                        setDepositPoint(selectedPoint);
                        setShowRegisterDeposit(true);
                      }}
                    >
                      <PackagePlus className="w-4 h-4 mr-2" />
                      Registrar Depósito
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
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

      {/* Dialog para Registrar Depósito */}
      <Dialog open={showRegisterDeposit} onOpenChange={setShowRegisterDeposit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Depósito</DialogTitle>
            <DialogDescription>
              Registre o material que você está depositando em {depositPoint?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="material_type">Tipo de Material *</Label>
              <Select
                value={newDeposit.material_type}
                onValueChange={(value) => setNewDeposit(prev => ({ ...prev, material_type: value }))}
              >
                <SelectTrigger id="material_type">
                  <SelectValue placeholder="Selecione o material" />
                </SelectTrigger>
                <SelectContent>
                  {depositPoint?.accepted_materials?.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (kg) *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex: 2.5"
                value={newDeposit.quantity}
                onChange={(e) => setNewDeposit(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Descreva o material depositado..."
                value={newDeposit.notes}
                onChange={(e) => setNewDeposit(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRegisterDeposit(false);
                  setDepositPoint(null);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRegisterDeposit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!newDeposit.material_type || !newDeposit.quantity}
              >
                Registrar Depósito
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}