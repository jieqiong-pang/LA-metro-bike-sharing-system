<template>
  <div class="dv_heatmap_map_container">
    <div id="map"></div>
    <div class="map-overlay top">
      <div class="map-overlay-inner">
        <h2>Quarterly Station Popularity Heatmap</h2>
        <label id="quarter"></label>
        <input id="slider" type="range" min="0" max="15" step="1" value="0" />
      </div>
      <div class="map-overlay-inner">
        <div id="legend" class="legend">
          <div class="bar"></div>
          <div>Popularity</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default {
  name: "Heatmap",
  data() {
    return {
      data: null,
      quarters: [
        "2016-q3",
        "2016-q4",
        "2017-q1",
        "2017-q2",
        "2017-q3",
        "2017-q4",
        "2018-q1",
        "2018-q2",
        "2018-q3",
        "2018-q4",
        "2019-q1",
        "2019-q2",
        "2019-q3",
        "2019-q4",
        "2020-q1",
        "2020-q2",
      ]
    };
  },
  // props: [selected_area],
  methods: {
    loadData() {
      const pth_data = `${this.$store.state.publicPath}heatmap/heatmap_1.json`;
      
      d3.json(pth_data).then((data) => {
        this.data = data;
        this.initMap();
      });
    },
    initMap() {
      // const that = this;
      const area_setup = 
      {
        'DTLA': {'center': [-118.26, 34.06],
        'zoom': 11.4},
        'Pasadena': {'center': [-118.16, 34.15],
        'zoom': 12},
        'Port of LA': {'center': [-118.26, 33.74],
        'zoom': 11.8},
        'Westside': {'center': [-118.43, 34],
        'zoom': 11.8},
        'North Hollywood': {'center': [-118.376, 34.16],
        'zoom': 12.6}
      };
      mapboxgl.accessToken =
        "pk.eyJ1IjoibGlubGU2NiIsImEiOiJja2dyaW9kY3MwMjh1MnFtNTgydmtiM2w0In0.NLxFXqHc_38MbmqOfPpOWA";
      var map = new mapboxgl.Map({
        container: "map", // container id
        style: "mapbox://styles/mapbox/light-v10",
        // center: area_setup[that.selected_area]['center'],
        // zoom: area_setup[that.selected_area]['zoom'],
        center: area_setup['DTLA']['center'],
        zoom: area_setup['DTLA']['zoom'],
      });
      const that = this;

      map.on("load", function() {
        map.loadImage(
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/20px-Map_marker.svg.png',
            function (error, image) 
            {
              if (error) throw error;
              map.addImage('marker', image);
              map.addSource("heatmaps", {
                type: "geojson",
                data: that.data
              });

              that.quarters.forEach(function (quarter, index) 
              {
                map.addLayer(
                  {
                  'id': `heatmap-marker-${index}`,
                  'type': 'symbol',
                  'source': 'heatmaps',
                  'layout': {
                    // make layer not visible by default
                    'visibility': 'none',
                    'icon-image': 'marker',
                    'icon-size': 0.8,
                    'icon-allow-overlap': true,
                    'text-field': [
                      'get', 'station_name'
                      ],
                      'text-font': [
                        'Open Sans Bold',
                        'Arial Unicode MS Bold'
                      ],
                      'text-size': 12
                  },
                  'paint': {
                    'text-color': '#000000'
                  },
                  'filter': ['==', ["get", "top_10", ["get", `${quarter}`]], true]
                  });
                
                map.addLayer(
                {
                  id: `heatmap-heat-${index}`,
                  type: "heatmap",
                  source: "heatmaps",
                  maxzoom: 15,
                  layout: {
                    // make layer not visible by default
                    'visibility': 'none'
                  },
                  paint: {
                    // Increase the heatmap weight based on frequency and property popularity
                    "heatmap-weight": [
                      "interpolate",
                      ["linear"],
                      ["get", "tot_pop", ["get", `${quarter}`]],
                      70,
                      0,
                      2000,
                      1,
                    ],
                    // Increase the heatmap color weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      1,
                      1,
                      12,
                      5,
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    "heatmap-color": [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(33,102,172,0)",
                      0.2,
                      "rgb(103,169,207)",
                      0.3,
                      "rgb(209,229,240)",
                      0.4,
                      "rgb(253,219,199)",
                      0.5,
                      "rgb(239,138,98)",
                      1,
                      "rgb(178,24,43)",
                    ],
                    // Adjust the heatmap radius by zoom level
                    "heatmap-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      10,
                      40,
                      20,
                      70,
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      10,
                      1,
                      13,
                      0.6,
                    ],
                  },
                },
                "waterway-label"
              );

                map.addLayer(
                  {
                    id: `heatmap-point-${index}`,
                    type: "circle",
                    source: "heatmaps",
                    minzoom: 10,
                    layout: {
                      // make layer not visible by default
                      'visibility': 'none'
                    },
                    paint: {
                      // Size circle radius by popularities and zoom level
                      "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        ["interpolate", ["linear"], ["get", "tot_pop", ["object", ["get", `${quarter}`]]], 
                        0, 0,
                        50, 1, 
                        250, 1.5,
                        500, 2,
                        1000, 2.5,
                        5000, 3,
                        10000, 3.5,
                        20000, 4
                        ],
                        11,
                        ["interpolate", ["linear"], ["get", "tot_pop", ["object", ["get", `${quarter}`]]], 
                        0, 0,
                        50, 3, 
                        250, 4,
                        500, 5,
                        1000, 6,
                        5000, 7,
                        10000, 8,
                        20000, 9
                        ],
                      ],
                      // Color circle by popularities
                      "circle-color": [
                        "interpolate",
                        ["linear"],
                        ["get", "tot_pop", ["object", ["get", `${quarter}`]]], 
                        1,
                        "#fef0d9",
                        25,
                        "#fdd49e",
                        50,
                        "#fdbb84",
                        100,
                        "#fc8d59",
                        500,
                        "#ef6548",
                        1000,
                        "#d7301f",
                        20000,
                        "#990000",
                      ],
                      "circle-opacity": ["interpolate", ["linear"], ["zoom"], 10.4, 0, 14.5, 1],
                    },
                  },
                  "waterway-label"
                );
              
              });

              document.getElementById('quarter').textContent = that.quarters[0];

              map.setLayoutProperty(
                  'heatmap-marker-0',
                  'visibility', 'visible'
                  );
              
              map.setLayoutProperty(
                  'heatmap-heat-0',
                  'visibility', 'visible'
                  );
              
              map.setLayoutProperty(
                  'heatmap-point-0',
                  'visibility', 'visible'
                  );

              var temp = [0];

              document.getElementById("slider").addEventListener("input", function(e) {
                document.getElementById('quarter').textContent = that.quarters[e.target.value];
                temp.push(e.target.value);
                
                map.setLayoutProperty(
                  `heatmap-marker-${temp[0]}`,
                  'visibility', 'none'
                  );
                
                map.setLayoutProperty(
                  `heatmap-heat-${temp[0]}`,
                  'visibility', 'none'
                  );
                
                map.setLayoutProperty(
                  `heatmap-point-${temp[0]}`,
                  'visibility', 'none'
                  );
                
                temp.splice(0,1);

                map.setLayoutProperty(
                  `heatmap-marker-${e.target.value}`,
                  'visibility', 'visible'
                  );
                
                map.setLayoutProperty(
                  `heatmap-heat-${e.target.value}`,
                  'visibility', 'visible'
                  );
                
                map.setLayoutProperty(
                  `heatmap-point-${e.target.value}`,
                  'visibility', 'visible'
                  );
              }); 
      
            }
        );
      });
    },
  },
  mounted() {
    this.loadData();
  },
};

// this.data.features.map(f => f.properties[this.selected].tot_pop)
</script>

<style lang="scss" scoped>
.dv_heatmap_map_container {
  position: relative;
  height: 100%;
  width: 100%;
}

#map {
  // position: absolute;
  // top: $navbar-height + 25px;
  // bottom: 0;
  height: 100%;
  width: 100%;
}

.map-overlay {
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 25%;
  top: 5px;
  left: 0;
  padding: 10px;
}

.map-overlay .map-overlay-inner {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.map-overlay h5 {
  line-height: 18px;
  display: block;
  margin: 0 0 10px;
}

.map-overlay .legend .bar {
  height: 10px;
  width: 100%;
  background: linear-gradient(to right, #fef0d9, #990000);
}

.map-overlay input {
  background-color: transparent;
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0;
  cursor: ew-resize;
}
</style>
