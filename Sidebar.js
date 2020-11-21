import React,{useState, useEffect} from 'react';
import "./Sidebar.css";
import  DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { IconButton, Avatar } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import SidebarChat from './SidebarChat';
import Axios from './axios';
import Pusher from 'pusher-js';


function Sidebar() {

    const [rooms,setRooms] = useState([]);

    // rooms data
      useEffect(() => {
        console.log('insedie use effect');
        Axios.get('/rooms/sync')
        .then(response =>{
          setRooms(response.data);
        })
      }, [])
    
      useEffect(() => {
        const pusher = new Pusher('1037de3504ae4e390190', {
          cluster: 'ap2'
        });
      
        var channel1 = pusher.subscribe('chatRooms');
        channel1.bind('inserted', function(newRoom) {
          alert(JSON.stringify(newRoom));
          setRooms([...rooms,newRoom])
        });
        return (() => {
          channel1.unbind_all();
          channel1.unsubscribe();
        })
      },[rooms])



    return (    
        <div className="sidebar">
            <div className="sidebar_header">
                <Avatar src='./image.png' />
                <div className="sidebar_headerRight">
                    <IconButton>
                    <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    <SearchOutlined></SearchOutlined>
                    <input placeholder="search or start new chat " type='text'></input>
                </div>
            </div>
            <div className="sidebar_chats">
                <SidebarChat addNewChat />
                {
                    rooms.map((room) => (
                        <SidebarChat key={room._id} id={room._id} name={room.name} />
                    ))
                }
                                
            </div>
            
        </div>
    )
}

export default Sidebar
