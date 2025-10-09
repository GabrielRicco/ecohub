import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon,
  Edit,
  Save,
  X,
  Phone,
  MapPin,
  Mail,
  Building,
  Tag
} from "lucide-react";
import { useUser } from "@/context/user-context-helpers";
import type { User } from "@/types/User";

const USER_TYPE_LABELS = {
  citizen: "Cidadão/Turista",
  waste_picker: "Catador",
  artisan: "Artesão",
  business: "Empresa Local",
  municipal: "Gestor Municipal"
};

const SPECIALTIES = {
  waste_picker: ["Plástico", "Vidro", "Papel/Papelão", "Metal", "Eletrônicos"],
  artisan: ["Vidro", "Plástico", "Tecidos", "Papelão", "Metal", "Madeira"],
  business: ["Restaurante", "Loja", "Hotel/Pousada", "Mercado", "Serviços"]
};

export default function UserProfile() {
  const { currentUser, login } = useUser();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  const loadUser = useCallback(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        business_name: currentUser.business_name || "",
        specialties: currentUser.specialties || [],
        municipality: currentUser.municipality || ""
      });
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleInputChange = (
    field: keyof User,
    value: string | number | string[] | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties && Array.isArray(prev.specialties)
        ? prev.specialties.includes(specialty)
          ? prev.specialties.filter(s => s !== specialty)
          : [...prev.specialties, specialty]
        : [specialty]
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Atualiza o usuário no contexto global
      if (currentUser) {
        login({
          ...currentUser,
          ...formData,
        });
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        business_name: currentUser.business_name || "",
        specialties: currentUser.specialties || [],
        municipality: currentUser.municipality || ""
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar perfil</h3>
            <p className="text-gray-600">Tente novamente mais tarde</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableSpecialties =
    (currentUser.user_type === "waste_picker" ||
      currentUser.user_type === "artisan" ||
      currentUser.user_type === "business")
      ? SPECIALTIES[currentUser.user_type]
      : [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentUser.full_name}
              </h3>
              <Badge className="mb-4" variant="secondary">
                {USER_TYPE_LABELS[currentUser.user_type] || currentUser.user_type}
              </Badge>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
                
                {currentUser.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                
                {currentUser.municipality && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.municipality}</span>
                  </div>
                )}
                
                {currentUser.business_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{currentUser.business_name}</span>
                  </div>
                )}
              </div>

              {currentUser.user_type === 'citizen' && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {currentUser.points_balance || 0}
                  </p>
                  <p className="text-sm text-green-700">Pontos Disponíveis</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
                {!editing && (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Nome Completo
                      </Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        disabled={!editing}
                        className="mt-1"
                      />
                    </div>

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
                        disabled={!editing}
                        placeholder="(84) 99999-9999"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={currentUser.email}
                      disabled
                      className="mt-1 bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="municipality" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Município
                    </Label>
                    <Select
                      value={formData.municipality}
                      onValueChange={(value) => handleInputChange('municipality', value)}
                      disabled={!editing}
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

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!editing}
                      placeholder="Seu endereço completo"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  {currentUser.user_type === 'business' && (
                    <div>
                      <Label htmlFor="business_name" className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Nome da Empresa
                      </Label>
                      <Input
                        id="business_name"
                        value={formData.business_name}
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                        disabled={!editing}
                        placeholder="Nome do seu negócio"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {availableSpecialties.length > 0 && (
                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4" />
                        Especialidades
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {availableSpecialties.map((specialty: string) => (
                          <div
                            key={specialty}
                            onClick={editing ? () => handleSpecialtyToggle(specialty) : undefined}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              editing ? 'cursor-pointer' : ''
                            } ${
                              formData.specialties?.includes(specialty)
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300' + (editing ? ' hover:bg-gray-200' : '')
                            }`}
                          >
                            {specialty}
                            {formData.specialties?.includes(specialty) && editing && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        ))}
                      </div>
                      {editing && (
                        <p className="text-xs text-gray-500 mt-2">
                          Clique para selecionar/remover
                        </p>
                      )}
                    </div>
                  )}

                  {editing && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {saving ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}