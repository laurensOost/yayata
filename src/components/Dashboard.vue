<template lang="pug">
  div(class='dashboard')
    div(class='row')
      div(class='col')
        DueTimesheetWarningWidget

    div(class='row gy-3 mb-3')
      div(class='col-xl-3')
        div(class='row d-flex flex-column flex-sm-row flex-xl-column gy-3 h-100')
          AgendaCalendarBlock
          AgendaEventsBlock

      AgendaBirthdayBlock(class="col-xl-3")

      div(class='col-xl-6 d-flex')
        AbsenceWidget(class="flex-grow-1")

    div(class='row gy-3 statistics full-height mb-3')
      div(class='col-6 col-sm-6 col-md-6 col-lg-3')
        WorkSummaryWidget(v-if='timesheet' :timesheet='timesheet')
      div(class='col-6 col-sm-6 col-md-6 col-lg-3')
        ContractsChartWidget(v-if='timesheet' :timesheet='timesheet')
      div(class='col-12 col-sm-12 col-md-12 col-lg-6')
        PerformanceWidget(v-if='timesheet' :timesheet='timesheet')

    div(class='row gy-3')
      div(class='col-12 col-sm-12 col-md-12 col-lg-6')
        LeavesWidget
      div(class='col-12 col-sm-12 col-md-12 col-lg-6')
        LeaveWidget
</template>

<script>
import store from '../store';
import * as types from '../store/mutation-types';
import PerformanceWidget from './widgets/PerformanceWidget.vue';
import DueTimesheetWarningWidget from './widgets/DueTimesheetWarningWidget.vue';
import LeaveWidget from './widgets/LeaveWidget.vue';
import LeavesWidget from "./widgets/LeavesWidget/LeavesWidget.vue";
import ContractsChartWidget from "./widgets/Charts/ContractsChartWidget.vue";
import WorkSummaryWidget from "./widgets/Charts/WorkSummaryWidget.vue";
import AgendaEventsBlock from "./widgets/AgendaWidget/AgendaEventsBlock.vue";
import AgendaBirthdayBlock from "./widgets/AgendaWidget/AgendaBirthdayBlock.vue";
import AgendaCalendarBlock from "./widgets/AgendaWidget/AgendaCalendarBlock.vue";
import AbsenceWidget from "./widgets/AbsenceWidget.vue";

export default {
  name: 'dashboard',

  created: function () {
    new Promise((resolve) => {
      if (!store.getters.current_timesheet) {
        store.dispatch(types.NINETOFIVER_RELOAD_TIMESHEETS).then(() => resolve())
      } else {
        resolve()
      }
    })
  },

  computed: {
    timesheet: () => store.getters.current_timesheet
  },

  components: {
    AbsenceWidget,
    AgendaCalendarBlock,
    AgendaBirthdayBlock,
    AgendaEventsBlock,
    LeavesWidget,
    PerformanceWidget,
    DueTimesheetWarningWidget,
    LeaveWidget,
    ContractsChartWidget,
    WorkSummaryWidget,
  },

  methods: {
    reloadTimesheets: () => {
      store.dispatch(types.NINETOFIVER_RELOAD_TIMESHEETS)
    }
  }
}
</script>

<style scoped lang='scss'>
.dashboard {
  --gap: 12px;

  .col {
    padding: 0 calc(var(--gap) * 0.5);
  }

  @for $i from 1 through 12 {
    .col-xl-#{$i} {
      padding: 0 calc(var(--gap) * 0.5);
    }
  }

  .row {
    margin-left: calc(var(--gap) * -0.5);
    margin-right: calc(var(--gap) * -0.5);

    & > div {
      padding: 0 calc(var(--gap) / 2);
    }

    &.full-height {
      & > div > div {
        height: 100%;
      }
    }
  }
}
</style>
