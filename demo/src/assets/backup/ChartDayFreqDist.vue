<template>
  <div>
    <h3>Daily Frequency Distribution</h3>
    <svg id="id_chart_dfd"></svg>
  </div>
</template>

<script>
// var FileSaver = require('file-saver');
import * as d3 from "d3";
import dayjs from "dayjs";

const MIN_PER_DAY = 60 * 24;

export default {
  name: "ChartDayFreqDist",
  data() {
    return {
      // publicPath: process.env.BASE_URL,
      // chartData: null,
      stat: null,
    };
  },
  props: {
    yearSeason: {
      type: String,
      default: null,
    },
    aspectRatio: {
      // avg_height / avg_width
      type: Number,
      default: 3 / 4,
    },
  },
  watch: {
    yearSeason() {
      this.createChart();
    },
  },
  methods: {
    createChart() {
      // data process
      // this.dataProcess();
      const pth_data = `${this.$store.state.publicPath}system/daily_frequency_distribution/${this.yearSeason}.json`;
      // console.log(pth_data)
      d3.json(pth_data).then((data) => {
        this.stat = data;
        // console.log(data)

        // draw svg
        this.clearChart();
        this.drawChart();
      });
    },
    resize() {
      this.clearChart();
      this.drawChart();
    },
    dataProcess() {
      const data = this.chartData;

      let stat = new Array(24).fill(0);
      // console.log(stat)
      data.forEach((x) => {
        let start_hour = x.start_time.getHours();
        let end_hour = x.end_time.getHours();
        let duration_days = Math.floor(x.duration / MIN_PER_DAY);

        if (start_hour <= end_hour) {
          // same date
          for (let i = start_hour; i <= end_hour; i++) {
            stat[i] = stat[i] + 1;
          }
        } else {
          // different date
          for (let i = start_hour; i <= 23; i++) {
            stat[i] = stat[i] + 1;
          }
          for (let i = 0; i <= end_hour; i++) {
            stat[i] = stat[i] + 1;
          }
        }

        // consider maybe more than 24h
        for (let i in stat) {
          stat[i] = stat[i] + duration_days;
        }
      });
      // console.log(stat)

      // how many days
      let min_date = dayjs(d3.min(data, (d) => d.start_time));
      let max_date = dayjs(d3.max(data, (d) => d.end_time));
      let days = max_date.diff(min_date, "day");
      // console.log(days)
      for (let i in stat) {
        stat[i] = stat[i] / days;
      }
      console.log(stat);
      this.stat = stat;

      // // save
      // let save = [];
      // stat.map((x, i) => {
      //   save.push({
      //     hour: i,
      //     value: x
      //   })
      // })
      // console.log(save)
      // var content = JSON.stringify(save);
      // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, `${this.$store.state.year_season}.json`);
    },
    clearChart() {
      // clear the svg img in div id=dfd when get new data.
      d3.select("#id_chart_dfd > *").remove();
    },
    drawChart() {
      const stat = this.stat;

      // draw svg
      let svg = d3.select("#id_chart_dfd");

      const svg_w = parseInt(svg.style("width"));
      const svg_h = +this.aspectRatio * 1.5 * svg_w;
      svg.style("height", svg_h);

      // TODO: make margin as props -> dynamic
      const margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        width = +svg_w - margin.left - margin.right,
        height = +svg_h - margin.top - margin.bottom,
        g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

      // let hours_points = new Array();
      // for (let i = 0; i < stat.length; i++) {
      //   hours_points.push(String(i));
      // }
      // console.log(hours_points)
      let x = d3
        .scalePoint()
        .domain(stat.map((x) => x.hour))
        .range([0, width]);
      // console.log(x(10))

      let y = d3
        .scaleLinear()
        .domain([0, d3.max(stat, (x) => x.value)])
        .nice()
        .range([height, 0]);

      let xAxis = d3.axisBottom().scale(x);

      let yAxis = d3.axisLeft().scale(y);

      let stat_pair = new Array();
      for (let i = 0; i < stat.length; i++) {
        stat_pair.push([stat[i].hour, stat[i].value]);
      }
      // console.log(stat_pair)
      let line = d3
        .line()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      g.append("g").call(yAxis);

      g.append("path")
        .datum(stat_pair)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    },
  },
  mounted() {
    this.createChart();
    d3.select(window).on("resize.dfd", this.resize);
    // === window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    d3.select(window).on("resize.dfd", null);
    // === window.removeEventListener('resize', this.resize);
  },
};
</script>

<style lang="scss" scoped>
#id_chart_dfd {
  width: 100%;
  // height: 100%;
}
</style>
