<template>
  <div class="dv_station_page">
    <div class="dv_station_container">
      <div class="dv_station_title_section">
        <div class="dv_station_title_text">STATION ANALYSIS</div>
      </div>

      <div class="dv_station_10_section">
        <The10></The10>
      </div>

      <div class="dv_station_station_selection_section">
        <div class="dv_station_station_name">
          <div>station name</div>
        </div>
        <div class="dv_station_station_dropdown">
          <StationFormSelect></StationFormSelect>
        </div>
      </div>

      <div class="dv_station_map_section">
        <StationMap></StationMap>
      </div>

      <div class="dv_station_chosen_section">
        <Chosen></Chosen>
      </div>
    </div>
  </div>
</template>

<script>
import The10 from "@/views/station/the10/The10.vue";
import StationFormSelect from "@/views/station/StationFormSelect";
import StationMap from "@/views/station/map/StationMap";
import Chosen from "@/views/station/chosen/Chosen";

export default {
  name: "Station",
  data() {
    return {};
  },
  components: {
    The10,
    StationMap,
    StationFormSelect,
    Chosen,
  },
};
</script>

<style lang="scss" scoped>
</style>
