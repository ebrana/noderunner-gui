<template>
  <teleport to="#flash">
    <div class="alert alert-danger fade" v-bind:class="isShowed" role="alert">
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
.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  position: absolute;
  z-index: 1000;
  right: 10px;
}
</style>