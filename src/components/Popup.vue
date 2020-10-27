<template>
  <div v-bind:id="id" v-if="closed === false" v-bind:class="popupStyle" tabindex="-1" role="dialog" v-bind:style="style">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" @click="close">×</span>
          </button>
        </div>
        <div class="modal-body">
          {{ content }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Close</button>
          <button type="button" class="btn btn-primary" @click="submit"><span v-if="confirm">Yes</span><span v-else>Save</span></button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="opened" v-bind:class="popupBgStyle"></div>
</template>

<script>

export default {
  name: "Popup",
  props: {
    'title': {
      type: String,
      default: ''
    },
    'id': {
      type: String,
      required: true
    },
    'content': {
      type: String,
      default: ''
    },
    'confirm': {
      default: false
    }
  },
  data() {
    return {
      opened: false,
      closed: true,
      style: 'display: block; padding-right: 14px;',
    }
  },
  computed: {
    popupStyle: function () {
      if (this.opened) {
        return 'modal fade show';
      }

      return 'modal fade';
    },
    popupBgStyle: function () {
      if (this.opened) {
        return 'modal-backdrop fade show';
      }
      return 'modal-backdrop';
    },
  },
  emits: ['submit'],
  methods: {
    accepted: () => {
      console.log('accepted');
    },
    close: function () {
      this.opened = false;
      setTimeout(()=> {
        this.closed = true;
      }, 400);
    },
    open: function () {
      setTimeout(()=> {
        this.opened = true;
      }, 20);
      this.closed = false;
    },
    submit () {
      this.close();
      let record = {};
      this.$emit('submit', record);
    }
  }
}
</script>

<style scoped>
</style>