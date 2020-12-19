/*
{
    "x": "4385",
    "y": 7,
    "label": "Public Bike Rack: Westwood/Rancho Park Expo Line"
}
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
    label = "label",
    x = null,
    y = null,
    x_axis_ticks = null,
    y_axis_ticks_num = 10,
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
    this.label = label;
    this.x = x;
    this.y = y;
    this.x_axis_ticks = x_axis_ticks;
    this.y_axis_ticks_num = y_axis_ticks_num;
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
        bottom: 50,
        left: 40,
      };
    }

    const width = +svg_w - margin.left - margin.right,
      height = +svg_h - margin.top - margin.bottom,
      g = svg
        .select(`.${this.svg_id}_group`)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    console.log(g);

    return {
      svg: svg,
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
      label = this.label,
      x = this.x,
      y = this.y,
      x_axis_ticks = this.x_axis_ticks,
      y_axis_ticks_num = this.y_axis_ticks_num,
      that = this;

    // d3 implement chart
    d3.select(selector)
      .append("svg")
      .attr("id", svg_id)
      .append("g")
      .attr("class", `${svg_id}_group`);

    let {
      svg,
      g,
      svg_w,
      svg_h,
      width,
      height,
      margin,
    } = this.updateDrawBoard();

    // set scale for x and y axis
    if (x === null) {
      x = d3
        .scaleBand()
        .domain(data.map((d) => d[x_label]))
        .range([0, width])
        .padding(0.5)
        .paddingInner(0.5);
    } else {
      x = x.range([0, width]);
    }

    if (y === null) {
      y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[y_label])])
        .range([height, 0])
        .nice();
    } else {
      y = y.range([height, 0]);
    }

    let delay = function (d, i) {
      return i * 20;
    };

    // draw chart
    draw();

    //🚧  draw the bar chart
    function draw() {
      g.selectAll(".bar")
        .data(data, (d) => d[x_label])
        .enter()
        .append("rect")
        .attr("class", `${svg_id}_bar_chart_bar`)
        .attr("fill", "LightSkyBlue")
        .attr("x", (d) => x(d[x_label]))
        .attr("y", (d) => y(d[y_label]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d[y_label]))
        .on("mouseover", function (event, d) {
          d3.select(this)
            .style("fill", "DodgerBlue")
            .style("cursor", "default");
          if (x_axis_ticks[0] === 1) {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", x(d[x_label]) * 0.8)
              .attr("y", y(d[y_label]) * 0.9)
              .raise();
          } else {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", width / 2)
              .attr("y", -10)
              .attr("text-anchor", "middle")
              .raise();
          }
        })
        .on("mouseout", function (event, d) {
          d3.select(this).style("fill", "LightSkyBlue");
          d3.select(`#${svg_id}_bar_chart_label`).text("");
        })
        .transition()
        .duration(750)
        .delay(delay)
        .attr("x", (d) => x(d[x_label]))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y(d[y_label]))
        .attr("height", (d) => height - y(d[y_label]));

      // create bar text
      g.append("text")
        .attr("id", `${svg_id}_bar_chart_label`)
        .style("font-size", "0.9em")
        .style("font-weight", "bold")
        .attr("transform", "rotate(0)");

      // create x-axis
      if (x_axis_ticks[0] === 1) {
        g.append("g")
          .attr("class", `${svg_id}_x_text`)
          .attr("transform", `translate(${[width / 2, height + 40]})`)
          .append("text")
          .attr("text-anchor", "middle")
          .text("Minitues");
      } else {
        g.append("g")
          .attr("class", `${svg_id}_x_text`)
          .attr("transform", `translate(${[width / 2, height + 40]})`)
          .append("text")
          .attr("text-anchor", "middle")
          .text("Station ID");
      }

      let xAxis;
      xAxis = d3.axisBottom(x).tickValues(x_axis_ticks);

      g.append("g")
        .attr("class", `${svg_id}_x_axis`)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // create y-axis
      let yAxis = d3
        .axisLeft()
        .scale(y)
        .ticks(y_axis_ticks_num);

      g.append("g")
        .attr("class", `${svg_id}_y_axis`)
        .call(yAxis);
    }
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
      label = this.label,
      x = this.x,
      y = this.y,
      x_axis_ticks = this.x_axis_ticks,
      y_axis_ticks_num = this.y_axis_ticks_num,
      that = this;
    this.data = data;

    let {
      svg,
      g,
      svg_w,
      svg_h,
      width,
      height,
      margin,
    } = this.updateDrawBoard();

    // set scale for x and y axis
    if (x === null) {
      x = d3
        .scaleBand()
        .domain(data.map((d) => d[x_label]))
        .range([0, width])
        .padding(0.5)
        .paddingInner(0.5);
    } else {
      x = x.range([0, width]);
    }

    if (y === null) {
      y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[y_label])])
        .range([height, 0])
        .nice();
    } else {
      y = y.range([height, 0]);
    }

    let delay = function (d, i) {
      return i * 20;
    };

    // draw chart
    update_data();

    // update the bar chart by new data
    function update_data() {
      const bar = g
        .selectAll(`.${svg_id}_bar_chart_bar`)
        .data(data, (d) => d[x_label]);

      // data intersect
      bar
        .on("mouseover", function (event, d) {
          d3.select(this)
            .style("fill", "DodgerBlue")
            .style("cursor", "default");

          if (x_axis_ticks[0] === 1) {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", x(d[x_label]) * 0.8)
              .attr("y", y(d[y_label]) * 0.9)
              .raise();
          } else {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", width / 2)
              .attr("y", -10)
              .attr("text-anchor", "middle")
              .raise();
          }
        })
        .on("mouseout", function (event, d) {
          d3.select(this).style("fill", "LightSkyBlue");
          d3.select(`#${svg_id}_bar_chart_label`).text("");
        })
        .transition()
        .duration(750)
        .delay(delay)
        .attr("x", (d) => x(d[x_label]))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y(d[y_label]))
        .attr("height", (d) => height - y(d[y_label]));

      // update x-axis describe
      g.select(`.${svg_id}_x_text`).attr(
        "transform",
        `translate(${[width / 2, height + 40]})`
      );
      // data enter
      bar
        .enter()
        .append("rect")
        .attr("x", (d) => x(d[x_label]))
        .attr("y", (d) => y(0))
        .attr("width", x.bandwidth())
        .on("mouseover", function (event, d) {
          d3.select(this)
            .style("fill", "DodgerBlue")
            .style("cursor", "default");

          if (x_axis_ticks[0] === 1) {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", x(d[x_label]) * 0.8)
              .attr("y", y(d[y_label]) * 0.9)
              .raise();
          } else {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", width / 2)
              .attr("y", -10)
              .attr("text-anchor", "middle")
              .raise();
          }
        })
        .on("mouseout", function (event, d) {
          d3.select(this).style("fill", "LightSkyBlue");
          d3.select(`#${svg_id}_bar_chart_label`).text("");
        })
        .transition()
        .duration(750)
        .attr("class", `${svg_id}_bar_chart_bar`)
        .attr("fill", "LightSkyBlue")
        .attr("x", (d) => x(d[x_label]))
        .attr("y", (d) => y(d[y_label]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d[y_label]));

      // data exit
      bar
        .exit()
        .transition()
        .remove();

      let xAxis;
      xAxis = d3.axisBottom(x).tickValues(x_axis_ticks);

      g.select(`.${svg_id}_x_axis`)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // create y-axis
      let yAxis = d3
        .axisLeft()
        .scale(y)
        .ticks(y_axis_ticks_num);

      g.select(`.${svg_id}_y_axis`).call(yAxis);
    }
  }

  resize() {
    // check if svg container's size change
    const size_changed = this.containerSizeChange();
    if (!size_changed) {
      return null;
    }

    let selector = this.selector,
      svg_id = this.svg_id,
      x_label = this.x_label,
      y_label = this.y_label,
      label = this.label,
      x = this.x,
      y = this.y,
      x_axis_ticks = this.x_axis_ticks,
      y_axis_ticks_num = this.y_axis_ticks_num,
      data = this.data,
      that = this;

    let {
      svg,
      g,
      svg_w,
      svg_h,
      width,
      height,
      margin,
    } = this.updateDrawBoard();
    console.log(width, height);

    // set scale for x and y axis
    if (x === null) {
      x = d3
        .scaleBand()
        .domain(data.map((d) => d[x_label]))
        .range([0, width])
        .padding(0.5)
        .paddingInner(0.5);
    } else {
      x = x.range([0, width]);
    }

    if (y === null) {
      y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[y_label])])
        .range([height, 0])
        .nice();
    } else {
      y = y.range([height, 0]);
    }

    let delay = function (d, i) {
      return i * 20;
    };

    // draw chart
    update_size();

    // update the bar chart by new data
    function update_size() {
      g.select(`.${svg_id}_x_text`).attr(
        "transform",
        `translate(${[width / 2, height + 40]})`
      );

      const bar = g.selectAll(`.${svg_id}_bar_chart_bar`);

      // data intersect
      bar
        .on("mouseover", function (event, d) {
          d3.select(this)
            .style("fill", "DodgerBlue")
            .style("cursor", "default");

          if (x_axis_ticks[0] === 1) {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", x(d[x_label]) * 0.8)
              .attr("y", y(d[y_label]) * 0.9)
              .raise();
          } else {
            d3.select(`#${svg_id}_bar_chart_label`)
              .text(d[label])
              .attr("x", width / 2)
              .attr("y", -10)
              .attr("text-anchor", "middle")
              .raise();
          }
        })
        .on("mouseout", function (event, d) {
          d3.select(this).style("fill", "LightSkyBlue");
          d3.select(`#${svg_id}_bar_chart_label`).text("");
        })
        .attr("x", (d) => x(d[x_label]))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y(d[y_label]))
        .attr("height", (d) => height - y(d[y_label]));

      let xAxis;
      xAxis = d3.axisBottom(x).tickValues(x_axis_ticks);

      g.select(`.${svg_id}_x_axis`)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // update x-axis describe
      g.select(`.${svg_id}_x_text`).attr(
        "transform",
        `translate(${[width / 2, height + 40]})`
      );

      // create y-axis
      let yAxis = d3
        .axisLeft()
        .scale(y)
        .ticks(y_axis_ticks_num);

      g.select(`.${svg_id}_y_axis`).call(yAxis);
    }
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