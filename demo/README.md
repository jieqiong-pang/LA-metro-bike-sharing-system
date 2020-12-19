# demo

## Project setup
```
npm ci
```

## Geojson
### station (GeoFeature example)
- in `public/station/`
```json
{
  "type": "Feature",
  "id": 3005,
  "geometry": {
    "type": "Point",
    "coordinates": [-118.258537, 34.0485]
  },
  "properties": {
    "station": 3005,
    "station_name": "7th & Flower",
    "go_live_date": "7/7/2016",
    "region": "DTLA",
    "lan": 34.0485,
    "lon": -118.25853700000002,
    "trip_duration_distribution": [],
    "times_departure": [],
    "times_return": [],
    "busy24": {},
    "related_station": {},
    "total_min_related": 168468,
    "total_times_related": 7415
  }
}
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
