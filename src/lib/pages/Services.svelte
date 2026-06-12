<script>
  let { showPage } = $props();

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
</script>

<div class="page active" id="page-services">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">tailored pricing</span>
    <h1>packages & pricing</h1>
    <p>Every session is designed to preserve your memories with highest fidelity.</p>
  </div>
  
  <div class="services-page">
    <div class="pricing-grid reveal">
      <div class="pricing-card card-3d" role="presentation" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D}>
        <div class="card-3d-inner">
          <h3 class="pricing-name">Starter Session</h3>
          <div class="pricing-price">₦50,000</div>
          <p style="color:var(--muted);font-size:0.8rem;margin-bottom:1rem">A focused, quick capture session suitable for milestones, simple headshots, or quick profile updates.</p>
          <ul class="pricing-list">
            <li>1-hour studio session</li>
            <li>1 outfit change</li>
            <li>15 edited digital images</li>
            <li>Online gallery access</li>
            <li>7-day delivery</li>
          </ul>
          <button class="btn-primary" onclick={() => showPage('booking')} style="width: 100%;">Select Starter</button>
          <a href="#contact" onclick={(e) => { e.preventDefault(); showPage('contact'); }} style="display:block; text-align:center; color:var(--gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; margin-top:1rem; font-weight:600; text-decoration:none;">Inquire For Details →</a>
        </div>
      </div>

      <div class="pricing-card featured card-3d" role="presentation" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D}>
        <div class="card-3d-inner">
          <span class="pricing-badge">Signature</span>
          <h3 class="pricing-name">Signature Session</h3>
          <div class="pricing-price">₦100,000</div>
          <p style="color:var(--muted);font-size:0.8rem;margin-bottom:1rem">The standard photography session. Allows full creative styling, posture direction, and choice of studio or outdoor spaces.</p>
          <ul class="pricing-list">
            <li>2-hour studio/outdoor session</li>
            <li>2 outfit changes</li>
            <li>30 edited digital images</li>
            <li>Creative direction consulting</li>
            <li>Online gallery access</li>
            <li>5-day delivery</li>
          </ul>
          <button class="btn-primary" onclick={() => showPage('booking')} style="width: 100%;">Select Signature</button>
          <a href="#contact" onclick={(e) => { e.preventDefault(); showPage('contact'); }} style="display:block; text-align:center; color:var(--gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; margin-top:1rem; font-weight:600; text-decoration:none;">Inquire For Details →</a>
        </div>
      </div>

      <div class="pricing-card card-3d" role="presentation" onmousemove={handleMouseMove3D} onmouseleave={handleMouseLeave3D}>
        <div class="card-3d-inner">
          <h3 class="pricing-name">Premium Experience</h3>
          <div class="pricing-price">₦200,000</div>
          <p style="color:var(--muted);font-size:0.8rem;margin-bottom:1rem">An exhaustive, multi-set production session. Includes comprehensive direction, makeup artist coordination, and USB archiving.</p>
          <ul class="pricing-list">
            <li>Half-day (up to 4 hours)</li>
            <li>Unlimited outfit changes</li>
            <li>60+ edited digital images</li>
            <li>Full creative direction</li>
            <li>Makeup coordination</li>
            <li>Online gallery + USB delivery</li>
            <li>Priority 3-day delivery</li>
          </ul>
          <button class="btn-primary" onclick={() => showPage('booking')} style="width: 100%;">Select Experience</button>
          <a href="#contact" onclick={(e) => { e.preventDefault(); showPage('contact'); }} style="display:block; text-align:center; color:var(--gold); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; margin-top:1rem; font-weight:600; text-decoration:none;">Inquire For Details →</a>
        </div>
      </div>
    </div>

    <!-- Details of individual categories -->
    <div style="margin-top:8rem">
      <span class="section-label">our fields</span>
      <h2 style="font-family:var(--serif); font-size:2rem; font-style:italic; font-weight:300; margin-bottom:3rem">detailed sessions</h2>

      <div class="service-section">
        <div>
          <span class="service-icon" style="font-size:2.5rem;display:block;margin-bottom:1rem;color:var(--gold)">◆</span>
          <h3 style="font-family:var(--serif);font-size:1.6rem;font-style:italic;font-weight:300;margin-bottom:1rem">Portrait Photography</h3>
          <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.5rem">Whether you're celebrating a milestone, building your personal brand, or simply want stunning photographs that reflect who you are — portrait sessions are our specialty. We create a relaxed, comfortable environment where your authentic self shines through.</p>
          <ul class="pricing-list" style="margin-bottom:2rem; list-style: none;">
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Personal branding shoots</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Birthday & graduation portraits</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Friendship & group portraits</li>
          </ul>
          <button class="btn-outline" onclick={() => showPage('booking')}>Initiate Portrait Session</button>
        </div>
        <div style="background:linear-gradient(145deg,#1e1508,#0c0c0c);aspect-ratio:4/5;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:6rem;color:rgba(201,167,78,0.06)">◆</div>
      </div>

      <div class="service-section">
        <div style="background:linear-gradient(145deg,#15201a,#0d1810);aspect-ratio:4/3;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:6rem;color:rgba(201,167,78,0.06)">◈</div>
        <div>
          <span class="service-icon" style="font-size:2.5rem;display:block;margin-bottom:1rem;color:var(--gold)">◈</span>
          <h3 style="font-family:var(--serif);font-size:1.6rem;font-style:italic;font-weight:300;margin-bottom:1rem">Event Coverage</h3>
          <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.5rem">From intimate birthday gatherings to large-scale conferences and church events — we document every detail, every emotion, and every moment that makes your event unforgettable.</p>
          <ul class="pricing-list" style="margin-bottom:2rem; list-style: none;">
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Birthdays & anniversaries</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Corporate conferences & summits</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Art activations & showcases</li>
          </ul>
          <button class="btn-outline" onclick={() => showPage('booking')}>Initiate Event Coverage</button>
        </div>
      </div>

      <div class="service-section">
        <div>
          <span class="service-icon" style="font-size:2.5rem;display:block;margin-bottom:1rem;color:var(--gold)">❋</span>
          <h3 style="font-family:var(--serif);font-size:1.6rem;font-style:italic;font-weight:300;margin-bottom:1rem">Family Sessions</h3>
          <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.5rem">Family is everything. Whether it's the whole clan coming together, a maternity shoot capturing new life, or newborn images to cherish forever — we bring warmth and care to every family session.</p>
          <ul class="pricing-list" style="margin-bottom:2rem; list-style: none;">
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Family group portraits</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Maternity & expectant shoots</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Baby & child portraits</li>
          </ul>
          <button class="btn-outline" onclick={() => showPage('booking')}>Initiate Family Session</button>
        </div>
        <div style="background:linear-gradient(145deg,#201518,#180d10);aspect-ratio:4/5;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:6rem;color:rgba(201,167,78,0.06)">❋</div>
      </div>

      <div class="service-section">
        <div style="background:linear-gradient(145deg,#151520,#0c0c18);aspect-ratio:4/3;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:6rem;color:rgba(201,167,78,0.06)">◇</div>
        <div>
          <span class="service-icon" style="font-size:2.5rem;display:block;margin-bottom:1rem;color:var(--gold)">◇</span>
          <h3 style="font-family:var(--serif);font-size:1.6rem;font-style:italic;font-weight:300;margin-bottom:1rem">Corporate Photography</h3>
          <p style="color:var(--muted);font-size:0.88rem;line-height:1.9;margin-bottom:1.5rem">Your brand's visual identity starts with powerful imagery. We deliver polished, professional photographs that communicate authority, trustworthiness, and excellence across all your corporate platforms.</p>
          <ul class="pricing-list" style="margin-bottom:2rem; list-style: none;">
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Executive & team headshots</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Office environment documentation</li>
            <li style="font-size: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--gold)">—</span> Annual reports & marketing collateral</li>
          </ul>
          <button class="btn-outline" onclick={() => showPage('booking')}>Initiate Corporate Session</button>
        </div>
      </div>
    </div>
  </div>
</div>
