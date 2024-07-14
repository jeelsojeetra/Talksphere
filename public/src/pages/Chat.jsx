import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded,setisLoaded] = useState(false);  // ad this by own 


  // check if current user is awailable in local storafe or not 
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
      setisLoaded(true);
    }
  }, []);

 // current user 
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      // global map ma current user id add thay
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

    // jo current user awailable than fatch the api of :=> getalluser
  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        //get all users 
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        // if avtar is not set of current user than navigate to setavatar
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
// function to hanlde current chat  :=> when click on any chat than call  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          {/* pass the all contacts and currentchat props into contacts components   */}
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {/* if chat not selected than show welcome else show chatcontainer  */}
          { isLoaded && currentChat === undefined ? (
            // call the welcome components 
            <Welcome currentuser={currentUser} />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #1e1e2f;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #2b2b3a;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

