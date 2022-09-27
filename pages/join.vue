<template>
  <NerdCenterContainer>
    <div class="flex flex-col justify-center text-center">
      <NerdInput v-model="roomCode" placeholder="Code eingeben" />
      <small v-if="notFound" class="text-red-600">Raum nicht gefunden!</small>
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
      roomCode: '',
      notFound: false
    }
  },
  head () {
    return {
      title: 'Spiel beitreten'
    }
  },
  beforeMount () {
    socket.on('room-not-found', () => {
      this.notFound = true
    })
    socket.on('room-joined', (code) => {
      socket.code = code
      this.$router.push({ name: 'board' })
    })
  },
  methods: {
    joinRoom () {
      if (this.roomCode !== '') {
        socket.emit('join-room', this.roomCode)
      }
    }
  }
}
</script>
