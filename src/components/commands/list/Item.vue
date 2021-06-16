<template>
  <tr>
    <td v-for="(column, index) in columns" :key='index' class="align-middle">
      <div v-if="column === 'status'" class="alert text-center" v-bind:class="[command[column] === 'success' ? 'alert-success' : command[column] === 'error' ? 'alert-danger' : 'alert-warning']">{{command[column]}}</div>
        <Button v-else-if="column === 'info'" icon="fa-question" styleClass="btn-info" @button-click="showInfo(command)"></Button>
        <Button v-else-if="column === 'rerun'" icon="fa-play-circle" styleClass="btn-info" @button-click="rerunCommand(command)"></Button>
      <div v-else>
        <span v-if="column === 'finished' || column === 'added'" class="finished">
          {{ humanDateWithoutYear(command[column]) }}
        </span>
        <span v-else-if="column === 'actions'">
          <Button @button-click="editclick(command)" icon="fa-pencil" styleClass="btn-info" v-if="isLoggedIn === true" />
    &nbsp;
          <Button @button-click="delclick(command['_id'], command['job'], command['host'])" icon="fa-trash" styleClass="btn-danger" v-if="isLoggedIn === true" />
        </span>
        <span v-else-if="column === 'duration'">
          {{ duration(command['finished'], command['started']) }}
        </span>
        <span v-else-if="column === 'tags'">
          {{ command['tags'] && Array.isArray(command['tags']) ? command['tags'].join(', ') : '' }}
        </span>
        <span v-else v-bind:class="column === 'job' || column === 'output' ? 'joblist' : ''" v-bind:title="command[column]">
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
import { computed } from 'vue'
import { useStore } from 'vuex'

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
  emits: ['show-command-info', 'rerun-command', 'editclick', 'delclick'],

  setup(props: Object, context: Object) {
    const store = useStore()

    function showInfo(command: Object){
      //@ts-ignore
      context.emit('show-command-info', command);
    }

    function rerunCommand(command: Object){
      //@ts-ignore
      context.emit('rerun-command', command);
    }

    function editclick(command: Object) {
      //@ts-ignore
      context.emit('editclick', command);
    }

    function delclick(id: String, job: String, host: String) {
      //@ts-ignore
      context.emit('delclick', id, job, host);
    }

    return {
      showInfo,
      rerunCommand,
      isLoggedIn: computed(() => store.getters.isLoggedIn),
      editclick,
      delclick
    }
  }
}

</script>

<style scoped>
.joblist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 600px;
  display: block;
}
.finished {
  min-width: 130px;
  display: block;
}
</style>