<template>
  <table border="0" width="30%" class="table">
    <thead class="thead-light text-center">
    <th colspan="4"><i class="fa fa-refresh"></i> running</th>
    </thead>
    <tbody>
    <tr>
      <th>thrd</th>
      <th>host</th>
      <th>job</th>
      <th>status</th>
    </tr>
    <tr v-for="(item) in list" v-bind:key="item">
      <th scope="row">#{{ item.thread + 1 }}:</th>
      <td>{{ hostFormat(item) }}</td>
      <td>{{ item.job }}</td>
      <td><span v-if="item.job" class="btn btn-sm btn-warning"><i class="fa fa-refresh"></i> {{ item.status }}</span></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {defineComponent} from "vue";
import {mapState} from "vuex";

const Treads = defineComponent({
  name: "Treads",
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