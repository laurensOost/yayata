<template lang="pug">
  div(class='card widget-card widget-px widget-py shadow-sm mb-3')
    div(class="card-header mb-3 p-0")
      | Agenda

    div(class='card-body d-flex flex-column agenda-body')
      div(class="d-flex flex-row w-100")
        div(class="d-flex flex-column w-50")
          AgendaQuoteBlock
          AgendaEventsBlock

        div(class="d-flex flex-column w-50")
          AgendaCalendarBlock
          AgendaBirthdayBlock

      div(class="d-flex flex-column w-100")
        AgendaAbsenceBlock

</template>

<script>
import AgendaCalendarBlock from "./AgendaCalendarBlock.vue";
import AgendaBirthdayBlock from "./AgendaBirthdayBlock.vue";
import AgendaAbsenceBlock from "./AgendaAbsenceBlock.vue";
import AgendaEventsBlock from "./AgendaEventsBlock.vue";
import AgendaQuoteBlock from "./AgendaQuoteBlock.vue";

export default {
  name: 'AgendaWidget',
  components: {
    AgendaQuoteBlock,
    AgendaEventsBlock,
    AgendaAbsenceBlock,
    AgendaBirthdayBlock,
    AgendaCalendarBlock,
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/components/widgets";

.agenda-body {
  --gap: 12px;

  row-gap: var(--gap);

  & > div {
    column-gap: var(--gap);

    & > div {
      row-gap: var(--gap);
    }
  }
}
</style>
