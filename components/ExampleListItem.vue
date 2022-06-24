<template>
  <a
    class="flex relative justify-center items-center cursor-pointer h-[135px] bg-gray-100 overflow-clip hover:shadow-lg"
    @click="handleClick(title)"
  >
    <div
      class="absolute top-0 left-0 w-full h-full bg-contain bg-center bg-no-repeat duration-500 ease-in-out hover:scale-125"
      :style="{backgroundImage: `url(${webp})`}"
    />
    <div class="relative z-[10] w-[50%] text-sm p-2 bg-blue-500/70">
      <div class="text-white font-medium leading-4">
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
