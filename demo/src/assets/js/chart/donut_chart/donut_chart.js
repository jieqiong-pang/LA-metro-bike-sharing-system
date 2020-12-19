/*
data should be json format like:
[
  {
    "x": 0,
    "y": 22.1
  },
  ...
]
*/

import * as d3 from "d3";
import { WINDOW_SIZE } from "@/common/const.js";

export default class {
  constructor({
    selector,
    svg_id,
    data,
    x_label = "x",
    y_label = "y",
    title = null,
    aspect_ratio = null,
    svg_width = null,
    svg_height = null,
    view_box = null,
    color_scalor_range = d3.schemeTableau10,
  } = {}) {
    this.chart_node = null;
    this.d3_selection = null;
    this.container_width = null;
    this.container_height = null;

    this.selector = selector;
    this.svg_id = svg_id;
    this.data = data;
    this.x_label = x_label;
    this.y_label = y_label;
    this.title = title;
    this.aspect_ratio = aspect_ratio;
    this.svg_width = svg_width;
    this.svg_height = svg_height;
    this.view_box = view_box;
    this.color_scalor_range = color_scalor_range;
  }

  updateDrawBoard() {
    // init svg and set dimentional properties
    const container = d3.select(this.selector);
    const c_box = container.node().getBoundingClientRect();

    this.container_width = c_box.width;
    this.container_height = c_box.height;

    // init svg_w & svg_h
    let svg_w = c_box.width;
    let svg_h = c_box.height;

    const svg = d3.select(`#${this.svg_id}`);

    // set svg's width & height
    if (this.svg_width !== null) {
      svg.style("width", this.svg_width);
      svg_w = this.svg_width;
    } else {
      svg.style("width", "100%");
    }

    if (this.svg_height !== null) {
      svg.style("height", this.svg_height);
      svg_h = this.svg_height;
    } else {
      svg.style("height", "100%");
    }

    if (this.aspect_ratio !== null) {
      svg_h = aspect_ratio * svg_w;
    }

    // set viewBox
    if (this.view_box === null) {
      svg.attr("viewBox", [0, 0, svg_w, svg_h]);
    } else {
      svg.attr("viewBox", this.view_box);
    }

    let margin = new Object();
    if (svg_w >= WINDOW_SIZE.LG) {
      margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70,
      };
    } else if (
      svg_w < WINDOW_SIZE.LG &&
      svg_w >= WINDOW_SIZE.MD
    ) {
      margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70,
      };
    } else if (
      svg_w < WINDOW_SIZE.MD &&
      svg_w >= WINDOW_SIZE.SM
    ) {
      margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70,
      };
    } else {
      margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      };
    }

    const width = +svg_w - margin.left - margin.right,
      height = +svg_h - margin.top - margin.bottom,
      radius = Math.min(width, height) / 2,
      draw_area = svg
        .select(`.${this.svg_id}_draw_area`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
      g = draw_area
        .select(`.${this.svg_id}_group`)
        .attr("transform", `translate(${width / 2},${height / 2})`);

    return {
      svg: svg,
      draw_area: draw_area,
      g: g,
      svg_w: svg_w,
      svg_h: svg_h,
      width: width,
      height: height,
      radius: radius,
      margin: margin,
    };
  }

  generateChart() {
    let selector = this.selector,
      svg_id = this.svg_id,
      data = this.data,
      x_label = this.x_label,
      y_label = this.y_label,
      color_scalor_range = this.color_scalor_range,
      that = this;

    // init svg board
    d3.select(selector)
      .append("svg")
      .attr("id", svg_id)
      .append("g")
      .attr("class", `${svg_id}_draw_area`)
      .append("g")
      .attr("class", `${svg_id}_group`);

    /* -------------------------------------------------------------------------------------- */
    // update size of drawboard
    let {
      svg,
      draw_area,
      g,
      svg_w,
      svg_h,
      width,
      height,
      radius,
      margin,
    } = this.updateDrawBoard();

    /* -------------------------------------------------------------------------------------- */
    // generate chart

    // compute sum of values
    const sum_value = d3.sum(data.map((d) => d[y_label]));

    // tire
    g.append("image")
      .attr("class", `${svg_id}_tire`)
      .attr("x", -radius * 0.15 * 2)
      .attr("y", -radius * 0.15 * 2)
      .attr("width", radius * 0.3 * 2)
      .attr("height", radius * 0.3 * 2)
      .attr("xlink:href", `${require("@/assets/img/tire.svg")}`);

    // color scalor
    const color_scalor = d3
      .scaleOrdinal()
      .domain(data.map((d) => d[x_label]))
      .range(color_scalor_range);

    const pie = d3
      .pie()
      .value((d) => d[y_label])
      .sort(null);

    const path = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const arc = g
      .selectAll(".arc")
      .data(pie(data), (d) => d.data[x_label])
      .enter()
      .append("g")
      .attr("class", `${svg_id}_arc`);

    // shape
    arc
      .append("path")
      .attr("d", path)
      .attr("class", `${svg_id}_shape`)
      .attr("fill", (d) => color_scalor(d.data[x_label]))
      .property("selected", false);

    // pointer line and label
    const edgeArc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.8);
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const polyline = arc.append("polyline").attr("class", `${svg_id}_pointer`);

    polyline
      .attr("points", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [edgeArc.centroid(d), outerArc.centroid(d), pos];
      })
      .style("fill", "none")
      .style("opacity", 0.3)
      .style("stroke", "black")
      .style("stroke-width", "2px");

    arc.select(`.${svg_id}_shape`).raise();

    const arc_text = arc.append("text").attr("class", `${svg_id}_text`);

    arc_text
      .style("alignment-baseline", "middle")
      .attr("transform", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * (this.midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) =>
        this.midAngle(d) < Math.PI ? "start" : "end"
      );

    console.log(svg_w)

    if (svg_w < WINDOW_SIZE.SM) {
      arc_text.text((d) => {
        const x_v = d.data[x_label];
        const y_v = d.data[y_label];
        return `${x_v}: ${d3.format("d")(y_v)}`;
      });
    } else {
      arc_text.text((d) => {
        const x_v = d.data[x_label];
        const y_v = d.data[y_label];
        const portion = (y_v / sum_value) * 100;
        return `${x_v}: ${d3.format("d")(y_v)} (${d3.format(".1f")(
          portion
        )}\%)`;
      });
    }

    // interactive
    this.arcBindEvent(arc, path);

    // bind resize
    d3.select(window).on(`resize.${svg_id}`, () => this.resize()); // be careful of this here.

    this.chart_node = svg.node();
    this.d3_selection = svg;
  }

  // compute mid angle
  midAngle(d) {
    return (d.startAngle + d.endAngle) / 2;
  }

  updateData(data) {
    let selector = this.selector,
      svg_id = this.svg_id,
      x_label = this.x_label,
      y_label = this.y_label,
      color_scalor_range = this.color_scalor_range,
      that = this;

    this.data = data;

    const ani_exit_duration = 300,
      ani_update_delay = ani_exit_duration,
      ani_update_duration = 1000,
      ani_enter_delay = ani_exit_duration + ani_update_duration,
      ani_enter_duration = 300;

    /* -------------------------------------------------------------------------------------- */
    // update size of drawboard
    let {
      svg,
      draw_area,
      g,
      svg_w,
      svg_h,
      width,
      height,
      radius,
      margin,
    } = this.updateDrawBoard();

    /* -------------------------------------------------------------------------------------- */
    // update chart

    // compute sum of values
    const sum_value = d3.sum(data.map((d) => d[y_label]));

    // tire
    g.select(`.${svg_id}_tire`)
      .attr("x", -radius * 0.15 * 2)
      .attr("y", -radius * 0.15 * 2)
      .attr("width", radius * 0.3 * 2)
      .attr("height", radius * 0.3 * 2);

    // color scalor
    const color_scalor = d3
      .scaleOrdinal()
      .domain(data.map((d) => d[x_label]))
      .range(color_scalor_range);

    const pie = d3
      .pie()
      .value((d) => d[y_label])
      .sort(null);

    const path = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const arc = g
      .selectAll(`.${svg_id}_arc`)
      .data(pie(data), (d) => d.data[x_label]);

    // update
    // shape
    arc
      .select(`.${svg_id}_shape`)
      .transition()
      .delay(ani_update_delay)
      .duration(ani_update_duration)
      .attr("fill", (d) => color_scalor(d.data[x_label]))
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

    // pointer line and label
    const edgeArc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.8);
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const polyline = arc.select(`.${svg_id}_pointer`);
    polyline
      .transition()
      .delay(ani_update_delay)
      .duration(ani_update_duration)
      .attrTween("points", function (d) {

        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (that.midAngle(d2) < Math.PI ? 1 : -1);
          return [edgeArc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    const arc_text = arc.select(`.${svg_id}_text`);
    let changed_arc_text = null;
    if (svg_w < WINDOW_SIZE.SM) {
      changed_arc_text = arc_text
        .transition()
        .delay(ani_update_delay)
        .duration(ani_update_duration)
        .textTween((d) => {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            const x_v = d.data[x_label];
            const y_v = d2.data[y_label];
            return `${x_v}: ${d3.format("d")(y_v)}`;
          };
        });
    } else {
      changed_arc_text = arc_text
        .transition()
        .delay(ani_update_delay)
        .duration(ani_update_duration)
        .textTween((d) => {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);
            const x_v = d.data[x_label];
            const y_v = d2.data[y_label];
            const portion = (y_v / sum_value) * 100;
            return `${x_v}: ${d3.format("d")(y_v)} (${d3.format(".1f")(
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
          pos[0] = radius * (that.midAngle(d2) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        };
      })
      .styleTween("text-anchor", function (d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          const d2 = interpolate(t);
          return that.midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    // enter
    const new_arc = arc
      .enter()
      .append("g")
      .attr("class", `${svg_id}_arc`);

    // shape
    const new_shape = new_arc
      .append("path")
      .attr("class", `${svg_id}_shape`)
      .attr("fill", (d) => color_scalor(d.data[x_label]))
      .property("selected", false)
      .attr("d", path);

    new_shape.style("opacity", 0)
      .transition()
      .delay(ani_enter_delay)
      .duration(ani_update_duration)
      .style("opacity", 1);

    // pointer line and label
    const new_polyline = new_arc
      .append("polyline")
      .attr("class", `${svg_id}_pointer`);
    new_polyline
      .attr("points", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [edgeArc.centroid(d), outerArc.centroid(d), pos];
      })
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0)
      .transition()
      .delay(ani_enter_delay)
      .duration(ani_update_duration)
      .style("opacity", 0.3);

    new_arc.select(`.${svg_id}_shape`).raise();

    const new_arc_text = new_arc.append("text").attr("class", `${svg_id}_text`);

    new_arc_text
      .style("alignment-baseline", "middle")
      .attr("transform", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * (this.midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) =>
        this.midAngle(d) < Math.PI ? "start" : "end"
      );

    if (svg_w < WINDOW_SIZE.SM) {
      new_arc_text.text((d) => {
        const x_v = d.data[x_label];
        const y_v = d.data[y_label];
        return `${x_v}: ${d3.format("d")(y_v)}`;
      });
    } else {
      new_arc_text.text((d) => {
        const x_v = d.data[x_label];
        const y_v = d.data[y_label];
        const portion = (y_v / sum_value) * 100;
        return `${x_v}: ${d3.format("d")(y_v)} (${d3.format(".1f")(
          portion
        )}\%)`;
      });
    }

    new_arc_text
      .style("opacity", 0)
      .transition()
      .delay(ani_enter_delay)
      .duration(ani_update_duration)
      .style("opacity", 1);

    // interactive
    this.arcBindEvent(new_arc, path);

    // exit
    arc
      .exit()
      .transition()
      .duration(ani_exit_duration)
      .style("opacity", 0)
      .remove();
  }

  resize() {
    // check if svg container's size change
    const size_changed = this.containerSizeChange();
    if (!size_changed) {
      return null;
    }
    /* -------------------------------------------------------------------------------------- */
    let selector = this.selector,
      svg_id = this.svg_id,
      x_label = this.x_label,
      y_label = this.y_label,
      color_scalor_range = this.color_scalor_range,
      that = this;

    /* -------------------------------------------------------------------------------------- */
    // update size of drawboard
    let {
      svg,
      draw_area,
      g,
      svg_w,
      svg_h,
      width,
      height,
      radius,
      margin,
    } = this.updateDrawBoard();

    /* -------------------------------------------------------------------------------------- */
    // update chart

    // compute sum of values
    const sum_value = d3.sum(this.data.map((d) => d[y_label]));

    // tire
    g.select(`.${svg_id}_tire`)
      .attr("x", -radius * 0.15 * 2)
      .attr("y", -radius * 0.15 * 2)
      .attr("width", radius * 0.3 * 2)
      .attr("height", radius * 0.3 * 2);

    const pie = d3
      .pie()
      .value((d) => d[y_label])
      .sort(null);

    const path = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const arc = g.selectAll(`.${svg_id}_arc`);

    // shape
    arc.select(`.${svg_id}_shape`).attr("d", path);

    // pointer line and label
    const edgeArc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.8);
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const polyline = arc.select(`.${svg_id}_pointer`);
    polyline.attr("points", (d) => {
      let pos = outerArc.centroid(d);
      pos[0] = radius * 0.95 * (that.midAngle(d) < Math.PI ? 1 : -1);
      return [edgeArc.centroid(d), outerArc.centroid(d), pos];
    });

    arc.select(`.${svg_id}_shape`).raise();

    const arc_text = arc.select(`.${svg_id}_text`);
    arc_text
      .style("alignment-baseline", "middle")
      .attr("transform", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * (that.midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) =>
        that.midAngle(d) < Math.PI ? "start" : "end"
      );

    if (svg_w < WINDOW_SIZE.SM) {
      arc_text.text((d) => {
        const x_v = d.data[x_label];
        const y_v = d.data[y_label];
        return `${x_v}: ${d3.format("d")(y_v)}`;
      });
    } else {
      arc_text.text((d) => {
        const x_v = d.data[x_label];
        const y_v = d.data[y_label];
        const portion = (y_v / sum_value) * 100;
        return `${x_v}: ${d3.format("d")(y_v)} (${d3.format(".1f")(
          portion
        )}\%)`;
      });
    }
  }

  arcBindEvent(arc, path) {
    const svg_id = this.svg_id;

    // interactive
    arc.on("click", function () {
      const pa = d3.select(this).select(`.${svg_id}_shape`);

      if (pa.property("selected")) {
        pa.attr("transform", "translate(0,0)").property("selected", false);
      } else {
        pa.attr("transform", (d) => {
          return `translate(${path.centroid(d).map((x) => x * 0.1)})`;
        }).property("selected", true);
        d3.select(this).raise();
      }
    });

    arc
      .on("mouseenter", function () {
        const pa = d3.select(this).select(`.${svg_id}_shape`);
        const te = d3.select(this).select(`.${svg_id}_text`);
        const ply = d3.select(this).select(`.${svg_id}_pointer`);

        pa.style("stroke-width", 3)
          .style("stroke", "black")
          .style("stroke-opacity", 0.6);
        ply.style("opacity", 0.6).style("stroke-width", 3);
        te.style("font-size", "1.2em");

        d3.selectAll(`.${svg_id}_text`)
          .style("opacity", function () {
            return this === te.node() ? 1 : 0.2;
          })

        d3.select(this)
          .style("cursor", "pointer")
          .raise();
      })
      .on("mouseout", function () {
        const pa = d3.select(this).select(`.${svg_id}_shape`);
        const te = d3.select(this).select("text");
        const ply = d3.select(this).select(`.${svg_id}_pointer`);

        pa.style("stroke-width", 0);
        ply.style("opacity", 0.3).style("stroke-width", 2);
        te.style("font-size", "1em");

        d3.selectAll(`.${svg_id}_text`)
          .style("opacity", null);

        d3.select(this).lower();
      });
  }

  containerSizeChange() {
    const container = d3.select(this.selector);
    if (container.node() === null) {
      return false;
    }

    const c_box = container.node().getBoundingClientRect();

    return c_box.width !== this.container_width ||
      c_box.height !== this.container_height
      ? true
      : false;
  }
}
