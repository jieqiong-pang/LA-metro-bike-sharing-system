<template>
  <b-container class="sys_container dv-container-shadow">
    <h1 class="dv-page-h1">Systematic Dashboard</h1>
    <b-row>
      <b-col cols="12" class="sys-cols">
        <ChartDayFreqDist
          class="chart-dfd"
          :yearSeason="yearSeason"
          :aspectRatio="0.3"
        ></ChartDayFreqDist>
      </b-col>
      <b-col cols="12" class="sys-cols">
        <b-aspect aspect="16:9">
          <ChartWeekFreqDist
            class="chart-wfd"
            :yearSeason="yearSeason"
          ></ChartWeekFreqDist>
        </b-aspect>
      </b-col>
      <b-col cols="12" class="sys-cols">
        <b-aspect aspect="16:9">
          <Top10
            class="chart-t10"
            :yearSeason="yearSeason"
            :aspectRatio="0.3"
          ></Top10>
        </b-aspect>
      </b-col>
      <b-col cols="12" class="sys-cols">
        <b-aspect aspect="16:9">
          <Bottom10 class="chart-b10" :yearSeason="yearSeason"></Bottom10>
        </b-aspect>
      </b-col>
      <b-col cols="12" class="sys-cols">
        <b-aspect aspect="16:9">
          <TripDuration
            class="chart-td"
            :yearSeason="yearSeason"
          ></TripDuration>
        </b-aspect>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ChartDayFreqDist from "@/views/system/ChartDayFreqDist";
import ChartWeekFreqDist from "@/views/system/ChartWeekFreqDist";
import Top10 from "@/views/system/Top10";
import Bottom10 from "@/views/system/Bottom10";
import TripDuration from "@/views/system/TripDuration";

export default {
  name: "System",
  data() {
    return {
      yearSeason: null,
    };
  },
  components: {
    ChartDayFreqDist,
    ChartWeekFreqDist,
    Top10,
    Bottom10,
    TripDuration,
  },
  computed: {
    yearSeasonChange() {
      return this.$store.state.year_season;
    },
  },
  watch: {
    yearSeasonChange(newYearSeason, oldYearSeason) {
      this.yearSeason = newYearSeason;
    },
  },
  created() {
    this.yearSeason = this.$store.state.year_season;
  },
};
</script>

<style lang="scss" scoped></style>
