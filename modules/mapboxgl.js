import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

const accessToken = 'pk.eyJ1Ijoic3o2NjY2NjYiLCJhIjoiY2tuam44NXZzMDEwMzJ1cGV3djR6OHA5cCJ9.2LA3YOPHRLTTB25CvAoIdw'

const MapboxGl = {
  /* eslint-disable */
  ['Display a web map using an alternate projection'](scope) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 0.6,
      projection: 'naturalEarth'
    })

    scope.map = map
  },

  ['Display a map on a webpage'](scope) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    })

    scope.map = map
  },

  ['Accept coordinates as input to a geocoder'](scope) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4512, 43.6568],
      zoom: 8
    })

    scope.map = map

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

  ['Add 3D terrain to a map'](scope) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      zoom: 13.1,
      center: [-114.34411, 32.6141],
      pitch: 85,
      bearing: 80,
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
    })

    scope.map = map

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })

      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      // add a sky layer scope will show when the map is highly pitched
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
  },

  ['Add a 3D model'](scope) {
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 18,
      center: [148.9819, -35.3981],
      pitch: 60,
      antialias: true
    })

    scope.map = map

    const modelOrigin = [148.9819, -35.39847]
    const modelAltitude = 0
    const modelRotate = [Math.PI / 2, 0, 0]

    const modelAsMercatorCoordinate =
      mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      )

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale:
        modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    }

    /*
    const customLayer = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function(map, gl) {
        this.camera = new THREE.Camera()
        this.scene = new THREE.Scene()

        const directionLight = new THREE.DirectionalLight(0xffffff)
        directionLight.position.set(0, -70, 100).normalize()
        this.scene.add(directionLight)

        const directionLight2 = new THREE.DirectionalLight(0xffffff)
        directionLight2.position.set(0, 70, 100).normalize()
        this.scene.add(directionLight2)

        const loader = new GLTFLoader()
        loader.load(
          'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
          (gltf) => {
            this.scene.add(gltf.scene)
          }
        )

        this.map = map

        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true
        })

        this.renderer.autoClear = false
      },

      render: function(gl, matrix) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX
        )

        const rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY
        )

        const rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ
        )

        const m = new THREE.Matrix4().fromArray(matrix)
        const l = new THREE.Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
          )
          .scale(
            new THREE.Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale
            )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ)

        this.camera.projectionMatrix = m.multiply(l)
        this.renderer.resetState()
        this.renderer.render(this.scene, this.camera)
        this.map.triggerRepaint()
      }
    }

    map.on('style.load', () => {
      map.addLayer(customLayer, 'waterway-label')
    })
    */
  },

  ['Add a canvas source'](scope) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const circles = []
    const radius = 20

    if (ctx) {
      canvas.style.display = 'none'
    }

    function Circle(x, y, dx, dy, radius, color) {
      this.x = x
      this.y = y
      this.dx = dx
      this.dy = dy

      this.radius = radius

      this.draw = function () {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.strokeStyle = color
        ctx.stroke()
      }

      this.update = function () {
        if (this.x + this.radius > 400 || this.x - this.radius < 0) {
          this.dx = -this.dx
        }

        if (this.y + this.radius > 400 || this.y - this.radius < 0) {
          this.dy = -this.dy
        }

        this.x += this.dx
        this.y += this.dy

        this.draw()
      }
    }

    for (let i = 0; i < 5; i++) {
      const color = `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`
      const x = Math.random() * (400 - radius * 2) + radius
      const y = Math.random() * (400 - radius * 2) + radius

      const dx = (Math.random() - 0.5) * 2
      const dy = (Math.random() - 0.5) * 2

      circles.push(new Circle(x, y, dx, dy, radius, color))
    }

    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, 400, 400)

      for (let r = 0; r < 5; r++) {
        circles[r].update()
      }
    }

    animate()

    const map = new mapboxgl.Map({
      container: 'map',
      zoom: 5,
      minZoom: 4,
      center: [95.8991, 18.0887],
      style: 'mapbox://styles/mapbox/streets-v11'
    })

    scope.map = map

    map.on('load', () => {
      map.addSource('canvas-source', {
        type: 'canvas',
        canvas: 'canvas', // canvas ID
        coordinates: [
          [91.4461, 21.5006],
          [100.3541, 21.5006],
          [100.3541, 13.9706],
          [91.4461, 13.9706]
        ],
        animate: true
      })
    })

    map.addLayer({
      id: 'canvas-layer',
      type: 'raster',
      source: 'canvas-source'
    })
  },

  ['Add a custom style layer'](scope) {
  },

  ['Add a default marker to a web map'](scope) {
  },

  ['Add a fullscreen control to a map'](scope) {
  },

  ['Add a generated icon to the map'](scope) {
  },

  ['Add a geocoder'](scope) {
  },

  ['Add a georeferenced image'](scope) {
  },

  ['Add a gradient sky layer to a map'](scope) {
  },

  ['Add a line to a map using a GeoJSON source'](scope) {
  },

  ['Add a marker using a place name'](scope) {
  },

  ['Add a new layer below labels'](scope) {
  },

  ['Add a pattern to a polygon'](scope) {
  },

  ['Add a polygon to a map using a GeoJSON source'](scope) {
  },

  ['Add a raster image to a map layer'](scope) {
  },

  ['Add a raster tile source'](scope) {
  }
  /* eslint-enable */
}

export default MapboxGl
