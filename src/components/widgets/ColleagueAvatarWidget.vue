<template lang="pug">
div(v-if='user' class='d-flex user')
  router-link(
    :to='{ name: "colleague", params: { userId: user.id }}'
    class='avatar-container'
    :title='user.display_label'
    v-b-tooltip.left="{boundary: 'window'}"
  )
    span(class='avatar-label') {{ user.display_label }}
    img(
      class='img-fluid'
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
  margin: -.1rem;
}

.avatar-label {
  position: absolute;
  bottom: 0;
  left: .6rem;
  right: .6rem;
  color: #000;
  font-size: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-shadow: 5px 5px 2px #FFFFFF, 5px -5px 2px #FFFFFF, -5px -5px 2px #FFFFFF, -5px 5px 2px #FFFFFF, -5px 5px 2px #FFFFFF;
}
</style>