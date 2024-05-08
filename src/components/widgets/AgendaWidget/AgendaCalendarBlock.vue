<script setup>
import {faCalendarDay} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='col')
    AgendaBlock(
      color="primary-soft"
      :icon="faCalendarDay"
      title="Calendar"
    )
      div(class="d-flex align-items-center flex-column calendar-body")
        p {{ dayOfTheWeek }}
        p {{ dayOfTheMonth }}
        p {{ shortMonth }}
        p {{ year }}
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";

export default {
  name: 'AgendaCalendarBlock',
  components: {AgendaBlock},
  computed: {
    dayOfTheWeek() {
      return new Date().toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase();
    },
    dayOfTheMonth() {
      return new Date().toLocaleDateString('en-US', {day: 'numeric'}).padStart(2, '0').toUpperCase();
    },
    shortMonth() {
      return new Date().toLocaleDateString('en-US', {month: 'short'}).toUpperCase();
    },
    year() {
      return new Date().toLocaleDateString('en-US', {year: 'numeric'});
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.calendar-body {
  p {
    width: 100%;
    margin: 0;
    text-align: center;
    font-weight: 600;
    line-height: 1.15;
    color: $gray-900;

    &:nth-child(1) {
      font-size: 1.75rem;
    }

    &:nth-child(2) {
      font-size: 3rem;
    }

    &:nth-child(3) {
      font-size: 1.75rem;
    }

    &:nth-child(4) {
      font-size: 1.5rem;
    }
  }
}
</style>
