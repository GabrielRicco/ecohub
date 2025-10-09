import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Palette, 
  Plus, 
  Search,
  Calendar,
  User as UserIcon,
  MessageCircle,
  Package
} from "lucide-react";
import { useUser } from "@/context/user-context-helpers";

const MATERIAL_COLORS = {
  plastic: "bg-blue-100 text-blue-700",
  glass: "bg-green-100 text-green-700", 
  cardboard: "bg-yellow-100 text-yellow-700",
  metal: "bg-gray-100 text-gray-700",
  organic: "bg-orange-100 text-orange-700",
  electronics: "bg-purple-100 text-purple-700",
  textiles: "bg-pink-100 text-pink-700"
};


type MaterialRequestType = {
  id: number;
  material_type: string;
  quantity_needed: number;
  purpose: string;
  contact_info: string;
  deadline?: string;
};

type MaterialDeposit = {
  id: number;
  material_type: string;
  quantity: number;
  verified: boolean;
};

export default function MaterialMarketplace() {
  const { currentUser } = useUser();
  const [requests, setRequests] = useState<MaterialRequestType[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<MaterialDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [newRequest, setNewRequest] = useState({
    material_type: "",
    quantity_needed: "",
    purpose: "",
    contact_info: "",
    deadline: ""
  });

  // MOCK DATA
  useEffect(() => {
    // Mock: Pedidos de materiais
    const mockRequests: MaterialRequestType[] = [
      {
        id: 1,
        material_type: "plastic",
        quantity_needed: 10,
        purpose: "Fazer vasos reciclados para feira",
        contact_info: "artesao1@email.com",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      },
      {
        id: 2,
        material_type: "glass",
        quantity_needed: 5,
        purpose: "Criar luminárias artesanais",
        contact_info: "artesao2@email.com",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      },
      {
        id: 3,
        material_type: "cardboard",
        quantity_needed: 20,
        purpose: "Montar embalagens personalizadas",
        contact_info: "artesao3@email.com",
        deadline: undefined
      }
    ];

    // Mock: Materiais disponíveis
    const mockMaterials: MaterialDeposit[] = [
      { id: 101, material_type: "plastic", quantity: 15, verified: true },
      { id: 102, material_type: "glass", quantity: 8, verified: true },
      { id: 103, material_type: "cardboard", quantity: 30, verified: true },
      { id: 104, material_type: "metal", quantity: 5, verified: true },
      { id: 105, material_type: "textiles", quantity: 12, verified: true }
    ];

    setRequests(mockRequests);
    setAvailableMaterials(mockMaterials);
    setLoading(false);
  }, []);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Simula criação local
    const newReq: MaterialRequestType = {
      id: Date.now(),
      material_type: newRequest.material_type,
      quantity_needed: parseFloat(newRequest.quantity_needed) || 0,
      purpose: newRequest.purpose,
      contact_info: newRequest.contact_info || currentUser.email,
      deadline: newRequest.deadline || undefined
    };
    setRequests(prev => [newReq, ...prev]);
    setNewRequest({
      material_type: "",
      quantity_needed: "",
      purpose: "",
      contact_info: "",
      deadline: ""
    });
    setShowRequestForm(false);
  };


  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.material_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = !filterMaterial || request.material_type === filterMaterial;
    return matchesSearch && matchesMaterial;
  });

  const getMaterialStats = () => {
    const stats: Record<string, number> = {};
    availableMaterials.forEach(material => {
      stats[material.material_type] = (stats[material.material_type] || 0) + material.quantity;
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando marketplace...</p>
        </div>
      </div>
    );
  }

  const materialStats = getMaterialStats();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Marketplace de Materiais
            </h1>
            <p className="text-gray-600">
              Conecte-se com outros artesãos e encontre materiais para seus projetos
            </p>
          </div>
          <Button
            onClick={() => setShowRequestForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>

        {/* Material Availability Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{materialStats.plastic || 0}</p>
              <p className="text-sm text-gray-600">Plástico Disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{materialStats.glass || 0}</p>
              <p className="text-sm text-gray-600">Vidro Disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{materialStats.cardboard || 0}</p>
              <p className="text-sm text-gray-600">Papelão Disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{materialStats.textiles || 0}</p>
              <p className="text-sm text-gray-600">Tecidos Disponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por projeto ou material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["", "plastic", "glass", "cardboard", "metal", "textiles"].map((material) => (
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

        {/* Material Requests */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Pedidos da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-gray-600">
                      Seja o primeiro a criar um pedido de material!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={
                                MATERIAL_COLORS[request.material_type as keyof typeof MATERIAL_COLORS] || 'bg-gray-100 text-gray-700'
                              }>
                                {request.material_type}
                              </Badge>
                              <Badge variant="outline">
                                {request.quantity_needed} unidades
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {request.purpose}
                            </h4>
                          </div>
                          {request.deadline && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(request.deadline).toLocaleDateString('pt-BR')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <UserIcon className="w-4 h-4" />
                            <span>Artesão da comunidade</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Entrar em Contato
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <div>
            {showRequestForm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novo Pedido de Material
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div>
                      <Select
                        value={newRequest.material_type}
                        onValueChange={(value) => setNewRequest(prev => ({...prev, material_type: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plastic">Plástico</SelectItem>
                          <SelectItem value="glass">Vidro</SelectItem>
                          <SelectItem value="cardboard">Papelão</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="textiles">Tecidos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Input
                      placeholder="Quantidade necessária"
                      type="number"
                      value={newRequest.quantity_needed}
                      onChange={(e) => setNewRequest(prev => ({...prev, quantity_needed: e.target.value}))}
                    />

                    <Textarea
                      placeholder="Para que você vai usar este material? Descreva seu projeto..."
                      value={newRequest.purpose}
                      onChange={(e) => setNewRequest(prev => ({...prev, purpose: e.target.value}))}
                      rows={3}
                    />

                    <Input
                      placeholder="Seu contato (opcional)"
                      value={newRequest.contact_info}
                      onChange={(e) => setNewRequest(prev => ({...prev, contact_info: e.target.value}))}
                    />

                    <Input
                      placeholder="Prazo necessário"
                      type="date"
                      value={newRequest.deadline}
                      onChange={(e) => setNewRequest(prev => ({...prev, deadline: e.target.value}))}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRequestForm(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={!newRequest.material_type || !newRequest.purpose}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Criar Pedido
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Artesãos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium">💡 Seja específico</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Descreva exatamente como vai usar o material
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">🤝 Colabore</p>
                    <p className="text-sm text-green-700 mt-1">
                      Entre em contato com outros artesãos
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">⏰ Planeje</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Defina prazos realistas para seus projetos
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}