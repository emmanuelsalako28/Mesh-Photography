<script>
  // Shell components
  import Navbar from './lib/components/Navbar.svelte';
  import MobileNav from './lib/components/MobileNav.svelte';
  import Footer from './lib/components/Footer.svelte';
  import Lightbox from './lib/components/Lightbox.svelte';

  // Page components
  import Home from './lib/pages/Home.svelte';
  import Portfolio from './lib/pages/Portfolio.svelte';
  import Services from './lib/pages/Services.svelte';
  import About from './lib/pages/About.svelte';
  import Booking from './lib/pages/Booking.svelte';
  import Contact from './lib/pages/Contact.svelte';

  // Routing and UI State
  let currentPage = $state('home');
  let isMobileNavOpen = $state(false);
  let lightbox = $state({ isOpen: false, title: '', style: '', symbol: '' });
  let isDarkMode = $state(false);

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  /** @type {Record<string, string>} */
  const pageTitles = {
    home: 'HOME - Meshach Olajide Photography',
    portfolio: 'PORTRAITS & WEDDINGS - Meshach Olajide Photography',
    services: 'SERVICES & PRICING - Meshach Olajide Photography',
    about: 'ABOUT - Meshach Olajide Photography',
    booking: 'BOOK A SESSION - Meshach Olajide Photography',
    contact: 'CONTACT & BOOKINGS - Meshach Olajide Photography'
  };

  // Helper functions
  /**
   * @param {string} page
   */
  function showPage(page) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleMobileNav() {
    isMobileNavOpen = !isMobileNavOpen;
  }

  /**
   * @param {string} title
   * @param {string} style
   * @param {string} symbol
   */
  function openLightbox(title, style = '', symbol = '') {
    lightbox = { isOpen: true, title, style, symbol };
  }

  function closeLightbox() {
    lightbox = { isOpen: false, title: '', style: '', symbol: '' };
  }
</script>

<svelte:head>
  <title>{pageTitles[currentPage]}</title>
</svelte:head>

<!-- NAV SHELL -->
<Navbar {currentPage} {showPage} {toggleMobileNav} {isDarkMode} {toggleTheme} />
<MobileNav isOpen={isMobileNavOpen} {toggleMobileNav} {showPage} />

<!-- PAGE ROUTER -->
<main>
  {#if currentPage === 'home'}
    <Home {showPage} {openLightbox} />
  {:else if currentPage === 'portfolio'}
    <Portfolio {showPage} {openLightbox} />
  {:else if currentPage === 'services'}
    <Services {showPage} />
  {:else if currentPage === 'about'}
    <About {showPage} />
  {:else if currentPage === 'booking'}
    <Booking />
  {:else if currentPage === 'contact'}
    <Contact />
  {/if}
</main>

<!-- FOOTER SHELL -->
<Footer isSimplified={currentPage !== 'home'} {showPage} />

<!-- LIGHTBOX MODAL -->
<Lightbox isOpen={lightbox.isOpen} title={lightbox.title} style={lightbox.style} symbol={lightbox.symbol} {closeLightbox} />

<style>
  main {
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }
</style>
