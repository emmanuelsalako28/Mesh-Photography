<script>
  import { onMount } from 'svelte';
  import { supabase } from '../supabaseClient.js';

  // Props
  let { showPage } = $props();

  // State
  let session = $state(null);
  let activeTab = $state('bookings'); // 'bookings' | 'messages' | 'portfolio' | 'testimonials' | 'services' | 'about' | 'blog'
  
  // Auth Form State
  let email = $state('');
  let password = $state('');
  let authError = $state('');
  let isAuthLoading = $state(false);

  // Data Lists
  let bookings = $state([]);
  let messages = $state([]);
  let portfolioItems = $state([]);
  let testimonials = $state([]);
  let services = $state([]);
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
  let selectedImageFile = $state(null);
  let itemSubmitError = $state('');
  let isItemSubmitting = $state(false);

  // New Testimonial Form State
  let newTestimonial = $state({
    quote: '',
    author: '',
    role: '',
    org: '',
    portrait_class: 'ph-portrait',
    portrait_art: '◆'
  });
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

  // Add testimonial handler
  async function addTestimonial(e) {
    e.preventDefault();
    testimonialError = '';
    isTestimonialSubmitting = true;
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([newTestimonial])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        testimonials = [data[0], ...testimonials];
      }
      newTestimonial = {
        quote: '',
        author: '',
        role: '',
        org: '',
        portrait_class: 'ph-portrait',
        portrait_art: '◆'
      };
    } catch (err) {
      testimonialError = err.message || 'Failed to add testimonial.';
    } finally {
      isTestimonialSubmitting = false;
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
              <!-- TESTIMONIALS MANAGER SECTION -->
              <div class="portfolio-dashboard-grid">
                <!-- Add Form -->
                <div class="card-form-wrap">
                  <h2>Add Testimonial</h2>
                  {#if testimonialError}
                    <div class="auth-error">{testimonialError}</div>
                  {/if}
                  <form onsubmit={addTestimonial}>
                    <div class="form-group">
                      <label for="test-author">Client Name / Author</label>
                      <input type="text" id="test-author" bind:value={newTestimonial.author} placeholder="Damilola Benson" required>
                    </div>
                    <div class="form-group">
                      <label for="test-role">Role Description</label>
                      <input type="text" id="test-role" bind:value={newTestimonial.role} placeholder="Corporate Branding Client" required>
                    </div>
                    <div class="form-group">
                      <label for="test-org">Organization</label>
                      <input type="text" id="test-org" bind:value={newTestimonial.org} placeholder="Benson Holdings" required>
                    </div>
                    <div class="form-group">
                      <label for="test-portrait-class">Portrait Style Placeholder Class</label>
                      <select id="test-portrait-class" bind:value={newTestimonial.portrait_class} required>
                        <option value="ph-portrait">Portrait Style (ph-portrait)</option>
                        <option value="ph-wedding">Wedding Style (ph-wedding)</option>
                        <option value="ph-fashion">Fashion Style (ph-fashion)</option>
                        <option value="ph-family">Family Style (ph-family)</option>
                        <option value="ph-corporate">Corporate Style (ph-corporate)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="test-portrait-art">Portrait Art Symbol</label>
                      <select id="test-portrait-art" bind:value={newTestimonial.portrait_art} required>
                        <option value="◆">Diamond (◆)</option>
                        <option value="◈">Dotted Diamond (◈)</option>
                        <option value="❋">Floral (❋)</option>
                        <option value="◇">Hollow Diamond (◇)</option>
                        <option value="✦">Four-Point Star (✦)</option>
                        <option value="♦">Suit Diamond (♦)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="test-quote">Quote / Kind Words</label>
                      <textarea id="test-quote" bind:value={newTestimonial.quote} placeholder="Write the testimonial message here..." rows="4" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn" disabled={isTestimonialSubmitting}>
                      {isTestimonialSubmitting ? 'Adding...' : 'Add Testimonial'}
                    </button>
                  </form>
                </div>

                <!-- Existing Testimonials List -->
                <div class="card-table-wrap">
                  <h2>Active Testimonials</h2>
                  {#if testimonials.length === 0}
                    <p class="empty-state">No testimonials found in database. Using defaults.</p>
                  {:else}
                    <div class="table-responsive">
                      <table class="admin-table">
                        <thead>
                          <tr>
                            <th>Visual</th>
                            <th>Author & Org</th>
                            <th>Quote Preview</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each testimonials as t (t.id)}
                            <tr>
                              <td>
                                <div class="admin-portfolio-preview {t.portrait_class}" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
                                  {t.portrait_art}
                                </div>
                              </td>
                              <td>
                                <strong>{t.author}</strong><br>
                                <small style="color:var(--muted)">{t.role} / {t.org}</small>
                              </td>
                              <td><small class="notes-preview" title={t.quote}>{t.quote}</small></td>
                              <td>
                                <button class="action-btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.7rem;" onclick={() => deleteTestimonial(t.id)}>Delete</button>
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
