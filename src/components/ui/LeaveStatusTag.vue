<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<template>
  <div class="leave-tag rounded-pill" :class="status">
    <FontAwesomeIcon :icon='icon' size="xs" />
    <p>{{ humanReadableStatus }}</p>
  </div>
</template>

<script>
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import store from "../../store";
import * as types from "../../store/mutation-types";
import moment from "moment-timezone";

const humanReadableStatusMap = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Declined',
};
const iconMap = {
  pending: faClock,
  approved: faCheck,
  rejected: faXmark,
}

export default {
  name: 'LeaveStatusTag',

  props: {
    status: {
      type: String,
      validator: value => ['pending', 'approved', 'rejected'].includes(value),
      required: true,
    }
  },

  computed: {
    humanReadableStatus() {
      return humanReadableStatusMap[this.status];
    },
    icon() {
      return iconMap[this.status];
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/bootstrap/variables";

.leave-tag {
  width: fit-content;
  display: flex;
  padding: 3px 6px;
  gap: 4px;
  align-items: center;
  justify-content: center;
  touch-action: none;
  cursor: default;
  appearance: none;
  user-select: none;

  $status-colors: (
    pending: ($secondary, $secondary-soft),
    approved: ($success, $success-soft),
    rejected: ($danger, $danger-soft),
  );

  @each $status, $colors in $status-colors {
    &.#{$status} {
      color: nth($colors, 1);
      background-color: nth($colors, 2);
      border: 1px solid nth($colors, 1);
    }
  }

  p {
    font-size: 12px;
    font-weight: 400;
    line-height: 110%;
    margin: 0;
  }
}
</style>
