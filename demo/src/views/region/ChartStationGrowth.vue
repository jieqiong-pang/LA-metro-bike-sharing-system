<template>
  <div id="sg_map_container">
    <svg id="id_chart_sg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";

export default {
  name: "ChartStationGrowth",
  data() {
    return {
      topo_data: null,
      geo_data: null,
      station_growth: null,
      aspect_ratio: null,
    };
  },
  props: {
    viewPort: {
      type: Array,
      default() {
        return [300, 550, 400, 500];
      },
    },
  },
  methods: {
    initMapContainer() {
      // height / width
      this.aspect_ratio = this.viewPort[3] / this.viewPort[2];

      const con = d3.select("#sg_map_container");
      const con_w = parseInt(con.style("width"));
      const con_h = this.aspect_ratio * con_w;
      console.log(con_h);
      con
        .style("height", `${con_h}px`)
        .style("background-color", "rgb(211, 211, 211)");
    },
    createChart() {
      // clear the svg img in top div when get new data.
      // TODO: i.e.: d3.select('#id > *').remove();
      const pth_map = `${this.$store.state.publicPath}intro/la_boundary/LA_County_City_Boundaries.topojson`;
      const pth_station = `${this.$store.state.publicPath}processed_data/metro-bike-stations.csv`;
      const parseDate = d3.timeParse("%m/%d/%Y");

      // height / width
      this.aspect_ratio = this.viewPort[3] / this.viewPort[2];

      const svg = d3.select("#id_chart_sg");
      const svg_w = parseInt(svg.style("width"));
      const svg_h = this.aspect_ratio * svg_w;

      svg.style("height", `${svg_h}px`);
      // .style('background-color', 'rgb(211, 211, 211)');

      Promise.all([
        d3.json(pth_map),
        d3.csv(pth_station, (d) => {
          return {
            lngLat: [+d.lon, +d.lat],
            date: parseDate(d.go_live_date),
            region: d.region.replace(/\s/g, "_"), // North Hollywood -> North_Hollywood
          };
        }),
      ]).then((values) => {
        this.topo_data = values[0];
        this.station_growth = values[1].sort((a, b) => a.date - b.date);

        this.drawChart();
      });
    },
    drawChart() {
      const that = this;
      const topo_data = this.topo_data;
      const station_growth = this.station_growth;
      console.log(station_growth);

      const svg = d3.select("#id_chart_sg");

      svg.attr("viewBox", `${this.viewPort.join(" ")}`);
      // const margin = {
      //   top: 150,
      //   right: 150,
      //   bottom: 150,
      //   left: 150,
      // };
      //   width = +svg_w - margin.left - margin.right,
      //   height = +svg_h - margin.top - margin.bottom,

      const g = svg.append("g").attr("class", "sg_group");

      // draw map country
      const geo_data = topojson.feature(
        topo_data,
        topo_data.objects.LA_County_City_Boundaries_QGIS
      );
      // console.log(geo_data);

      const map_width = 1000,
        map_height = 1000;
      const projection = d3
        .geoMercator()
        .fitSize([map_width, map_height], geo_data);
      // projection(point); point -  [longitude, latitude] in degrees

      const path = d3.geoPath().projection(projection);

      const map = g.append("g").attr("class", "sg_la_map");

      svg
        .style("height", "auto")
        .transition()
        .duration(2000)
        .styleTween("background-color", function(d) {
          const inter = d3.interpolateRgb(
            "rgb(255, 255, 255)",
            "rgb(64, 175, 219)"
          );
          return function(t) {
            return inter(t);
          };
        });
      // .styleTween("box-shadow", function(d) {
      //   const inter = d3.interpolate({x: 0, z: 0, c0: '#ffffff', c1: '#ffffff'}, {x: 25, z: 47, c0: '#9c9c9c', c1: '#ffffff'});
      //   return function(t) {
      //     const colors = inter(t);
      //     // console.log(colors)
      //     const xt = colors.x,
      //       zt = colors.z,
      //       ct0 = colors.c0,
      //       ct1 = colors.c1;
      //     return `${xt}px ${xt}px ${zt}px ${ct0}, -${xt}px -${xt}px ${zt}px ${ct1}`;
      //   }
      // });

      map
        .selectAll("path")
        .data(geo_data.features)
        .join("path")
        .attr("class", "map_county")
        .attr("d", path);

      // draw station dot
      const station_dot = g
        .append("g")
        .attr("class", "sg_station_dot_g")
        .style("fill", "white")
        .style("stroke", "black");

      // const delay = d3
      //   .scaleTime()
      //   .domain([
      //     station_growth[0].date,
      //     station_growth[station_growth.length - 1].date,
      //   ])
      //   .range([0, 4000]);

      // const dot_generate_line = new Array();
      // for (const d of station_growth) {
      //   const generate_a_dot = d3.timeout(() => {
      //     station_dot
      //       .append("circle")
      //       .attr("class", `are_district_${d["region"]}`)
      //       .attr("transform", `translate(${projection(d.lngLat)})`)
      //       .attr("r", 2)
      //       .attr("fill-opacity", 1)
      //       .attr("stroke-opacity", 0)
      //       .transition()
      //       .attr("fill-opacity", 0)
      //       .attr("stroke-opacity", 1);
      //   }, delay(d.date));
      //   dot_generate_line.push(generate_a_dot);
      // }
      // console.log(dot_generate_line)

      // Promise.all(dot_generate_line).then(() => {
      //   console.log("ok");
      // });

      station_growth.map(d => {
        station_dot
            .append("circle")
            .attr("class", `are_district_${d["region"]}`)
            // .property('selected', false)
            .attr("transform", `translate(${projection(d.lngLat)})`)
            .attr("r", 2)
            // .attr("fill-opacity", 1)
            // .attr("stroke-opacity", 0)
            // .transition()
            // .attr("fill-opacity", 0)
            .attr("stroke-opacity", 1);
      })

      // asyc
      // // bind event
      const circle_dot = station_dot.selectAll('circle');
      circle_dot.on('mouseenter', function() {
        d3.select(this).style('cursor', 'pointer');
      })

      circle_dot.on('click', function() {
        const cls_name = d3.select(this).attr("class");
        const the_dots = d3.selectAll(`.${cls_name}`);

        // clean
        station_dot.selectAll('circle').attr('fill', 'white')

        // set
        the_dots.attr('fill', 'red')

        // send event
        // console.log(cls_name.slice(13).replace(/_/g, ' '))
        const area_name = cls_name.slice(13).replace(/_/g, ' ')
        that.$emit('area_click', area_name);
      })
    },
  },
  // if need resize support, active bellow, modify sub-namespace for resize event, and write resize handler
  mounted() {
    // this.initMapContainer();
    this.createChart();

    // d3.select(window).on("resize.tos", this.resize);
    // === window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    // d3.select(window).on("resize.tos", null);
    // === window.removeEventListener('resize', this.resize);
  },
};
</script>

<style lang="scss" scoped>
// #sg_map_container {
//   width: 100%;
// }

#id_chart_sg {
  // background-color: rgb(64, 175, 219);
  width: 100%;
  // height: 100%;
  // preserveAspectRatio:"none";
  // box-shadow:  25px 25px 47px #9c9c9c,
  //            -25px -25px 47px #ffffff;

  ::v-deep .map_county {
    fill: rgb(197, 197, 197);
    stroke: white;
    stroke-width: 1px;
    // stroke-opacity: 0;
    stroke-linejoin: round;
  }
}
</style>
