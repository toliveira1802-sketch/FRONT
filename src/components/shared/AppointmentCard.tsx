import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatPlate } from '@/lib/utils'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import type { Appointment, Vehicle, Service } from '@/types/database'

interface AppointmentCardProps {
    appointment: Appointment
    vehicle?: Vehicle
    service?: Service
    showLink?: boolean
    isAdmin?: boolean
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
    pending: { label: 'Pendente', variant: 'warning' },
    confirmed: { label: 'Confirmado', variant: 'default' },
    in_progress: { label: 'Em andamento', variant: 'secondary' },
    completed: { label: 'Concluído', variant: 'success' },
    cancelled: { label: 'Cancelado', variant: 'destructive' },
}

export function AppointmentCard({ appointment, vehicle, service, showLink = true, isAdmin = false }: AppointmentCardProps) {
    const statusInfo = statusLabels[appointment.status] || statusLabels.pending

    const content = (
        <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={statusInfo.variant}>
                                {statusInfo.label}
                            </Badge>
                        </div>
                        <p className="font-medium">
                            {service?.name || 'Serviço'}
                        </p>
                        {vehicle && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {vehicle.brand} {vehicle.model} • {formatPlate(vehicle.plate)}
                            </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(appointment.scheduled_date)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {appointment.scheduled_time}
                            </span>
                        </div>
                        {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                                "{appointment.notes}"
                            </p>
                        )}
                    </div>
                    {showLink && (
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                </div>
            </CardContent>
        </Card>
    )

    if (showLink) {
        const linkTo = isAdmin
            ? `/admin/agendamentos/${appointment.id}`
            : `/servico/${appointment.vehicle_id}`
        return <Link to={linkTo}>{content}</Link>
    }

    return content
}
