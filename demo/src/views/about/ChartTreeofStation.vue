<template>
  <div>
    <svg id="id_chart_tos"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ChartTreeofStation",
  data() {
    return {
      tree_data: null,
    };
  },
  methods: {
    createChart() {
      // clear the svg img in top div when get new data.
      // TODO: i.e.: d3.select('#id > *').remove();
      const pth_data = `${this.$store.state.publicPath}intro/tree_of_station/tree_of_station.json`;

      d3.json(pth_data).then((data) => {
        this.tree_data = data;
        this.drawChart();
      });
    },
    drawChart() {
      const data = this.tree_data;
      // console.log(data);
      const svg = d3.select("#id_chart_tos");

      const svg_w = parseInt(svg.style("width"));
      const svg_h = svg_w;
      // const svg_h = +this.aspectRatio * 1.5 * svg_w;
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
          .attr("class", "tos_group")
          .attr("transform", `translate(${width / 2},${height / 2})`);

      // data
      const tree = d3.cluster().size([2 * Math.PI, radius - 150]);
      const root_data = d3
        .hierarchy(data, (d) => d.branchset)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name));
      const root = tree(root_data);
      // console.log(root);

      // link
      const link = d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y);

      // console.log(root.links());

      g.append("g")
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("class", "tos_link")
        .attr("d", link);

      // dot
      g.append("g")
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("class", "tos_dot")
        .attr(
          "transform",
          (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
        )
        .style("fill", (d) => (d.children ? "#555" : "#999"))
        .style("r", 2.5);

      // station label
      g.append("g")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("class", "tos_label")
        .attr(
          "transform",
          (d) => `
        rotate(${(d.x * 180) / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `
        )
        .attr("dy", "0.31em")
        .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
        .attr("text-anchor", (d) =>
          d.x < Math.PI === !d.children ? "start" : "end"
        )
        .text((d) => d.data.name);

      this.resize();
    },
    resize() {
      const data = this.tree_data;
      const svg = d3.select("#id_chart_tos");

      const svg_w = parseInt(svg.style("width"));
      const svg_h = svg_w;
      // const svg_h = +this.aspectRatio * 1.5 * svg_w;
      // console.log(svg_w, svg_h)
      svg.style("height", svg_h);

      let margin = new Object();
      if (window.innerWidth >= 768) {
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
        draw_area = svg
          .select("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          ),
        g = svg
          .select(".tos_group")
          .attr("transform", `translate(${width / 2},${height / 2})`);

      // data
      let delta_radius = 150;
      if (window.innerWidth >= 992) {
        delta_radius = 150;
      } else if (992 > window.innerWidth && window.innerWidth >= 768) {
        delta_radius = 50;
      } else {
        delta_radius = 10;
      }


      const tree = d3.cluster().size([2 * Math.PI, radius - delta_radius]);
      const root_data = d3
        .hierarchy(data, (d) => d.branchset)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name));
      const root = tree(root_data);
      // console.log(root);

      // link
      const link = d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y);

      g.selectAll(".tos_link")
        .data(root.links())
        .attr("d", link);

      //dot
      g.selectAll(".tos_dot")
        .data(root.descendants())
        .attr(
          "transform",
          (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
        );

      if (window.innerWidth >= 768) {
        const ft_size = window.innerWidth >= 992 ? "0.6em" : "0.4em";

        g.selectAll(".tos_label")
          .style("display", "block")
          .data(root.descendants())
          .attr(
            "transform",
            (d) => `
        rotate(${(d.x * 180) / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `
          )
          .attr("dy", "0.31em")
          .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
          .attr("text-anchor", (d) =>
            d.x < Math.PI === !d.children ? "start" : "end"
          )
          .text((d) => d.data.name)
          .style("font-size", ft_size);
      }
      // station label
      else g.selectAll(".tos_label").style("display", "none");
    },
  },
  // if need resize support, active bellow, modify sub-namespace for resize event, and write resize handler
  mounted() {
    this.createChart();

    d3.select(window).on("resize.tos", this.resize);
    // === window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    d3.select(window).on("resize.tos", null);
    // === window.removeEventListener('resize', this.resize);
  },
};
</script>

<style lang="scss" scoped>
#id_chart_tos {
  // background-color: #fff;
  width: 100%;
  // height: 500px;

  ::v-deep .tos_link {
    fill: none;
    stroke: #555;
    stroke-width: 1.5;
    stroke-opacity: 0.4;
  }
}
</style>
