import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { format } from "date-fns";

const USER_TYPE_LABELS = {
  citizen: "Cidadão",
  waste_picker: "Catador",
  artisan: "Artesão",
  business: "Empresa",
  municipal: "Gestor"
};


type User = {
  id: number;
  full_name: string;
  email: string;
  user_type: keyof typeof USER_TYPE_LABELS;
  municipality: string;
  created_date: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // MOCK: Usuários
    const mockUsers: User[] = [
      {
        id: 1,
        full_name: "João Silva",
        email: "joao@email.com",
        user_type: "waste_picker",
        municipality: "Pipa",
        created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        full_name: "Maria Souza",
        email: "maria@email.com",
        user_type: "artisan",
        municipality: "Tibau do Sul",
        created_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        full_name: "Carlos Lima",
        email: "carlos@email.com",
        user_type: "business",
        municipality: "Pipa",
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        full_name: "Ana Paula",
        email: "ana@email.com",
        user_type: "citizen",
        municipality: "Natal",
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        full_name: "Lucas Rocha",
        email: "lucas@email.com",
        user_type: "municipal",
        municipality: "Tibau do Sul",
        created_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize todos os usuários cadastrados na plataforma.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Usuários</CardTitle>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo de Usuário</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{USER_TYPE_LABELS[user.user_type] || 'Não definido'}</Badge>
                    </TableCell>
                    <TableCell>{user.municipality}</TableCell>
                    <TableCell>{format(new Date(user.created_date), 'dd/MM/yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhum usuário encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}