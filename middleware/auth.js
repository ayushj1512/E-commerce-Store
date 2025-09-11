// middleware/auth.js
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  // 🔄 Load session from cookies / localStorage
  auth.loadSession();
  console.log("[Auth Middleware] Session loaded:", auth.$state);

  // ❌ Redirect unauthenticated users to login page
  if (!auth.isAuthenticated) {
    console.log("[Auth Middleware] No session found. Redirecting to /login...");
    return navigateTo("/login");
  }

  // ✅ Redirect authenticated users away from login page
  if (auth.isAuthenticated && to.path === "/login") {
    console.log("[Auth Middleware] Already logged in, redirecting to home...");
    return navigateTo("/"); // Optional: redirect to homepage
  }

  console.log("[Auth Middleware] Navigation allowed to:", to.path);
});
