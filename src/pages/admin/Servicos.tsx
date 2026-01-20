import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockServices } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Wrench, Search, Plus, Edit, Clock } from 'lucide-react'

export default function Servicos() {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const categories = [...new Set(mockServices.map((s) => s.category))]

    const filteredServices = mockServices.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(search.toLowerCase()) ||
            service.description?.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Wrench className="h-6 w-6" />
                        Catálogo de Serviços
                    </h1>
                    <p className="text-muted-foreground">
                        {filteredServices.length} serviço(s) cadastrado(s)
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Serviço
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar serviço..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Button
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter('all')}
                >
                    Todos
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={categoryFilter === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter(category)}
                        className="shrink-0"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                        {service.category}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {service.duration_minutes} min
                                </div>
                                <p className="text-xl font-bold text-primary">
                                    {formatCurrency(service.price)}
                                </p>
                            </div>
                            <div className="mt-2">
                                <Badge variant={service.is_active ? 'success' : 'secondary'}>
                                    {service.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground">Nenhum serviço encontrado</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
