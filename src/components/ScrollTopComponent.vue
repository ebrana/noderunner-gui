<template>
  <a @click="scrollTop" v-show="visible" class="bottom-right">
    <slot></slot>
  </a>
</template>

<script lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

export default {
  name: "ScrollTopComponent",
  setup() {
    let visible = ref(false)
    let intervalId = 0

    function scrollTop() {
      intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(intervalId)
        }
        window.scroll(0, window.pageYOffset - 50)
      }, 20)
    }

    function scrollListener() {
      visible.value = window.scrollY > 150
    }

    onMounted(() => {
      window.addEventListener('scroll', scrollListener)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', scrollListener)
    })

    return {
      intervalId,
      visible,
      scrollTop,
      scrollListener
    }
  }
}
</script>

<style scoped>
.bottom-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
}
</style>