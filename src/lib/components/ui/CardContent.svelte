<script>
  let { class: className = '', children, ...props } = $props();
</script>

<div class="p-6 pt-0 {className}" {...props}>
  {@render children?.()}
</div>
