import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    createUser().then((data) => {
      props.setToken(data.access_token);
      localStorage.setItem("token", JSON.stringify(data.access_token));
      history.push("/");
    });
  }

  async function createUser() {
    const formData = {
      username: username,
      password: password,
    };

    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    return data;
  }
  return (
    <Container className="border-container">
      <Row>
        <Col>
          <h1 className="registration-header">
            Register to keep yourself organized!
          </h1>
          <Container className="registration-container">
            <form onSubmit={handleSubmit}>
              <p>
                Username{" "}
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
              </p>
              <p>
                Password{" "}
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </p>
              <div className="button-div">
                <p>
                  <button className="registration-button">Register</button>
                </p>
              </div>

              <p>
                Already have an account? <Link to="/login"> Login here!</Link>
              </p>
            </form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
