<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { supabase } from '../supabaseClient.js';

  // Props
  let { showPage } = $props();

  // State
  /** @type {any} */
  let session = $state(null);
  let activeTab = $state('bookings'); // 'bookings' | 'messages' | 'portfolio' | 'testimonials' | 'services' | 'about' | 'blog'
  
  // Auth Form State
  let email = $state('');
  let password = $state('');
  let authError = $state('');
  let isAuthLoading = $state(false);

  // Data Lists
  /** @type {any[]} */
  let bookings = $state([]);
  /** @type {any[]} */
  let messages = $state([]);
  /** @type {any[]} */
  let portfolioItems = $state([]);
  /** @type {any[]} */
  let testimonials = $state([]);
  /** @type {any[]} */
  let services = $state([]);
  /** @type {any[]} */
  let blogPosts = $state([]);
  let isDataLoading = $state(false);

  // New Portfolio Item Form State
  let newPortfolioItem = $state({
    title: '',
    category: 'portraits',
    art_symbol: '◆',
    aspect_ratio: '100%',
    custom_style: ''
  });
  /** @type {any} */
  let selectedImageFile = $state(null);
  let itemSubmitError = $state('');
  let isItemSubmitting = $state(false);

  // New Testimonial Form State
  let newTestimonial = $state({
    name: '',
    author: '',
    event_type: 'Wedding',
    role: '',
    org: '',
    rating: 5,
    testimonial_text: '',
    quote: '',
    display_order: 0,
    is_active: true,
    profile_photo: ''
  });
  /** @type {any} */
  let editingTestimonialId = $state(null);
  /** @type {any} */
  let editingTestimonial = $state({
    id: '',
    name: '',
    event_type: 'Wedding',
    rating: 5,
    testimonial_text: '',
    display_order: 0,
    is_active: true,
    profile_photo: ''
  });
  /** @type {any} */
  let selectedTestimonialImageFile = $state(null);
  let testimonialError = $state('');
  let isTestimonialSubmitting = $state(false);

  // New Service Form State
  let newService = $state({
    name: '',
    price: '',
    description: '',
    features: '',
    featured: false,
    badge: ''
  });
  let serviceError = $state('');
  let isServiceSubmitting = $state(false);

  // About Biography State
  let aboutProfile = $state({
    bio_title: '',
    bio_paragraph_1: '',
    bio_paragraph_2: '',
    bio_paragraph_3: '',
    stats_sessions: '',
    stats_clients: '',
    stats_experience: '',
    stats_response_time: ''
  });
  let aboutError = $state('');
  let isAboutSaving = $state(false);
  let aboutSuccessMsg = $state('');

  // New Blog Post Form State
  let newBlogPost = $state({
    category: 'editorial',
    title: '',
    excerpt: '',
    content: '',
    date: '',
    read_time: '',
    cover_class: 'ph-fashion',
    cover_symbol: '✦'
  });
  let blogError = $state('');
  let isBlogSubmitting = $state(false);

  onMount(async () => {
    if (supabase) {
      // Get initial session
      const { data } = await supabase.auth.getSession();
      session = data.session;

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, _session) => {
        session = _session;
        if (session) {
          loadAllData();
        }
      });

      if (session) {
        loadAllData();
      }
    }
  });

  async function handleLogin(e) {
    e.preventDefault();
    authError = '';
    isAuthLoading = true;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      authError = err.message || 'Login failed. Please check your credentials.';
    } finally {
      isAuthLoading = false;
    }
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
      session = null;
    }
    if (showPage) {
      showPage('home');
    }
  }

  async function loadAllData() {
    if (!supabase || !session) return;
    isDataLoading = true;
    try {
      // Load bookings
      const { data: bData, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (bErr) throw bErr;
      bookings = bData || [];

      // Load messages
      const { data: mData, error: mErr } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (mErr) throw mErr;
      messages = mData || [];

      // Load portfolio items
      const { data: pData, error: pErr } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (pErr) throw pErr;
      portfolioItems = pData || [];

      // Load testimonials
      const { data: tData, error: tErr } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (tErr) throw tErr;
      testimonials = tData || [];

      // Load services
      const { data: sData, error: sErr } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      if (sErr) throw sErr;
      services = sData || [];

      // Load blog posts
      const { data: bpData, error: bpErr } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (bpErr) throw bpErr;
      blogPosts = bpData || [];

      // Load about_profile
      const { data: aData, error: aErr } = await supabase
        .from('about_profile')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (aErr && aErr.code !== 'PGRST116') {
        throw aErr;
      }
      
      if (aData) {
        aboutProfile = aData;
      } else {
        // Initialize about row
        const defaults = {
          id: 1,
          bio_title: "Turning Ordinary Moments Into Art",
          bio_paragraph_1: "Meshach Olajide Photography is a professional studio that tells visual stories. Headquartered in Tallinn, Estonia, we specialise in Corporate Branding, Storytelling, Corporate Events, and Family Portraiture.",
          bio_paragraph_2: "At Meshach Olajide Photography, a camera is more than just a tool for capturing photos. It is used to tell visually appealing stories that inspire confidence, celebrate beauty and love, as well as create timeless works of art.",
          bio_paragraph_3: "Every session is a structured collaboration. Our style remains cinematic, crisp, and editorial with an organic depth. We believe the finest frames emerge when the lens is forgotten.",
          stats_sessions: "500+",
          stats_clients: "100+",
          stats_experience: "5+",
          stats_response_time: "24hr"
        };
        const { error: initErr } = await supabase.from('about_profile').insert([defaults]);
        if (initErr) console.warn("Failed to initialize about_profile:", initErr);
        aboutProfile = defaults;
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      isDataLoading = false;
    }
  }

  // Delete handlers
  async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking request?')) return;
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      bookings = bookings.filter(b => b.id !== id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      messages = messages.filter(m => m.id !== id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function deletePortfolioItem(id) {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      portfolioItems = portfolioItems.filter(p => p.id !== id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      testimonials = testimonials.filter(t => t.id !== id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      services = services.filter(s => s.id !== id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  async function deleteBlogPost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      blogPosts = blogPosts.filter(p => p.id !== id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  // Add portfolio item handler (with optional image uploader)
  async function addPortfolioItem(e) {
    e.preventDefault();
    itemSubmitError = '';
    isItemSubmitting = true;

    try {
      let imageUrl = '';
      if (selectedImageFile) {
        const fileExt = selectedImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('portfolio')
          .upload(fileName, selectedImageFile);
        
        if (uploadErr) {
          throw new Error(`Image upload failed: ${uploadErr.message}`);
        }
        
        const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const payload = {
        title: newPortfolioItem.title,
        category: newPortfolioItem.category,
        art_symbol: newPortfolioItem.art_symbol,
        aspect_ratio: newPortfolioItem.aspect_ratio,
        custom_style: newPortfolioItem.custom_style || '',
        image_url: imageUrl || null
      };

      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        portfolioItems = [data[0], ...portfolioItems];
      }

      // Reset form
      newPortfolioItem = {
        title: '',
        category: 'portraits',
        art_symbol: '◆',
        aspect_ratio: '100%',
        custom_style: ''
      };
      selectedImageFile = null;
      const fileInput = document.getElementById('item-image');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      itemSubmitError = err.message || 'Failed to add portfolio item.';
    } finally {
      isItemSubmitting = false;
    }
  }

  // Add testimonial handler (with profile photo upload)
  async function addTestimonial(e) {
    e.preventDefault();
    testimonialError = '';
    isTestimonialSubmitting = true;
    try {
      let profilePhotoUrl = '';
      if (selectedTestimonialImageFile) {
        const fileExt = selectedTestimonialImageFile.name.split('.').pop();
        const fileName = `testimonials/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('portfolio')
          .upload(fileName, selectedTestimonialImageFile);
        
        if (uploadErr) {
          throw new Error(`Profile photo upload failed: ${uploadErr.message}`);
        }
        
        const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        profilePhotoUrl = urlData.publicUrl;
      }

      const payload = {
        name: newTestimonial.name,
        author: newTestimonial.name, // legacy fallback
        event_type: newTestimonial.event_type,
        role: newTestimonial.event_type, // legacy fallback
        org: 'Client', // legacy fallback
        rating: Number(newTestimonial.rating),
        testimonial_text: newTestimonial.testimonial_text,
        quote: newTestimonial.testimonial_text, // legacy fallback
        display_order: Number(newTestimonial.display_order),
        is_active: newTestimonial.is_active,
        active: newTestimonial.is_active, // legacy fallback
        profile_photo: profilePhotoUrl || null,
        portrait_class: 'ph-portrait', // legacy fallback
        portrait_art: '★' // legacy fallback
      };

      const { data, error } = await supabase
        .from('testimonials')
        .insert([payload])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        testimonials = [data[0], ...testimonials];
      }
      
      // Reset form
      newTestimonial = {
        name: '',
        author: '',
        event_type: 'Wedding',
        role: '',
        org: '',
        rating: 5,
        testimonial_text: '',
        quote: '',
        display_order: 0,
        is_active: true,
        profile_photo: ''
      };
      selectedTestimonialImageFile = null;
      const fileInput = document.getElementById('test-image');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      testimonialError = err.message || 'Failed to add testimonial.';
    } finally {
      isTestimonialSubmitting = false;
    }
  }

  // Edit Testimonials state handlers
  function startEditTestimonial(t) {
    editingTestimonialId = t.id;
    editingTestimonial = {
      id: t.id,
      name: t.name || t.author || '',
      event_type: t.event_type || t.role || t.org || '',
      rating: t.rating !== undefined ? t.rating : 5,
      testimonial_text: t.testimonial_text || t.quote || '',
      display_order: t.display_order !== undefined ? t.display_order : 0,
      is_active: t.is_active !== false && t.active !== false,
      profile_photo: t.profile_photo || null
    };
    selectedTestimonialImageFile = null;
  }

  function cancelEditTestimonial() {
    editingTestimonialId = null;
    editingTestimonial = null;
    selectedTestimonialImageFile = null;
  }

  async function saveEditTestimonial(e) {
    e.preventDefault();
    testimonialError = '';
    isTestimonialSubmitting = true;
    try {
      let profilePhotoUrl = editingTestimonial.profile_photo;
      if (selectedTestimonialImageFile) {
        const fileExt = selectedTestimonialImageFile.name.split('.').pop();
        const fileName = `testimonials/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('portfolio')
          .upload(fileName, selectedTestimonialImageFile);
        
        if (uploadErr) {
          throw new Error(`Profile photo upload failed: ${uploadErr.message}`);
        }
        
        const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        profilePhotoUrl = urlData.publicUrl;
      }

      const payload = {
        name: editingTestimonial.name,
        author: editingTestimonial.name, // legacy
        event_type: editingTestimonial.event_type,
        role: editingTestimonial.event_type, // legacy
        org: 'Client', // legacy
        rating: Number(editingTestimonial.rating),
        testimonial_text: editingTestimonial.testimonial_text,
        quote: editingTestimonial.testimonial_text, // legacy
        display_order: Number(editingTestimonial.display_order),
        is_active: editingTestimonial.is_active,
        active: editingTestimonial.is_active, // legacy
        profile_photo: profilePhotoUrl
      };

      const { data, error } = await supabase
        .from('testimonials')
        .update(payload)
        .eq('id', editingTestimonial.id)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        testimonials = testimonials.map(t => t.id === editingTestimonial.id ? data[0] : t);
      }
      cancelEditTestimonial();
    } catch (err) {
      testimonialError = err.message || 'Failed to update testimonial.';
    } finally {
      isTestimonialSubmitting = false;
    }
  }

  // Quick active visibility toggle
  async function toggleTestimonialVisibility(t) {
    try {
      const currentActive = t.is_active !== false && t.active !== false;
      const newStatus = !currentActive;
      
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          is_active: newStatus,
          active: newStatus // legacy
        })
        .eq('id', t.id)
        .select();
      
      if (error) throw error;
      if (data && data[0]) {
        testimonials = testimonials.map(item => item.id === t.id ? data[0] : item);
      }
    } catch (err) {
      alert(`Failed to toggle visibility: ${err.message}`);
    }
  }

  // Swap reordering display order
  async function moveTestimonial(index, direction) {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === testimonials.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const item1 = testimonials[index];
    const item2 = testimonials[targetIndex];

    const order1 = item1.display_order !== undefined ? item1.display_order : index;
    const order2 = item2.display_order !== undefined ? item2.display_order : targetIndex;

    const newOrder1 = order2;
    const newOrder2 = order1 === order2 ? order1 + 1 : order1;

    try {
      const update1 = supabase.from('testimonials').update({ display_order: newOrder1 }).eq('id', item1.id);
      const update2 = supabase.from('testimonials').update({ display_order: newOrder2 }).eq('id', item2.id);

      const [res1, res2] = await Promise.all([update1, update2]);
      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;

      loadAllData();
    } catch (err) {
      alert(`Reordering failed: ${err.message}`);
    }
  }


  // Add service handler
  async function addService(e) {
    e.preventDefault();
    serviceError = '';
    isServiceSubmitting = true;
    try {
      const featuresArray = newService.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const payload = {
        name: newService.name,
        price: newService.price,
        description: newService.description,
        features: featuresArray,
        featured: newService.featured,
        badge: newService.badge || null
      };

      const { data, error } = await supabase
        .from('services')
        .insert([payload])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        services = [...services, data[0]];
      }
      newService = {
        name: '',
        price: '',
        description: '',
        features: '',
        featured: false,
        badge: ''
      };
    } catch (err) {
      serviceError = err.message || 'Failed to add service package.';
    } finally {
      isServiceSubmitting = false;
    }
  }

  // Save about biography & stats
  async function saveAboutProfile(e) {
    e.preventDefault();
    aboutError = '';
    aboutSuccessMsg = '';
    isAboutSaving = true;
    try {
      const { error } = await supabase
        .from('about_profile')
        .update({
          bio_title: aboutProfile.bio_title,
          bio_paragraph_1: aboutProfile.bio_paragraph_1,
          bio_paragraph_2: aboutProfile.bio_paragraph_2,
          bio_paragraph_3: aboutProfile.bio_paragraph_3,
          stats_sessions: aboutProfile.stats_sessions,
          stats_clients: aboutProfile.stats_clients,
          stats_experience: aboutProfile.stats_experience,
          stats_response_time: aboutProfile.stats_response_time,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
      if (error) throw error;
      aboutSuccessMsg = 'About profile updated successfully!';
      setTimeout(() => aboutSuccessMsg = '', 4000);
    } catch (err) {
      aboutError = err.message || 'Failed to save profile changes.';
    } finally {
      isAboutSaving = false;
    }
  }

  // Add blog post handler
  async function addBlogPost(e) {
    e.preventDefault();
    blogError = '';
    isBlogSubmitting = true;
    try {
      const postDate = newBlogPost.date || new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      });

      const payload = {
        category: newBlogPost.category,
        title: newBlogPost.title,
        excerpt: newBlogPost.excerpt,
        content: newBlogPost.content,
        date: postDate,
        read_time: newBlogPost.read_time,
        cover_class: newBlogPost.cover_class,
        cover_symbol: newBlogPost.cover_symbol
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([payload])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        blogPosts = [data[0], ...blogPosts];
      }
      newBlogPost = {
        category: 'editorial',
        title: '',
        excerpt: '',
        content: '',
        date: '',
        read_time: '',
        cover_class: 'ph-fashion',
        cover_symbol: '✦'
      };
    } catch (err) {
      blogError = err.message || 'Failed to publish blog post.';
    } finally {
      isBlogSubmitting = false;
    }
  }
</script>

<div class="page active" id="page-admin">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">Control Panel</span>
    <h1>Studio Admin</h1>
    <p>Manage bookings, messages, and portfolio items in real-time.</p>
  </div>

  <div class="admin-container">
    {#if !supabase}
      <!-- Supabase Not Configured Warning -->
      <div class="admin-warning-card">
        <h3>Database Client Unconfigured</h3>
        <p>Supabase integration variables are currently missing or default in your env configuration file.</p>
        <div class="sql-box">
          <p><strong>To activate this panel:</strong></p>
          <ol>
            <li>Create the database tables listed in <code>implementation_plan.md</code> inside your Supabase SQL editor.</li>
            <li>Paste your Supabase API URL and Anon Key inside your <code>.env</code> file.</li>
            <li>Enable Email Auth in the Supabase console, register a user, and log in here.</li>
          </ol>
        </div>
      </div>
    {:else if !session}
      <!-- Login Form -->
      <div class="admin-login-wrapper">
        <div class="admin-login-card">
          <h2>Secure Login</h2>
          <p class="login-sub">Enter credentials to access the photography manager.</p>
          
          {#if authError}
            <div class="auth-error">{authError}</div>
          {/if}

          <form onsubmit={handleLogin}>
            <div class="form-group">
              <label for="admin-email">Email Address</label>
              <input type="email" id="admin-email" bind:value={email} placeholder="admin@meshacholajide.com" required>
            </div>
            <div class="form-group">
              <label for="admin-password">Password</label>
              <input type="password" id="admin-password" bind:value={password} placeholder="••••••••" required>
            </div>
            <button type="submit" class="submit-btn" disabled={isAuthLoading}>
              {isAuthLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    {:else}
      <!-- Logged-in Dashboard -->
      <div class="dashboard-wrap">
        <div class="dashboard-header">
          <div class="dashboard-user">
            <span>Access level: <strong>Administrator</strong> ({session.user.email})</span>
          </div>
          <button class="logout-btn" onclick={handleLogout}>Logout / Exit</button>
        </div>

        <!-- Tab Controls -->
        <div class="dashboard-tabs">
          <button class="tab-btn" class:active={activeTab === 'bookings'} onclick={() => activeTab = 'bookings'}>
            Bookings ({bookings.length})
          </button>
          <button class="tab-btn" class:active={activeTab === 'messages'} onclick={() => activeTab = 'messages'}>
            Messages ({messages.length})
          </button>
          <button class="tab-btn" class:active={activeTab === 'portfolio'} onclick={() => activeTab = 'portfolio'}>
            Portfolio ({portfolioItems.length})
          </button>
          <button class="tab-btn" class:active={activeTab === 'testimonials'} onclick={() => activeTab = 'testimonials'}>
            Testimonials ({testimonials.length})
          </button>
          <button class="tab-btn" class:active={activeTab === 'services'} onclick={() => activeTab = 'services'}>
            Services ({services.length})
          </button>
          <button class="tab-btn" class:active={activeTab === 'about'} onclick={() => activeTab = 'about'}>
            About Bio
          </button>
          <button class="tab-btn" class:active={activeTab === 'blog'} onclick={() => activeTab = 'blog'}>
            Blog ({blogPosts.length})
          </button>
        </div>

        {#if isDataLoading}
          <div class="admin-loading">Fetching data feeds...</div>
        {:else}
          <!-- Tab Contents -->
          <div class="tab-content">
            {#if activeTab === 'bookings'}
              <!-- BOOKINGS SECTION -->
              <div class="card-table-wrap">
                <h2>Client Session Requests</h2>
                {#if bookings.length === 0}
                  <p class="empty-state">No booking requests have been received yet.</p>
                {:else}
                  <div class="table-responsive">
                    <table class="admin-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Contact Details</th>
                          <th>Session Choice</th>
                          <th>Preferred Slot</th>
                          <th>Location</th>
                          <th>Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each bookings as b (b.id)}
                          <tr>
                            <td><strong>{b.first_name} {b.last_name}</strong></td>
                            <td>
                              <span>{b.email}</span><br>
                              <small style="color:var(--muted)">{b.phone}</small>
                            </td>
                            <td><span class="badge badge-gold">{b.session_type}</span></td>
                            <td>
                              <span>{b.preferred_date}</span><br>
                              <small style="color:var(--muted)">{b.preferred_time}</small>
                            </td>
                            <td>{b.location}</td>
                            <td><small class="notes-preview" title={b.notes}>{b.notes || '—'}</small></td>
                            <td>
                              <button class="action-btn-danger" onclick={() => deleteBooking(b.id)}>Delete</button>
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              </div>

            {:else if activeTab === 'messages'}
              <!-- MESSAGES SECTION -->
              <div class="card-table-wrap">
                <h2>Inquiries & Contact Entries</h2>
                {#if messages.length === 0}
                  <p class="empty-state">No contact form messages have been received yet.</p>
                {:else}
                  <div class="table-responsive">
                    <table class="admin-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Subject</th>
                          <th>Message Details</th>
                          <th>Submitted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each messages as m (m.id)}
                          <tr>
                            <td>
                              <strong>{m.name}</strong><br>
                              <small style="color:var(--muted)">{m.email}</small>
                            </td>
                            <td><span class="badge badge-outline">{m.subject}</span></td>
                            <td><p class="message-cell">{m.message}</p></td>
                            <td><small>{new Date(m.created_at).toLocaleDateString()}</small></td>
                            <td>
                              <button class="action-btn-danger" onclick={() => deleteMessage(m.id)}>Delete</button>
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              </div>

            {:else if activeTab === 'portfolio'}
              <!-- PORTFOLIO MANAGER SECTION -->
              <div class="portfolio-dashboard-grid">
                <!-- Add Form -->
                <div class="card-form-wrap">
                  <h2>Add Portfolio Item</h2>
                  {#if itemSubmitError}
                    <div class="auth-error">{itemSubmitError}</div>
                  {/if}
                  <form onsubmit={addPortfolioItem}>
                    <div class="form-group">
                      <label for="item-title">Title / Name</label>
                      <input type="text" id="item-title" bind:value={newPortfolioItem.title} placeholder="Portrait – Creative Shoot" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="item-category">Category</label>
                      <select id="item-category" bind:value={newPortfolioItem.category} required>
                        <option value="portraits">Portraits</option>
                        <option value="events">Events</option>
                        <option value="family">Family</option>
                        <option value="corporate">Corporate</option>
                        <option value="fashion">Fashion</option>
                        <option value="videos">Videos</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="item-symbol">Art Icon Symbol</label>
                      <select id="item-symbol" bind:value={newPortfolioItem.art_symbol} required>
                        <option value="◆">Diamond (◆)</option>
                        <option value="◈">Dotted Diamond (◈)</option>
                        <option value="❋">Floral (❋)</option>
                        <option value="◇">Hollow Diamond (◇)</option>
                        <option value="✦">Four-Point Star (✦)</option>
                        <option value="♦">Suit Diamond (♦)</option>
                        <option value="▼">Down Arrow (▼)</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="item-ratio">Aspect Ratio Padding</label>
                      <select id="item-ratio" bind:value={newPortfolioItem.aspect_ratio} required>
                        <option value="80%">Landscape (80%)</option>
                        <option value="100%">Square (100%)</option>
                        <option value="120%">Tall portrait (120%)</option>
                        <option value="130%">Classic portrait (130%)</option>
                        <option value="140%">Editorial portrait (140%)</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="item-style">Custom Gradient / Style Overrides (Optional)</label>
                      <input type="text" id="item-style" bind:value={newPortfolioItem.custom_style} placeholder="background: linear-gradient(160deg, ...)">
                    </div>

                    <div class="form-group">
                      <label for="item-image">Image File (Upload to Supabase Storage)</label>
                      <div class="image-uploader-dropzone">
                        <input type="file" id="item-image" accept="image/*" onchange={(e) => selectedImageFile = e.target.files[0]} class="file-input-hidden">
                        <div class="uploader-prompt">
                          <span class="uploader-icon">✦</span>
                          {#if selectedImageFile}
                            <span class="uploader-filename">{selectedImageFile.name} ({(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <span class="uploader-hint">Click to replace file</span>
                          {:else}
                            <span class="uploader-text">Drag & drop or click to select image</span>
                            <span class="uploader-hint">Supports PNG, JPG, WebP up to 10MB</span>
                          {/if}
                        </div>
                      </div>
                    </div>

                    <button type="submit" class="submit-btn" style="margin-top: 1rem;" disabled={isItemSubmitting}>
                      {isItemSubmitting ? 'Inserting...' : 'Upload Item'}
                    </button>
                  </form>
                </div>

                <!-- Existing Items List -->
                <div class="card-table-wrap">
                  <h2>Active Portfolio Items</h2>
                  {#if portfolioItems.length === 0}
                    <p class="empty-state">No portfolio items found in the database.</p>
                  {:else}
                    <div class="table-responsive">
                      <table class="admin-table">
                        <thead>
                          <tr>
                            <th>Item Visual</th>
                            <th>Details</th>
                            <th>Aspect</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each portfolioItems as p (p.id)}
                            <tr>
                              <td>
                                {#if p.image_url}
                                  <div class="admin-portfolio-preview" style="width: 50px; height: 50px; background-image: url({p.image_url}); background-size: cover; background-position: center; border: 1px solid var(--border);"></div>
                                {:else}
                                  <div class="admin-portfolio-preview {p.category === 'videos' ? '' : 'ph-' + p.category}" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid var(--border); {p.custom_style || ''}">
                                    {p.art_symbol}
                                  </div>
                                {/if}
                              </td>
                              <td>
                                <strong>{p.title}</strong><br>
                                <span class="badge badge-gold" style="font-size: 0.6rem; padding: 0.15rem 0.4rem;">{p.category}</span>
                              </td>
                              <td>{p.aspect_ratio}</td>
                              <td>
                                <button class="action-btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.7rem;" onclick={() => deletePortfolioItem(p.id)}>Delete</button>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  {/if}
                </div>
              </div>

            {:else if activeTab === 'testimonials'}
              <!-- SQL MIGRATION INSTRUCTION CARD -->
              <div class="admin-warning-card" style="margin-bottom: 2rem;">
                <h3 style="color: var(--gold); display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem;">
                  <span>⚙️</span> Database Schema Migration Required
                </h3>
                <p style="font-size: 0.8rem; margin: 0.5rem 0; opacity: 0.9; line-height: 1.5;">
                  The redesigned testimonials layout utilizes new database columns. If you are configuring a new Supabase project, copy and run the script below in your Supabase SQL Editor:
                </p>
                <details style="font-size: 0.8rem; background: rgba(0,0,0,0.15); padding: 0.8rem; border-radius: 6px; border: 1px solid var(--border);">
                  <summary style="cursor: pointer; font-weight: 600; color: var(--gold);">Show SQL Script (Click to expand)</summary>
                  <pre style="margin-top: 0.8rem; overflow-x: auto; font-family: monospace; font-size: 0.72rem; color: #fff; line-height: 1.4; padding: 0.6rem; background: #000; border-radius: 4px;">
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS profile_photo text;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS event_type text;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating integer DEFAULT 5;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS testimonial_text text;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Migrate old records if any:
UPDATE testimonials SET name = author WHERE name IS NULL AND author IS NOT NULL;
UPDATE testimonials SET testimonial_text = quote WHERE testimonial_text IS NULL AND quote IS NOT NULL;
UPDATE testimonials SET event_type = role WHERE event_type IS NULL AND role IS NOT NULL;
                  </pre>
                </details>
              </div>

              <!-- TESTIMONIALS MANAGER SECTION -->
              <div class="portfolio-dashboard-grid">
                
                <!-- Add or Edit Form -->
                <div class="card-form-wrap">
                  {#if editingTestimonialId}
                    <h2>Edit Testimonial</h2>
                    {#if testimonialError}
                      <div class="auth-error">{testimonialError}</div>
                    {/if}
                    <form onsubmit={saveEditTestimonial}>
                      <div class="form-group">
                        <label for="edit-test-name">Client Name</label>
                        <input type="text" id="edit-test-name" bind:value={editingTestimonial.name} placeholder="Ava Green" required>
                      </div>
                      
                      <div class="form-group">
                        <label for="edit-test-event">Event Type</label>
                        <select id="edit-test-event" bind:value={editingTestimonial.event_type} required>
                          <option value="Wedding">Wedding</option>
                          <option value="Portrait">Portrait</option>
                          <option value="Family">Family Session</option>
                          <option value="Corporate">Corporate Branding</option>
                          <option value="Graduation">Graduation</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Other">Other Session</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label for="edit-test-rating">Star Rating</label>
                        <select id="edit-test-rating" bind:value={editingTestimonial.rating} required>
                          <option value={5}>5 Stars (★★★★★)</option>
                          <option value={4}>4 Stars (★★★★☆)</option>
                          <option value={3}>3 Stars (★★★☆☆)</option>
                          <option value={2}>2 Stars (★★☆☆☆)</option>
                          <option value={1}>1 Star (★☆☆☆☆)</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label for="edit-test-order">Display Order Index</label>
                        <input type="number" id="edit-test-order" bind:value={editingTestimonial.display_order} min="0" required>
                      </div>

                      <div class="form-group" style="margin-bottom:1.5rem;">
                        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
                          <input type="checkbox" bind:checked={editingTestimonial.is_active}> Display on Website (Active)
                        </label>
                      </div>

                      <div class="form-group">
                        <label for="edit-test-image">Profile Photo (Upload to Storage)</label>
                        <div class="image-uploader-dropzone">
                          <input type="file" id="edit-test-image" accept="image/*" onchange={(e) => selectedTestimonialImageFile = e.target.files[0]} class="file-input-hidden">
                          <div class="uploader-prompt">
                            <span class="uploader-icon">👤</span>
                            {#if selectedTestimonialImageFile}
                              <span class="uploader-filename">{selectedTestimonialImageFile.name} ({(selectedTestimonialImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                              <span class="uploader-hint">Click to replace file</span>
                            {:else if editingTestimonial.profile_photo}
                              <div class="admin-portfolio-preview rounded-full" style="width: 45px; height: 45px; margin: 0 auto 0.5rem; background-image: url({editingTestimonial.profile_photo}); background-size: cover; background-position: center; border: 1px solid var(--border);"></div>
                              <span class="uploader-hint">Click to change profile image</span>
                            {:else}
                              <span class="uploader-text">Click to select photo</span>
                              <span class="uploader-hint">PNG, JPG, WebP up to 5MB</span>
                            {/if}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="edit-test-quote">Quote / Kind Words</label>
                        <textarea id="edit-test-quote" bind:value={editingTestimonial.testimonial_text} placeholder="Write the testimonial quote..." rows="4" required></textarea>
                      </div>

                      <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="submit-btn" disabled={isTestimonialSubmitting}>
                          {isTestimonialSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" class="action-btn-danger" style="border-radius: 0; padding: 0.8rem 1.5rem; font-size: 0.8rem;" onclick={cancelEditTestimonial}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  {:else}
                    <h2>Add Testimonial</h2>
                    {#if testimonialError}
                      <div class="auth-error">{testimonialError}</div>
                    {/if}
                    <form onsubmit={addTestimonial}>
                      <div class="form-group">
                        <label for="test-name">Client Name</label>
                        <input type="text" id="test-name" bind:value={newTestimonial.name} placeholder="Ava Green" required>
                      </div>
                      
                      <div class="form-group">
                        <label for="test-event">Event Type</label>
                        <select id="test-event" bind:value={newTestimonial.event_type} required>
                          <option value="Wedding">Wedding</option>
                          <option value="Portrait">Portrait</option>
                          <option value="Family">Family Session</option>
                          <option value="Corporate">Corporate Branding</option>
                          <option value="Graduation">Graduation</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Other">Other Session</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label for="test-rating">Star Rating</label>
                        <select id="test-rating" bind:value={newTestimonial.rating} required>
                          <option value={5}>5 Stars (★★★★★)</option>
                          <option value={4}>4 Stars (★★★★☆)</option>
                          <option value={3}>3 Stars (★★★☆☆)</option>
                          <option value={2}>2 Stars (★★☆☆☆)</option>
                          <option value={1}>1 Star (★☆☆☆☆)</option>
                        </select>
                      </div>

                      <div class="form-group">
                        <label for="test-order">Display Order Index</label>
                        <input type="number" id="test-order" bind:value={newTestimonial.display_order} min="0" required>
                      </div>

                      <div class="form-group" style="margin-bottom:1.5rem;">
                        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
                          <input type="checkbox" bind:checked={newTestimonial.is_active}> Display on Website (Active)
                        </label>
                      </div>

                      <div class="form-group">
                        <label for="test-image">Profile Photo (Upload to Storage)</label>
                        <div class="image-uploader-dropzone">
                          <input type="file" id="test-image" accept="image/*" onchange={(e) => selectedTestimonialImageFile = e.target.files[0]} class="file-input-hidden">
                          <div class="uploader-prompt">
                            <span class="uploader-icon">👤</span>
                            {#if selectedTestimonialImageFile}
                              <span class="uploader-filename">{selectedTestimonialImageFile.name} ({(selectedTestimonialImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                              <span class="uploader-hint">Click to replace file</span>
                            {:else}
                              <span class="uploader-text">Drag & drop or click to select profile photo</span>
                              <span class="uploader-hint">PNG, JPG, WebP up to 5MB</span>
                            {/if}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="test-quote">Quote / Kind Words</label>
                        <textarea id="test-quote" bind:value={newTestimonial.testimonial_text} placeholder="Write the testimonial quote..." rows="4" required></textarea>
                      </div>

                      <button type="submit" class="submit-btn" disabled={isTestimonialSubmitting}>
                        {isTestimonialSubmitting ? 'Adding...' : 'Add Testimonial'}
                      </button>
                    </form>
                  {/if}
                </div>

                <!-- Existing Testimonials List -->
                <div class="card-table-wrap">
                  <h2>Testimonial Records</h2>
                  {#if testimonials.length === 0}
                    <p class="empty-state">No testimonials found in database.</p>
                  {:else}
                    <div class="table-responsive">
                      <table class="admin-table">
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>Author & Type</th>
                            <th>Quote Preview</th>
                            <th>Rating</th>
                            <th>Active</th>
                            <th>Order</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each testimonials.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) as t, idx (t.id)}
                            <tr>
                              <td>
                                {#if t.profile_photo}
                                  <div class="admin-portfolio-preview rounded-full" style="width:40px;height:40px;background-image:url({t.profile_photo});background-size:cover;background-position:center;border:1px solid var(--border);"></div>
                                {:else}
                                  <div class="admin-portfolio-preview rounded-full bg-zinc-800 text-gold" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:bold;border:1px solid var(--border);">
                                    {(t.name || t.author || 'C')[0]}
                                  </div>
                                {/if}
                              </td>
                              <td>
                                <strong>{t.name || t.author || 'Anonymous'}</strong><br>
                                <span class="badge badge-gold" style="font-size: 0.6rem; padding: 0.15rem 0.4rem;">
                                  {t.event_type || t.role || 'Session'}
                                </span>
                              </td>
                              <td><small class="notes-preview" title={t.testimonial_text || t.quote}>{t.testimonial_text || t.quote}</small></td>
                              <td style="color:var(--gold); font-size:0.8rem;">{'★'.repeat(t.rating || 5)}</td>
                              <td>
                                <input 
                                  type="checkbox" 
                                  checked={t.is_active !== false && t.active !== false} 
                                  onchange={() => toggleTestimonialVisibility(t)}
                                  style="cursor:pointer; width:16px; height:16px;"
                                />
                              </td>
                              <td>
                                <div style="display:flex; flex-direction:column; gap:0.2rem; align-items:center;">
                                  <button 
                                    class="cat-btn" 
                                    style="padding:0.1rem 0.4rem; font-size:0.6rem;" 
                                    onclick={() => moveTestimonial(idx, 'up')}
                                    disabled={idx === 0}
                                  >▲</button>
                                  <span style="font-size:0.75rem; font-weight:600; color:var(--gold);">{t.display_order || 0}</span>
                                  <button 
                                    class="cat-btn" 
                                    style="padding:0.1rem 0.4rem; font-size:0.6rem;" 
                                    onclick={() => moveTestimonial(idx, 'down')}
                                    disabled={idx === testimonials.length - 1}
                                  >▼</button>
                                </div>
                              </td>
                              <td>
                                <div style="display:flex; gap:0.5rem;">
                                  <button class="cat-btn" style="padding:0.3rem 0.6rem; font-size:0.7rem; color:var(--ivory); border-color:var(--border);" onclick={() => startEditTestimonial(t)}>Edit</button>
                                  <button class="action-btn-danger" style="padding:0.3rem 0.6rem; font-size:0.7rem;" onclick={() => deleteTestimonial(t.id)}>Delete</button>
                                </div>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  {/if}
                </div>
              </div>

            {:else if activeTab === 'services'}
              <!-- SERVICES MANAGER SECTION -->
              <div class="portfolio-dashboard-grid">
                <!-- Add Form -->
                <div class="card-form-wrap">
                  <h2>Add Service Package</h2>
                  {#if serviceError}
                    <div class="auth-error">{serviceError}</div>
                  {/if}
                  <form onsubmit={addService}>
                    <div class="form-group">
                      <label for="srv-name">Package Name</label>
                      <input type="text" id="srv-name" bind:value={newService.name} placeholder="Starter Session" required>
                    </div>
                    <div class="form-group">
                      <label for="srv-price">Price Display</label>
                      <input type="text" id="srv-price" bind:value={newService.price} placeholder="₦50,000" required>
                    </div>
                    <div class="form-group">
                      <label for="srv-badge">Featured Badge (Optional)</label>
                      <input type="text" id="srv-badge" bind:value={newService.badge} placeholder="e.g. Signature, Popular">
                    </div>
                    <div class="form-group" style="margin-bottom:1.5rem;">
                      <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
                        <input type="checkbox" bind:checked={newService.featured}> Highlight / Feature this package card
                      </label>
                    </div>
                    <div class="form-group">
                      <label for="srv-features">Features (Comma separated)</label>
                      <textarea id="srv-features" bind:value={newService.features} placeholder="e.g. 1-hour studio session, 1 outfit change, 15 edited images" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                      <label for="srv-desc">Brief Description</label>
                      <textarea id="srv-desc" bind:value={newService.description} placeholder="Short overview of what is included in the package..." rows="3" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn" disabled={isServiceSubmitting}>
                      {isServiceSubmitting ? 'Adding...' : 'Add Package'}
                    </button>
                  </form>
                </div>

                <!-- Existing Services List -->
                <div class="card-table-wrap">
                  <h2>Active Packages</h2>
                  {#if services.length === 0}
                    <p class="empty-state">No packages found in database. Using defaults.</p>
                  {:else}
                    <div class="table-responsive">
                      <table class="admin-table">
                        <thead>
                          <tr>
                            <th>Package</th>
                            <th>Price</th>
                            <th>Features Count</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each services as s (s.id)}
                            <tr>
                              <td>
                                <strong>{s.name}</strong><br>
                                <small style="color:var(--muted);display:block;max-width:200px;overflow:hidden;text-overflow:ellipsis;">{s.description}</small>
                              </td>
                              <td><span class="badge badge-gold">{s.price}</span></td>
                              <td>{s.features.length} features</td>
                              <td>
                                {#if s.featured}
                                  <span class="badge badge-gold">Featured</span>
                                {:else}
                                  <span class="badge badge-outline">Standard</span>
                                {/if}
                              </td>
                              <td>
                                <button class="action-btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.7rem;" onclick={() => deleteService(s.id)}>Delete</button>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  {/if}
                </div>
              </div>

            {:else if activeTab === 'about'}
              <!-- ABOUT BIOGRAPHY MANAGER -->
              <div class="card-form-wrap" style="max-width: 800px; margin: 0 auto 3rem;">
                <h2>Edit Photographer Biography & Stats</h2>
                {#if aboutError}
                  <div class="auth-error">{aboutError}</div>
                {/if}
                {#if aboutSuccessMsg}
                  <div class="auth-success" style="background:rgba(184,147,54,0.1); border:1px solid var(--gold); color:var(--gold); padding:0.8rem; text-align:center; font-size:0.8rem; margin-bottom:1.5rem;">{aboutSuccessMsg}</div>
                {/if}
                <form onsubmit={saveAboutProfile}>
                  <div class="form-group">
                    <label for="ab-title">Bio Heading Title (Supports HTML)</label>
                    <input type="text" id="ab-title" bind:value={aboutProfile.bio_title} placeholder="Turning Ordinary Moments Into Art" required>
                  </div>
                  <div class="form-group">
                    <label for="ab-p1">Biography Paragraph 1</label>
                    <textarea id="ab-p1" bind:value={aboutProfile.bio_paragraph_1} rows="3" required></textarea>
                  </div>
                  <div class="form-group">
                    <label for="ab-p2">Biography Paragraph 2</label>
                    <textarea id="ab-p2" bind:value={aboutProfile.bio_paragraph_2} rows="3" required></textarea>
                  </div>
                  <div class="form-group">
                    <label for="ab-p3">Biography Paragraph 3</label>
                    <textarea id="ab-p3" bind:value={aboutProfile.bio_paragraph_3} rows="3" required></textarea>
                  </div>
                  
                  <h3 style="color:var(--ivory);margin-top:2rem;margin-bottom:1rem;font-size:1.1rem;font-weight:500;">Studio Statistics</h3>
                  <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem;">
                    <div class="form-group">
                      <label for="st-sess">Sessions</label>
                      <input type="text" id="st-sess" bind:value={aboutProfile.stats_sessions} placeholder="500+" required>
                    </div>
                    <div class="form-group">
                      <label for="st-cl">Clients</label>
                      <input type="text" id="st-cl" bind:value={aboutProfile.stats_clients} placeholder="100+" required>
                    </div>
                    <div class="form-group">
                      <label for="st-exp">Years Exp</label>
                      <input type="text" id="st-exp" bind:value={aboutProfile.stats_experience} placeholder="5+" required>
                    </div>
                    <div class="form-group">
                      <label for="st-resp">Resp Time</label>
                      <input type="text" id="st-resp" bind:value={aboutProfile.stats_response_time} placeholder="24hr" required>
                    </div>
                  </div>

                  <button type="submit" class="submit-btn" style="margin-top:2rem;" disabled={isAboutSaving}>
                    {isAboutSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

            {:else if activeTab === 'blog'}
              <!-- BLOG MANAGER SECTION -->
              <div class="portfolio-dashboard-grid">
                <!-- Add Form -->
                <div class="card-form-wrap">
                  <h2>Write Journal Post</h2>
                  {#if blogError}
                    <div class="auth-error">{blogError}</div>
                  {/if}
                  <form onsubmit={addBlogPost}>
                    <div class="form-group">
                      <label for="blog-title">Article Title</label>
                      <input type="text" id="blog-title" bind:value={newBlogPost.title} placeholder="The Art of Natural Light..." required>
                    </div>
                    <div class="form-group">
                      <label for="blog-cat">Category</label>
                      <input type="text" id="blog-cat" bind:value={newBlogPost.category} placeholder="e.g. editorial, guides, behind the scenes" required>
                    </div>
                    <div class="form-group">
                      <label for="blog-time">Read Time</label>
                      <input type="text" id="blog-time" bind:value={newBlogPost.read_time} placeholder="e.g. 5 min read" required>
                    </div>
                    <div class="form-group">
                      <label for="blog-date">Publish Date (Leave empty for today)</label>
                      <input type="text" id="blog-date" bind:value={newBlogPost.date} placeholder="e.g. June 08, 2026">
                    </div>
                    <div class="form-group">
                      <label for="blog-symbol">Cover Art Symbol</label>
                      <select id="blog-symbol" bind:value={newBlogPost.cover_symbol} required>
                        <option value="✦">Four-Point Star (✦)</option>
                        <option value="◆">Diamond (◆)</option>
                        <option value="◇">Hollow Diamond (◇)</option>
                        <option value="◈">Dotted Diamond (◈)</option>
                        <option value="♦">Suit Diamond (♦)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="blog-class">Cover Theme Color Class</label>
                      <select id="blog-class" bind:value={newBlogPost.cover_class} required>
                        <option value="ph-fashion">Fashion Dark (ph-fashion)</option>
                        <option value="ph-corporate">Corporate Green (ph-corporate)</option>
                        <option value="ph-wedding">Wedding Luxury (ph-wedding)</option>
                        <option value="ph-portrait">Portrait Gold (ph-portrait)</option>
                        <option value="ph-family">Family Warm (ph-family)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="blog-ex">Excerpt / Summary</label>
                      <textarea id="blog-ex" bind:value={newBlogPost.excerpt} placeholder="A short 1-2 sentence hook to preview the post..." rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                      <label for="blog-body">Article Content (Supports HTML)</label>
                      <textarea id="blog-body" bind:value={newBlogPost.content} placeholder="Use HTML tags like <p>, <h3>, etc. to write article..." rows="8" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn" disabled={isBlogSubmitting}>
                      {isBlogSubmitting ? 'Publishing...' : 'Publish Post'}
                    </button>
                  </form>
                </div>

                <!-- Existing Articles List -->
                <div class="card-table-wrap">
                  <h2>Published Articles</h2>
                  {#if blogPosts.length === 0}
                    <p class="empty-state">No published blog posts found. Using defaults.</p>
                  {:else}
                    <div class="table-responsive">
                      <table class="admin-table">
                        <thead>
                          <tr>
                            <th>Cover</th>
                            <th>Details</th>
                            <th>Excerpt</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each blogPosts as post (post.id)}
                            <tr>
                              <td>
                                <div class="admin-portfolio-preview {post.cover_class}" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
                                  {post.cover_symbol}
                                </div>
                              </td>
                              <td>
                                <strong>{post.title}</strong><br>
                                <span class="badge badge-gold" style="font-size:0.6rem;padding:0.15rem 0.4rem;">{post.category}</span>
                              </td>
                              <td><small class="notes-preview" title={post.excerpt}>{post.excerpt}</small></td>
                              <td>
                                <button class="action-btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.7rem;" onclick={() => deleteBlogPost(post.id)}>Delete</button>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-container {
    max-width: 1200px;
    margin: 0 auto 6rem;
    padding: 0 3rem;
  }
  @media (max-width: 768px) {
    .admin-container {
      padding: 0 1.5rem;
    }
  }

  /* WARNING CARD */
  .admin-warning-card {
    background: rgba(184, 147, 54, 0.05);
    border: 1px solid var(--gold);
    padding: 3rem;
    text-align: center;
    border-radius: 4px;
    max-width: 700px;
    margin: 4rem auto;
  }
  .admin-warning-card h3 {
    font-size: 1.6rem;
    color: var(--gold);
    margin-bottom: 1rem;
    font-weight: 500;
  }
  .admin-warning-card p {
    color: var(--muted);
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
  .sql-box {
    text-align: left;
    background: var(--dark);
    padding: 1.8rem;
    border-left: 2px solid var(--gold);
    font-size: 0.85rem;
    line-height: 1.7;
    color: var(--ivory);
  }
  .sql-box ol {
    margin-left: 1.5rem;
    margin-top: 0.5rem;
  }

  /* LOGIN */
  .admin-login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rem 0;
  }
  .admin-login-card {
    background: var(--dark);
    border: 1px solid var(--border);
    padding: 3.5rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  }
  .admin-login-card h2 {
    font-size: 1.8rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 0.5rem;
    color: var(--ivory);
  }
  .login-sub {
    color: var(--muted);
    font-size: 0.85rem;
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .auth-error {
    background: rgba(255, 107, 107, 0.08);
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    padding: 0.8rem;
    text-align: center;
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
  }

  /* DASHBOARD HEADER */
  .dashboard-wrap {
    margin-top: 2rem;
  }
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }
  .dashboard-user {
    font-size: 0.88rem;
    color: var(--muted);
  }
  .dashboard-user strong {
    color: var(--gold);
  }
  .logout-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--ivory);
    padding: 0.5rem 1.2rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }
  .logout-btn:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  /* TABS */
  .dashboard-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1px;
  }
  .tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    padding: 0.8rem 1.5rem;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    transition: all 0.3s;
  }
  .tab-btn:hover {
    color: var(--ivory);
  }
  .tab-btn.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }

  /* CARD LAYOUTS */
  .card-table-wrap, .card-form-wrap {
    background: var(--dark);
    border: 1px solid var(--border);
    padding: 2.5rem;
    margin-bottom: 3rem;
  }
  .card-table-wrap h2, .card-form-wrap h2 {
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 2rem;
    border-left: 2px solid var(--gold);
    padding-left: 1rem;
    color: var(--ivory);
  }

  /* TABLES */
  .table-responsive {
    overflow-x: auto;
    width: 100%;
  }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    text-align: left;
  }
  .admin-table th {
    border-bottom: 1px solid var(--border);
    padding: 1rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
  .admin-table td {
    padding: 1.2rem 1rem;
    border-bottom: 1px solid var(--border);
    color: var(--ivory);
    vertical-align: top;
  }
  .admin-table tbody tr:hover {
    background: var(--card-glow-bg);
  }

  .notes-preview {
    display: block;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: help;
  }
  .message-cell {
    max-width: 400px;
    line-height: 1.6;
    color: var(--muted);
  }

  .empty-state {
    color: var(--muted);
    text-align: center;
    padding: 3rem 0;
    font-style: italic;
  }

  .admin-loading {
    text-align: center;
    color: var(--muted);
    padding: 4rem;
    font-style: italic;
  }

  /* BADGES & BUTTONS */
  .badge {
    display: inline-flex;
    padding: 0.25rem 0.6rem;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 0;
  }
  .badge-gold {
    background: rgba(184, 147, 54, 0.15);
    color: var(--gold);
  }
  .badge-outline {
    border: 1px solid var(--border);
    color: var(--muted);
  }

  .action-btn-danger {
    background: transparent;
    border: 1px solid rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    padding: 0.4rem 0.9rem;
    font-size: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
  }
  .action-btn-danger:hover {
    background: rgba(255, 107, 107, 0.08);
    border-color: #ff6b6b;
  }

  /* PORTFOLIO GRID */
  .portfolio-dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 2.5rem;
  }
  @media (max-width: 1024px) {
    .portfolio-dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
