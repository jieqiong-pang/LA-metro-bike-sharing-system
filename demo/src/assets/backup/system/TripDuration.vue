<template>
  <div class="dv_chart_container_all">
    <h3>Trip Duration</h3>
    <div id="id_chart_td" class="dv_chart_container"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import dayjs from "dayjs";
import TripDuration from "@/assets/js/chart/bar_chart/trip_duration.js";

export default {
  name: "TripDuration",
  data() {
    return {
      duration: null,
      chart: null,
    };
  },
  props: {
    yearSeason: {
      type: String,
      default: null,
    },
  },
  watch: {
    yearSeason() {
      this.createChart();
    },
  },
  computed: {
    pth_data() {
      return `${this.$store.state.publicPath}system/trip_duration/${this.yearSeason}.json`;
    },
  },
  watch: {
    pth_data() {
      this.updateChartData();
    },
  },
  methods: {
    createChart() {
      // import data
      d3.json(this.pth_data).then((data) => {
        this.data = data;
        console.log("trip duration:", data);
        this.drawChart();
      });
    },

    drawChart() {
      this.chart = new TripDuration({
        selector: "#id_chart_td",
        svg_id: "bar_td",
        data: this.data,
      });

      this.chart.generateChart();
    },

    updateChartData() {
      d3.json(this.pth_data).then((data) => {
        this.data = data;
        console.log("==========", data);

        this.chart.updateData(this.data);
      });
    },
  },

  mounted() {
    this.createChart();
  },
};
</script>


<style lang="scss" scoped>
#id_chart_td {
  width: 100%;
  height: 100%;
}
</style>