<template>
  <table border="0" width="30%" class="table threads">
    <thead class="thead-light text-center">
    <th colspan="5"><i class="fa fa-refresh"></i> running</th>
    </thead>
    <tbody>
    <tr>
      <th>thrd <AddButton :socket="socket" /></th>
      <th>host</th>
      <th>job</th>
      <th>status</th>
      <th>running</th>
    </tr>
    <tr v-for="(item) in list" v-bind:key="item">
      <th scope="row">#{{ item.thread + 1 }}:</th>
      <td>{{ hostFormat(item) }}</td>
      <td>{{ item.job }}</td>
      <td><span v-if="item.job" class="btn btn-sm btn-warning"><i class="fa fa-refresh"></i> {{ item.status }}</span></td>
      <td><span id="{{ item.thread }}">{{ runningHumanFormat(item) }}</span></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import AddButton from './AddButton.vue';
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
    AddButton
  },
  methods: {
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
        threadsCounter: state => state.threadsCounter
    }),
    list() {
      let threads = [];
      for (let x = 0; x < this.threadsCounter; x++) {
        threads.push({'thread': x, 'command': ''});
      }

      for (let key in this.runningJobsList) {
        const thread = this.runningJobsList[key].thread;

        //@ts-ignore
        for (const index in threads) {
          if (threads[index].thread === thread) {
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

</style>