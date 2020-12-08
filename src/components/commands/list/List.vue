<template>
  <div id="commands-list-container" class="mt-4">
    <h3 v-if="type" class="m-2"><strong>{{type}}</strong> jobs list</h3>
    <table class="table">
      <thead class="thead-light">
        <tr>
          <th v-for="(column, index) in columns"
            :key='index'
          >{{column}}</th>
        </tr>
      </thead>
      <tbody>
      <commands-list-item
          v-for="(command, index) in commands"
          :key='index'
          :command="command"
          :columns="columns"
      ></commands-list-item>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
//@ts-ignore
import CommandsListItem from "./Item"
import {mapState} from "vuex";

const CommandsList = defineComponent({
  name: "CommandsList",
  components: {CommandsListItem},
  props: {
    type: {
      type: String,
      required: true
    },
    socket: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      //@ts-ignore
      commands: state => state.listItems,
    })
  },
  data: () => {
    return {
      columns: [],
      columnsTypes: {
         history: ['reruninfo', 'finished', 'duration', 'host', 'job', 'output', 'status'],
         immediate: ['infoonly', 'added', 'host', 'job', 'status'],
         planned: ['infoonly', 'schedule', 'host', 'job'],
      }
    }
  },
  watch: {
    type: {
      handler (queueType) {
        //@ts-ignore
        this.$store.commit('resetListItems')

        switch (queueType){
          case 'history':
            //@ts-ignore
            this.columns = ['reruninfo', 'finished', 'duration', 'host', 'job', 'output', 'status']
            break;
          case 'immediate':
            //@ts-ignore
            this.columns = ['infoonly', 'added', 'host', 'job', 'status']
            break;
          case 'planned':
            //@ts-ignore
            this.columns = ['infoonly', 'schedule', 'host', 'job']
            break;
        }

        //@ts-ignore
        this.socket.emit('requestQueueData', {queue: queueType, filter: {}});
      }
    }
  }
});

export default CommandsList

</script>

<style scoped>

</style>