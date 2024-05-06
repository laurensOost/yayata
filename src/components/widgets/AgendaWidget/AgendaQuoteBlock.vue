<script setup>
import {faQuoteLeft} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  AgendaBlock(
    color="secondary-soft"
    :icon="faQuoteLeft"
    title="Quote of the day"
    v-if="quote"
  )
    div(class="d-flex align-items-start flex-column gy-1 agenda-block-body")
      p {{ quoteText }}
      p {{ author }}
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import {sample} from "lodash";

/**
 * @typedef Digit
 * @type {'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'}
 */

/**
 * @typedef Quote
 * @type {object}
 * @property {number} id
 * @property {string} display_label
 * @property {string} quote
 * @property {string} author
 */

export default {
  name: 'AgendaQuoteBlock',
  components: {
    AgendaBlock,
  },
  data() {
    return {
      /** @type {Quote | null} */
      quote: null,
    }
  },
  created() {
    store.dispatch(types.NINETOFIVER_API_REQUEST, {
      path: '/quotes/',
    }).then(res => {
      this.$set(this, 'quote', sample(res.data));
    })
  },
  computed: {
    quoteText() {
      if (!this.quote) return '';

      return this.quote.quote;
    },
    author() {
      if (!this.quote) return '';

      return `– ${this.quote.author}`;
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.agenda-block-body {
  margin-left: 16px;
  border-left: 2px solid $secondary;
  padding-left: 6px;

  & > p {
    margin: 0;

    color: $gray-900;

    &:first-child {
      font-style: italic;
      font-size: 0.875rem;
    }

    &:last-child {
      font-size: 0.75rem;
      align-self: flex-end;
    }
  }
}
</style>
