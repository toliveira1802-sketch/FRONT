import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppointmentCard } from '@/components/shared/AppointmentCard'
import { getAppointmentsByUserId, mockAppointments, getVehicleById, getServiceById } from '@/lib/mock-data'
import { Calendar, Plus, Filter } from 'lucide-react'

interface AgendaProps {
    isAdmin?: boolean
}

export default function Agenda({ isAdmin = false }: AgendaProps) {
    const { profile } = useAuth()
    const [filter, setFilter] = useState<string>('all')

    // For admin, show all appointments; for client, show only theirs
    const appointments = isAdmin
        ? mockAppointments
        : getAppointmentsByUserId(profile?.id || '2')

    const filteredAppointments = filter === 'all'
        ? appointments
        : appointments.filter((a) => a.status === filter)

    const statusFilters = [
        { value: 'all', label: 'Todos' },
        { value: 'pending', label: 'Pendentes' },
        { value: 'confirmed', label: 'Confirmados' },
        { value: 'in_progress', label: 'Em andamento' },
        { value: 'completed', label: 'Concluídos' },
    ]

    // Group by date
    const groupedByDate = filteredAppointments.reduce((acc, appointment) => {
        const date = appointment.scheduled_date
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(appointment)
        return acc
    }, {} as Record<string, typeof appointments>)

    const sortedDates = Object.keys(groupedByDate).sort()

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        {isAdmin ? 'Agendamentos' : 'Minha Agenda'}
                    </h1>
                    <p className="text-muted-foreground">
                        {filteredAppointments.length} agendamentos encontrados
                    </p>
                </div>
                <Button asChild>
                    <Link to="/novo-agendamento">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {statusFilters.map((status) => (
                    <Button
                        key={status.value}
                        variant={filter === status.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status.value)}
                        className="shrink-0"
                    >
                        {status.label}
                    </Button>
                ))}
            </div>

            {/* Appointments List */}
            {sortedDates.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link to="/novo-agendamento">Agendar serviço</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {sortedDates.map((date) => {
                        const dateAppointments = groupedByDate[date]
                        const dateObj = new Date(date + 'T12:00:00')
                        const isToday = new Date().toDateString() === dateObj.toDateString()
                        const isTomorrow = new Date(Date.now() + 86400000).toDateString() === dateObj.toDateString()

                        let dateLabel = dateObj.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })
                        if (isToday) dateLabel = `Hoje, ${dateLabel}`
                        if (isTomorrow) dateLabel = `Amanhã, ${dateLabel}`

                        return (
                            <div key={date}>
                                <h2 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                                    {dateLabel}
                                </h2>
                                <div className="space-y-3">
                                    {dateAppointments.map((appointment) => {
                                        const vehicle = getVehicleById(appointment.vehicle_id)
                                        const service = getServiceById(appointment.service_id)

                                        return (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                vehicle={vehicle}
                                                service={service}
                                                isAdmin={isAdmin}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
