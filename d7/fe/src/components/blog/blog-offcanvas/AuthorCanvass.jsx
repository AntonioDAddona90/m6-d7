import React, { useState, useContext } from "react";

import { Offcanvas, Form, Button } from "react-bootstrap";

import { SelectedAuthorContext } from "../../../context/SelectedAuthorContext";
import { CanvassContext } from "../../../context/CanvassContext";

import axios from "axios";

const AuthorCanvass = ({ fetchAuthors }) => {
  const { selectedAuthor, setSelectedAuthor } = useContext(SelectedAuthorContext);

  const { showCanvass, setShowCanvass } = useContext(CanvassContext);
  const handleCanvassClose = () => {
    setShowCanvass(false);
    setSelectedAuthor(null);
  };

  const [newAuthorData, setNewAuthorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  });

  const resetFormData = () => {
    setNewAuthorData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthDate: "",
    });
    setFile(null);
  };

  const [file, setFile] = useState(null);
  // console.log(file);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const avatarData = new FormData();
    avatarData.append("avatar", file);

    try {
      const response = await axios.post(
        "http://localhost:5050/authors/cloudUploadAvatar",
        avatarData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Avatar upload error occurs: ", error);
    }
  };

  const handleAddNewAuthor = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        const uploadedFile = await uploadFile(file);

        if (uploadedFile) {
          const authorFormData = {
            ...newAuthorData,
            avatar: uploadedFile.avatar,
          };

          const response = await axios.post("http://localhost:5050/authors/create", authorFormData);

          handleCanvassClose();
          resetFormData();
          fetchAuthors();
          return response.data;
        } else {
          console.error("file upload failed");
        }
      } catch (error) {
        console.log("Error occurs creating a new author: ", error);
      }
    } else {
      console.error("Please select the image for avatar field to upload the form!");
    }
  };

  const handleEditAuthor = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5050/authors/${selectedAuthor._id}`, newAuthorData, {
        headers: { "Content-Type": "application/json" },
      });

      setNewAuthorData({
        firstName: selectedAuthor.firstName,
        lastName: selectedAuthor.lastName,
        email: selectedAuthor.email,
        birthDate: selectedAuthor.birthDate,
        avatar: selectedAuthor.avatar,
      });
      handleCanvassClose();
      fetchAuthors();
    } catch (error) {
      console.log("Error occurs updating author details: ", error);
    }
  };

  return (
    <>
      <Offcanvas show={showCanvass} onHide={handleCanvassClose}>
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          {selectedAuthor ? (
            <h3 className="mb-5">Edit Author Details</h3>
          ) : (
            <h2 className="mb-5">Add a new Author</h2>
          )}
          <Form
            onSubmit={selectedAuthor ? handleEditAuthor : handleAddNewAuthor}
            encType="multipart/form-data"
          >
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                required
                name="firstName"
                value={
                  selectedAuthor
                    ? newAuthorData.firstName || selectedAuthor.firstName
                    : newAuthorData.firstName
                }
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
                value={
                  selectedAuthor
                    ? newAuthorData.lastName || selectedAuthor.lastName
                    : newAuthorData.lastName
                }
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
                value={
                  selectedAuthor ? newAuthorData.email || selectedAuthor.email : newAuthorData.email
                }
                onChange={(e) => setNewAuthorData({ ...newAuthorData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Choose a Password"
                required
                name="password"
                value={
                  selectedAuthor
                    ? newAuthorData.password || selectedAuthor.password
                    : newAuthorData.password
                }
                onChange={(e) => setNewAuthorData({ ...newAuthorData, password: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthDate">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                required
                name="birthDate"
                value={
                  selectedAuthor
                    ? newAuthorData.birthDate || selectedAuthor.birthDate
                    : newAuthorData.birthDate
                }
                onChange={(e) => setNewAuthorData({ ...newAuthorData, birthDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAvatar">
              <Form.Label>Choose an Avatar</Form.Label>
              <Form.Control
                type="file"
                placeholder="paste here URL of image"
                name="avatar"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Button variant="outline-success" type="submit" className="mt-5">
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AuthorCanvass;