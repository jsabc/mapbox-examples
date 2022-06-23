<template>
  <div class="grid grid-cols-4 gap-2.5">
    <!-- eslint-disable -->
    <ExampleListItem
      v-for="(item, index) in list"
      :key="index"
      :id="item.id"
      :title="item.title"
      :webp="item.webp"
      @click="handleClick"
    />
    <!-- eslint-enable -->
  </div>
</template>

<script>
export default {
  name: 'ExampleList',
  props: {
    list: {
      type: Array,
      required: true
    }
  },

  emits: ['click'],

  methods: {
    handleClick(value) {
      this.$emit('click', value)
    }
  }
}
</script>
