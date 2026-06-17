<script>
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let { isOpen = false, title = '', style = '', symbol = '', imageUrl = '', closeLightbox } = $props();

  // Control scrolling on the document body when lightbox is active
  $effect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });

  /**
   * @param {MouseEvent} e
   */
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  }
</script>

{#if isOpen}
  <div 
    class="lightbox" 
    onclick={handleOverlayClick} 
    role="presentation"
    transition:fade={{ duration: 250 }}>
    
    <button class="lightbox-close" onclick={closeLightbox} aria-label="Close Lightbox">×</button>
    
    <div 
      class="lightbox-inner"
      transition:scale={{ duration: 350, start: 0.92, easing: cubicOut }}>
      
      <div class="lightbox-content">
        {#if imageUrl}
          <div class="lightbox-media-wrapper">
            <img src={imageUrl} alt={title} class="lightbox-img-hd" />
            {#if title}
              <div class="lightbox-caption">
                {title}
              </div>
            {/if}
          </div>
        {:else if style}
          <div class="lightbox-media-wrapper">
            <div class="lightbox-gradient-card {style}">
              <div class="photo-art-fallback">{symbol || '◆'}</div>
            </div>
            {#if title}
              <div class="lightbox-caption">
                {title}
              </div>
            {/if}
          </div>
        {:else}
          <div class="lightbox-empty-fallback">
            <div class="fallback-icon">◆</div>
            {#if title}
              <div class="fallback-caption">
                {title}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
