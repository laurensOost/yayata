<template lang="pug">
div
  div(class='row justify-content-start align-items-start')
    div(class='col-3')
      label
        | Usernames
      b-form-input(
        v-model="filterQuery",
        type='text',
        :placeholder='"Filter (eg. " + user.username + ")"'
        v-b-tooltip.top,
        title="Tip: You can use ; to split search, like: tom;jan"
      )
    div(class='col-3')
      label
        | Country
      multiselect(
        v-model="filterCountry",
        :options="countriesFilter",
        :show-labels="false",
        :searchable="false",
        :allow-empty='true',
        label='label',
        track-by='value',
        placeholder="Belgium, Czechia, ...",
      )
    div(class='col-3')
      label
        | Location
      multiselect(
        v-model="filterLocation",
        :options="locationsFilter",
        :multiple='true',
        :close-on-select="false",
        :clear-on-select="false",
        :preserve-search="true",
        label='label',
        track-by='value',
        placeholder="Home, Ghent, ..."
        :preselect-first="true"
      )

  hr

  div(class='row align-items-center mb-2')
    div(class='col-auto')
      div(class='d-flex align-items-center')
        button(class='btn btn-info btn-sm btn-square fa fa-chevron-left' v-on:click.prevent='selectPreviousPeriod()')
        p(class='m-0 mx-2')
          | {{ days[0] | moment('YYYY-MM-DD') }} - {{ days[days.length - 1] | moment('YYYY-MM-DD') }}
        button(class='btn btn-info btn-sm btn-square fa fa-chevron-right' v-on:click.prevent='selectNextPeriod()')

    div(class='col-auto')
      div(class='d-flex align-items-center gx-2')
        button(class='btn btn-sm btn-sickness' :class='{ "btn-soft": !showSickness }' @click='showSickness = !showSickness')
          | Sickness
          i(class='fa fa-check')
        button(class='btn btn-sm btn-leave' :class='{ "btn-soft": !showLeave }' @click='showLeave = !showLeave')
          | Leave
          i(class='fa fa-check')
        button(class='btn btn-sm btn-holiday' :class='{ "btn-soft": !showHoliday }' @click='showHoliday = !showHoliday')
          | Holiday
          i(class='fa fa-check')
        button(class='btn btn-sm btn-whereabout' :class='{ "btn-soft": !showWhereabout }' @click='showWhereabout = !showWhereabout')
          | Whereabout
          i(class='fa fa-check')
        button(class='btn btn-sm btn-nowork' :class='{ "btn-soft": !showNoWork }' @click='showNoWork = !showNoWork')
          | Not working
          i(class='fa fa-check')

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
                div(class='cell-holiday badge' :title="holiday.name" v-b-tooltip.right="{boundary: 'window'}")
                  | 🌐

              div(v-if='showLeave' v-for='leave_date in availability[user.id][day].leave')
                div(class='cell-leave badge' :title='displayDateStartEnd(leave_date)' v-b-tooltip.right="{boundary: 'window'}")
                  | 🏖️

              div(v-if='showSickness' v-for='leave_date in availability[user.id][day].sickness')
                div(class='cell-sickness badge' :title='displayDateStartEnd(leave_date)' v-b-tooltip.right="{boundary: 'window'}")
                  | 😷

              div(v-if='showWhereabout' v-for='whereabout in availability[user.id][day].whereabouts')
                div(class='cell-whereabout badge' v-if="isWhereaboutVisible(whereabout)" :title='displayDateStartEnd(whereabout, whereabout.location.display_label)' v-b-tooltip.right="{boundary: 'window'}")
                  | 📍
</template>

<script>
import store from '../store';
import * as types from '../store/mutation-types';
import moment from 'moment';
import ColleagueAvatarWidget from './widgets/ColleagueAvatarWidget.vue';
import {find, some} from "lodash";
import {ISOCountries} from "../utils/countries";

export default {
  name: 'Availability',

  components: {
    ColleagueAvatarWidget,
  },

  watch: {
    '$route': function () {
      this.setDate()
      this.reloadAvailability()
    },

    filterLocation: function () {
      if (some(this.filterLocation, ['value', ''])) {
        this.filterLocation = []
      }
    },
    filterCountry: function () {
      if (this.filterCountry && this.filterCountry.value === '') {
        this.filterCountry = null
      }
    }
  },

  data() {
    return {
      filterQuery: null,
      filterCountry: null,
      filterLocation: null,
      showHoliday: true,
      showLeave: true,
      showNoWork: true,
      showSickness: true,
      showWhereabout: true,
      countries: [],
      locations: [],
      today: moment(),
      date: null,
      daysShown: 30,
      availability: null
    }
  },

  created: function() {
    this.setDate()
    this.reloadAvailability()

    new Promise((resolve) => {
      if (!store.getters.locations) {
        store.dispatch(types.NINETOFIVER_RELOAD_LOCATIONS).then(() => resolve())
      } else{
        resolve()
      }
    }).then(() => {
      this.locations = store.getters.locations;
    })

    new Promise((resolve) => {
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
    countriesFilter: function() {
      console.log(this.countries);
      return [
        {label: 'All', value: ''},
        ...this.countries.map(country => {
          return {label: find(ISOCountries, ['alpha2', country]).name || country, value: country}
        })
      ]
    },

    locationsFilter: function() {
      return [
        {label: 'All', value: ''},
        ...this.locations.map(location => {
          return {label: location.display_label, value: location.id}
        })
      ]
    },

    user: () => store.getters.user,

    users: function() {
      if (store.getters.users) {
        let users = store.getters.users.slice(0)

        if (this.filterCountry) {
          users = users.filter(user => {
            return user.userinfo && user.userinfo.country === this.filterCountry.value
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

    determineCellColor: function(date, user) {
      let cls = []

      if (date === this.today.format('YYYY-MM-DD')) {
        cls.push('cell-today')
      }

      if (this.availability && this.availability[user.id] && this.availability[user.id][date]) {
        if (this.showNoWork && !this.availability[user.id][date].work_hours) {
          cls.push('cell-nowork')
        }
      }

      return cls.join(' ')
    },
    isWhereaboutVisible(whereabout) {
      if (!this.filterLocation || this.filterLocation.length === 0) {
        return true
      }

      return some(this.filterLocation, ['value', whereabout.location.id]);
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
@import "../assets/less/utils/utils";

@highlight: #333333;
@sickness: #ff4444;
@sicknessPending: #f58585;
@leave: #00c851;
@leavePending: #48f490;
@holiday: #59b8e6;
@whereabout: #FBB829;
@nowork: #9e9d9d;

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

@buttons: {
  sickness: @sickness;
  leave: @leave;
  holiday: @holiday;
  whereabout: @whereabout;
  nowork: @nowork;
};

each(@buttons, {
  .btn-@{key} {
    .button-variant(@value, @color: #fff, @hover-color: #fff, @active-color: #fff);

    i {
      transition: all 0.15s;

      margin-left: 8px;
    }

    &.btn-soft {
      .button-variant(tint(@value, 25%), @color: #fff, @hover-color: #fff, @active-color: #fff);

      i {
        transform: scale(0);
        transform-origin: center;
        font-size: 0;
        margin-left: 0;
      }
    }
  }
})

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
