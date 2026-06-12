<script>
  let { isOpen = false, toggleMobileNav, showPage } = $props();

  /**
   * @param {string} page
   * @param {string} [category]
   */
  function navigate(page, category = 'all') {
    showPage(page, category);
    toggleMobileNav();
  }
</script>

<div class="mobile-nav" class:open={isOpen}>
  <button class="mobile-close" onclick={toggleMobileNav}>&times;</button>
  <a href="#home" onclick={(e) => { e.preventDefault(); navigate('home'); }}>home</a>
  <a href="#about" onclick={(e) => { e.preventDefault(); navigate('about'); }}>about</a>
  <a href="#portfolio" onclick={(e) => { e.preventDefault(); navigate('portfolio', 'all'); }}>pictures</a>
  <a href="#videos" onclick={(e) => { e.preventDefault(); navigate('portfolio', 'videos'); }}>videos</a>
  <a href="#blog" onclick={(e) => { e.preventDefault(); navigate('blog'); }}>blog</a>
  <a href="#contact" onclick={(e) => { e.preventDefault(); navigate('contact'); }}>contact & bookings</a>
</div>
