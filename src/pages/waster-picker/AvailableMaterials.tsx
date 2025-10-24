import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Recycle, 
  MapPin, 
  Clock, 
  Weight,
  Search,
  Navigation,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { MATERIAL_COLORS } from "../CollectionMap";

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
};

export default function AvailableMaterials() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [verifying, setVerifying] = useState<number | null>(null);

  useEffect(() => {
    // MOCK: pontos de coleta
    const mockPoints = [
      {
        id: 1,
        name: "Eco Ponto Central",
        address: "Av. Central, 1000, Pipa, RN",
        latitude: -6.235,
        longitude: -35.045
      },
      {
        id: 2,
        name: "Mercado Verde",
        address: "Rua das Flores, 123, Pipa, RN",
        latitude: -6.237,
        longitude: -35.048
      },
      {
        id: 3,
        name: "Praça do Sol",
        address: "Praça do Sol, Pipa, RN",
        latitude: -6.239,
        longitude: -35.050
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
        material_type: "plástico",
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

    setCollectionPoints(mockPoints);
    setDeposits(mockDeposits);
    setLoading(false);
  }, []);

  const handleVerifyPickup = (deposit: Deposit) => {
    setVerifying(deposit.id);
    setTimeout(() => {
      setDeposits(prev => prev.filter(d => d.id !== deposit.id));
      setVerifying(null);
    }, 1000);
  };

  const getCollectionPointName = (pointId: number) => {
    const point = collectionPoints.find(p => p.id === pointId);
    return point ? point.name : "Ponto desconhecido";
  };

  const getCollectionPointAddress = (pointId: number) => {
    const point = collectionPoints.find(p => p.id === pointId);
    return point ? point.address : "";
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = !searchTerm || 
      deposit.material_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCollectionPointName(deposit.collection_point_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMaterial = !filterMaterial || deposit.material_type === filterMaterial;
    
    return matchesSearch && matchesMaterial;
  });

  const openInMaps = (pointId: number) => {
    const point = collectionPoints.find(p => p.id === pointId);
    if (point) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando materiais disponíveis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Materiais Disponíveis
          </h1>
          <p className="text-gray-600">
            Materiais recicláveis aguardando coleta nos pontos da cidade
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por material ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["", "plásitco", "vidro", "metal", "eletrônicos", "têxteis"].map((material) => (
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

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{deposits.length}</p>
              <p className="text-sm text-gray-600">Total Disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {deposits.filter(d => d.material_type === 'plastic').length}
              </p>
              <p className="text-sm text-gray-600">Plástico</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {deposits.filter(d => d.material_type === 'glass').length}
              </p>
              <p className="text-sm text-gray-600">Vidro</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {deposits.filter(d => d.material_type === 'cardboard').length}
              </p>
              <p className="text-sm text-gray-600">Papelão</p>
            </CardContent>
          </Card>
        </div>

        {/* Materials List */}
        <div className="grid gap-4">
          {filteredDeposits.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Recycle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum material disponível
                </h3>
                <p className="text-gray-600">
                  Não há materiais aguardando coleta no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDeposits.map((deposit) => (
              <Card key={deposit.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Recycle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {deposit.material_type}
                          </h3>
                          <Badge 
                            className={MATERIAL_COLORS[deposit.material_type as keyof typeof MATERIAL_COLORS] || "bg-gray-100 text-gray-700"}
                          >
                            {deposit.material_type}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {getCollectionPointName(deposit.collection_point_id)}
                          </p>
                          <p className="text-xs text-gray-500 ml-6">
                            {getCollectionPointAddress(deposit.collection_point_id)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(new Date(deposit.created_date), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Weight className="w-4 h-4" />
                            {deposit.quantity} {deposit.quantity === 1 ? 'unidade' : 'unidades'}
                          </p>
                        </div>
                      </div>

                      {deposit.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>Observações:</strong> {deposit.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInMaps(deposit.collection_point_id)}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Rota
                      </Button>
                      <Button
                        onClick={() => handleVerifyPickup(deposit)}
                        disabled={verifying === deposit.id}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {verifying === deposit.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Coletado
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}