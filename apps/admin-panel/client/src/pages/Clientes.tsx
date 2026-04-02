import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Phone, Mail, Calendar } from "lucide-react";

export default function Clientes() {
  const clients = [
    {
      id: 1,
      name: "John Carter",
      email: "john@example.com",
      phone: "(555) 123-4567",
      lastVisit: "2024-04-15",
      totalSpent: "$450",
      visits: 12,
    },
    {
      id: 2,
      name: "Michael Smith",
      email: "michael@example.com",
      phone: "(555) 234-5678",
      lastVisit: "2024-04-14",
      totalSpent: "$320",
      visits: 8,
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "(555) 345-6789",
      lastVisit: "2024-04-13",
      totalSpent: "$280",
      visits: 7,
    },
    {
      id: 4,
      name: "David Lee",
      email: "david@example.com",
      phone: "(555) 456-7890",
      lastVisit: "2024-04-12",
      totalSpent: "$520",
      visits: 15,
    },
    {
      id: 5,
      name: "Ryan Harris",
      email: "ryan@example.com",
      phone: "(555) 567-8901",
      lastVisit: "2024-04-11",
      totalSpent: "$180",
      visits: 4,
    },
    {
      id: 6,
      name: "Chris Brown",
      email: "chris@example.com",
      phone: "(555) 678-9012",
      lastVisit: "2024-04-10",
      totalSpent: "$650",
      visits: 18,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-600 mt-1">Gerencie todos os seus clientes</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
            <Button variant="outline">Filtros</Button>
            <Button variant="outline">Exportar</Button>
          </div>
        </Card>

        {/* Clients Table */}
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700">Nome</TableHead>
                <TableHead className="text-slate-700">Contato</TableHead>
                <TableHead className="text-slate-700">Última Visita</TableHead>
                <TableHead className="text-slate-700">Visitas</TableHead>
                <TableHead className="text-slate-700">Total Gasto</TableHead>
                <TableHead className="text-right text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{client.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(client.lastVisit).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {client.visits}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{client.totalSpent}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Histórico</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Bloquear</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600">Mostrando 1 a 6 de 24 clientes</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
