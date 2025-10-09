import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Leaf,
  Home,
  MapPin,
  Recycle,
  Award,
  Store,
  BarChart3,
  Users,
  Menu,
  User as UserIcon,
  Package,
  Route as RouteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/user-context-helpers";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { currentUser, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavigationItems = () => {
    if (!currentUser) return [];

    const baseItems = [
      { title: "Início", url: "/", icon: Home },
      { title: "Pontos de Coleta", url: "/pontos", icon: MapPin },
    ];

    switch (currentUser.user_type) {
      case "citizen":
        return [
          ...baseItems,
          { title: "Meus Pontos", url: "/meus-pontos", icon: Award },
          { title: "Recompensas", url: "/recompensas", icon: Store },
        ];
      case "waste_picker":
        return [
          ...baseItems,
          { title: "Materiais", url: "/materiais", icon: Recycle },
          { title: "Minhas Rotas", url: "/minhas-rotas", icon: RouteIcon },
        ];
      case "artisan":
        return [
          ...baseItems,
          { title: "Marketplace", url: "/marketplace", icon: Package },
          { title: "Meus Pedidos", url: "/meus-pedidos", icon: Award },
        ];
      case "business":
        return [
          ...baseItems,
          { title: "Resgates", url: "/resgates", icon: Award },
          { title: "Estatísticas", url: "/estatisticas", icon: BarChart3 },
        ];
      case "municipal":
        return [
          ...baseItems,
          { title: "Dashboard", url: "/municipal-dashboard", icon: BarChart3 },
          { title: "Usuários", url: "/usuarios", icon: Users },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const NavigationMenu = ({ isMobile = false }) => (
    <nav
      className={`${
        isMobile ? "flex flex-col space-y-2 p-4" : "hidden lg:flex lg:space-x-4"
      }`}
    >
      {navigationItems.map((item) => (
        <Link
          key={item.title}
          to={item.url}
          onClick={() => isMobile && setMobileMenuOpen(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            location.pathname === item.url
              ? "bg-green-100 text-green-700"
              : "text-gray-600 hover:text-green-600 hover:bg-green-50"
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">EcoHub</h1>
                <p className="text-xs text-gray-500">Gestão de Resíduos</p>
              </div>
            </Link>

            {currentUser && <NavigationMenu />}

            <div className="flex items-center gap-2">
              {currentUser ? (
                <>
                  <div className="hidden sm:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span className="hidden md:inline">
                            {currentUser.full_name.split(" ")[0]}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/perfil">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          Sair
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                      <div className="p-4 bg-gray-100 rounded-lg mb-6">
                        <p className="font-medium">{currentUser.full_name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {currentUser.user_type?.replace("_", " ")}
                        </p>
                      </div>
                      <NavigationMenu isMobile={true} />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full mb-2"
                        >
                          <Link
                            to="/perfil"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Meu Perfil</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="w-full"
                        >
                          Sair
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 EcoHub. Para um Brasil mais sustentável.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium">EcoHub</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
