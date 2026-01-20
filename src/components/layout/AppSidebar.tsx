import { NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    ClipboardList,
    Car,
    Calendar,
    Users,
    Wrench,
    DollarSign,
    BarChart3,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// --- INTERFACES & TIPOS ---

interface MenuItem {
    to: string
    icon: LucideIcon
    label: string
    end?: boolean // Resolve o erro de acesso à propriedade 'end'
    gestaoOnly?: boolean // Resolve o erro de acesso à propriedade 'gestaoOnly'
}

interface MenuSection {
    title: string
    items: MenuItem[]
}

interface AppSidebarProps {
    isOpen: boolean
    onToggle: () => void
}

// --- DADOS DO MENU ---
const menuSections: MenuSection[] = [
    {
        title: 'Operacional',
        items: [
            { to: '/gestao', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { to: '/gestao/ordens-servico', icon: ClipboardList, label: 'Ordens de Serviço' },
            { to: '/gestao/patio', icon: Car, label: 'Pátio' },
            { to: '/gestao/agendamentos', icon: Calendar, label: 'Agendamentos' },
        ],
    },
    {
        title: 'Cadastros',
        items: [
            { to: '/gestao/clientes', icon: Users, label: 'Clientes' },
            { to: '/gestao/servicos', icon: Wrench, label: 'Serviços' },
        ],
    },
    {
        title: 'Financeiro',
        items: [
            { to: '/gestao/financeiro', icon: DollarSign, label: 'Financeiro', gestaoOnly: true },
        ],
    },
    {
        title: 'Equipe',
        items: [
            { to: '/gestao/analytics-mecanicos', icon: BarChart3, label: 'Analytics', gestaoOnly: true },
            { to: '/gestao/feedback-mecanicos', icon: MessageSquare, label: 'Feedback', gestaoOnly: true },
        ],
    },
    {
        title: 'Sistema',
        items: [
            { to: '/gestao/configuracoes', icon: Settings, label: 'Configurações' },
        ],
    },
]

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
    const { role } = useAuth()
    
    // Verifica se é gestão ou dev (permissões elevadas)
    const isGestao = role === 'gestao' || role === 'dev'

    return (
        <>
            {/* Overlay para Mobile (fundo escuro quando aberto) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            <aside
                className={cn(
                    'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300',
                    isOpen ? 'w-64' : 'w-0 lg:w-16', // w-0 em mobile esconde totalmente
                    'lg:relative lg:top-0 lg:h-full'
                )}
            >
                <div className="flex h-full flex-col overflow-hidden">
                    {/* Área de Navegação (Scrollável) */}
                    <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-accent">
                        {menuSections.map((section) => {
                            // Filtra itens baseado na permissão
                            const visibleItems = section.items.filter(
                                (item) => !((item as any).gestaoOnly ?? false) || isGestao
                            )

                            if (visibleItems.length === 0) return null

                            return (
                                <div key={section.title} className="mb-4">
                                    {/* Título da Seção (apenas se aberto) */}
                                    {isOpen && (
                                        <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground animate-in fade-in duration-300">
                                            {section.title}
                                        </h3>
                                    )}
                                    
                                    <nav className="space-y-1 px-2">
                                        {visibleItems.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={(item as any).end ?? false}
                                                className={({ isActive }) =>
                                                    cn(
                                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                                        !isOpen && 'lg:justify-center lg:px-2'
                                                    )
                                                }
                                                title={!isOpen ? item.label : undefined}
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
                                                
                                                {/* Texto do item com transição suave */}
                                                <span
                                                    className={cn(
                                                        "transition-opacity duration-200",
                                                        isOpen ? "opacity-100" : "opacity-0 w-0 hidden lg:block lg:w-0"
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>
                            )
                        })}
                    </div>

                    {/* Botão de Toggle (Rodapé da Sidebar) */}
                    <div className="hidden border-t p-2 lg:block">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onToggle}
                            className="w-full hover:bg-accent"
                            aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
                        >
                            {isOpen ? (
                                <ChevronLeft className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}