import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DollarSign, Bell, Lock, User, Building } from "lucide-react";

export default function Configuracoes() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-600 mt-1">Gerencie as configurações da sua barbearia</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="barbershop" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="barbershop">Barbearia</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>

          {/* Barbershop Settings */}
          <TabsContent value="barbershop" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações da Barbearia
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700">Nome da Barbearia</Label>
                    <Input
                      defaultValue="CorteCerto Barbershop"
                      className="mt-2 bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Email</Label>
                    <Input
                      type="email"
                      defaultValue="contato@cortecerto.com"
                      className="mt-2 bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700">Telefone</Label>
                    <Input
                      defaultValue="(11) 9999-9999"
                      className="mt-2 bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Endereço</Label>
                    <Input
                      defaultValue="Rua Principal, 123"
                      className="mt-2 bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700">Descrição</Label>
                  <textarea
                    defaultValue="Barbearia moderna com profissionais experientes"
                    className="w-full mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Salvar Alterações</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Horários */}
          <TabsContent value="horarios" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário de Funcionamento
              </h3>

              <div className="space-y-4">
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(
                  (day, idx) => (
                    <div key={day} className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0">
                      <div className="w-24 font-medium text-slate-700">{day}</div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue={idx === 6 ? "" : "09:00"}
                          disabled={idx === 6}
                          className="w-24 bg-slate-50 border-slate-200"
                        />
                        <span className="text-slate-400">até</span>
                        <Input
                          type="time"
                          defaultValue={idx === 6 ? "" : "18:00"}
                          disabled={idx === 6}
                          className="w-24 bg-slate-50 border-slate-200"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={idx !== 6} />
                        <span className="text-sm text-slate-600">{idx === 6 ? "Fechado" : "Aberto"}</span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Horários</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferências de Notificação
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Novos Agendamentos</p>
                    <p className="text-sm text-slate-600">Receba notificações quando novos agendamentos forem feitos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Cancelamentos</p>
                    <p className="text-sm text-slate-600">Receba notificações de cancelamentos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Lembretes de Agendamentos</p>
                    <p className="text-sm text-slate-600">Receba lembretes antes dos agendamentos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Relatórios Semanais</p>
                    <p className="text-sm text-slate-600">Receba relatórios de desempenho semanalmente</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Segurança e Privacidade
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Alterar Senha</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-700">Senha Atual</Label>
                      <Input
                        type="password"
                        className="mt-2 bg-slate-50 border-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Nova Senha</Label>
                      <Input
                        type="password"
                        className="mt-2 bg-slate-50 border-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Confirmar Nova Senha</Label>
                      <Input
                        type="password"
                        className="mt-2 bg-slate-50 border-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Atualizar Senha</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4">Autenticação de Dois Fatores</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Ativar 2FA</p>
                      <p className="text-sm text-slate-600">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4 text-red-600">Zona de Perigo</h4>
                  <Button variant="destructive">Deletar Conta</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
