<template lang="pug">
div
  div(v-if='changelogContent')
    b-card
      vue-markdown(class='rendered-markdown' :source='changelogContent')
</template>

<script>
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import changelogFile from '../../CHANGELOG.md'

export default {
  name: 'changelog',

  components: {
    VueMarkdown,
  },

  data: function() {
    return {
      changelogContent: null
    }
  },

  computed: {
  },

  created: function() {
    Vue.http({
      method: 'GET',
      url: "/"+changelogFile,
      headers: {
        Accept: 'application/vnd.github.v3.full+json',
      },
    }).then((res) => {
      this.changelogContent = res.data
    })
  }
}
</script>

<style lang='less'>
</style>
