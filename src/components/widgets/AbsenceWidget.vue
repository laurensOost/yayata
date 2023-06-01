<template lang="pug">
div(class='card card-top-blue mb-3')
  div(class='card-header text-center d-flex justify-content-between')
    span(title='Go to previous day')
      i(class='fa fa-chevron-left chevron' @click='dayEarlier')
    | 😷🌴 Absences for {{ selectedDay | moment('ddd, MMMM Do') }}
    span(title='Go to next day')
      i(class='fa fa-chevron-right chevron' @click='dayLater')

  div(class='row justify-content-center m-0 p-1' v-if='absentUsers.length')
    div(v-for='(user, index) in absentUsers')
      i( :class="user.absenceIcon" class="dist-icon" v-b-tooltip.left :title="user.absenceType")
      i(v-if="user['absenceType'] == 'Other'" :class="user.fullDay" v-b-tooltip.left :title="user.dayTooltip" class="dist-icon-more")
      ColleagueAvatarWidget(
        v-bind:key='user.id'
        :user='user'
        size='64'
        class='col-auto p-1'
      )

  table(class='table my-0' v-if='holidays.length')
    tbody
      tr(v-for='holiday in holidays')
        td 🌐 {{ holiday.display_label }}
        td(class='text-right') {{ holiday.country }}

  div(class='card-body text-center' v-if='!holidays.length && !absentUsers.length') Everyone's present! 🙂
</template>

<script>
import moment from 'moment';
import * as types from '../../store/mutation-types';
import store from '../../store';
import ColleagueAvatarWidget from './ColleagueAvatarWidget.vue';

export default {
  name: 'AbsenceWidget',

  components: {
    ColleagueAvatarWidget
  },

  data () {
    return {
      selectedDay: null,
      absentUsers: [],
      holidays: []
    }
  },

  created: function() {
    new Promise((resolve, reject) => {
      if (!store.getters.users) {
        store.dispatch(types.NINETOFIVER_RELOAD_USERS).then(() => resolve())
      } else{
        resolve()
      }
    }).then(() => {
      this.selectedDay = moment()
    })
  },

  methods: {
    dayEarlier: function() {
      let orig = this.selectedDay
      orig.subtract(1, 'days')
      this.selectedDay = null
      this.selectedDay = orig
    },

    dayLater: function() {
      let orig = this.selectedDay
      orig.add(1, 'days')
      this.selectedDay = null
      this.selectedDay = orig
    },
  },

  watch: {
    selectedDay: function() {
      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/range_availability/',
        params: {
          from: this.selectedDay.format('YYYY-MM-DD'),
          until: this.selectedDay.format('YYYY-MM-DD')
        }
      }).then((res) => {
        this.absentUsers = []
        console.log(this.userHours)
        for (let i = 0; i < store.getters.users.length; i++) {
          const user = store.getters.users[i];
          const leave = res.data[user.id][this.selectedDay.format('YYYY-MM-DD')]
          if(leave['sickness'].length > 0){
            // is sick
            user["absenceIcon"] = "fa fa-plus-square plus-square"
            user["absenceType"] = "Sickness"
            this.absentUsers.push(user)
          }
          else if(leave['leave'].length > 0){
            // other leave type
            user["absenceIcon"] = "fa fa-calendar calendar"
            user["absenceType"] = "Other"

            //! prototype #46517
            const leaveStart = moment(leave["leave"][0]["starts_at"]) // todo: not just 0
            const leaveEnd = moment(leave["leave"][0]["ends_at"])
            console.log(leaveEnd.diff(leaveStart,"hours"))
            user["fullDay"] = leaveEnd.diff(leaveStart,"hours") > leave["work_hours"] / 2 ? "fa fa-hourglass hourglass" : "fa fa-hourglass-end hourglass-end"
            user["dayTooltip"] = leaveEnd.diff(leaveStart,"hours") > leave["work_hours"] / 2 ? "Full-day" : "Half-day"
            
            this.absentUsers.push(user)
          }
        }
      });

      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/holidays/',
        params: {
          date: this.selectedDay.format('YYYY-MM-DD')
        }
      }).then((res) => {
        this.holidays = res.data.results
      })
    }
  }
}

</script>

<style lang="less" scoped>
.chevron {
  color: #0aa6c9;

  &:hover {
    cursor: pointer;
  }
}

.dist-icon{
  position: relative;
  top: 20px;
  z-index: 1;
  background-color: #fff;
  padding: 4px;
  border-radius: 8px;
  margin-top: -20px;
}

.dist-icon-more{
  position: relative;
  top: 45px;
  left:-22px;
  z-index: 1;
  background-color: #fff;
  padding: 4px;
  border-radius: 8px;
  margin-top: -20px;
}
</style>
