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

const ani_delay = 0;
const ani_duration = 1000;

export default class {
  constructor({
    selector,
    svg_id,
    data,
    x_label = "x",
    y_label = "y",
    x_scalor = null,
    y_scalor = null,
    x_tick_values = null,
    title = null,
    aspect_ratio = null,
    svg_width = null,
    svg_height = null,
    view_box = null,
  }) {
    this.chart_node = null;
    this.d3_selection = null;
    this.container_width = null;
    this.container_height = null;

    this.selector = selector;
    this.svg_id = svg_id;
    this.data = data;
    this.x_label = x_label;
    this.y_label = y_label;
    this.x_scalor = x_scalor;
    this.y_scalor = y_scalor;
    this.x_tick_values = x_tick_values;
    this.title = title;
    this.aspect_ratio = aspect_ratio;
    this.svg_width = svg_width;
    this.svg_height = svg_height;
    this.view_box = view_box;
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
    } else if (svg_w < WINDOW_SIZE.LG && svg_w >= WINDOW_SIZE.MD) {
      margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70,
      };
    } else if (svg_w < WINDOW_SIZE.MD && svg_w >= WINDOW_SIZE.SM) {
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
        bottom: 60,
        left: 40,
      };
    }

    const width = +svg_w - margin.left - margin.right,
      height = +svg_h - margin.top - margin.bottom,
      draw_area = svg
        .select(`.${this.svg_id}_draw_area`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
      g = draw_area.select(`.${this.svg_id}_group`);

    return {
      svg: svg,
      draw_area: draw_area,
      g: g,
      svg_w: svg_w,
      svg_h: svg_h,
      width: width,
      height: height,
      margin: margin,
    };
  }

  generateChart() {
    let selector = this.selector,
      svg_id = this.svg_id,
      data = this.data,
      x_label = this.x_label,
      y_label = this.y_label,
      x_tick_values = this.x_tick_values,
      x_scalor = this.x_scalor,
      y_scalor = this.y_scalor,
      color_scalor_range = this.color_scalor_range,
      that = this;

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
      margin,
    } = this.updateDrawBoard();

    /* -------------------------------------------------------------------------------------- */
    // generate line chart

    // scalor
    if (x_scalor === null) {
      x_scalor = d3
        .scalePoint()
        .domain(data.map((x) => x[x_label]))
        .range([0, width]);
    }

    if (y_scalor === null) {
      y_scalor = d3
        .scaleLinear()
        .domain([0, d3.max(data, (x) => x[y_label])])
        .nice()
        .range([height, 0]);
    }

    const xAxis = d3.axisBottom().scale(x_scalor);

    if (x_tick_values !== null) {
      xAxis.tickValues(x_tick_values);
    }

    const yAxis = d3
      .axisLeft()
      .scale(y_scalor)
      .ticks(5);

    const data_pair = data.map((x, i) => [data[i][x_label], data[i][y_label]]);

    // this is for animation, line rise from x-axis
    const line_baseline = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalor(0));

    const line = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalor(d[1]));

    // draw x axis
    g.append("g")
      .attr("class", `${svg_id}_x_axis`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // draw x-axis describe
    g.append("g")
      .attr("class", `${svg_id}_x_axis_discribe`)
      .attr("transform", `translate(${[width / 2, height + 30]})`)
      .append("text")
      .attr("text-anchor", "middle")
      .text("Hour");

    // draw y axis
    g.append("g")
      .attr("class", `${svg_id}_y_axis`)
      .call(yAxis);

    // draw line
    g.append("path")
      .attr("class", `${svg_id}_line`)
      .data([data_pair], (d) => "this_line")
      .attr("d", line_baseline)
      .attr("fill", "none")
      .attr("stroke", "#8fd360")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .transition()
      .duration(ani_duration)
      .attr("d", line);

    // draw dot
    const dot_g = g
      .append("g")
      .attr("class", `${svg_id}_line_dot_group`)
      .selectAll(".line_dot")
      .data(data_pair, (d) => d[0])
      .enter()
      .append("g")
      .attr("class", `${svg_id}_line_dot`);

    dot_g
      .attr("transform", (d) => `translate(${[x_scalor(d[0]), y_scalor(0)]})`)
      .transition()
      .duration(ani_duration)
      .attr(
        "transform",
        (d) => `translate(${[x_scalor(d[0]), y_scalor(d[1])]})`
      );

    dot_g
      .append("circle")
      .attr("class", `${svg_id}_line_dot_circle`)
      .attr("fill", "#8fd360")
      .attr("r", 5)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // bind event
    const mid_data = data_pair[parseInt(data.length / 2 + 1)];
    // console.log(mid_data)

    const line_dot = g.selectAll(`.${svg_id}_line_dot`);
    line_dot.on("mouseenter", function () {
      const the_dot_g = d3.select(this);
      the_dot_g.raise();
      the_dot_g
        .select(`.${svg_id}_line_dot_circle`)
        .attr("r", 8)
        .attr("fill", "red");
      the_dot_g
        .append("text")
        .text((d) => `${d[1]} times at ${d[0]}:00`)
        .attr("text-anchor", (d) => (d[0] <= mid_data[0] ? "start" : "end"))
        .attr("transform", (d) =>
          d[0] <= mid_data[0] ? "translate(10,0)" : "translate(-10,0)"
        );
    });

    line_dot.on("mouseout", function () {
      const the_dot_g = d3.select(this);
      the_dot_g
        .select(`.${svg_id}_line_dot_circle`)
        .attr("r", 5)
        .attr("fill", "#8fd360");
      the_dot_g.select("text").remove();
    });

    // bind resize
    d3.select(window).on(`resize.${svg_id}`, () => this.resize()); // be careful of this here.

    this.chart_node = svg.node();
    this.d3_selection = svg;
  }

  updateData(data) {
    let selector = this.selector,
      svg_id = this.svg_id,
      x_label = this.x_label,
      y_label = this.y_label,
      x_scalor = this.x_scalor,
      y_scalor = this.y_scalor,
      x_tick_values = this.x_tick_values,
      color_scalor_range = this.color_scalor_range,
      that = this;

    this.data = data;

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
      margin,
    } = this.updateDrawBoard();

    /* -------------------------------------------------------------------------------------- */
    // update chart

    // scalor
    if (x_scalor === null) {
      x_scalor = d3
        .scalePoint()
        .domain(data.map((x) => x[x_label]))
        .range([0, width]);
    }

    if (y_scalor === null) {
      y_scalor = d3
        .scaleLinear()
        .domain([0, d3.max(data, (x) => x[y_label])])
        .nice()
        .range([height, 0]);
    }

    const xAxis = d3.axisBottom().scale(x_scalor);

    if (x_tick_values !== null) {
      xAxis.tickValues(x_tick_values);
    }

    const yAxis = d3
      .axisLeft()
      .scale(y_scalor)
      .ticks(5);

    const data_pair = data.map((x, i) => [data[i][x_label], data[i][y_label]]);

    // this is for animation, line rise from x-axis
    const line_baseline = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalor(0));

    const line = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalor(d[1]));

    // update x axis
    g.select(`.${svg_id}_x_axis`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // update x-axis describe 
    g.select(`.${svg_id}_x_axis_discribe`).attr(
      "transform",
      `translate(${[width / 2, height + 30]})`
    );

    // update y axis
    g.select(`.${svg_id}_y_axis`)
      .transition()
      .duration(ani_duration)
      .call(yAxis);

    // update line
    g.select(`.${svg_id}_line`)
      .data([data_pair], (d) => "this_line")
      .attr("d", line_baseline)
      .transition()
      .duration(ani_duration)
      .attr("d", line);

    // update dot
    g.selectAll(`.${svg_id}_line_dot`)
      .data(data_pair, (d) => d[0])
      .attr("transform", (d) => `translate(${[x_scalor(d[0]), y_scalor(0)]})`)
      .transition()
      .duration(ani_duration)
      .attr(
        "transform",
        (d) => `translate(${[x_scalor(d[0]), y_scalor(d[1])]})`
      );
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
      data = this.data,
      x_label = this.x_label,
      y_label = this.y_label,
      x_tick_values = this.x_tick_values,
      x_scalor = this.x_scalor,
      y_scalor = this.y_scalor,
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
      margin,
    } = this.updateDrawBoard();

    /* -------------------------------------------------------------------------------------- */
    // update chart

    // scalor
    if (x_scalor === null) {
      x_scalor = d3
        .scalePoint()
        .domain(data.map((x) => x[x_label]))
        .range([0, width]);
    }

    if (y_scalor === null) {
      y_scalor = d3
        .scaleLinear()
        .domain([0, d3.max(data, (x) => x[y_label])])
        .nice()
        .range([height, 0]);
    }

    const xAxis = d3.axisBottom().scale(x_scalor);

    if (x_tick_values !== null) {
      xAxis.tickValues(x_tick_values);
    }

    const yAxis = d3
      .axisLeft()
      .scale(y_scalor)
      .ticks(5);

    const data_pair = data.map((x, i) => [data[i][x_label], data[i][y_label]]);

    // this is for animation, line rise from x-axis
    const line_baseline = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalor(0));

    const line = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalor(d[1]));

    // resize x axis
    g.select(`.${svg_id}_x_axis`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // resize x-axis describe 
    g.select(`.${svg_id}_x_axis_discribe`).attr(
      "transform",
      `translate(${[width / 2, height + 30]})`
    );

    // resize y axis
    g.select(`.${svg_id}_y_axis`)
      .call(yAxis)
      .call(function () {
        g.select(`.${svg_id}_y_axis`)
          .select(".domain")
          .remove();
      });

    // resize line
    g.select(`.${svg_id}_line`).attr("d", line);

    // resize dot
    g.selectAll(`.${svg_id}_line_dot`).attr(
      "transform",
      (d) => `translate(${[x_scalor(d[0]), y_scalor(d[1])]})`
    );
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
