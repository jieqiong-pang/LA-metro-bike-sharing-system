<template>
  <div class="map-container">

    <div class="map_info_sidebar">
      <div class="sidebar_select_station">
        <div>Select Station</div>
        <StationFormSelect />
      </div>
      
      <div>infomation</div>
    </div>

    <div class="map_tile">
      <StationMap />
    </div>

  </div>
</template>

<script>
import StationMap from "@/views/station/StationMap"
import StationFormSelect from "@/views/station/StationFormSelect"

export default {
  name: 'Station',
  data() {
    return {
    }
  },
  components: {
    StationMap,
    StationFormSelect
  }
}
</script>

<style lang="scss" scoped>
  .map-container {
    display: grid;
    // background-color: rgb(182, 182, 182);
    grid-template-columns: 300px 1fr;
    grid-template-rows: 1fr;

    .map_info_sidebar {
      // border: 1px solid black;
      grid-column: 1/2;
      background-color: $light;
      padding-left: 10px;
      padding-right: 10px;

      .sidebar_select_station {
        height: 100px;
        margin-top: 10px;
      }
    }

    .map_tile {
      grid-column: 2/3;
      box-shadow: -1px 0px 4px 1px rgb(192, 192, 192);
    }
  }
</style>