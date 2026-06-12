<script>
  let { showPage } = $props();
</script>

<div class="page active" id="page-about">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">the photographer</span>
    <h1>about the studio</h1>
    <p>Every frame begins with a story. Here's ours.</p>
  </div>
  <div class="about-full">
    <div class="about-story">
      <div class="big-frame">◆</div>
      <div>
        <span class="section-label">My Story</span>
        <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,3vw,2.5rem);margin-bottom:1.5rem;line-height:1.2">Turning Ordinary<br>Moments Into <em style="font-style:italic;color:var(--gold)">Art</em></h2>
        <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.25rem">Meshach Olajide Photography is a professional studio that tells visual stories. Headquartered in Lagos, Nigeria, we specialise in Corporate Branding, Storytelling, Corporate Events, and Family Portraiture.</p>
        <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.25rem">At Meshach Olajide Photography, a camera is more than just a tool for capturing photos. It is used to tell visually appealing stories that inspire confidence, celebrate beauty and love, as well as create timeless works of art.</p>
        <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:2rem">Every session is a structured collaboration. Our style remains cinematic, crisp, and editorial with an organic depth. We believe the finest frames emerge when the lens is forgotten.</p>
        <button class="btn-primary" onclick={() => showPage('booking')}>Work With Me</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stat-row">
      <div class="stat-item"><span class="stat-num">500+</span><span class="stat-label">galleries delivered</span></div>
      <div class="stat-item"><span class="stat-num">8+</span><span class="stat-label">years of experience</span></div>
      <div class="stat-item"><span class="stat-num">98%</span><span class="stat-label">resolved clarity</span></div>
      <div class="stat-item"><span class="stat-num">200+</span><span class="stat-label">corporate clients</span></div>
    </div>

    <!-- Photography Style -->
    <div style="margin-bottom:5rem">
      <span class="section-label">Approach & Style</span>
      <h2 style="font-family:var(--serif);font-size:2rem;margin-bottom:0.75rem">Behind the Lens</h2>
      <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;max-width:600px;margin-bottom:3rem">Our photography is rooted in three principles: light, emotion, and story. We work with natural and studio lighting to create images that feel alive. We shoot with intention — every frame is composed with care, not just captured in the moment.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border)">
        <div style="background:var(--dark);padding:2.5rem 2rem;text-align:center">
          <div style="font-size:2rem;color:var(--gold);margin-bottom:1rem">◆</div>
          <h3 style="font-family:var(--serif);font-size:1.1rem;margin-bottom:0.5rem">Natural Light</h3>
          <p style="color:var(--muted);font-size:0.8rem;line-height:1.7">Harnessing golden hour and soft diffused light for warmth and depth.</p>
        </div>
        <div style="background:var(--dark);padding:2.5rem 2rem;text-align:center">
          <div style="font-size:2rem;color:var(--gold);margin-bottom:1rem">◈</div>
          <h3 style="font-family:var(--serif);font-size:1.1rem;margin-bottom:0.5rem">Candid Moments</h3>
          <p style="color:var(--muted);font-size:0.8rem;line-height:1.7">The unscripted, genuine expressions that make photographs timeless.</p>
        </div>
        <div style="background:var(--dark);padding:2.5rem 2rem;text-align:center">
          <div style="font-size:2rem;color:var(--gold);margin-bottom:1rem">◇</div>
          <h3 style="font-family:var(--serif);font-size:1.1rem;margin-bottom:0.5rem">Intentional Editing</h3>
          <p style="color:var(--muted);font-size:0.8rem;line-height:1.7">A consistent, cinematic post-process that elevates without distorting.</p>
        </div>
      </div>
    </div>

    <!-- Why Choose -->
    <div>
      <span class="section-label">Why Clients Choose Us</span>
      <h2 style="font-family:var(--serif);font-size:2rem;margin-bottom:0.5rem">The Difference</h2>
      <p style="color:var(--muted);font-size:0.85rem;margin-bottom:0">What sets a Meshach Olajide Photography experience apart from the rest.</p>
      <div class="why-grid">
        <div class="why-item">
          <span class="why-icon">⚡</span>
          <div class="why-title">Fast Turnaround</div>
          <p class="why-text">Your edited gallery is delivered within 5–7 business days. Premium clients receive priority 3-day turnaround. No endless waiting.</p>
        </div>
        <div class="why-item">
          <span class="why-icon">✦</span>
          <div class="why-title">Premium Retouching</div>
          <p class="why-text">Every image is individually edited with care — color corrected, retouched, and optimized for print and digital use.</p>
        </div>
        <div class="why-item">
          <span class="why-icon">◆</span>
          <div class="why-title">Creative Direction</div>
          <p class="why-text">Not sure how to pose or what to wear? We provide full creative direction from outfit consultation to location scouting.</p>
        </div>
        <div class="why-item">
          <span class="why-icon">◇</span>
          <div class="why-title">Reliable Delivery</div>
          <p class="why-text">We treat every session with the seriousness it deserves. Consistent quality and professional standards, every time.</p>
        </div>
      </div>
    </div>
  </div>
</div>
