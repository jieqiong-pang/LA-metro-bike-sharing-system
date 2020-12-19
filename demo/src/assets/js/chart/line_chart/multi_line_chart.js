import * as d3 from "d3";
import { WINDOW_SIZE } from "@/common/const.js";

const ani_delay = 0;
const ani_duration = 1000;
const color_scheme = ["#8fd360", "#e2e71f", "#101820"];
const info_data_legend = [
  "total number of stations",
  "total trip duration",
  "average trip duration",
];

export default class {
  constructor({ selector, svg_id, data }) {
    this.chart_node = null;
    this.d3_selection = null;
    this.container_width = null;
    this.container_height = null;

    this.selector = selector;
    this.svg_id = svg_id;
    this.data = data;
  }

  updateDrawBoard() {
    // init svg and set dimentional properties
    const container = d3.select(this.selector);
    // console.log(container)
    const c_box = container.node().getBoundingClientRect();
    // console.log(c_box)

    this.container_width = c_box.width;
    this.container_height = c_box.height;

    // init svg_w & svg_h
    let svg_w = c_box.width;
    let svg_h = c_box.height;
    // console.log(svg_w, svg_h);

    const svg = d3.select(`#${this.svg_id}`);

    // set svg's width & height
    svg.style("width", "100%");
    svg.style("height", "100%");

    // set viewBox
    svg.attr("viewBox", [0, 0, svg_w, svg_h]);

    // console.log(svg_w, svg_h);

    let margin = new Object();
    if (svg_w >= WINDOW_SIZE.LG) {
      margin = {
        top: 70,
        right: 70 + 140,
        bottom: 70,
        left: 70,
      };
    } else if (svg_w < WINDOW_SIZE.LG && svg_w >= WINDOW_SIZE.MD) {
      margin = {
        top: 70,
        right: 70 + 140,
        bottom: 70,
        left: 70,
      };
    } else if (svg_w < WINDOW_SIZE.MD && svg_w >= WINDOW_SIZE.SM) {
      margin = {
        top: 70,
        right: 70 + 140,
        bottom: 70,
        left: 70,
      };
    } else {
      margin = {
        top: 40 + 70,
        right: 20,
        bottom: 50,
        left: 20,
      };
    }

    const width = +svg_w - margin.left - margin.right,
      height = +svg_h - margin.top - margin.bottom,
      draw_area = svg
        .select(`.${this.svg_id}_draw_area`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
      g = draw_area.select(`.${this.svg_id}_group`);
    // .attr("transform", `translate(${width / 2},${height / 2})`);
    // console.log(g)
    // console.log(width, height);

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

    // x domain
    const x_domain = data[0].map((d) => d[0]);
    console.log(x_domain);

    // x-scalor
    const x_scalor = d3
      .scalePoint()
      .domain(x_domain)
      .range([0, width]);

    // y-scalors
    const y_scalors = new Array();
    for (let i in data) {
      const y_scalor = d3
        .scaleLinear()
        .domain([0, d3.max(data[i], (x) => x[1])])
        .nice()
        .range([height, 0]);
      y_scalors.push(y_scalor);
    }

    // line generators
    // this is for animation, line rise from x-axis
    const line_baseline = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalors[0](0));

    const lines = new Array();
    for (let i in data) {
      const line = d3
        .line()
        .x((d) => x_scalor(d[0]))
        .y((d) => y_scalors[i](d[1]));
      lines.push(line);
    }

    // draw x axis
    const x_axis_ticks_all = data[0].map((x) => x[0]);
    let x_axis_ticks = new Array();

    if (svg_w < WINDOW_SIZE.LG && svg_w >= WINDOW_SIZE.SM) {
      for (let i in x_axis_ticks_all) {
        if (!(i % 2)) {
          x_axis_ticks.push(x_axis_ticks_all[i]);
        }
      }
    } else if (svg_w < WINDOW_SIZE.SM) {
      for (let i in x_axis_ticks_all) {
        if (!(i % 4)) {
          x_axis_ticks.push(x_axis_ticks_all[i]);
        }
      }
    } else {
      x_axis_ticks = x_axis_ticks_all;
    }

    const xAxis = d3
      .axisBottom()
      .scale(x_scalor)
      .tickValues(x_axis_ticks);

    g.append("g")
      .attr("class", `${svg_id}_x_axis`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // draw x-axis describe
    g.append("g")
      .attr("class", `${svg_id}_x_axis_discribe`)
      .attr("transform", `translate(${[width / 2, height + 40]})`)
      .append("text")
      .attr("text-anchor", "middle")
      .text("Quarter");

    // draw lines
    const lines_g = g
      .append("g")
      .attr("class", `${svg_id}_lines`)
      .selectAll(".line_path_group")
      .data(data, (d, i) => i)
      .enter()
      .append("g")
      .attr("class", `${svg_id}_lines_g`);

    lines_g
      .append("path")
      .attr("class", `${svg_id}_line`)
      .attr("fill", "none")
      .attr("stroke", (d, i) => color_scheme[i])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 4)
      .attr("d", line_baseline)
      .transition()
      .duration(ani_duration)
      .attr("d", (d, i) => lines[i](d));

    // draw dot

    const dots = lines_g
      .append("g")
      .attr("class", `${svg_id}_line_dot_group`)
      .selectAll(".line_dot")
      .data(
        (d, i) => {
          return d.map((x) => {
            x.push(i);
            return x;
          });
        },
        (x) => x[0]
      )
      .enter()
      .append("circle")
      .attr("class", (d, i) => `${svg_id}_line_dot_${i}`)
      .attr("fill", (d) => color_scheme[d[2]])
      .attr("r", 5)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("cx", (d) => x_scalor(d[0]));

    dots
      .attr("cy", (d) => y_scalors[0](0))
      .transition()
      .duration(ani_duration)
      .attr("cy", (d) => y_scalors[d[2]](d[1]));

    // draw legend
    let x_start_legend = margin.left + width + 10,
      y_start_legend = margin.top + 20,
      delta_y_legend = 40,
      line_length = 20,
      line_text_space = 7;

    if (svg_w < WINDOW_SIZE.SM) {
      x_start_legend = margin.left;
      y_start_legend = 30;
      delta_y_legend = 20;
    }

    const legend_g = svg
      .append("g")
      .attr("class", `${svg_id}_legend_group`)
      .attr("transform", `translate(${[x_start_legend, y_start_legend]})`)
      .selectAll(".legend_group")
      .data(info_data_legend)
      .enter()
      .append("g")
      .attr("class", `${svg_id}_legend_g`)
      .attr("transform", (d, i) => `translate(${[0, delta_y_legend * i]})`);

    legend_g
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", line_length)
      .attr("y2", 0)
      .attr("stroke", (d, i) => color_scheme[i])
      .attr("stroke-width", 4);

    legend_g
      .append("text")
      .attr("x", line_length + line_text_space)
      .attr("alignment-baseline", "middle")
      .text((d) => d);

    // bind event
    // const mid_data = data[0][parseInt(data[0].length / 2 + 1)];
    // console.log(mid_data);

    this.bindEvent(data, g, svg_id, height);

    // bind resize
    d3.select(window).on(`resize.${svg_id}`, () => this.resize()); // be careful of this here.

    this.chart_node = svg.node();
    this.d3_selection = svg;
  }

  updateData(data) {
    let selector = this.selector,
      svg_id = this.svg_id,
      // data = this.data,
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

    // x domain
    const x_domain = data[0].map((d) => d[0]);
    console.log(x_domain);

    // x-scalor
    const x_scalor = d3
      .scalePoint()
      .domain(x_domain)
      .range([0, width]);

    // y-scalors
    const y_scalors = new Array();
    for (let i in data) {
      const y_scalor = d3
        .scaleLinear()
        .domain([0, d3.max(data[i], (x) => x[1])])
        .nice()
        .range([height, 0]);
      y_scalors.push(y_scalor);
    }

    // line generators
    // this is for animation, line rise from x-axis
    const line_baseline = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalors[0](0));

    const lines = new Array();
    for (let i in data) {
      const line = d3
        .line()
        .x((d) => x_scalor(d[0]))
        .y((d) => y_scalors[i](d[1]));
      lines.push(line);
    }

    // draw x axis
    const x_axis_ticks_all = data[0].map((x) => x[0]);
    let x_axis_ticks = new Array();

    if (svg_w < WINDOW_SIZE.LG && svg_w >= WINDOW_SIZE.SM) {
      for (let i in x_axis_ticks_all) {
        if (!(i % 2)) {
          x_axis_ticks.push(x_axis_ticks_all[i]);
        }
      }
    } else if (svg_w < WINDOW_SIZE.SM) {
      for (let i in x_axis_ticks_all) {
        if (!(i % 4)) {
          x_axis_ticks.push(x_axis_ticks_all[i]);
        }
      }
    } else {
      x_axis_ticks = x_axis_ticks_all;
    }

    const xAxis = d3
      .axisBottom()
      .scale(x_scalor)
      .tickValues(x_axis_ticks);

    // update x axis
    g.select(`.${svg_id}_x_axis`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // update x-axis describe
    g.select(`.${svg_id}_x_axis_discribe`).attr(
      "transform",
      `translate(${[width / 2, height + 40]})`
    );

    // update line
    const lines_g = g.selectAll(`.${svg_id}_lines_g`).data(data, (d, i) => i);

    lines_g
      .select(`.${svg_id}_line`)
      .attr("d", line_baseline)
      .transition()
      .duration(ani_duration)
      .attr("d", (d, i) => lines[i](d));

    // update dot
    const dots = lines_g
      .select(`.${svg_id}_line_dot_group`)
      .selectAll("circle")
      .data(
        (d, i) => {
          return d.map((x) => {
            x.push(i);
            return x;
          });
        },
        (x) => x[0]
      );

    dots
      .attr("cy", (d) => y_scalors[0](0))
      .transition()
      .duration(ani_duration)
      .attr("cy", (d) => y_scalors[d[2]](d[1]));
  }

  resize() {
    // check if svg container's size change
    const size_changed = this.containerSizeChange();
    if (!size_changed) {
      return null;
    }
    // console.log('container size change');
    /* -------------------------------------------------------------------------------------- */
    let selector = this.selector,
      svg_id = this.svg_id,
      data = this.data,
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
    // resize chart

    // x domain
    const x_domain = data[0].map((d) => d[0]);

    // x-scalor
    const x_scalor = d3
      .scalePoint()
      .domain(x_domain)
      .range([0, width]);

    // y-scalors
    const y_scalors = new Array();
    for (let i in data) {
      const y_scalor = d3
        .scaleLinear()
        .domain([0, d3.max(data[i], (x) => x[1])])
        .nice()
        .range([height, 0]);
      y_scalors.push(y_scalor);
    }

    // line generators
    // this is for animation, line rise from x-axis
    const line_baseline = d3
      .line()
      .x((d) => x_scalor(d[0]))
      .y((d) => y_scalors[0](0));

    const lines = new Array();
    for (let i in data) {
      const line = d3
        .line()
        .x((d) => x_scalor(d[0]))
        .y((d) => y_scalors[i](d[1]));
      lines.push(line);
    }

    // resize x axis
    const x_axis_ticks_all = data[0].map((x) => x[0]);
    let x_axis_ticks = new Array();

    if (svg_w < WINDOW_SIZE.LG && svg_w >= WINDOW_SIZE.SM) {
      for (let i in x_axis_ticks_all) {
        if (!(i % 2)) {
          x_axis_ticks.push(x_axis_ticks_all[i]);
        }
      }
    } else if (svg_w < WINDOW_SIZE.SM) {
      for (let i in x_axis_ticks_all) {
        if (!(i % 4)) {
          x_axis_ticks.push(x_axis_ticks_all[i]);
        }
      }
    } else {
      x_axis_ticks = x_axis_ticks_all;
    }

    // console.log(x_axis_ticks)

    const xAxis = d3
      .axisBottom()
      .scale(x_scalor)
      .tickValues(x_axis_ticks);

    // resize x axis
    g.select(`.${svg_id}_x_axis`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // resize x-axis describe
    g.select(`.${svg_id}_x_axis_discribe`).attr(
      "transform",
      `translate(${[width / 2, height + 40]})`
    );

    // resize line
    const lines_g = g.selectAll(`.${svg_id}_lines_g`);

    lines_g.select(`.${svg_id}_line`).attr("d", (d, i) => lines[i](d));

    // resize dot
    const dots = lines_g
      .select(`.${svg_id}_line_dot_group`)
      .selectAll("circle");

    dots
      .attr("cx", (d) => x_scalor(d[0]))
      .attr("cy", (d) => y_scalors[d[2]](d[1]));

    //resize legend
    let x_start_legend = margin.left + width + 10,
      y_start_legend = margin.top + 20,
      delta_y_legend = 40,
      line_length = 20,
      line_text_space = 7;

    if (svg_w < WINDOW_SIZE.SM) {
      x_start_legend = margin.left;
      y_start_legend = 30;
      delta_y_legend = 20;
    }

    const legend_g = svg
      .select(`.${svg_id}_legend_group`)
      .attr("transform", `translate(${[x_start_legend, y_start_legend]})`)
      .selectAll(`.${svg_id}_legend_g`)
      .attr("transform", (d, i) => `translate(${[0, delta_y_legend * i]})`);

    // bind event
    this.bindEvent(data, g, svg_id, height);
  }

  bindEvent(data, g, svg_id, height) {
    for (let i in data[0]) {
      const multi_dots_g = g.selectAll(`.${svg_id}_line_dot_${i}`);
      multi_dots_g.on("mouseenter", function() {
        d3.select(this).style('cursor', 'crosshair');
        const cls_name = d3.select(this).attr("class");
        const the_dots = d3.selectAll(`.${cls_name}`);

        the_dots.raise();

        const help_line_x = the_dots.nodes()[0].cx.baseVal.value;
        const cys = the_dots.nodes().map((n) => n.cy.baseVal.value);
        const help_line_y1 = d3.min(cys);
        const help_line_y2 = height;

        the_dots.attr("r", 8);

        g.append("line")
          .attr("class", `${svg_id}_multi_line_chart_help_line`)
          .attr("x1", help_line_x)
          .attr("y1", help_line_y1)
          .attr("x2", help_line_x)
          .attr("y2", help_line_y2)
          .attr("stroke-width", 2)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "5,5")
          .lower();

        const dot_info = new Object();
        the_dots.data().map((d) => {
          dot_info[d[2]] = [d[0], d[1]];
        });
        console.log(dot_info);

        g.append("text")
          .attr("class", `${svg_id}_multi_line_chart_help_text`)
          .attr("transform", `translate(${[0, -10]})`)
          // .attr("text-anchor", "middle")
          .text(
            `${dot_info[0][0]}: ${dot_info[0][1]} stations; ${
              dot_info[1][1]
            } min; ${d3.format(".1f")(dot_info[2][1])} min/station`
          );
      });

      multi_dots_g.on("mouseout", function() {
        const cls_name = d3.select(this).attr("class");
        const the_dots = d3.selectAll(`.${cls_name}`);

        the_dots.attr("r", 5);

        g.select(`.${svg_id}_multi_line_chart_help_line`).remove();
        g.select(`.${svg_id}_multi_line_chart_help_text`).remove();
      });
    }
  }

  containerSizeChange() {
    const container = d3.select(this.selector);
    if (container.node() === null) {
      return false;
    }

    // console.log(container.node().getBoundingClientRect())

    const c_box = container.node().getBoundingClientRect();

    return c_box.width !== this.container_width ||
      c_box.height !== this.container_height
      ? true
      : false;
  }
}
