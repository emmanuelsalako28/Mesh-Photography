<script>
  let { isOpen = false, toggleMobileNav, showPage } = $props();

  /**
   * @param {string} page
   */
  function navigate(page) {
    showPage(page);
    toggleMobileNav();
  }
</script>

<div class="mobile-nav" class:open={isOpen}>
  <button class="mobile-close" onclick={toggleMobileNav}>&times;</button>
  <a href="#home" onclick={(e) => { e.preventDefault(); navigate('home'); }}>home</a>
  <a href="#portfolio" onclick={(e) => { e.preventDefault(); navigate('portfolio'); }}>portfolio</a>
  <a href="#services" onclick={(e) => { e.preventDefault(); navigate('services'); }}>services</a>
  <a href="#about" onclick={(e) => { e.preventDefault(); navigate('about'); }}>about</a>
  <a href="#booking" onclick={(e) => { e.preventDefault(); navigate('booking'); }}>booking</a>
  <a href="#contact" onclick={(e) => { e.preventDefault(); navigate('contact'); }}>contact</a>
</div>
