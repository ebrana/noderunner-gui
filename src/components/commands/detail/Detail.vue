<template>
  <div id="command-detail-container">
    <table class="table table-sm">
      <tbody>
      <tr v-for="(value, name, index) in filteredCommand"
          :key='index'
      >
        <th>{{ name }}</th>
        <td>{{ value }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {computed} from "vue";

interface iDetailProps {
  command: Object
}

export default {
  name: "CommandsDetail",
  props: {
    command: {
      type: Object,
      required: true
    }
  },

  setup(props: iDetailProps)
  {
    const disallowed = ['longOutput'];

    return {
      filteredCommand: computed(() => Object.keys(props.command)
          .filter(key => !disallowed.includes(key))
          .reduce((obj, key) => {
            //@ts-ignore
            obj[key] = props.command[key];
            return obj;
          }, {}))
    }
  }
}
</script>

<style scoped>

</style>