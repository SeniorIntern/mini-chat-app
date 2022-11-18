import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import './App.css'

export default function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')
    // store messages in a state
    const [messageList, setMessageList] = useState([])

    // use aync to make this function aynchronous. Wait for the message to be sent before updating "currentMessage"
    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ':' +
                    new Date(Date.now()).getMinutes(),
            }
            // when someone types the message emit the send_message event
            await socket.emit('send_message', messageData)
            setMessageList((list) => [...list, messageData]) // show messages in sender side as well.
            setCurrentMessage('') // clear message' input field after sending text. i.e after calling sendMessage() function.
        }
    }

    // listen for any changes (socket server)
    useEffect(() => {
        socket.on('receive_message', (data) => {
            // update new messages on old message list
            setMessageList((list) => [...list, data])
        })
    }, [socket])

    return (
        <div className='chat'>
            <div className='chat__head'>
                <p>Live Chat</p>
            </div>
            <div className='chat__body'>
                <ScrollToBottom className='chat__messageBody'>
                    {/* loop through messageList. each message i.e. messageContent */}
                    {messageList.map((messageContent) => {
                        return (
                            // set id as "you" for sender and "other" for receiver. set "you" if current author matches session author.
                            <div
                                className='message'
                                id={
                                    username === messageContent.author
                                        ? 'you'
                                        : 'other'
                                }
                            >
                                <div>
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        <p id='time'>{messageContent.time}</p>
                                        <p id='author'>
                                            {messageContent.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>

            <div className='chat__footer'>
                <input
                    type='text'
                    value={currentMessage}
                    placeholder='Message....'
                    onChange={(event) => {
                        setCurrentMessage(event.target.value)
                    }}
                    onKeyPress={(event) => {
                        event.key === 'Enter' && sendMessage()
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}
