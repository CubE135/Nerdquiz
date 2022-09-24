<template>
  <div>
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="relative w-auto max-w-6xl mx-auto my-6">
        <!--content-->
        <div class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
            <h3 class="text-2xl font-semibold">
              {{ title }}
            </h3>
            <button class="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none" @click="toggleModal()">
              <span class="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-50 focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div class="relative flex-auto p-6">
            <p class="text-lg leading-relaxed text-slate-500">
              <slot name="content" />
            </p>
          </div>
          <!--footer-->
          <div class="flex items-center justify-between p-6 border-t border-solid rounded-b border-slate-200">
            <button v-if="closeText" class="px-6 py-3 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear bg-transparent border border-red-500 border-solid rounded outline-none hover:bg-red-500 hover:text-white active:bg-red-600 focus:outline-none" type="button" @click="close()">
              {{ closeText }}
            </button>
            <button v-if="saveText" class="px-6 py-3 mb-1 mr-1 text-sm font-bold text-green-500 uppercase transition-all duration-150 ease-linear bg-transparent border border-green-500 border-solid rounded outline-none hover:bg-green-500 hover:text-white active:bg-green-600 focus:outline-none" type="button" @click="save()">
              {{ saveText }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-40 bg-black opacity-25" />
  </div>
</template>

<script>
export default {
  name: 'LargeModal',
  props: {
    title: {
      type: String,
      default: 'Modal Title',
      required: false
    },
    closeText: {
      type: String,
      default: 'Close',
      required: false
    },
    saveText: {
      type: String,
      default: 'Save',
      required: false
    }
  },
  data () {
    return {
      showModal: false
    }
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
    },
    close () {
      this.toggleModal()
      this.$emit('close')
    },
    save () {
      this.toggleModal()
      this.$emit('save')
    }
  }
}
</script>
