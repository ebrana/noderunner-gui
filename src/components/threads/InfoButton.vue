<template>
  <Button @button-click="click" icon="fa-refresh" :text="item.status" styleClass="btn-warning"/>
  <Popup ref="popup" id="threadInfoPopup" :showSubmitButton="false" closeButtonText="Ok" title="Job details">
    <template v-slot:content>
      <table class="table table-sm table-striped table-borderless">
        <tbody>
        <tr>
          <th>_id</th>
          <td>{{ item._id }}</td>
        </tr>
        <tr>
          <th>command</th>
          <td>{{ item.command }}</td>
        </tr>
        <tr>
          <th>concurrencyMode</th>
          <td>{{ item.concurrencyMode }}</td>
        </tr>
        <tr>
          <th>host</th>
          <td>{{ item.host }}</td>
        </tr>
        <tr>
          <th>env</th>
          <td>{{ item.env }}</td>
        </tr>
        <tr>
          <th>added</th>
          <td>{{ humanDate(item.added) }}</td>
        </tr>
        <tr>
          <th>schedule</th>
          <td>{{ item.schedule }}</td>
        </tr>
        <tr>
          <th>__class</th>
          <td>{{ item.__class }}</td>
        </tr>
        <tr>
          <th>sourceId</th>
          <td>{{ item.sourceId }}</td>
        </tr>
        <tr>
          <th>started</th>
          <td>{{ humanDate(item.started) }}</td>
        </tr>
        <tr>
          <th>thread</th>
          <td>{{ item.thread+1 }}</td>
        </tr>
        <tr>
          <th>waiting</th>
          <td>{{ item.waiting }}</td>
        </tr>
        </tbody>
      </table>
    </template>
  </Popup>
</template>

<script lang="ts">

import {defineComponent} from "vue";
//@ts-ignore
import Button from "./../Button";
//@ts-ignore
import Popup from "./../Popup";

const InfoButton = defineComponent({
  name: "InfoButton",
  components: {
    Button,
    Popup
  },
  props: {
    'item': {
      type: Object
    },
  },
  methods: {
    click: function () {
      //@ts-ignore
      this.$refs.popup.open();
    },
    humanDate: (timestamp: number) => {
      const date = new Date(timestamp*1000)
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const seconds = "0" + date.getSeconds();
      const day = "0" + date.getDate();
      const month = "0" + (date.getMonth() + 1);
      const year = date.getFullYear();

      return day.substr(-2) + '. ' + month.substr(-2) + '. ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }
  }
});

export default InfoButton

</script>