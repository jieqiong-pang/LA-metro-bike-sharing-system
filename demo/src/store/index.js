import Vue from 'vue'
import Vuex from 'vuex'
import * as d3 from 'd3';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    publicPath: process.env.BASE_URL,
    dataset: null,
    year_season: '2020-q2',
    stations: null,
    selected_station: null   // station id
  },
  mutations: {
    updateSeason(state, payload) {
      state.year_season = payload;
    },
    updateDataset(state, payload) {
      state.dataset = payload;
    },
    loadStationDataset(state, payload) {
      state.stations = payload;
    },
    updateSelectedStation(state, payload) {
      console.log('updata selected station', payload)
      state.selected_station = payload
    }
  },
  actions: {
    loadDataset(context, payload) {
      let file_name = `metro-bike-${payload}.csv`
      console.log(`${context.state.publicPath}processed_data/${file_name}`)

      // parsers
      const timeParser = d3.timeParse("%m/%d/%Y %H:%M")
      const csvDatumParser = d => {
        return {
          station_id: d.trip_id,
          duration: +d.duration,
          start_time: timeParser(d.start_time),
          end_time: timeParser(d.end_time),
          start_station: d.start_station,
          start_lat: +d.start_lat,
          start_lon: +d.start_lon,
          end_station: d.end_station,
          end_lat: +d.end_lat,
          end_lon: +d.end_lon,
          bike_id: d.bike_id,
          plan_duration: +d.plan_duration,
          trip_route_category: d.trip_route_category,
          passholder_type: d.passholder_type,
        }
      }

      return d3.csv(`${context.state.publicPath}processed_data/${file_name}`, d => csvDatumParser(d))
        .then(data => {
          context.commit('updateDataset', data);
        });
    },
    loadStation(context, payload) {
      let file_name = 'metro-bike-stations.csv'
      console.log(`${context.state.publicPath}processed_data/${file_name}`)

      // parsers
      const timeParserStation = d3.timeParse("%m/%d/%Y")
      const csvDatumParserStation = d => {
        return {
          station: d.station,
          station_name: d.station_name,
          go_live_date: timeParserStation(d.go_live_date),
          region: d.region,
          status: d.status,
          lat: +d.lat,
          lon: +d.lon
        }
      }

      return d3.csv(`${context.state.publicPath}processed_data/${file_name}`, d => csvDatumParserStation(d))
        .then(data => {
          context.commit('loadStationDataset', data);
        });
    }
  },
  modules: {
  }
})
