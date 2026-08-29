import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useLocation,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MiniCart } from "@/components/MiniCart";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/ClientOnly";
import { WhatsAppFAB } from "@/components/SocialFloating";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MOTURBO — Luxury Automotive Studio" },
      {
        name: "description",
        content:
          "MOTURBO is a flagship automotive detailing, customization and accessories studio. Ceramic coating, PPF, wrapping and an workroom product line.",
      },
      { name: "author", content: "MOTURBO" },
      { property: "og:title", content: "MOTURBO — Luxury Automotive Studio" },
      {
        property: "og:description",
        content:
          "Step inside the MOTURBO flagship showroom: detailing, protection and bespoke automotive craft.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@moturbo" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // weight 300 is never used in this design — dropping it saves 2 font file downloads.
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || location.pathname !== "/") {
      return;
    }

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const connection = nav.connection;
    const saveData = Boolean(connection?.saveData);
    const verySlowNetwork = /(^|-)2g$/.test(connection?.effectiveType ?? "");
    const lowMemory = (nav.deviceMemory ?? 8) <= 4;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    if (saveData || verySlowNetwork) {
      return;
    }

    const warm = () => {
      // Only warm the showroom on the homepage and on capable devices.
      if (!isMobile) {
        window.setTimeout(() => {
          void import("@/components/three/ShowroomStage");
          void import("@/components/three/ShowroomScene");
        }, 1800);

        if (!lowMemory) {
          window.setTimeout(() => {
            void fetch("/models/car2.glb", { cache: "force-cache" }).catch(() => undefined);
            void fetch("/dikhololo_night_1k.hdr", { cache: "force-cache" }).catch(() => undefined);
          }, 2200);
        }
      }
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const idleId = w.requestIdleCallback(warm);
      return () => {
        if (w.cancelIdleCallback) {
          w.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = window.setTimeout(warm, 350);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <SmoothScroll />
        <Preloader />
        <Navbar />
        <MiniCart />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="relative">
          <Outlet />
        </main>
        <Footer />
        {/* Floating social elements — mounted client-only to avoid SSR mismatch */}
        <ClientOnly>
          <WhatsAppFAB />
        </ClientOnly>
        <Toaster position="bottom-right" offset={{ bottom: 170, right: 45 }} mobileOffset={{ bottom: 150, right: 16 }} />
      </StoreProvider>
    </QueryClientProvider>
  );
}
