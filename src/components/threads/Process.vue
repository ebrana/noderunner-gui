<template>
  <th scope="row" v-bind:style="colorsStyle(item.index)" class="text-center align-middle">#{{ item.index + 1 }}</th>
  <td class="align-middle">{{ hostFormat(item) }}</td>
  <td class="job align-middle" v-bind:title="item.job">{{ item.job }}</td>
  <td colspan="align-middle">
    <Button @button-click="info(item)" icon="fa-refresh" :text="item.status" styleClass="btn-warning" v-if="item.job"/>
  </td>
  <td class="running align-middle"><span id="{{ item.thread }}">{{ runningHumanFormat(runningTime) }}</span></td>
  <td class="align-middle" v-if="jwt">
    <Button @button-click="editclick(item.index)" icon="fa-pencil" styleClass="btn-info" v-if="item.setting.delete !== true && isLoggedIn === true" />
    &nbsp;
    <Button @button-click="delclick(item.index)" icon="fa-trash" styleClass="btn-danger" v-if="item.setting.delete !== true && isLoggedIn === true" />
  </td>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import Button from "./../Button.vue";
import config from './../../../config/config';
import {mapGetters} from "vuex";

const Process = defineComponent({
  name: "Process",
  components: {
    Button
  },
  data() {
    return {
      runningTime: 0,
      timer: 0
    }
  },
  props: {
    item: {
      type: Object
    },
    colors: {
      type: Array
    }
  },
  mounted() {
    if (this.item && this.item.job) {
      if (this.item.runningTime >= 0) {
        this.runningTime = this.item.runningTime
      }
      this.timer = setInterval(() => {
        // kazdych X sekund pustit nad danym thread id
        this.runningTime += 1;
      }, 1000);
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  emits: ['ebclick', 'dbclick', 'info'],
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ]),
    jwt() {
      return config.jwt.enable
    }
  },
  methods: {
    delclick: function (id: String) {
      //@ts-ignore
      this.$emit('dbclick', id);
    },
    editclick: function (id: String) {
      //@ts-ignore
      this.$emit('ebclick', id);
    },
    //@ts-ignore
    info: function (item) {
      //@ts-ignore
      this.$emit('info', item);
    },
    // @ts-ignore
    hostFormat(itemObject) {
      let host = '';
      if (itemObject._id !== undefined) {
        if (itemObject.basePath) {
          host = itemObject.basePath.replace('/home/www/', '');
        } else {
          host = itemObject.host ? itemObject.host.replace('http://', '').replace('https://', '') : '-';
        }
      }
      return host;
    },
    // @ts-ignore
    colorsStyle(key) {
      //@ts-ignore
      return 'background-color: ' + this.colors[key * 2];
    },
    // @ts-ignore
    runningHumanFormat(runningTime) {
      if (this.item && this.item.job) {
        const msPerMinute = 60;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;

        const elapsed = runningTime; // in second

        if (elapsed < msPerMinute) {
          return Math.round(elapsed) + 's';
        } else if (elapsed < msPerHour) {
          return Math.floor(elapsed / msPerMinute) + 'min';
        } else if (elapsed < msPerDay) {
          return Math.floor(elapsed / msPerHour) + 'hrs';
        } else if (elapsed < msPerYear) {
          return Math.floor(elapsed / msPerMonth) + 'mths';
        } else {
          return Math.floor(elapsed / msPerYear) + 'yrs';
        }
      } else {
        return '-';
      }
    }
  }
})

export default Process

</script>

<style scoped>
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