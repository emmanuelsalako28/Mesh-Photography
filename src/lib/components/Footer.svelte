<script>
  let { isSimplified = false, showPage } = $props();
</script>

<footer class="site-footer">
  {#if !isSimplified}
    <div class="footer-inner">
      <!-- COLUMN 1: ABOUT -->
      <div class="footer-brand">
        <h4 class="footer-title">ABOUT</h4>
        <p class="footer-desc">
          Meshach Olajide Photography is a professional studio that tells visual stories. Headquartered in Tallinn, Estonia - Meshach Olajide specialises in Corporate Branding, Storytelling, Corporate Events, and Family Portraiture. At Meshach Olajide Photography, a camera is more than just a tool for capturing photos. It is used to tell visually appealing stories that inspire confidence, celebrate beauty and love as well as create timeless works of art.
        </p>
      </div>
      
      <!-- COLUMN 2: CONTACT -->
      <div class="footer-col">
        <h4 class="footer-title">CONTACT</h4>
        <div class="footer-contact-info">
          <p><a href="mailto:office@meshacholajide.com" class="contact-link">office@meshacholajide.com</a></p>
          <p><a href="tel:+2348138245455" class="contact-link">+234 813 824 5455</a></p>
          
          <div class="address-block">
            <span class="address-title">OLD TOWN STUDIO</span>
            <p class="address-text">Vana-Viru 15, 10111 Tallinn, Estonia.</p>
          </div>
          <div class="address-block">
            <span class="address-title">CITY CENTER STUDIO</span>
            <p class="address-text">Mustamäe tee 4, 10621 Tallinn, Estonia.</p>
          </div>
        </div>
      </div>
      
      <!-- COLUMN 3: QUICKLINKS -->
      <div class="footer-col">
        <h4 class="footer-title">QUICKLINKS</h4>
        <ul class="quicklinks-list">
          <li><a href="#home" onclick={(e) => { e.preventDefault(); showPage('home'); }}>HOME</a></li>
          <li><a href="#about" onclick={(e) => { e.preventDefault(); showPage('about'); }}>ABOUT</a></li>
          <li><a href="#blog" onclick={(e) => { e.preventDefault(); showPage('blog'); }}>BLOG</a></li>
          <li><a href="#portfolio" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'portraits'); }}>PORTRAITS</a></li>
          <li><a href="#portfolio" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'family'); }}>FAMILY</a></li>
          <li><a href="#portfolio" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'events'); }}>WEDDINGS</a></li>
          <li><a href="#portfolio" onclick={(e) => { e.preventDefault(); showPage('portfolio', 'videos'); }}>VIDEOS</a></li>
          <li><a href="#resources" onclick={(e) => { e.preventDefault(); }}>RESOURCES</a></li>
          <li><a href="#contact" onclick={(e) => { e.preventDefault(); showPage('contact'); }}>CONTACT & BOOKINGS</a></li>
        </ul>
      </div>
    </div>
  {/if}
  
  <!-- FOOTER BOTTOM -->
  <div class="footer-bottom" style={isSimplified ? 'max-width: 1100px; margin: 0 auto; padding: 1.5rem 0 0; border-top: none;' : ''}>
    <p class="copyright-text">
      COPYRIGHT © 2026 MESHACH OLAJIDE PHOTOGRAPHY. ALL RIGHTS RESERVED.
      &bull; 
      <a href="#admin" onclick={(e) => { e.preventDefault(); showPage('admin'); }} class="admin-link">STUDIO ADMIN</a>
    </p>
    
    <div class="social-links">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
      <a href="https://twitter.com/meshacholajide" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="social-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://www.instagram.com/meshacholajidephotography/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
    </div>
  </div>
</footer>

<style>
  /* Premium Dark Footer System */
  .site-footer {
    background: #0a0a0a !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding: 5rem 2rem 3rem !important;
    color: #e4e4e7;
    font-family: var(--sans), sans-serif;
  }
  
  .footer-inner {
    display: grid;
    grid-template-columns: 2fr 1.8fr 1fr;
    gap: 4rem;
    max-width: 1100px;
    margin: 0 auto 3.5rem;
  }
  
  .footer-title {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #ffffff;
    margin-bottom: 1.5rem;
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .footer-desc {
    font-size: 0.8rem;
    color: #a1a1aa;
    line-height: 1.8;
    max-width: 440px;
    margin: 0;
  }
  
  .footer-contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .footer-contact-info p {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.6;
  }
  
  .contact-link {
    color: #ffffff !important;
    text-decoration: none;
    transition: opacity 0.2s;
    font-weight: 500;
  }
  
  .contact-link:hover {
    opacity: 0.8;
  }
  
  .address-block {
    margin-top: 0.8rem;
  }
  
  .address-title {
    color: var(--gold, #C8A97E);
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 600;
  }
  
  .address-text {
    color: #a1a1aa !important;
    font-size: 0.8rem;
    line-height: 1.6;
    margin: 0;
  }
  
  .quicklinks-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  
  .quicklinks-list li {
    margin: 0;
  }
  
  .quicklinks-list a {
    font-size: 0.75rem;
    font-weight: 500;
    color: #a1a1aa !important;
    text-decoration: none;
    letter-spacing: 0.1em;
    transition: color 0.2s, padding-left 0.2s;
  }
  
  .quicklinks-list a:hover {
    color: #ffffff !important;
    padding-left: 4px;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1100px;
    margin: 0 auto;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding-top: 2rem;
  }
  
  .copyright-text {
    font-size: 0.7rem;
    color: #71717a;
    letter-spacing: 0.05em;
    margin: 0;
  }
  
  .admin-link {
    text-decoration: none;
    color: inherit;
    margin-left: 0.5rem;
    opacity: 0.5;
    transition: opacity 0.2s, color 0.2s;
  }
  
  .admin-link:hover {
    opacity: 1;
    color: #ffffff;
  }
  
  .social-links {
    display: flex;
    gap: 1.2rem;
    align-items: center;
  }
  
  .social-icon {
    color: #a1a1aa;
    transition: color 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .social-icon:hover {
    color: #ffffff;
    transform: translateY(-2px);
  }
  
  /* Responsive Adjustments */
  @media (max-width: 991px) {
    .footer-inner {
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
    }
    .footer-brand {
      grid-column: span 2;
    }
  }
  
  @media (max-width: 768px) {
    .site-footer {
      padding: 4rem 1.5rem 2.5rem !important;
    }
    .footer-inner {
      grid-template-columns: 1fr;
      gap: 2.5rem;
      margin-bottom: 2.5rem;
    }
    .footer-brand {
      grid-column: span 1;
    }
    .footer-bottom {
      flex-direction: column;
      gap: 1.5rem;
      align-items: flex-start;
      text-align: left;
    }
    .social-links {
      align-self: flex-start;
    }
  }
</style>
