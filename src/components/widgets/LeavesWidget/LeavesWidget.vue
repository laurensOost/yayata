<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='card widget-card shadow-sm' v-if="leaves.length")
    div(class="card-header justify-content-between widget-px py-0")
      p(class='widget-py')
        | Leaves

      div(class='d-flex gx-4')
        select(class='form-control form-control-sm' v-model="year" v-if="hasMultipleLeaveYears")
          option(v-for="leaveYear in leaveYears" :key="leaveYear" :value="leaveYear") {{ leaveYear }}
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
        LeavesTableRow(v-for="leave in leavesForSelectedYear" :key="leave.id" :leave="leave")
</template>

<script>
import LeaveStatusTag from "../../ui/LeaveStatusTag.vue";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import LeavesTableRow from "./LeavesTableRow.vue";
import {applyTransforms, transformDate} from "../../../utils/transformation";
import moment from 'moment';
import {uniq} from "lodash";

export default {
  name: 'LeavesWidget',
  components: {LeavesTableRow, LeaveStatusTag},

  data() {
    return {
      year: new Date().getFullYear(),
    };
  },

  created() {
    store.dispatch(types.NINETOFIVER_RELOAD_LEAVES);
  },

  watch: {
    /**
     * Set the year to the latest year in the leave years OR
     * to the current, if the current year is in the leave years.
     */
    leaveYears() {
      if (this.leaveYears.length === 0) return;

      const currentYear = `${new Date().getFullYear()}`;

      if (this.leaveYears.includes(currentYear)) {
        this.year = currentYear;
        return;
      }

      this.year = `${this.leaveYears.map(Number).sort().reverse()[0]}`;
    },
  },

  computed: {
    /** @return {Array<Leave>} */
    leaves() {
      if (!store.getters.leaves) return [];

      return store.getters.leaves.map(applyTransforms(transformDate))
    },
    /** @return {string[]} */
    leaveDates() {
      return uniq(
          this.leaves.map((leave) =>
              leave.leavedate_set.map((date) => ([
                    moment(date.starts_at).format('YYYY-MM-DD'),
                    moment(date.ends_at).format('YYYY-MM-DD'),
                  ])
              ).flat()
          ).flat()
      );
    },
    /** @return {string[]} */
    leaveYears() {
      if (this.leaves.length === 0) return [];

      return uniq(this.leaveDates.map((date) => moment(date).format('YYYY')));
    },
    /** @return {Array<Leave>} */
    leavesForSelectedYear() {
      return this.leaves.filter((leave) =>
          leave.leavedate_set.some((date) =>
              moment(date.starts_at).format('YYYY') === this.year ||
              moment(date.ends_at).format('YYYY') === this.year
          )
      );
    },
    hasMultipleLeaveYears() {
      return this.leaveYears.length > 1;
    }
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
    max-height: 48px;

    & > div:first-child {
      width: fit-content;
    }

    & > * {
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
