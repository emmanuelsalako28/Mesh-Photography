<script>
  let { class: className = '', children, ...props } = $props();
</script>

<div
  class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full {className}"
  {...props}
>
  {@render children?.()}
</div>
