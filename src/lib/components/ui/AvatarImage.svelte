<script>
  let { class: className = '', src, alt = '', ...props } = $props();
</script>

<img
  {src}
  {alt}
  class="aspect-square h-full w-full object-cover {className}"
  {...props}
/>
