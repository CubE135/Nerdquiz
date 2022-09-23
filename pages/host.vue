<template>
  <NerdContainer>
    <h1 class="p-5 text-4xl text-center">
      RoomCode: aDasd67asd
    </h1>
    <div v-if="board.length > 0" class="flex justify-center text-center">
      <div v-for="category in board" :key="category.title" class="px-5 py-2 bg-gray-300">
        <p class="m-1">
          {{ category.title }}
        </p>
        <p v-for="question in category.questions" :key="question.value" class="w-32 py-2 m-1" :class="question.color">
          {{ question.level }}
        </p>
      </div>
    </div>
    <div v-else class="px-5 py-2 text-center bg-gray-300">
      Noch keine Kategorien!
    </div>
    <div class="flex justify-center">
      <NerdButton text="Kategorie hinzufügen" size="sm" @click="openModal('modalCategory')" />
      <NerdButton text="Level hinzufügen" size="sm" @click="openModal('modalLevel')" />
    </div>
    <NerdModal ref="modalCategory" title="Kategorie hinzufügen" @save="addNewCategory">
      <template #content>
        <NerdInput placeholder="Name eingeben" @input="setCategoryName" />
      </template>
    </NerdModal>
    <NerdModal ref="modalLevel" title="Level hinzufügen" @save="addNewLevel">
      <template #content>
        <NerdInput placeholder="Level eingeben" @input="setLevelAmount" />
      </template>
    </NerdModal>
  </NerdContainer>
</template>

<script>
export default {
  name: 'CreatePage',
  data () {
    return {
      categories: [],
      levels: [],
      players: [],
      questions: [],
      forms: {
        category: '',
        level: 0
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
          title: category,
          questions: this.levels.map((level, index) => {
            return {
              level,
              color: `bg-${color}-${index + 1}00`,
              question: {
                type: 'string',
                value: 'Firmen1'
              }
            }
          })
        }
      })
    }
  },
  methods: {
    openModal (ref) {
      this.$refs[ref].toggleModal()
    },
    setCategoryName (value) {
      this.forms.categoryName = value
    },
    addNewCategory () {
      this.categories.push(this.forms.categoryName)
    },
    setLevelAmount (value) {
      this.forms.level = value
    },
    addNewLevel () {
      this.levels.push(this.forms.level)
    }
  }
}
</script>
