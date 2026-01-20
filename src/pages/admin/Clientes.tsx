import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockUsers, getVehiclesByUserId, getAppointmentsByUserId } from '@/lib/mock-data'
import { formatPhone, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Search, Plus, Car, Calendar, ChevronRight } from 'lucide-react'

export default function Clientes() {
    const [search, setSearch] = useState('')

    const clients = mockUsers.filter((u) => u.role === 'user')

    const filteredClients = clients.filter((client) => {
        const searchLower = search.toLowerCase()
        return (
            client.full_name?.toLowerCase().includes(searchLower) ||
            client.email?.toLowerCase().includes(searchLower) ||
            client.phone?.includes(search)
        )
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Clientes
                    </h1>
                    <p className="text-muted-foreground">
                        {filteredClients.length} clientes cadastrados
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Clients List */}
            <div className="space-y-3">
                {filteredClients.map((client) => {
                    const vehicles = getVehiclesByUserId(client.id)
                    const appointments = getAppointmentsByUserId(client.id)

                    return (
                        <Card key={client.id} className="hover:bg-accent/50 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={client.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {getInitials(client.full_name || 'C')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{client.full_name}</p>
                                        <p className="text-sm text-muted-foreground">{client.email}</p>
                                        {client.phone && (
                                            <p className="text-sm text-muted-foreground">
                                                {formatPhone(client.phone)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Car className="h-4 w-4" />
                                            {vehicles.length}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {appointments.length}
                                        </span>
                                    </div>

                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {filteredClients.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
