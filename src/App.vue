<template>
  <Main />
</template>

<script>
import {Options, Vue} from 'vue-class-component';
import Main from "./Main.vue";

@Options({
  components: {
    Main
  }
})
export default class App extends Vue {
}
</script>