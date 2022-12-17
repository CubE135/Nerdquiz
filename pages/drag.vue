<template>
  <div>
    <div
      class="box"
      style="position: absolute; bottom: 560px; right: 1510px"
      @click="clickMe"
    >
      I can be clicked
    </div>

    <div
      v-draggable="{ position: controlledPosition }"
      class="box"
      style="position: absolute; bottom: 560px; right: 870px"
    >
      I can be dragged
    </div>
  </div>
</template>

<script>
export default {
  name: 'DragDemo',
  data () {
    return {
      controlledPosition: { x: 0, y: 0 }
    }
  },
  methods: {
    clickMe () {
      console.log('click')
      this.controlledPosition.x = -250
      this.controlledPosition.y = -250
    }
  }
}
</script>

<style scoped>
.box {
  height: 250px;
  width: 250px;
  background-color: #ccc;
  border-radius: 5px;
  box-shadow: black 1px 1px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.no-pointer-events {
  pointer-events: none;
}
.hovering {
  background-color: #a1a1a1;
}
.dropped {
  background-color: #6cce84;
}
</style>
