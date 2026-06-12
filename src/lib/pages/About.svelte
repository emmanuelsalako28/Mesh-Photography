<script>
  import { onMount } from 'svelte';
  import { supabase } from '../supabaseClient.js';

  let { showPage } = $props();

  const defaultProfile = {
    bio_title: `Turning Ordinary<br>Moments Into <em style="font-style:italic;color:var(--gold)">Art</em>`,
    bio_paragraph_1: "Meshach Olajide Photography is a professional studio that tells visual stories. Headquartered in Tallinn, Estonia, we specialise in Corporate Branding, Storytelling, Corporate Events, and Family Portraiture.",
    bio_paragraph_2: "At Meshach Olajide Photography, a camera is more than just a tool for capturing photos. It is used to tell visually appealing stories that inspire confidence, celebrate beauty and love, as well as create timeless works of art.",
    bio_paragraph_3: "Every session is a structured collaboration. Our style remains cinematic, crisp, and editorial with an organic depth. We believe the finest frames emerge when the lens is forgotten.",
    stats_sessions: "500+",
    stats_clients: "100+",
    stats_experience: "5+",
    stats_response_time: "24hr"
  };

  let profile = $state({ ...defaultProfile });

  onMount(async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('about_profile')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        if (data) {
          profile = data;
        }
      } catch (err) {
        console.warn('Could not load profile from Supabase, using defaults:', err);
      }
    }
  });
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
        <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,3vw,2.5rem);margin-bottom:1.5rem;line-height:1.2">
          {@html profile.bio_title}
        </h2>
        <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.25rem">{profile.bio_paragraph_1}</p>
        <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.25rem">{profile.bio_paragraph_2}</p>
        <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:2rem">{profile.bio_paragraph_3}</p>
        <button class="btn-primary" onclick={() => showPage('booking')}>Work With Me</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stat-row">
      <div class="stat-item"><span class="stat-num">{profile.stats_sessions}</span><span class="stat-label">Sessions Delivered</span></div>
      <div class="stat-item"><span class="stat-num">{profile.stats_clients}</span><span class="stat-label">Happy Clients</span></div>
      <div class="stat-item"><span class="stat-num">{profile.stats_experience}</span><span class="stat-label">Years Experience</span></div>
      <div class="stat-item"><span class="stat-num">{profile.stats_response_time}</span><span class="stat-label">Response Time</span></div>
    </div>

    <!-- Philosophy Brand Story -->
    <div style="text-align:center; max-width:800px; margin: 5rem auto 7rem; padding: 0 1.5rem;">
      <h3 style="font-family:var(--serif); font-size:1.8rem; color:var(--gold); margin-bottom:1.5rem; font-style:italic; font-weight: 300;">Our Philosophy</h3>
      <p style="color:var(--muted); font-size:1rem; line-height:1.9;">
        Every click of the shutter is a commitment to excellence. We don't just take photographs; we craft visual legacies. By blending editorial art direction with client comfort, we ensure that every session is not just a service, but a memorable creative experience that yields timeless imagery.
      </p>
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
