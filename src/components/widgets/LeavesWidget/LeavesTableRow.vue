<script setup>
import LeaveWidget from "../LeaveWidget.vue";
import LeaveStatusTag from "../../ui/LeaveStatusTag.vue";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import {computed, ref} from "vue";
import moment from "moment";
import {maxBy, minBy} from "lodash";

/**
 * @typedef {import("vue").Ref} Ref
 * @typedef {import("bootstrap-vue").BModal} BModal
 * @typedef {import("../../../store/modules/ninetofiver").Leave} Leave
 */

/** @type {{ leave: Leave }} */
const props = defineProps({
  leave: {
    type: Object,
    required: true,
  },
});

/** @type {Ref<BModal | null>} */
const leaveModal = ref(null);

function handleLeaveClick() {
  if (props.leave.status !== 'pending') return;

  leaveModal.value.show();
}

function onLeaveModified() {
  store.dispatch(types.NINETOFIVER_RELOAD_LEAVES);

  leaveModal.value.hide();
}

const leaveType = computed(() => props.leave?.leave_type?.display_label ?? '');
const timeFrom = computed(() => {
  if (!props.leave) return '';

  return moment(minBy(props.leave?.leavedate_set, 'starts_at')?.starts_at)
      .format(props.leave?.leavedate_set?.length > 1 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm');
});
const timeTo = computed(() => {
  if (!props.leave) return '';

  return moment(maxBy(props.leave?.leavedate_set, 'ends_at')?.ends_at)
      .format(props.leave?.leavedate_set?.length > 1 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm');
});
</script>
<template lang="pug">
  div(
    class="leaves-row"
    :class="{'selectable': leave.status === 'pending'}"
    @click="handleLeaveClick()"
  )
    p {{ leaveType }}
    p {{ timeFrom }}
    p {{ timeTo }}
    LeaveStatusTag(v-if='leave.status' :status="leave.status")

    b-modal(ref='leaveModal' hide-header=true hide-footer=true lazy=true size='lg' content-class="bg-transparent border-0")
      LeaveWidget(
        :leave='leave'
        @success="onLeaveModified()"
      )
</template>

<style scoped lang="scss">
@import "../../../assets/scss/components/widgets";

.leaves-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 8px 22px;
  border-bottom: 1px solid $gray-400;

  &.selectable {
    &:hover {
      cursor: pointer;
      background: $gray-100;
    }
  }

  p {
    font-size: 14px;
    font-weight: 400;
    color: $gray-900;
    line-height: 110%;
    margin: 0;
  }
}
</style>
