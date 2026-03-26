import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Scissors, 
  User, 
  MapPin,
  Phone,
  Share,
  CalendarPlus,
  Home,
  MessageCircle
} from 'lucide-react'

export default function ConfirmationScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state?.booking

  // Dados da barbearia
  const barbershopInfo = {
    name: 'Barbearia Central',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 3333-4444',
    coordinates: { lat: -23.5505, lng: -46.6333 }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleAddToCalendar = () => {
    // Simula adicionar ao calendário
    alert('Agendamento adicionado ao calendário!')
  }

  const handleShare = () => {
    // Simula compartilhamento
    if (navigator.share) {
      navigator.share({
        title: 'Meu Agendamento - CorteCerto',
        text: `Agendei um ${booking?.service} para ${formatDate(booking?.date)} às ${booking?.time}`,
        url: window.location.href
      })
    } else {
      alert('Agendamento copiado para compartilhar!')
    }
  }

  const handleCallBarbershop = () => {
    window.open(`tel:${barbershopInfo.phone}`)
  }

  const handleOpenMaps = () => {
    const { lat, lng } = barbershopInfo.coordinates
    window.open(`https://maps.google.com/?q=${lat},${lng}`)
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Agendamento não encontrado</h2>
            <Button onClick={() => navigate('/home')}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header de Sucesso */}
      <div className="bg-green-500 text-white p-6">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Agendamento Confirmado!</h1>
            <p className="text-white/90">Seu horário foi reservado com sucesso</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Detalhes do Agendamento */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Calendar className="h-5 w-5" />
              Detalhes do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Serviço</p>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-primary" />
                  <span className="font-medium">{booking.service}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Barbeiro</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{booking.barber}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data e Horário</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {formatDate(booking.date)} às {booking.time}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Total:</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {booking.price}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Barbearia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {barbershopInfo.name}
            </CardTitle>
            <CardDescription>{barbershopInfo.address}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCallBarbershop}
              >
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleOpenMaps}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Localização
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-16 flex-col"
            onClick={handleAddToCalendar}
          >
            <CalendarPlus className="h-6 w-6 mb-1" />
            <span className="text-xs">Adicionar ao Calendário</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col"
            onClick={handleShare}
          >
            <Share className="h-6 w-6 mb-1" />
            <span className="text-xs">Compartilhar</span>
          </Button>
        </div>

        {/* Informações Importantes */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Informações Importantes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Chegue 10 minutos antes do horário agendado</li>
              <li>• Em caso de atraso, entre em contato conosco</li>
              <li>• Cancelamentos devem ser feitos com 2h de antecedência</li>
              <li>• Você receberá uma notificação 1h antes do agendamento</li>
            </ul>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button 
            className="w-full h-12"
            onClick={() => navigate('/booking')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Fazer Novo Agendamento
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12"
            onClick={() => navigate('/home')}
          >
            <Home className="h-5 w-5 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        {/* Suporte */}
        <Card className="border-muted">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Precisa de ajuda ou quer alterar seu agendamento?
            </p>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar com Suporte
            </Button>
          </CardContent>
        </Card>

        {/* Espaço extra para scroll */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}

