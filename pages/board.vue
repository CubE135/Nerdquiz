<template>
  <NerdContainer>
    <h1 class="p-5 text-4xl text-center">
      <p>Spielbrett:</p>
    </h1>
    <div v-if="boardStatus && board.length > 0" class="flex justify-center text-center">
      <div v-for="boardCategory in board" :key="boardCategory.id" class="px-5 py-2 bg-gray-300">
        <p class="m-1">
          {{ boardCategory.title }}
        </p>
        <div v-for="boardQuestion in boardCategory.questions" :key="boardQuestion.id" class="w-32 py-2 m-1" :class="boardQuestion.color + ' ' + (boardQuestion.question === undefined || boardQuestion?.question?.value === '' ? 'border-2 border-dotted border-black' : 'border-2 border-solid border-black') + (boardQuestion?.question?.answered ? ' answered' : '')">
          <p>
            {{ boardQuestion.level.value }}
          </p>
        </div>
      </div>
    </div>
    <p v-else class="text-center">
      Der Host hat das Spiel noch nicht gestartet!
    </p>

    <div v-if="activeQuestion" class="absolute top-0 left-0 w-screen h-screen bg-black opacity-40" />
    <div v-if="activeQuestion" class="absolute z-10 flex flex-col items-center transform bg-red-400 w-96 h-72 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
      <div class="flex items-center justify-center flex-none w-full h-10 border-b border-gray-600">
        <span v-if="activeQuestion.question.type === 'text'">Beantworte folgende Frage:</span>
        <span v-else-if="activeQuestion.question.type === 'video'">Schaue folgendes Video:</span>
        <span v-else-if="activeQuestion.question.type === 'sound'">Höre dir folgenden Sound an:</span>
      </div>
      <div class="flex items-center justify-center flex-1 pointer-events-none">
        <span v-if="activeQuestion.question.type === 'text'">{{ activeQuestion.question.value }}</span>
        <iframe
          v-else
          width="384"
          height="248"
          :src="activeQuestion.question.value + '?autoplay=1&controls=0&enablejsapi=1'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          :class="activeQuestion.question.type === 'sound' ? 'hidden' : ''"
        />
        <span v-if="activeQuestion.question.type === 'sound'">Genau hinhören...</span>
      </div>
    </div>
    <div v-if="activeQuestion" class="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full cursor-pointer h-44" :class="activeQuestion.question.buzzed ? 'bg-gray-500 no-pointer-events' : 'bg-red-400'" @click="pressBuzzer">
      Buzzer
    </div>
  </NerdContainer>
</template>

<script>
export default {
  name: 'BoardPage',
  data () {
    return {
      roomCode: false,
      board: false,
      boardStatus: false,
      activeQuestion: null
    }
  },
  head () {
    return {
      title: 'Spielbrett'
    }
  },
  mounted () {
    if (this.$socket.code) {
      this.roomCode = this.$socket.code
      if (this.$route.params.board) {
        this.board = this.$route.params.board.board
        this.boardStatus = this.$route.params.board.status
      }
    } else {
      this.$router.push({ name: 'index' })
    }

    this.$socket.on('update-board', (board) => {
      this.board = board.board
      this.boardStatus = board.status
      this.activeQuestion = board.activeQuestion

      if (this.activeQuestion?.question?.buzzed) {
        this.stopVideos()
      }
    })

    this.$socket.on('host-left', () => {
      this.$socket.disconnect()
      this.$socket.connect()
      this.$router.push({ name: 'index' })
    })
  },
  methods: {
    pressBuzzer () {
      this.$socket.emit('buzz')
    },
    stopVideos () {
      const iframes = document.querySelectorAll('iframe')
      Array.prototype.forEach.call(iframes, (iframe) => {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo' }), '*')
      })
    }
  }
}
</script>

<style scoped>

.answered {
    pointer-events: none;
    filter: grayscale(1);
}
.no-pointer-events {
  pointer-events: none;
}
</style>
