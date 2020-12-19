<template>
  <div>
    <b-form-select
      v-model="selected"
      :options="options"
      class="nav_form_selection"
    ></b-form-select>
  </div>
</template>

<script>
export default {
  name: "NavbarFormSelect",
  data() {
    return {
      options: [
        { value: "2020-q2", text: "2020 Q2" },
        { value: "2020-q1", text: "2020 Q1" },
        { value: "2019-q4", text: "2019 Q4" },
        { value: "2019-q3", text: "2019 Q3" },
        { value: "2019-q2", text: "2019 Q2" },
        { value: "2019-q1", text: "2019 Q1" },
        { value: "2018-q4", text: "2018 Q4" },
        { value: "2018-q3", text: "2018 Q3" },
        { value: "2018-q2", text: "2018 Q2" },
        { value: "2018-q1", text: "2018 Q1" },
        { value: "2017-q4", text: "2017 Q4" },
        { value: "2017-q3", text: "2017 Q3" },
        { value: "2017-q2", text: "2017 Q2" },
        { value: "2017-q1", text: "2017 Q1" },
        { value: "2016-q4", text: "2016 Q4" },
        { value: "2016-q3", text: "2016 Q3" },
      ],
    };
  },
  computed: {
    selected: {
      get() {
        return this.$store.state.year_season;
      },
      set(value) {
        this.$store.commit("updateSeason", value);
        if (this.$route.name === "Station") {
          console.log("dispatch dataset. in coumpute");
          this.$store.dispatch("loadDataset", value);
        }
      },
    },
  },
  // mounted() {
  //   console.log('dispatch dataset. in mounted')
  //   this.$store.dispatch('loadDataset', this.selected);
  // },
  // watch: {
  //   selected: function(new_selected) {
  //       this.$store.dispatch('updateDataset', new_selected);
  //   }
  // },
  // mounted: function() {
  //   console.log('mounted');

  //   if (!this.$store.state.vueChartData) {
  //     d3.json('covid-19-confirmed-083120.json').then(data => {
  //       this.chartData = data;
  //       console.log('chartData set from file');
  //       console.log('chartData contains', this.chartData.length, 'rows');
  //       this.$store.commit('vueChartData', this.chartData);

  //       this.barChart();
  //       });
  //   } else {
  //     this.chartData = this.$store.state.vueChartData;
  //     console.log('chartData set from store');
  //     console.log('chartData contains', this.chartData.length, 'rows');
  //     this.barChart();
  //   }
  // }
};
</script>

<style lang="scss" scoped>
// .nav_form_selection {
//   color: black;
//   background-color: rgb(199, 199, 199);
//   // box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
// }
</style>
