import React from 'react';

function LoggedInName()
{
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var username = ud.username; 
    //var userId = ud.id;

    const doLogout = event => 
    {
    event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };    
  return(
   <div id="loggedInDiv">
   <span id="userName">Logged in as {username} </span><br />
   <button type="button" id="logoutButton" class="buttons" 
     onClick={doLogout}> Log Out </button>
   </div>
  );
};

export default LoggedInName;