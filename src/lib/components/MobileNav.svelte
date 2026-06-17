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
  <a href="#home" onclick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
  <a href="#about" onclick={(e) => { e.preventDefault(); navigate('about'); }}>About</a>
  <a href="#portfolio" onclick={(e) => { e.preventDefault(); navigate('portfolio', 'all'); }}>Gallery</a>
  <a href="#videos" onclick={(e) => { e.preventDefault(); navigate('portfolio', 'videos'); }}>Videos</a>
  <a href="#blog" onclick={(e) => { e.preventDefault(); navigate('blog'); }}>Blog</a>
  <a href="#contact" onclick={(e) => { e.preventDefault(); navigate('contact'); }}>Contact & Bookings</a>
</div>
