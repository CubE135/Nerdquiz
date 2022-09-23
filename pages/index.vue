<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <img src="~/assets/img/logo.png" class="mb-4" alt>
      <div class="flex justify-evenly">
        <!-- <NerdButton text="Erstellen" size="sm" /> -->
        <!-- <NerdButton text="Erstellen" size="md" /> -->
        <NerdButton text="Erstellen" size="lg" />
        <!-- <NerdButton text="Erstellen" size="xl" /> -->
        <NerdButton text="Beitreten" size="lg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>

<style scoped>
img {
  width: 250px;
}
</style>
