<template>
  <input type="text" class="form-control" v-bind:name="name">
</template>

<script lang="ts">

import {ref} from "vue"

export default {
  name: "Input",
  props: {
    name: String
  },
  setup() {
    const isMounted = ref(false)

    return {
      isMounted
    }
  },
  mounted() {
    // @ts-ignore
    this.isMounted = true
  }
}
</script>

<style scoped>

</style>