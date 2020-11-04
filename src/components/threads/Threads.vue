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
      <th scope="row" v-bind:style="item.color" class="text-center align-middle">#{{ item.thread + 1 }}</th>
      <td class="align-middle">{{ hostFormat(item) }}</td>
      <td class="job align-middle" v-bind:title="item.job">{{ item.job }}</td>
      <td colspan="align-middle"><InfoButton :item="item" v-if="item.job" /></td>
      <td class="running align-middle"><span id="{{ item.thread }}">{{ runningHumanFormat(item) }}</span></td>
      <td class="align-middle">
        <a class="btn btn-sm btn-info"><i class="fa fa-pencil"></i></a>
        &nbsp;
        <Button @button-click="click(item.thread)" icon="fa-trash" styleClass="btn-danger"/>
      </td>
    </tr>
    </tbody>
  </table>
  <Popup ref="popup" id="threadPopupDelete" @submit="removeThreade" confirm="true" title="Confirm dialog" submitButtonClass="btn-danger">
    <template v-slot:content="{ persistent }">
      <span>Are you sure you want to delete a thread #{{ persistent.id+1 }} ?</span>
    </template>
  </Popup>
</template>

<script>
//@ts-ignore
import Button from "./../Button";
//@ts-ignore
import Popup from "./../Popup";
import AddButton from './AddButton.vue';
import InfoButton from './InfoButton.vue';
import {defineComponent} from "vue";
import {mapState} from "vuex";

const Treads = defineComponent({
  name: "Treads",
  props: {
    'socket': {
      type: Object
    }
  },
  components: {
    Button,
    AddButton,
    InfoButton,
    Popup
  },
  methods: {
    click: function (id) {
      //@ts-ignore
      this.$refs.popup.open({'id':id});
    },
    removeThreade: function (record, persistent) {
      //@ts-ignore
      this.$store.dispatch('showPreloader', true);
      //@ts-ignore
      this.socket.emit('delThread', [persistent.id]);
      //@ts-ignore
      this.$store.dispatch('invalidateChart', true);
    },
    //@ts-ignore
    hostFormat(item) {
      let host = '';
      if (item._id !== undefined) {
        if (item.basePath) {
          host = item.basePath.replace('/home/www/', '');
        } else {
          host = item.host ? item.host.replace('http://', '').replace('https://', '') : '-';
        }
      }
      return host;
    },
    runningHumanFormat(item) {
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
        //@ts-ignore
        runningJobsList: state => state.runningJobsList,
        threadsCounter: state => state.threadsCounter,
        colors: state => state.colors
    }),
    list() {
      let threads = [];
      for (let x = 0; x < this.threadsCounter; x++) {
        threads.push({'thread': x, 'command': '', 'color': 'background-color: ' + this.colors[x*2]});
      }

      for (let key in this.runningJobsList) {
        const thread = this.runningJobsList[key].thread;

        //@ts-ignore
        for (const index in threads) {
          if (threads[index].thread === thread) {
            threads[index] = this.runningJobsList[key];
            const colorKey = index*2;
            threads[index]['color'] = 'background-color: ' + this.colors[colorKey];
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
.job {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 30%;
  max-width: 300px;
}
.running {
  width: 10%;
  max-width: 180px;
}
</style>