<template>
  <div id="commands-list-container" class="mt-4">
    <h3 v-if="type" class="m-2"><strong>{{ type }}</strong> jobs list</h3>
    <table class="table">
      <thead class="thead-light">
      <tr>
        <th v-for="(column, index) in columns"
            :key='index'
        >{{ column }}
        </th>
      </tr>
      </thead>
      <tbody>
      <commands-list-item
          v-for="(command, index) in commands"
          :key='index'
          :command="command"
          :columns="columns"
          @show-command-info="showCommandInfo"
          @rerun-command="rerunCommand"
      ></commands-list-item>
      </tbody>
    </table>
  </div>
  <Info ref="infoDetail" :show-on-mounted="false" />
  <popup ref="rerunPopup" id="rerunCommandPopup" :showSubmitButton="false" :confirm="true" title="Do you want to rerun this command?">
    <template v-slot:content="{ persistent }">
      <div>{{ persistent.command.job }}</div>
    </template>
  </popup>
</template>

<script lang="ts">
import {defineComponent} from "vue"
//@ts-ignore
import CommandsListItem from "./Item"
//@ts-ignore
import Popup from "./../../Popup";
import Info from "@/components/threads/Info.vue";
import {mapState} from "vuex";

const CommandsList = defineComponent({
  name: "CommandsList",
  components: {CommandsListItem, Popup, Info},
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
        history: ['info', 'rerun', 'finished', 'duration', 'host', 'job', 'output', 'status'],
        immediate: ['info', 'infoonly', 'added', 'host', 'job', 'status'],
        planned: ['info', 'infoonly', 'schedule', 'host', 'job'],
      }
    }
  },
  watch: {
    type: {
      handler(queueType) {
        //@ts-ignore
        this.$store.commit('resetListItems')

        switch (queueType) {
          case 'history':
            //@ts-ignore
            this.columns = this.columnsTypes.history
            break;
          case 'immediate':
            //@ts-ignore
            this.columns = this.columnsTypes.immediate
            break;
          case 'planned':
            //@ts-ignore
            this.columns = this.columnsTypes.planned
            break;
        }

        //@ts-ignore
        this.socket.emit('requestQueueData', {queue: queueType, filter: {}});
      }
    }
  },
  methods: {
    showCommandInfo: function (command: Object) {
      //@ts-ignore
      this.$refs.infoDetail.show(command)
    },
    rerunCommand: function (command: Object) {
      //@ts-ignore
      this.$refs.rerunPopup.open({'command': command});
    }
  }
});

export default CommandsList

</script>

<style scoped>

</style>