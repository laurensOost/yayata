<script setup>
import {faCalendarCheck, faArrowUp} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  AgendaBlock(
    color="info-soft"
    :icon="faCalendarCheck"
    title="Events"
    :style="{flexGrow: 1}"
    v-if="events.length"
  )
    div(class="d-flex align-items-start flex-column gy-1 agenda-block-body")
      div(
        v-for="event in events"
        :key="event.id"
        class="d-flex flex-row align-items-start w-100 event-row"
      )
        div(
          v-if="event.is_running"
          :title="event.is_running ? 'Event is running' : 'Event is not running'"
          class="live"
          v-b-tooltip.hover.top="{ boundary: 'window', variant: 'primary' }"
          )
        div(class="d-flex flex-column flex-grow-1 info")
          p {{ event.display_label }}
          p {{ getEventDateString(event) }}
          p(v-if="event.location") {{ event.location.display_label }}

        a(
          v-if="event.link"
          :href="event.link"
          target="_blank"
          class="btn btn-info rounded-pill btn-sm btn-square text-info-soft d-flex align-items-center"
        )
          font-awesome-icon(:icon='faArrowUp' :style="{'aspect-ratio': '1/1', transform: 'rotate(45deg)'}" )
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";
import store from "../../../store";
import moment from "moment";
import * as types from "../../../store/mutation-types";

/**
 * @typedef Digit
 * @type {'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'}
 */

/**
 * @typedef Location
 * @type {object}
 * @property {string} display_label
 * @property {'Location'} type
 * @property {string} name
 */

/**
 * @typedef Event
 * @type {object}
 * @property {number} id
 * @property {'Event'} type
 * @property {string} name
 * @property {string} display_label
 * @property {string | null} link
 * @property {Location | null} location
 * @property {boolean} is_running
 * @property {`${Digit}${Digit}${Digit}${Digit}-${Digit}${Digit}-${Digit}${Digit}`} starts_at
 * @property {`${Digit}${Digit}${Digit}${Digit}-${Digit}${Digit}-${Digit}${Digit}`} ends_at
 */

export default {
  name: 'AgendaEventsBlock',
  components: {
    AgendaBlock,
  },
  data() {
    return {
      /** @var {Array<Event>} events */
      events: [],
    }
  },
  created() {
    store.dispatch(types.NINETOFIVER_API_REQUEST, {
      path: '/events/',
      params: {
        from: moment().startOf('month').format('YYYY-MM-DD'),
        until: moment().endOf('month').format('YYYY-MM-DD'),
      }
    }).then((res) => {
      this.events = res.data
    });
  },
  methods: {
    getEventDateString(event) {
      const startDate = moment(event.starts_at)
      const endDate = moment(event.ends_at)
      const isSingleDay = startDate.isSame(endDate, 'day')

      return isSingleDay
          ? startDate.format('DD/MM/YYYY')
          : `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.agenda-block-body {
  margin-left: 22px;
}

.event-row {
  position: relative;

  & > .live {
    $size: 0.5rem;
    position: absolute;
    top: calc(0.5rem - calc($size / 4));
    left: calc(-8px - $size);
    width: $size;
    height: $size;
    border-radius: $size;
    background-color: $primary;
  }

  & > .info {
    & > p {
      margin: 0;

      &:first-child {
        font-size: 0.875rem;
        color: $gray-900;
      }

      &:not(:first-child) {
        font-size: 0.75rem;
        color: $gray-500;
      }
    }
  }
}
</style>
