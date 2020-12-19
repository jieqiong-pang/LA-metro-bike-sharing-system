/*
[duration,times]
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
        if (window.innerWidth >= WINDOW_SIZE.MD) {
            margin = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
            };
        } else if (window.innerWidth < WINDOW_SIZE.MD && window.innerWidth >= WINDOW_SIZE.SM) {
            margin = {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30,
            };
        } else if (window.innerWidth < WINDOW_SIZE.LG && window.innerWidth >= WINDOW_SIZE.MD) {
            margin = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            };
        } else {
            margin = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            };
        }

        const width = +svg_w - margin.left - margin.right,
            height = +svg_h - margin.top - margin.bottom,
            g = svg
                .select(`.${this.svg_id}_group`)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

            that = this;

        // d3 implement chart  // TODO
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

        var x = d3
            .scaleBand()
            .domain(
                data.map(function (d) {
                    return d[0];
                })
            )
            .range([0, width])
            .paddingInner(1 / 4);

        var y = d3
            .scaleLinear()
            .domain([0, d3.max(data.map((d) => d[1]))])
            .nice()
            .range([height, 0]);

        // console.log("Max:", d3.max(data.map((d) => d[1])))

        var yAxis = d3.axisLeft().scale(y).ticks(5);

        // draw bar
        g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", `${svg_id}_bar`)
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d[1]);
            })
            .style("fill", "LightSkyBlue")
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill", "DodgerBlue");
                d3.select("#times")
                    .text(d[0] + " minutes (" + d[1] + " times)")
                    .attr("x", x(d[0]))
                    .attr("y", y(d[1]) * 0.9)
                    .attr("transform", "rotate(0)");
            })
            .on("mouseout", function (event, d) {
                d3.select(this).style("fill", "LightSkyBlue");
                d3.select("#times").text("");
            });

        // add tooltips
        g.append("text")
            .attr("id", "times")
            .style("font-size", "0.8em")
            .style("font-weight", "bold");


        var xAxis = d3.axisBottom().scale(x).tickSize(0).tickFormat("");
        g.append("g")
            .attr("class", `${svg_id}_x`)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        g.selectAll("text").text("");

        g.append("g").attr("class", `${svg_id}_y`).call(yAxis);

        g.append("text")
            .attr("class", "xlabel")
            .text("duration")
            .attr("x", width / 2)
            .attr("y", height + 25)
            .style("font-size", "1em")
            .style("font-weight", "bold");
    }

    updateData(data) {
        let selector = this.selector,
            svg_id = this.svg_id,
            // data = this.data,

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


        var x = d3
            .scaleBand()
            .domain(
                data.map(function (d) {
                    return d[0];
                })
            )
            .range([0, width])
            .paddingInner(1 / 4);

        var y = d3
            .scaleLinear()
            .domain([0, d3.max(data.map((d) => d[1]))])
            .nice()
            .range([height, 0]);

        var yAxis = d3.axisLeft().scale(y).ticks(5);

        // draw bar
        const bar = g
            .selectAll(`.${svg_id}_bar`)
            .data(data)

        // data intersect
        bar
            .transition()
            .duration(750)
            // .delay()
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d[1]);
            })
            .style("fill", "LightSkyBlue")
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill", "DodgerBlue");
                d3.select("#times")
                    .text(d[0] + " minutes (" + d[1] + " times)")
                    .attr("x", x(d[0]))
                    .attr("y", y(d[1]) * 0.9)
                    .attr("transform", "rotate(0)");
            })
            .on("mouseout", function (event, d) {
                d3.select(this).style("fill", "LightSkyBlue");
                d3.select("#times").text("");
            });

        // data enter
        bar
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("y", d => y(0))
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d[1]);
            })
            .style("fill", "LightSkyBlue")
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill", "DodgerBlue");
                d3.select("#times")
                    .text(d[0] + " minutes (" + d[1] + " times)")
                    .attr("x", x(d[0]))
                    .attr("y", y(d[1]) * 0.9)
                    .attr("transform", "rotate(0)");
            })
            .on("mouseout", function (event, d) {
                d3.select(this).style("fill", "LightSkyBlue");
                d3.select("#times").text("");
            })
            .transition()
            .duration(750)
            .attr("class", `${svg_id}_bar`)
            .attr("fill", "LightSkyBlue")
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d[1]);
            });

        bar.exit()
            .transition()
            .duration(750)
            .style('opacity', 0)
            .remove();

        // add tooltips
        // g.append("text")
        //     .attr("id", "times")
        //     .style("font-size", "0.8em")
        //     .style("font-weight", "bold");


        var xAxis = d3.axisBottom().scale(x).tickSize(0).tickFormat("");
        g.select(`.${svg_id}_x`)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        g.selectAll("text").text("");

        g.append("text")
            .attr("class", "xlabel")
            .text("duration")
            .attr("x", width / 2)
            .attr("y", height + 25)
            .style("font-size", "1em")
            .style("font-weight", "bold");

        g.append("g").select(`.${svg_id}_y`).call(yAxis);
    }
}