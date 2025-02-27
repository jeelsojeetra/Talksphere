// USE : logout button 
import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {

  const navigate = useNavigate();

  const handleClick = async () => {
    // fatch the currentuser id 
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;

    // fatch the data using current id 
    const data = await axios.get(`${logoutRoute}/${id}`);
    // clear data of current user from local storage and navigate to login page 
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }

  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );

}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
