<script>
  import { supabase } from '../supabaseClient.js';

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

  let isSubmitting = $state(false);
  let submitStatus = $state({ type: '', message: '' });

  /**
   * @param {SubmitEvent} e
   */
  async function handleBooking(e) {
    e.preventDefault();
    isSubmitting = true;
    submitStatus = { type: '', message: '' };

    // Try Supabase directly first if configured
    if (supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .insert([
            {
              first_name: bookingData.firstName,
              last_name: bookingData.lastName,
              email: bookingData.email,
              phone: bookingData.phone,
              session_type: bookingData.sessionType,
              preferred_date: bookingData.preferredDate,
              preferred_time: bookingData.preferredTime,
              location: bookingData.location,
              notes: bookingData.notes
            }
          ]);

        if (error) throw error;

        submitStatus = {
          type: 'success',
          message: `Booking request submitted successfully! We'll confirm your session at ${bookingData.location} within 24 hours.`
        };
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
        isSubmitting = false;
        return;
      } catch (sbError) {
        console.warn('Supabase insertion failed, falling back to local server:', sbError);
      }
    }

    // Fallback: local Express server API
    try {
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        submitStatus = {
          type: 'success',
          message: `Booking request submitted successfully! We'll confirm your session at ${bookingData.location} within 24 hours.`
        };
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
      } else {
        submitStatus = {
          type: 'error',
          message: result.message || 'Something went wrong. Please try again.'
        };
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      submitStatus = {
        type: 'error',
        message: 'Could not connect to the server. Please check your network or try again later.'
      };
    } finally {
      isSubmitting = false;
    }
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
              <option>Meshach Olajide Studio Old Town (Vana-Viru)</option>
              <option>Meshach Olajide Studio City Center (Mustamäe)</option>
              <option>Custom Location (Outdoor / Client Venue)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="notes">Additional Notes</label>
            <textarea id="notes" bind:value={bookingData.notes} placeholder="Tell us about your vision, outfits planned, special requests, or anything else we should know..."></textarea>
          </div>
          {#if submitStatus.message}
            <div class="form-status {submitStatus.type}" style="padding:1rem; margin-bottom:1.5rem; text-align:center; font-size:0.85rem; border:1px solid var(--border); background:rgba(201, 168, 76, 0.05); color:{submitStatus.type === 'success' ? 'var(--gold)' : '#ff6b6b'}">
              {submitStatus.message}
            </div>
          {/if}
          <button type="submit" class="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Request...' : 'Submit Booking Request'}
          </button>
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
