<template>
  <div class="intro_container">
    <!-- <h1 class="dv-page-h1">Introduction</h1> -->

    <div class="heatmap_tile">heatmap</div>

    <div class="station_d3_map_tile">
      <ChartStationGrowth></ChartStationGrowth>
    </div>

    <div class="station_d3_map_stat_tile">
      stat
    </div>
  </div>
</template>

<script>
import ChartStationGrowth from "@/views/intro/ChartStationGrowth";

export default {
  name: "Intro",
  data() {
    return {};
  },
  components: {
    ChartStationGrowth,
  },
};
</script>

<style lang="scss" scoped>
// .intro_container {

// }
</style>
