<template lang="pug">
div(v-if='user' class='d-flex user')
  router-link(
    :to='{ name: "colleague", params: { userId: user.id }}'
    class='avatar-container'
    :title='user.display_label'
    v-b-tooltip.left="{boundary: 'window'}"
    /*:style="userColor(user.display_label)"*/
  )
    span(class='avatar-label') {{ user.display_label }}
    img(
      class='img-fluid d-block mx-auto'
      v-bind:style='{"max-height": avatarSize + "px"}'
      :src='getAvatarUrl(user)'
    )
</template>

<script>
import utils from '../../utils';

export default {
  name: 'ColleagueAvatarWidget',

  props: [
    'user',
    'size',
  ],

  computed: {
    avatarSize: function () {
      return this.size ? this.size : 250
    }
  },

  methods: {
    getAvatarUrl: utils.getAvatarUrl,

    userColor: function(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let h = hash % 360;
      return 'background: repeating-linear-gradient(45deg, hsl('+h+', 30%, 90%), hsl('+h+', 30%, 90%) 5px, hsl('+h+', 30%, 80%) 5px, hsl('+h+', 30%, 80%) 10px);';
    }
  }
}
</script>

<style scoped lang="less">
.user {
  min-width: 100px;
}
.avatar-container {
  display: block;
  width: 100%;
  border: 1px solid #dee2e6;
  border-radius: .2rem;
  position: relative;
  background-color: #dddddd;
}

.avatar-label {
  padding-bottom: .2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #000;
  font-size: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background-color: rgba(255,255,255,.5);
}
</style>