import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VehicleCard } from '@/components/vehicle/VehicleCard'
import { AppointmentCard } from '@/components/shared/AppointmentCard'
import { getVehiclesByUserId, getAppointmentsByUserId, mockServices, getVehicleById } from '@/lib/mock-data'
import { Calendar, Plus, Car, Clock, Wrench } from 'lucide-react'

export default function Home() {
    const { profile } = useAuth()
    const userId = profile?.id || '2' // Default to mock user 2 for demo

    const vehicles = getVehiclesByUserId(userId)
    const appointments = getAppointmentsByUserId(userId)
    const upcomingAppointments = appointments.filter(
        (a) => a.status === 'pending' || a.status === 'confirmed'
    )

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-doctor-primary to-doctor-secondary rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Olá, {profile?.full_name?.split(' ')[0] || 'Cliente'}! 👋
                </h1>
                <p className="text-white/80">Bem-vindo ao Doctor Auto Prime</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <Link to="/novo-agendamento">
                        <Calendar className="h-6 w-6" />
                        <span>Agendar Serviço</span>
                    </Link>
                </Button>
                <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <Link to="/historico">
                        <Clock className="h-6 w-6" />
                        <span>Histórico</span>
                    </Link>
                </Button>
            </div>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
                        <Link to="/agenda" className="text-sm text-primary hover:underline">
                            Ver todos
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingAppointments.slice(0, 2).map((appointment) => {
                            const vehicle = getVehicleById(appointment.vehicle_id)
                            const service = mockServices.find((s) => s.id === appointment.service_id)

                            return (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    vehicle={vehicle}
                                    service={service}
                                />
                            )
                        })}
                    </CardContent>
                </Card>
            )}

            {/* My Vehicles */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Meus Veículos
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/novo-veiculo">
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {vehicles.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhum veículo cadastrado</p>
                            <Button asChild className="mt-4" variant="outline">
                                <Link to="/novo-veiculo">Adicionar veículo</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {vehicles.map((vehicle) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Services Highlight */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Serviços Populares
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {mockServices.slice(0, 4).map((service) => (
                            <Link
                                key={service.id}
                                to={`/novo-agendamento?service=${service.id}`}
                                className="p-4 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <p className="font-medium text-sm">{service.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    R$ {service.price.toFixed(2)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
