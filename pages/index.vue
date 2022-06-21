<template>
  <div>
    <div class="static w-full h-80">
      <h1 class="z-50 fixed top-0 left-0 text-black text-3xl font-bold leading-5 px-1 py-2 bg-white opacity-80">
        {{ pageTitle }}
      </h1>
      <div id="map" />
    </div>

    <div class="w-[95%] mx-auto">
      <h2 class="text-lg py-2.5 font-semibold">
        Mapbox example(<span class="text-yellow-400">{{ exampleListLength }}</span>)
      </h2>
      <ExampleList
        :list="exampleList"
      />
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
  name: 'IndexPage',
  props: {
    title: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      pageTitle: 'Add 3D terrain to a map',
      accessToken: this.$store.state.accessToken,
      exampleList: this.$store.state.exampleList
    }
  },

  head() {
    return {
      title: this.pageTitle
    }
  },

  computed: {
    exampleListLength() {
      return this.exampleList.length
    }
  },

  mounted() {
    mapboxgl.accessToken = this.accessToken

    // eslint-disable-next-line
    const map = new mapboxgl.Map({
      container: 'map',
      zoom: 13.1,
      center: [-114.34411, 32.6141],
      pitch: 85,
      bearing: 80,
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
    })

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
}
</script>

<style scoped>
#map {
  @apply w-full h-80 absolute top-0 left-0;
}
</style>
