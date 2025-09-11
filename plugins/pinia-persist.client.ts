// plugins/pinia-persist.client.ts
import { defineNuxtPlugin } from "#app";
import { Pinia } from "pinia";
import piniaPersistedstate from  "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia | undefined;

  if (pinia) {
    console.log("[Pinia Persist] Applying persisted state plugin");
    pinia.use(piniaPersistedstate);
  } else {
    console.warn("[Pinia Persist] Pinia instance not found!");
  }
});
