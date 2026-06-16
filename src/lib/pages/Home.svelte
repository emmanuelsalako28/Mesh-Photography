<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { supabase } from '../supabaseClient.js';
  import TestimonialsCarousel from '../components/ui/TestimonialsCarousel.svelte';

  let { showPage, openLightbox } = $props();

  /**
   * @param {MouseEvent} e
   */
  function handleMouseMove3D(e) {
    const card = /** @type {HTMLElement} */ (e.currentTarget);
    if (!card) return;
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
    const card = /** @type {HTMLElement} */ (e.currentTarget);
    if (!card) return;
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
    { id: 1, cat: 'family', label: 'Classic Wedding Portrait', class: 'ph-wedding', art: '♦' },
    { id: 2, cat: 'family', label: 'Warm Couple Portrait', class: 'ph-portrait', art: '◆' },
    { id: 3, cat: 'portraits', label: 'Casual Studio Portrait', class: 'ph-portrait', art: '◆' },
    { id: 4, cat: 'portraits', label: 'Embroidered Kaftan Portrait', class: 'ph-fashion', art: '✦' },
    { id: 5, cat: 'corporate', label: 'Professional Executive Portrait', class: 'ph-corporate', art: '◇' },
    { id: 6, cat: 'family', label: 'Toddler Milestone Portrait', class: 'ph-family', art: '❋' },
    { id: 7, cat: 'corporate', label: 'Editorial Fashion Portrait', class: 'ph-corporate', art: '◇' },
    { id: 8, cat: 'portraits', label: 'Turtleneck Studio Portrait', class: 'ph-portrait', art: '◆' },
    
    { id: 9, cat: 'family', label: 'Maroon Traditional Portrait', class: 'ph-family', art: '❋' },
    { id: 10, cat: 'portraits', label: 'Black Shirt Studio Portrait', class: 'ph-portrait', art: '◆' },
    { id: 11, cat: 'corporate', label: 'Executive Branding Portrait', class: 'ph-corporate', art: '◇' },
    { id: 12, cat: 'events', label: 'Checked Blazer Studio Portrait', class: 'ph-event', art: '◈' },
    { id: 13, cat: 'portraits', label: 'Lace Dress Studio Portrait', class: 'ph-fashion', art: '✦' },
    { id: 14, cat: 'events', label: 'Red Blazer Branding Portrait', class: 'ph-event', art: '◈' },
    { id: 15, cat: 'family', label: 'Traditional Attire Studio Portrait', class: 'ph-wedding', art: '♦' },
    { id: 16, cat: 'family', label: 'Traditional Cap Studio Portrait', class: 'ph-family', art: '❋' }
  ];

  const testimonials = [
    {
      id: 'mock-1',
      name: "Damilola Benson",
      author: "Damilola Benson",
      event_type: "Corporate Branding",
      role: "Corporate Branding Client",
      org: "Benson Holdings",
      rating: 5,
      body: "The team at Mesh-Photography is exceptionally professional. Even when we arrived unprepared for our shoot, they guided us through poses and made us feel at ease. The final portraits are absolute masterpieces.",
      quote: "The team at Mesh-Photography is exceptionally professional. Even when we arrived unprepared for our shoot, they guided us through poses and made us feel at ease. The final portraits are absolute masterpieces.",
      profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      id: 'mock-2',
      name: "Sarah & Tunde",
      author: "Sarah & Tunde",
      event_type: "Wedding",
      role: "Wedding Session",
      org: "Private Clients",
      rating: 5,
      body: "Meshach documented our wedding day with so much grace. The lighting and candid moments caught on camera are truly timeless. Looking back at the images makes us feel the exact same love.",
      quote: "Meshach documented our wedding day with so much grace. The lighting and candid moments caught on camera are truly timeless. Looking back at the images makes us feel the exact same love.",
      profile_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      id: 'mock-3',
      name: "Victoria Alao",
      author: "Victoria Alao",
      event_type: "Portrait",
      role: "Creative Director",
      org: "Alao Agency",
      rating: 5,
      body: "I had a personal branding session at the studio. They are true visual storytellers who know how to capture confidence. I struggled to select my favorites because all the images were so lovely!",
      quote: "I had a personal branding session at the studio. They are true visual storytellers who know how to capture confidence. I struggled to select my favorites because all the images were so lovely!",
      profile_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

  /** @type {any[]} */
  let dbPhotos = $state([]);
  /** @type {any[]} */
  let dbTestimonials = $state([]);

  onMount(async () => {
    if (supabase) {
      try {
        const { data: pData } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: true });
        if (pData && pData.length > 0) {
          dbPhotos = pData.map(item => ({
            id: item.id,
            cat: item.category,
            label: item.title,
            class: item.category === 'videos' ? '' : `ph-${item.category}`,
            art: item.art_symbol,
            image_url: item.image_url,
            style: item.custom_style || ''
          }));
        }

        const { data: tData } = await supabase
          .from('testimonials')
          .select('*');
        if (tData && tData.length > 0) {
          dbTestimonials = tData
            .filter(item => item.is_active !== false && item.active !== false)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map(item => ({
              id: item.id,
              name: item.name || item.author || 'Anonymous',
              profile_photo: item.profile_photo || item.image_url || null,
              event_type: item.event_type || item.role || item.org || '',
              rating: item.rating !== undefined ? item.rating : 5,
              body: item.testimonial_text || item.quote || '',
              quote: item.testimonial_text || item.quote || '',
              author: item.name || item.author || 'Anonymous',
              role: item.event_type || item.role || '',
              org: item.org || ''
            }));
        }
      } catch (err) {
        console.warn('Error loading homepage data from Supabase:', err);
      }
    }
  });

  let activePhotos = $derived(dbPhotos.length > 0 ? dbPhotos : photos);
  let activeTestimonialsList = $derived(dbTestimonials.length > 0 ? dbTestimonials : testimonials);

  let filteredPhotos = $derived(
    activeFilter === 'all'
      ? activePhotos
      : activePhotos.filter(p => p.cat === activeFilter)
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
    <div class="hero-slide" class:active={activeSlide === 0} style="--hero-img: url('/hero1.png');">
      <div class="hero-content">
        <span class="hero-eyebrow">Lens & Light Studio</span>
        <h1 class="hero-title">Capturing Timeless<br><em>Stories</em></h1>
        <p class="hero-sub" style="letter-spacing: 0.15em;">We create elegant portraits, personal branding imagery, and unforgettable visual stories.</p>
        <div class="hero-btns">
          <button class="btn-primary" onclick={() => showPage('booking')}>Book Session</button>
          <button class="btn-outline" onclick={() => showPage('portfolio')}>View Portfolio</button>
        </div>
      </div>
    </div>

    <!-- Slide 2 -->
    <div class="hero-slide" class:active={activeSlide === 1} style="--hero-img: url('/hero2.jpg');">
      <div class="hero-content">
        <span class="hero-eyebrow">Creative Direction</span>
        <h1 class="hero-title">Fine Art &<br><em>Editorial Visuals</em></h1>
        <p class="hero-sub" style="letter-spacing: 0.15em;">Polished branding, executive headshots, and editorial collections tailored to your brand.</p>
        <div class="hero-btns">
          <button class="btn-primary" onclick={() => showPage('booking')}>Book Session</button>
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
  <section class="section" style="background:transparent; position:relative; z-index:10; padding: 0;">
    <div class="photo-grid reveal" style="width: 100%; margin-top: 0; gap: 0;">
      {#each filteredPhotos as photo (photo.id)}
        <div class="photo-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => openLightbox(photo.label, photo.class, photo.art, photo.image_url)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && openLightbox(photo.label, photo.class, photo.art, photo.image_url)}>
          <div class="photo-placeholder {photo.class} card-3d-inner" style="position: relative; {photo.image_url ? `background-image: url(${photo.image_url}); background-size: cover; background-position: center;` : photo.style || ''}">
            {#if !photo.image_url}
              <div class="photo-art">{photo.art}</div>
            {/if}
          </div>
          <div class="photo-overlay"></div>
          <div class="photo-label">{photo.label}</div>
        </div>
      {/each}
    </div>

    <div style="max-width:1200px;margin:0 auto; padding: 4rem 3rem;">
      <div style="text-align:center" class="reveal">
        <button class="view-all" onclick={() => showPage('portfolio')} style="background:none; border:none; font-family:var(--sans)">
          view full portfolio →
        </button>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="section" style="border-top: 1px solid var(--border); padding-top: 3.5rem; padding-bottom: 4rem;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 3rem;">
      <div class="reveal" style="margin-bottom: 2.5rem; text-align: left;">
        <h2 style="font-family: var(--sans); font-size: 1.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ivory); margin-bottom: 0.75rem;">
          Testimonials
        </h2>
        <div style="width: 60px; height: 4px; background: var(--ivory);"></div>
      </div>
      <div class="reveal" style="margin-top: 2rem;">
        <TestimonialsCarousel testimonials={activeTestimonialsList} />
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
            <span class="service-learn-more" style="color:var(--gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; display:inline-block; margin-top:1.5rem; font-weight:600;">Learn More →</span>
          </div>
        </div>
        <div class="service-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => showPage('services')} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && showPage('services')}>
          <div class="card-3d-inner">
            <span class="service-icon">❋</span>
            <h3 class="service-name">Family Sessions</h3>
            <p style="color:var(--muted);font-size:0.85rem;line-height:1.7">Looking to take a picture with the whole clan? This session is perfect for you. At Meshach Olajide Photography, we understand the importance of telling a story through family portraits.</p>
            <span class="service-learn-more" style="color:var(--gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; display:inline-block; margin-top:1.5rem; font-weight:600;">Learn More →</span>
          </div>
        </div>
        <div class="service-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => showPage('services')} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && showPage('services')}>
          <div class="card-3d-inner">
            <span class="service-icon">♦</span>
            <h3 class="service-name">Weddings</h3>
            <p style="color:var(--muted);font-size:0.85rem;line-height:1.7">One of the most important days to have best-kept memories. Let us document timeless images that keep you reminiscing and feeling the same love whenever you look back.</p>
            <span class="service-learn-more" style="color:var(--gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; display:inline-block; margin-top:1.5rem; font-weight:600;">Learn More →</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- INSTAGRAM / SOCIAL PROOF -->
  <section class="section" style="border-top: 1px solid var(--border);">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 3rem; text-align: center;">
      <span class="section-label">social proof</span>
      <h2 style="font-family: var(--serif); font-style: italic; font-weight: 300; margin-bottom: 1rem;">follow our journey</h2>
      <p style="color:var(--muted); max-width:500px; margin: 0 auto 3rem; font-size:0.9rem;">
        Get a daily dose of visual inspiration and behind-the-scenes stories on Instagram.
      </p>
      
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; margin-bottom:3rem;">
        <div style="background:linear-gradient(145deg,#1e1508,#0c0c0c); aspect-ratio:1/1; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:var(--serif); font-size:3rem; color:rgba(201,167,78,0.08);" class="social-hover">◆</div>
        <div style="background:linear-gradient(145deg,#15201a,#0d1810); aspect-ratio:1/1; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:var(--serif); font-size:3rem; color:rgba(201,167,78,0.08);" class="social-hover">◈</div>
        <div style="background:linear-gradient(145deg,#151520,#0c0c18); aspect-ratio:1/1; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:var(--serif); font-size:3rem; color:rgba(201,167,78,0.08);" class="social-hover">◇</div>
        <div style="background:linear-gradient(145deg,#201518,#180d10); aspect-ratio:1/1; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:var(--serif); font-size:3rem; color:rgba(201,167,78,0.08);" class="social-hover">❋</div>
      </div>
      
      <a class="btn-outline" href="https://instagram.com/meshacholajidephotography" target="_blank" rel="noopener noreferrer">@meshacholajidephotography</a>
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
