<template>
  <div class="dv_station_chosen_total">
    <div class="dv_station_num_section">
      <NumStat :chartData="num_stat_data"></NumStat>
    </div>

    <!-- <div class="fig"><img src="/Users/shengjiawu/Desktop/out.png"></img></div>   
        <div class="fig"><img src="/Users/shengjiawu/Desktop/in.png"></img></div> -->

    <div class="dv_station_donut_section">
      <InOutDonut :chartData="in_out_donut_data"></InOutDonut>
    </div>

    <div class="dv_station_line_section">
      <Busy24 :chartData="busy_24_data"></Busy24>
    </div>

    <div class="dv_station_bar_section">
      <DurationDist :chartData="duration_dist_data"></DurationDist>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

import NumStat from "@/views/station/chosen/chart/NumStat";
import InOutDonut from "@/views/station/chosen/chart/InOutDonut";
import Busy24 from "@/views/station/chosen/chart/Busy24";
import DurationDist from "@/views/station/chosen/chart/DurationDist";

export default {
  name: "Chosen",
  components: {
    NumStat,
    InOutDonut,
    Busy24,
    DurationDist,
  },
  data() {
    return {
      pth_quarter: `${this.$store.state.publicPath}station/${this.$store.state.year_season}.json`,
      data: null,
      selected_station: null,
      station_data: null
    };
  },
  computed: {
    num_stat_data() {
      if (this.station_data) {
        const related_stt = this.station_data.properties.related_station;
        // console.log(related_stt)

        const sum_data = {
          in_min: 0,
          out_min: 0,
          in_times: 0,
          out_times: 0,
        }
        for (let k in related_stt) {
          const x = related_stt[k]
          sum_data.in_min += x.in_min_sum;
          sum_data.out_min += x.out_min_sum;
          sum_data.in_times += x.in_times;
          sum_data.out_times += x.out_times;
        }
        
        // console.log(sum_data)
        return sum_data
      }
    },
    in_out_donut_data() {
      if (this.station_data) {
        return {
          times_departure: this.station_data.properties.times_departure,
          times_return: this.station_data.properties.times_return
        }
      } else {
        return null;
      }
    },
    busy_24_data() {
      if (this.station_data) {
        return this.station_data.properties.busy24;
      } else {
        return null;
      }
    },
    duration_dist_data() {
      if (this.station_data) {
        return this.station_data.properties.trip_duration_distribution;
      } else {
        return null;
      }
    }
  },
  watch: {
    "$store.state.year_season"(newQuarter, OldQuarter) {
      this.pth_quarter = `${this.$store.state.publicPath}station/${this.$store.state.year_season}.json`;
      this.loadQuarterChartData();
    },
    "$store.state.selected_station"(newId, OldId) {
      this.selected_station = newId;
      this.changeStationSelection();
    },
  },
  methods: {
    loadQuarterChartData() {
      d3.json(this.pth_quarter).then((data) => {
        // data -> quarter chart data
        this.data = data;

        if (this.selected_station !== null) {
          this.changeStationSelection()
        }
      });
    },
    changeStationSelection() {
      if (!this.data) {
        console.log('Quarter Data: Unloaded.');
        return null
      }
      this.station_data = this.data.features[this.selected_station]
      console.log(this.station_data)
    }
  },
  mounted() {
    this.loadQuarterChartData();
  },
};
</script>

<style lang="sass" scoped></style>
