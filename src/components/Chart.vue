<template>
  <div class="chartdiv" ref="chartdiv">Chart</div>
</template>

<script lang="ts">

import {defineComponent} from 'vue'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {mapState} from "vuex";

const Chart = defineComponent({
  watch: {
    newThreadsStat() {
      //@ts-ignore
      this.chart.addData(this.newThreadsStat);
    }
  },
  computed: {
    ...mapState({
      //@ts-ignore
      newThreadsStat: state => state.newThreadsStat
    })
  },
  mounted() {
    // Create chart instance
    //@ts-ignore
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    chart.dateFormatter.dateFormat = "HH:mm";
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    //@ts-ignore
    chart.data = this.$store.getters.threadsStats;

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    // chart.legend = new am4charts.Legend();

    const categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    //@ts-ignore
    valueAxis.max = this.$store.getters.threadsCount;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = false;
    valueAxis.renderer.minWidth = 100;
    //@ts-ignore
    valueAxis.tooltip.disabled = true;

    //@ts-ignore
    for (let key = 0; key < this.$store.getters.threadsCount; key++) {
      const series = chart.series.push(new am4charts.LineSeries());
      // series.name = "Series 1";
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "thread" + key;
      series.stacked = true;
      series.sequencedInterpolation = true;
      series.fillOpacity = 0.6;
      //@ts-ignore
      series.tooltip.background.fill = am4core.color("#FFF");
    }

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    //@ts-ignore
    this.chart = chart;
  },
  beforeUnmount() {
    //@ts-ignore
    if (this.chart) {
      //@ts-ignore
      this.chart.dispose();
    }
  }
})

export default Chart

</script>

<style scoped>
  .chartdiv {
    margin: auto;
    height: 260px;
    width: 100%;
  }
</style>