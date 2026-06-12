<script>
  let { showPage, openLightbox } = $props();

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

  let activeFilter = $state('all');
  let activeSlide = $state(0);

  // Auto-playing hero slider
  $effect(() => {
    const timer = setInterval(() => {
      activeSlide = (activeSlide + 1) % 2;
    }, 5500);
    return () => clearInterval(timer);
  });

  const photos = [
    { id: 1, cat: 'portraits', label: 'Portraits', class: 'ph-portrait', art: '◆' },
    { id: 2, cat: 'events', label: 'Events', class: 'ph-event', art: '◈' },
    { id: 3, cat: 'corporate', label: 'Corporate', class: 'ph-corporate', art: '◇' },
    { id: 4, cat: 'family', label: 'Family', class: 'ph-family', art: '❋' },
    { id: 5, cat: 'portraits', label: 'Weddings', class: 'ph-wedding', art: '♦' },
    { id: 6, cat: 'events', label: 'Fashion', class: 'ph-fashion', art: '✦' }
  ];

  const clients = [
    'Pepsi', 'Google', 'Netflix', 'Paystack', 'BUA Group',
    'BetBonanza', 'Curacel', 'Micdee', 'TalentQL', 'Thrive Agric'
  ];

  let filteredPhotos = $derived(
    activeFilter === 'all'
      ? photos.slice(0, 5) // Use top 5 to preserve the photo-grid masonry shape layout
      : photos.filter(p => p.cat === activeFilter)
  );

  $effect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class="page active" id="page-home">
  <!-- HERO SLIDER -->
  <div class="hero-slider-wrap">
    <!-- Slide 1 -->
    <div class="hero-slide" class:active={activeSlide === 0} style="background-image: linear-gradient(to right, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 100%), url('/hero1.png'); background-size: cover; background-position: center;">
      <div class="hero-content">
        <span class="hero-eyebrow">Award-winning photography studio</span>
        <h1 class="hero-title">Create Timeless<br><em>Works of Art</em></h1>
        <p class="hero-sub">Lagos, Nigeria</p>
        <div class="hero-btns">
          <button class="btn-primary" onclick={() => showPage('booking')}>Book a Session</button>
          <button class="btn-outline" onclick={() => showPage('portfolio')}>View Portfolio</button>
        </div>
      </div>
    </div>

    <!-- Slide 2 -->
    <div class="hero-slide" class:active={activeSlide === 1} style="background-image: linear-gradient(to right, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 100%), url('/hero2.jpg'); background-size: cover; background-position: center;">
      <div class="hero-content">
        <span class="hero-eyebrow">Visual Storytellers</span>
        <h1 class="hero-title">Tell Visually Appealing<br><em>Stories</em></h1>
        <p class="hero-sub">Lekki & Ogudu Studios, Lagos</p>
        <div class="hero-btns">
          <button class="btn-primary" onclick={() => showPage('booking')}>Book a Session</button>
          <button class="btn-outline" onclick={() => showPage('portfolio')}>View Portfolio</button>
        </div>
      </div>
    </div>

    <div class="hero-scroll">
      <span class="scroll-text">Scroll</span>
      <div class="scroll-line"></div>
    </div>
  </div>

  <!-- SELECTED WORK -->
  <section class="section" style="background:transparent; position:relative; z-index:10; border-top: 1px solid var(--border);">
    <div style="max-width:1200px;margin:0 auto">
      <div class="section-header reveal">
        <div>
          <span class="section-label">Selected work</span>
          <h2 class="section-title" style="font-family:var(--serif); font-style:italic; font-weight:300;">featured photography</h2>
        </div>
        <div>
          <p class="section-sub">A curated selection of our favorite shots across different sessions.</p>
          <br>
          <div class="categories">
            <button class="cat-btn" class:active={activeFilter === 'all'} onclick={() => activeFilter = 'all'}>All</button>
            <button class="cat-btn" class:active={activeFilter === 'portraits'} onclick={() => activeFilter = 'portraits'}>Portraits</button>
            <button class="cat-btn" class:active={activeFilter === 'events'} onclick={() => activeFilter = 'events'}>Events</button>
            <button class="cat-btn" class:active={activeFilter === 'corporate'} onclick={() => activeFilter = 'corporate'}>Corporate</button>
            <button class="cat-btn" class:active={activeFilter === 'family'} onclick={() => activeFilter = 'family'}>Family</button>
          </div>
        </div>
      </div>

      <div class="photo-grid reveal">
        {#each filteredPhotos as photo (photo.id)}
          <div class="photo-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => openLightbox(photo.label)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && openLightbox(photo.label)}>
            <div class="photo-placeholder {photo.class} card-3d-inner">
              <div class="photo-art">{photo.art}</div>
            </div>
            <div class="photo-overlay"></div>
            <div class="photo-label">{photo.label}</div>
          </div>
        {/each}
      </div>

      <div style="text-align:center;margin-top:4rem" class="reveal">
        <button class="view-all" onclick={() => showPage('portfolio')} style="background:none; border:none; font-family:var(--sans)">
          view full portfolio →
        </button>
      </div>
    </div>
  </section>

  <!-- SERVICES PREVIEW -->
  <section class="section" style="border-top: 1px solid var(--border);">
    <div style="max-width:1200px;margin:0 auto">
      <div class="section-header reveal">
        <div>
          <span class="section-label">our craft</span>
          <h2 class="section-title" style="font-family:var(--serif); font-style:italic; font-weight:300;">photography sessions</h2>
        </div>
        <button class="btn-outline" onclick={() => showPage('services')}>view pricing</button>
      </div>
      
      <div class="services-grid reveal">
        <div class="service-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => showPage('services')} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && showPage('services')}>
          <div class="card-3d-inner">
            <span class="service-icon">◆</span>
            <h3 class="service-name">Portraiture</h3>
            <p style="color:var(--muted);font-size:0.85rem;line-height:1.7">Portraits include Personal branding, Birthdays, Friendships, and Milestone portraits. Crafted to inspire confidence and celebrate visual identity.</p>
          </div>
        </div>
        <div class="service-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => showPage('services')} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && showPage('services')}>
          <div class="card-3d-inner">
            <span class="service-icon">❋</span>
            <h3 class="service-name">Family Sessions</h3>
            <p style="color:var(--muted);font-size:0.85rem;line-height:1.7">Looking to take a picture with the whole clan? This session is perfect for you. At Meshach Olajide Photography, we understand the importance of telling a story through family portraits.</p>
          </div>
        </div>
        <div class="service-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => showPage('services')} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && showPage('services')}>
          <div class="card-3d-inner">
            <span class="service-icon">♦</span>
            <h3 class="service-name">Weddings</h3>
            <p style="color:var(--muted);font-size:0.85rem;line-height:1.7">One of the most important days to have best-kept memories. Let us document timeless images that keep you reminiscing and feeling the same love whenever you look back.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CORPORATE PARTNERS -->
  <section class="section" style="border-top: 1px solid var(--border);">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div class="section-header reveal">
        <div>
          <span class="section-label">collaborations</span>
          <h2 class="section-title" style="font-family: var(--serif); font-style: italic; font-weight: 300;">our awesome clients</h2>
        </div>
        <p class="section-sub">We have had the privilege to document events, campaigns, and profiles for trusted brands.</p>
      </div>
      
      <div class="clients-grid reveal">
        {#each clients as client}
          <div class="client-logo-item">{client}</div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA BANNER -->
  <section class="cta-banner" style="border-top: 1px solid var(--border);">
    <div class="reveal">
      <span class="section-label" style="display:block;margin-bottom:1rem">let's connect</span>
      <h2 style="font-family:var(--serif); font-weight:300; font-style:italic; font-size:clamp(1.5rem, 4vw, 2.5rem)">Ready to frame your story?</h2>
      <p style="margin-top:1rem; margin-bottom:3rem; color:var(--muted); font-size:0.85rem;">Every session is limited, curated, and intentionally paced.</p>
      <button class="btn-primary" onclick={() => showPage('booking')}>Initiate Booking</button>
    </div>
  </section>
</div>
