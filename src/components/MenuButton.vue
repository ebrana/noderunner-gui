<template>
  <li :class=buttonClass>
    <a class="nav-link" :href=url @click="changeSerer">{{ name }}</a>
  </li>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "vuex";

const MenuButton = defineComponent({
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
    ...mapState({
      //@ts-ignore
      server: state => state.server,
    }),
    buttonClass () {
      //@ts-ignore
      if (this.server === this.url) {
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

export default MenuButton
</script>

<style>
</style>