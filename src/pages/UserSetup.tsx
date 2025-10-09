import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User as UserIcon, 
  Recycle, 
  Palette, 
  Store, 
  Building,
  Phone,
  MapPin,
  Tag,
  X
} from "lucide-react";
import { useUser } from "@/context/user-context-helpers";
import type { User, UserType } from "@/types/User";

const USER_TYPES = [
  {
    value: "citizen",
    title: "Cidadão/Turista",
    description: "Descarte seus resíduos e ganhe pontos para trocar por recompensas",
    icon: UserIcon,
    color: "bg-blue-500"
  },
  {
    value: "waste_picker",
    title: "Catador",
    description: "Acesse materiais recicláveis de forma organizada e otimize suas rotas",
    icon: Recycle,
    color: "bg-green-500"
  },
  {
    value: "artisan",
    title: "Artesão",
    description: "Encontre materiais reutilizáveis para seus projetos criativos",
    icon: Palette,
    color: "bg-purple-500"
  },
  {
    value: "business",
    title: "Empresa Local",
    description: "Participe do sistema de recompensas e fortaleça a comunidade",
    icon: Store,
    color: "bg-orange-500"
  },
  {
    value: "municipal",
    title: "Gestor Municipal",
    description: "Acesse dados em tempo real e otimize a gestão de resíduos",
    icon: Building,
    color: "bg-indigo-500"
  }
];

const SPECIALTIES = {
  waste_picker: ["Plástico", "Vidro", "Papel/Papelão", "Metal", "Eletrônicos"],
  artisan: ["Vidro", "Plástico", "Tecidos", "Papelão", "Metal", "Madeira"],
  business: ["Restaurante", "Loja", "Hotel/Pousada", "Mercado", "Serviços"]
};

export default function UserSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, login } = useUser();
  const [formData, setFormData] = useState<{
    user_type: UserType | "";
    phone: string;
    address: string;
    business_name: string;
    specialties: string[];
    municipality: string;
  }>({
    user_type: "",
    phone: "",
    address: "",
    business_name: "",
    specialties: [],
    municipality: "Pipa, RN"
  });

  useEffect(() => {
    if (!currentUser) {
      console.log({ currentUser })
      navigate("/login");
      return;
    }
    if (currentUser.user_type) {
      navigate("/");
      return;
    }
    setFormData(prev => ({
      ...prev,
      phone: (currentUser as Partial<User>).phone || "",
      address: (currentUser as Partial<User>).address || "",
      business_name: (currentUser as Partial<User>).business_name || "",
      specialties: (currentUser as Partial<User>).specialties || [],
      municipality: (currentUser as Partial<User>).municipality || "Pipa, RN"
    }));
  }, [currentUser, navigate]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | string[] | UserType
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.user_type) return;

    setLoading(true);
    try {
      // Atualiza o usuário no contexto global
      login({
        ...currentUser,
        ...formData,
        user_type: formData.user_type as UserType,
      } as User & typeof formData);
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const selectedUserType = USER_TYPES.find(type => type.value === formData.user_type);
  const availableSpecialties = (SPECIALTIES as Record<string, string[]>)[formData.user_type] || [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configure seu Perfil
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Para personalizar sua experiência no EcoHub, precisamos saber como você 
            gostaria de participar do nosso ecossistema de sustentabilidade.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Escolha seu Tipo de Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {USER_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      onClick={() => handleInputChange('user_type', type.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.user_type === type.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {type.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {formData.user_type && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedUserType && <selectedUserType.icon className="w-5 h-5" />}
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(84) 99999-9999"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="municipality" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Município
                    </Label>
                    <Select
                      value={formData.municipality}
                      onValueChange={(value) => handleInputChange('municipality', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o município" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pipa, RN">Pipa, RN</SelectItem>
                        <SelectItem value="Tibau do Sul, RN">Tibau do Sul, RN</SelectItem>
                        <SelectItem value="Natal, RN">Natal, RN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Seu endereço completo"
                    className="mt-1"
                    rows={2}
                  />
                </div>

                {formData.user_type === 'business' && (
                  <div>
                    <Label htmlFor="business_name" className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Nome da Empresa
                    </Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => handleInputChange('business_name', e.target.value)}
                      placeholder="Nome do seu negócio"
                      className="mt-1"
                    />
                  </div>
                )}

                {availableSpecialties.length > 0 && (
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4" />
                      {formData.user_type === 'waste_picker' ? 'Materiais de Especialidade' :
                       formData.user_type === 'artisan' ? 'Materiais de Interesse' :
                       'Tipo de Negócio'}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {availableSpecialties.map((specialty) => (
                        <div
                          key={specialty}
                          onClick={() => handleSpecialtyToggle(specialty)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200 ${
                            formData.specialties.includes(specialty)
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {specialty}
                          {formData.specialties.includes(specialty) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Clique para selecionar/remover especialidades
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={!formData.user_type || loading}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              {loading ? "Salvando..." : "Finalizar Configuração"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}