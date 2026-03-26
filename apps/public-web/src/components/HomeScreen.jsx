import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Scissors, 
  User, 
  Plus, 
  Home, 
  UserCircle,
  MapPin,
  Star
} from 'lucide-react'

export default function HomeScreen({ user }) {
  const navigate = useNavigate()

  // Dados simulados de agendamentos
  const upcomingBookings = [
    {
      id: 1,
      service: 'Corte + Barba',
      barber: 'Carlos Silva',
      date: '2025-08-20',
      time: '14:30',
      price: 'R$ 45,00',
      status: 'confirmado'
    },
    {
      id: 2,
      service: 'Corte Simples',
      barber: 'João Santos',
      date: '2025-08-25',
      time: '16:00',
      price: 'R$ 25,00',
      status: 'pendente'
    }
  ]

  // Dados simulados de serviços
  const services = [
    { name: 'Corte Simples', price: 'R$ 25,00', duration: '30 min' },
    { name: 'Corte + Barba', price: 'R$ 45,00', duration: '45 min' },
    { name: 'Barba', price: 'R$ 20,00', duration: '20 min' },
    { name: 'Sobrancelha', price: 'R$ 15,00', duration: '15 min' }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Olá, {user?.name || 'Cliente'}!</h1>
              <p className="text-primary-foreground/80">Bem-vindo de volta</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Barbearia Central</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Botão de Novo Agendamento */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <Button 
              onClick={() => navigate('/booking')} 
              className="w-full h-16 text-lg"
              size="lg"
            >
              <Plus className="mr-2 h-6 w-6" />
              Novo Agendamento
            </Button>
          </CardContent>
        </Card>

        {/* Próximos Agendamentos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próximos Agendamentos
          </h2>
          
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
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
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(booking.date)} às {booking.time}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge 
                          variant={booking.status === 'confirmado' ? 'default' : 'secondary'}
                        >
                          {booking.status}
                        </Badge>
                        <p className="font-semibold text-primary">{booking.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/booking')}
                >
                  Fazer Primeiro Agendamento
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Serviços Disponíveis */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            Nossos Serviços
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {services.map((service, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-sm mb-2">{service.name}</h3>
                  <p className="text-primary font-semibold">{service.price}</p>
                  <p className="text-xs text-muted-foreground">{service.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Avaliação da Barbearia */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Barbearia Central
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-2 text-sm">4.8 (127 avaliações)</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              "Excelente atendimento e profissionais qualificados. Sempre saio satisfeito!"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex justify-around py-2">
          <Button 
            variant="ghost" 
            className="flex-col h-16 text-primary"
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
            className="flex-col h-16"
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

