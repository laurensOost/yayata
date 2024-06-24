<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, ChartDataLabels);
</script>

<template lang="pug">
  div(class='card widget-card widget-px widget-py shadow-sm' v-if="data")
    div(class="card-header mb-3 p-0")
      | Work summary

    div(class='card-body')
      div(class="chart mb-3")
        Doughnut(:chartOptions="options" :chartData="chartCompleteData" ref="chart")
        div(class="chart-overlay")
          div(class="d-flex flex-column justify-content-center align-items-center")
            span {{ totalHours }}H
            span total

      div(class="d-flex flex-wrap g-2")
        div(
          v-for="(type, index) in chartData"
          :key="type.label"
          class="d-flex gx-1 legend-item"
          :class="{'hovered': hoverTypeIndex === index}"
          :style="{color: type.color}"
        )
          div(class="legend-dot")
          span {{ type.label }}
</template>

<script>
import moment from "moment";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import {dangerColor, secondaryColor, successColor} from "../../../utils/theme/color";
import {Doughnut} from "vue-chartjs";

export default {
  name: 'WorkSummaryWidget',
  props: ['timesheet'],
  components: {
    Doughnut
  },
  data() {
    return {
      data: null,
      hoverTypeIndex: null,
      options: {
        responsive: true,
        onHover: (_, elements) => {
          this.hoverTypeIndex = elements?.[0]?.index;
        },
        interaction: {
          mode: 'point',
          axis: 'r',
          intersect: false
        },
        hoverOffset: 4,
        plugins: {
          tooltip: {
            callbacks: {
              label: ({label}) => label,
            }
          }
        }
      },
    }
  },
  computed: {
    totalHours() {
      return this.data?.work_hours ?? 0;
    },
    computedWorkHours() {
      return (this.data?.work_hours - this.data?.leave_hours - this.data?.holiday_hours) ?? 0;
    },
    holidayHours() {
      return this.data?.holiday_hours ?? 0;
    },
    leaveHours() {
      return this.data?.leave_hours ?? 0;
    },
    chartData() {
      return [
        {
          label: 'Work required',
          color: secondaryColor.soft,
          value: this.computedWorkHours,
        },
        ...(this.holidayHours ? [{
          label: 'Holiday',
          color: dangerColor.soft,
          value: this.holidayHours,
        }] : []),
        ...(this.leaveHours ? [{
          label: 'Leave taken',
          color: successColor.soft,
          value: this.leaveHours,
        }] : []),
      ]
    },
    chartLabels() {
      return this.chartData.map(item => item.label)
    },
    chartValues() {
      return this.chartData.map(item => item.value)
    },
    chartShades() {
      return this.chartData.map(item => item.color)
    },
    chartCompleteData() {
      return {
        labels: this.chartLabels,
        datasets: [{
          label: "Work summary",
          data: this.chartValues,
          backgroundColor: this.chartShades,
          cutout: '80%',
          datalabels: {
            anchor: 'center',
            backgroundColor: null,
            borderWidth: 0,
          }
        }]
      }
    }
  },
  created: function () {
    this.getData()
  },
  methods: {
    getData() {
      let start = moment().year(this.timesheet.year).month(this.timesheet.month - 1).startOf('month')
      let end = moment().year(this.timesheet.year).month(this.timesheet.month - 1).endOf('month')

      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/range_info/',
        params: {
          'from': start.format('YYYY-MM-DD'),
          'until': end.format('YYYY-MM-DD'),
          'summary': true
        }
      }).then(res => {
        this.data = res.data
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/components/widgets";
@import "./charts";
</style>
