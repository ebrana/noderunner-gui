<template>
  <Button @button-click="click" />
  <Popup ref="popup" id="threadPopup" @submit="submit" submitButtonText="Save" title="Thread setting">
    <template v-slot:content>
      <Form ref="form" />
    </template>
  </Popup>
</template>

<script lang="ts">

import {defineComponent} from "vue";
//@ts-ignore
import Button from "./../Button";
//@ts-ignore
import Popup from "./../Popup";
//@ts-ignore
import Form from "./Form";

interface iSettingForm {
  'include': Array<String>,
  'exclude': Array<String>,
  'implementation': String
}

const AddButton = defineComponent({
  name: "AddButton",
  components: {
    Button,
    Popup,
    Form
  },
  props: {
    'socket': {
      type: Object
    }
  },
  methods: {
    click: function () {
      //@ts-ignore
      this.$refs.popup.open()
    },
    submit: function (record: iSettingForm) {
      //@ts-ignore
      this.$store.dispatch('showPreloader', true)
      //@ts-ignore
      this.socket.emit('addThread', record)
      //@ts-ignore
      this.$store.dispatch('invalidateChart', true)
    }
  }
});

export default AddButton

</script>