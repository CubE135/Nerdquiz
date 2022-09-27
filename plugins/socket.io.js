// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)

export default socket
