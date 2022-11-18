import React, { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'

// connect front-end to back-end
const socket = io.connect('http://localhost:3001/')

export default function App() {
    const [username, setUsername] = useState('')
    const [room, setRoom] = useState('')
    const [showChat, setShowChat] = useState(false)

    // form validation (disallow empty value) when join room
    const joinRoom = () => {
        if (username !== '' && room !== '') {
            socket.emit('join_room', room)
            setShowChat(true) // show chatbox only only when connected to a room
        }
    }

    return (
        <div className='app'>
            {!showChat ? (
                <div className='app__chatBox'>
                    <h3>Join Chat</h3>
                    <input
                        type='text'
                        placeholder='Username.'
                        onChange={(event) => {
                            setUsername(event.target.value)
                        }}
                    />
                    <input
                        type='text'
                        placeholder='Room Id'
                        onChange={(event) => {
                            setRoom(event.target.value)
                        }}
                    />
                    <button onClick={joinRoom}>Enter Room</button>
                </div>
            ) : (
                <Chat socket={socket} username={username} room={room} />
            )}
        </div>
    )
}
