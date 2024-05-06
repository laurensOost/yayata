<template lang="pug">
  div(class="leaves-row")
    p {{ leaveType }}
    p {{ timeFrom }}
    p {{ timeTo }}
    LeaveStatusTag(v-if='leave.status' :status="leave.status")
</template>

<script>
import LeaveStatusTag from "../../ui/LeaveStatusTag.vue";
import {maxBy, minBy} from "lodash";

export default {
  name: 'LeavesTableRow',
  components: {LeaveStatusTag},

  props: {
    leave: {
      type: Object,
      required: true,
    }
  },

  computed: {
    leaveType() {
      return this.leave?.leave_type?.display_label ?? '';
    },
    timeFrom() {
      if (!this.leave) return '';

      return moment(minBy(this.leave?.leavedate_set, 'starts_at')?.starts_at).format(this.leave?.leavedate_set?.length > 1 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm');
    },
    timeTo() {
      if (!this.leave) return '';

      return moment(maxBy(this.leave?.leavedate_set, 'ends_at')?.ends_at).format(this.leave?.leavedate_set?.length > 1 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm');
    },
  },
}

</script>

<style scoped lang="scss">
@import "../../../assets/scss/components/widgets";

.leaves-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 8px 22px;
  border-bottom: 1px solid $gray-400;

  p {
    font-size: 14px;
    font-weight: 400;
    color: $gray-900;
    line-height: 110%;
    margin: 0;
  }
}
</style>
