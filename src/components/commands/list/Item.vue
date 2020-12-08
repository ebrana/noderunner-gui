<template>
  <tr>
    <td v-for="(column, index) in columns" :key='index'>
      <div v-if="column === 'status'" class="alert text-center" v-bind:class="[command[column] !== 'success' ? 'alert-danger' : 'alert-success']">{{command[column]}}</div>
      <div v-else>{{ command[column] }}</div>
    </td>
  </tr>
</template>

<script lang="ts">
import {defineComponent} from "vue";

const CommandsListItem = defineComponent({
  name: "CommandsListItem",
  props: {
    command: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  }
});

export default CommandsListItem
</script>

<style scoped>

</style>