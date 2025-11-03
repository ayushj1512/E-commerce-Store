<template>
  <div class="min-h-screen flex flex-col">
    <!-- Page content -->
    <main class="flex-1 w-full overflow-x-hidden">
      <!-- Category Slider on Mobile -->
      <div class="block md:hidden mb-4">
        <CategorySlider />
      </div>

      <!-- Hero Section -->
      <div class="pb-8 sm:pb-0">
        <HeroSection />
      </div>

      <!-- Category Slider on Desktop -->
      <div class="hidden md:block mt-4">
        <CategorySlider />
      </div>

      <!-- Premium Categories -->
      <PremiumCategories />

      <!-- Offers -->
      <!-- <OfferList class="py-4" /> -->

      <!-- Shop By Section -->
      <ShopBy />

      <!-- Insta Gallery -->
      <InstaGallery />

      <!-- Influencer Banner -->
      <div class="pb-4">
        <BannerComponent image="influencer.jpg" aspect="1200/563" link="/influencer" />
      </div>

      <!-- Recently Viewed -->
      <RecentlyViewedProducts />

      <!-- Trending Products -->
      <div class="py-0">
        <TrendingProducts />
      </div>

      <!-- Stars -->
      <Stars />

      <highlights-bar />
    </main>

    <!-- ✅ App Download Banner (fixed bottom) -->
    <AppDownload />
  </div>
</template>

<script setup>
import Header from '~/components/common/Header.vue'
import Footer from '~/components/common/Footer.vue'

// Home components
import Headline from '~/components/home/Headline.vue'
import BannerComponent from '~/components/home/BannerComponent.vue'
import CategorySlider from '~/components/home/CategorySlider.vue'
import HeroSection from '~/components/home/HeroSection.vue'
import PremiumCategories from '~/components/home/PremiumCategories.vue'
import Stars from '~/components/home/stars.vue'
import TrendingProducts from '~/components/home/TrendingProducts.vue'
import ShopBy from '~/components/home/ShopBy.vue'
import RecentlyViewedProducts from '~/components/home/RecentlyViewedProducts.vue'
import InstaGallery from '~/components/home/InstaGallery.vue'
import OfferList from '@/components/home/voucher.vue'
import AppDownload from '@/components/home/AppDownload.vue' // 👈 added
import HighlightsBar from '../components/home/HighlightsBar.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&display=swap');

.font-spectral {
  font-family: 'Spectral', serif;
}

/* Allow scroll while keeping banner fixed */
main {
  overflow-y: auto;
}
</style>
