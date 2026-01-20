import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials, formatPhone } from '@/lib/utils'
import { User, Mail, Phone, Shield, LogOut, Settings, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Profile() {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const roleLabels: Record<string, string> = {
        admin: 'Administrador',
        gestao: 'Gestão',
        user: 'Cliente',
        dev: 'Desenvolvedor',
    }

    const menuItems = [
        { to: '/configuracoes', icon: Settings, label: 'Configurações' },
        { to: '/historico', icon: User, label: 'Histórico de Serviços' },
    ]

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Profile Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={profile?.avatar_url || undefined} />
                            <AvatarFallback className="text-2xl">
                                {getInitials(profile?.full_name || 'U')}
                            </AvatarFallback>
                        </Avatar>
                        <h1 className="text-xl font-bold">{profile?.full_name || 'Usuário'}</h1>
                        <Badge variant="secondary" className="mt-2">
                            <Shield className="h-3 w-3 mr-1" />
                            {roleLabels[profile?.role || 'user']}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile?.email || 'Não informado'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="font-medium">
                                {profile?.phone ? formatPhone(profile.phone) : 'Não informado'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Menu Items */}
            <Card>
                <CardContent className="p-0">
                    {menuItems.map((item, index) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center justify-between p-4 hover:bg-accent transition-colors ${index !== menuItems.length - 1 ? 'border-b' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span>{item.label}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    ))}
                </CardContent>
            </Card>

            {/* Logout */}
            <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
            >
                <LogOut className="h-4 w-4 mr-2" />
                Sair da conta
            </Button>
        </div>
    )
}
