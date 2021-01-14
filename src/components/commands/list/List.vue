<template>
  <div id="commands-list-container" class="mt-4">
    <h3 v-if="type" class="m-2"><strong>{{ type }}</strong> jobs list <a class="btn btn-default btn-xs" @click="refresh"><i class="fa fa-refresh"></i></a></h3>
    <form ref="search">
      <table class="table">
        <thead class="thead-light">
        <tr>
          <th v-for="(column, index) in columns"
              :key='index' v-bind:class="column === 'job' ? 'job' : ''">{{ column }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th v-for="(column, index) in columns"
              :key='index'
          >
              <span v-if="column === 'status'">
                <select class="form-control" v-on:change="filter" name="status">
                  <option>-</option>
                  <option>planned</option>
                  <option>running</option>
                  <option>fetched</option>
                  <option>success</option>
                  <option>error</option>
                  <option>stucked</option>
                </select>
              </span>
            <span v-else-if="column !== 'info' && column !== 'infoonly' && column !== 'rerun' && column !== 'duration' && column !== 'finished'">
                <input type="text" v-bind:name="column" class="form-control" v-on:keyup.enter="filter">
              </span>
          </th>
        </tr>
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
    </form>
  </div>
  <Info ref="infoDetail" :show-on-mounted="false" />
  <Popup ref="rerunPopup" id="rerunCommandPopup" :confirm="true" title="Do you want to rerun this command?" submitButtonClass="btn-success" @submit="rerunSuccess">
    <template v-slot:content="{ persistent }">
      <div>{{ persistent.command.job }}</div>
    </template>
  </Popup>
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
        immediate: ['info', 'added', 'host', 'job', 'status'],
        planned: ['info', 'schedule', 'host', 'job'],
      }
    }
  },
  watch: {
    type: {
      handler(queueType) {
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
    },
    rerunSuccess: function (record: any, persistent: any) {
      //@ts-ignore
      this.socket.emit('rerun', {id: persistent.command._id, queue: persistent.command.queue});
    },
    filter: function (event: Event) {
      //@ts-ignore
      const key = event?.target?.name;
      //@ts-ignore
      const search = {};
      //@ts-ignore
      if ((key !== '' && key !== 'status') || (key === 'status' && event?.target?.value !== '-')) {
        //@ts-ignore
        search[key] = event?.target?.value
      }
      //@ts-ignore
      this.socket.emit('requestQueueData', {queue: this.type, filter: search});
    },
    resetFilter: function () {
      //@ts-ignore
      this.$refs.search.reset()
    },
    refresh: function () {
      this.resetFilter()
      //@ts-ignore
      this.socket.emit('requestQueueData', {queue: this.type, filter: {}});
    }
  }
});

export default CommandsList

</script>

<style scoped>
.btn-xs {
  padding: 0 !important;
  margin-left: 5px;
}
</style>