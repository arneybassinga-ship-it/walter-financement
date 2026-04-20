import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Walter Entreprise — Solutions de financement" },
      {
        name: "description",
        content:
          "Walter Entreprise : simulez votre prêt en ligne et obtenez une réponse rapide. Taux fixe à partir de 5%, étude personnalisée et accompagnement sur-mesure.",
      },
      { name: "author", content: "Walter Entreprise" },
      { property: "og:title", content: "Walter Entreprise — Solutions de financement" },
      {
        property: "og:description",
        content:
          "Simulateur de prêt en ligne et accompagnement personnalisé. Walter Entreprise vous propose des financements transparents et rapides.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/walter.jpg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [splash, setSplash] = useState(true);

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}
