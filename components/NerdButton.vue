<template>
  <NuxtLink v-if="to" :to="to">
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 group border-2 border-darkorange group-hover:from-darkorange group-hover:via-darkorange group-hover:to-lightorange hover:font-medium hover:text-black dark:text-white" :disabled="disabled" @click="clickEvent">
      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent hover:bg-gradient-to-br group-hover:from-darkorange group-hover:via-darkorange group-hover:to-lightorange w-full" :class="style">
        {{ text }}
      </span>
    </button>
  </NuxtLink>

  <button v-else class="mt-3 relative inline-flex items-center justify-center p-0.5 mb-2 mx-2 overflow-hidden text-sm font-medium text-gray-900 group border-2 border-darkorange group-hover:from-darkorange group-hover:via-darkorange group-hover:to-lightorange hover:text-black hover:text-sm dark:text-white" :disabled="disabled" @click="clickEvent">
    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent group-hover:bg-gradient-to-br group-hover:from-darkorange group-hover:via-darkorange group-hover:to-lightorange w-full" :class="style">
      {{ text }}
    </span>
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
