<template>
  <div>
    <div class="page-header">
      <h3>
        Average Weekly Frequency Distribution
        <small class="text-muted">(times/week)</small>
      </h3>
    </div>

    <svg id="id_chart_wfd"></svg>
  </div>
</template>

<script>
// var FileSaver = require('file-saver');
import * as d3 from "d3";
import dayjs from "dayjs";

const DAY_PER_WEEK = 7;
const breack_point = 576;

export default {
  name: "ChartWeekFreqDist",
  data() {
    return {
      // publicPath: process.env.BASE_URL,
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
      // this.createChart();
      this.changeYearSeason();
    },
  },
  methods: {
    createChart() {
      // data process
      // this.dataProcess();
      const pth_data = `${this.$store.state.publicPath}system/weekly_frequency_distribution/${this.yearSeason}.json`;
      // console.log(pth_data);
      d3.json(pth_data).then((data) => {
        this.stat = data;
        // console.log(data)

        // draw svg
        // this.clearChart();
        this.drawChart();

        this.resize();
      });
    },
    dataProcess() {
      const data = this.chartData;

      let stat = new Array(7).fill(0);
      // console.log(stat)
      data.forEach((x) => {
        const start_day = x.start_time.getDay(); // [0, 6] 6 is Sat., 0 is Sun
        stat[start_day]++;
      });
      // console.log(stat)

      // compute # of weeks, eg: 31 days -> 31/7 = 4.429 weeks
      let min_date = dayjs(d3.min(data, (d) => d.start_time));
      let max_date = dayjs(d3.max(data, (d) => d.start_time));
      let quarter_weeks = max_date.diff(min_date, "day") / DAY_PER_WEEK;

      stat.forEach((x, i) => (stat[i] = x / quarter_weeks));
      // console.log(stat);
      this.stat = stat;

      // // save
      // let save = [];
      // stat.map((x, i) => {
      //   save.push({
      //     day: i,
      //     value: x
      //   })
      // })
      // console.log(save)
      // var content = JSON.stringify(save);
      // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, `${this.$store.state.year_season}.json`);
    },
    clearChart() {
      // clear the svg img in div id=id_chart_wfd when get new data.
      d3.select("#id_chart_wfd > *").remove();
    },
    drawChart() {
      const stat = this.stat;
      let svg = d3.select("#id_chart_wfd");

      // compute sum of values
      const sum_value = d3.sum(stat.map((d) => d.value));

      // index -> day
      const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const data = stat.map((d) => {
        return {
          day: weekday[d.day],
          value: d.value,
        };
      });

      const svg_w = parseInt(svg.style("width"));
      const svg_h = +this.aspectRatio * svg_w;
      // console.log(svg_w, svg_h)
      svg.style("height", svg_h);
      const margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        width = +svg_w - margin.left - margin.right,
        height = +svg_h - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2,
        draw_area = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          ),
        g = draw_area
          .append("g")
          .attr("class", "pie_group")
          .attr("transform", `translate(${width / 2},${height / 2})`);

      // tire
      g.append("image")
        .attr("class", "pie_tire")
        .attr("x", -radius * 0.15 * 2)
        .attr("y", -radius * 0.15 * 2)
        .attr("width", radius * 0.3 * 2)
        .attr("height", radius * 0.3 * 2)
        .attr("xlink:href", `${require("@/assets/img/tire.svg")}`);

      // const color = d3.scaleSequential([8, 0], d3.interpolateBrBG);
      const color = d3.scaleOrdinal().domain(weekday).range(d3.schemeBrBG[7]);
      // console.log(color("Sun"));

      const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      const path = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

      const arc = g
        .selectAll(".arc")
        .data(pie(data), (d) => d.data.day)
        .enter()
        .append("g")
        .attr("class", "arc");
      // console.log(pie(data));

      // shape
      arc
        .append("path")
        .attr("d", path)
        .attr("class", "pie-shape")
        .attr("fill", (d) => color(d.data.day))
        .property("selected", false);

      // compute mid angle
      function midAngle(d) {
        return (d.startAngle + d.endAngle) / 2;
      }

      // pointer line and label
      const edgeArc = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.8);
      const outerArc = d3
        .arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      const polyline = arc.append("polyline").attr("class", "pointer_polyline");

      polyline.attr("points", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [edgeArc.centroid(d), outerArc.centroid(d), pos];
      });

      arc.select(".pie-shape").raise();

      const arc_text = arc.append("text").attr("class", "pie-text");

      arc_text
        .style("alignment-baseline", "middle")
        .text((d) => {
          const day = d.data.day;
          const value = d.value;
          const portion = (value / sum_value) * 100;
          return `${day}: ${d3.format(".1f")(value)} (${d3.format(".1f")(
            portion
          )}\%)`;
        })
        .attr("transform", (d) => {
          let pos = outerArc.centroid(d);
          pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"));

      // animation
      arc.on("click", function () {
        const pa = d3.select(this).select(".pie-shape");
        // const te = d3.select(this).select(".pie-text");
        // const ply = d3.select(this).select(".pointer_polyline");

        if (pa.property("selected")) {
          pa.attr("transform", "translate(0,0)").property("selected", false);
          // d3.select(this).lower();
        } else {
          pa.attr("transform", (d) => {
            return `translate(${path.centroid(d).map((x) => x * 0.1)})`;
          }).property("selected", true);
          d3.select(this).raise();
        }
      });

      arc
        .on("mouseenter", function () {
          const pa = d3.select(this).select(".pie-shape");
          const te = d3.select(this).select(".pie-text");
          const ply = d3.select(this).select(".pointer_polyline");

          pa.style("stroke-width", 3)
            .style("stroke", "black")
            .style("stroke-opacity", 0.6);
          ply.style("opacity", 0.6).style("stroke-width", 3);
          te.style("font-size", "1.2em");

          d3.select(this).raise();
        })
        .on("mouseout", function () {
          const pa = d3.select(this).select(".pie-shape");
          const te = d3.select(this).select("text");
          const ply = d3.select(this).select(".pointer_polyline");

          pa.style("stroke-width", 0);
          ply.style("opacity", 0.3).style("stroke-width", 2);
          te.style("font-size", "1em");

          d3.select(this).lower();
        });

      this.resize();
    },
    changeYearSeason() {
      const pth_data = `${this.$store.state.publicPath}system/weekly_frequency_distribution/${this.yearSeason}.json`;
      d3.json(pth_data).then((data) => {
        this.stat = data;
        this.changeData();
      });
    },
    changeData() {
      const stat = this.stat;
      const svg = d3.select("#id_chart_wfd");
      const ani_delay = 0;
      const ani_duration = 1000;

      // compute sum of values
      const sum_value = d3.sum(stat.map((d) => d.value));

      // index -> day
      const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const data = stat.map((d) => {
        return {
          day: weekday[d.day],
          value: d.value,
        };
      });

      const svg_w = parseInt(svg.style("width"));
      const svg_h = parseInt(svg.style("height"));
      svg.style("height", svg_h);

      let margin = new Object();
      if (window.innerWidth >= breack_point) {
        margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        };
      } else {
        margin = {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
        };
      }

      const width = +svg_w - margin.left - margin.right,
        height = +svg_h - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2,
        g = svg.select(".pie_group");
      // console.log(g)

      const color = d3.scaleOrdinal().domain(weekday).range(d3.schemeBrBG[7]);

      const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      const path = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

      // console.log(pie(data));

      const arc = g.selectAll(".arc").data(pie(data), (d) => d.data.day);

      // shape
      arc
        .select(".pie-shape")
        .transition()
        .delay(ani_delay)
        .duration(ani_duration)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            return path(interpolate(t));
          };
        })
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          if (d3.select(this).property("selected") === true) {
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
              const d2 = interpolate(t);
              const pos = path.centroid(d2).map((x) => x * 0.1);
              return `translate(${pos})`;
            };
          }
        });

      // compute mid angle
      function midAngle(d) {
        return (d.startAngle + d.endAngle) / 2;
      }

      // pointer line and label
      const edgeArc = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.8);
      const outerArc = d3
        .arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      const polyline = arc.select(".pointer_polyline");
      polyline
        .transition()
        .delay(ani_delay)
        .duration(ani_duration)
        .attrTween("points", function (d) {
          // console.log(this);
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [edgeArc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      const arc_text = arc.select(".pie-text");
      let changed_arc_text = null;
      if (window.innerWidth < breack_point) {
        changed_arc_text = arc_text
          .transition()
          .delay(ani_delay)
          .duration(ani_duration)
          .textTween((d) => {
            this._current = this._current || d;
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
              const d2 = interpolate(t);
              const day = d2.data.day;
              const value = d2.value;
              const portion = (value / sum_value) * 100;
              return `${day}: ${d3.format(".1f")(value)}`;
            };
          });
      } else {
        changed_arc_text = arc_text
          .transition()
          .delay(ani_delay)
          .duration(ani_duration)
          .textTween((d) => {
            this._current = this._current || d;
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
              const d2 = interpolate(t);
              const day = d2.data.day;
              const value = d2.value;
              const portion = (value / sum_value) * 100;
              return `${day}: ${d3.format(".1f")(value)} (${d3.format(".1f")(
                portion
              )}\%)`;
            };
          });
      }

      changed_arc_text
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });
    },
    resize() {
      const stat = this.stat;
      const svg = d3.select("#id_chart_wfd");

      // compute sum of values
      const sum_value = d3.sum(stat.map((d) => d.value));

      const svg_w = parseInt(svg.style("width"));
      const svg_h = +this.aspectRatio * 1.5 * svg_w;
      svg.style("height", svg_h);

      let margin = new Object();
      if (window.innerWidth >= breack_point) {
        margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        };
      } else {
        margin = {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
        };
      }
      // console.log(margin);
      const width = +svg_w - margin.left - margin.right,
        height = +svg_h - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2,
        draw_area = svg
          .select("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          ),
        g = svg
          .select(".pie_group")
          .attr("transform", `translate(${width / 2},${height / 2})`);
      // console.log(g)

      // tire
      g.select(".pie_tire")
        .attr("x", -radius * 0.15 * 2)
        .attr("y", -radius * 0.15 * 2)
        .attr("width", radius * 0.3 * 2)
        .attr("height", radius * 0.3 * 2);

      const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      const path = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

      const arc = g.selectAll(".arc");

      // shape
      arc.select(".pie-shape").attr("d", path);

      // compute mid angle
      function midAngle(d) {
        return (d.startAngle + d.endAngle) / 2;
      }

      // pointer line and label
      const edgeArc = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.8);
      const outerArc = d3
        .arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      const polyline = arc.select(".pointer_polyline");
      polyline.attr("points", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [edgeArc.centroid(d), outerArc.centroid(d), pos];
      });

      arc.select(".pie-shape").raise();

      const arc_text = arc.select(".pie-text");
      arc_text
        .style("alignment-baseline", "middle")
        .attr("transform", (d) => {
          let pos = outerArc.centroid(d);
          pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"));

      if (window.innerWidth < breack_point) {
        arc_text.text((d) => {
          const day = d.data.day;
          const value = d.value;
          return `${day}: ${d3.format(".1f")(value)}`;
        });
      } else {
        arc_text.text((d) => {
          const day = d.data.day;
          const value = d.value;
          const portion = (value / sum_value) * 100;
          return `${day}: ${d3.format(".1f")(value)} (${d3.format(".1f")(
            portion
          )}\%)`;
        });
      }
    },
  },
  mounted() {
    this.createChart();
    d3.select(window).on("resize.wfd", this.resize);
    // === window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    d3.select(window).on("resize.wfd", null);
    // === window.removeEventListener('resize', this.resize);
  },
};
</script>

<style lang="scss" scoped>
#id_chart_wfd {
  width: 100%;
  // height: 100%;
}
</style>
