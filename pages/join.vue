<template>
  <NerdCenterContainer>
    <div class="flex justify-center flex-col">
      <NerdInput placeholder="Code eingeben" />
      <NerdButton text="Beitreten" size="lg" />
    </div>
  </NerdCenterContainer>
</template>

<script>
export default {
  name: 'JoinPage',
  head () {
    return {
      title: 'Spiel beitreten'
    }
  }
}
</script>
