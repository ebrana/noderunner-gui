<template>
  <div id="commands-list-container" class="mt-4">
    <h3 v-if="type" class="m-2"><strong>{{ type }}</strong> jobs list <Button @button-click="addCommand" v-if="jwt && isLoggedIn === true && type !== 'history'" /> <a class="btn btn-default btn-xs" @click="refresh"><i class="fa fa-refresh"></i></a></h3>
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
                <select class="form-control" v-on:change="filter" name="status" v-model="search[column]">
                  <option>-</option>
                  <option>planned</option>
                  <option>running</option>
                  <option>fetched</option>
                  <option>success</option>
                  <option>error</option>
                  <option>stucked</option>
                </select>
              </span>
            <span v-else-if="column !== 'info' && column !== 'infoonly' && column !== 'rerun' && column !== 'duration' && column !== 'finished' && column !== 'actions'">
                <input type="text" v-bind:name="column" class="form-control" v-on:keyup.enter="filter" v-model="search[column]">
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
            @delclick="delclick"
            @editclick="editclick"
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
  <Popup ref="commandFormPopup" id="commandFormPopup" @submit="commandSubmit" submitButtonText="Save" title="Command definition" :schema="commandSchema">
    <template v-slot:content="{ persistent }">
      <CommandForm :persistent="persistent" ref="form" :default="persistent.command" />
    </template>
  </Popup>
  <Popup ref="commandPopupEdit" id="commandPopupEdit" @submit="updateCommand" submitButtonText="Save" title="Update command" :schema="commandSchema">
    <template v-slot:content="{ persistent }">
      <CommandForm :persistent="{id: persistent._id, type: persistent.type}" ref="form" :default="persistent.command" />
    </template>
  </Popup>
  <Popup ref="commandPopupDelete" id="commandPopupDelete" @submit="removeCommand" confirm="true" title="Confirm dialog" submitButtonClass="btn-danger">
    <template v-slot:content="{ persistent }">
      <span>Are you sure you want to delete a command:<br>"<strong>{{ persistent.job }} [{{ persistent.host}}]</strong>" ?</span>
    </template>
  </Popup>
  <Alert v-if="error" @alerthide="alertHide">
    <template v-slot:content>
      <span>{{ error }}</span>
    </template>
  </Alert>
</template>

<script lang="ts">
import {defineComponent} from "vue"
//@ts-ignore
import CommandsListItem from "./Item"
//@ts-ignore
import Popup from "./../../Popup";
import Info from "@/components/threads/Info.vue";
import {mapGetters, mapState} from "vuex";
import Alert from "@/components/Alert.vue";
import Button from "@/components/Button.vue";
import CommandForm from "@/components/commands/form/CommandForm.vue";
import config from "../../../../config/config";

const CommandsList = defineComponent({
  name: "CommandsList",
  components: {CommandForm, Button, CommandsListItem, Popup, Info, Alert},
  props: {
    type: {
      type: String,
      required: true
    },
    socket: {
      type: Object
    },
  },
  computed: {
    ...mapState({
      //@ts-ignore
      commands: state => state.listItems,
    }),
    ...mapGetters([
      'isLoggedIn', 'getToken'
    ]),
  },
  data: () => {
    return {
      error: String(''),
      columns: [],
      columnsTypes: {
        history: ['info', 'rerun', 'finished', 'duration', 'host', 'job', 'output', 'status'],
        immediate: ['info', 'added', 'host', 'job', 'status', 'tags'],
        planned: ['info', 'schedule', 'host', 'job', 'tags', 'actions'],
      },
      'commandSchema': {
        'command': null,
        'host': null,
        'schedule': null,
        'tags': []
      },
      search: {
        'duration': null,
        'host': null,
        'job': null,
        'output': null,
        'status': null,
        'tags': null
      }
    }
  },
  watch: {
    socket() {
      //@ts-ignore
      this.socket.on('commandError', (message: any) => {
        this.error = message ? message : 'unknown error'
      })
    },
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
    alertHide: function () {
      this.error = '';
    },
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
    filter: function () {
      //@ts-ignore
      this.socket.emit('requestQueueData', {queue: this.type, filter: this.search});
    },
    resetFilter: function () {
      //@ts-ignore
      Object.keys(this.search).map((value => this.search[value] = null ))
    },
    refresh: function () {
      this.resetFilter()
      //@ts-ignore
      this.socket.emit('requestQueueData', {queue: this.type, filter: {}});
    },
    jwt() {
      return config.jwt.enable
    },
    addCommand: function () {
      //@ts-ignore
      this.$refs.commandFormPopup.open({'type': this.type, 'command': {} })
    },
    commandSubmit: function (record: any, persistent: any) {
      //@ts-ignore
      this.socket.emit('addCommand', {command: record, item: persistent, token: this.getToken, filter: this.search});
    },
    delclick: function (id: String, job: String, host: String) {
      //@ts-ignore
      this.$refs.commandPopupDelete.open({'id':id, 'job': job, 'host': host})
    },
    editclick: function (command: Object) {
      //@ts-ignore
      this.$refs.commandPopupEdit.open({'type': this.type, 'command': command})
    },
    removeCommand: function (record: any, persistent: any) {
      //@ts-ignore
      this.socket.emit('delCommand', {id: persistent.id, token: this.getToken, filter: this.search});
    },
    updateCommand: function (record: any, persistent: any) {
      //@ts-ignore
      this.socket.emit('updateCommand', {id: persistent.command._id, command: record, token: this.getToken, filter: this.search});
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