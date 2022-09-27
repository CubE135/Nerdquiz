<template>
  <NerdContainer>
    <h1 class="p-5 text-4xl text-center">
      <p>Room Code:</p>
      <p v-if="roomCode">
        {{ roomCode }}
      </p>
    </h1>
    <div v-if="board.length > 0" class="flex justify-center text-center">
      <div v-for="boardCategory in board" :key="boardCategory.id" class="px-5 py-2 bg-gray-300">
        <p class="m-1">
          {{ boardCategory.title }}
        </p>
        <div v-for="boardQuestion in boardCategory.questions" :key="boardQuestion.id" class="w-32 py-2 m-1" :class="boardQuestion.color + ' ' + (boardQuestion.question === undefined || boardQuestion?.question?.value === '' ? 'border-2 border-dotted border-black' : 'border-2 border-solid border-black')">
          <p>
            {{ boardQuestion.level.value }}
          </p>
        </div>
      </div>
    </div>
  </NerdContainer>
</template>

<script>
import socket from '~/plugins/socket.io.js'

export default {
  name: 'BoardPage',
  data () {
    return {
      roomCode: false,
      board: false
    }
  },
  head () {
    return {
      title: 'Spielbrett'
    }
  },
  mounted () {
    if (socket.code) {
      this.roomCode = socket.code
    } else {
      this.$router.push({ name: 'index' })
    }

    socket.on('update-board', (board) => {
      this.board = board
    })
  }
}
</script>
