<template>
  <div class="">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <a class="navbar-brand">Servers</a>
      <ul class="navbar-nav mr-auto">
        <Button v-for="item in buttons" :key="item.name" :name="item.name" :url="item.url" :basePath="basePath"></Button>
      </ul>
    </nav>
  </div>
  <div class="wall" v-if="this.$store.getters.threadsStats.length > 0 && this.$store.getters.threadsCount > 0">
    <Chart/>
  </div>
  <div v-else class="d-flex justify-content-center mb-2">
    <div class="spinner-grow" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div>
    <div class="">
      <div class="container">
        <div class="row">
          <div class="col">
            <Counter title="Scheduled" icon="fa fa-recycle" :value="plannedCounter"/>
          </div>
          <div class="col-1">
            <img class="arrow" src="images/grey-right-arrow-hi.png" alt=""/>
          </div>
          <div class="col">
            <Counter title="Waiting" icon="fa fa-hourglass-start" :value="waitingCounter"/>
          </div>
          <div class="col-1">
            <img class="arrow" src="images/grey-right-arrow-hi.png" alt=""/>
          </div>
          <div class="col">
            <Counter title="Completed" icon="fa fa-check" :value="historyCounter"/>
          </div>
        </div>
      </div>
      <br>
      <Threads />
    </div>
    <hr/>
  </div>

</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Chart from './components/Chart.vue';
import Button from './components/Button.vue';
import Counter from './components/Counter.vue';
import Threads from './components/Threads.vue';
import io from "socket.io-client";
// @ts-ignore
import config from './../config/config.js'

@Options({
  components: {
    Chart,
    Button,
    Counter,
    Threads
  },
  data() {
    return {
      'buttons': config.servers,
      'basePath': ''
    }
  },
  computed: {
    historyCounter() {
      return this.$store.getters.historyCount;
    },
    threadsCounter() {
      return this.$store.getters.threadsCount;
    },
    plannedCounter() {
      return this.$store.getters.plannedCount;
    },
    waitingCounter() {
      return this.$store.getters.waitingCount;
    },
  },
  mounted() {
    let store = this.$store;
    let uri = window.location.search.substring(1);
    this.basePath = window.location.origin;
    let params = new URLSearchParams(uri);
    let socket;
    let server: string | null = params.get("server");
    if (server === null) {
      server = config.servers[0].url;
    }
    store.dispatch('server', server)
    //@ts-ignore
    socket = io(server);
    if (socket) {
      for (let event in config.events) {
        //@ts-ignore
        socket.on(config.events[event].event, (data) => {
          // if (config.events[event].event === 'historyCount') {
          //   console.log(data);
          // }
          store.dispatch('emitData', {key: event, value: data});
        })
      }
    }
  }
})
export default class App extends Vue {
}
</script>

<style>
body {
  padding-top: 4rem;
}

table th {
  font-weight: bold;
}

.arrow {
  width: 60px;
  height: 80px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: .3;
}

.jumbotron {
  padding-top: 4px;
  background-color: #fafafa;
  padding-bottom: 10px;
}
</style>
