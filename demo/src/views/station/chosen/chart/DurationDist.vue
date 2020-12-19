<template>
  <div class="dv_chart_container_all">
    <div class="chart_title">Trip Duration</div>
    
    <div v-if="chartData === null">
      <p>Please Select a Station.</p>
    </div>

    <div id="id_chart_td" class="dv_chart_container"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import BarChart from "@/assets/js/chart/bar_chart/bar_chart.js";

export default {
  name: "DurationDist",
  data() {
    return {
      chart: null,
      first_load: true,
      x_scaler: null,
      y_scaler: null,
    };
  },
  props: {
    chartData: {
      type: Array,
      default: null,
    },
  },
  watch: {
    chartData() {
      this.updateChartByData();
    },
  },
  methods: {
    dataProcess() {
      return this.chartData.map((d) => {
        return {
          x: d[0],
          y: d[1],
          label: `${d[0]} min (${d[1]} times)`,
        };
      });
    },
    updateScaler() {
      const data = this.chartData;
      this.x_scaler = d3
        .scaleBand()
        .domain(
          data.map(function (d) {
            return d[0];
          })
        )
        .paddingInner(1 / 4);

      this.y_scaler = d3
        .scaleLinear()
        .domain([0, d3.max(data.map((d) => d[1]))])
        .nice();
    },
    createChart() {
      if (this.chartData === null) {
        return null;
      } else {
        this.updateChartByData();
      }
    },
    updateChartByData() {
      const processed_data = this.dataProcess();
      this.updateScaler();

      if (this.first_load === true) {
        this.chart = new BarChart({
          selector: "#id_chart_td",
          svg_id: "svg_id_chart_td",
          data: processed_data,
          x: this.x_scaler,
          y: this.y_scaler,
          x_axis_ticks: [...Array(121).keys()]
            .filter((d) => !(d % 20))
            .map((d) => d + 1),
        });
        this.chart.generateChart();
        this.first_load = false;
      } else {
        this.chart.x = this.x_scaler;
        this.chart.y = this.y_scaler;
        this.chart.updateData(processed_data);
      }
    },
  },
  mounted() {
    this.createChart();
  },
};
</script>

<style lang="sass" scoped></style>
