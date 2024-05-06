<template lang="pug">
div(:class="`bg-${color} themed-block`")
  slot
</template>

<script>
export default {
  name: 'ThemedBlock',
  props: {
    color: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/bootstrap/theme";

.themed-block {
  @include rounded(3);
}
</style>
