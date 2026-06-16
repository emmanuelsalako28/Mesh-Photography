<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let { showPage } = $props();

  let mounted = $state(false);
  let activeSlide = $state(0); // 0 or 1
  let intervalId;

  const slides = [
    {
      image: '/hero1.png',
      badge: 'Timeless Photography.',
      titleFirst: 'Your Story :',
      titleAccent: 'Beautifully Told',
      titleMobileFirst: 'BUILDING\nCONFIDENCE\nIN',
      titleMobileAccent: 'YOU',
      isImageLeft: false
    },
    {
      image: '/hero2.jpg',
      badge: 'Timeless Photography.',
      titleFirst: 'Memories :',
      titleAccent: 'That Last',
      titleMobileFirst: 'MEMORIES\nTHAT',
      titleMobileAccent: 'LAST',
      isImageLeft: true
    }
  ];

  onMount(() => {
    mounted = true;
    intervalId = setInterval(() => {
      activeSlide = (activeSlide + 1) % slides.length;
    }, 6000); // changes slide every 6 seconds
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

<div class="clean-hero-container relative w-full min-h-screen lg:h-screen overflow-hidden bg-[var(--ink)]">
  
  {#each slides as slide, index}
    {#if mounted && activeSlide === index}
      <!-- Single slide wrapper that transitions together -->
      <div 
        class="absolute inset-0 w-full h-full flex flex-col lg:flex-row overflow-hidden hero-slide-wrapper"
        in:fade={{ duration: 1000 }}
        out:fade={{ duration: 1000 }}>
        
        <!-- TEXT CONTENT PANEL (Changes visual order flex-col / lg:flex-row depending on slide config) -->
        <div class="hero-text-panel relative w-full lg:w-1/2 min-h-[60vh] lg:h-full flex items-start pt-36 lg:pt-44 pb-12 px-6 sm:px-12 md:px-16 lg:px-16 xl:px-20 z-20 {slide.isImageLeft ? 'lg:order-2' : 'lg:order-1'}">
          <!-- Radial warm lighting effect -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(184,147,54,0.06),transparent_60%)] -z-10"></div>
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,169,126,0.03),transparent_55%)] -z-10"></div>
          
          <!-- Subtle noise overlay -->
          <div class="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay -z-10" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E');"></div>

          <div class="max-w-xl mx-auto lg:mx-0 w-full flex flex-col justify-start">
            <!-- Eyebrow Badge -->
            <div in:fly={{ y: 20, duration: 800, delay: 100, easing: cubicOut }} class="flex items-center gap-2 mb-6 hero-eyebrow-wrapper">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--gold)]"></span>
              <span class="text-xs uppercase tracking-[0.22em] font-semibold text-[var(--gold)]">
                {slide.badge}
              </span>
            </div>

            <!-- Heading Desktop -->
            <h1 in:fly={{ y: 20, duration: 800, delay: 250, easing: cubicOut }} class="hero-title hidden md:block text-4xl sm:text-5xl md:text-5xl lg:text-[3.2rem] xl:text-[3.8rem] font-bold text-[var(--ivory)] leading-[1.15] mb-8 font-serif select-none">
              {slide.titleFirst} <span class="accent-text italic font-medium">{slide.titleAccent}</span>.
            </h1>

            <!-- Heading Mobile -->
            <h1 in:fly={{ y: 20, duration: 800, delay: 250, easing: cubicOut }} class="hero-title-mobile block md:hidden text-right text-[2rem] font-bold text-[var(--ivory)] leading-[1.25] mb-6 select-none font-sans uppercase">
              <span class="block whitespace-pre-line">{slide.titleMobileFirst}</span>
              <span class="block font-black text-black dark:text-white">{slide.titleMobileAccent}</span>
            </h1>

            <!-- CTA Buttons Desktop -->
            <div in:fly={{ y: 20, duration: 800, delay: 400, easing: cubicOut }} class="hidden md:flex flex-wrap gap-4 mb-12 lg:mb-16">
              <button 
                onclick={() => showPage('booking')} 
                class="btn-primary rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-widest shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                Book a Session
              </button>
              
              <button 
                onclick={() => showPage('portfolio')} 
                class="btn-outline rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5 bg-transparent hover:bg-[rgba(184,147,54,0.06)]">
                View Portfolio
              </button>
            </div>

            <!-- CTA Button Mobile -->
            <div in:fly={{ y: 20, duration: 800, delay: 400, easing: cubicOut }} class="flex md:hidden justify-end w-full mb-12">
              <button 
                onclick={() => showPage('booking')} 
                class="hero-mobile-btn">
                LET'S BEGIN
              </button>
            </div>
          </div>
        </div>

        <!-- IMAGE PANEL -->
        <div class="hero-image-panel right-section relative w-full lg:w-1/2 h-[50vh] lg:h-full overflow-hidden bg-transparent blend-image {slide.isImageLeft ? 'lg:order-1' : 'lg:order-2'} {slide.isImageLeft ? 'blend-left' : 'blend-right'}">
          <!-- Minimalist Decorative Tag -->
          <div 
            in:fade={{ duration: 1000, delay: 1000 }}
            class="absolute bottom-8 {slide.isImageLeft ? 'left-8' : 'right-8'} z-20 hidden sm:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-2 px-4 shadow-sm text-white">
            <span class="text-[10px] uppercase tracking-[0.2em] font-medium font-sans">Mesh Photography Studio</span>
          </div>

          <!-- Main Portrait Image -->
          <div 
            in:fade={{ duration: 1200, delay: 350 }}
            class="w-full h-full transition-transform duration-[2500ms] hover:scale-105">
            <img 
              src={slide.image} 
              alt="Mesh Photography Hero Portrait" 
              class="w-full h-full object-cover object-[center_30%] lg:object-[left_center]" />
          </div>
        </div>

      </div>
    {/if}
  {/each}

  <!-- Slide Dot Indicators -->
  <div class="hero-indicators">
    {#each slides as _, index}
      <button 
        class="hero-dot" 
        class:active={activeSlide === index} 
        onclick={() => activeSlide = index}
        aria-label="Go to slide {index + 1}">
      </button>
    {/each}
  </div>

</div>

<style>
  /* Accent Highlight Styling */
  .accent-text {
    color: var(--gold);
    position: relative;
    display: inline-block;
  }
  
  .accent-text::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--gold);
    opacity: 0.3;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .clean-hero-container:hover .accent-text::after {
    transform: scaleX(1);
  }

  /* Overriding styles for the buttons */
  :global(.btn-primary.rounded-full) {
    border-radius: 9999px !important;
  }
  :global(.btn-outline.rounded-full) {
    border-radius: 9999px !important;
  }

  .left-section {
    padding-top: 140px !important;
  }
  @media (min-width: 1024px) {
    .left-section {
      padding-top: 180px !important;
    }
  }

  .hero-title {
    font-size: 2.6rem !important;
    line-height: 1.15 !important;
  }
  @media (min-width: 768px) {
    .hero-title {
      font-size: 3.2rem !important;
    }
  }
  @media (min-width: 1024px) {
    .hero-title {
      font-size: 3.5rem !important;
    }
  }
  @media (min-width: 1280px) {
    .hero-title {
      font-size: 4.2rem !important;
    }
  }

  /* Feathered edge gradients to blend the image naturally based on its position */
  .blend-image {
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 8%, black 25%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 8%, black 25%);
  }

  @media (min-width: 1024px) {
    /* Image on right: mask fades the left side */
    .blend-right {
      mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.1) 8%, black 28%);
      -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.1) 8%, black 28%);
    }

    /* Image on left: mask fades the right side */
    .blend-left {
      mask-image: linear-gradient(to left, transparent 0%, rgba(0, 0, 0, 0.1) 8%, black 28%);
      -webkit-mask-image: linear-gradient(to left, transparent 0%, rgba(0, 0, 0, 0.1) 8%, black 28%);
    }
  }
</style>
