<script>
  let bookingData = $state({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sessionType: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    notes: ''
  });

  /**
   * @param {SubmitEvent} e
   */
  function handleBooking(e) {
    e.preventDefault();
    alert(`Booking request submitted for ${bookingData.firstName} ${bookingData.lastName}! ✓\n\nWe'll confirm your session at ${bookingData.location} within 24 hours via WhatsApp or email.`);
    
    // Reset form
    bookingData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      sessionType: '',
      preferredDate: '',
      preferredTime: '',
      location: '',
      notes: ''
    };
  }
</script>

<div class="page active" id="page-booking">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">Start Your Journey</span>
    <h1>Book a Session</h1>
    <p>Fill in the details below and we'll be in touch within 24 hours to confirm your booking.</p>
  </div>
  <div class="booking-page">
    <div class="booking-grid">
      <div>
        <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:2rem;color:var(--gold)">Session Details</h2>
        <form onsubmit={handleBooking}>
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" bind:value={bookingData.firstName} placeholder="Adaeze" required>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" bind:value={bookingData.lastName} placeholder="Okonkwo" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" bind:value={bookingData.email} placeholder="hello@email.com" required>
            </div>
            <div class="form-group">
              <label for="phone">Phone / WhatsApp</label>
              <input type="tel" id="phone" bind:value={bookingData.phone} placeholder="+234 815 114 0526" required>
            </div>
          </div>
          <div class="form-group">
            <label for="sessionType">Session Type</label>
            <select id="sessionType" bind:value={bookingData.sessionType} required>
              <option value="" disabled selected>Select a service</option>
              <option>Portrait Photography – Mini (₦50,000)</option>
              <option>Portrait Photography – Standard (₦100,000)</option>
              <option>Portrait Photography – Premium (₦200,000)</option>
              <option>Event Coverage</option>
              <option>Family Session</option>
              <option>Corporate Photography</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="preferredDate">Preferred Date</label>
              <input type="date" id="preferredDate" bind:value={bookingData.preferredDate} required>
            </div>
            <div class="form-group">
              <label for="preferredTime">Preferred Time</label>
              <select id="preferredTime" bind:value={bookingData.preferredTime} required>
                <option value="" disabled selected>Select time</option>
                <option>Morning (7am – 11am)</option>
                <option>Afternoon (12pm – 4pm)</option>
                <option>Evening (4pm – 7pm)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="location">Session Location</label>
            <select id="location" bind:value={bookingData.location} required>
              <option value="" disabled selected>Select studio or custom venue</option>
              <option>Meshach Olajide Studio Island (Lekki Phase 1)</option>
              <option>Meshach Olajide Studio Mainland (Ogudu)</option>
              <option>Custom Location (Outdoor / Client Venue)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="notes">Additional Notes</label>
            <textarea id="notes" bind:value={bookingData.notes} placeholder="Tell us about your vision, outfits planned, special requests, or anything else we should know..."></textarea>
          </div>
          <button type="submit" class="submit-btn">Submit Booking Request</button>
          <p style="color:var(--muted);font-size:0.75rem;margin-top:1rem;text-align:center">We'll confirm your booking within 24 hours via email or WhatsApp.</p>
        </form>
      </div>
      <div class="booking-info">
        <h2 style="font-family:var(--serif);font-size:1.5rem;margin-bottom:2rem;color:var(--gold)">Quick Contact</h2>
        <a class="contact-method" href="https://wa.me/2348151140526" target="_blank" rel="noopener noreferrer">
          <div class="cm-icon">WA</div>
          <div class="cm-text">
            <span class="cm-label">WhatsApp (Fastest)</span>
            <span class="cm-val">+234 815 114 0526</span>
          </div>
        </a>
        <a class="contact-method" href="tel:+2348151140526">
          <div class="cm-icon">📞</div>
          <div class="cm-text">
            <span class="cm-label">Call Us</span>
            <span class="cm-val">+234 815 114 0526</span>
          </div>
        </a>
        <a class="contact-method" href="mailto:office@meshacholajide.com">
          <div class="cm-icon">✉</div>
          <div class="cm-text">
            <span class="cm-label">Email</span>
            <span class="cm-val">office@meshacholajide.com</span>
          </div>
        </a>

        <div class="info-block" style="margin-top:2rem">
          <h3>Studio Hours</h3>
          <p>Monday – Friday: 8am – 6pm<br>Saturday: 9am – 5pm<br>Sunday: By appointment only</p>
        </div>
        <div class="info-block">
          <h3>What to Expect</h3>
          <p>After submitting your request, our team will reach out within 24 hours to confirm your date, discuss your vision, and share preparation tips to make your session perfect.</p>
        </div>
        <div class="info-block">
          <h3>Booking Policy</h3>
          <p>A 50% deposit is required to secure your session date. Remaining balance is due on the day of the session. Cancellations must be made 48 hours in advance.</p>
        </div>
      </div>
    </div>
  </div>
</div>
