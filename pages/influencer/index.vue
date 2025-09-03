<template>
  <section class="bg-white text-black min-h-screen flex flex-col items-center justify-start px-6 md:px-20 py-16">

    <!-- Hero Section -->
    <div class="text-center max-w-3xl mb-20 space-y-6">
      <h1 class="text-4xl md:text-6xl font-extrabold leading-tight animate-slide-up">
        Monetize Your Influence
      </h1>
      <p class="text-lg md:text-xl text-gray-800 animate-fade-in">
        Join our affiliate program to turn your influence into income. Share products you love and earn rewards for every sale. Perfect for influencers, content creators, and social media enthusiasts.
      </p>
      <a href="/influencer/register" class="inline-block bg-black text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-gray-900 transition animate-fade-in">
        Join Now
      </a>
    </div>

    <!-- How It Works Section -->
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
      <div class="flex flex-col items-center text-center space-y-4 p-8 border border-black/20 rounded-xl hover:bg-black/5 transition transform hover:-translate-y-1">
        <div class="text-4xl font-bold">1</div>
        <h3 class="text-xl font-semibold">Sign Up</h3>
        <p class="text-gray-800">Create your influencer account in minutes and get instant access to your unique affiliate link.</p>
      </div>
      <div class="flex flex-col items-center text-center space-y-4 p-8 border border-black/20 rounded-xl hover:bg-black/5 transition transform hover:-translate-y-1">
        <div class="text-4xl font-bold">2</div>
        <h3 class="text-xl font-semibold">Promote Products</h3>
        <p class="text-gray-800">Share your favorite products via social media or blogs. Every click and sale is tracked seamlessly.</p>
      </div>
      <div class="flex flex-col items-center text-center space-y-4 p-8 border border-black/20 rounded-xl hover:bg-black/5 transition transform hover:-translate-y-1">
        <div class="text-4xl font-bold">3</div>
        <h3 class="text-xl font-semibold">Earn Rewards</h3>
        <p class="text-gray-800">Earn competitive commissions and track your performance in real time.</p>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="max-w-4xl text-center mb-20 space-y-6">
      <h2 class="text-3xl md:text-4xl font-bold">Why Join Our Affiliate Program?</h2>
      <ul class="text-gray-800 list-disc list-inside space-y-3 text-lg text-left md:text-left">
        <li>Maximize earnings with high commission rates.</li>
        <li>Access exclusive trending and premium products.</li>
        <li>Flexible promotions anytime, anywhere.</li>
        <li>Real-time tracking of clicks, conversions, and payouts.</li>
        <li>Supportive community and influencer resources to grow your reach.</li>
        <li>Monthly performance reports and top-performer bonuses.</li>
      </ul>
    </div>

    <!-- Testimonials Section (Horizontal Infinite Scroll) -->
    <div class="w-full max-w-5xl mb-20">
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Hear From Our Influencers</h2>
      
      <!-- Outer container to hide overflow -->
      <div class="overflow-hidden relative">
        <div class="flex animate-scroll gap-8">
          <!-- Testimonial cards repeated for infinite scroll -->
          <div class="testimonial-card">
            <p class="text-gray-800 mb-4 italic">"Joining this affiliate program boosted my income significantly. The products are high-quality and my audience loves them!"</p>
            <p class="font-semibold">- Riya Sharma</p>
          </div>
          <div class="testimonial-card">
            <p class="text-gray-800 mb-4 italic">"Tracking clicks and sales is effortless. I know exactly how much I earn from each post."</p>
            <p class="font-semibold">- Arjun Mehta</p>
          </div>
          <div class="testimonial-card">
            <p class="text-gray-800 mb-4 italic">"The community support and resources helped me grow my reach and maximize my commissions."</p>
            <p class="font-semibold">- Kavya Patel</p>
          </div>
          <!-- Repeat the same cards for smooth looping -->
          <div class="testimonial-card">
            <p class="text-gray-800 mb-4 italic">"Joining this affiliate program boosted my income significantly. The products are high-quality and my audience loves them!"</p>
            <p class="font-semibold">- Riya Sharma</p>
          </div>
          <div class="testimonial-card">
            <p class="text-gray-800 mb-4 italic">"Tracking clicks and sales is effortless. I know exactly how much I earn from each post."</p>
            <p class="font-semibold">- Arjun Mehta</p>
          </div>
          <div class="testimonial-card">
            <p class="text-gray-800 mb-4 italic">"The community support and resources helped me grow my reach and maximize my commissions."</p>
            <p class="font-semibold">- Kavya Patel</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA Section -->
    <div class="mb-20 text-center">
      <h3 class="text-2xl md:text-3xl font-bold mb-6">Ready to Start Earning?</h3>
      <a href="/influencer/register" class="bg-black text-white font-bold px-12 py-4 rounded-full text-lg hover:bg-gray-900 transition">
        Join Now
      </a>
    </div>

    <!-- Footer -->
    <footer class="mt-16 text-gray-500 text-sm text-center">
      © 2025 Your Brand. All rights reserved.
    </footer>
  </section>
</template>

<script setup>
// No JS needed
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Hero animations */
.animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
.animate-fade-in { animation: fade-in 1s ease-out forwards; }

/* Horizontal Infinite Scroll */
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* Scroll half of duplicated cards */
}
.animate-scroll {
  display: flex;
  gap: 2rem;
  animation: scroll 30s linear infinite;
}

/* Testimonial card styling - same size for all */
.testimonial-card {
  min-width: 300px;
  max-width: 300px;
  flex-shrink: 0;
  padding: 1.5rem;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 1rem;
  background-color: #fff;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .animate-scroll { gap: 1rem; }
  .testimonial-card { min-width: 250px; max-width: 250px; }
}
</style>
