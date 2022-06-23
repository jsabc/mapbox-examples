<template>
  <a
    class="block cursor-pointer relative h-40 box-border border-2 border-transparent  bg-gray-100 bg-auto bg-center bg-no-repeat duration-300 ease-in-out  hover:border-blue-400 hover:shadow-lg"
    :style="{backgroundImage: `url(${webp})`}"
    @click="handleClick(title)"
  >
    <div class="p-2 bg-white bg-opacity-75">
      <div class="text-blue-500 font-medium leading-4">
        {{ title }}
      </div>
    </div>
  </a>
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

  emits: ['click'],

  computed: {
    url() {
      return this.title.replace(/ /g, '_').toLowerCase()
    }
  },

  methods: {
    handleClick(value) {
      this.$emit('click', value)
    }
  }
}
</script>
