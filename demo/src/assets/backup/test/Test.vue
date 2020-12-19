<template>
  <div>
    <h1 class="dv-page-h1">Test Page</h1>

    <!-- <div class="dv-test-box-xl"></div>
    <div class="dv-test-box-lg"></div>
    <div class="dv-test-box-md"></div>
    <div class="dv-test-box-sm"></div>
    <div class="dv-test-box-xs"></div> -->

    <h2>responsive test</h2>
    <b-aspect aspect="16:9" class="dv-test-box-responsive">
      <div class="dv_chart_container_all">
        <h3>title</h3>
        <div id="dv-test-chart-responsive" class="dv_chart_container"></div>
      </div>
    </b-aspect>
  </div>
</template>

<script>
import * as d3 from "d3";
// import LineChart from "@/assets/js/chart/line_chart/line_chart.js";
import DonutChart from "@/assets/js/chart/donut_chart/donut_chart.js";

export default {
  name: "Test",
  data() {
    return {
      pth_data: `${this.$store.state.publicPath}system/weekly_frequency_distribution/${this.$store.state.year_season}.json`,
      data: null,
      chart: new Object(),
    };
  },
  watch: {
    "$store.state.year_season"(newYearSeason, oldYearSeason) {
      this.pth_data = `${this.$store.state.publicPath}system/weekly_frequency_distribution/${newYearSeason}.json`;
      d3.json(this.pth_data).then((data) => {
        console.log(data);
        this.data = data;

        this.chart.updateData(data);
      });
    },
  },
  methods: {
    createChart() {
      d3.json(this.pth_data).then((data) => {
        console.log(data);
        this.data = data;

        this.drawChart("#dv-test-chart-responsive");
        // this.drawChart(".dv-test-box-xl");
        // this.drawChart(".dv-test-box-lg");
        // this.drawChart(".dv-test-box-md");
        // this.drawChart(".dv-test-box-sm");
        // this.drawChart(".dv-test-box-xs");
      });
    },
    drawChart(id) {
      this.chart = new DonutChart({
        selector: id,
        svg_id: `svg_${id.slice(1)}`,
        data: this.data,
        x_label: "day",
        y_label: "value",
      });
      this.chart.generateChart();
    },
  },
  created() {
    this.yearSeason = this.$store.state.year_season;
  },
  mounted() {
    this.createChart();
  },
};
</script>

<style lang="scss" scoped>
</style>
