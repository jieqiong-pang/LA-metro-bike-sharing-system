<template>
  <div class="dv_chart_container_all">
    <div class="chart_title">
      Related Station Travel Times <small>(times)</small>
    </div>

    <div v-if="chartData === null">
      <p>Please Select a Station.</p>
    </div>

    <div v-else>
      <b-button size="sm" variant="outline-primary" @click="display_departure"
        >Departure</b-button
      >
      <b-button size="sm" variant="outline-primary" @click="display_return"
        >Return</b-button
      >
    </div>

    <div
      id="dv_station_chart_inout"
      class="dv_chart_container"
      @dblclick="select_station"
    ></div>
  </div>
</template>

<script>
import * as d3 from "d3";

import DonutChart from "@/assets/js/chart/donut_chart/donut_chart.js";

export default {
  name: "InOutDonut",
  data() {
    return {
      chart: null,
      first_load: true,
      direction: "departure",
      display_data_length: 0,
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
      let data_directed = null;
      if (this.direction === "departure") {
        data_directed = this.chartData["times_departure"];
      } else if (this.direction === "return") {
        data_directed = this.chartData["times_return"];
      } else {
        return null;
      }

      function makeOthers(data) {
        const sorted_data = data
          .slice(0)
          .sort((a, b) => d3.descending(a.times, b.times));
        // console.log(sorted_data);
        if (sorted_data.length > 10) {
          const num_others = d3.sum(sorted_data.slice(9).map((d) => d.times));
          const data_others = sorted_data.slice(0, 9);
          data_others.push({ station_id: "others", times: num_others });
          data_others.sort((a, b) => d3.ascending(a.station_id, b.station_id));
          // console.log(data_others);
          return data_others;
        }
        return data;
      }

      return makeOthers(data_directed);

      // return data_directed;
    },
    createChart() {
      if (this.chartData === null) {
        return null;
      } else {
        this.updateChartByData();
      }
    },
    updateChartByData() {
      // console.log(this.chartData);
      const processed_data = this.dataProcess();
      this.display_data_length = processed_data.length;
      // console.log(processed_data);

      if (this.first_load === true) {
        this.chart = new DonutChart({
          selector: "#dv_station_chart_inout",
          svg_id: "svg_dv_station_chart_inout",
          data: processed_data,
          x_label: "station_id",
          y_label: "times",
        });
        this.chart.generateChart();
        this.first_load = false;
      } else {
        this.chart.updateData(processed_data);
      }
    },
    display_departure() {
      this.direction = "departure";
      this.updateChartByData();
    },
    display_return() {
      this.direction = "return";
      this.updateChartByData();
    },
    select_station(e) {
      // get target station id
      if (e.target.__data__ === undefined) {
        return null;
      }
      
      const selected_station_id = e.target.__data__.data.station_id; // integer or "others"
      if (selected_station_id === "others") {
        return null;
      }

      // find the index of the target station
      const stt_idx = this.$store.state.stations.findIndex(
        (stt) => stt.station === String(selected_station_id)
      );
      // console.log(stt_idx)
      // change selected station
      this.$store.commit("updateSelectedStation", stt_idx);
    },
  },
  mounted() {
    this.createChart();
  },
};
</script>

<style lang="sass" scoped></style>
