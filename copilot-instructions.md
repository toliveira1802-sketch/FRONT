# AI Coding Guidelines for Doctor Auto Prime

## Project Overview
This is a React TypeScript application for managing a car workshop (oficina). It includes management dashboard, service orders, appointments, vehicle patio management, client management, and role-based access control.

## Architecture
- **Frontend**: React with TypeScript (ES2020 target, JSX react-jsx)
- **Routing**: React Router DOM with NavLink for navigation
- **UI Components**: shadcn/ui components from @/components/ui
- **Styling**: Tailwind CSS with transitions and responsive design
- **Icons**: Lucide React
- **Data**: Mock data from @/lib/mock-data for development/demo
- **Auth**: Role-based access (gestao, dev) via AuthContext
- **Build**: Vite with TypeScript paths (@/* -> ./src/*)

## Key Patterns
- **Import Paths**: Use @/ for src directory (e.g., @/components/ui/card)
- **Component Structure**: Functional components with JSX, props interfaces
- **Data Handling**: Filter and reduce arrays for stats (see Dashboard.tsx lines 20-30)
- **Status Management**: Use status strings like 'completed', 'waiting_approval', 'in_service' with corresponding badge variants
- **Navigation**: Use NavLink for active state styling, Link for programmatic navigation
- **Role-Based Access**: Filter UI elements based on user role (e.g., gestaoOnly items)
- **Collapsible UI**: Use state for sidebar toggle with transitions (see AppSidebar.tsx)
- **Formatting**: Use formatCurrency from @/lib/utils for prices

## Examples
- Stats calculation: `const pendingOrders = mockServiceOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled')`
- Badge variants: `status === 'completed' ? 'success' : status === 'cancelled' ? 'destructive' : 'secondary'`
- Card layout: Grid with Card components for stats and lists
- Role filtering: `const visibleItems = section.items.filter((item) => !item.gestaoOnly || isGestao)`
- NavLink styling: `className={({ isActive }) => cn(isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')`

## File Structure
- src/pages/gestao/: Management pages like Dashboard.tsx
- src/components/layout/: Layout components like AppSidebar.tsx
- src/components/ui/: Reusable UI components
- src/lib/: Utilities and mock data
- src/contexts/: AuthContext for role management