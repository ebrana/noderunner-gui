<template>
  <Button @button-click="click" />
  <Popup ref="popup" id="threadPopup" @submit="submit" submitButtonText="Save" title="Thread setting" :schema="settingSchema">
    <template v-slot:content>
      <Form ref="form" />
    </template>
  </Popup>
  <Alert v-if="successMessage !== ''" @alerthide="alertHide" type="alert-success">
    <template v-slot:content>
      <span>{{ successMessage }}</span>
    </template>
  </Alert>
</template>

<script lang="ts">

import {defineComponent} from "vue";
//@ts-ignore
import Button from "./../Button";
//@ts-ignore
import Popup from "./../Popup";
//@ts-ignore
import Form from "./Form";
import {mapGetters} from "vuex";

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
  data() {
    return {
      'settingSchema': {
        'include': [],
        'exclude': [],
        'implementation': null
      },
      successMessage: String('')
    }
  },
  computed: {
    ...mapGetters([
      'isLoggedIn', 'getToken'
    ]),
  },
  watch: {
    socket() {
      //@ts-ignore
      this.socket.on('settingSaved', () => {
        this.successMessage = 'Success save...'
      })
    }
  },
  methods: {
    alertHide: function () {
      this.successMessage = '';
    },
    click: function () {
      //@ts-ignore
      this.$refs.popup.open()
    },
    submit: function (record: iSettingForm) {
      //@ts-ignore
      this.$store.dispatch('showPreloader', true)
      //@ts-ignore
      this.socket.emit('addThread', {'setting': record, 'token': this.getToken})
      //@ts-ignore
      this.$store.dispatch('invalidateChart', true)
    }
  }
});

export default AddButton

</script>