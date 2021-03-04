<template>
  <Preloader />
  <div class="jumbotron">
    <div class="">
      <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a class="navbar-brand">Servers</a>
        <button @click="collapsing" class="navbar-toggler collapsed" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" v-bind:class="collapsingClass" v-bind:style="collapsingStyle" id="serversMenu">
          <ul class="navbar-nav mr-auto">
            <MenuButton v-for="item in buttons" :key="item.name" :name="item.name" :url="item.url" :basePath="basePath"></MenuButton>
          </ul>
          <span v-if="jwtEnable">
            <span class="d-flex" v-if="isLoggedIn === false">
              <a class="btn btn-outline-success" @click="signin">Sign in</a>
            </span>
            <span v-else>
              <a class="btn btn-secondary" @click="signout">Logout</a>
            </span>
          </span>
        </div>
      </nav>
    </div>

    <div class="wall" v-if="threadsStats.length > 0 && threadsCounter > 0">
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
              <Counter title="Scheduled" icon="fa fa-recycle" v-on:click="loadQueue('planned')" :value="plannedCounter"/>
            </div>
            <div class="col-1">
              <img class="arrow" src="images/grey-right-arrow-hi.png" alt=""/>
            </div>
            <div class="col-md">
              <Counter title="Waiting" icon="fa fa-hourglass-start" v-on:click="loadQueue('immediate')" :value="waitingCounter"/>
            </div>
            <div class="col-1">
              <img class="arrow" src="images/grey-right-arrow-hi.png" alt=""/>
            </div>
            <div class="col-md">
              <Counter title="Completed" icon="fa fa-check" v-on:click="loadQueue('history')" :value="historyCounter"/>
            </div>
          </div>
        </div>

        <br>
        <Threads :socket="socket"/>
      </div>
      <hr/>
    </div>

    <div>
      <commands-list :type="listType" :socket="socket" ref="grid"></commands-list>
    </div>

  </div>
  <Popup ref="signin" id="signInPopup" @submit="login" title="Login..." submitButtonClass="btn-success" submitButtonText="Login" v-if="isLoggedIn === false">
    <template v-slot:content="">
      <Login ref="form" />
    </template>
  </Popup>
  <Alert v-if="jwt.message" @alerthide="alertHide">
    <template v-slot:content>
      <span>{{ jwt.message }}</span>
    </template>
  </Alert>
  <Alert v-if="permissionDenied !== ''" @alerthide="alertHide">
    <template v-slot:content>
      <span>{{ permissionDenied }}</span>
    </template>
  </Alert>
  <ScrollTopArrow></ScrollTopArrow>
</template>

<script lang="ts">

import Preloader from './components/Preloader.vue';
import Chart from './components/Chart.vue';
import MenuButton from './components/MenuButton.vue';
import Counter from './components/Counter.vue';
import Threads from './components/threads/Threads.vue';
import io from "socket.io-client";
import CommandsList from './components/commands/list/List.vue';
import config from './../config/config';
import {defineComponent} from "vue";
import {mapState, mapGetters, mapActions} from "vuex";
import Popup from "@/components/Popup.vue";
import Login from "@/components/Login.vue";
import Alert from "@/components/Alert.vue";
import ScrollTopArrow from "@/components/ScrollTopArrow.vue";

interface iLoginForm {
  'email': String,
  'password': String
}

const Main = defineComponent({
  name: "Main",
  components: {
    ScrollTopArrow,
    Alert,
    Login,
    Chart,
    MenuButton,
    Counter,
    Threads,
    Preloader,
    CommandsList,
    Popup,
  },
  data: () => {
    return {
      collapsed: false,
      collapsingClass: 'collapse',
      collapsingStyle: '',
      listType: String(''),
      permissionDenied: String('')
    }
  },
  setup() {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    let buttons = process.env.NODE_ENV === 'production' ? MyConfig.servers : config.servers; // MyConfig je globalni promenna, kterou poskytuje Express ze server.js
    let basePath = '';
    let socket = null;
    //@ts-ignore
    // eslint-disable-next-line no-undef
    const jwtEnable = process.env.NODE_ENV === 'production' ? MyConfig.jwt.enable : config.jwt.enable;

    return {
      buttons,
      basePath,
      socket,
      jwtEnable
    }
  },
  computed: {
    ...mapState({
      //@ts-ignore
      threadsCounter: state => state.threadsCounter,
      //@ts-ignore
      threadsStats: state => state.threadsStats,
      //@ts-ignore
      historyCounter: state => state.historyCounter,
      //@ts-ignore
      plannedCounter: state => state.plannedCounter,
      //@ts-ignore
      waitingCounter: state => state.waitingCounter,
      //@ts-ignore
      jwt: state => state.jwt,
    }),
    ...mapGetters([
      'isLoggedIn'
    ]),
  },
  beforeCreate() {
    const uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri)
    if (params.get("server") === null) {
      window.location.href = window.location.origin + '?server=' + this.buttons[0].url
      return
    }
  },
  mounted() {
    //@ts-ignore
    const store = this.$store;
    const uri = window.location.search.substring(1);
    this.basePath = window.location.origin
    let params = new URLSearchParams(uri)
    const server: string | null = params.get("server");
    store.dispatch('server', server)
    //@ts-ignore
    const socket = this.socket = io(server);
    if (socket) {
      for (let event in config.events) {
        //@ts-ignore
        socket.on(config.events[event].event, (data) => {
          store.dispatch('emitData', {key: event, value: data})
        })
      }
      socket.on('permissionDenied', (message: any) => {
        //@ts-ignore
        this.$store.dispatch('showPreloader', false)
        this.permissionDenied = message ? message : 'Permission denied!'
        if (this.permissionDenied !== 'Permission denies!') {
          this.logout()
        }
      })
    }
    if (localStorage.jwt) {
      store.dispatch('jwt', {token: localStorage.jwt})
      const exp = new Date(localStorage.exp)
      const current = new Date()
      const expDate = exp.getTime() + (60*60*1000) // hodina v milisekundach
      const diff = expDate-current.getTime()

      if (diff > 0) {
        setInterval(() => {
          // @ts-ignore
          this.socket.emit('refreshToken', {'token': localStorage.jwt})
        }, diff) // pokud mame cas, tak naplanujeme refresh na prislusnou dobu
      } else if (diff < 0 && diff > -10*60*1000) { // mene jak 10 minut (10 min od expirace je mozne jeste obnovit), obnovujeme ihned
        // @ts-ignore
        this.socket.emit('refreshToken', {'token': localStorage.jwt})
      } else { // logout, token expired
        this.logout()
      }
    }
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    alertHide: function () {
      this.jwt.message = null
      this.permissionDenied = '';
    },
    signin: function () {
      //@ts-ignore
      this.$refs.signin.open()
    },
    signout: function () {
      this.logout()
    },
    login: function (record: iLoginForm) {
      // @ts-ignore
      this.socket.emit('login', record)
      setInterval(() => {
        // @ts-ignore
        this.socket.emit('refreshToken', {'token': localStorage.jwt})
      }, 3600000)
    },
    collapsing: function () {
      if (this.collapsed === false) {
        this.collapsingClass = 'collapsing';
        this.collapsingStyle = 'height: 0px';
        setTimeout(() => {
          this.collapsingStyle = 'height: ' + this.buttons.length * 40 + 'px';
          setTimeout(() => {
            this.collapsingStyle = '';
            this.collapsingClass = 'show';
            this.collapsed = true;
          }, 150)
        }, 30)
      } else {
        this.collapsingClass = 'collapsing';
        this.collapsingStyle = 'height: ' + this.buttons.length * 40 + 'px';
        setTimeout(() => {
          this.collapsingStyle = 'height: 0px'
          setTimeout(() => {
            this.collapsingStyle = '';
            this.collapsingClass = 'collapse';
            this.collapsed = false;
          }, 150)
        }, 30)
      }
    },
    loadQueue: function (queueType: string) {
      this.listType = queueType
      //@ts-ignore
      this.$refs.grid.resetFilter()
      //@ts-ignore
      this.socket.emit('requestQueueData', {queue: queueType, filter: {}});
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
