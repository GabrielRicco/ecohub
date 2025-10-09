// ...existing code...
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Leaf, 
  MapPin, 
  Recycle, 
  Award, 
  TrendingUp, 
  Users,
  ArrowRight,
  Heart,
  BarChart3,
  Package,
  Route as RouteIcon
} from "lucide-react";
import type { User } from "@/types/User";
import { useUser } from "@/context/user-context-helpers";

export default function Dashboard() {
  const { currentUser } = useUser();

  const getRoleSpecificContent = () => {
    if (!currentUser) return null;

    switch (currentUser.user_type) {
      case "citizen":
        return <CitizenDashboard user={currentUser} />;
      case "waste_picker":
        return <WastePickerDashboard />;
      case "artisan":
        return <ArtisanDashboard />;
      case "business":
        return <BusinessDashboard />;
      case "municipal":
        return <MunicipalDashboard  />;
      default:
        return <DefaultDashboard />;
    }
  };


  if (!currentUser) {
    return <WelcomePage />;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Olá, {currentUser.full_name}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu painel do EcoHub
          </p>
        </div>
        
        {getRoleSpecificContent()}
      </div>
    </div>
  );
}

function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Bem-vindo ao EcoHub
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A plataforma que transforma a gestão de resíduos em pequenas cidades, 
          conectando cidadãos, catadores, artesãos e empresas locais em um ecossistema sustentável.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Gestão Inteligente</h3>
              <p className="text-sm text-gray-600">
                Sistema completo de coleta e reciclagem com pontos de recompensa
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Comunidade Conectada</h3>
              <p className="text-sm text-gray-600">
                Une cidadãos, catadores, artesãos e empresas em um só lugar
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Impacto Mensurável</h3>
              <p className="text-sm text-gray-600">
                Dados em tempo real para otimizar rotas e reduzir custos
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Link to="/login"> 
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CitizenDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Pontos Disponíveis</p>
                <p className="text-3xl font-bold">{user.points_balance || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{user.total_points_earned || 0}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Impacto Ambiental</p>
                <p className="text-2xl font-bold text-green-600">Positivo</p>
              </div>
              <Heart className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link to="/pontos"> 
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Encontrar Pontos de Coleta
                </Button>
              </Link>
              <Link to="/recompensas"> 
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Ver Recompensas Disponíveis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dicas de Sustentabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">💡 Dica do Dia</p>
                <p className="text-sm text-green-700 mt-1">
                  Lave as embalagens antes de descartar para aumentar suas chances de reciclagem!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WastePickerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="w-5 h-5" />
              Materiais Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Veja os materiais que aguardam coleta</p>
              <Link to="/materiais"> 
                <Button size="sm">
                  Ver Disponíveis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="w-5 h-5" />
              Rota Otimizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Planeje sua rota de coleta de hoje</p>
              <Link to="/minhas-rotas"> 
                <Button variant="outline" size="sm">
                  Planejar Rota
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArtisanDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Marketplace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Encontre materiais para seus projetos</p>
              <Link to="/marketplace"> 
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explorar Materiais
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meus Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Gerencie seus pedidos de materiais</p>
              <Link to="/meus-pedidos"> 
                <Button variant="outline" className="mt-4" size="sm">
                  Gerenciar Pedidos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Resgates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Confirme os resgates de pontos dos clientes</p>
               <Link to="/resgates"> 
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Ver Resgates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Veja o impacto da sua participação</p>
              <Link to="/estatisticas"> 
                <Button variant="outline">
                  Ver Estatísticas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MunicipalDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-blue-600 mb-2">0</p>
              <p className="text-gray-600">Cadastrados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Coletas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-green-600 mb-2">0</p>
              <p className="text-gray-600">Depósitos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Eficiência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-purple-600 mb-2">0%</p>
              <p className="text-gray-600">Reciclagem</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/municipal-dashboard"> 
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard Completo
              </Button>
            </Link>
            <Link to="/usuarios"> 
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DefaultDashboard() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Complete seu perfil
      </h2>
      <p className="text-gray-600 mb-6">
        Defina seu tipo de usuário para personalizar sua experiência
      </p>
  <Link to="/setup"> 
        <Button className="bg-green-600 hover:bg-green-700">
          Configurar Perfil
        </Button>
      </Link>
    </div>
  );
}