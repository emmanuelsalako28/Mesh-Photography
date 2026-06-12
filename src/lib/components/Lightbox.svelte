<script>
  let { isOpen = false, title = '', style = '', symbol = '', closeLightbox } = $props();

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

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  }
</script>

{#if isOpen}
  <div class="lightbox open" onclick={handleOverlayClick} role="presentation">
    <button class="lightbox-close" onclick={closeLightbox}>×</button>
    <div class="lightbox-inner">
      <div class="lightbox-placeholder">
        {#if style}
          <div style="display:flex;flex-direction:column;align-items:center;gap:1.5rem;">
            <div class="{style}" style="width: 75vw; max-width: 380px; aspect-ratio: 128/169; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.8); position: relative; display: flex; align-items: center; justify-content: center;">
              <div class="photo-art" style="font-size: 8rem; opacity: 0.2;">{symbol || '◆'}</div>
            </div>
            <div style="font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);text-align:center;font-weight:600;">
              {title}
            </div>
          </div>
        {:else}
          <div style="display:flex;align-items:center;justify-content:center;width:70vw;max-width:900px;aspect-ratio:4/3;border:1px solid rgba(201,168,76,0.3);background:linear-gradient(145deg,#1a1408,#0c0c0c,#1a1020);flex-direction:column;gap:1rem;color:rgba(201,168,76,0.15);font-family:'Playfair Display',serif">
            <div style="font-size:8rem">◆</div>
            <div style="font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(201,168,76,0.4)">
              {title}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
