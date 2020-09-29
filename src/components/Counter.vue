<template>
  <div class="numberPanel">
    <div class="card" style="width: 17rem;">
      <div class="card-body text-center">
        <h1><span>{{ formatedValue }}</span></h1>
        <div class="card-text" style="position: relative; z-index: 1000;">
          <h5 class="text-center text-uppercase">
            <span><i :class=icon></i> {{ title }}</span>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

const Counter = defineComponent({
  name: "Counter",
  props: {
    'title': {
      type: String,
      required: true
    },
    'icon': {
      type: String,
      required: true
    },
    'value': {
      type: Number,
      required: true
    }
  },
  computed: {
    formatedValue() {
      return this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }
});

export default Counter

</script>

<style scoped>
.numberPanel {
  width: 50px;
  cursor: pointer;
}
.card:hover {
  background-color: #f3f3f3;
}
</style>