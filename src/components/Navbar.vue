<template lang="pug">
div(class='navbar navbar-light navbar-expand')
  div(class='d-md-flex d-none flex-column')
    h1(class='title') {{ title }}
    p(class='subtitle') {{ date }}
  form(class='form-inline d-md-none')
    b-btn(v-b-modal="'modalio'" class='btn-outline-dark')
      i(class='fa fa-bars')
    b-modal(
      id='modalio'
      ref='modalio'
      hide-header=true
      hide-footer=true
      ok-disabled=true
    )
      div(class='list-group list-group-flush text-center' @click='hideModal()')
        template(v-for='navbarItem in navbarItems')
          router-link(v-if='!navbarItem.divider' :to='navbarItem.route' class='list-group-item list-group-item-action')
            h2 {{ navbarItem.label }}

  div(class='flex-grow-1')

  div(class='d-flex gx-2 align-items-center')
    img(class='profile-img rounded' :src='getAvatarUrl(user)')
    div(class='navbar-collapse collapse' id='navbarSupportedContent')
      ul(class='navbar-nav ml-auto')
        b-nav-item-dropdown(v-if='user' :text='user.display_label' right)
          b-dropdown-item(:to='{ name: "colleague", params: { userId: user.id } }') Profile
          b-dropdown-item(:to='{ name: "auth.logout" }') Logout
</template>

<script>
import store from '../store'
import moment from 'moment';
import utils from "../utils";

export default {
  name: 'navbar',

  computed: {
    user: function() {
      if (store.getters.user) {
        return store.getters.user
      }
    },

    navbarItems: function() {
        if (store.getters.navbar_items) {
          return store.getters.navbar_items
        }
    },

    title() {
      return this.$route.meta?.title || 'Yayata';
    },

    date() {
      return moment().format('Do MMM YYYY');
    }
  },
  methods: {
    hideModal() {
      this.$refs.modalio.hide()
    },
    getAvatarUrl: utils.getAvatarUrl,
  },

  data () {
    return {
      clicked: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/styles";

.profile-img {
  width: 28px;
  height: 28px;
}

.title {
  @extend .navbar-brand;

  margin: 0 0 4px;
  padding: 0;
  color: $gray-900;
  font-size: 1.125rem;
  line-height: 1.1;
}

.subtitle {
  @extend .navbar-text;

  margin: 0;
  padding: 0;
  color: $gray-500;
  font-size: 0.75rem;
  line-height: 1.1;
}
</style>
