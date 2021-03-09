<template>
  <form id="commandForm">
    <div class="form-group" id="command">
      <Input name="command" placeholder="Command..." v-bind:value="command" />
    </div>
    <div class="form-group" id="host">
      <Input name="host" placeholder="Hostname..." v-bind:value="host" />
    </div>
    <div class="form-group" id="schedule" v-if="persistent.type === 'planned'">
      <Input name="schedule" placeholder="Schedule..." v-bind:value="schedule" />
    </div>
    <fieldset>
      <legend><h6>Tags</h6></legend>
      <span v-for="(n, index) in tags" v-bind:key="n">
        <div class="form-group">
          <div class="row align-items-center">
            <div class="col-sm-10">
              <Input :index="n" name="tags" v-bind:value="tagsByIndex(index)" />
            </div>
            <div class="col-2">
              <Button v-if="n > 1" @button-click="tagsRemove(index)" icon="fa-minus" styleClass="btn-danger"/>
            </div>
          </div>
        </div>
      </span>
      <span class="clearfix"><Button @button-click="tagsAppend(this)" v-if="tags.length < max"/></span>
    </fieldset>
  </form>
</template>

<script lang="ts">
import Input from "@/components/threads/Input.vue";
import {ref, watch} from "vue";
import Button from "@/components/Button.vue";
export default {
  name: "CommandForm",
  components: {Button, Input},
  props: {
    'default': {
      type: Object,
      default: () => {}
    },
    'persistent': {
      type: Object,
      default: () => {}
    }
  },
  setup(props: any) {
    let max = ref(8)
    let tags = ref([1])
    let command = ref('')
    let host = ref('')
    let schedule = ref('')

    function tagsAppend() {
      if (tags.value.length < max.value) {
        tags.value.push(tags.value.length+1)
      }
    }

    function tagsRemove(index: number) {
      if (index > 0) {
        tags.value.splice(index, 1)
      }
    }

    function tagsByIndex(index: number) {
      return props.default && props.default.tags ? props.default.tags[index] : ''
    }

    watch(props.default, (value) => {
      if (value && value.tags) {
        value.tags.map((value: any, index: number) => {
          if (index !== 0) {
            tagsAppend()
          }
        })
      }
      command.value = props.default?.command
      host.value = props.default?.host
      schedule.value = props.default?.schedule
    }, {immediate: true})

    return {
      props,
      tags,
      max,
      tagsAppend,
      tagsRemove,
      tagsByIndex,
      command,
      host,
      schedule
    }
  }
}
</script>

<style scoped>

</style>