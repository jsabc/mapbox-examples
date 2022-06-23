import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

const accessToken = 'pk.eyJ1Ijoic3o2NjY2NjYiLCJhIjoiY2tuam44NXZzMDEwMzJ1cGV3djR6OHA5cCJ9.2LA3YOPHRLTTB25CvAoIdw'

const MapboxGl = {
  /* eslint-disable */
  ['Display a web map using an alternate projection'](that) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 0.6,
      projection: 'naturalEarth'
    })

    that.mapInstance = map
  },

  ['Display a map on a webpage'](that) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    })

    that.mapInstance = map
  },

  ['Accept coordinates as input to a geocoder'](that) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4512, 43.6568],
      zoom: 8
    })

    that.mapInstance = map

    const coordinatesGeocoder = function(query) {
      const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      )

      if (!matches) {
        return null
      }

      function coordinateFeature(lng, lat) {
        return {
          center: [lng, lat],
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
            place_name: `Lat: ${lat} Lng: ${lng}`,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
          }
        }
      }

      const coord1 = Number(matches[1])
      const coord2 = Number(matches[2])
      const geocodes = []

      if (coord1 < -90 || coord1 > 90) {
        geocodes.push(coordinateFeature(coord1, coord2))
      }

      if (coord2 < -90 || coord2 > 90 ) {
        geocodes.push(coordinateFeature(coord2, coord1))
      }

      if (geocodes.length === 0) {
        geocodes.push(coordinateFeature(coord1, coord2))
        geocodes.push(coordinateFeature(coord2, coord1))
      }

      return geocodes
    }

    map.addControl(
      new MapboxGeocoder({
        mapboxgl,
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: 'Try: -40, 170',
        reverseGeocode: true
      })
    )
  },

  ['Add 3D terrain to a map'](that) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      zoom: 13.1,
      center: [-114.34411, 32.6141],
      pitch: 85,
      bearing: 80,
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
    })

    that.mapInstance = map

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })

      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      // add a sky layer that will show when the map is highly pitched
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      })
    })
  }

  /* eslint-enable */
}

export default MapboxGl
