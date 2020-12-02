<template>
  <form id="threadForm">
    <fieldset>
      <legend><h6>Include</h6></legend>
      <span v-for="(n, index) in include" v-bind:key="n">
        <div class="form-group">
          <div class="row align-items-center">
            <div class="col-sm-10">
              <Input :index="n" name="include" v-bind:value="includeByIndex(this, index)" />
            </div>
            <div class="col-2">
              <Button v-if="n > 1" @button-click="includeRemove(this, index)" icon="fa-minus" styleClass="btn-danger"/>
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
              <Input :index="n" name="exclude" v-bind:value="excludeByIndex(this, index)" />
            </div>
            <div class="col-2">
              <Button v-if="n > 1" @button-click="excludeRemove(this, index)" icon="fa-minus" styleClass="btn-danger"/>
            </div>
          </div>
        </div>
      </span>
      <span class="clearfix"><Button @button-click="excludeAppend(this)" v-if="exclude.length < max"/></span>
    </fieldset>
    <hr/>
    <fieldset>
      <legend><h6>Implementation</h6></legend>
      <div class="form-group" id="implementation" ref="implementation">
        <Input name="implementation" :value="implementation(this)" />
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts">

//@ts-ignore
import Input from "./Input";
//@ts-ignore
import Button from "./../Button";

interface IForm {
  include: Array<Number>,
  exclude: Array<Number>,
  implementation: string,
  max: number
}

interface IValues {
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
  data() {
    return {
      include: [1],
      exclude: [1],
      max: 8
    }
  },
  watch: {
    'default': {
      immediate: true,
      handler () {
        //@ts-ignore
        if (this.default && this.default.include) {
          //@ts-ignore
          for (let x = 0; x < this.default.include.length - 1; x++) {
            //@ts-ignore
            this.includeAppend(this)
          }
        }
        //@ts-ignore
        if (this.default && this.default.exclude) {
          //@ts-ignore
          for (let x = 0; x < this.default.exclude.length - 1; x++) {
            //@ts-ignore
            this.excludeAppend(this)
          }
        }
      }
    }
  },
  methods: {
    includeAppend: (self: IForm) => {
      if (self.include.length < self.max) {
        self.include.push(self.include.length+1)
      }
    },
    excludeAppend: (self: IForm) => {
      if (self.exclude.length < self.max) {
        self.exclude.push(self.exclude.length+1)
      }
    },
    includeRemove: (self: IForm, index: number) => {
      if (index > 0) {
        self.include.splice(index, 1)
      }
    },
    excludeRemove: (self: IForm, index: number) => {
      if (index > 0) {
        self.exclude.splice(index, 1)
      }
    },
    implementation: (self: IValues) => {
      return self.default && self.default.implementation ? self.default.implementation : ''
    },
    includeByIndex: (self: IValues, index: number) => {
      return self.default && self.default.include ? self.default.include[index] : ''
    },
    excludeByIndex: (self: IValues, index: number) => {
      return self.default && self.default.exclude ? self.default.exclude[index] : ''
    }
  }
}
</script>

<style scoped>

</style>