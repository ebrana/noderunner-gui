<template>
  <ScrollTopComponent>
    <a class="btn btn-light btn-sm"><i class="fa fa-angle-up fa-3x"></i></a>
  </ScrollTopComponent>
</template>

<script lang="ts">
import ScrollTopComponent from "@/components/ScrollTopComponent.vue";
export default {
  name: "ScrollTopArrow",
  components: {ScrollTopComponent}
}
</script>

<style scoped>
.btn {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.55);
  padding-left: 10px;
  padding-right: 10px;
  color: white;
}
</style>