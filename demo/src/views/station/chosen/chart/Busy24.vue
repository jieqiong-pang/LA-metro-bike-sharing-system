<template>
  <div class="dv_chart_container_all">
    <div class="chart_title">Busy Time Distribution <small>(times)</small></div>
    <div v-if="chartData === null">
      <p>Please Select a Station.</p>
    </div>
    <div id="dv_station_chart_busy24" class="dv_chart_container"></div>
  </div>
</template>

<script>
// import * as d3 from "d3";
import LineChart from "@/assets/js/chart/line_chart/line_chart.js";

export default {
  name: "Busy24",
  data() {
    return {
      chart: null,
      first_load: true,
    };
  },
  props: {
    chartData: {
      type: Object,
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
      // index -> day

      const sorted_key = Object.keys(this.chartData).sort((a, b) => +a - +b > 0)
      return sorted_key.map(k => {
        return  {
          x: +k,
          y: this.chartData[k]
        }
      })
    },
    createChart() {
      if (this.chartData === null) {
        return null;
      } else {
        this.updateChartByData();
      }
    },
    updateChartByData() {
      // 在选择station的时候，这里应该能看到更新后的chart的data
      // console.log(this.chartData);
      const processed_data = this.dataProcess();
      console.log(processed_data)
      if (this.first_load === true) {
        // TODO: 可以参考下面的两行
        this.chart = new LineChart({
          selector: "#dv_station_chart_busy24",
          svg_id: "svg_dv_station_chart_busy24",
          data: processed_data,
          x_tick_values: [0, 3, 6, 9, 12, 15, 18, 21]
        });
        this.chart.generateChart();
        this.first_load = false;
      } else {
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
