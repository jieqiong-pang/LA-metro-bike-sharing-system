<template>
  <!-- <div class="chart_title">
    Number Stat
  </div> -->
  <div class="dv_station_chosen_total_stats">
    <div class="dv_station_chosen_total_stats_cnt">
      <div class="dv_station_chosen_total_stats_cnt_header">
        <div class="dv_station_chosen_total_stats_cnt_header_icon">
          <img
            src="@/assets/img/number-grey.svg"
            class="image"
            alt="num icon"
            width="20"
            height="20"
          />
        </div>
        <div class="dv_station_chosen_total_stats_cnt_header_title">
          Total Trip Counts
        </div>
      </div>
      <div class="dv_station_chosen_total_stats_cnt_body">
        <div class="dv_station_chosen_total_stats_cnt_body_out">
          <div class="dv_station_chosen_total_stats_cnt_body_out_icon">
            <img
              src="@/assets/img/out.svg"
              class="image"
              alt="out icon"
              height="20"
            />
          </div>
          <div class="dv_station_chosen_total_stats_cnt_body_out_num">
            {{ chartData["out_times"] }}
          </div>
          <div class="dv_station_chosen_total_stats_cnt_body_out_note">
            Departure Count
          </div>
        </div>
        <div class="dv_station_chosen_total_stats_cnt_body_in">
          <div class="dv_station_chosen_total_stats_cnt_body_in_icon">
            <img
              src="@/assets/img/in.svg"
              class="image"
              alt="in icon"
              height="20"
            />
          </div>
          <div class="dv_station_chosen_total_stats_cnt_body_in_num">
            {{ chartData["in_times"] }}
          </div>
          <div class="dv_station_chosen_total_stats_cnt_body_in_note">
            Return Count
          </div>
        </div>
      </div>
    </div>
    <div class="dv_station_chosen_total_stats_dur">
      <div class="dv_station_chosen_total_stats_dur_header">
        <div class="dv_station_chosen_total_stats_dur_header_icon">
          <img
            src="@/assets/img/duration-grey.svg"
            class="image"
            alt="dur icon"
            width="20"
            height="20"
          />
        </div>
        <div class="dv_station_chosen_total_stats_dur_header_title">
          Total Trip Duration
        </div>
      </div>
      <div class="dv_station_chosen_total_stats_dur_body">
        <div class="dv_station_chosen_total_stats_dur_body_out">
          <div class="dv_station_chosen_total_stats_dur_body_out_icon">
            <img
              src="@/assets/img/out.svg"
              class="image"
              alt="out icon"
              height="20"
            />
          </div>
          <div class="dv_station_chosen_total_stats_dur_body_out_num">
            {{ chartData["out_min"] }}
          </div>
          <div class="dv_station_chosen_total_stats_dur_body_out_note">
            Departure Duration (min)
          </div>
        </div>
        <div class="dv_station_chosen_total_stats_dur_body_in">
          <div class="dv_station_chosen_total_stats_dur_body_in_icon">
            <img
              src="@/assets/img/in.svg"
              class="image"
              alt="in icon"
              height="20"
            />
          </div>
          <div class="dv_station_chosen_total_stats_dur_body_in_num">
            {{ chartData["in_min"] }}
          </div>
          <div class="dv_station_chosen_total_stats_dur_body_in_note">
            Return Duration (min)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NumStat",
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          in_min: 0,
          out_min: 0,
          in_times: 0,
          out_times: 0,
        };
      },
    },
  },
};
</script>

<style lang="sass" scoped></style>
