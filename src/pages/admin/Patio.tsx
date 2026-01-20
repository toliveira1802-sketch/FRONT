import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockPatioVehicles, getVehicleById, mockServiceOrders } from '@/lib/mock-data'
import { formatPlate } from '@/lib/utils'
import { Car, Search, Clock, Wrench, CheckCircle2, Truck, GripVertical } from 'lucide-react'
import type { PatioStatus } from '@/types/database'

const columns: { status: PatioStatus; title: string; icon: React.ElementType; color: string }[] = [
    { status: 'waiting', title: 'Aguardando', icon: Clock, color: 'bg-yellow-500' },
    { status: 'in_service', title: 'Em Serviço', icon: Wrench, color: 'bg-blue-500' },
    { status: 'ready', title: 'Pronto', icon: CheckCircle2, color: 'bg-green-500' },
    { status: 'delivered', title: 'Entregue', icon: Truck, color: 'bg-gray-400' },
]

export default function Patio() {
    const [search, setSearch] = useState('')

    const filteredVehicles = mockPatioVehicles.filter((patio) => {
        const vehicle = getVehicleById(patio.vehicle_id)
        if (!vehicle) return false
        const searchLower = search.toLowerCase()
        return (
            vehicle.brand.toLowerCase().includes(searchLower) ||
            vehicle.model.toLowerCase().includes(searchLower) ||
            vehicle.plate.toLowerCase().includes(searchLower)
        )
    })

    const getVehiclesByStatus = (status: PatioStatus) =>
        filteredVehicles.filter((p) => p.status === status)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Car className="h-6 w-6" />
                        Pátio
                    </h1>
                    <p className="text-muted-foreground">
                        {filteredVehicles.length} veículos no pátio
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar veículo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => {
                    const columnVehicles = getVehiclesByStatus(column.status)

                    return (
                        <div key={column.status} className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                <h3 className="font-medium">{column.title}</h3>
                                <Badge variant="secondary" className="ml-auto">
                                    {columnVehicles.length}
                                </Badge>
                            </div>

                            <div className="flex-1 space-y-3 min-h-[200px] p-3 bg-muted/50 rounded-lg">
                                {columnVehicles.map((patio) => {
                                    const vehicle = getVehicleById(patio.vehicle_id)
                                    const order = patio.order_id
                                        ? mockServiceOrders.find((o) => o.id === patio.order_id)
                                        : null

                                    if (!vehicle) return null

                                    return (
                                        <Card
                                            key={patio.id}
                                            className="cursor-pointer hover:shadow-md transition-shadow"
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-start gap-2">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {vehicle.brand} {vehicle.model}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {formatPlate(vehicle.plate)}
                                                            </Badge>
                                                            {patio.bay_number && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Box {patio.bay_number}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {order && (
                                                            <Link
                                                                to={`/admin/ordens-servico/${order.id}`}
                                                                className="text-xs text-primary hover:underline mt-1 block"
                                                            >
                                                                {order.order_number}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}

                                {columnVehicles.length === 0 && (
                                    <p className="text-xs text-center text-muted-foreground py-8">
                                        Nenhum veículo
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
