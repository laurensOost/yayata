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
      | Contract summary

    div(class='card-body')
      div(class="chart mb-3")
        Doughnut(:chartOptions="options" :chartData="chartCompleteData" ref="chart")
        div(class="chart-overlay")
          div(class="d-flex flex-column justify-content-center align-items-center")
            span {{ performedHours }}H / {{ computedWorkHours }}H
            span performed / total

      div(class="d-flex flex-column align-items-start gy-2")
        div(
          v-for="(performance, index) in performances"
          :key="performance.contract.id"
          class="d-flex gx-1 legend-item"
          :class="{'hovered': hoverContractIndex === index}"
          :style="{color: `#${chartShades[index].hex}`}"
        )
          div(class="legend-dot")
          span {{ performance.contract.display_label }}
</template>

<script>
import {Doughnut} from "vue-chartjs";
import moment from "moment/moment";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import Values from "values.js";
import {isEmpty} from "lodash";
import {EventBus} from "../../../utils/event-bus";

const inactiveColor = "#EBEBEB";
const primaryColor = "#0AA6C9";

export default {
  name: 'ContractsChartWidget',
  props: ['timesheet'],
  components: {
    Doughnut
  },
  data() {
    return {
      data: null,
      hoverContractIndex: null,
      options: {
        responsive: true,
        onHover: (_, elements) => {
          this.hoverContractIndex = elements?.[0]?.index;
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
              label(tooltipItem) {
                let label = tooltipItem.label.match(/^(\[[\w\/]*])/g)?.[0];

                return isEmpty(label) ? tooltipItem.label : label;
              },
              footer: function (tooltipItems) {
                const item = tooltipItems[0];
                const caption = [...item?.label.matchAll(/^\[[\w\/]*](.*)/g)]?.[0]?.[1]?.trim();

                return isEmpty(caption) ? item.label : caption;
              }
            }
          }
        }
      },
    }
  },
  computed: {
    performances() {
      return this.data?.summary?.performances || [];
    },
    computedWorkHours() {
      return (this.data?.work_hours - this.data?.leave_hours - this.data?.holiday_hours) ?? 0;
    },
    performedHours() {
      return this.data?.performed_hours || 0;
    },
    chartShades() {
      const count = this.performances.length || 0;

      return new Values(primaryColor).tints(100 / (count + 1)).reverse().slice(1);
    },
    chartCompleteData() {
      return {
        labels: [
          ...(this.performances.map(performance => performance.contract.display_label) || []),
          'Remaining'
        ],
        datasets: [{
          label: "Hours performed",
          data: [
            ...(this.performances.map(performance => performance.duration) || []),
            this.data?.remaining_hours || 0,
          ],
          backgroundColor: [...this.chartShades.map(shade => `#${shade.hex}`), inactiveColor],
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

    EventBus.$on('performance:logged', () => {
      this.getData()
    })
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
