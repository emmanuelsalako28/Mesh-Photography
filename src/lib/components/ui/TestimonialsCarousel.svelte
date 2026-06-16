<script>
  // @ts-nocheck
  import { onMount } from 'svelte';

  let { testimonials = [] } = $props();

  let screenWidth = $state(1024);
  let currentIndex = $state(0);
  let isHovered = $state(false);

  // Responsive visible cards count to show peeking columns:
  // Desktop: 2.25 (shows 2 full cards and 1 peeking)
  // Tablet: 1.5 (shows 1 full card and 1 peeking)
  // Mobile: 1.1 (shows 1 full card and 1 peeking slightly)
  let visibleCards = $derived(screenWidth >= 1024 ? 2.25 : screenWidth >= 768 ? 1.5 : 1.1);
  let maxIndex = $derived(Math.max(0, testimonials.length - Math.floor(visibleCards)));

  function nextSlide() {
    if (currentIndex >= maxIndex) {
      currentIndex = 0; // Wrap around
    } else {
      currentIndex += 1;
    }
  }

  function prevSlide() {
    if (currentIndex <= 0) {
      currentIndex = maxIndex; // Wrap around
    } else {
      currentIndex -= 1;
    }
  }

  // Autoplay effect every 5.5 seconds (pauses on hover)
  $effect(() => {
    if (maxIndex === 0) return;
    const interval = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 5500);
    return () => clearInterval(interval);
  });

  // Reset current index if screen size changes and index exceeds maxIndex
  $effect(() => {
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
  });
</script>

<!-- Main Wrapper -->
<div 
  bind:clientWidth={screenWidth} 
  class="relative w-full overflow-hidden px-1 md:px-6 py-4"
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
  role="region"
  aria-label="Customer Testimonials"
>
  <!-- Slider Container -->
  <div class="w-full overflow-hidden">
    <div 
      class="flex transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1)"
      style="
        --visible: {visibleCards};
        --gap: 3.5rem;
        --index: {currentIndex};
        gap: var(--gap);
        transform: translateX(calc(-1 * var(--index) * (100% + var(--gap)) / var(--visible)));
      "
    >
      {#each testimonials as review, idx (review.id || idx)}
        <div 
          class="flex-shrink-0"
          style="flex: 0 0 calc((100% - (var(--visible) - 1) * var(--gap)) / var(--visible));"
        >
          <!-- Testimonial Slide Item (Left Circular Image, Right Text Block) -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8 w-full text-left py-6">
            
            <!-- Circular Avatar Photo -->
            <div class="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/20 shadow-sm">
              {#if review.img || review.profile_photo}
                <img 
                  src={review.img || review.profile_photo} 
                  alt={review.name || review.author || 'Client'} 
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              {:else}
                <!-- Letter Initial Fallback -->
                <div class="w-full h-full flex items-center justify-center font-sans text-gold font-bold text-3xl">
                  {(review.name || review.author || 'C')[0]}
                </div>
              {/if}
            </div>

            <!-- Client Quote and Details -->
            <div class="flex flex-col text-left">
              <!-- Name (Uppercase, bold) -->
              <h3 class="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-white leading-tight mb-1 font-sans">
                {review.name || review.author || 'Anonymous'}
              </h3>
              
              <!-- Event Type / Organization (Uppercase, gold/muted, tracking) -->
              <span class="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-gold/80 mb-4 font-sans">
                {review.event_type || review.role || review.org || 'Client'}
              </span>

              <!-- Testimonial quote -->
              <p class="text-sm font-light text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans max-w-md">
                {review.body || review.quote || ''}
              </p>
            </div>

          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Navigation Controls (Vertical rects aligned at the container sides) -->
  {#if maxIndex > 0}
    <!-- Arrow Left -->
    <button 
      class="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-14 bg-white dark:bg-[#141414] border border-black/5 dark:border-white/5 flex items-center justify-center text-foreground hover:text-gold hover:border-gold/50 transition-all duration-200 z-20 shadow-sm cursor-pointer"
      onclick={prevSlide}
      aria-label="Previous slide"
    >
      <span class="text-base font-bold">‹</span>
    </button>

    <!-- Arrow Right -->
    <button 
      class="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-14 bg-white dark:bg-[#141414] border border-black/5 dark:border-white/5 flex items-center justify-center text-foreground hover:text-gold hover:border-gold/50 transition-all duration-200 z-20 shadow-sm cursor-pointer"
      onclick={nextSlide}
      aria-label="Next slide"
    >
      <span class="text-base font-bold">›</span>
    </button>

    <!-- Pagination Dots (Aligned to the bottom-left of the first visible card text, under the avatar) -->
    <div class="flex justify-start gap-1.5 mt-6 px-1">
      {#each Array.from({ length: maxIndex + 1 }) as _, idx}
        <button 
          class="w-1.5 h-1.5 rounded-full transition-all duration-300 {idx === currentIndex ? 'bg-black dark:bg-gold w-3' : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-gold/50'}"
          onclick={() => currentIndex = idx}
          aria-label="Go to slide {idx + 1}"
          aria-current={idx === currentIndex ? 'true' : undefined}
        ></button>
      {/each}
    </div>
  {/if}
</div>
