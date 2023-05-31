<template lang="pug">
div
  div(class='row justify-content-between align-items-center')
    div(class='col-lg-auto text-center')
      div(class='btn-group' role='group')
        button(class='btn btn-sm btn-outline-dark' type='button' v-on:click.prevent='selectPreviousPeriod()')
          i(class='fa fa-angle-double-left')
          | &nbsp;Previous
        button(class='btn btn-sm btn-outline-dark disabled' type='button')
          | {{ days[0] | moment('YYYY-MM-DD') }} - {{ days[days.length - 1] | moment('YYYY-MM-DD') }}
        button(class='btn btn-sm btn-outline-dark' type='button' v-on:click.prevent='selectNextPeriod()')
          | Next&nbsp;
          i(class='fa fa-angle-double-right')
      div(class='input-group input-group-sm mr-2')
        b-form-input(:type='"text"' :placeholder='"Filter (eg. " + user.username + ")"' v-model="filterQuery" v-b-tooltip.top title="Tip: You can use ; to split search, like: tom;jan")

    div(class='col-lg-auto text-center')
      hr(class='d-lg-none')

      toggle-button(
        class='my-0'
        @change='showSickness = !showSickness',
        :value='showSickness',
        color='#ff4444',
        :sync='true',
        :labels={
          checked: 'Sickness',
          unchecked: 'Sickness'
        },
        :width='80'
      )
      toggle-button(
        class='my-0'
        @change='showLeave = !showLeave',
        :value='showLeave',
        color='#00c851',
        :sync='true',
        :labels={
          checked: 'Leave',
          unchecked: 'Leave'
        },
        :width='65'
      )
      toggle-button(
        class='my-0'
        @change='showHoliday = !showHoliday',
        :value='showHoliday',
        color='#59b8e6',
        :sync='true',
        :labels={
          checked: 'Holiday',
          unchecked: 'Holiday'
        },
        :width='70'
      )
      toggle-button(
        class='my-0'
        @change='showWhereabout = !showWhereabout',
        :value='showWhereabout',
        color='#FBB829',
        :sync='true',
        :labels={
          checked: 'Whereabout',
          unchecked: 'Whereabout'
        },
        :width='90'
      )
      toggle-button(
        class='my-0'
        @change='showNoWork = !showNoWork',
        :value='showNoWork',
        color='#9e9d9d',
        :sync='true',
        :labels={
          checked: 'Not working',
          unchecked: 'Not working'
        },
        :width='90'
      )

    div(class='col-lg-auto')
      hr(class='d-lg-none')

      div(class='btn-toolbar justify-content-center')
        div(class='btn-group btn-group-sm' role='group')
          b-dropdown(variant='outline-dark' size='sm' right :text='filterCountry ? filterCountry : "Country"')
            b-dropdown-item(@click='filterByCountry()') All
            b-dropdown-item(v-for='country in countries' @click='filterByCountry(country)') {{ country }}

  hr

  div(class='table-responsive')
    table(class='table table-bordered table-sm' v-if='days')
      thead
        tr
          th(class='text-center') User
          template(v-for='day in days')
            th(class='text-center' :class="determineMonthColor(day)")
              div(class="month") {{ day | moment('MMM') }}
              div(class="day") {{ day | moment('DD') }}
              div(class="day_of_week") {{ day | moment('ddd') }}
      tbody
        tr(v-for='user in users')
          td(class='cell')
            div(class='row justify-content-center')
              ColleagueAvatarWidget(class='col' :user='user' size='40')
          td(v-for='day in days' :class='determineCellColor(day, user)' class='cell p-0')
            div(v-if='availability && availability[user.id] && availability[user.id][day]')
              div(v-if='showHoliday' v-for='holiday in availability[user.id][day].holidays')
                div(class='cell-holiday badge' :title="holiday.name" v-b-tooltip.right="{boundary: 'window'}") 🌐

              div(v-if='showLeave' v-for='leave_date in availability[user.id][day].leave')
                div(class='cell-leave badge' :title='displayDateStartEnd(leave_date)' v-b-tooltip.right="{boundary: 'window'}") 🏖️

              div(v-if='showSickness' v-for='leave_date in availability[user.id][day].sickness')
                div(class='cell-sickness badge' :title='displayDateStartEnd(leave_date)' v-b-tooltip.right="{boundary: 'window'}") 😷

              div(v-if='showWhereabout' v-for='whereabout in availability[user.id][day].whereabouts')
                div(class='cell-whereabout badge' :title='displayDateStartEnd(whereabout, whereabout.location.display_label)' v-b-tooltip.right="{boundary: 'window'}") 📍
</template>

<script>
import Vue from 'vue';
import store from '../store';
import * as types from '../store/mutation-types';
import utils from '../utils';
import moment from 'moment';
import ColleagueAvatarWidget from './widgets/ColleagueAvatarWidget.vue';

export default {
  name: 'Availability',

  components: {
    ColleagueAvatarWidget,
  },

  watch: {
    '$route': function(to, from) {
      this.setDate()
      this.reloadAvailability()
    },
  },

  data() {
    return {
      filterQuery: null,
      filterCountry: null,
      showHoliday: true,
      showLeave: true,
      showNoWork: true,
      showSickness: true,
      showWhereabout: true,
      countries: [],
      today: moment(),
      date: null,
      daysShown: 30,
      availability: null
    }
  },

  created: function() {
    this.setDate()
    this.reloadAvailability()

    new Promise((resolve, reject) => {
      if (!store.getters.users) {
        store.dispatch(types.NINETOFIVER_RELOAD_USERS).then(() => resolve())
      } else{
        resolve()
      }
    }).then(() => {
      store.getters.users.forEach(user => {
        if (user.userinfo && user.userinfo.country && (this.countries.indexOf(user.userinfo.country) === -1)) {
          this.countries.push(user.userinfo.country)
        }
      })

      this.countries.sort()
    })
  },

  computed: {
    user: () => store.getters.user,

    users: function() {
      if (store.getters.users) {
        let users = store.getters.users.slice(0)

        if (this.filterCountry) {
          users = users.filter(user => {
            return user.userinfo && user.userinfo.country === this.filterCountry
          })
        }

        if (this.filterQuery) {
          let query = this.filterQuery.toLowerCase().split(';').map(s => s.trim()).filter(s => s.length !== 0);

          users = users.filter(user => {
            for (let queryPart of query){
              if ((user.username.toLowerCase().indexOf(queryPart) > -1)
                || (user.display_label.toLowerCase().indexOf(queryPart) > -1)
                || (user.email.toLowerCase().indexOf(queryPart) > -1))
                return true
              }
            }
          )
        }

        return users
      }
    },

    days: function() {
      if (this.date) {
        return [...Array(this.daysShown).keys()].map(i => {
          return moment(this.date).add(i, 'days').format('YYYY-MM-DD')
        })
      }
    }
  },

  methods: {
    selectNextPeriod: function() {
      let new_date = moment(this.date).add(this.daysShown, 'days');

      this.$router.push({
        name: 'availability_week',
        params: {
          month: new_date.format('MM'),
          year: new_date.format('YYYY'),
          date: new_date.format('DD')
        }
      })
    },

    selectPreviousPeriod: function() {
      let new_date = moment(this.date).subtract(this.daysShown, 'days');

      this.$router.push({
        name: 'availability_week',
        params: {
          month: new_date.format('MM'),
          year: new_date.format('YYYY'),
          date: new_date.format('DD')
        }
      })
    },

    setDate: function() {
      this.date = moment({
        year: this.$route.params.year,
        month: this.$route.params.month - 1,
        date: this.$route.params.date,
      })
    },

    reloadAvailability: function() {
      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/range_availability/',
        params: {
          from: this.days[0],
          until: this.days[this.days.length - 1]
        }
      }).then(res => {
        this.availability = res.data
      })
    },

    filterByCountry: function(country) {
      this.filterCountry = country
    },

    determineCellColor: function(date, user) {
      let cls = []

      if (date == this.today.format('YYYY-MM-DD')) {
        cls.push('cell-today')
      }

      if (this.availability && this.availability[user.id] && this.availability[user.id][date]) {
        if (this.showNoWork && !this.availability[user.id][date].work_hours) {
          cls.push('cell-nowork')
        }
      }

      return cls.join(' ')
    },
    determineMonthColor: function (date) {
      let ret_class = "month_"+moment(date).format('MMM');
      if(moment(date).day() === 6 || moment(date).day() === 0)
         ret_class += " darken";
      return ret_class
    },
    displayDateStartEnd: function (date, text="") {
      if (text) {
        text = text + " | "
      }
      return text + moment(date.starts_at).format('HH:mm') + "-" + moment(date.ends_at).format('HH:mm')
    }
  },
}
</script>

<style lang='less' scoped>
@highlight: #333333;
@sickness: #ff4444;
@sicknessPending: #f58585;
@leave: #00c851;
@leavePending: #48f490;
@holiday: #59b8e6;
@nowork: #9e9d9d;
@whereabout: #FBB829;

/* Hand picked colors that has distinguishable transitions */
@january: #FFD8CE;
@february: #DEDCE6;
@march: #FFF5CE;
@april: #DDE8CB;
@may: #FFD7D7;
@june: #FFFFD7;
@july: #FFDBB6;
@august: #E0C2CD;
@september: #DEE7E5;
@october: #F7D1D5;
@november: #F6F9D4;
@december: #DEE6EF;

.badge {
  width: 100%;
  font-size: 95%;
}
.cell {
  vertical-align: middle;
  font-size: 1.1em;
}
.cell-today {
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 215, 0, 0.25),
    rgba(0, 215, 0, 0.25) 10px,
    rgba(0, 215, 0, 0.1) 10px,
    rgba(0, 215, 0, 0.1) 20px
  );
}
.cell-whereabout {
  background-color: @whereabout;
}
.cell-holiday {
  background-color: @holiday;
}
.cell-sickness {
  background-color: @sickness;
}
.cell-sickness-pending {
  background-color: @sicknessPending;
}
.cell-leave {
  background-color: @leave;
}
.cell-leave-pending {
  background-color: @leavePending;
}
.cell-nowork {
  background-color: @nowork;
}
.month {
  font-size: .7em;
  text-transform: uppercase;
  font-weight: normal;
}
.day {
  font-size: 1.5em;
}
.day_of_week {
  font-size: .7em;
  bottom: 0;
}
.darken {
  filter: brightness(85%);
}
.month_Jan {
  background-color: @january;
}
.month_Feb {
  background-color: @february;
}
.month_Mar {
  background-color: @march;
}
.month_Apr {
  background-color: @april;
}
.month_May {
  background-color: @may;
}
.month_Jun {
  background-color: @june;
}
.month_Jul {
  background-color: @july;
}
.month_Aug {
  background-color: @august;
}
.month_Sep {
  background-color: @september;
}
.month_Oct {
  background-color: @october;
}
.month_Nov {
  background-color: @november;
}
.month_Dec {
  background-color: @december;
}
</style>
