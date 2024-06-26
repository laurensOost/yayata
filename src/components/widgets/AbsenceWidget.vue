<script setup>
import {
  faChevronLeft,
  faChevronRight,
  faTemperatureThreeQuarters,
  faTree
} from "@fortawesome/free-solid-svg-icons";
</script>
<template lang="pug">
div(class='card widget-card widget-px widget-py shadow-sm')
  div(class="card-header d-flex flex-row align-items-center mb-3 p-0")
    span Absences on {{ formattedDate }}
    div(class='flex-grow-1')
    div(class="d-flex gx-1")
      button(
        class="btn btn-info-soft rounded-pill btn-sm btn-square text-info d-flex align-items-center"
        @click="previousDay"
      )
        font-awesome-icon(:icon="faChevronLeft")
      button(
        class="btn btn-info-soft rounded-pill btn-sm btn-square text-info d-flex align-items-center"
        @click="nextDay"
      )
        font-awesome-icon(:icon="faChevronRight")
  div(class='card-body')
    div(class="d-flex flex-row flex-wrap g-3 agenda-block-body")
      div(
        v-if="absences.length !== 0"
        v-for="user in absences"
        :key="user.id"
        class="d-flex align-items-center"
      )
        AgendaAvatar(:user="user" color="info")
      div(
        v-if="absences.length === 0"
        class="d-flex justify-content-center align-items-center w-100"
      )
        p(class="text-info no-absences m-0")
          | No absences on {{ formattedDate }}
</template>

<script>
import moment from 'moment';
import * as types from '../../store/mutation-types';
import store from '../../store';
import AgendaBlock from "./AgendaWidget/AgendaBlock.vue";
import AgendaAvatar from "./AgendaWidget/AgendaAvatar.vue";
import {NINETOFIVER_RELOAD_USERS} from "../../store/mutation-types";
import {toPairs} from "lodash";

export default {
  name: 'AbsenceWidget',
  components: {
    AgendaBlock,
    AgendaAvatar,
  },
  data () {
    return {
      selectedDate: null,
      absences: []
    }
  },
  computed: {
    formattedDate() {
      return this.selectedDate?.format('YYYY-MM-DD') ?? 'today'
    },
  },
  created() {
    new Promise((resolve) => {
      if (!store.getters.users) {
        store.dispatch(NINETOFIVER_RELOAD_USERS).then(() => resolve())
      } else {
        resolve()
      }
    }).then(() => {
      this.$set(this, 'selectedDate', moment())
    })
  },

  watch: {
    selectedDate() {
      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/range_availability/',
        params: {
          from: this.selectedDate.format('YYYY-MM-DD'),
          until: this.selectedDate.format('YYYY-MM-DD')
        }
      }).then((res) => {
        this.absences = [];

        if (!this.selectedDate && !res.data) return;

        toPairs(res.data).forEach(([userId, availability]) => {
          const currentDayAvailability = availability[this.selectedDate.format('YYYY-MM-DD')]

          if (currentDayAvailability?.sickness.length || currentDayAvailability?.leave.length) {
            const user = store.getters.users.find((user) => user.id === parseInt(userId));
            this.absences.push({
              ...user,
              isSick: currentDayAvailability.sickness.length > 0,
              isOnLeave: currentDayAvailability.leave.length > 0,
            })
          }
        });
      });
    }
  },
  methods: {
    previousDay() {
      this.$set(this, 'selectedDate', moment(this.selectedDate).subtract(1, 'days'))
    },
    nextDay() {
      this.$set(this, 'selectedDate', moment(this.selectedDate).add(1, 'days'))
    },
  },
}

</script>

<style lang="scss" scoped>
@import "../../assets/scss/components/widgets";

.no-absences {
  font-size: 1rem;
  font-weight: 700;
  color: $info;
}
</style>
