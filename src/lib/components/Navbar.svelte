<script>
  let { currentPage = 'home', showPage, toggleMobileNav, isDarkMode = false, toggleTheme } = $props();
  let y = $state(0);
</script>

<svelte:window bind:scrollY={y} />

<nav class:scrolled={y > 60}>
  <a class="nav-logo signature-logo" href="#home" onclick={(e) => { e.preventDefault(); showPage('home'); }}>
    <span class="sig-name">Meshach Olajide</span>
    <span class="sig-sub">PHOTOGRAPHY</span>
  </a>
    <div class="nav-links">
    <a href="#home" class:active={currentPage === 'home'} onclick={(e) => { e.preventDefault(); showPage('home'); }}>Home</a>
    <a href="#about" class:active={currentPage === 'about'} onclick={(e) => { e.preventDefault(); showPage('about'); }}>About</a>
    
    <div class="nav-item-dropdown">
      <a href="#portfolio" class:active={currentPage === 'portfolio'} onclick={(e) => { e.preventDefault(); showPage('portfolio', 'all'); }}>
        Gallery <span class="chevron">˅</span>
      </a>
      <div class="nav-dropdown-content">
        <a href="#portfolio-portraits" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'portraits'); }}>Portraits</a>
        <a href="#portfolio-events" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'events'); }}>Events</a>
        <a href="#portfolio-family" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'family'); }}>Family</a>
        <a href="#portfolio-corporate" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'kids'); }}>Kids</a>
        <a href="#portfolio-fashion" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'maternity'); }}>Maternity</a>
        <a href="#portfolio-fashion" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'fashion'); }}>Fashion</a>
        <a href="#portfolio-all" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'all'); }}>All Pictures</a>
      </div>
    </div>
    
    <div class="nav-item-dropdown">
      <a href="#portfolio" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'videos'); }}>
        videos <span class="chevron">˅</span>
      </a>
      <div class="nav-dropdown-content">
        <a href="#portfolio-videos" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'videos'); }}>Video Showreel</a>
        <a href="#portfolio-all" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'all'); }}>All Videos</a>
      </div>
    </div>
    
    <a href="#blog" class:active={currentPage === 'blog'} onclick={(e) => { e.preventDefault(); showPage('blog'); }}>Blog</a>
    
    <div class="nav-item-dropdown">
      <a href="#contact" class:active={currentPage === 'contact' || currentPage === 'booking'} onclick={(e) => { e.preventDefault(); showPage('contact'); }}>
        contact & bookings <span class="chevron">˅</span>
      </a>
      <div class="nav-dropdown-content">
        <a href="#contact" onclick={(e) => { e.preventDefault(); showPage('contact'); }}>Get In Touch</a>
        <a href="#booking" onclick={(e) => { e.preventDefault(); showPage('booking'); }}>Book a Session</a>
      </div>
    </div>
  </div>

  <div class="nav-actions" style="display: flex; align-items: center; gap: 1.5rem;">
    <button class="theme-toggle-btn" onclick={toggleTheme} aria-label="Toggle Theme Mode">
      {#if isDarkMode}
        <span style="font-size: 1.2rem;">☀️</span>
      {:else}
        <span style="font-size: 1.2rem;">🌙</span>
      {/if}
    </button>
    <button class="hamburger" onclick={toggleMobileNav} aria-label="Toggle Navigation Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>
