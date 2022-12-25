// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'

export default ({ app }, inject) => {
  const socket = io(app.$config.wsUrl)
  inject('socket', socket)
}
