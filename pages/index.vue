<template>
  <div>
    <div class="fixed top-0 left-0 right-0 h-72 bg-white z-[100]">
      <h1 class="z-50 fixed top-0 left-0 text-black text-2xl font-bold leading-4 px-2.5 py-4 bg-white opacity-85">
        {{ pageTitle }}
      </h1>
      <div id="map" />
    </div>

    <div class="w-full mx-auto mt-72">
      <h2 class="text-lg py-2.5 font-semibold">
        Mapbox-gl examples(<span class="text-yellow-400">{{ exampleListLength }}</span>)
      </h2>
      <ExampleList
        :list="exampleList"
        @click="handleExampleListItemClick"
      />
    </div>
  </div>
</template>

<script>
import MapboxGl from '@/modules/mapboxgl'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

export default {
  name: 'IndexPage',
  data() {
    return {
      pageTitle: 'Display a web map using an alternate projection',
      exampleList: this.$store.state.exampleList,
      map: null
    }
  },

  head() {
    return {
      title: `${this.pageTitle} | Mapbox-gl Examples`
    }
  },

  computed: {
    exampleListLength() {
      return this.exampleList.length
    }
  },

  mounted() {
    this.renderMap(this.pageTitle)
  },

  methods: {
    renderMap(name) {
      if (this.map) {
        this.map.remove()
      }
      return MapboxGl[name](this)
    },

    handleExampleListItemClick(value) {
      this.pageTitle = value
      this.renderMap(value)
    }
  }
}
</script>

<style scoped>
#map {
  @apply w-full h-72 absolute top-0 left-0;
}
</style>
