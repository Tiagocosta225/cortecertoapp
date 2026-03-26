import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Scissors, 
  User, 
  Star,
  CheckCircle,
  MapPin
} from 'lucide-react'

export default function BookingScreen({ setBookings }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedBarber, setSelectedBarber] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Dados simulados
  const services = [
    { 
      id: 'corte-simples', 
      name: 'Corte Simples', 
      price: 25, 
      duration: 30,
      description: 'Corte tradicional com máquina e tesoura'
    },
    { 
      id: 'corte-barba', 
      name: 'Corte + Barba', 
      price: 45, 
      duration: 45,
      description: 'Corte completo com aparação de barba'
    },
    { 
      id: 'barba', 
      name: 'Barba', 
      price: 20, 
      duration: 20,
      description: 'Aparação e finalização da barba'
    },
    { 
      id: 'sobrancelha', 
      name: 'Sobrancelha', 
      price: 15, 
      duration: 15,
      description: 'Aparação e design de sobrancelhas'
    }
  ]

  const barbers = [
    { 
      id: 'carlos', 
      name: 'Carlos Silva', 
      rating: 4.9, 
      experience: '8 anos',
      specialty: 'Cortes modernos'
    },
    { 
      id: 'joao', 
      name: 'João Santos', 
      rating: 4.7, 
      experience: '5 anos',
      specialty: 'Barbas e bigodes'
    },
    { 
      id: 'pedro', 
      name: 'Pedro Costa', 
      rating: 4.8, 
      experience: '6 anos',
      specialty: 'Cortes clássicos'
    }
  ]

  const availableDates = [
    { date: '2025-08-20', day: 'Ter', dayNum: '20' },
    { date: '2025-08-21', day: 'Qua', dayNum: '21' },
    { date: '2025-08-22', day: 'Qui', dayNum: '22' },
    { date: '2025-08-23', day: 'Sex', dayNum: '23' },
    { date: '2025-08-24', day: 'Sáb', dayNum: '24' }
  ]

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  const getSelectedService = () => services.find(s => s.id === selectedService)
  const getSelectedBarber = () => barbers.find(b => b.id === selectedBarber)

  const handleConfirmBooking = () => {
    const booking = {
      id: Date.now(),
      service: getSelectedService()?.name,
      barber: getSelectedBarber()?.name,
      date: selectedDate,
      time: selectedTime,
      price: `R$ ${getSelectedService()?.price},00`,
      status: 'confirmado'
    }
    
    setBookings(prev => [...prev, booking])
    navigate('/confirmation', { state: { booking } })
  }

  const canProceed = () => {
    switch(step) {
      case 1: return selectedService
      case 2: return selectedBarber
      case 3: return selectedDate
      case 4: return selectedTime
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/home')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Novo Agendamento</h1>
            <p className="text-primary-foreground/80">Passo {step} de 4</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                num <= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {num < step ? <CheckCircle className="h-4 w-4" /> : num}
              </div>
              {num < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  num < step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Selecionar Serviço */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              Escolha o Serviço
            </h2>
            
            <RadioGroup value={selectedService} onValueChange={setSelectedService}>
              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id}>
                    <RadioGroupItem 
                      value={service.id} 
                      id={service.id}
                      className="peer sr-only"
                    />
                    <Label 
                      htmlFor={service.id}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-medium">{service.name}</h3>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                              <Badge variant="secondary">{service.duration} min</Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">R$ {service.price},00</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Selecionar Barbeiro */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Escolha o Barbeiro
            </h2>
            
            <RadioGroup value={selectedBarber} onValueChange={setSelectedBarber}>
              <div className="space-y-3">
                {barbers.map((barber) => (
                  <div key={barber.id}>
                    <RadioGroupItem 
                      value={barber.id} 
                      id={barber.id}
                      className="peer sr-only"
                    />
                    <Label 
                      htmlFor={barber.id}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{barber.name}</h3>
                              <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <span className="text-xs">{barber.rating}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">{barber.experience}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Selecionar Data */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Escolha a Data
            </h2>
            
            <div className="grid grid-cols-5 gap-2">
              {availableDates.map((dateObj) => (
                <Button
                  key={dateObj.date}
                  variant={selectedDate === dateObj.date ? "default" : "outline"}
                  className="h-16 flex-col"
                  onClick={() => setSelectedDate(dateObj.date)}
                >
                  <span className="text-xs">{dateObj.day}</span>
                  <span className="text-lg font-bold">{dateObj.dayNum}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Selecionar Horário */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Escolha o Horário
            </h2>
            
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>

            {/* Resumo do Agendamento */}
            {selectedTime && (
              <Card className="border-primary/20 bg-primary/5 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Serviço:</span>
                    <span className="font-medium">{getSelectedService()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Barbeiro:</span>
                    <span className="font-medium">{getSelectedBarber()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horário:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-primary">R$ {getSelectedService()?.price},00</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="max-w-md mx-auto">
            {step < 4 ? (
              <Button 
                className="w-full" 
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
              >
                Continuar
              </Button>
            ) : (
              <Button 
                className="w-full" 
                disabled={!canProceed()}
                onClick={handleConfirmBooking}
              >
                Confirmar Agendamento
              </Button>
            )}
          </div>
        </div>

        {/* Espaço para os botões fixos */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}

