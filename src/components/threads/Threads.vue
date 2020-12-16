<template>
  <table border="0" width="30%" class="table table-responsive-lg threads">
    <thead class="thead-light text-center">
    <th colspan="6"><i class="fa fa-refresh"></i> running</th>
    </thead>
    <tbody>
    <tr>
      <th class="index text-center align-middle">thrd <AddButton :socket="socket" /></th>
      <th class="align-middle">host</th>
      <th class="job align-middle">job</th>
      <th class="align-middle">status</th>
      <th class="running align-middle">running</th>
      <th class="align-middle">actions</th>
    </tr>
    <tr v-for="(item) in list" v-bind:key="item">
      <Process :colors="colors" :item="item" @dbclick="click" @info="info" @ebclick="edit" />
    </tr>
    </tbody>
  </table>
  <Popup ref="editpopup" id="threadPopup" @submit="submit" submitButtonText="Save" title="Thread setting">
    <template v-slot:content="{ persistent }">
      <Form :persistent="persistent.id" ref="form" :default="getSettings(persistent.id)" />
    </template>
  </Popup>
  <Popup ref="popup" id="threadPopupDelete" @submit="removeThreade" confirm="true" title="Confirm dialog" submitButtonClass="btn-danger">
    <template v-slot:content="{ persistent }">
      <span>Are you sure you want to delete a thread #{{ persistent.id+1 }} ?</span>
    </template>
  </Popup>
  <Info :item="infoItem" v-if="infoItem._id" @close="infoClose" show-on-mounted="true" />
</template>

<script lang="ts">

//@ts-ignore
import Popup from "./../Popup";
//@ts-ignore
import AddButton from './AddButton.vue';
//@ts-ignore
import Info from './Info.vue';
//@ts-ignore
import Process from './Process.vue';
import {defineComponent} from "vue";
import {mapState} from "vuex";
//@ts-ignore
import Form from "./Form";

interface iSettingForm {
  'include': Array<String>,
  'exclude': Array<String>,
  'implementation': String
}

interface iJob {
  'runningTime': number,
  'host': string,
  'basePath': string,
  '_id': string
}

const Treads = defineComponent({
  name: "Treads",
  props: {
    'socket': {
      type: Object
    }
  },
  data() {
    return {
      'infoItem': {
      } as iJob
    }
  },
  components: {
    AddButton,
    Popup,
    Process,
    Info,
    Form
  },
  methods: {
    getSettings: function (id: String) {
      return this.threads[id]
    },
    click: function (id: String) {
      //@ts-ignore
      this.$refs.popup.open({'id':id});
    },
    edit: function (id: String) {
      //@ts-ignore
      this.$refs.editpopup.open({'id':id});
    },
    submit: function (record: iSettingForm, persistent: Object) {
      //@ts-ignore
      this.$store.dispatch('showPreloader', true);
      // @ts-ignore
      this.socket.emit('updateThreadSetting', { 'id': persistent.id, setting: record})
    },
    info: function (item: iJob) {
      this.infoItem = item;
    },
    infoClose: function () {
      this.infoItem = {
        'runningTime': 0,
        'host': '',
        'basePath': '',
        '_id': ''
      };
    },
    removeThreade: function (record: iSettingForm, persistent: Object) {
      //@ts-ignore
      this.$store.dispatch('showPreloader', true);
      //@ts-ignore
      this.socket.emit('delThread', [persistent.id]);
    },
    //@ts-ignore
    hostFormat(item: iJob) {
      let host = '';
      if (item._id != undefined) {
        if (item.basePath) {
          host = item.basePath.replace('/home/www/', '');
        } else {
          host = item.host ? item.host.replace('http://', '').replace('https://', '') : '-';
        }
      }
      return host;
    },
    runningHumanFormat(item: iJob) {
      if (item.runningTime >= 0) {
        const msPerMinute = 60;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;

        const elapsed = item.runningTime; // in second

        if (elapsed < msPerMinute) {
          return Math.round(elapsed) + ' seconds ago';
        }
        else if (elapsed < msPerHour) {
          return Math.floor(elapsed/msPerMinute) + ' minutes ago';
        }
        else if (elapsed < msPerDay ) {
          return Math.floor(elapsed/msPerHour ) + ' hours ago';
        }
        else if (elapsed < msPerYear) {
          return 'approximately ' + Math.floor(elapsed/msPerMonth) + ' months ago';
        }
        else {
          return 'approximately ' + Math.floor(elapsed/msPerYear ) + ' years ago';
        }
      }

      return '-';
    }
  },
  computed: {
    ...mapState({
      // @ts-ignore
      runningJobsList: state => state.runningJobsList,
      // @ts-ignore
      threadsCounter: state => state.threadsCounter,
      // @ts-ignore
      colors: state => state.colors,
      // @ts-ignore
      threads: state => state.threads
    }),
    list() {
      let threads = [];
      for (let x = 0; x < parseInt(this.threadsCounter.toString()); x++) {
        threads.push({'thread': x, 'command': ''});
      }

      for (let key in this.runningJobsList) {
        //@ts-ignore
        const thread = this.runningJobsList[key].thread;

        //@ts-ignore
        for (const index in threads) {
          if (threads[index].thread === thread) {
            // @ts-ignore
            threads[index] = this.runningJobsList[key];
          }
        }
      }

      return threads.reverse();
    }
  },
});

export default Treads

</script>

<style scoped>
.index {
  width: 90px;
}
</style>