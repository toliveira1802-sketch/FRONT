import { NavLink } from 'react-router-dom'
import { Home, Calendar, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/agenda', icon: Calendar, label: 'Agenda' },
    { to: '/avisos', icon: Bell, label: 'Avisos' },
    { to: '/profile', icon: User, label: 'Perfil' },
]

export function BottomNavigation() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
            <div className="flex h-16 items-center justify-around">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}
