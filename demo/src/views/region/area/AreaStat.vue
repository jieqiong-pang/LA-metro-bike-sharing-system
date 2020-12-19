<template>
  <div class="dv_chart_container_all">
    <div class="chart_title">
      Region Statistics<span v-if="selectedArea !== null">: {{ selectedArea }}</span>
      <small> (2016Q3-2020Q2)</small>
    </div>
    <div v-if="chartData === null" class="please_select_a">
      <p>Please select a region by clicking a dot in the vector-map.</p>
    </div>

    <div id="dv_area_chart_multi_line" class="dv_chart_container"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

import MultiLineChart from "@/assets/js/chart/line_chart/multi_line_chart.js";

export default {
  name: "AreaStat",
  data() {
    return {
      chart: null,
      first_load: true,
      display_data_length: 0,
    };
  },
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    selectedArea: {
      type: String,
      default: null,
    },
  },
  watch: {
    chartData(newData, oldData) {
      this.updateChartByData();
    },
  },
  methods: {
    dataProcess() {
      const data = this.chartData;

      // x-ticks
      const keys = Object.keys(data);
      keys.sort((a, b) => d3.ascending(a, b));
      console.log(keys);

      const lines_data = [[], [], []];

      // # of stations
      for (let k of keys) {
        lines_data[0].push([k, data[k][0]]);
        lines_data[1].push([k, data[k][1]]);
        lines_data[2].push([k, data[k][2]]);
      }

      console.log(lines_data);

      return lines_data;
    },
    updateChartByData() {
      const processed_data = this.dataProcess();
      this.display_data_length = processed_data[0].length;
      // console.log(processed_data);

      if (this.first_load === true) {
        this.chart = new MultiLineChart({
          selector: "#dv_area_chart_multi_line",
          svg_id: "svg_dv_area_chart_multi_line",
          data: processed_data,
        });
        this.chart.generateChart();
        this.first_load = false;
      } else {
        this.chart.updateData(processed_data);
      }
    },
  },
};
</script>

<style scoped></style>
