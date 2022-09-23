<template>
  <input v-model="value" class="m-1 p-1 rounded-md shadow focus:outline-none focus:ring focus:ring-gray-300" :placeholder="placeholder" @input="input"></input>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    input () {
      this.$emit('input', this.value)
    }
  }
}
</script>
