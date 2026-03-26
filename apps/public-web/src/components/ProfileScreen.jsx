import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Calendar, 
  Clock, 
  Scissors, 
  Star,
  Settings,
  Bell,
  Shield,
  LogOut,
  History,
  Home,
  UserCircle
} from 'lucide-react'

export default function ProfileScreen({ user }) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user || {})

  // Dados simulados de histórico
  const bookingHistory = [
    {
      id: 1,
      service: 'Corte + Barba',
      barber: 'Carlos Silva',
      date: '2025-08-15',
      time: '14:30',
      price: 'R$ 45,00',
      status: 'concluído',
      rating: 5
    },
    {
      id: 2,
      service: 'Corte Simples',
      barber: 'João Santos',
      date: '2025-08-10',
      time: '16:00',
      price: 'R$ 25,00',
      status: 'concluído',
      rating: 4
    },
    {
      id: 3,
      service: 'Barba',
      barber: 'Pedro Costa',
      date: '2025-08-05',
      time: '15:30',
      price: 'R$ 20,00',
      status: 'concluído',
      rating: 5
    }
  ]

  const handleSaveProfile = () => {
    // Aqui salvaria as alterações
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const totalSpent = bookingHistory.reduce((total, booking) => {
    return total + parseFloat(booking.price.replace('R$ ', '').replace(',', '.'))
  }, 0)

  const averageRating = bookingHistory.reduce((sum, booking) => sum + booking.rating, 0) / bookingHistory.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Meu Perfil</h1>
            <p className="text-primary-foreground/80">Gerencie sua conta</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Informações do Usuário */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={editedUser.name || ''}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editedUser.phone || ''}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} className="flex-1">
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.name || 'Nome não informado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email || 'E-mail não informado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.phone || 'Telefone não informado'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{bookingHistory.length}</div>
              <div className="text-sm text-muted-foreground">Agendamentos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">R$ {totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Gasto</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para Histórico e Configurações */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico de Agendamentos
              </h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {bookingHistory.map((booking) => (
                <Card key={booking.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-primary" />
                          <span className="font-medium">{booking.service}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{booking.barber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.date)} às {booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${
                                star <= booking.rating 
                                  ? 'fill-yellow-500 text-yellow-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant="secondary">{booking.status}</Badge>
                        <p className="font-semibold text-primary">{booking.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Configurações
            </h3>
            
            <div className="space-y-3">
              <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium">Notificações</h4>
                      <p className="text-sm text-muted-foreground">Gerencie suas notificações</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium">Privacidade</h4>
                      <p className="text-sm text-muted-foreground">Configurações de privacidade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-destructive/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 text-destructive" />
                    <div className="flex-1">
                      <h4 className="font-medium text-destructive">Sair da Conta</h4>
                      <p className="text-sm text-muted-foreground">Desconectar do aplicativo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex justify-around py-2">
          <Button 
            variant="ghost" 
            className="flex-col h-16"
            onClick={() => navigate('/home')}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Início</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-16"
            onClick={() => navigate('/booking')}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Agendar</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-16 text-primary"
            onClick={() => navigate('/profile')}
          >
            <UserCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </Button>
        </div>
      </div>

      {/* Espaço para a navegação inferior */}
      <div className="h-20"></div>
    </div>
  )
}

