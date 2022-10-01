<template>
  <NuxtLink v-if="to" :to="to">
    <button class="bg-gray-300 rounded-md shadow hover:bg-gray-400" :class="style + margin + isDisabled" :disabled="disabled" @click="clickEvent">
      {{ text }}
    </button>
  </NuxtLink>

  <button v-else class="bg-gray-300 rounded-md shadow hover:bg-gray-400" :class="style + margin + isDisabled" @click="clickEvent">
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: '',
      required: false
    },
    text: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'sm',
      required: false
    },
    margin: {
      type: String,
      default: 'm-1',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    style () {
      switch (this.size) {
        case 'sm':
          return 'py-1 px-2 text-sm '
        case 'md':
          return 'py-1 px-4 text-lg '
        case 'lg':
          return 'py-3 px-6 text-xl '
        case 'xl':
          return 'py-3 px-10 text-3xl '
        default:
          return 'py-4 px-8'
      }
    },
    isDisabled () {
      return this.disabled ? ' disabled' : ''
    }
  },
  methods: {
    clickEvent () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.disabled {
    pointer-events: none;
    background-color: rgb(177 177 177);
    color: #878787;
}
</style>
