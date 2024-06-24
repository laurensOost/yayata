<template lang="pug">
  div(
    class="d-flex flex-row align-items-center gx-2 avatar-container"
    :title="tooltip"
    role='button'
    v-b-tooltip.hover.bottom="{ variant: avatarColor[0] }"
    @click="navigateToUser"
  )
    div(class="avatar" :class="`text-${avatarColor[0]}`")
      img(
        :src='getAvatarUrl(user)'
        :alt="user.display_label"
        width="32"
        height="32"
        class="rounded-circle avatar-image"
        :class="`border-${avatarColor[0]}`"
      )
      div(
        class="avatar-icon"
      )
        slot(name="icon")

    div(class="d-flex flex-column avatar-info")
      p(class="m-0") {{ user.display_label }}
      slot(name="info")
</template>

<script>
import utils from "../../../utils";

export default {
  name: 'AgendaAvatar',
  props: ['user', 'color', 'tooltip'],
  computed: {
    avatarColor() {
      const parts = this.$props.color?.split('-') ?? ['primary'];

      return [`${parts[0]}`, `${parts[0]}-soft`];
    },
  },
  methods: {
    getAvatarUrl: utils.getAvatarUrl,
    navigateToUser() {
      this.$router.push({
        name: 'colleague',
        params: {
          userId: this.user.id,
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/theme";

.avatar-container {
  & > .avatar {
    position: relative;

    & > .avatar-image {
      position: relative;
      border: 2px solid currentColor;
      user-select: none;
      pointer-events: none;
      z-index: 2
    }

    & > .avatar-icon:has(svg) {
      $size: 1rem;

      width: $size;
      height: $size;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: calc($size / -5);
      right: calc($size / -5);
      border-radius: 50%;
      background: currentColor;
      padding: 0.25rem;
      user-select: none;
      pointer-events: none;
      z-index: 3;

      & > svg {
        font-size: calc($size / 2);
        color: $gray-900;
      }
    }
  }

  & > .avatar-info {
    position: relative;
    z-index: 2;

    & > p:first-child {
      font-size: 0.875rem;
      color: $gray-900;
      line-height: 1.1;
    }

    & > p:nth-child(2) {
      font-size: 0.75rem;
      color: $gray-600;
    }
  }
}
</style>
