<script>
  import { onMount } from 'svelte';
  import { supabase } from '../supabaseClient.js';

  // State
  let session = $state(null);
  let activeTab = $state('bookings'); // 'bookings' | 'messages' | 'portfolio'
  
  // Auth Form State
  let email = $state('');
  let password = $state('');
  let authError = $state('');
  let isAuthLoading = $state(false);

  // Data Lists
  let bookings = $state([]);
  let messages = $state([]);
  let portfolioItems = $state([]);
  let isDataLoading = $state(false);

  // New Portfolio Item Form State
  let newPortfolioItem = $state({
    title: '',
    category: 'portraits',
    art_symbol: '◆',
    aspect_ratio: '100%',
    custom_style: ''
  });
  let itemSubmitError = $state('');
  let isItemSubmitting = $state(false);

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

  // Add portfolio item handler
  async function addPortfolioItem(e) {
    e.preventDefault();
    itemSubmitError = '';
    isItemSubmitting = true;

    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([newPortfolioItem])
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
    } catch (err) {
      itemSubmitError = err.message || 'Failed to add portfolio item.';
    } finally {
      isItemSubmitting = false;
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
            Portfolio Manager ({portfolioItems.length})
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
                                <div class="admin-portfolio-preview {p.category === 'videos' ? '' : 'ph-' + p.category}" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid var(--border); {p.custom_style || ''}">
                                  {p.art_symbol}
                                </div>
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
