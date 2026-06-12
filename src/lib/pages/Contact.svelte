<script>
  import { supabase } from '../supabaseClient.js';

  let contactData = $state({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  let isSubmitting = $state(false);
  let submitStatus = $state({ type: '', message: '' });

  /**
   * @param {SubmitEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    isSubmitting = true;
    submitStatus = { type: '', message: '' };

    // Try Supabase directly first if configured
    if (supabase) {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([
            {
              name: contactData.name,
              email: contactData.email,
              subject: contactData.subject,
              message: contactData.message
            }
          ]);

        if (error) throw error;

        submitStatus = {
          type: 'success',
          message: "Message sent! We'll respond within 24 hours."
        };
        // Reset form
        contactData = {
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: ''
        };
        isSubmitting = false;
        return;
      } catch (sbError) {
        console.warn('Supabase insertion failed, falling back to local server:', sbError);
      }
    }

    // Fallback: local Express server API
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        submitStatus = {
          type: 'success',
          message: "Message sent! We'll respond within 24 hours."
        };
        // Reset form
        contactData = {
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: ''
        };
      } else {
        submitStatus = {
          type: 'error',
          message: result.message || 'Something went wrong. Please try again.'
        };
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      submitStatus = {
        type: 'error',
        message: 'Could not connect to the server. Please check your network or try again later.'
      };
    } finally {
      isSubmitting = false;
    }
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
            <span class="ci-value">+234 813 824 5455</span>
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
            <span class="ci-value">+234 813 824 5455</span>
          </div>
        </div>
        
        <div class="contact-info-item">
          <div class="ci-icon">📍</div>
          <div>
            <span class="ci-label">Studio Address (Old Town)</span>
            <span class="ci-value">Vana-Viru 15,<br>10111 Tallinn, Estonia</span>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="ci-icon">📍</div>
          <div>
            <span class="ci-label">Studio Address (City Center)</span>
            <span class="ci-value">Mustamäe tee 4,<br>10621 Tallinn, Estonia</span>
          </div>
        </div>

        <div class="social-row">
          <a class="soc-btn" href="https://www.instagram.com/meshacholajide/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a class="soc-btn" href="https://twitter.com/meshacholajide" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
        
        <div class="map-placeholder">
          <div class="map-pin">📍</div>
          <div style="text-align:center">
            <div style="color:var(--ivory);font-size:0.9rem;margin-bottom:0.25rem">Old Town, Tallinn</div>
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
          {#if submitStatus.message}
            <div class="form-status {submitStatus.type}" style="padding:1rem; margin-bottom:1.5rem; text-align:center; font-size:0.85rem; border:1px solid var(--border); background:rgba(201, 168, 76, 0.05); color:{submitStatus.type === 'success' ? 'var(--gold)' : '#ff6b6b'}">
              {submitStatus.message}
            </div>
          {/if}
          
          <button type="submit" class="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
        <br><br>
        <div style="border:1px solid var(--border);padding:1.5rem;text-align:center">
          <p style="font-size:0.75rem;color:var(--muted);margin-bottom:1rem">Prefer to chat directly?</p>
          <a class="btn-primary" href="https://wa.me/2348138245455" target="_blank" rel="noopener noreferrer" style="display:inline-block">Message on WhatsApp</a>
        </div>
      </div>
    </div>
  </div>
</div>
