<template>
  <tr>
    <td v-for="(column, index) in columns" :key='index' class="align-middle">
      <div v-if="column === 'status'" class="alert text-center" v-bind:class="[command[column] !== 'success' ? 'alert-danger' : 'alert-success']">{{command[column]}}</div>
      <Button v-else-if="column === 'info'" icon="fa-question" styleClass="btn-info" @button-click="showInfo(command)"></Button>
      <Button v-else-if="column === 'rerun'" icon="fa-play-circle" styleClass="btn-info" @button-click="rerunCommand(command)"></Button>
      <div v-else>
        <span v-if="column === 'finished' || column === 'added'" class="finished">
          {{ humanDateWithoutYear(command[column]) }}
        </span>
        <span v-else-if="column === 'duration'">
          {{ duration(command['finished'], command['started']) }}
        </span>
        <span v-else v-bind:class="column === 'job' || column === 'output' ? 'job' : ''" v-bind:title="command[column]">
          {{ command[column] }}
        </span>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
//@ts-ignore
import Button from "./../../Button";
import { formatter } from '../../mixins/formatter'

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
  mixins: [formatter],
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
.job {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 670px;
  display: block;
}
.finished {
  min-width: 130px;
  display: block;
}
</style>