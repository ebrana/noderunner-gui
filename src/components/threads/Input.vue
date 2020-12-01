<template>
  <input type="text" class="form-control">
</template>

<script lang="ts">

import {ref} from "vue"

export default {
  name: "Input",
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