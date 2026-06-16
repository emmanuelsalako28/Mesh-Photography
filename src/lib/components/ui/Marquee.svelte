<script>
  let {
    class: className = '',
    reverse = false,
    pauseOnHover = false,
    vertical = false,
    repeat = 4,
    ariaLabel = undefined,
    ariaLive = 'off',
    ariaRole = 'marquee',
    children,
    ...props
  } = $props();
</script>

<div
  {...props}
  class="group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] {vertical ? 'flex-col' : 'flex-row'} {className}"
  aria-label={ariaLabel}
  aria-live={ariaLive}
  role={ariaRole}
>
  {#each Array.from({ length: repeat }) as _, i}
    <div
      class="flex shrink-0 justify-around {!vertical ? 'flex-row [gap:var(--gap)]' : 'flex-col [gap:var(--gap)]'} {!vertical ? 'animate-marquee' : 'animate-marquee-vertical'} {pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''} {reverse ? '[animation-direction:reverse]' : ''}"
    >
      {@render children?.()}
    </div>
  {/each}
</div>
