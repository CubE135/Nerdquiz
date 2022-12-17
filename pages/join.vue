<template>
  <NerdCenterContainer>
    <div class="flex flex-col justify-center text-center">
      <NerdInput v-model="name" placeholder="Name eingeben" />
      <NerdInput v-model="roomCode" placeholder="Code eingeben" />
      <small v-if="error" class="text-red-600">{{ errorMsg }}</small>
      <NerdButton text="Beitreten" size="lg" @click="joinRoom" />
    </div>
  </NerdCenterContainer>
</template>

<script>
import socket from '~/plugins/socket.io.js'

export default {
  name: 'JoinPage',
  data () {
    return {
      name: '',
      roomCode: '',
      error: false,
      errorMsg: ''
    }
  },
  head () {
    return {
      title: 'Spiel beitreten'
    }
  },
  beforeMount () {
    socket.on('room-not-found', () => {
      this.error = true
      this.errorMsg = 'Raum nicht gefunden!'
    })
    socket.on('name-taken', () => {
      this.error = true
      this.errorMsg = 'Bitte wähle einen anderen Namen!'
    })
    socket.on('already-running', () => {
      this.error = true
      this.errorMsg = 'Das Spiel hat bereits begonnen!'
    })
    socket.on('room-joined', (code, board) => {
      socket.code = code
      this.$router.push({ name: 'board', params: { board } })
    })
  },
  mounted () {
    window.onpopstate = function () {
      socket.disconnect()
      socket.connect()
    }
  },
  methods: {
    joinRoom () {
      if (this.roomCode === '') {
        this.error = true
        this.errorMsg = 'Bitte code eingeben!'
        return
      }
      if (this.name === '') {
        this.error = true
        this.errorMsg = 'Bitte name eingeben!'
        return
      }
      socket.name = this.name
      this.error = false
      socket.emit('join-room', this.roomCode, this.name)
    }
  }
}
</script>
