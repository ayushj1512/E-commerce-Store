<template>
  <!-- This component doesn't render visible HTML by default -->
  <div></div>
</template>

<script setup>
import { defineExpose } from 'vue'
import confetti from 'canvas-confetti'

// Internal function to trigger confetti
const triggerConfetti = () => {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true })

  const duration = 1800
  const animationEnd = Date.now() + duration

  const isMobile = window.innerWidth < 640
  const baseParticles = isMobile ? 60 : 120
  const spread = isMobile ? 300 : 450

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      document.body.removeChild(canvas)
      return
    }

    const particleCount = baseParticles * (timeLeft / duration)

    // Fire multiple bursts with random origins
    for (let i = 0; i < 2; i++) {
      myConfetti({
        particleCount,
        spread,
        startVelocity: 35 + Math.random() * 20,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() } // anywhere on screen
      })
    }
  }, 200)
}

// Expose trigger function so parent can call it via ref
defineExpose({ triggerConfetti })
</script>

<style scoped>
/* no styles needed, canvas is dynamically injected */
</style>
