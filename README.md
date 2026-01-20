# Doctor Auto Prime

CRM completo para oficinas mecânicas.

## Instalação

```bash
cd doctor-auto-prime
npm install
npm run dev
```

O app estará disponível em `http://localhost:5173`

## Demo

O app funciona sem Supabase configurado usando dados mock. Na tela de login, use os botões "Demo Cliente" ou "Demo Admin" para testar.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router
- React Query (TanStack)
- Supabase (opcional)

## Estrutura

```
src/
├── components/
│   ├── layout/      # Header, Sidebar, BottomNav
│   ├── shared/      # AppointmentCard (client/admin)
│   ├── ui/          # shadcn/ui components
│   └── vehicle/     # VehicleCard (client/admin)
├── contexts/        # AuthContext
├── lib/             # Utils, Supabase, Mock data
├── pages/           # Client pages
│   └── admin/       # Admin pages
└── types/           # TypeScript types
```

## Rotas

**Cliente:** `/`, `/agenda`, `/profile`, `/avisos`
**Admin:** `/admin`, `/admin/patio`, `/admin/clientes`, `/admin/agendamentos`
