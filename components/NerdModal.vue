<template>
  <div>
    <div v-if="showModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 class="text-2xl font-semibold">
              {{ title }}
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" @click="toggleModal()">
              <span class="bg-transparent text-black opacity-50 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto">
            <p class="text-slate-500 text-lg leading-relaxed">
              <slot name="content" />
            </p>
          </div>
          <!--footer-->
          <div class="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
            <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="close()">
              {{ closeText }}
            </button>
            <button class="text-green-500 bg-transparent border border-solid border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="save()">
              {{ saveText }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black" />
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
