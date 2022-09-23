<template>
  <div
    class="
      relative
      flex
      items-top
      justify-center
      min-h-screen
      bg-gray-100
      sm:items-center sm:pt-0
    "
  >
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <NerdLogo v-if="logo" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logo: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
