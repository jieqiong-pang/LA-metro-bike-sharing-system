<template>
  <div>
    <b-form-select
      class="station-form-select"
      v-model="selected"
      :options="options"
    ></b-form-select>
  </div>
</template>

<script>
export default {
  name: "StationFormSelect",
  data() {
    return {
      // selected: null,
      options: null,
    };
  },
  computed: {
    selected: {
      get() {
        // init value is null
        return this.$store.state.selected_station;
      },
      set(value) {
        this.$store.commit("updateSelectedStation", value);
      },
    },
  },
  watch: {
    "$store.state.stations"(newDataset, oldDataset) {
      console.log("store.state.stations change");
      this.setOptions(newDataset);
    },
  },
  methods: {
    setOptions(station_raw_data) {
      if (station_raw_data === null) {
        console.log("no station data");
        return null;
      }
      this.options = station_raw_data.map((d, i) => {
        return {
          value: i,
          text: `${d.region}: ${d.station_name} (${d.station})`,
        };
      });
      this.options.unshift({
        value: null,
        text: "Please select a station",
      });
    },
  },
  mounted() {
    if (this.$store.state.stations === null) {
      this.$store.dispatch("loadStation").then(() => {
        // get the data after store
        this.setOptions(this.$store.state.stations);
      });
    } else {
      this.setOptions(this.$store.state.stations);
    }
  },
};
</script>

<style lang="scss" scoped>
.station-form-select {
  // position: absolute;
  width: 100%;
  // background-color: antiquewhite;
}
</style>
