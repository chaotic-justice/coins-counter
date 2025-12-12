import { Header } from '@/components/commons/header'
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
	<div className="min-h-screen p-4 font-sans antialiased bg-background md:p-8">
		<Header />
		<main className="flex-1">
			<Outlet />
			<Toaster richColors />
		</main>
		<TanStackRouterDevtools />
	</div>
)

export const Route = createRootRoute({ component: RootLayout })