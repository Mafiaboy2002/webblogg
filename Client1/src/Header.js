import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Header() {
 const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(()=>{
  fetch('http://localhost:4000/profile',{
    credentials:'include',
  }).then(response=>{
    response.json().then(userInfo =>{
        //console.log(userInfo);
     setUserInfo(userInfo);
    });
  });
    },[]);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        })
      setUserInfo(null);  
    }
    const username = userInfo?.username;
  return (
    
       <header>
       <Link to="/" className='logo'>CommuBlog</Link>
       <nav>
      {username && (
        <>
        <Link to="/create">Create New Post</Link>
        <button onClick={logout}> Logout </button>
        </>
      )}
      {!username &&(
        <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
        </>
      )}
      
    </nav>
      </header>
  
    
  )
  
}

export default Header
