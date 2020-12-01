<template>
  <teleport to="#popup">
    <div @keyup.esc="close()" v-bind:id="id" v-if="closed === false" v-bind:class="popupStyle" tabindex="-1" role="dialog" v-bind:style="style">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <slot name="content" :persistent="persistent"></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">{{ closeButtonText }}</button>
            <button type="button" class="btn" v-bind:class="submitButtonClass" @click="submit" v-if="showSubmitButton"><span v-if="confirm">Yes</span><span
                v-else>{{ submitButtonText }}</span></button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="opened" v-bind:class="popupBgStyle"></div>
  </teleport>
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
    'confirm': {
      default: false
    },
    'showSubmitButton': {
      default: true
    },
    'closeButtonText': {
      default: 'Close'
    },
    'submitButtonClass': {
      default: 'btn-primary'
    },
    'submitButtonText': {
      default: 'Save'
    }
  },
  data() {
    return {
      opened: false,
      closed: true,
      style: 'display: block; padding-right: 14px;',
      persistent: {}
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
  emits: ['submit','close'],
  methods: {
    close: function () {
      // console.log('remove listener dialog ' + this.id);
      window.removeEventListener('keyup', this.close);
      this.opened = false;
      setTimeout(() => {
        this.closed = true;
        //@ts-ignore
        this.$emit('close'); // after submit
      }, 400);
    },
    open: function (persistent) {
      // console.log('add listener dialog ' + this.id);
      window.addEventListener('keyup', (event) => { if (event.key === 'Escape') this.close() });
      setTimeout(() => {
        this.opened = true;
      }, 20);
      this.closed = false;
      this.persistent = persistent;
    },
    // @ts-ignore
    submit() {
      console.log(this.$el)
      let record = new FormData(this.$refs.form);
      this.$emit('submit', record, this.persistent);
      this.close();
    }
  }
}
</script>

<style scoped>
</style>