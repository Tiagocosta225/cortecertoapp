import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      trend: "+2 vs ontem",
    },
    {
      title: "Faturamento",
      value: "$850",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      trend: "+15% vs semana",
    },
    {
      title: "Novos Clientes",
      value: "4",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      trend: "+1 vs semana",
    },
    {
      title: "Taxa de Ocupação",
      value: "85%",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      trend: "Excelente",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      client: "John Carter",
      service: "Haircut & Beard Trim",
      time: "10:00 AM",
      barber: "Jake Thompson",
      status: "confirmed",
    },
    {
      id: 2,
      client: "Michael Smith",
      service: "Haircut",
      time: "10:30 AM",
      barber: "Mike Johnson",
      status: "confirmed",
    },
    {
      id: 3,
      client: "Alex Johnson",
      service: "Shave",
      time: "11:00 AM",
      barber: "Jake Thompson",
      status: "pending",
    },
    {
      id: 4,
      client: "David Lee",
      service: "Hair Color",
      time: "11:30 AM",
      barber: "Carlos Silva",
      status: "confirmed",
    },
    {
      id: 5,
      client: "Ryan Harris",
      service: "Buzz Cut",
      time: "12:00 PM",
      barber: "Mike Johnson",
      status: "confirmed",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Bem-vindo ao painel administrativo da CorteCerto</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-2">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Upcoming Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Próximos Agendamentos</h2>
              <p className="text-sm text-slate-600 mt-1">Agendamentos de hoje</p>
            </div>
            <Button variant="outline">Ver Agenda Completa</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700">Cliente</TableHead>
                <TableHead className="text-slate-700">Serviço</TableHead>
                <TableHead className="text-slate-700">Horário</TableHead>
                <TableHead className="text-slate-700">Barbeiro</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-right text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{appointment.client}</TableCell>
                  <TableCell className="text-slate-600">{appointment.service}</TableCell>
                  <TableCell className="text-slate-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {appointment.time}
                  </TableCell>
                  <TableCell className="text-slate-600">{appointment.barber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={appointment.status === "confirmed" ? "default" : "secondary"}
                      className={
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                      }
                    >
                      {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Detalhes
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
