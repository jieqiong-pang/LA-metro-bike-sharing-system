<template>
  <div class="dv_chart_container_all">
    <h3>Top 10 Popular Stations</h3>
    <div class="commands" style="float: right">
      <b>Sort By:</b>
      <b-button
        variant="outline-primary"
        class="sort"
        id="alphabetic"
        @click="sort_by_station_id"
      >
        station id <BIconArrowUp></BIconArrowUp>
      </b-button>
      <b-button
        variant="outline-primary"
        class="sort"
        id="ascending"
        @click="sort_by_pop_up"
      >
        popularity <BIconArrowUp></BIconArrowUp>
      </b-button>
      <b-button
        variant="outline-primary"
        class="sort"
        id="descending"
        @click="sort_by_pop_down"
      >
        popularity <BIconArrowDown></BIconArrowDown>
      </b-button>
    </div>
    <div id="t10_id_chart_t10" class="dv_chart_container"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import BarChart from "@/assets/js/chart/bar_chart/bar_chart.js";
import dayjs from "dayjs";
import { BIcon, BIconArrowUp, BIconArrowDown } from "bootstrap-vue";

export default {
  name: "top10",
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
      return `${this.$store.state.publicPath}system/top_10/${this.yearSeason}.json`;
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
        .sort(function (a, b) {
          return d3.ascending(a.name, b.name);
        })
        .map((d) => {
          return {
            name: d.name,
            value: d.value,
            station: `${d.station} (${d.value})`,
          };
        });
    },
    drawChart() {
      console.log(this.data);
      this.chart = new BarChart({
        selector: "#t10_id_chart_t10",
        svg_id: "t10_bar_t10",
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
        console.log(this.sort_by);
        if (this.sort_by === "station_id") {
          this.sort_by_station_id();
        } else if (this.sort_by === "pop_up") {
          this.sort_by_pop_up();
        } else if (this.sort_by === "pop_down") {
          this.sort_by_pop_down();
        } else {
          this.sort_by_station_id();
        }
      });
    },
    sort_by_station_id() {
      this.data = this.data.slice(0).sort(function (a, b) {
        return d3.ascending(a.name, b.name);
      });
      this.sort_by = "station_id";
      this.chart.updateData(this.data);
    },
    sort_by_pop_up() {
      this.data = this.data.slice(0).sort(function (a, b) {
        return d3.ascending(a.value, b.value);
      });
      this.sort_by = "pop_up";
      this.chart.updateData(this.data);
    },
    sort_by_pop_down() {
      this.data = this.data.slice(0).sort(function (a, b) {
        return d3.descending(a.value, b.value);
      });
      this.sort_by = "pop_down";
      this.chart.updateData(this.data);
    },
  },
  mounted() {
    this.createChart();
  },
};
</script>