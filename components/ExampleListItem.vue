<template>
  <div
    class="relative h-40 bg-gray-100 bg-auto bg-center bg-no-repeat"
    :style="{backgroundImage: `url(${webp})`}"
  >
    <div class="text-center p-2 bg-white bg-opacity-75">
      <NuxtLink :to="url" class="text-blue-500 font-medium leading-4 hover:underline">
        {{ title }}
      </NuxtLink>
    </div>
    <div :id="`map-${id}`" />
  </div>
</template>

<script>
export default {
  name: 'ExampleListItem',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    webp: {
      type: String,
      required: true
    }
  },

  computed: {
    url() {
      return this.title.replace(/ /g, '_').toLowerCase()
    }
  }
}
</script>
