import React from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Logout(props) {
  const history = useHistory();

  function logOutUser() {
    localStorage.removeItem("token");
    history.push("/login");
  }
  return (
    <Button className="logout-button" onClick={logOutUser}>
      Logout
    </Button>
  );
}

export default Logout;
