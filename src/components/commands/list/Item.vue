<template>
  <tr>
    <td v-for="(column, index) in columns" :key='index' class="align-middle">
      <div v-if="column === 'status'" class="alert text-center" v-bind:class="[command[column] !== 'success' ? 'alert-danger' : 'alert-success']">{{command[column]}}</div>
      <Button v-else-if="column === 'info'" icon="fa-question" styleClass="btn-info" @button-click="showInfo(command)"></Button>
      <Button v-else-if="column === 'rerun'" icon="fa-play-circle" styleClass="btn-info" @button-click="rerunCommand(command)"></Button>
      <div v-else>{{ command[column] }}</div>
    </td>
  </tr>
</template>

<script lang="ts">
//@ts-ignore
import Button from "./../../Button";

export default {
  name: "CommandsListItem",
  components: {
    Button
  },
  props: {
    command: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  emits: ['show-command-info', 'rerun-command'],

  setup(props: Object, context: Object) {
    function showInfo(command: Object){
      //@ts-ignore
      context.emit('show-command-info', command);
    }

    function rerunCommand(command: Object){
      //@ts-ignore
      context.emit('rerun-command', command);
    }

    return {
      showInfo,
      rerunCommand
    }
  }
}

</script>

<style scoped>

</style>