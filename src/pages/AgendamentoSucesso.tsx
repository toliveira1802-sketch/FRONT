import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Calendar } from 'lucide-react'

export default function AgendamentoSucesso() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] pb-20">
            <Card className="max-w-md w-full text-center">
                <CardContent className="pt-8 pb-6 space-y-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                            Agendamento Confirmado!
                        </h1>
                        <p className="text-muted-foreground">
                            Seu serviço foi agendado com sucesso. Você receberá uma confirmação em breve.
                        </p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                        <Badge variant="success" className="mb-2">Confirmado</Badge>
                        <p className="text-sm text-muted-foreground">
                            Aguarde o contato da oficina para confirmar detalhes.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button asChild>
                            <Link to="/agenda">
                                <Calendar className="h-4 w-4 mr-2" />
                                Ver Minha Agenda
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/">
                                Voltar ao Início
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
