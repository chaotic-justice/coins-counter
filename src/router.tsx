import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import gtConfig from "../gt.config.json";
import { GTProvider } from "gt-react";
import dictionary from "./dictionary";
import loadTranslations from "./lib/loadTranslations";

export function getRouter() {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}

// Render the app
// const rootElement = document.getElementById("app")!;
// if (!rootElement.innerHTML) {
// 	const root = ReactDOM.createRoot(rootElement);
// 	root.render(
// 		<StrictMode>
// 			<GTProvider
// 				{...gtConfig}
// 				projectId={import.meta.env.VITE_GT_PROJECT_ID}
// 				devApiKey={import.meta.env.VITE_GT_API_KEY}
// 				loadTranslations={loadTranslations}
// 				dictionary={dictionary}
// 			>
// 				<RouterProvider router={getRouter()} />
// 			</GTProvider>
// 		</StrictMode>,
// 	);
// }
