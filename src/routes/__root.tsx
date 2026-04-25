import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoreProvider } from "@/context/StoreContext";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <h2 className="font-display text-2xl mt-2 text-foreground">Page Not Found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has wandered off. Let's get you home.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-ink transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eastern Elegance — Where Tradition Meets Style" },
      {
        name: "description",
        content:
          "Premium eastern wear and modern fusion clothing. Discover luxury kurtis, sherwanis, lehengas and accessories — crafted with care in Pakistan.",
      },
      { property: "og:title", content: "Eastern Elegance — Where Tradition Meets Style" },
      {
        property: "og:description",
        content: "Premium eastern wear and modern fusion clothing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </StoreProvider>
  );
}
