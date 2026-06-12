<script>
  let { isSimplified = false, showPage } = $props();
</script>

<footer>
  {#if !isSimplified}
    <div class="footer-inner">
      <div class="footer-brand">
        <h4 style="font-family: var(--serif); font-style: italic; font-weight: 300;">about meshach olajide</h4>
        <p>
          Meshach Olajide Photography is a professional studio that tells visual stories. 
          Headquartered in Tallinn, Estonia - Meshach Olajide specialises in Corporate Branding, Storytelling, Corporate Events, and Family Portraiture. At Meshach Olajide Photography, a camera is more than just a tool for capturing photos. It is used to tell visually appealing stories that inspire confidence, celebrate beauty and love as well as create timeless works of art.
        </p>
      </div>
      <div class="footer-col">
        <h4>contact info</h4>
        <p>
          <a href="mailto:office@meshacholajide.com">office@meshacholajide.com</a> <br>
          <a href="tel:+2348138245455">+234 813 824 5455</a>
        </p>
        <br>
        <p style="font-size: 0.75rem;">
          <span style="color: var(--gold); text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.1em; display: block; margin-bottom: 0.25rem;">old town studio</span>
          Vana-Viru 15, 10111 Tallinn, Estonia.
        </p>
        <br>
        <p style="font-size: 0.75rem;">
          <span style="color: var(--gold); text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.1em; display: block; margin-bottom: 0.25rem;">city center studio</span>
          Mustamäe tee 4, 10621 Tallinn, Estonia.
        </p>
      </div>
      <div class="footer-col">
        <h4>quicklinks</h4>
        <ul>
          <li><a href="#home" onclick={(e) => { e.preventDefault(); showPage('home'); }}>HOME</a></li>
          <li><a href="#about" onclick={(e) => { e.preventDefault(); showPage('about'); }}>ABOUT</a></li>
          <li><a href="#portfolio" onclick={(e) => { e.preventDefault(); showPage('portfolio'); }}>PORTRAITS</a></li>
          <li><a href="#services" onclick={(e) => { e.preventDefault(); showPage('services'); }}>SERVICES</a></li>
          <li><a href="#booking" onclick={(e) => { e.preventDefault(); showPage('booking'); }}>BOOKING</a></li>
          <li><a href="#contact" onclick={(e) => { e.preventDefault(); showPage('contact'); }}>CONTACT</a></li>
        </ul>
      </div>
    </div>
  {/if}
  
  <div class="footer-bottom" style={isSimplified ? 'max-width:1100px;margin:0 auto;padding:1.5rem 0 0;border-top:none;' : ''}>
    <p>COPYRIGHT © 2026 MESHACH OLAJIDE PHOTOGRAPHY. ALL RIGHTS RESERVED. &bull; <a href="#admin" onclick={(e) => { e.preventDefault(); showPage('admin'); }} style="text-decoration: none; color: inherit; opacity: 0.6; transition: opacity 0.2s;" onmouseenter={(e) => e.currentTarget.style.opacity = '1'} onmouseleave={(e) => e.currentTarget.style.opacity = '0.6'} class="admin-link">STUDIO ADMIN</a></p>
    <div class="social-links">
      <a href="https://www.instagram.com/meshacholajidephotography/" target="_blank" rel="noopener noreferrer">IG</a>
      <a href="https://twitter.com/meshacholajide" target="_blank" rel="noopener noreferrer">X</a>
      <a href="https://www.linkedin.com/in/meshacholajide" target="_blank" rel="noopener noreferrer">LN</a>
      <a href="https://www.youtube.com/@meshacholajide" target="_blank" rel="noopener noreferrer">YT</a>
    </div>
  </div>
</footer>
