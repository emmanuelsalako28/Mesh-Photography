<script>
  let { class: className = '', children, ...props } = $props();
</script>

<div
  class="rounded-lg border bg-card text-card-foreground shadow-sm {className}"
  {...props}
>
  {@render children?.()}
</div>
