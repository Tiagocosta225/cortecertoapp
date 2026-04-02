import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, User, Scissors } from "lucide-react";
import { useState } from "react";

export default function Agenda() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const appointments = [
    {
      id: 1,
      client: "John - Haircut",
      barber: "Jake Thompson",
      time: "10:00",
      duration: 30,
      color: "bg-blue-500",
    },
    {
      id: 2,
      client: "Mike - Beard Trim",
      barber: "Mike Johnson",
      time: "10:30",
      duration: 30,
      color: "bg-green-500",
    },
    {
      id: 3,
      client: "Lisa - Color Treatment",
      barber: "Carlos Silva",
      time: "11:00",
      duration: 60,
      color: "bg-purple-500",
    },
    {
      id: 4,
      client: "Alke - Haircut",
      barber: "Jake Thompson",
      time: "11:30",
      duration: 30,
      color: "bg-blue-500",
    },
    {
      id: 5,
      client: "Emma - Hot Towel Shave",
      barber: "Carlos Silva",
      time: "12:30",
      duration: 45,
      color: "bg-orange-500",
    },
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const monthDays = ["Apr 18", "Apr 19", "Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24"];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agenda</h1>
            <p className="text-slate-600 mt-1">Visualize e gerencie todos os agendamentos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Novo Agendamento</Button>
        </div>

        {/* Calendar and Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Calendar */}
          <Card className="p-6 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Abril 2024</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mini Calendar */}
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                  <div key={day} className="font-semibold text-slate-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }).map((_, i) => (
                  <button
                    key={i}
                    className={`py-2 rounded-lg font-medium transition-colors ${
                      i === 17
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Right: Schedule */}
          <Card className="p-6 lg:col-span-2">
            <div className="space-y-4">
              {/* Week Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {monthDays.map((day, idx) => (
                  <button
                    key={day}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      idx === 0
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {daysOfWeek[idx]} <br /> <span className="text-xs">{day}</span>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {timeSlots.map((time) => {
                  const appointment = appointments.find((a) => a.time === time);
                  return (
                    <div key={time} className="flex gap-3 items-start">
                      <div className="w-16 text-sm font-medium text-slate-600 pt-2">{time}</div>
                      <div className="flex-1">
                        {appointment ? (
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className={`w-full p-3 rounded-lg text-white text-sm font-medium text-left hover:opacity-90 transition-opacity ${appointment?.color}`}
                          >
                            {appointment.client}
                          </button>
                        ) : (
                          <div className="h-10 bg-slate-50 rounded-lg border border-dashed border-slate-200"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Appointment Details */}
        {selectedAppointment && (
          <Card className="p-6 bg-slate-50 border-l-4 border-blue-600">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Detalhes do Agendamento</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Cliente</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.client}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Barbeiro</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.barber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Horário</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Duração</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.duration} min</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Editar</Button>
                <Button variant="destructive">Cancelar</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
