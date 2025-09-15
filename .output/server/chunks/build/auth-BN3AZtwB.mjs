import { u as useAuthStore } from './auth-BNE6mzpu.mjs';
import { h as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import 'pinia';
import '@vueuse/integrations/useCookies';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'lucide-vue-next';

const auth = defineNuxtRouteMiddleware((to, from) => {
  const auth2 = useAuthStore();
  auth2.loadSession();
  console.log("[Auth Middleware] Session loaded:", auth2.$state);
  if (!auth2.isAuthenticated) {
    console.log("[Auth Middleware] No session found. Redirecting to /login...");
    return navigateTo("/login");
  }
  if (auth2.isAuthenticated && to.path === "/login") {
    console.log("[Auth Middleware] Already logged in, redirecting to home...");
    return navigateTo("/");
  }
  console.log("[Auth Middleware] Navigation allowed to:", to.path);
});

export { auth as default };
//# sourceMappingURL=auth-BN3AZtwB.mjs.map
