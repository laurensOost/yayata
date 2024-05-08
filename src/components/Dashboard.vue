<template lang="pug">
div
  div(class='row')
    div(class='col')
      DueTimesheetWarningWidget

  div(class='row mb-3')
      AgendaQuoteBlock
      AgendaEventsBlock
      AgendaBirthdayBlock
      AgendaCalendarBlock

  div(class='row statistics full-height mb-3')
    div(class='col-xl-3')
      WorkSummaryWidget(v-if='timesheet' :timesheet='timesheet')
    div(class='col-xl-3')
      ContractsChartWidget(v-if='timesheet' :timesheet='timesheet')
    div(class='col-xl-6')
      PerformanceWidget(v-if='timesheet' :timesheet='timesheet')

  div(class='row')
    div(class='col-xl-6')
      LeavesWidget
      LeaveWidget

    div(class='col-xl-6')
      AbsenceWidget
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
import AgendaQuoteBlock from "./widgets/AgendaWidget/AgendaQuoteBlock.vue";
import AgendaEventsBlock from "./widgets/AgendaWidget/AgendaEventsBlock.vue";
import AgendaBirthdayBlock from "./widgets/AgendaWidget/AgendaBirthdayBlock.vue";
import AgendaCalendarBlock from "./widgets/AgendaWidget/AgendaCalendarBlock.vue";
import AbsenceWidget from "./widgets/AbsenceWidget.vue";


export default {
  name: 'dashboard',

  created: function() {
    new Promise((resolve) => {
      if (!store.getters.current_timesheet) {
        store.dispatch(types.NINETOFIVER_RELOAD_TIMESHEETS).then(() => resolve())
      } else{
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
    AgendaQuoteBlock,
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
.row {
  --gap: 12px;
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
</style>
