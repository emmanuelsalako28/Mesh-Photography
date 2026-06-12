<script>
  let { showPage, openLightbox, activeCategory = $bindable('all') } = $props();

  /**
   * @param {MouseEvent} e
   */
  function handleMouseMove3D(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 12;
    const angleY = (x - xc) / 12;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
  }

  /**
   * @param {MouseEvent} e
   */
  function handleMouseLeave3D(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = 'none';
  }

  import { supabase } from '../supabaseClient.js';

  let portfolioItems = $state([]);

  const defaultItems = [
    { id: 1, pcat: 'portraits', title: 'Portrait – Personal Branding', class: 'ph-portrait', art: '◆', pt: '130%' },
    { id: 2, pcat: 'events', title: 'Event – Corporate Conference', class: 'ph-event', art: '◈', pt: '80%' },
    { id: 3, pcat: 'family', title: 'Family – Maternity Session', class: 'ph-family', art: '❋', pt: '120%' },
    { id: 4, pcat: 'corporate', title: 'Corporate – Executive Headshots', class: 'ph-corporate', art: '◇', pt: '100%' },
    { id: 5, pcat: 'fashion', title: 'Fashion – Editorial Shoot', class: 'ph-fashion', art: '✦', pt: '140%' },
    { id: 6, pcat: 'portraits', title: 'Portrait – Graduation', class: 'ph-wedding', art: '♦', pt: '90%' },
    { id: 7, pcat: 'videos', title: 'Video Showreel – Brand Story', class: '', art: '▼', pt: '110%', style: 'background:linear-gradient(160deg,#0d1520,#0c0c18,#1a1030)' },
    { id: 8, pcat: 'events', title: 'Event – Product Launch', class: 'ph-event', art: '◈', pt: '75%' },
    { id: 9, pcat: 'family', title: 'Family – Group Portrait', class: 'ph-family', art: '❋', pt: '100%' }
  ];

  async function loadPortfolio() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          portfolioItems = data.map(item => ({
            id: item.id,
            pcat: item.category,
            title: item.title,
            class: item.category === 'videos' ? '' : `ph-${item.category}`,
            art: item.art_symbol,
            pt: item.aspect_ratio,
            style: item.custom_style || ''
          }));
          return;
        }
      } catch (err) {
        console.warn('Could not load portfolio from Supabase, using defaults:', err);
      }
    }
    portfolioItems = [...defaultItems];
  }

  $effect(() => {
    loadPortfolio();
  });

  let filteredItems = $derived(
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter(item => item.pcat === activeCategory)
  );
</script>

<div class="page active" id="page-portfolio">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">our archive</span>
    <h1>the gallery</h1>
    <p>A collection of moments registered on film and digital plates.</p>
  </div>
  
  <div class="portfolio-container">
    <div class="categories" style="justify-content:center;margin-bottom:4rem" id="portfolioFilters">
      <button class="cat-btn" class:active={activeCategory === 'all'} onclick={() => activeCategory = 'all'}>All Work</button>
      <button class="cat-btn" class:active={activeCategory === 'portraits'} onclick={() => activeCategory = 'portraits'}>Portraits</button>
      <button class="cat-btn" class:active={activeCategory === 'events'} onclick={() => activeCategory = 'events'}>Events</button>
      <button class="cat-btn" class:active={activeCategory === 'family'} onclick={() => activeCategory = 'family'}>Family</button>
      <button class="cat-btn" class:active={activeCategory === 'corporate'} onclick={() => activeCategory = 'corporate'}>Corporate</button>
      <button class="cat-btn" class:active={activeCategory === 'fashion'} onclick={() => activeCategory = 'fashion'}>Fashion</button>
      <button class="cat-btn" class:active={activeCategory === 'videos'} onclick={() => activeCategory = 'videos'}>Videos</button>
    </div>

      <div class="masonry-grid" id="masonryGrid">
        {#each filteredItems as item (item.id)}
          <div class="masonry-item card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => openLightbox(item.title)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && openLightbox(item.title)}>
            <div class="photo-placeholder {item.class} card-3d-inner" style="padding-top: {item.pt}; position: relative; {item.style || ''}">
              <div class="photo-art" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 4rem;">{item.art}</div>
            </div>
            <span class="masonry-cat">{item.pcat}</span>
          </div>
        {/each}
      </div>
  </div>

  <div class="cta-banner" style="padding:5rem 3rem; border-top: 1px solid var(--border)">
    <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,4vw,2.8rem); font-style: italic; font-weight: 300;">Ready to collaborate?</h2>
    <p style="color:var(--muted);margin:1rem 0 2rem">Let's create something extraordinary together.</p>
    <button class="btn-primary" onclick={() => showPage('booking')}>Book Your Session</button>
  </div>
</div>
