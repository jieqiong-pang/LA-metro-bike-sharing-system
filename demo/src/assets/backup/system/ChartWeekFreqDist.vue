<template>
  <div class="dv_chart_container_all">
    <div class="page-header">
      <h3>
        Average Weekly Frequency Distribution<small class="text-muted">(times/week)</small>
      </h3>
    </div>
    <div id="id_chart_wfd" class="dv_chart_container"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import DonutChart from "@/assets/js/chart/donut_chart/donut_chart.js";


export default {
  name: "ChartWeekFreqDist",
  data() {
    return {
      data: null,
      chart: null,
    };
  },
  props: {
    yearSeason: {
      type: String,
      default: null,
    },
  },
  computed: {
    pth_data() {
      return `${this.$store.state.publicPath}system/weekly_frequency_distribution/${this.yearSeason}.json`;
    },
  },
  watch: {
    pth_data() {
      this.updateChartData();
    },
  },
  methods: {
    createChart() {
      d3.json(this.pth_data).then((data) => {
        this.data = this.dataProcess(data);
        this.drawChart();
      });
    },
    dataProcess(data) {
      // index -> day
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return data.map((d) => {
          return {
            day: weekday[d.day],
            value: d.value,
          };
        });
    },
    drawChart() {
      this.chart = new DonutChart({
        selector: "#id_chart_wfd",
        svg_id: "donut_wfd",
        data: this.data,
        x_label: "day",
        y_label: "value",
      });
      this.chart.generateChart();
    },
    updateChartData() {
      d3.json(this.pth_data).then((data) => {
        // index -> day
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        data = data.map((d) => {
          return {
            day: weekday[d.day],
            value: d.value,
          };
        });
        this.data = data;
        // console.log(data)

        this.chart.updateData(data);
      });
    },
  },
  mounted() {
    this.createChart();
  },
};
</script>

<style lang="scss" scoped></style>
