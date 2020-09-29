<template>
  <li :class=buttonClass>
    <a class="nav-link" :href=url @click="changeSerer">{{ name }}</a>
  </li>
</template>

<script lang="ts">
import {defineComponent} from "vue";

const Button = defineComponent({
  props: {
    name: {
      type: String
    },
    url: {
      type: String
    },
    basePath: {
      type: String
    }
  },
  computed: {
    buttonClass () {
      //@ts-ignore
      if (this.$store.state.server === this.url) {
        return 'nav-item active'
      } else {
        return 'nav-item'
      }
      // console.log($store)
    }
  },
  methods: {
    'changeSerer': function (event: Event) {
      event.preventDefault()
      window.location.href = this.basePath + '?server=' + this.url
    }
  }
})

export default Button
</script>

<style>
</style>