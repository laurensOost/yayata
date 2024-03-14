<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='card widget-card shadow-sm mb-3' v-if="leaves.length")
    div(class="card-header widget-px py-0")
      p(class='widget-py')
        | Leaves
      div
        router-link(:to='{ name: "leave" }')
          button(class='btn btn-primary-soft rounded-pill btn-sm btn-square text-primary d-flex align-items-center')
            FontAwesomeIcon(:icon='faArrowUp' :style="{'aspect-ratio': '1/1', transform: 'rotate(45deg)'}" )
    div(class="card-body")
      div(class="leaves-header")
        p Leave Type
        p Time From
        p Time To
        p Time Action
      div(class="leaves-table")
        LeavesTableRow(v-for="leave in leaves" :key="leave.id" :leave="leave")
</template>

<script>
import LeaveStatusTag from "../../ui/LeaveStatusTag.vue";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import LeavesTableRow from "./LeavesTableRow.vue";

export default {
  name: 'LeavesWidget',
  components: {LeavesTableRow, LeaveStatusTag},

  created() {
    store.dispatch(types.NINETOFIVER_RELOAD_LEAVES);
  },

  computed: {
    leaves() {
      if (!store.getters.leaves) return [];

      return store.getters.leaves
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/components/widgets";

p {
  margin: 0;
}

.widget-card {
  .card-header {
    display: flex;
    align-items: center;

    & > * {
      flex-grow: 1;
      display: flex;

      &:first-child {
        justify-content: flex-start;
      }

      &:last-child {
        justify-content: flex-end;
      }
    }
  }
}

.leaves-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 6px 22px;
  background: $gray-100;
  border-top: 1px solid $gray-400;
  border-bottom: 1px solid $gray-400;

  p {
    font-size: 12px;
    font-weight: 400;
    color: $gray-500;
    line-height: 110%;
  }
}

.leaves-table {
  overflow-y: auto;
  max-height: 191px;
}

</style>
