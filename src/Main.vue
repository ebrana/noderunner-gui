<template>
  <Preloader />
  <div class="jumbotron">
    <div class="">
      <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a class="navbar-brand">Servers</a>
        <ul class="navbar-nav mr-auto">
          <MenuButton v-for="item in buttons" :key="item.name" :name="item.name" :url="item.url" :basePath="basePath"></MenuButton>
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
            <div class="col-md">
              <Counter title="Scheduled" icon="fa fa-recycle" :value="plannedCounter"/>
            </div>
            <div class="col-1">
              <img class="arrow" src="images/grey-right-arrow-hi.png" alt=""/>
            </div>
            <div class="col-md">
              <Counter title="Waiting" icon="fa fa-hourglass-start" :value="waitingCounter"/>
            </div>
            <div class="col-1">
              <img class="arrow" src="images/grey-right-arrow-hi.png" alt=""/>
            </div>
            <div class="col-md">
              <Counter title="Completed" icon="fa fa-check" :value="historyCounter"/>
            </div>
          </div>
        </div>
        <br>
        <Threads :socket="socket"/>
      </div>
      <hr/>
    </div>
  </div>

</template>

<script lang="ts">
import Preloader from './components/Preloader.vue';
import Chart from './components/Chart.vue';
import MenuButton from './components/MenuButton.vue';
import Counter from './components/Counter.vue';
import Threads from './components/threads/Threads.vue';
import io from "socket.io-client";
// @ts-ignore
import config from './../config/config.js';
import {defineComponent} from "vue";
import {mapState} from "vuex";

const Main = defineComponent({
  name: "Main",
  components: {
    Chart,
    MenuButton,
    Counter,
    Threads,
    Preloader
  },
  setup() {
    let buttons = config.servers;
    let basePath = '';
    let socket = null;

    return {
      buttons,
      basePath,
      socket
    }
  },
  computed: {
    ...mapState({
      //@ts-ignore
      threadsCounter: state => state.threadsCounter,
      //@ts-ignore
      historyCounter: state => state.historyCounter,
      //@ts-ignore
      plannedCounter: state => state.plannedCounter,
      //@ts-ignore
      waitingCounter: state => state.waitingCounter
    })
  },
  mounted() {
    //@ts-ignore
    const store = this.$store;
    const uri = window.location.search.substring(1);
    this.basePath = window.location.origin;
    let params = new URLSearchParams(uri);
    const server: string | null = params.get("server") === null ? config.servers[0].url : params.get("server");
    store.dispatch('server', server)
    //@ts-ignore
    const socket = this.socket = io(server);
    if (socket) {
      for (let event in config.events) {
        //@ts-ignore
        socket.on(config.events[event].event, (data) => {
          store.dispatch('emitData', {key: event, value: data});
        })
      }
    }
  }
});

export default Main

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
