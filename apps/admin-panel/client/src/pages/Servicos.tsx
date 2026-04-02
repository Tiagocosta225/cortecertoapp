import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Plus, MoreVertical, Clock, DollarSign } from "lucide-react";

export default function Servicos() {
  const services = [
    {
      id: 1,
      name: "Haircut",
      description: "Corte de cabelo clássico",
      duration: 30,
      price: 35,
      status: "active",
      bookings: 156,
    },
    {
      id: 2,
      name: "Beard Trim",
      description: "Aparagem e modelagem de barba",
      duration: 20,
      price: 25,
      status: "active",
      bookings: 98,
    },
    {
      id: 3,
      name: "Haircut & Beard Trim",
      description: "Corte completo com barba",
      duration: 45,
      price: 50,
      status: "active",
      bookings: 142,
    },
    {
      id: 4,
      name: "Shave",
      description: "Barbear tradicional",
      duration: 25,
      price: 30,
      status: "active",
      bookings: 67,
    },
    {
      id: 5,
      name: "Hair Color",
      description: "Coloração de cabelo",
      duration: 60,
      price: 75,
      status: "active",
      bookings: 45,
    },
    {
      id: 6,
      name: "Hot Towel Shave",
      description: "Barbear com toalha quente",
      duration: 40,
      price: 45,
      status: "inactive",
      bookings: 12,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Serviços</h1>
            <p className="text-slate-600 mt-1">Gerencie todos os serviços oferecidos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Deletar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    ${service.price}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <Badge
                    variant={service.status === "active" ? "default" : "secondary"}
                    className={
                      service.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {service.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                  <span className="text-xs text-slate-600">{service.bookings} agendamentos</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Services Table */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Resumo Completo</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700">Serviço</TableHead>
                <TableHead className="text-slate-700">Descrição</TableHead>
                <TableHead className="text-slate-700">Duração</TableHead>
                <TableHead className="text-slate-700">Preço</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-slate-700">Agendamentos</TableHead>
                <TableHead className="text-right text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{service.name}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{service.description}</TableCell>
                  <TableCell className="text-slate-600">{service.duration} min</TableCell>
                  <TableCell className="font-semibold text-slate-900">${service.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={service.status === "active" ? "default" : "secondary"}
                      className={
                        service.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                      }
                    >
                      {service.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{service.bookings}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
