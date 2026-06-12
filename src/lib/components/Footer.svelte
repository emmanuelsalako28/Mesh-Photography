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
          Headquartered in Lagos, Nigeria - Meshach Olajide specialises in Corporate Branding, Storytelling, Corporate Events, and Family Portraiture. At Meshach Olajide Photography, a camera is more than just a tool for capturing photos. It is used to tell visually appealing stories that inspire confidence, celebrate beauty and love as well as create timeless works of art.
        </p>
      </div>
      <div class="footer-col">
        <h4>contact info</h4>
        <p>
          <a href="mailto:office@meshacholajide.com">office@meshacholajide.com</a> <br>
          <a href="tel:+2348151140526">+234 815 114 0526</a>
        </p>
        <br>
        <p style="font-size: 0.75rem;">
          <span style="color: var(--gold); text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.1em; display: block; margin-bottom: 0.25rem;">island studio</span>
          1 Bunmi-Olowude St, Lekki Phase 1, Lekki, Lagos State.
        </p>
        <br>
        <p style="font-size: 0.75rem;">
          <span style="color: var(--gold); text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.1em; display: block; margin-bottom: 0.25rem;">mainland studio</span>
          90 Victoria Street, Ogudu, Lagos State.
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
    <p>COPYRIGHT © 2026 MESHACH OLAJIDE PHOTOGRAPHY. ALL RIGHTS RESERVED.</p>
    <div class="social-links">
      <a href="https://www.instagram.com/meshacholajide/" target="_blank" rel="noopener noreferrer">IG</a>
      <a href="https://twitter.com/meshacholajide" target="_blank" rel="noopener noreferrer">X</a>
      <a href="https://www.linkedin.com/in/meshacholajide" target="_blank" rel="noopener noreferrer">LN</a>
      <a href="https://www.youtube.com/@meshacholajide" target="_blank" rel="noopener noreferrer">YT</a>
    </div>
  </div>
</footer>
