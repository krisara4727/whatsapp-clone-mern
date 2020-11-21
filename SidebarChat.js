import React from 'react';
import './SidebarChat.css';
import { Avatar } from '@material-ui/core';
import axios from './axios';
import {Link, BrowserRouter} from 'react-router-dom';


function SidebarChat({id,name,addNewChat}) {

    const createNew = () => {
        const roomName = prompt("enter the name of the new chat");
        if(roomName){
            axios.post('/rooms/new',{
                name:roomName
            })

        }
    }


    return !addNewChat ? (
        <BrowserRouter>
                <Link to={`/rooms/${id}`}>
                    <div className="sidebarChat">
                        <Avatar />
                        <div className='sidebarChat_info'>
                            <h2>{name}</h2>
                            <p>This is the last msg.</p>
                        </div>
                    </div>
                </Link> 
        </BrowserRouter>           
       ) :
       (
            <div onClick={createNew} className="sidebarChat">
                <h1>Add new chat</h1>
            </div>
        )
        
}

export default SidebarChat
