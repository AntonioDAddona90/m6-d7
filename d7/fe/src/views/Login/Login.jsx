import React, { useContext, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./login.css";

import axios from "axios";

import { ThemeContext } from "../../context/themeContext";

import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";

const Login = () => {
  const { theme } = useContext(ThemeContext);

  const [loginFormData, setLoginFormData] = useState({});
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm((prevState) => !prevState);
  };

  const navigate = useNavigate();

  const [newAuthorData, setNewAuthorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  });

  const handleAddNewAuthor = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5050/authors/create", newAuthorData);

      setTimeout(() => {
        toggleLoginForm();
      }, 4000);

      return response.data;
    } catch (error) {
      console.log("Error occurs creating a new author: ", error);
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5050/login", loginFormData);

      if (response.data.token) {
        localStorage.setItem("userLoggedIn", JSON.stringify(response.data.token));
        navigate("/homepage");
      }
    } catch (error) {
      console.log("errore durante il login", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLoginWithGithub = () => {
    window.location.href = "http://localhost:5050/auth/github";
  };

  return (
    <>
      <Container
        style={{ paddingTop: "12rem", minHeight: "86vh" }}
        className={`d-flex justify-content-center ${theme === "light" ? "" : "text-light"}`}
      >
        <div className="login_register_wrapper ">
          <Form
            className={theme === "light" ? "loginForm" : "loginFormDarkTheme"}
            style={{
              transform: showLoginForm ? "translateX(0)" : "translateX(-40rem)",
              transition: "all 0.5s",
            }}
            onSubmit={loginSubmit}
          >
            <h2 className="mb-5">Login here!</h2>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                required
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="passwordInput">
                <Form.Control
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  placeholder="Password"
                  onChange={(e) =>
                    setLoginFormData({
                      ...loginFormData,
                      password: e.target.value,
                    })
                  }
                />
                <span className="passwordToggleIcon" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <FaEyeSlash style={{ color: "black" }} />
                  ) : (
                    <FaEye style={{ color: "black" }} />
                  )}
                </span>
              </div>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </div>

            <div className="text-center my-2">or</div>
            <div className="d-flex justify-content-center">
              <Button
                variant={theme === "light" ? "dark" : "outline-light"}
                onClick={handleLoginWithGithub}
                className="d-flex align-items-center gap-2 "
              >
                LOGIN with GitHub <FaGithub style={{ fontSize: "1.5rem" }} />
              </Button>
            </div>

            <div className="mt-4 text-end">
              Not a member? Join StriveBlog Community and{" "}
              <a href="#" onClick={toggleLoginForm}>
                Register Here
              </a>
            </div>
          </Form>

          {/*------------------------- FORM DI REGISTRAZIONE -------------------------*/}
          <Alert variant="success" className="alertRegisterSuccess">
            Congratulations! Your registration has been successfully completed. 🎉
          </Alert>
          <Form
            className={theme === "light" ? "registerForm" : "registerFormDarkTheme"}
            style={{
              transform: showLoginForm ? "translateX(5rem)" : "translateX(-37rem)",
              transition: "all 0.5s",
            }}
            onSubmit={handleAddNewAuthor}
          >
            <h2 className="mb-3">Register here!</h2>

            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                required
                name="firstName"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, firstName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                required
                name="lastName"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, lastName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                name="email"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="passwordInput">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Choose a Password"
                  required
                  name="password"
                  onChange={(e) => setNewAuthorData({ ...newAuthorData, password: e.target.value })}
                />
                <span className="passwordToggleIcon" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <FaEyeSlash style={{ color: "black" }} />
                  ) : (
                    <FaEye style={{ color: "black" }} />
                  )}
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthDate">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                required
                name="birthDate"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, birthDate: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register Now
            </Button>
            <div className="mt-4 text-end">
              Already a member? Please&nbsp;
              <a href="#" onClick={toggleLoginForm}>
                Sign In here
              </a>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default Login;