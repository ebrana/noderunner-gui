<template>
  <Popup ref="popup" id="threadInfoPopup" modal-style="modal-lg" :showSubmitButton="false" closeButtonText="Ok" title="Job details" @close="close">
    <template v-slot:content>
      <table class="table table-sm table-striped table-borderless">
        <tbody>
        <tr v-for="(value, name, index) in item"
            :key='index'
        >
          <template v-if="name !== 'index' && name !== 'setting' && name !== 'runningTime'">
            <th>{{ name }}</th>
            <td><span v-if="name === 'started' || name === 'added'">{{ humanDate(value) }}</span><span v-else>{{ value }}</span></td>
          </template>
        </tr>
        </tbody>
      </table>
    </template>
  </Popup>
</template>

<script lang="ts">

import {defineComponent} from "vue";
//@ts-ignore
import Popup from "./../Popup";

const Info = defineComponent({
  name: "Info",
  components: {
    Popup
  },
  props: {
    'item': {
      type: Object
    },
    'showOnMounted': {
      type: Boolean,
      default: false
    },
    'isVisible': {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.showOnMounted) {
      //@ts-ignore
      this.$refs.popup.open();
    }
  },
  emits: ['close'],
  watch: {
    'isVisible': function(isVisible) {
      if (isVisible) {
        //@ts-ignore
        this.$refs.popup.open();
      }
    }
  },
  methods: {
    show: function () {
      //@ts-ignore
      this.$refs.popup.open();
    },
    close: function () {
      //@ts-ignore
      this.$emit('close');
    },
    humanDate: (timestamp: number) => {
      const date = new Date(timestamp*1000)
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const seconds = "0" + date.getSeconds();
      const day = "0" + date.getDate();
      const month = "0" + (date.getMonth() + 1);
      const year = date.getFullYear();

      return day.substr(-2) + '. ' + month.substr(-2) + '. ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }
  }
});

export default Info

</script>