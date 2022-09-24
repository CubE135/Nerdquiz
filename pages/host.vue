<template>
  <NerdContainer>
    <h1 class="p-5 text-4xl text-center">
      RoomCode: aDasd67asd
    </h1>
    <div v-if="board.length > 0" class="flex justify-center text-center">
      <div v-for="boardCategory in board" :key="boardCategory.id" class="px-5 py-2 bg-gray-300">
        <p class="m-1">
          <NerdInput :id="boardCategory.id" :value="categories.find((category) => { return category.id === boardCategory.id }).title" classes="w-32 text-center" @input="updateCategoryName($event, boardCategory.id)" />
        </p>
        <div v-for="boardQuestion in boardCategory.questions" :key="boardQuestion.id" class="w-32 py-2 m-1" :class="boardQuestion.color + ' ' + (boardQuestion.question === undefined || boardQuestion?.question?.value === '' ? 'border-2 border-dotted border-black' : 'border-2 border-solid border-black')">
          <p @click="openModal('modalQuestion_' + boardCategory.id + '_' + boardQuestion.level.id); initQuestion(boardCategory.id, boardQuestion.level.id);">
            {{ boardQuestion.level.value }}
          </p>
          <NerdModal :ref="'modalQuestion_' + boardCategory.id + '_' + boardQuestion.level.id" title="Frage bearbeiten" save-text="Board Updaten" @save="updateBoard">
            <template v-if="questions.find((question) => { return question.category === boardCategory.id && question.level === boardQuestion.level.id})" #content>
              <NerdSelect v-model="questions.find((question) => { return question.category === boardCategory.id && question.level === boardQuestion.level.id}).type" :options="questionTypes" />
              <NerdInput v-model="questions.find((question) => { return question.category === boardCategory.id && question.level === boardQuestion.level.id}).value" placeholder="Frage eingeben" width="w-96" />
            </template>
          </NerdModal>
        </div>
        <NerdButton text="Löschen" size="sm" @click="removeCategory(boardCategory.id)" />
      </div>
      <div v-if="board.length > 0" class="flex flex-col pr-6 text-center bg-gray-300" style="padding-top: 40px;">
        <NerdButton
          v-for="level in levels"
          :key="level.id"
          text="Löschen"
          size="sm"
          class="deleteBtn"
          @click="removeLevel(level.id)"
        />
      </div>
    </div>
    <div v-else class="px-5 py-2 text-center bg-gray-300">
      Füge Kategorien und Level hinzu!
    </div>
    <div class="flex justify-center">
      <NerdButton text="Kategorie hinzufügen" size="sm" @click="openModal('modalCategory')" />
      <NerdButton text="Level hinzufügen" size="sm" @click="openModal('modalLevel')" />
    </div>
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
  </nerdcontainer>
</template>

<script>
export default {
  name: 'CreatePage',
  data () {
    return {
      questionTypes: ['text', 'video', 'sound'],
      categories: [
        {
          id: 0,
          title: 'Technik'
        },
        {
          id: 1,
          title: 'Spiele'
        },
        {
          id: 2,
          title: 'Filme'
        },
        {
          id: 3,
          title: 'Bücher'
        }
      ],
      levels: [
        {
          id: 0,
          value: '100'
        },
        {
          id: 1,
          value: '200'
        },
        {
          id: 2,
          value: '500'
        },
        {
          id: 3,
          value: '800'
        },
        {
          id: 4,
          value: '1000'
        }
      ],
      players: [],
      questions: [
        {
          id: 0,
          category: 2,
          level: 4,
          type: 'video',
          value: 'wie gehts?'
        }
      ],
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
    board () {
      const colors = ['red', 'blue', 'orange', 'lime', 'green', 'yellow', 'sky', 'violet', 'pink', 'amber']
      return this.categories.map((category) => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        const index = colors.indexOf(color)
        colors.splice(index, 1)
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
  methods: {
    updateBoard () {
      // TODO: Send data to players
      console.log('send changes to players')
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
        const max = Math.max(...this.questions.map(q => q.id))
        this.questions.push({
          id: max + 1,
          category: categoryId,
          level: levelId,
          type: 'text',
          value: ''
        })
      }
    },
    addNewCategory () {
      const max = Math.max(...this.categories.map(c => c.id))
      this.categories.push({
        id: max + 1,
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
      this.levels.push({
        id: max + 1,
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
    }
  }
}
</script>

<style scoped>
.deleteBtn {
  margin: 9.5px 0px;
}
</style>
