import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdvertiserFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AdvertiserForm({ open, onOpenChange }: AdvertiserFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.email || !formData.type) {
      toast({
        title: "Campos obrigatórios faltando",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "error",
      });
      return;
    }

    console.log("Formulário de anunciante enviado:", formData);
    
    toast({
      title: "Solicitação enviada!",
      description: "Entraremos em contato em breve com mais informações.",
      variant: "success",
    });

    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      type: "",
      message: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-green-600" />
            Anuncie no EcoHub
          </DialogTitle>
          <DialogDescription>
            Divulgue sua empresa ou evento para toda a comunidade sustentável
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa/Organização *</Label>
            <Input
              id="companyName"
              placeholder="Ex: Eco Produtos Ltda"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nome do Contato</Label>
              <Input
                id="contactName"
                placeholder="João Silva"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(84) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Anúncio *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sponsor">Patrocínio/Anúncio</SelectItem>
                <SelectItem value="event">Evento/Ação Social</SelectItem>
                <SelectItem value="partnership">Parceria Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem/Detalhes</Label>
            <Textarea
              id="message"
              placeholder="Conte-nos mais sobre o que você gostaria de anunciar..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>💚 Por que anunciar no EcoHub?</strong>
            </p>
            <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
              <li>Alcance uma comunidade engajada em sustentabilidade</li>
              <li>Apoie iniciativas ambientais locais</li>
              <li>Fortaleça sua marca com responsabilidade social</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
