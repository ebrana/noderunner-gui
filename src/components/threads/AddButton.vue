<template>
  <Button @button-click="click" />
  <Popup ref="popup" id="threadPopup" @submit="submit" content="Are you sure you want to add a thread?" confirm="true" title="Confirm dialog" />
</template>

<script lang="ts">

import {defineComponent} from "vue";
//@ts-ignore
import Button from "./../Button";
//@ts-ignore
import Popup from "./../Popup";

const AddButton = defineComponent({
  name: "AddButton",
  components: {
    Button,
    Popup
  },
  props: {
    'socket': {
      type: Object
    }
  },
  methods: {
    click: function () {
      //@ts-ignore
      this.$refs.popup.open();
    },
    submit: function () {
      //@ts-ignore
      this.socket.emit('addThread');
      //@ts-ignore
      this.$store.dispatch('invalidateChart', true);
    }
  }
});

export default AddButton

</script>