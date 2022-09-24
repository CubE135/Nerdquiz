<template>
  <select
    v-model="selectVal"
    class="p-1 rounded-md shadow focus:outline-none focus:ring focus:ring-gray-300"
  >
    <option v-for="(option) in options" :key="option">
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    selectVal: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val.toString())
      }
    }
  }
}
</script>
