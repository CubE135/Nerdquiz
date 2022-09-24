<template>
  <input
    v-model="inputVal"
    class="rounded-md shadow focus:outline-none focus:ring focus:ring-gray-300"
    :class="classes + ' ' + width"
    :placeholder="placeholder"
  ></input>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: -1,
      required: false
    },
    placeholder: {
      type: String,
      default: '',
      required: false
    },
    classes: {
      type: String,
      default: 'p-1 m-1',
      required: false
    },
    value: {
      type: String,
      default: '',
      required: false
    },
    width: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    inputVal: {
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
