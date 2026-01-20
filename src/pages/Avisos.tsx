import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, Wrench, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

interface Alert {
    id: string
    type: 'reminder' | 'maintenance' | 'promo' | 'info'
    title: string
    message: string
    date: string
    read: boolean
    actionUrl?: string
    actionLabel?: string
}

const mockAlerts: Alert[] = [
    {
        id: '1',
        type: 'reminder',
        title: 'Lembrete de Agendamento',
        message: 'Seu agendamento de Troca de Óleo é amanhã às 09:00.',
        date: '2026-01-19T10:00:00Z',
        read: false,
        actionUrl: '/agenda',
        actionLabel: 'Ver Agenda',
    },
    {
        id: '2',
        type: 'maintenance',
        title: 'Revisão Programada',
        message: 'Seu Honda Civic está próximo da quilometragem para revisão (40.000 km).',
        date: '2026-01-18T14:00:00Z',
        read: false,
        actionUrl: '/novo-agendamento',
        actionLabel: 'Agendar',
    },
    {
        id: '3',
        type: 'promo',
        title: 'Promoção Especial',
        message: 'Alinhamento + Balanceamento com 20% de desconto! Válido até 31/01.',
        date: '2026-01-15T09:00:00Z',
        read: true,
        actionUrl: '/novo-agendamento?service=s2',
        actionLabel: 'Aproveitar',
    },
    {
        id: '4',
        type: 'info',
        title: 'Serviço Concluído',
        message: 'A troca de pastilhas de freio do seu Toyota Corolla foi concluída.',
        date: '2026-01-14T16:30:00Z',
        read: true,
    },
]

const typeConfig = {
    reminder: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    maintenance: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    promo: { icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    info: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
}

export default function Avisos() {
    const [alerts, setAlerts] = useState(mockAlerts)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const filteredAlerts = filter === 'all' ? alerts : alerts.filter((a) => !a.read)
    const unreadCount = alerts.filter((a) => !a.read).length

    const markAsRead = (id: string) => {
        setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)))
    }

    const markAllAsRead = () => {
        setAlerts(alerts.map((a) => ({ ...a, read: true })))
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Hoje'
        if (diffDays === 1) return 'Ontem'
        if (diffDays < 7) return `${diffDays} dias atrás`
        return date.toLocaleDateString('pt-BR')
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bell className="h-6 w-6" />
                        Avisos
                    </h1>
                    <p className="text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} não lido(s)` : 'Todos lidos'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Marcar todos como lidos
                    </Button>
                )}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Todos
                </Button>
                <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                >
                    Não lidos
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
                {filteredAlerts.map((alert) => {
                    const config = typeConfig[alert.type]
                    const Icon = config.icon

                    return (
                        <Card
                            key={alert.id}
                            className={`transition-colors ${!alert.read ? 'bg-accent/50' : ''}`}
                            onClick={() => markAsRead(alert.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className={`${config.bg} p-2 rounded-lg h-fit`}>
                                        <Icon className={`h-5 w-5 ${config.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-medium">{alert.title}</p>
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {formatDate(alert.date)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {alert.message}
                                        </p>
                                        {alert.actionUrl && (
                                            <Button asChild variant="link" size="sm" className="p-0 h-auto mt-2">
                                                <Link to={alert.actionUrl}>{alert.actionLabel}</Link>
                                            </Button>
                                        )}
                                    </div>
                                    {!alert.read && (
                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {filteredAlerts.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Nenhum aviso encontrado</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
