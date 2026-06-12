<script>
  let contactData = $state({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  /**
   * @param {SubmitEvent} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    alert("Message sent! We'll respond within 24 hours.");
    contactData = {
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: ''
    };
  }
</script>

<div class="page active" id="page-contact">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">get in touch</span>
    <h1>contact the studio</h1>
    <p>We'd love to hear from you. Reach out through any channel below.</p>
  </div>
  
  <div class="contact-page">
    <div class="contact-grid">
      <div class="contact-info">
        <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:2rem">Studio Information</h2>
        
        <div class="contact-info-item">
          <div class="ci-icon">📞</div>
          <div>
            <span class="ci-label">Phone</span>
            <span class="ci-value">+234 815 114 0526</span>
          </div>
        </div>
        
        <div class="contact-info-item">
          <div class="ci-icon">✉</div>
          <div>
            <span class="ci-label">Email</span>
            <span class="ci-value">office@meshacholajide.com</span>
          </div>
        </div>
        
        <div class="contact-info-item">
          <div class="ci-icon">WA</div>
          <div>
            <span class="ci-label">WhatsApp</span>
            <span class="ci-value">+234 815 114 0526</span>
          </div>
        </div>
        
        <div class="contact-info-item">
          <div class="ci-icon">📍</div>
          <div>
            <span class="ci-label">Studio Address (Island)</span>
            <span class="ci-value">1 Bunmi-Olowude St, Lekki Phase 1,<br>Lekki, Lagos State, Nigeria</span>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="ci-icon">📍</div>
          <div>
            <span class="ci-label">Studio Address (Mainland)</span>
            <span class="ci-value">90 Victoria Street, Ogudu,<br>Lagos State, Nigeria</span>
          </div>
        </div>

        <div class="social-row">
          <a class="soc-btn" href="https://www.instagram.com/meshacholajide/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a class="soc-btn" href="https://twitter.com/meshacholajide" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
        
        <div class="map-placeholder">
          <div class="map-pin">📍</div>
          <div style="text-align:center">
            <div style="color:var(--ivory);font-size:0.9rem;margin-bottom:0.25rem">Lekki Phase 1, Lagos</div>
            <div style="font-size:0.75rem">Meshach Olajide Photography Map Pin</div>
          </div>
        </div>
      </div>

      <div class="contact-form-mini">
        <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:2rem">Send a Message</h2>
        <form onsubmit={handleSubmit}>
          <div class="form-group">
            <label for="contactName">Your Name</label>
            <input type="text" id="contactName" bind:value={contactData.name} placeholder="Full name" required>
          </div>
          
          <div class="form-group">
            <label for="contactEmail">Email</label>
            <input type="email" id="contactEmail" bind:value={contactData.email} placeholder="your@email.com" required>
          </div>
          
          <div class="form-group">
            <label for="contactSubject">Subject</label>
            <select id="contactSubject" bind:value={contactData.subject} required>
              <option>General Inquiry</option>
              <option>Booking Request</option>
              <option>Pricing Question</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="contactMessage">Message</label>
            <textarea id="contactMessage" style="height:160px" bind:value={contactData.message} placeholder="Write your message here..." required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
        <br><br>
        <div style="border:1px solid var(--border);padding:1.5rem;text-align:center">
          <p style="font-size:0.75rem;color:var(--muted);margin-bottom:1rem">Prefer to chat directly?</p>
          <a class="btn-primary" href="https://wa.me/2348151140526" target="_blank" rel="noopener noreferrer" style="display:inline-block">Message on WhatsApp</a>
        </div>
      </div>
    </div>
  </div>
</div>
