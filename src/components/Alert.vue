<template>
  <teleport to="#flash">
    <div class="alert my-alert fade" v-bind:class="isShowed + ' ' + type" role="alert">
      <slot name="content"></slot>
    </div>
  </teleport>
</template>

<script lang="ts">

import {ref, onMounted, watch} from "vue";

interface iProps {
  showed: String
}

export default {
  name: "Alert",
  props: {
    showed: {
      type: String,
      default: 'hide'
    },
    type: {
      type: String,
      default: 'alert-danger'
    }
  },
  emits: ['alerthide'],
  setup(props: iProps, context: any) {
    let isShowed = ref(props.showed)

    watch(isShowed, (newValues) => {
      if (newValues === 'show') {
        setTimeout(function () {
          isShowed.value = 'hide'
          context.emit('alerthide')
        }, 2000, props)
      }
    })

    onMounted(() => {
      setTimeout(function () {
        isShowed.value = 'show'
      }, 100, props)
    })

    return {
      isShowed
    }
  }
}
</script>

<style scoped>
.my-alert {
  position: absolute;
  z-index: 1000;
  right: 10px;
}
</style>