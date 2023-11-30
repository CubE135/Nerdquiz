<template>
  <NerdContainer>
    <!-- Room Code -->
    <h1 ref="heading" class="p-5 text-4xl font-bold text-center text-gray-700 bg-lightwhite dark:bg-gray-700 dark:text-gray-400">
      <p>Room Code:</p>
      <p v-if="roomCode">
        {{ roomCode }}
      </p>
    </h1>

    <!-- Start Question -->
    <div
      v-if="drag && !activeQuestion"
      class="absolute flex items-center justify-center h-24 w-96 transform top-2.5 left-2/4 -translate-x-2/4"
      :class="dragHoverType === 'dragStartQuestion' ? 'bg-red-400' : 'bg-red-600'"
      @mouseover="!activeQuestion ? dragMouseover('dragStartQuestion', null) : null"
      @mouseout="!activeQuestion ? dragMouseover(null, null) : null"
    >
      Frage Starten
    </div>

    <!-- ActiveQuestion -->
    <div v-if="activeQuestion" class="absolute top-0 left-0 w-screen h-screen bg-black opacity-40" />
    <div v-if="activeQuestion" class="absolute z-40 flex flex-col items-center transform bg-red-400 w-96 h-72 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
      <div class="flex items-center justify-center flex-none w-full h-10 border-b border-gray-600">
        <span v-if="activeQuestion.question.type === 'text'">Beantworte folgende Frage:</span>
        <span v-else-if="activeQuestion.question.type === 'video'">Schaue folgendes Video:</span>
        <span v-else-if="activeQuestion.question.type === 'sound'">Höre dir folgenden Sound an:</span>
        <span v-else-if="activeQuestion.question.type === 'choice'">Wähle die richtige Antwort:</span>
      </div>
      <div class="flex items-center justify-center flex-1 text-center pointer-events-none">
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
          :set="params = !!activeQuestion.question.videoStart && !!activeQuestion.question.videoEnd ? `&start=${activeQuestion.question.videoStart}&end=${activeQuestion.question.videoEnd}` : !!activeQuestion.question.videoStart ? '&start=' + activeQuestion.question.videoStart : !!activeQuestion.question.videoEnd ? '&end=' + activeQuestion.question.videoEnd : ''"
          width="384"
          height="248"
          :src="activeQuestion.question.value + '?autoplay=1&controls=0&enablejsapi=1' + params"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          :class="activeQuestion.question.type === 'sound' ? 'hidden' : ''"
        />
        <span v-if="activeQuestion.question.type === 'sound'">Genau hinhören...</span>
      </div>
      <div>
        <div class="inline-block px-2 py-1 m-1 text-sm bg-gray-300 rounded-md shadow cursor-pointer hover:bg-gray-400" @click="startActiveQuestion">
          Frage Starten
        </div>
        <div class="inline-block px-2 py-1 m-1 text-sm bg-gray-300 rounded-md shadow cursor-pointer hover:bg-gray-400" @click="closeActiveQuestion">
          Frage Schließen
        </div>
      </div>
    </div>
    <div v-if="activeQuestion && activeQuestion.question.buzzed" class="absolute bottom-0 left-0 z-10 flex flex-col items-center justify-center w-full bg-red-400 h-44">
      <p>{{ activeQuestion.question.buzzed.player }} hat gebuzzert!</p>
      <p v-if="activeQuestion.question.answer !== ''">
        {{ activeQuestion.question.buzzed.player }} hat geantwortet: {{ activeQuestion.question.answer }}
        <br>
        Die richtige Lösung ist: {{ activeQuestion.question.solution }}
      </p>
    </div>

    <!-- Board -->
    <div v-if="board.length >0" class="flex justify-center text-center" :style="drag ? 'pointer-events: none' : ''">
      <div v-for="boardCategory in board" :key="boardCategory.id" class="px-5 py-2 mt-2 bg-lightwhite dark:bg-gray-700">
        <p class="m-1">
          <NerdInput v-model="categories.find((category) => { return category.id === boardCategory.id }).title" classes="w-32 justify-center text-center" placeholder="Kategorie Titel" />
        </p>
        <div v-for="boardQuestion in boardCategory.questions" :key="boardQuestion.id" class="w-32 py-2 m-1" :class="boardQuestion.color + ' ' + (boardQuestion.question === undefined || boardQuestion?.question?.value === '' ? 'border-2 border-dotted border-black' : 'border-2 border-solid border-black') + (boardQuestion?.question?.answered ? ' answered' : '')">
          <p :class="activeQuestion && activeQuestion?.question?.id === boardQuestion?.question?.id ? 'no-pointer-events' : ''" @click="openModal('modalQuestion_' + boardCategory.id + '_' + boardQuestion.level.id); initQuestion(boardCategory.id, boardQuestion.level.id);">
            {{ boardQuestion.level.value }}
          </p>
          <NerdModal :ref="'modalQuestion_' + boardCategory.id + '_' + boardQuestion.level.id" title="Frage bearbeiten" save-text="Board Updaten">
            <template v-if="questions.find((question) => { return question.category === boardCategory.id && question.level === boardQuestion.level.id})" #content>
              <div class="flex flex-col" :set="questionToEdit = questions.find((question) => { return question.category === boardCategory.id && question.level === boardQuestion.level.id})" @save="updateBoard">
                <NerdSelect v-model="questionToEdit.type" :options="questionTypes" />

                <NerdInput v-model="questionToEdit.value" :placeholder="['text', 'choice'].includes(questionToEdit.type) ? 'Frage eingeben' : 'Video URL eingeben'" width="w-96" />

                <NerdInput v-if="['choice'].includes(questionToEdit.type)" v-model="questionToEdit.choices" placeholder="Antwortmöglichkeiten, mit \',\' getrennt" />

                <NerdInput v-if="['text', 'choice'].includes(questionToEdit.type)" v-model="questionToEdit.img" placeholder="Bild URL eingeben (Optional)" />

                <NerdInput v-if="!['text', 'choice'].includes(questionToEdit.type)" v-model="questionToEdit.videoStart" placeholder="Startzeit in Sekunden (Optional)" />
                <NerdInput v-if="!['text', 'choice'].includes(questionToEdit.type)" v-model="questionToEdit.videoEnd" placeholder="Endzeit in Sekunden (Optional)" />

                <p>Lösung:</p>

                <NerdInput v-model="questionToEdit.solution" placeholder="Dient dem Host als Erinnerung" />

                <p>Antwort eingeben:</p>
                <NerdSelect v-model="questionToEdit.inputAnswer" :options="['ja', 'nein']" />
              </div>
            </template>
          </NerdModal>

          <div
            v-if="boardQuestion.question !== undefined && roomStarted && (!activeQuestion || activeQuestion.question.id === boardQuestion.question.id)"
            :key="dragKey"
            v-draggable
            class="dragBody"
            :class="drag ? 'no-pointer-events' : ''"
            style="transform: translate(0px, 0px) translateX(38px) translateY(-37px); cursor: grab;"
            :style="drag === boardCategory.id + '_' + boardQuestion.level.id ? 'opacity: 1;' : ''"
            @start="drag = boardCategory.id + '_' + boardQuestion.level.id"
            @stop="dragStop(boardQuestion)"
          >
            {{ boardQuestion.level.value }}
          </div>
        </div>
        <NerdButton text="Löschen" size="sm" :class="roomStarted ? 'disabled' : ''" @click="removeCategory(boardCategory.id)" />
      </div>
      <div v-if="board.length > 0" class="flex flex-col p-5 pr-6 text-center bg-middlegray" style="padding-top: 40px;">
        <NerdButton
          v-for="level in levels"
          :key="level.id"
          text="Löschen"
          size="sm"
          class="deleteBtn"
          :class="roomStarted ? 'disabled' : ''"
          @click="removeLevel(level.id)"
        />
      </div>
    </div>

    <!-- Board Actions -->
    <div v-else class="px-5 py-2 font-bold text-center text-gray-700 bg-lightwhite test-sm">
      Füge Kategorien und Level hinzu!
    </div>
    <div :style="drag ? 'pointer-events: none' : ''">
      <div class="flex justify-center">
        <NerdButton class="w-48" :class="categories.length >= 10 || roomStarted ? 'disabled' : ''" text="Kategorie hinzufügen" size="sm" @click="openModal('modalCategory')" />
        <NerdButton class="w-48" :class="levels.length >= 9 || roomStarted ? 'disabled' : ''" text="Level hinzufügen" size="sm" @click="openModal('modalLevel')" />
      </div>
    </div>

    <!-- Player Table -->
    <div class="relative mt-2 overflow-x-auto shadow-md">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-sm text-gray-700 uppercase bg-lightwhite dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">
              Spieler
            </th>
            <th class="px-6 py-3">
              Punkte
            </th>
            <th class="px-6 py-3">
              Plus
            </th>
            <th class="px-6 py-3">
              Minus
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in players" :key="index" class="border-b bg-lightwhite dark:bg-gray-900 dark:border-gray-700">
            <td class="px-6 py-4">
              {{ player.name }}
            </td>
            <td class="px-6 py-4">
              {{ player.points }}
            </td>
            <td class="p-4 text-xl text-center text-black border border-slate-300 adjustPointsContainer add" :class="dragHoverType === 'dragPlayerPoints' && dragHoverData.add && dragHoverData.player === index ? '' : 'disabled'" @mouseover="dragMouseover('dragPlayerPoints', { player: index, add: true })" @mouseout="dragMouseover(null, null)">
              +
            </td>
            <td class="p-4 text-xl text-center text-black border border-slate-300 adjustPointsContainer remove" :class="dragHoverType === 'dragPlayerPoints' && !dragHoverData.add && dragHoverData.player === index ? '' : 'disabled'" @mouseover="dragMouseover('dragPlayerPoints', { player: index, add: false })" @mouseout="dragMouseover(null, null)">
              -
            </td>
          </tr>
          <tr v-if="players.length === 0">
            <td colspan="4" class="w-full text-sm text-left text-gray-500 dark:text-gray-400" />
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-center">
      <NerdButton class="w-40" text="Spiel starten" size="sm" :disabled="roomStarted || (categories.length === 0 || levels.length === 0)" @click="startGame" />
    </div>

    <!-- Modals -->
    <NerdModal ref="modalCategory" title="Kategorie hinzufügen" @save="addNewCategory">
      <template #content>
        <NerdInput v-model="forms.category" placeholder="Name eingeben" />
      </template>
    </NerdModal>
    <NerdModal ref="modalLevel" title="Level hinzufügen" @save="addNewLevel">
      <template #content>
        <NerdInput v-model="forms.level" placeholder="Level eingeben" />
      </template>
    </NerdModal>
  </NerdContainer>
</template>

<script>
export default {
  name: 'CreatePage',
  data () {
    return {
      drag: false,
      dragKey: 0,
      dragHoverType: null,
      dragHoverData: null,
      roomCode: false,
      roomStarted: false,
      questionTypes: ['text', 'video', 'sound', 'choice'],
      categories: [],
      levels: [],
      players: [],
      questions: [],
      activeQuestion: null,
      forms: {
        category: '',
        level: '0'
      }
    }
  },
  head () {
    return {
      title: 'Spiel Erstellen'
    }
  },
  computed: {
    colors () {
      return ['red', 'blue', 'orange', 'lime', 'green', 'yellow', 'sky', 'violet', 'pink', 'fuchsia'].sort((a, b) => 0.5 - Math.random())
    },
    board () {
      return this.categories.map((category) => {
        const color = this.colors[category.id]
        return {
          id: category.id,
          title: category.title,
          questions: this.levels.map((level, questionIndex) => {
            const question = this.questions.find((question) => {
              return question.category === category.id && question.level === questionIndex
            })
            return {
              level,
              color: `bg-${color}-${questionIndex + 1}00`,
              question
            }
          })
        }
      })
    }
  },
  watch: {
    board () {
      this.updateBoard()
    }
  },
  mounted () {
    if (!this.roomCode) {
      this.roomCode = this.generateRoomCode(10)
      this.$socket.emit('create-room', this.roomCode)
    }
    window.onpopstate = function () {
      this.$socket.disconnect()
      this.$socket.connect()
    }
    this.$socket.on('player-joined', (players) => {
      this.players = players
      this.updateBoard()
    })
    this.$socket.on('player-left', (players) => {
      this.players = players
      this.updateBoard()
    })
    this.$socket.on('player-buzzed', (player) => {
      this.activeQuestion.question.buzzed = {
        status: true,
        player
      }
      this.updateBoard()
      this.stopVideos()
    })

    this.$socket.on('answered', (answer) => {
      this.activeQuestion.question.answer = answer
      this.updateBoard()
    })
  },
  methods: {
    generateRoomCode (length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
    updateBoard () {
      this.$socket.emit('update-board', this.board, this.roomStarted, this.activeQuestion, this.players)
    },
    openModal (ref) {
      if (this.$refs[ref] instanceof Array) {
        this.$refs[ref][0].toggleModal()
      } else {
        this.$refs[ref].toggleModal()
      }
    },
    initQuestion (categoryId, levelId) {
      const question = this.questions.find((question) => {
        return question.category === categoryId && question.level === levelId
      })
      if (!question) {
        let max = 0
        if (this.questions.length > 0) {
          max = Math.max(...this.questions.map(q => q.id))
        } else {
          max = 0
        }
        this.questions.push({
          id: max + 1,
          category: categoryId,
          level: levelId,
          answered: false,
          answer: '',
          solution: '',
          buzzed: false,
          type: 'text',
          value: '',
          img: '',
          videoStart: false,
          videoEnd: false,
          inputAnswer: 'ja'
        })
      }
    },
    addNewCategory () {
      const max = Math.max(...this.categories.map(c => c.id))
      let id = max + 1
      if (this.categories.length === 0) {
        id = 0
      }
      this.categories.push({
        id,
        title: this.forms.category
      })
      this.forms.category = ''
    },
    removeCategory (categoryId) {
      this.categories = this.categories.filter((category) => {
        return category.id !== categoryId
      })
      this.questions = this.questions.filter((question) => {
        return question.category !== categoryId
      })
    },
    addNewLevel () {
      const max = Math.max(...this.levels.map(l => l.id))
      let id = max + 1
      if (this.levels.length === 0) {
        id = 0
      }
      this.levels.push({
        id,
        value: this.forms.level
      })
      this.levels = this.levels.sort(function (a, b) {
        return a.value - b.value
      })
      this.forms.level = '0'
    },
    removeLevel (levelId) {
      this.levels = this.levels.filter((level) => {
        return level.id !== levelId
      })
      this.questions = this.questions.filter((question) => {
        return question.level !== levelId
      })
    },
    updateCategoryName (value, index) {
      this.categories[index] = value
      this.updateBoard()
    },
    startGame () {
      this.roomStarted = true
      this.updateBoard()
    },
    dragStop (question) {
      switch (this.dragHoverType) {
        case 'dragPlayerPoints':
          this.modifyPlayerPoints(question)
          break
        case 'dragStartQuestion':
          this.setActiveQuestion(question)
          break
        default:
          break
      }

      this.dragKey = Math.random(1, 1000)
      this.drag = false
      this.dragHoverType = null
      this.dragHoverData = null
    },
    dragMouseover (type, data) {
      if (this.drag === false) { return }

      if (type === null) {
        this.dragHoverType = null
        this.dragHoverData = null
      } else {
        this.dragHoverType = type
        this.dragHoverData = data
      }
    },
    modifyPlayerPoints (question) {
      if (question) {
        if (this.dragHoverData.add) {
          this.players[this.dragHoverData.player].points += parseInt(question.level.value)
        } else {
          this.players[this.dragHoverData.player].points -= parseInt(question.level.value)
        }

        this.questions.find((quest) => {
          return quest.id === question.question.id
        }).answered = true
        this.activeQuestion = null
        this.updateBoard()
      }
    },
    setActiveQuestion (question) {
      this.questions.find((quest) => {
        return quest.id === question.question.id
      }).answer = ''
      this.activeQuestion = question
      this.activeQuestion.started = false
      this.updateBoard()
    },
    closeActiveQuestion () {
      this.activeQuestion.question.buzzed = false
      this.activeQuestion = null
      this.updateBoard()
    },
    startActiveQuestion () {
      this.activeQuestion.started = true
      this.updateBoard()
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
.deleteBtn {
  margin: 9.5px 0px;
}
.dragBody {
  position: absolute;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}
.adjustPointsContainer.add {
  background-color: green;
}
.adjustPointsContainer.remove {
  background-color: red;
}
.no-pointer-events {
  pointer-events: none;
}
.disabled {
  filter: opacity(0.7);
}
.answered {
    pointer-events: none;
    filter: grayscale(1);
}
</style>
