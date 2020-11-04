<template>
  <div v-if="showPreloader">
    <div id="overlay-circular" style="background-color: rgba(52, 58, 64, 0.8);">
      <div class="loader-circular"></div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Preloader",
  computed: {
    ...mapState({
      //@ts-ignore
      showPreloader: state => state.showPreloader,
    })
  }
}
</script>

<style scoped>
#overlay-circular {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000
}

.loader-circular {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #9370db;
  -webkit-animation: spin-circular 2s linear infinite;
  animation: spin-circular 2s linear infinite;
}

.loader-circular:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #ff9633;
  -webkit-animation: spin-circular 3s linear infinite;
  animation: spin-circular 3s linear infinite;
}

.loader-circular:after {
  content: "";
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #17fd3d;
  -webkit-animation: spin-circular 1.5s linear infinite;
  animation: spin-circular 1.5s linear infinite;
}

@-webkit-keyframes spin-circular {
  0% {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(1turn)
  }
}

@keyframes spin-circular {
  0% {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(1turn)
  }
}
</style>