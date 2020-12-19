<template>
  <div id="station-map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as d3 from "d3";

// fix icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "Station",
  data() {
    return {
      stations: null,
      map: null,
      markers: null,
      // selected: null
    };
  },
  computed: {
    selected: {
      // index of the selected station
      get() {
        //TODO: cycle get and set
        console.log("map - selected getter triger");
        return this.$store.state.selected_station;
      },
      set(value) {
        console.log("map - set selectd to:", value);
        this.$store.commit("updateSelectedStation", value);
      },
    },
  },
  watch: {
    "$store.state.selected_station" (newId, oldId) {
      // console.log('map - select station change', newId);
      console.log("map - selected in watch:", newId);

      if (newId !== null) {
        const s = this.stations[newId];
        const s_zoom = 15; // TODO: decide, better use fitBounds
        this.map.setView([s.lat, s.lon], s_zoom);
        this.drawNet(newId);
      } else {
        this.removePreviousNet();
      }

      // this.markers[newId].openPopup();
    },
    "$store.state.dataset"() {
      // console.log('in $store.state.dataset, this.selected:', this.selected)
      if (this.selected !== null) {
        this.drawNet(this.selected);
      }
    },
    // '$store.state.selected_station' () {
    //   console.log('map - state.selected_station change')
    // }
  },
  methods: {
    createMap() {
      const vo = this;

      const map_type = {
        openstreetmap: {
          standard:
            "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        },
        mapbox: {
          street:
            "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
          dark:
            "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}",
        },
        thunderforest: {
          open_cycle_map:
            "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          transport:
            "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          landscape:
            "https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          outdoors:
            "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          transport_Dark:
            "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          spinal_map:
            "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          pioneer:
            "https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          mobile_atlas:
            "https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
          neighbourhood:
            "https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=72aae7a37ca1479a9732de4f607a0c08",
        },
      };
      const la = { latlon: [34.0663143, -118.2366334], zoom: 12 };

      let station_map = L.map("station-map", { preferCancas: true }).setView(
        la.latlon,
        la.zoom
      );

      L.tileLayer(map_type.mapbox.street, {
        attribution: "",
        maxZoom: 18,
        // id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoibWFwbGUxZWFmIiwiYSI6ImNrZ2p2MGN1bzF6ZHoycXBkZTJoY2FjaTkifQ.P0XqMfNWtPPxMLV9UvI4BQ",
      }).addTo(station_map);

      // move zoom control to bottom right conner
      station_map.zoomControl.remove();
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(station_map);

      this.markers = this.stations.map(function(stt, i) {
        let latlng = L.latLng(stt.lat, stt.lon);
        // create marker
        let circleMarker = L.circleMarker(latlng).addTo(station_map);

        // create popup for marker
        const popup = L.popup({ closeButton: false }).setContent(
          `<b>${stt.station}</b><br>${stt.station_name}`
        );
        // bind popup with marker
        circleMarker.bindPopup(popup);

        // when hover on the marker, popup shows, this will override the event that "click marker and shows the popup"
        circleMarker
          .on("mouseover", function(e) {
            this.openPopup();
          })
          .on("mouseout", function(e) {
            // cancel open popup by click
            this.closePopup();
          });

        // bind click event to marker
        circleMarker.on("click", function(e) {
          // this.selected change -> station form select change
          vo.selected = i;
        });

        return circleMarker;
      });

      vo.map = station_map;
      this.loadDataset();
    },
    loadDataset() {
      console.log("loadDataset", this.$store.state.year_season);
      this.$store.dispatch("loadDataset", this.$store.state.year_season);
    },
    drawNet(i) {
      // remove previous net
      this.removePreviousNet();

      let stt = this.stations[i];
      // console.log(stt);
      let stt_id = stt.station; // "4276"
      const selected_stt_latLng = [stt.lat, stt.lon];

      const dataset = this.$store.state.dataset;
      // console.log(dataset);

      // statistics
      const connet_stt = new Object();
      dataset.map(function(x, i) {
        if (x.start_station === stt_id) {
          if (connet_stt[x.end_station] === undefined) {
            connet_stt[x.end_station] = { in: 0, out: 0 };
            connet_stt[x.end_station]["in"] = 0;
          }
          connet_stt[x.end_station]["in"]++;
        }

        if (x.end_station === stt_id) {
          if (connet_stt[x.start_station] === undefined) {
            connet_stt[x.start_station] = { in: 0, out: 0 };
            connet_stt[x.start_station]["out"] = 0;
          }
          connet_stt[x.start_station]["out"]++;
        }
      });

      // latLngObj
      const stt_latLng = new Object();
      this.stations.map(function(x, i) {
        stt_latLng[x.station] = [x.lat, x.lon];
      });

      // add latLng
      for (let stt in connet_stt) {
        connet_stt[stt]["latLng"] = stt_latLng[stt];
      }
      console.log("connet_stt", connet_stt);
      // console.log('this.map:', this.map);
      //draw lines
      for (let stt in connet_stt) {
        const v = connet_stt[stt];
        if (!v.latLng) {
          continue;
        }
        // start from target station
        if (v.in > 0) {
          const latlngs = [v.latLng, selected_stt_latLng];
          const line_props = {
            className: "map_out_line",
            weight: 2 * Math.sqrt(v.in),
          };
          const line = L.polyline(latlngs, line_props).addTo(this.map);
          // style of .map_out_line is setted in basics/map.scss
        }
        // end at target station
        if (v.out > 0) {
          const latlngs = [selected_stt_latLng, v.latLng];
          const line_props = {
            className: "map_in_line",
            weight: 2 * Math.sqrt(v.out),
          };
          const line = L.polyline(latlngs, line_props).addTo(this.map);
          // style of .map_in_line is setted in basics/map.scss
        }
      }
    },
    removePreviousNet() {
      d3.selectAll(".map_out_line").remove();
      d3.selectAll(".map_in_line").remove();
    },
  },
  mounted() {
    console.log("mounted");

    if (!this.$store.state.stations) {
      this.$store.dispatch("loadStation").then(() => {
        // get the data after store
        this.stations = this.$store.state.stations;
        console.log("get stations data");
        // console.log(this.stations);
        this.createMap();
      });
    } else {
      this.stations = this.$store.state.stations;
      console.log("already have stations data");
      console.log("stations data contains", this.stations.length, "rows");
      this.createMap();
    }
  },
};
</script>

<style lang="scss" scoped>
#station-map {
  height: 100%;
  width: 100%;
}
</style>
