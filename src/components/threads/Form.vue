<template>
  <form id="threadForm">
    <fieldset>
      <legend><h6>Include</h6></legend>
      <span v-for="(n, index) in include" v-bind:key="n">
        <div class="form-group">
          <div class="row align-items-center">
            <div class="col-sm-10">
              <Input :index="n" name="include" v-bind:value="includeByIndex(index)" />
            </div>
            <div class="col-2">
              <Button v-if="n > 1" @button-click="includeRemove(index)" icon="fa-minus" styleClass="btn-danger"/>
            </div>
          </div>
        </div>
      </span>
      <span class="clearfix"><Button @button-click="includeAppend(this)" v-if="include.length < max"/></span>
    </fieldset>
    <hr/>
    <fieldset>
      <legend><h6>Exclude</h6></legend>
      <span v-for="(n, index) in exclude" v-bind:key="n">
        <div class="form-group">
          <div class="row align-items-center">
            <div class="col-sm-10">
              <Input :index="n" name="exclude" v-bind:value="excludeByIndex(index)" />
            </div>
            <div class="col-2">
              <Button v-if="n > 1" @button-click="excludeRemove(index)" icon="fa-minus" styleClass="btn-danger"/>
            </div>
          </div>
        </div>
      </span>
      <span class="clearfix"><Button @button-click="excludeAppend()" v-if="exclude.length < max"/></span>
    </fieldset>
    <hr/>
    <fieldset>
      <legend><h6>Implementation</h6></legend>
      <div class="form-group" id="implementation">
        <Input name="implementation" v-bind:value="implementation" />
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts">

//@ts-ignore
import Input from "./Input";
//@ts-ignore
import Button from "./../Button";

import {ref, watch} from "vue"

interface IForm {
  include: Array<Number>,
  exclude: Array<Number>,
  implementation: string,
  max: number
}

interface iProps {
  default: IForm
}

export default {
  name: "Form",
  components: {
    Input,
    Button
  },
  props: {
    'default': {
      type: Object,
      default: () => {}
    }
  },
  setup(props: iProps) {
    let include = ref([1])
    let exclude = ref([1])
    let implementation = ref('')
    let max = ref(8)

    function includeAppend() {
      if (include.value.length < max.value) {
        include.value.push(include.value.length+1)
      }
    }
    function excludeAppend() {
      if (exclude.value.length < max.value) {
        exclude.value.push(exclude.value.length+1)
      }
    }
    function includeRemove(index: number) {
      if (index > 0) {
        include.value.splice(index, 1)
      }
    }
    function excludeRemove(index: number) {
      if (index > 0) {
        exclude.value.splice(index, 1)
      }
    }
    function includeByIndex(index: number) {
      return props.default && props.default.include ? props.default.include[index] : ''
    }
    function excludeByIndex(index: number) {
      return props.default && props.default.exclude ? props.default.exclude[index] : ''
    }
    watch(props, (value) => {
      if (value.default && value.default.include) {
        value.default.include.map((value, index) => {
          if (index !== 0) {
            includeAppend()
          }
        })
      }
      if (value.default && value.default.exclude) {
        value.default.exclude.map((value, index) => {
          if (index !== 0) {
            excludeAppend()
          }
        })
      }
      implementation.value = props.default?.implementation
    }, {immediate: true})

    return {
      props,
      include,
      exclude,
      max,
      implementation,
      includeAppend,
      excludeAppend,
      includeRemove,
      excludeRemove,
      includeByIndex,
      excludeByIndex
    }
  }
}
</script>

<style scoped>

</style>