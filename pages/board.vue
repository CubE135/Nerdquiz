<template>
  <NerdContainer>
    <h1 class="p-5 text-4xl text-center">
      <p>Spielbrett:</p>
    </h1>
    <div v-if="boardStatus && board.length > 0" class="flex justify-center text-center">
      <div v-for="boardCategory in board" :key="boardCategory.id" class="px-5 py-2 bg-gray-900">
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
    <div v-if="activeQuestion" class="absolute z-40 flex flex-col items-center transform bg-red-400 w-96 min-h-72 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
      <div v-if="!activeQuestion.started">
        Warten auf den Host...
      </div>
      <div v-if="activeQuestion.started" class="flex items-center justify-center flex-none w-full h-10 border-b border-gray-600">
        <span v-if="activeQuestion.question.type === 'text'">Beantworte folgende Frage:</span>
        <span v-else-if="activeQuestion.question.type === 'video'">Schaue folgendes Video:</span>
        <span v-else-if="activeQuestion.question.type === 'sound'">Höre dir folgenden Sound an:</span>
        <span v-else-if="activeQuestion.question.type === 'choice'">Wähle die richtige Antwort:</span>
      </div>
      <div v-if="activeQuestion.started" class="flex items-center justify-center flex-1 text-center pointer-events-none">
        <div v-if="activeQuestion.question.type === 'text'">
          {{ activeQuestion.question.value }}
          <img v-if="activeQuestion.question.img" :src="activeQuestion.question.img">
        </div>
        <div v-else-if="activeQuestion.question.type === 'choice'">
          {{ activeQuestion.question.value }}
          <div v-for="(value, i) in activeQuestion.question.choices.split(',')" :key="i">
            - {{ value }}
          </div>
          <img v-if="activeQuestion.question.img" :src="activeQuestion.question.img">
        </div>
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
      <div v-if="activeQuestion.started && activeQuestion.question.buzzed && activeQuestion.question.buzzed.player === $socket.name && !answered && activeQuestion.question.inputAnswer === 'ja'" class="flex flex-col items-center justify-center flex-1 text-center">
        <p>Antwort:</p>
        <NerdInput v-model="answer" placeholder="Bitte Antwort eingeben..." />
        <NerdButton text="Absenden" size="sm" @click="sendAnswer" />
      </div>
      <div v-if="activeQuestion.started && activeQuestion.question.answer !== ''" class="flex flex-col items-center justify-center flex-1 text-center">
        <p>Die Antwort von {{ activeQuestion.question.buzzed.player }} lautet:</p>
        <p>{{ activeQuestion.question.answer }}</p>
      </div>
    </div>
    <div v-if="activeQuestion" class="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full cursor-pointer h-44" :class="activeQuestion.question.buzzed ? 'bg-gray-500 no-pointer-events' : 'bg-red-400'" @click="pressBuzzer">
      Buzzer
    </div>

    <!-- Player Table -->
    <div class="relative pt-4 overflow-x-auto shadow-md">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">
              Spieler
            </th>
            <th class="px-6 py-3">
              Punkte
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in players" :key="index" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <td class="px-6 py-4">
              {{ player.name }}
            </td>
            <td class="px-6 py-4">
              {{ player.points }}
            </td>
          </tr>
          <tr v-if="players.length === 0">
            <td colspan="2" class="px-6 py-4">
              -
            </td>
          </tr>
        </tbody>
      </table>
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
      activeQuestion: null,
      answer: '',
      answered: false,
      players: []
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
        this.players = this.$route.params.board.players
      }
    } else {
      this.$router.push({ name: 'index' })
    }

    this.$socket.on('update-board', (board) => {
      this.board = board.board
      this.boardStatus = board.status
      this.activeQuestion = board.activeQuestion
      this.players = board.players

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
      this.answer = ''
      this.answered = false
      this.$socket.emit('buzz')
    },
    stopVideos () {
      const iframes = document.querySelectorAll('iframe')
      Array.prototype.forEach.call(iframes, (iframe) => {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo' }), '*')
      })
    },
    sendAnswer () {
      this.$socket.emit('answer', this.answer)
      this.answer = ''
      this.answered = true
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
