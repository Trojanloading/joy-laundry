<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="'#'+iconClass" />
  </svg>
</template>

<script>
export default {
  name: "Svgicon",
  data() {
    return {};
  },
  props: {
    iconClass: {
      type: String
    }
  }
};
</script>