import { createBrowserRouter, Navigate, useSearchParams, type RouteObject } from "react-router-dom";

import { LandingPage } from "@/pages/Landing";
import { AuthPage } from "@/pages/Auth";
import { AppHomePage } from "@/pages/AppHome";
import { NotFoundPage } from "@/pages/NotFound";
import { ErrorPage } from "@/pages/ErrorPage";
import { RequireAuth } from "@/components/RequireAuth";

// Old links used /auth?mode=signup|signin — send them to the new paths.
function LegacyAuthRedirect() {
  const [params] = useSearchParams();
  return <Navigate to={params.get("mode") === "signup" ? "/sign-up" : "/sign-in"} replace />;
}

export const routes: RouteObject[] = [
  {
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/sign-in", element: <AuthPage mode="signin" /> },
      { path: "/sign-up", element: <AuthPage mode="signup" /> },
      { path: "/auth", element: <LegacyAuthRedirect /> },
      {
        element: <RequireAuth />,
        children: [{ path: "/app", element: <AppHomePage /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
