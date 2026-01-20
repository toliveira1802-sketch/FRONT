import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getVehiclesByUserId, mockServices } from '@/lib/mock-data'
import { formatPlate, formatCurrency } from '@/lib/utils'
import { Calendar, ArrowLeft, Car, Wrench, Clock, Check, ChevronRight } from 'lucide-react'

type Step = 'vehicle' | 'service' | 'datetime' | 'confirm'

export default function NovoAgendamento() {
    const navigate = useNavigate()
    const { profile } = useAuth()
    const [searchParams] = useSearchParams()
    const preselectedServiceId = searchParams.get('service')

    const userId = profile?.id || '2'
    const vehicles = getVehiclesByUserId(userId)

    const [step, setStep] = useState<Step>(vehicles.length === 1 ? 'service' : 'vehicle')
    const [selectedVehicle, setSelectedVehicle] = useState(vehicles.length === 1 ? vehicles[0] : null)
    const [selectedService, setSelectedService] = useState(
        preselectedServiceId ? mockServices.find((s) => s.id === preselectedServiceId) || null : null
    )
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [notes, setNotes] = useState('')

    // Generate available dates (next 14 days, excluding weekends)
    const availableDates: string[] = []
    for (let i = 1; i <= 14; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            availableDates.push(date.toISOString().split('T')[0])
        }
    }

    const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

    const handleConfirm = () => {
        // In real app, would create appointment in database
        alert('Agendamento realizado com sucesso! (Demo)')
        navigate('/agendamento-sucesso')
    }

    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00')
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Novo Agendamento
                    </h1>
                    <p className="text-muted-foreground">
                        Passo {step === 'vehicle' ? 1 : step === 'service' ? 2 : step === 'datetime' ? 3 : 4} de 4
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
                {['vehicle', 'service', 'datetime', 'confirm'].map((s, i) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step === s
                                    ? 'bg-primary text-primary-foreground'
                                    : ['vehicle', 'service', 'datetime', 'confirm'].indexOf(step) > i
                                        ? 'bg-green-500 text-white'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {['vehicle', 'service', 'datetime', 'confirm'].indexOf(step) > i ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                i + 1
                            )}
                        </div>
                        {i < 3 && <div className="flex-1 h-1 bg-muted rounded" />}
                    </div>
                ))}
            </div>

            {/* Step: Select Vehicle */}
            {step === 'vehicle' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5" />
                            Selecione o Veículo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                onClick={() => {
                                    setSelectedVehicle(vehicle)
                                    setStep('service')
                                }}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent flex items-center justify-between ${selectedVehicle?.id === vehicle.id ? 'border-primary bg-primary/5' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                        <Car className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                                        <Badge variant="outline">{formatPlate(vehicle.plate)}</Badge>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Step: Select Service */}
            {step === 'service' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Selecione o Serviço
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockServices.filter((s) => s.is_active).map((service) => (
                            <div
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service)
                                    setStep('datetime')
                                }}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${selectedService?.id === service.id ? 'border-primary bg-primary/5' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{service.category}</Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {service.duration_minutes} min
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatCurrency(service.price)}</p>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" onClick={() => setStep('vehicle')} className="w-full">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step: Select Date/Time */}
            {step === 'datetime' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Data e Horário
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="mb-2 block">Selecione a data</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                {availableDates.map((date) => (
                                    <Button
                                        key={date}
                                        variant={selectedDate === date ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedDate(date)}
                                        className="justify-start text-left h-auto py-2"
                                    >
                                        <span className="capitalize text-xs">
                                            {formatDisplayDate(date)}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {selectedDate && (
                            <div>
                                <Label className="mb-2 block">Selecione o horário</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {availableTimes.map((time) => (
                                        <Button
                                            key={time}
                                            variant={selectedTime === time ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep('service')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => setStep('confirm')}
                                disabled={!selectedDate || !selectedTime}
                            >
                                Continuar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step: Confirm */}
            {step === 'confirm' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            Confirmar Agendamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Veículo</p>
                                <p className="font-medium">
                                    {selectedVehicle?.brand} {selectedVehicle?.model} - {formatPlate(selectedVehicle?.plate || '')}
                                </p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Serviço</p>
                                <p className="font-medium">{selectedService?.name}</p>
                                <p className="text-sm text-primary font-bold">{formatCurrency(selectedService?.price || 0)}</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Data e Horário</p>
                                <p className="font-medium capitalize">
                                    {formatDisplayDate(selectedDate)} às {selectedTime}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Observações (opcional)</Label>
                            <Input
                                id="notes"
                                placeholder="Alguma informação adicional..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep('datetime')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Button>
                            <Button className="flex-1" onClick={handleConfirm}>
                                <Check className="h-4 w-4 mr-2" />
                                Confirmar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
