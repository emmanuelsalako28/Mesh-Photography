<script>
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
  let activeTestimonial = $state(0);

  // Auto-playing hero slider
  $effect(() => {
    const timer = setInterval(() => {
      activeSlide = (activeSlide + 1) % 2;
    }, 5500);
    return () => clearInterval(timer);
  });

  function nextTestimonial() {
    activeTestimonial = (activeTestimonial + 1) % 3;
  }

  function prevTestimonial() {
    activeTestimonial = (activeTestimonial - 1 + 3) % 3;
  }

  // Auto-playing testimonials slider
  $effect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 7000);
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
      quote: "The team at Mesh-Photography is exceptionally professional. Even when we arrived unprepared for our shoot, they guided us through poses and made us feel at ease. The final portraits are absolute masterpieces.",
      author: "Damilola Benson",
      role: "Corporate Branding Client",
      org: "Benson Holdings",
      portraitClass: "ph-portrait",
      portraitArt: "◆"
    },
    {
      quote: "Meshach documented our wedding day with so much grace. The lighting and candid moments caught on camera are truly timeless. Looking back at the images makes us feel the exact same love.",
      author: "Sarah & Tunde",
      role: "Wedding Session",
      org: "Private Clients",
      portraitClass: "ph-wedding",
      portraitArt: "♦"
    },
    {
      quote: "I had a personal branding session at the studio. They are true visual storytellers who know how to capture confidence. I struggled to select my favorites because all the images were so lovely!",
      author: "Victoria Alao",
      role: "Creative Director",
      org: "Alao Agency",
      portraitClass: "ph-fashion",
      portraitArt: "✦"
    }
  ];

  let filteredPhotos = $derived(
    activeFilter === 'all'
      ? photos
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
  <section class="section" style="background:transparent; position:relative; z-index:10; border-top: 1px solid var(--border); padding: 6rem 0 0 0;">
    <div style="max-width:1200px;margin:0 auto; padding: 0 3rem;">
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
    </div>

    <div class="photo-grid reveal" style="width: 100%; margin-top: 3rem; gap: 0;">
      {#each filteredPhotos as photo (photo.id)}
        <div class="photo-card card-3d" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D} onclick={() => openLightbox(photo.label, photo.class, photo.art)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && openLightbox(photo.label, photo.class, photo.art)}>
          <div class="photo-placeholder {photo.class} card-3d-inner">
            <div class="photo-art">{photo.art}</div>
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

  <!-- TESTIMONIALS -->
  <section class="section" style="border-top: 1px solid var(--border);">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 3rem;">
      <div class="section-header reveal">
        <div>
          <span class="section-label">kind words</span>
          <h2 class="section-title" style="font-family: var(--serif); font-style: italic; font-weight: 300;">testimonials</h2>
        </div>
        <p class="section-sub">Read what our clients say about their sessions and final visual stories.</p>
      </div>
      
      <div class="testimonials-slider reveal">
        {#key activeTestimonial}
          <div class="testimonial-slide-layout">
            <div class="testimonial-slide-left">
              <div class="testimonial-portrait-frame {testimonials[activeTestimonial].portraitClass}">
                <span class="testimonial-portrait-art">{testimonials[activeTestimonial].portraitArt}</span>
              </div>
            </div>
            <div class="testimonial-slide-right">
              <span class="testimonial-slide-quote-icon">“</span>
              <div class="testimonial-stars">★★★★★</div>
              <p class="testimonial-slide-quote">“{testimonials[activeTestimonial].quote}”</p>
              <div class="testimonial-meta">
                <h3 class="testimonial-slide-author">{testimonials[activeTestimonial].author}</h3>
                <p class="testimonial-slide-title">
                  {testimonials[activeTestimonial].role} <span style="color:var(--gold)">/</span> {testimonials[activeTestimonial].org}
                </p>
              </div>
            </div>
          </div>
        {/key}

        <div class="testimonial-controls">
          <button class="testimonial-control-btn" onclick={prevTestimonial} aria-label="Previous Testimonial">
            <span>←</span>
          </button>
          
          <div class="testimonial-indicators">
            {#each testimonials as _, idx}
              <button 
                class="testimonial-dot" 
                class:active={idx === activeTestimonial} 
                onclick={() => activeTestimonial = idx} 
                aria-label="Go to testimonial {idx + 1}"
              ></button>
            {/each}
          </div>

          <button class="testimonial-control-btn" onclick={nextTestimonial} aria-label="Next Testimonial">
            <span>→</span>
          </button>
        </div>
        
        <div class="testimonial-progress-container">
          {#key activeTestimonial}
            <div class="testimonial-progress-bar"></div>
          {/key}
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
