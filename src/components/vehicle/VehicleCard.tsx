import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPlate } from '@/lib/utils'
import { Car, ChevronRight } from 'lucide-react'
import type { Vehicle } from '@/types/database'

interface VehicleCardProps {
    vehicle: Vehicle
    showLink?: boolean
}

export function VehicleCard({ vehicle, showLink = true }: VehicleCardProps) {
    const content = (
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Car className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                        {vehicle.brand} {vehicle.model}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                            {formatPlate(vehicle.plate)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{vehicle.year}</span>
                        {vehicle.color && (
                            <span className="text-xs text-muted-foreground">• {vehicle.color}</span>
                        )}
                    </div>
                    {vehicle.mileage && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {vehicle.mileage.toLocaleString('pt-BR')} km
                        </p>
                    )}
                </div>
                {showLink && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
            </CardContent>
        </Card>
    )

    if (showLink) {
        return (
            <Link to={`/veiculo/${vehicle.id}`}>
                {content}
            </Link>
        )
    }

    return content
}
