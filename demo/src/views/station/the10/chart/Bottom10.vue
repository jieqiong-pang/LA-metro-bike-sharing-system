<template>
  <div class="dv_chart_container_all">
    <div class="chart_title">
      Least Popular Stations<small> (counts)</small>
    </div>
    <div class="commands" style="float: right">
      <b>Sort By: </b>
      <b-button
        variant="outline-primary"
        class="sort"
        id="alphabetic2"
        size="sm"
        @click="sort_by_station_id"
      >
        Station ID <BIconArrowUp></BIconArrowUp>
      </b-button>
      <b-button
        variant="outline-primary"
        class="sort"
        id="descending2"
        size="sm"
        @click="sort_by_pop_down"
      >
        Popularity <BIconArrowDown></BIconArrowDown>
      </b-button>
    </div>
    <div
      id="b10_id_chart_b10"
      class="dv_chart_container"
      @dblclick="select_station"
    ></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import BarChart from "@/assets/js/chart/bar_chart/bar_chart.js";
import { BIcon, BIconArrowUp, BIconArrowDown } from "bootstrap-vue";

export default {
  name: "bottom10",
  components: {
    BIcon,
    BIconArrowUp,
    BIconArrowDown,
  },
  data() {
    return {
      data: null,
      chart: null,
      sort_by: "station_id",
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
      return `${this.$store.state.publicPath}station/bottom_10/${this.yearSeason}.json`;
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
      return data
        .slice(0)
        .sort(function(a, b) {
          return d3.ascending(a.name, b.name);
        })
        .map((d) => {
          return {
            name: d.name,
            value: d.value,
            station: `STATION: ${d.station} (${d.value} times)`,
          };
        });
    },

    drawChart() {
      this.chart = new BarChart({
        selector: "#b10_id_chart_b10",
        svg_id: "b10_bar_b10",
        data: this.data,
        x_label: "name",
        y_label: "value",
        label: "station",
        x_axis_ticks: this.data.slice(0).map((d) => d.name),
        y_axis_ticks_num: 5,
      });
      this.chart.generateChart();
    },

    updateChartData() {
      d3.json(this.pth_data).then((data) => {
        this.data = this.dataProcess(data);
        this.chart.x_axis_ticks = this.data.slice(0).map((d) => d.name);

        if (this.sort_by === "station_id") {
          this.sort_by_station_id();
        } else if (this.sort_by === "pop_down") {
          this.sort_by_pop_down();
        } else {
          this.sort_by_station_id();
        }
      });
    },

    sort_by_station_id() {
      this.data = this.data.slice(0).sort(function(a, b) {
        return d3.ascending(a.name, b.name);
      });
      this.sort_by = "station_id";
      this.chart.updateData(this.data);
    },

    sort_by_pop_down() {
      this.data = this.data.slice(0).sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });
      this.sort_by = "pop_down";
      this.chart.updateData(this.data);
    },
    select_station(e) {
      // get target station id
      if (e.target.__data__ === undefined) {
        return null;
      }

      const selected_station_id = e.target.__data__.name; // string
      // console.log(selected_station_id);

      // find the index of the target station
      const stt_idx = this.$store.state.stations.findIndex(
        (stt) => stt.station === String(selected_station_id)
      );
      // console.log(stt_idx)
      // change selected station
      if (stt_idx >= 0) {
        this.$store.commit("updateSelectedStation", stt_idx);
      }
    },
  },
  mounted() {
    this.createChart();
  },
};
</script>

<style lang="sass" scoped></style>
