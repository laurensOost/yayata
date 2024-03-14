<script setup>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
</script>

<template lang="pug">
  ThemedBlock(:color='color' class="agenda-block gx-3")
    div(class="agenda-header d-flex align-items-center gx-2")
      FontAwesomeIcon(:icon='icon' :class="`text-${iconColor}`")
      p {{ title }}
      div(class="flex-grow-1")
      slot(name="header_end")
    slot
</template>

<script>
import ThemedBlock from "../../ui/ThemedBlock.vue";

export default {
  name: 'AgendaBlock',
  components: {ThemedBlock},
  props: {
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: [Object, Array, String],
      required: true,
    },
    title: {
      type: String,
      required: true,
    }
  },
  computed: {
    iconColor() {
      return this.$props.color.includes('soft') ? this.$props.color.replace('-soft', '') : `${this.$props.color}-soft`;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.agenda-block {
  width: 100%;
  padding: 12px 16px;

  .agenda-header {
    margin-bottom: 0.75rem;

    svg {
      aspect-ratio: 1 / 1;
      font-size: 1.25rem;
    }

    p {
      font-size: 1rem;
      line-height: 143.75%;
      font-weight: 500;
      color: $gray-900;
      margin: 0;
    }
  }
}
</style>
