import gtConfig from "@/../gt.config.json";
import { Header } from "@/components/commons/header";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import dictionary from "@/dictionary";
import loadTranslations from "@/lib/loadTranslations";
import { seo } from "@/lib/seo";
import appCss from "@/styles/app.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GTProvider } from "gt-react";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title:
					"TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
				description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
			}),
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
});

function RootComponent() {
	return (
		<GTProvider
			{...gtConfig}
			projectId={import.meta.env.VITE_GT_PROJECT_ID}
			devApiKey={import.meta.env.VITE_GT_API_KEY}
			loadTranslations={loadTranslations}
			dictionary={dictionary}
		>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</GTProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen p-4 font-sans antialiased bg-background md:p-8">
				<Header />
				<main className="flex-1">{children}</main>
				<Toaster richColors />
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools buttonPosition="bottom-left" />
				<Scripts />
			</body>
		</html>
	);
}
