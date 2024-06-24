<script setup>
import {faGift} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='col')
    AgendaBlock(
      color="success-soft"
      :icon="faGift"
      title="Month birthdays"
      :style="{flexGrow: 1}"
    )
      div(class="d-flex align-items-start flex-row flex-xl-column flex-wrap flex-xl-nowrap g-3 gy-xl-1 agenda-block-body")
        div(
          v-for="user in birthdayUsers"
          :key="user.id"
          class="d-flex align-items-center"
          :title="getTitleUserString(user)"
        )
          AgendaAvatar(:user="user" color="success")
            template(slot="info")
              p(class="text-muted m-0")
                | {{ getUserRelativeBirthdayString(user) }}
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";
import AgendaAvatar from "./AgendaAvatar.vue";
import store from "../../../store";
import moment from "moment";

export default {
  name: 'AgendaBirthdayBlock',
  components: {
    AgendaBlock,
    AgendaAvatar,
    faGift
  },
  methods: {
    getUserRelativeBirthdayString(user) {
      const birthday = moment(user.userinfo.birth_date, 'YYYY-MM-DD')
      const nextAge = moment().diff(birthday, 'years') + 1
      const thisYearBirthday = moment(birthday).year(moment().year())

      if (thisYearBirthday.diff(moment(), 'days') === 0) {
        return `Turns ${nextAge} today! 🎉`
      } else if (thisYearBirthday.diff(moment(), 'days') === 1) {
        return `Turns ${nextAge} tomorrow! 🎉`
      } else if (thisYearBirthday.diff(moment(), 'days') > 1) {
        return `Turns ${nextAge} in ${thisYearBirthday.diff(moment(), 'days')} days`
      } else {
        return `Is ${nextAge} years old`
      }
    },
    getTitleUserString(user) {
      const name = user.display_label
      const birthday = moment(user.userinfo.birth_date, 'YYYY-MM-DD')
      const nextAge = moment().diff(birthday, 'years') + 1
      const thisYearBirthday = moment(birthday).year(moment().year())
      const daysDiff = thisYearBirthday.diff(moment(), 'days')

      if (daysDiff === 0) {
        return `${name} birthday is today! 🎉`
      } else if (daysDiff === 1) {
        return `${name} birthday is tomorrow! 🎉`
      } else if (daysDiff > 1) {
        return `${name} ${nextAge} birthday is in ${daysDiff} days`
      } else {
        return `${name} ${nextAge} birthday was ${-daysDiff} days ago`
      }

    }
  },
  computed: {
    birthdayUsers: function () {
      if (store.getters.users) {
        return store.getters.users
            .filter(user => {
              if (!user.userinfo?.birth_date) return false

              const birthday = moment(user.userinfo.birth_date, 'YYYY-MM-DD')

              return birthday.month() === moment().month()
            })
            .sort((a, b) => {
              const aBirthday = moment(a.userinfo.birth_date, 'YYYY-MM-DD')
              const bBirthday = moment(b.userinfo.birth_date, 'YYYY-MM-DD')

              return aBirthday.date() - bBirthday.date()
            })
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.agenda-block-body {
  margin-left: 22px;
}
</style>
