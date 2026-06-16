<script>
  import Card from './Card.svelte';
  import CardContent from './CardContent.svelte';
  import Avatar from './Avatar.svelte';
  import AvatarImage from './AvatarImage.svelte';
  import AvatarFallback from './AvatarFallback.svelte';
  import Marquee from './Marquee.svelte';

  let { testimonialsList = [] } = $props();

  // Stock profile photos from Unsplash
  const stockImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', // Female 1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', // Male 1
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', // Female 2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', // Male 2
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150', // Female 3
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150', // Male 3
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', // Female 4
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150', // Male 4
  ];

  const stockCountries = [
    '🇳🇬 Nigeria', '🇺🇸 USA', '🇬🇧 UK', '🇨🇦 Canada', '🇦🇺 Australia', '🇩🇪 Germany', '🇫🇷 France', '🇯🇵 Japan'
  ];

  // Process testimonials list to match standard structure
  let processedTestimonials = $derived.by(() => {
    // If we only have the default few local testimonials, we duplicate them/fill with demo testimonials to make the vertical columns look rich and full.
    const baseList = testimonialsList.length > 0 ? testimonialsList : [
      {
        quote: "The team at Mesh-Photography is exceptionally professional. Even when we arrived unprepared for our shoot, they guided us through poses and made us feel at ease. The final portraits are absolute masterpieces.",
        author: "Damilola Benson",
        role: "Corporate Branding Client",
        org: "Benson Holdings",
      },
      {
        quote: "Meshach documented our wedding day with so much grace. The lighting and candid moments caught on camera are truly timeless. Looking back at the images makes us feel the exact same love.",
        author: "Sarah & Tunde",
        role: "Wedding Session",
        org: "Private Clients",
      },
      {
        quote: "I had a personal branding session at the studio. They are true visual storytellers who know how to capture confidence. I struggled to select my favorites because all the images were so lovely!",
        author: "Victoria Alao",
        role: "Creative Director",
        org: "Alao Agency",
      }
    ];

    const mapped = baseList.map((item, idx) => {
      const name = item.author || 'Anonymous Client';
      const cleanOrg = item.org ? item.org : 'Client';
      const username = `@${cleanOrg.toLowerCase().replace(/\s+/g, '')}`;
      const body = item.quote || '';
      const img = item.imageUrl || stockImages[idx % stockImages.length];
      const country = item.country || stockCountries[idx % stockCountries.length];

      return {
        name,
        username,
        body,
        img,
        country
      };
    });

    // If the mapped array is short, repeat it to ensure the marquees are full
    if (mapped.length < 8) {
      let repeated = [...mapped];
      while (repeated.length < 8) {
        repeated = [...repeated, ...mapped.map((item, idx) => ({
          ...item,
          username: `${item.username}_${Math.floor(repeated.length / mapped.length + 1)}`
        }))];
      }
      return repeated;
    }

    return mapped;
  });
</script>

<!-- Outer 3D Container -->
<div class="border border-border rounded-lg relative flex h-[480px] w-full max-w-[800px] mx-auto flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px] bg-gradient-to-b from-card-glow-bg to-transparent">
  
  <!-- Inner Transform Panel -->
  <div
    class="flex flex-row items-center gap-4"
    style="transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);"
  >
    <!-- Column 1: Vertical Marquee (downwards) -->
    <Marquee vertical pauseOnHover repeat={3} class="[--duration:40s]">
      {#each processedTestimonials as review (review.username)}
        <Card class="w-50 border border-border/80 bg-card hover:border-gold/40 transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center gap-2.5">
              <Avatar class="h-9 w-9">
                <AvatarImage src={review.img} alt={review.name} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-foreground flex items-center gap-1">
                  {review.name} <span class="text-xs">{review.country}</span>
                </div>
                <p class="text-xs font-medium text-muted-foreground">{review.username}</p>
              </div>
            </div>
            <blockquote class="mt-3 text-sm text-secondary-foreground leading-relaxed">
              "{review.body}"
            </blockquote>
          </CardContent>
        </Card>
      {/each}
    </Marquee>

    <!-- Column 2: Vertical Marquee (upwards) -->
    <Marquee vertical pauseOnHover reverse repeat={3} class="[--duration:40s]">
      {#each [...processedTestimonials].reverse() as review (review.username + '_rev')}
        <Card class="w-50 border border-border/80 bg-card hover:border-gold/40 transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center gap-2.5">
              <Avatar class="h-9 w-9">
                <AvatarImage src={review.img} alt={review.name} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-foreground flex items-center gap-1">
                  {review.name} <span class="text-xs">{review.country}</span>
                </div>
                <p class="text-xs font-medium text-muted-foreground">{review.username}</p>
              </div>
            </div>
            <blockquote class="mt-3 text-sm text-secondary-foreground leading-relaxed">
              "{review.body}"
            </blockquote>
          </CardContent>
        </Card>
      {/each}
    </Marquee>

    <!-- Column 3: Vertical Marquee (downwards) -->
    <Marquee vertical pauseOnHover repeat={3} class="[--duration:40s]">
      {#each processedTestimonials as review (review.username + '_col3')}
        <Card class="w-50 border border-border/80 bg-card hover:border-gold/40 transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center gap-2.5">
              <Avatar class="h-9 w-9">
                <AvatarImage src={review.img} alt={review.name} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-foreground flex items-center gap-1">
                  {review.name} <span class="text-xs">{review.country}</span>
                </div>
                <p class="text-xs font-medium text-muted-foreground">{review.username}</p>
              </div>
            </div>
            <blockquote class="mt-3 text-sm text-secondary-foreground leading-relaxed">
              "{review.body}"
            </blockquote>
          </CardContent>
        </Card>
      {/each}
    </Marquee>

    <!-- Column 4: Vertical Marquee (upwards) -->
    <Marquee vertical pauseOnHover reverse repeat={3} class="[--duration:40s]">
      {#each [...processedTestimonials].reverse() as review (review.username + '_col4')}
        <Card class="w-50 border border-border/80 bg-card hover:border-gold/40 transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center gap-2.5">
              <Avatar class="h-9 w-9">
                <AvatarImage src={review.img} alt={review.name} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-foreground flex items-center gap-1">
                  {review.name} <span class="text-xs">{review.country}</span>
                </div>
                <p class="text-xs font-medium text-muted-foreground">{review.username}</p>
              </div>
            </div>
            <blockquote class="mt-3 text-sm text-secondary-foreground leading-relaxed">
              "{review.body}"
            </blockquote>
          </CardContent>
        </Card>
      {/each}
    </Marquee>
  </div>

  <!-- Gradient overlays for vertical marquee -->
  <div class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
  <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
  <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
  <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
</div>
