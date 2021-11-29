import React from "react";
import { Link, useHistory } from "react-router-dom";

function Logout(props) {
  const history = useHistory();

  function logOutUser() {
    localStorage.removeItem("token");
    history.push("/login");
  }
  return <button onClick={logOutUser}>Logout</button>;
}

export default Logout;
