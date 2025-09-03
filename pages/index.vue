<template>
  <div class=" min-h-screen flex flex-col">

    <!-- Page content -->
    <main class="flex-1 w-full overflow-x-hidden">

      <!-- Category Slider on Mobile -->
      <div class="block md:hidden mb-4">
        <CategorySlider />
      </div>

      <!-- Hero Section with mobile-only padding-bottom -->
      <div class="pb-8 sm:pb-0">
        <HeroSection />
      </div>

      <!-- Category Slider on Desktop -->
      <div class="hidden md:block mt-4">
        <CategorySlider />
      </div>

      <!-- Premium Categories -->
      <PremiumCategories />

      <!-- Shop By Section -->
      <ShopBy /> 
 <!-- <BannerComponent
        image="https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FStore-Banner.gif%3Fv%3D1754042561&w=1920&q=75"
        heading="Curated Collection"
        subtext="Explore our exclusive picks just for you"
        buttonText="Shop Now"
      />  -->
<div class="py-4">
<BannerComponent image="influencer.jpg" aspect="1200/563" link="/influencer" />
</div>
      <!-- Banner: Curated Collection -->
      <!-- <FitsSection /> -->
     

      <!-- Headline -->
      <div class="py-4">
        <Headline />
      </div>
      
      <!-- Trending Products -->
         <div class="py-4">
      <TrendingProducts />
         </div>

      <!-- Visit Store -->
      <!-- <div class="py-4">
        <Headline2 />
      </div> -->

      <!-- Stars -->
      <Stars />

    </main>

  </div>
</template>

<script setup>
import Header from '~/components/common/Header.vue'
import Footer from '~/components/common/Footer.vue'

// Home components
import Headline from '~/components/home/Headline.vue'
import BannerComponent from '~/components/home/BannerComponent.vue'
import CategorySlider from '~/components/home/CategorySlider.vue'
import FitsSection from '~/components/home/FitsSection.vue'
import HeroSection from '~/components/home/HeroSection.vue'
import PremiumCategories from '~/components/home/PremiumCategories.vue'
import Stars from '~/components/home/stars.vue'
import VisitStore from '~/components/home/VisitStore.vue'
import TrendingProducts from '~/components/home/TrendingProducts.vue'
import ShopBy from '~/components/home/ShopBy.vue'
import Headline2 from '../components/home/Headline2.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&display=swap');

.font-spectral {
  font-family: 'Spectral', serif;
}

/* Optional: make the main content vertically scrollable if needed */
main {
  overflow-y: auto;
}
</style>
