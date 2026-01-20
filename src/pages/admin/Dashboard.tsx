import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockAppointments, mockServiceOrders, mockPatioVehicles, mockUsers, getVehicleById } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import {
    LayoutDashboard,
    ClipboardList,
    Car,
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
} from 'lucide-react'

export default function AdminDashboard() {
    // Stats
    const todayAppointments = mockAppointments.filter(
        (a) => a.scheduled_date === new Date().toISOString().split('T')[0]
    )
    const pendingOrders = mockServiceOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled')
    const vehiclesInPatio = mockPatioVehicles.filter((p) => p.status !== 'delivered')
    const totalRevenue = mockServiceOrders
        .filter((o) => o.status === 'completed')
        .reduce((acc, o) => acc + o.total, 0)

    const stats = [
        {
            title: 'Agendamentos Hoje',
            value: todayAppointments.length,
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'OS Abertas',
            value: pendingOrders.length,
            icon: ClipboardList,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        },
        {
            title: 'Veículos no Pátio',
            value: vehiclesInPatio.length,
            icon: Car,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        },
        {
            title: 'Faturamento Mês',
            value: formatCurrency(totalRevenue),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" />
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">Visão geral da oficina</p>
                </div>
                <Button asChild>
                    <Link to="/admin/nova-os">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova OS
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Link to="/admin/nova-os">
                        <ClipboardList className="h-6 w-6" />
                        <span>Nova OS</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Link to="/admin/patio">
                        <Car className="h-6 w-6" />
                        <span>Ver Pátio</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Link to="/admin/agendamentos">
                        <Calendar className="h-6 w-6" />
                        <span>Agendamentos</span>
                    </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Link to="/admin/clientes">
                        <Users className="h-6 w-6" />
                        <span>Clientes</span>
                    </Link>
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Service Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Ordens de Serviço Recentes</CardTitle>
                        <Link to="/admin/ordens-servico" className="text-sm text-primary hover:underline">
                            Ver todas
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockServiceOrders.slice(0, 4).map((order) => {
                            const vehicle = getVehicleById(order.vehicle_id)
                            const statusVariant = order.status === 'completed' ? 'success'
                                : order.status === 'cancelled' ? 'destructive'
                                    : order.status === 'waiting_approval' ? 'warning'
                                        : 'secondary'

                            return (
                                <Link
                                    key={order.id}
                                    to={`/admin/ordens-servico/${order.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{order.order_number}</p>
                                            {vehicle && (
                                                <p className="text-xs text-muted-foreground">
                                                    {vehicle.brand} {vehicle.model}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={statusVariant} className="text-xs">
                                            {order.status.replace('_', ' ')}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatCurrency(order.total)}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Patio Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Status do Pátio</CardTitle>
                        <Link to="/admin/patio" className="text-sm text-primary hover:underline">
                            Ver Kanban
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockPatioVehicles.map((patio) => {
                            const vehicle = getVehicleById(patio.vehicle_id)
                            const StatusIcon = patio.status === 'waiting' ? Clock
                                : patio.status === 'in_service' ? AlertCircle
                                    : patio.status === 'ready' ? CheckCircle2
                                        : Car

                            // Corrigido: nome da variável em minúsculo
                            const statusColor = patio.status === 'waiting' ? 'text-yellow-600'
                                : patio.status === 'in_service' ? 'text-blue-600'
                                    : patio.status === 'ready' ? 'text-green-600'
                                        : 'text-gray-600'

                            return (
                                <div
                                    key={patio.id}
                                    className="flex items-center justify-between p-3 rounded-lg border"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Corrigido: Removidas chaves extras e usado o nome correto da variável */}
                                        <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                                        <div>
                                            {vehicle && (
                                                <p className="font-medium text-sm">
                                                    {vehicle.brand} {vehicle.model}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {patio.status.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                    {patio.bay_number && (
                                        <Badge variant="outline">Box {patio.bay_number}</Badge>
                                    )}
                                </div>
                            )
                        })}
                        {mockPatioVehicles.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                Nenhum veículo no pátio
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}