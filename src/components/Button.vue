<template>
  <a class="btn btn-sm" v-bind:class="styleClass" @click="click"><i class="fa" v-bind:class="icon" v-if="showIcon"></i> <span>{{ text }}</span></a>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: "Button",
  props: {
    'socket': {
      type: Object
    },
    'icon': {
      type: String,
      default: 'fa-plus-circle'
    },
    'text': {
      type: String,
      default: null
    },
    'styleClass': {
      type: String,
      default: 'btn-success'
    },
    'showIcon': {
      default: true
    }
  },
  emits: ['button-click'],
  methods: {
    click: function () {
      this.$emit('button-click');
    }
  }
});

</script>