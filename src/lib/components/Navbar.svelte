<script>
  let { currentPage = 'home', showPage, toggleMobileNav, isDarkMode = false, toggleTheme } = $props();
  let y = $state(0);
</script>

<svelte:window bind:scrollY={y} />

<nav class:scrolled={y > 60}>
  <a class="nav-logo" href="#home" onclick={(e) => { e.preventDefault(); showPage('home'); }}>
    Meshach Olajide
  </a>
  
  <div class="nav-links">
    <a href="#portfolio" class:active={currentPage === 'portfolio'} onclick={(e) => { e.preventDefault(); showPage('portfolio'); }}>portfolio</a>
    <a href="#services" class:active={currentPage === 'services'} onclick={(e) => { e.preventDefault(); showPage('services'); }}>services</a>
    <a href="#about" class:active={currentPage === 'about'} onclick={(e) => { e.preventDefault(); showPage('about'); }}>about</a>
    <a href="#contact" class:active={currentPage === 'contact'} onclick={(e) => { e.preventDefault(); showPage('contact'); }}>contact</a>
    <a href="#booking" class="nav-cta" class:active={currentPage === 'booking'} onclick={(e) => { e.preventDefault(); showPage('booking'); }}>book session</a>
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
