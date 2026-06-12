<script>
  import { onMount } from 'svelte';
  import { supabase } from '../supabaseClient.js';

  let activeArticle = $state(null);
  let dbPosts = $state([]);

  const defaultPosts = [
    {
      id: 1,
      category: 'editorial',
      title: 'The Art of Natural Light in Portraiture',
      excerpt: 'Exploring the subtle nuances of window light, shadows, and mood inside minimal studio spaces.',
      content: `
        <p>Natural light is one of the most powerful tools in a portrait photographer’s arsenal. It carries a quality of softness and honesty that artificial lighting setups strive to replicate but rarely fully capture. In this guide, we explore how to harness simple ambient illumination to create striking, fine-art portraiture.</p>
        
        <h3>1. The Magic of Side Lighting</h3>
        <p>By positioning your subject at a 90-degree angle to a window, you introduce dramatic, soft shadows across their features. This technique, often referred to as chiaroscuro, emphasizes texture, depth, and the natural contours of the face.</p>
        
        <h3>2. Diffusing Harsh Sunlight</h3>
        <p>Direct midday sunlight can create unflattering, hard shadows under the eyes and nose. To counteract this, utilize sheer white curtains to act as a massive softbox, or shoot in areas of open shade where light is reflected from adjacent walls.</p>
        
        <h3>3. Catchlights and the Eyes</h3>
        <p>The eyes are the centerpiece of any portrait. Ensure that your subject is angled slightly toward the light source to capture beautiful "catchlights"—small reflections that bring vitality and depth to the eyes.</p>
      `,
      date: 'June 08, 2026',
      readTime: '4 min read',
      class: 'ph-fashion',
      symbol: '✦'
    },
    {
      id: 2,
      category: 'guides',
      title: 'Crafting Your Brand Identity: Executive Imagery',
      excerpt: 'Why high-end personal branding headshots are the most critical investment for your creative career.',
      content: `
        <p>In today's digital-first landscape, your visual representation is often your first introduction to clients, partners, and employers. A generic, poorly lit headshot can diminish the perceived value of your expertise. Here is why investing in premium editorial corporate headshots is key to elevating your professional brand.</p>
        
        <h3>1. Conveying Trust and Confidence</h3>
        <p>A professional portrait blends technical precision with emotional warmth. Through proper posing and expert direction, we capture a sense of calm authority and approachability that communicates competence immediately.</p>
        
        <h3>2. Consistency Across Platforms</h3>
        <p>Whether it is LinkedIn, your company’s team page, or a feature in an industry publication, having a cohesive set of high-resolution headshots ensures that your personal brand remains uniform and polished.</p>
        
        <h3>3. Styling for Impact</h3>
        <p>Your wardrobe choices should reflect your industry and personality. We recommend classic tailoring, solid neutral colors, and structural silhouettes that stand the test of time rather than fleeting fashion trends.</p>
      `,
      date: 'May 28, 2026',
      readTime: '6 min read',
      class: 'ph-corporate',
      symbol: '◇'
    },
    {
      id: 3,
      category: 'behind the scenes',
      title: 'Editorial Visuals: Behind the Lens in Tallinn',
      excerpt: 'A retrospective on our recent location shoot, discussing gear, set planning, and composition.',
      date: 'May 14, 2026',
      readTime: '8 min read',
      class: 'ph-wedding',
      symbol: '♦'
    }
  ];

  function openArticle(post) {
    activeArticle = post;
    document.body.style.overflow = 'hidden';
  }

  function closeArticle() {
    activeArticle = null;
    document.body.style.overflow = '';
  }

  onMount(async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          dbPosts = data.map(item => ({
            id: item.id,
            category: item.category,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            date: item.date,
            readTime: item.read_time,
            class: item.cover_class,
            symbol: item.cover_symbol
          }));
        }
      } catch (err) {
        console.warn('Could not load blog posts from Supabase, using defaults:', err);
      }
    }
  });

  let activePostsList = $derived(dbPosts.length > 0 ? dbPosts : defaultPosts);
</script>

<div class="page active" id="page-blog">
  <div class="page-hero">
    <span class="section-label" style="display:block;margin-bottom:1rem">our journal</span>
    <h1>the blog</h1>
    <p>Stories, guides, and visual essays from our creative studio.</p>
  </div>

  <div class="portfolio-container" style="margin-top: 2rem;">
    <div class="blog-grid">
      {#each activePostsList as post (post.id)}
        <div class="blog-card" onclick={() => openArticle(post)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && openArticle(post)}>
          <div class="blog-image-wrap {post.class}">
            <span class="blog-symbol">{post.symbol}</span>
          </div>
          <div class="blog-info">
            <span class="blog-meta">{post.category} &bull; {post.readTime}</span>
            <h2 class="blog-post-title">{post.title}</h2>
            <p class="blog-excerpt">{post.excerpt}</p>
            <div class="blog-footer">
              <span class="blog-date">{post.date}</span>
              <span class="blog-read-link">Read Article &rarr;</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- ARTICLE MODAL -->
  {#if activeArticle}
    <div class="blog-modal-backdrop" onclick={closeArticle} role="presentation">
      <div class="blog-modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
        <button class="blog-modal-close" onclick={closeArticle} aria-label="Close modal">&times;</button>
        <div class="blog-modal-header">
          <span class="blog-meta-large">{activeArticle.category} &bull; {activeArticle.readTime}</span>
          <h1 id="modal-title" class="blog-modal-title">{activeArticle.title}</h1>
          <span class="blog-modal-date">{activeArticle.date}</span>
        </div>
        <div class="blog-modal-content">
          <div class="blog-modal-cover {activeArticle.class}">
            <span class="blog-modal-symbol">{activeArticle.symbol}</span>
          </div>
          <div class="blog-article-body">
            {#if activeArticle.content}
              {@html activeArticle.content}
            {:else}
              <p>The full narrative of this editorial project is currently being compiled for print publication. Check back soon for the complete behind-the-scenes breakdown, including studio lighting design files and gear sheets.</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    margin-bottom: 6rem;
  }
  @media (max-width: 1024px) {
    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }
  @media (max-width: 768px) {
    .blog-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  .blog-card {
    background: var(--dark);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .blog-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
    border-color: var(--gold);
  }

  .blog-image-wrap {
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .blog-symbol {
    font-size: 3rem;
    color: var(--gold);
    opacity: 0.6;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s;
  }
  .blog-card:hover .blog-symbol {
    transform: scale(1.15) rotate(5deg);
    opacity: 0.9;
  }

  .blog-info {
    padding: 2.2rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .blog-meta {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--gold);
    margin-bottom: 0.8rem;
    display: block;
    font-weight: 600;
  }

  .blog-post-title {
    font-family: var(--serif);
    font-size: 1.4rem;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: var(--ivory);
    font-weight: 500;
    transition: color 0.3s;
  }
  .blog-card:hover .blog-post-title {
    color: var(--gold);
  }

  .blog-excerpt {
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--muted);
    margin-bottom: 2rem;
    flex-grow: 1;
  }

  .blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 1.2rem;
    font-size: 0.8rem;
  }

  .blog-date {
    color: var(--muted);
  }

  .blog-read-link {
    font-weight: 600;
    color: var(--ivory);
    transition: transform 0.3s;
    letter-spacing: 0.05em;
  }
  .blog-card:hover .blog-read-link {
    transform: translateX(4px);
    color: var(--gold);
  }

  /* MODAL STYLES */
  .blog-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .blog-modal {
    background: var(--ink);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 850px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    padding: 3.5rem;
    animation: fadeInModal 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  @keyframes fadeInModal {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    .blog-modal {
      padding: 2rem;
    }
  }

  .blog-modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-size: 2.2rem;
    background: none;
    border: none;
    color: var(--ivory);
    cursor: pointer;
    line-height: 1;
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  .blog-modal-close:hover {
    opacity: 1;
    color: var(--gold);
  }

  .blog-modal-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .blog-meta-large {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--gold);
    font-weight: 600;
    display: block;
    margin-bottom: 1rem;
  }

  .blog-modal-title {
    font-family: var(--serif);
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    line-height: 1.25;
    color: var(--ivory);
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .blog-modal-date {
    font-size: 0.85rem;
    color: var(--muted);
  }

  .blog-modal-cover {
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
  }
  @media (max-width: 768px) {
    .blog-modal-cover {
      height: 200px;
      margin-bottom: 2rem;
    }
  }
  .blog-modal-symbol {
    font-size: 5rem;
    color: var(--gold);
    opacity: 0.7;
  }

  .blog-article-body {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--ivory);
    opacity: 0.9;
  }
  .blog-article-body :global(p) {
    margin-bottom: 1.8rem;
  }
  .blog-article-body :global(h3) {
    font-family: var(--serif);
    font-size: 1.4rem;
    color: var(--gold);
    margin-top: 2rem;
    margin-bottom: 0.8rem;
    font-weight: 500;
  }
</style>
