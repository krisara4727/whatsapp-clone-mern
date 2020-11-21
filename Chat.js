import React, { useState, useEffect } from 'react';
import "./Chat.css";
import { Avatar, IconButton } from '@material-ui/core';
import AttachFile from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import Pusher from 'pusher-js';
import { useParams } from 'react-router-dom';

function Chat() {
    const { roomId } = useParams();
    const [input, setInput] = useState("");
    const [roomName, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);

    // messages data
useEffect(() => {
    axios.get(`/messages/${roomId}/sync`)
    .then(response =>{
        const Data = response.data;
      Data.map((datas) => {
          if (datas.nameId===roomId){
              setRoomName(datas.name);
              setMessages([...messages,datas]);
            }
        })
    })
  }, [roomId])

  useEffect(() => {
      axios.get(`/rooms/sync`).then(res =>{
          console.log('sdkfjksd     ',res.data);
          const Rooms=res.data;
          Rooms.map((Room) =>{
            if (Room._id===roomId){
                console.log('room name ',Room.name);
                setRoomName(Room.name);
            }
          })
          
      })
  }, [roomId])
  useEffect(() => {
    const pusher = new Pusher('1037de3504ae4e390190', {
      cluster: 'ap2'
    });
  
    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages,newMessage])
    });
    return (() => {
      channel.unbind_all();
      channel.unsubscribe();
    })
  },[messages])


    const sendMessage = async (e) =>{
        e.preventDefault();
        await axios.post(`/messages/${roomId}/new`,{
            nameId:roomId,
            message:input,
            name:"krishna",
            
            timestamp: new Intl.DateTimeFormat('en-US', 
            {year: 'numeric', 
            month: '2-digit',
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit'})
            .format(Date.now()),
            received: true
        });
        setInput("");
    }

    useEffect(() => {
        const pusher = new Pusher('1037de3504ae4e390190', {
          cluster: 'ap2'
        });
      
        var channel1 = pusher.subscribe('chatRooms');
        return (() => {
          channel1.unbind_all();
          channel1.unsubscribe();
        })
      },[])
    return (
        <div className="chat">
            <div className='chat_header'>
                <Avatar />
                <div className='chat_headerInfo'>
                    <h2>{roomName}</h2>
                    <p> timestamp</p>
                </div>
                <div className='chat_headerRight'>
                <IconButton>
                    <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className='chat_body'>
                {messages.map((message) => (
                    <p 
                        className={`chat_message ${message.received && "chat_receiver"}`}
                    >
                    <span className='chat_name'>{ message.name} </span>
                    { message.message}
                    <span className='chat_timestamp'>{ message.timestamp} </span>
                </p>
                ))}
            </div>
            <div className="chat_footer">
                <IconButton >
                    <InsertEmoticonIcon />
                </IconButton>
                <form>
                    <input value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        type="text" placeholder="Type a message" />

                    <button onClick={sendMessage} type='submit' >Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
