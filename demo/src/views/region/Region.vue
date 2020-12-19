<template>
  <div class="intro_container">
    <!-- <div class="overview_title">
      <h1>Overview</h1>
    </div> -->

    <div class="heatmap_tile">
      <Heatmap :selected_area="selected_area"></Heatmap>
    </div>

    <div class="station_d3_map_tile">
      <ChartStationGrowth @area_click="change_area"></ChartStationGrowth>
    </div>

    <div class="station_d3_map_stat_tile">
      <AreaStat :chartData="area_data" :selectedArea="selected_area"></AreaStat>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

import ChartStationGrowth from "@/views/region/ChartStationGrowth";
import Heatmap from "@/views/region/heatmap/Heatmap";
import AreaStat from "@/views/region/area/AreaStat";

export default {
  name: "Region",
  components: {
    ChartStationGrowth,
    Heatmap,
    AreaStat,
  },
  data() {
    return {
      all_area_data: null,
      selected_area: null,
    };
  },
  computed: {
    area_data() {
      if (this.selected_area !== null && this.all_area_data !== null) {
        return this.all_area_data[this.selected_area]
      }
    },
  },
  methods: {
    change_area(area_name) {
      // console.log(area_name)
      this.selected_area = area_name;
    }
  },
  mounted() {
    const pth_overview = `${this.$store.state.publicPath}overview/station_overview.json`;
    // console.log(pth_overview)
    d3.json(pth_overview)
      .then(data => {
        this.all_area_data = data;
        // console.log(data)
      })
  },
};
</script>

<style lang="scss" scoped>
// .intro_container {

// }
</style>
