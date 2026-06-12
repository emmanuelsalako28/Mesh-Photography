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
  import Blog from './lib/pages/Blog.svelte';
  import Admin from './lib/pages/Admin.svelte';

  // Routing and UI State
  let currentPage = $state('home');
  let portfolioCategory = $state('all');
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
    contact: 'CONTACT & BOOKINGS - Meshach Olajide Photography',
    blog: 'THE JOURNAL - Meshach Olajide Photography',
    admin: 'STUDIO ADMIN - Meshach Olajide Photography'
  };

  // Helper functions
  /**
   * @param {string} page
   * @param {string} [category]
   */
  function showPage(page, category = 'all') {
    currentPage = page;
    if (page === 'portfolio') {
      portfolioCategory = category;
    }
    // Update hash for admin navigation to maintain state on reload
    if (page === 'admin') {
      window.location.hash = '#admin';
    } else if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
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
  /**
   * @param {string} title
   * @param {string} style
   * @param {string} symbol
   * @param {string} imageUrl
   */
  function openLightbox(title, style = '', symbol = '', imageUrl = '') {
    lightbox = { isOpen: true, title, style, symbol, imageUrl };
  }

  function closeLightbox() {
    lightbox = { isOpen: false, title: '', style: '', symbol: '', imageUrl: '' };
  }

  // Parse URL hash or query params on load/hashchange
  $effect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || params.get('page') === 'admin') {
        currentPage = 'admin';
      }
    };
    
    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  });
</script>

<svelte:head>
  <title>{pageTitles[currentPage]}</title>
</svelte:head>

<!-- NAV SHELL -->
{#if currentPage !== 'admin'}
  <Navbar {currentPage} {showPage} {toggleMobileNav} {isDarkMode} {toggleTheme} />
  <MobileNav isOpen={isMobileNavOpen} {toggleMobileNav} {showPage} />
{/if}

<!-- PAGE ROUTER -->
<main>
  {#if currentPage === 'home'}
    <Home {showPage} {openLightbox} />
  {:else if currentPage === 'portfolio'}
    <Portfolio {showPage} {openLightbox} bind:activeCategory={portfolioCategory} />
  {:else if currentPage === 'services'}
    <Services {showPage} />
  {:else if currentPage === 'about'}
    <About {showPage} />
  {:else if currentPage === 'booking'}
    <Booking />
  {:else if currentPage === 'contact'}
    <Contact />
  {:else if currentPage === 'blog'}
    <Blog />
  {:else if currentPage === 'admin'}
    <Admin {showPage} />
  {/if}
</main>

<!-- STICKY MOBILE CONVERSION BAR -->
{#if currentPage !== 'admin'}
  <div class="mobile-sticky-bar">
    <a class="btn-primary-mobile" href="#booking" onclick={(e) => { e.preventDefault(); showPage('booking'); }}>Book Session</a>
    <a class="btn-whatsapp-mobile" href="https://wa.me/2348151140526" target="_blank" rel="noopener noreferrer">WhatsApp</a>
  </div>
{/if}

<!-- FOOTER SHELL -->
<Footer isSimplified={currentPage !== 'home'} {showPage} />

<!-- LIGHTBOX MODAL -->
<Lightbox isOpen={lightbox.isOpen} title={lightbox.title} style={lightbox.style} symbol={lightbox.symbol} imageUrl={lightbox.imageUrl} {closeLightbox} />

<style>
  main {
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }
</style>
