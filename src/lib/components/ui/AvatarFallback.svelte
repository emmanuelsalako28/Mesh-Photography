<script>
  let { class: className = '', children, ...props } = $props();
</script>

<div
  class="flex h-full w-full items-center justify-center rounded-full bg-muted {className}"
  {...props}
>
  {@render children?.()}
</div>
