<template>
  <Popup ref="popup" id="threadInfoPopup" modal-style="modal-lg" :showSubmitButton="false" closeButtonText="Ok" title="Job details" @close="close">
    <template v-slot:content>
      <table class="table table-sm table-striped table-borderless">
        <tbody>
        <tr v-for="(value, name, index) in itemOfList()"
            :key='index'
        >
          <th>{{ name }}</th>
          <td><span v-if="name === 'started' || name === 'added'">{{ humanDate(value) }}</span><span v-else>{{ value }}</span></td>
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
import { formatter } from '../mixins/formatter'

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
  data() {
    return {
      'infoItem': this.item
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
    'isVisible': function (isVisible) {
      if (isVisible) {
        //@ts-ignore
        this.$refs.popup.open();
      }
    }
  },
  mixins: [formatter],
  methods: {
    show: function (command: Object) {
      this.infoItem = command
      //@ts-ignore
      this.$refs.popup.open();
    },
    close: function () {
      //@ts-ignore
      this.$emit('close');
    },
    itemOfList: function () {
      if (this.infoItem) {
        let cloneObject = Object.assign({}, this.infoItem)
        if (cloneObject.runningTime) {
          delete cloneObject.runningTime
        }
        if (cloneObject.setting) {
          delete cloneObject.setting
        }
        if (cloneObject.setting) {
          delete cloneObject.setting
        }

        return cloneObject
      }

      return this.infoItem
    }
  }
});

export default Info

</script>