<template>
  <div id="app" class="font-poppins relative min-h-screen">
    <!-- Topbar -->
    <TopBar />

    <!-- Header -->
    <Header />

    <!-- Page content with animated navigation -->
    <Transition name="page-slide" mode="out-in">
      <NuxtPage />
    </Transition>

    <!-- Footer -->
    <Footer />

    <!-- Scroll to Top Button -->
    <ScrollToTopButton />
  </div>
</template>

<script setup>
import Header from '~/components/common/Header.vue'
import Footer from '~/components/common/Footer.vue'
import TopBar from '~/components/TopBar.vue'
import ScrollToTopButton from '~/components/common/ScrollToTopButton.vue'

const { vueApp } = useNuxtApp()
</script>

<style>
/* Import Poppins font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Optional: smooth fade for header/footer */
#app>* {
  transition: all 0.5s ease;
}

/* Page slide transition */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.5s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
