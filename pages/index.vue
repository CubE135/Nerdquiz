<template>
  <div>
    <NerdCenterContainer>
      <div class="flex justify-evenly">
        <NerdButton to="/host" text="Erstellen" size="lg" />
        <NerdButton to="/join" text="Beitreten" size="lg" />
      </div>
    </NerdCenterContainer>
  </div>
</template>

<script>
export default {
  name: 'IndexPage'

}
</script>
