<template>
  <div class="dv_station_the10_total">
    <div class="dv_station_top10_tile">
      <Top10 :yearSeason="$store.state.year_season"></Top10>
    </div>

    <div class="dv_station_bottom10_tile">
      <Bottom10 :yearSeason="$store.state.year_season"></Bottom10>
    </div>
  </div>
</template>

<script>
import Top10 from "@/views/station/the10/chart/Top10";
import Bottom10 from "@/views/station/the10/chart/Bottom10";

export default {
  name: "The10",
  components: {
    Top10,
    Bottom10,
  },
};
</script>

<style lang="sass" scoped>
</style>



